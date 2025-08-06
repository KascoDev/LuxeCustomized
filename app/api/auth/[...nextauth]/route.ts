// Bypass the Jest worker issue by implementing a minimal NextAuth wrapper
import { NextRequest, NextResponse } from 'next/server'

async function createMinimalHandler() {
  // Import NextAuth dynamically to avoid Jest worker issues
  const { default: NextAuth } = await import('next-auth')
  const { authOptions } = await import('@/lib/auth-simple')
  
  return NextAuth(authOptions)
}

let handler: any = null

export async function GET(req: NextRequest, context: any) {
  try {
    if (!handler) {
      handler = await createMinimalHandler()
    }
    return handler(req, context)
  } catch (error) {
    console.error('NextAuth GET error:', error)
    return NextResponse.json({}, { status: 200 })
  }
}

export async function POST(req: NextRequest, context: any) {
  try {
    if (!handler) {
      handler = await createMinimalHandler()
    }
    return handler(req, context)
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 400 })
  }
}