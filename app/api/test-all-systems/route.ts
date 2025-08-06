import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  const results = {
    database: { status: 'unknown', details: null as any },
    email: { status: 'unknown', details: null as any },
    overall: { status: 'unknown', message: '' }
  }

  // Test Database Connection
  try {
    const dbTest = await db.$executeRaw`SELECT 1 as test`
    results.database = { 
      status: 'success', 
      details: { connected: true, result: dbTest } 
    }
  } catch (error) {
    results.database = { 
      status: 'error', 
      details: error instanceof Error ? error.message : 'Unknown database error' 
    }
  }

  // Test Email System  
  try {
    const emailTest = await sendEmail({
      to: 'test@example.com',
      subject: 'System Test - LuxeCustomized',
      html: '<p>This is a test email from your e-commerce platform.</p>',
      text: 'This is a test email from your e-commerce platform.'
    })
    results.email = { 
      status: emailTest.success ? 'success' : 'error', 
      details: emailTest 
    }
  } catch (error) {
    results.email = { 
      status: 'error', 
      details: error instanceof Error ? error.message : 'Unknown email error' 
    }
  }

  // Overall Status
  const allSystemsWorking = results.database.status === 'success' && results.email.status === 'success'
  results.overall = {
    status: allSystemsWorking ? 'success' : 'partial',
    message: allSystemsWorking 
      ? '🎉 All systems operational! Your LuxeCustomized e-commerce platform is ready!'
      : '⚠️ Some systems need attention. Check individual component status.'
  }

  return NextResponse.json(results, { 
    status: allSystemsWorking ? 200 : 206 
  })
}