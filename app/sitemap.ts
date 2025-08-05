import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://luxecustomized.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  try {
    // Get all active products
    const products = await db.product.findMany({
      where: {
        status: 'ACTIVE'
      },
      select: {
        id: true,
        updatedAt: true,
        featured: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Get all categories with products
    const categories = await db.category.findMany({
      where: {
        products: {
          some: {
            status: 'ACTIVE'
          }
        }
      },
      select: {
        slug: true,
        updatedAt: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Product pages
    const productPages = products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: product.featured ? 0.9 : 0.7,
    }))

    // Category pages
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: category._count.products > 10 ? 0.8 : 0.6,
    }))

    return [...staticPages, ...productPages, ...categoryPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}