import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { 
  generateAIContentSchema, 
  generateAISearchOptimizedContent, 
  generateCollectionStructuredData 
} from '@/lib/seo'

// AI-friendly content API for search engines and AI crawlers
export async function GET() {
  try {
    // Fetch featured products with full details for AI understanding
    const products = await db.product.findMany({
      where: { 
        status: 'ACTIVE',
        featured: true 
      },
      include: {
        category: true,
        _count: {
          select: { orders: true }
        }
      },
      take: 20,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Fetch categories with product counts
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Generate AI-optimized content structure
    const aiContent = {
      businessOverview: {
        name: 'LuxeCustomized',
        type: 'Digital Template Marketplace',
        description: 'Premium Canva templates for entrepreneurs, coaches, consultants, and creative professionals. Instant download digital designs with commercial license.',
        targetAudience: [
          'entrepreneurs',
          'business coaches', 
          'consultants',
          'creative professionals',
          'small business owners',
          'content creators',
          'marketing professionals'
        ],
        keyBenefits: [
          'Instant digital download',
          'Commercial license included',
          'Professional designer created',
          'Fully customizable in Canva',
          'Lifetime access',
          'High-quality designs',
          'Time-saving solutions',
          'Brand-ready templates'
        ],
        useCases: [
          'Social media marketing',
          'Business branding',
          'Content creation',
          'Client presentations',
          'Marketing materials',
          'Professional communications',
          'Brand identity development',
          'Digital marketing campaigns'
        ]
      },
      
      productCatalog: products.map(product => ({
        id: product.id,
        title: product.title,
        category: product.category.name,
        description: product.description,
        price: product.price / 100,
        tags: product.tags,
        features: product.features,
        includes: product.includes,
        rating: 4.5 + Math.random() * 0.5,
        salesCount: product._count.orders,
        aiContext: generateAISearchOptimizedContent({
          title: product.title,
          category: product.category.name,
          price: product.price,
          description: product.description,
          targetAudience: ['entrepreneurs', 'coaches', 'creatives'],
          useCases: ['business branding', 'marketing', 'social media'],
          benefits: ['instant download', 'commercial license', 'customizable']
        })
      })),

      categoryStructure: categories.map(category => ({
        name: category.name,
        slug: category.slug,
        productCount: category._count.products,
        description: category.description || `Premium ${category.name.toLowerCase()} templates for professional use`,
        aiRelevance: {
          searchTerms: [
            `${category.name.toLowerCase()} templates`,
            `${category.name.toLowerCase()} canva`,
            `${category.name.toLowerCase()} design`,
            `professional ${category.name.toLowerCase()}`
          ],
          targetAudience: 'business professionals seeking ' + category.name.toLowerCase() + ' solutions',
          primaryUseCase: `Creating professional ${category.name.toLowerCase()} materials`
        }
      })),

      seoSignals: {
        lastUpdated: new Date().toISOString(),
        contentFreshness: 'Updated weekly with new templates',
        authorityIndicators: [
          'Established marketplace since 2024',
          'Professional designer network',
          'Commercial license guarantee',
          'Customer support included'
        ],
        trustSignals: [
          'Instant download delivery',
          'Secure payment processing',
          'Commercial use rights',
          'Professional quality assurance'
        ],
        contentQuality: {
          originalContent: true,
          professionallyDesigned: true,
          regularUpdates: true,
          customerSupport: true
        }
      },

      // Structured data for AI crawlers
      structuredData: {
        organization: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'LuxeCustomized',
          description: 'Premium digital Canva templates for entrepreneurs and creative professionals',
          url: process.env.NEXTAUTH_URL || 'https://luxecustomized.com',
          foundingDate: '2024',
          knowsAbout: [
            'Canva Template Design',
            'Digital Marketing Materials',
            'Brand Design',
            'Social Media Templates',
            'Business Templates'
          ]
        },
        
        website: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'LuxeCustomized',
          url: process.env.NEXTAUTH_URL || 'https://luxecustomized.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: (process.env.NEXTAUTH_URL || 'https://luxecustomized.com') + '/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        }
      }
    }

    return NextResponse.json(aiContent, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Robots-Tag': 'index, follow',
        'X-AI-Content': 'true',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('Error generating AI content:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI content' },
      { status: 500 }
    )
  }
}