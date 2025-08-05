import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// API endpoint to get sitemap statistics and status
export async function GET() {
  try {
    const [productCount, categoryCount] = await Promise.all([
      db.product.count({
        where: { status: 'ACTIVE' }
      }),
      db.category.count({
        where: {
          products: {
            some: {
              status: 'ACTIVE'
            }
          }
        }
      })
    ])

    const siteInfo = {
      totalPages: 3 + productCount + categoryCount, // Static pages + products + categories
      lastUpdated: new Date().toISOString(),
      products: productCount,
      categories: categoryCount,
      staticPages: 3,
      sitemapUrl: `${process.env.NEXTAUTH_URL || 'https://luxecustomized.com'}/sitemap.xml`,
    }

    return NextResponse.json(siteInfo)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate sitemap info' },
      { status: 500 }
    )
  }
}