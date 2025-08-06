import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow access to login page without authentication
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    // For other admin pages, check if user is admin
    if (req.nextUrl.pathname.startsWith('/admin') && 
        req.nextauth.token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow access to login page
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        
        // For admin pages, require admin role
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        
        // Allow all other pages
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}