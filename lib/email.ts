import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"LuxeCustomized" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Template helpers for common email types
export const emailTemplates = {
  orderConfirmation: (orderDetails: {
    orderId: string
    customerName: string
    items: Array<{ name: string; quantity: number; price: number }>
    total: number
  }) => ({
    subject: `Order Confirmation - ${orderDetails.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Thank you for your order!</h1>
        <p>Hi ${orderDetails.customerName},</p>
        <p>Your order has been confirmed. Here are the details:</p>
        
        <h2>Order #${orderDetails.orderId}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Item</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #dee2e6;">Qty</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails.items.map(item => `
              <tr>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${item.name}</td>
                <td style="padding: 12px; text-align: center; border: 1px solid #dee2e6;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">$${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background-color: #f8f9fa; font-weight: bold;">
              <td style="padding: 12px; border: 1px solid #dee2e6;" colspan="2">Total</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #dee2e6;">$${orderDetails.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <p>We'll send you another email when your order ships.</p>
        <p>Thanks for choosing LuxeCustomized!</p>
      </div>
    `,
  }),

  contactForm: (formData: {
    name: string
    email: string
    message: string
  }) => ({
    subject: `New Contact Form Message from ${formData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          ${formData.message.replace(/\n/g, '<br>')}
        </div>
      </div>
    `,
  }),

  passwordReset: (resetData: {
    name: string
    resetUrl: string
  }) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Password Reset Request</h1>
        <p>Hi ${resetData.name},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetData.resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `,
  }),
}