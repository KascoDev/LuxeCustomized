import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { z } from 'zod'
import crypto from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
})

const verifyOrderSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = verifyOrderSchema.parse(body)

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Find the order by Stripe session ID
    const order = await db.order.findUnique({
      where: { stripeSessionId: sessionId },
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
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order status to completed if not already
    if (order.status !== 'COMPLETED') {
      await db.order.update({
        where: { id: order.id },
        data: { 
          status: 'COMPLETED',
          stripePaymentIntentId: session.payment_intent as string
        }
      })
    }

    // Generate download token if not exists
    let downloadToken = order.downloadToken
    let downloadExpiry = order.downloadExpiry

    if (!downloadToken || !downloadExpiry || downloadExpiry < new Date()) {
      downloadToken = crypto.randomBytes(32).toString('hex')
      downloadExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      await db.order.update({
        where: { id: order.id },
        data: { downloadToken, downloadExpiry }
      })
    }

    // Get the product's Canva URL
    const product = order.items[0]?.product
    const downloadUrl = product?.canvaUrl

    return NextResponse.json({
      order: {
        ...order,
        downloadToken,
        downloadExpiry
      },
      downloadUrl
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Order verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify order' },
      { status: 500 }
    )
  }
}