import { NextRequest, NextResponse } from 'next/server'
import { signInAdmin, signOutAdmin, getAdminSession } from '@/lib/auth-supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json()
    
    if (action === 'signout') {
      const { error } = await signOutAdmin()
      
      if (error) {
        return NextResponse.json({ 
          error: 'Sign out failed' 
        }, { status: 500 })
      }
      
      return NextResponse.json({ success: true })
    }
    
    // Default action is sign in
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 })
    }
    
    const { user, error } = await signInAdmin(email, password)
    
    if (error) {
      return NextResponse.json({ 
        error: error.message || 'Authentication failed' 
      }, { status: 401 })
    }
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication failed' 
      }, { status: 401 })
    }
    
    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json({ 
      error: 'Authentication failed' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { user, error } = await getAdminSession()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    
    if (!user) {
      return NextResponse.json({ user: null })
    }
    
    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ user: null })
  }
}