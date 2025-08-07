import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db.product.findUnique({
      where: { 
        id,
        status: 'ACTIVE'
      },
      include: {
        category: true,
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        status: 'ACTIVE',
        id: { not: id }
      },
      include: {
        category: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      take: 4,
      orderBy: {
        featured: 'desc'
      }
    })

    return NextResponse.json({ product, relatedProducts })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}