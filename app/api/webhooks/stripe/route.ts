import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { sendEmail } from '@/lib/email'
import { db } from '@/lib/db'
import crypto from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Find the order
      const order = await db.order.findUnique({
        where: { stripeSessionId: session.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      })

      if (!order) {
        console.error('Order not found for session:', session.id)
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Update order status and payment intent
      await db.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          stripePaymentIntentId: session.payment_intent as string
        }
      })

      // Generate download token
      const downloadToken = crypto.randomBytes(32).toString('hex')
      const downloadExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      await db.order.update({
        where: { id: order.id },
        data: { downloadToken, downloadExpiry }
      })

      // Get product details
      const product = order.items[0]?.product
      if (!product) {
        console.error('No product found in order:', order.id)
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      // Send confirmation email
      try {
        await sendEmail({
          to: order.email,
          subject: `Your ${product.title} is ready for download!`,
          html: generateEmailHtml({
            customerEmail: order.email,
            productTitle: product.title,
            productCategory: product.category.name,
            orderTotal: (order.totalAmount / 100).toFixed(2),
            orderId: order.id.slice(-8).toUpperCase(),
            downloadUrl: product.canvaUrl,
            downloadExpiry: downloadExpiry.toLocaleDateString()
          })
        })

        console.log('Confirmation email sent to:', order.email)
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
        // Don't fail the webhook if email fails
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

function generateEmailHtml({
  customerEmail,
  productTitle,
  productCategory,
  orderTotal,
  orderId,
  downloadUrl,
  downloadExpiry
}: {
  customerEmail: string
  productTitle: string
  productCategory: string
  orderTotal: string
  orderId: string
  downloadUrl: string
  downloadExpiry: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your LuxeCustomized Template is Ready!</title>
</head>
<body style="font-family: 'Georgia', serif; line-height: 1.6; color: #57534e; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 40px; padding: 30px 0; background: linear-gradient(135deg, #f7f2ec 0%, #f9f5f0 100%); border-radius: 12px;">
    <h1 style="font-size: 36px; font-weight: 300; color: #8b7355; margin: 0; font-style: italic;">Luxe</h1>
    <p style="font-size: 14px; letter-spacing: 0.3em; color: #78716c; margin: 5px 0 0 0; text-transform: uppercase;">CUSTOMIZED</p>
  </div>

  <!-- Success Message -->
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="width: 60px; height: 60px; background: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
      <span style="color: #16a34a; font-size: 24px;">✓</span>
    </div>
    <h2 style="color: #1c1917; font-size: 28px; font-weight: 300; margin: 0 0 10px 0;">Thank You for Your Purchase!</h2>
    <p style="color: #78716c; font-size: 16px; margin: 0;">Your premium template is ready for download.</p>
  </div>

  <!-- Order Details -->
  <div style="background: #fafaf9; border-radius: 8px; padding: 24px; margin-bottom: 30px; border: 1px solid #e7e5e4;">
    <h3 style="color: #1c1917; font-size: 18px; font-weight: 500; margin: 0 0 16px 0;">Order Details</h3>
    
    <div style="margin-bottom: 12px;">
      <strong style="color: #1c1917;">Product:</strong> ${productTitle}
    </div>
    <div style="margin-bottom: 12px;">
      <strong style="color: #1c1917;">Category:</strong> ${productCategory}
    </div>
    <div style="margin-bottom: 12px;">
      <strong style="color: #1c1917;">Order #:</strong> ${orderId}
    </div>
    <div style="margin-bottom: 12px;">
      <strong style="color: #1c1917;">Total:</strong> $${orderTotal}
    </div>
    <div>
      <strong style="color: #1c1917;">Email:</strong> ${customerEmail}
    </div>
  </div>

  <!-- Download Section -->
  <div style="background: #1c1917; color: white; border-radius: 8px; padding: 24px; margin-bottom: 30px; text-align: center;">
    <h3 style="color: white; font-size: 18px; font-weight: 500; margin: 0 0 16px 0;">🎨 Your Template Awaits</h3>
    <p style="color: #d6d3d1; margin-bottom: 20px;">Click the button below to open your template in Canva and start customizing!</p>
    
    <a href="${downloadUrl}" style="display: inline-block; background: white; color: #1c1917; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-bottom: 16px;">
      Open in Canva →
    </a>
    
    <p style="color: #a8a29e; font-size: 12px; margin: 0;">Link expires on ${downloadExpiry}</p>
  </div>

  <!-- Instructions -->
  <div style="margin-bottom: 30px;">
    <h3 style="color: #1c1917; font-size: 18px; font-weight: 500; margin: 0 0 16px 0;">How to Use Your Template</h3>
    <ol style="color: #78716c; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Click "Open in Canva" above</li>
      <li style="margin-bottom: 8px;">The template will open in your Canva account</li>
      <li style="margin-bottom: 8px;">Customize colors, text, and images to match your brand</li>
      <li style="margin-bottom: 8px;">Download or share your finished design</li>
    </ol>
  </div>

  <!-- Footer -->
  <div style="border-top: 1px solid #e7e5e4; padding-top: 20px; text-align: center; color: #a8a29e; font-size: 12px;">
    <p style="margin: 0 0 8px 0;">Thank you for choosing LuxeCustomized</p>
    <p style="margin: 0;">Questions? Reply to this email or visit our support center.</p>
  </div>

</body>
</html>
  `
}