import { createClient } from '@/lib/supabase-server'
import type { AdminUser } from '@/lib/auth-supabase'

export interface AuthSession {
  user: AdminUser
}

// Server-side authentication for API routes
export async function getAuthSession(): Promise<AuthSession | null> {
  const supabase = createClient()
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) {
      return null
    }

    const { user } = session

    // Check if user has admin role
    const isAdmin = user.user_metadata?.role === 'admin'
    if (!isAdmin) {
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || 'Admin',
        role: 'admin'
      }
    }

  } catch (error) {
    console.error('Server auth session error:', error)
    return null
  }
}
