import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // If user is not admin, redirect to login
    if (req.nextUrl.pathname.startsWith('/admin') && 
        req.nextauth.token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        
        // For admin pages, check if user is admin
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}