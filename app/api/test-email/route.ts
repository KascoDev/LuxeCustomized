import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { to, type } = await request.json()

    if (!to) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    let result
    
    if (type === 'order') {
      // Test order confirmation email
      result = await sendEmail({
        to,
        subject: 'Test Order Confirmation - LuxeCustomized',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Test Order Confirmation</h1>
            <p>This is a test email to verify that Nodemailer + Gmail SMTP is working correctly.</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h2>Order #TEST12345</h2>
              <p><strong>Product:</strong> Test Template</p>
              <p><strong>Category:</strong> Test Category</p>
              <p><strong>Total:</strong> $19.99</p>
            </div>
            <p>If you receive this email, the integration is working!</p>
          </div>
        `,
      })
    } else {
      // Test simple email
      result = await sendEmail({
        to,
        subject: 'Test Email - LuxeCustomized',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Email Test Successful!</h1>
            <p>Your Nodemailer + Gmail SMTP integration is working correctly.</p>
            <p>Sent from LuxeCustomized e-commerce platform.</p>
          </div>
        `,
        text: 'Email Test Successful! Your Nodemailer + Gmail SMTP integration is working correctly.',
      })
    }

    if (result.success) {
      return NextResponse.json({ 
        message: 'Email sent successfully!', 
        messageId: result.messageId 
      })
    } else {
      return NextResponse.json({ 
        error: 'Failed to send email', 
        details: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}