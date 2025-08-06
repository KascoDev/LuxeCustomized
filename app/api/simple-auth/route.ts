import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Simple credential check
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD_HASH // Use env variable
    
    console.log('Auth attempt:', { email, adminEmail, password: password?.substring(0, 3) + '...', adminPassword: adminPassword?.substring(0, 3) + '...' })
    
    if (email === adminEmail && password === adminPassword) {
      // Set a simple session cookie
      const cookieStore = cookies()
      cookieStore.set('admin-session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      
      return NextResponse.json({ 
        success: true,
        user: { email, name: 'Admin' }
      })
    }
    
    return NextResponse.json({ 
      error: 'Invalid credentials' 
    }, { status: 401 })
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Authentication failed' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get('admin-session')
    
    if (session?.value === 'authenticated') {
      return NextResponse.json({
        user: { email: process.env.ADMIN_EMAIL, name: 'Admin' }
      })
    }
    
    return NextResponse.json({})
  } catch (error) {
    return NextResponse.json({})
  }
}