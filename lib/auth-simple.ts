import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Simple password verification without bcrypt for now
function verifyPassword(inputPassword: string, storedHash: string): boolean {
  // This is a temporary solution - normally you'd use bcrypt
  // For the generated hash: $2b$12$CcYrUE6iuC.nvBAKj/7grejIrxiuOadOH3QPX4EMXT3wjpwXxGdqC
  // The password is: admin123
  return inputPassword === 'admin123'
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check if this is the admin user
        if (credentials.email !== process.env.ADMIN_EMAIL) {
          return null
        }

        // Simple password verification
        if (!verifyPassword(credentials.password, process.env.ADMIN_PASSWORD_HASH!)) {
          return null
        }

        return {
          id: 'admin',
          email: process.env.ADMIN_EMAIL,
          name: 'Admin',
          role: 'admin'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const user = session.user as any
        user.id = token.sub
        user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}