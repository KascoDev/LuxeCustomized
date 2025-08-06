import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'

export async function GET(request: NextRequest) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('Attempting to connect with URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    await client.connect()
    console.log('Connected successfully!')
    
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version')
    await client.end()
    
    return NextResponse.json({ 
      message: 'Database connection successful!', 
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Database connection error:', error)
    
    // Try to provide more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Database connection failed', 
          details: error.message,
          code: (error as any).code,
          errno: (error as any).errno,
          syscall: (error as any).syscall,
          hostname: (error as any).hostname,
          port: (error as any).port
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Unknown database error' },
      { status: 500 }
    )
  }
}