import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const results = {
    workflow: [] as Array<{step: string, status: string, details: any}>,
    overall: { status: 'unknown', message: '' }
  }

  try {
    // Step 1: Create a category
    results.workflow.push({
      step: 'Create Category',
      status: 'running',
      details: 'Creating product category...'
    })

    const category = await db.category.create({
      data: {
        name: 'Digital Templates',
        slug: 'digital-templates-' + Date.now(),
        description: 'Premium Canva templates for professionals',
        image: 'https://example.com/category-image.jpg'
      }
    })

    results.workflow[results.workflow.length - 1] = {
      step: 'Create Category',
      status: 'success',
      details: { id: category.id, name: category.name }
    }

    // Step 2: Create products
    results.workflow.push({
      step: 'Create Products',
      status: 'running',
      details: 'Creating sample products...'
    })

    const products = await Promise.all([
      db.product.create({
        data: {
          title: 'Social Media Template Pack',
          slug: 'social-media-pack-' + Date.now(),
          description: 'Complete social media template collection for Instagram, Facebook, and Twitter',
          price: 2999, // $29.99
          originalPrice: 4999, // $49.99
          canvaUrl: 'https://canva.com/templates/social-media',
          images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
          status: 'ACTIVE',
          featured: true,
          tags: ['social-media', 'instagram', 'facebook'],
          features: ['20 Templates', 'Easy to Edit', 'High Resolution'],
          includes: ['Canva Templates', 'PDF Guide', 'Color Palette'],
          categoryId: category.id
        }
      }),
      db.product.create({
        data: {
          title: 'Business Card Templates',
          slug: 'business-cards-' + Date.now(),
          description: 'Professional business card templates for entrepreneurs',
          price: 1499, // $14.99
          canvaUrl: 'https://canva.com/templates/business-cards',
          images: ['https://example.com/card1.jpg'],
          status: 'ACTIVE',
          featured: false,
          tags: ['business', 'cards', 'professional'],
          features: ['10 Designs', 'Print Ready', 'Multiple Formats'],
          includes: ['Canva Templates', 'Print Guide'],
          categoryId: category.id
        }
      })
    ])

    results.workflow[results.workflow.length - 1] = {
      step: 'Create Products',
      status: 'success',
      details: { count: products.length, products: products.map(p => ({ id: p.id, title: p.title, price: p.price })) }
    }

    // Step 3: Create a customer order
    results.workflow.push({
      step: 'Create Order',
      status: 'running',
      details: 'Processing customer order...'
    })

    const order = await db.order.create({
      data: {
        email: 'customer@example.com',
        status: 'PENDING',
        totalAmount: products[0].price, // First product price
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: products[0].price
            }
          ]
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    results.workflow[results.workflow.length - 1] = {
      step: 'Create Order',
      status: 'success',
      details: { 
        orderId: order.id, 
        email: order.email, 
        total: order.totalAmount,
        items: order.items.length
      }
    }

    // Step 4: Update order status (simulate payment completion)
    results.workflow.push({
      step: 'Process Payment',
      status: 'running',
      details: 'Simulating payment processing...'
    })

    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        status: 'COMPLETED',
        stripeSessionId: 'cs_test_' + Date.now(),
        stripePaymentIntentId: 'pi_test_' + Date.now()
      }
    })

    results.workflow[results.workflow.length - 1] = {
      step: 'Process Payment',
      status: 'success',
      details: { 
        orderId: updatedOrder.id, 
        status: updatedOrder.status,
        stripeSessionId: updatedOrder.stripeSessionId
      }
    }

    // Step 5: Query analytics (simulate admin dashboard)
    results.workflow.push({
      step: 'Analytics Query',
      status: 'running',
      details: 'Generating analytics...'
    })

    const analytics = await db.$transaction(async (prisma) => {
      const totalOrders = await prisma.order.count()
      const totalRevenue = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED' }
      })
      const topProducts = await prisma.product.findMany({
        include: {
          _count: {
            select: { orders: true }
          }
        },
        orderBy: {
          orders: { _count: 'desc' }
        },
        take: 3
      })
      
      return {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        topProducts: topProducts.map(p => ({
          title: p.title,
          orderCount: p._count.orders
        }))
      }
    })

    results.workflow[results.workflow.length - 1] = {
      step: 'Analytics Query',
      status: 'success',
      details: analytics
    }

    // Step 6: Cleanup test data
    results.workflow.push({
      step: 'Cleanup',
      status: 'running',
      details: 'Cleaning up test data...'
    })

    await db.orderItem.deleteMany({ where: { orderId: order.id } })
    await db.order.delete({ where: { id: order.id } })
    await db.product.deleteMany({ where: { categoryId: category.id } })
    await db.category.delete({ where: { id: category.id } })

    results.workflow[results.workflow.length - 1] = {
      step: 'Cleanup',
      status: 'success',
      details: 'Test data cleaned up successfully'
    }

    // Overall assessment
    const successfulSteps = results.workflow.filter(step => step.status === 'success').length
    const totalSteps = results.workflow.length

    results.overall = {
      status: successfulSteps === totalSteps ? 'success' : 'warning',
      message: successfulSteps === totalSteps 
        ? '🎉 Complete e-commerce workflow test passed! Prisma is production-ready!'
        : `⚠️ ${successfulSteps}/${totalSteps} workflow steps completed successfully.`
    }

    return NextResponse.json(results, { 
      status: successfulSteps === totalSteps ? 200 : 206 
    })

  } catch (error) {
    console.error('E-commerce workflow test error:', error)
    
    return NextResponse.json(
      { 
        error: 'E-commerce workflow test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        results 
      },
      { status: 500 }
    )
  }
}