import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  originalPrice: z.number().optional(),
  canvaUrl: z.string().url('Must be a valid URL'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  includes: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    const where: any = {}

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        _count: {
          select: { orders: true }
        }
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession(request)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    // Create slug from title
    const slug = validatedData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const product = await db.product.create({
      data: {
        ...validatedData,
        slug,
        images: validatedData.images || [],
        tags: validatedData.tags || [],
        features: validatedData.features || [],
        includes: validatedData.includes || [],
        status: validatedData.status || 'DRAFT',
        featured: validatedData.featured || false,
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}