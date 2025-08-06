import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { generateProductMetadata, generateProductStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo'
import { StructuredData } from '@/components/seo/StructuredData'
import ProductClient from './ProductClient'

interface Props {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  try {
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
    return product
  } catch (error) {
    return null
  }
}

async function getRelatedProducts(categoryId: string, excludeId: string) {
  try {
    const relatedProducts = await db.product.findMany({
      where: {
        categoryId,
        status: 'ACTIVE',
        id: { not: excludeId }
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
    return relatedProducts
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }

  return generateProductMetadata(product)
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)
  
  // Generate structured data
  const productStructuredData = generateProductStructuredData(product)
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: product.category.name, url: `/category/${product.category.slug}` },
    { name: product.title, url: `/product/${product.id}` }
  ])

  return (
    <>
      <StructuredData data={[productStructuredData, breadcrumbData]} />
      <ProductClient product={product} relatedProducts={relatedProducts} />
    </>
  )
}

// Generate static params for popular products (optional)
export async function generateStaticParams() {
  try {
    const products = await db.product.findMany({
      where: {
        status: 'ACTIVE',
        featured: true
      },
      select: {
        id: true
      },
      take: 50 // Generate static pages for top 50 featured products
    })

    return products.map((product) => ({
      id: product.id,
    }))
  } catch (error) {
    return []
  }
}