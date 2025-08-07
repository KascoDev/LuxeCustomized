import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateProductSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  originalPrice: z.number().optional(),
  canvaUrl: z.string().url('Must be a valid URL').optional(),
  categoryId: z.string().min(1, 'Category is required').optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  includes: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        orders: {
          include: {
            order: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession(request)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    // If title is being updated, update slug too
    const updateData = { ...validatedData } as any
    if (validatedData.title) {
      (updateData as any).slug = validatedData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    const product = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession(request)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // Check if product has orders
    const productWithOrders = await db.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!productWithOrders) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (productWithOrders._count.orders > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders' },
        { status: 400 }
      )
    }

    await db.product.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}