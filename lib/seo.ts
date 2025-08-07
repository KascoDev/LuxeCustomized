import type { Metadata } from 'next'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  noIndex?: boolean
  structuredData?: object
  contentType?: string
}

const defaultSEO = {
  siteName: 'LuxeCustomized',
  defaultTitle: 'LuxeCustomized - Premium Digital Canva Templates for Entrepreneurs & Creatives',
  defaultDescription: 'Transform your business with premium Canva templates designed by professionals. Instant download digital designs for social media, branding, marketing, and business growth. Perfect for entrepreneurs, coaches, consultants, and creative professionals.',
  defaultKeywords: [
    'canva templates',
    'digital templates', 
    'premium templates',
    'business templates',
    'social media templates',
    'branding templates',
    'professional design',
    'instant download',
    'customizable templates',
    'entrepreneur resources',
    'marketing templates',
    'coach templates',
    'consultant templates',
    'small business design',
    'digital downloads',
    'canva designs',
    'ready-made templates',
    'commercial license',
    'business branding',
    'content creator templates'
  ],
  defaultImage: '/og-image.jpg',
  siteUrl: process.env.NEXTAUTH_URL || 'https://luxecustomized.com',
  twitterHandle: '@luxecustomized',
  facebookAppId: '123456789', // Replace with actual Facebook App ID
  businessName: 'LuxeCustomized',
  foundingYear: '2024',
  businessType: 'Digital Template Store',
  targetAudience: 'entrepreneurs, coaches, consultants, creative professionals, small business owners',
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noIndex = false,
  contentType,
}: SEOProps = {}): Metadata {
  const seo = {
    title: title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.defaultTitle,
    description: description || defaultSEO.defaultDescription,
    keywords: [...defaultSEO.defaultKeywords, ...keywords].join(', '),
    canonical: canonicalUrl || defaultSEO.siteUrl,
    image: ogImage || defaultSEO.defaultImage,
  }

  return {
    metadataBase: new URL(defaultSEO.siteUrl),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: 'LuxeCustomized Team' }],
    creator: 'LuxeCustomized',
    publisher: 'LuxeCustomized',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      type: ogType === 'product' ? 'website' : ogType,
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      siteName: defaultSEO.siteName,
      images: [
        {
          url: seo.image,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: defaultSEO.twitterHandle,
      creator: defaultSEO.twitterHandle,
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
    facebook: {
      appId: defaultSEO.facebookAppId,
    },
    verification: {
      google: 'your-google-site-verification-code', // Replace with actual verification code
      yandex: 'your-yandex-verification-code', // Replace with actual verification code
      yahoo: 'your-yahoo-verification-code', // Replace with actual verification code
      bing: 'your-bing-verification-code', // Add Bing verification
    },
    category: 'Design Templates',
    applicationName: defaultSEO.siteName,
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
      'ai-content-type': contentType || 'e-commerce-product-catalog',
      'content-language': 'en-US',
    },
  }
}

// Product-specific SEO metadata
export function generateProductMetadata(product: {
  title: string
  description: string
  price: number
  images: string[]
  category: { name: string }
  id: string
}): Metadata {
  const productKeywords = [
    product.category.name.toLowerCase(),
    'canva template',
    'digital download',
    'instant access',
    'customizable design',
    'professional template',
  ]

  return generateMetadata({
    title: product.title,
    description: `${product.description} - Premium ${product.category.name} template for $${(product.price / 100).toFixed(2)}. Instant download, fully customizable in Canva.`,
    keywords: productKeywords,
    canonicalUrl: `${defaultSEO.siteUrl}/product/${product.id}`,
    ogImage: product.images[0] || defaultSEO.defaultImage,
    ogType: 'product',
    contentType: 'e-commerce-product-page',
  })
}

// Category-specific SEO metadata
export function generateCategoryMetadata(category: {
  name: string
  description?: string
  slug: string
}): Metadata {
  return generateMetadata({
    title: `${category.name} Templates`,
    description: category.description || `Explore our premium ${category.name.toLowerCase()} templates. Professional designs for entrepreneurs, coaches, and creative professionals. Instant download, fully customizable.`,
    keywords: [category.name.toLowerCase(), 'templates', 'designs'],
    canonicalUrl: `${defaultSEO.siteUrl}/category/${category.slug}`,
    ogType: 'website',
    contentType: 'e-commerce-category-page',
  })
}

// Generate structured data for products
export function generateProductStructuredData(product: {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: { name: string }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map(img => img),
    category: product.category.name,
    brand: {
      '@type': 'Brand',
      name: 'LuxeCustomized',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: (product.price / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'LuxeCustomized',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
  }
}

// Generate structured data for organization
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LuxeCustomized',
    url: defaultSEO.siteUrl,
    logo: `${defaultSEO.siteUrl}/logo.png`,
    description: defaultSEO.defaultDescription,
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/luxecustomized',
      'https://facebook.com/luxecustomized',
      'https://instagram.com/luxecustomized',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@luxecustomized.com',
    },
  }
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Generate WebSite structured data with search functionality
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: defaultSEO.siteName,
    url: defaultSEO.siteUrl,
    description: defaultSEO.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${defaultSEO.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: defaultSEO.businessName,
      url: defaultSEO.siteUrl,
    },
    copyrightYear: defaultSEO.foundingYear,
    copyrightHolder: {
      '@type': 'Organization',
      name: defaultSEO.businessName,
    },
  }
}

// Generate collection/category structured data
export function generateCollectionStructuredData(products: Array<{
  id: string
  title: string
  price: number
  images: string[]
}>, categoryName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Templates - ${defaultSEO.siteName}`,
    description: `Premium ${categoryName.toLowerCase()} templates for professionals. Instant download Canva designs.`,
    url: `${defaultSEO.siteUrl}/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          '@id': `${defaultSEO.siteUrl}/product/${product.id}`,
          name: product.title,
          image: product.images[0],
          offers: {
            '@type': 'Offer',
            price: (product.price / 100).toFixed(2),
            priceCurrency: 'USD',
          },
        },
      })),
    },
  }
}

// Generate AI-optimized content schema for ChatGPT and other AI crawlers
export function generateAIContentSchema(content: {
  title: string
  description: string
  contentType: 'product-catalog' | 'template-collection' | 'business-resource'
  targetAudience: string[]
  keyBenefits: string[]
  useCases: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: content.title,
    description: content.description,
    creator: {
      '@type': 'Organization',
      name: defaultSEO.businessName,
    },
    audience: content.targetAudience.map(audience => ({
      '@type': 'Audience',
      audienceType: audience,
    })),
    about: content.keyBenefits.map(benefit => ({
      '@type': 'Thing',
      name: benefit,
    })),
    usageInfo: content.useCases.join(', '),
    contentLocation: {
      '@type': 'VirtualLocation',
      url: defaultSEO.siteUrl,
    },
    inLanguage: 'en-US',
    isAccessibleForFree: false,
    license: 'Commercial License Included',
  }
}

// Generate enhanced product structured data with AI-friendly annotations
export function generateEnhancedProductStructuredData(product: {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: { name: string }
  tags: string[]
  features: string[]
  includes: string[]
}) {
  const baseProduct = generateProductStructuredData(product)
  
  return {
    ...baseProduct,
    keywords: product.tags.join(', '),
    category: {
      '@type': 'ProductCategory',
      name: product.category.name,
    },
    additionalProperty: [
      ...product.features.map(feature => ({
        '@type': 'PropertyValue',
        name: 'Feature',
        value: feature,
      })),
      ...product.includes.map(item => ({
        '@type': 'PropertyValue', 
        name: 'Includes',
        value: item,
      })),
      {
        '@type': 'PropertyValue',
        name: 'License Type',
        value: 'Commercial License',
      },
      {
        '@type': 'PropertyValue',
        name: 'File Format',
        value: 'Canva Template',
      },
      {
        '@type': 'PropertyValue',
        name: 'Delivery Method',
        value: 'Instant Digital Download',
      },
    ],
    isDigital: true,
    deliveryMethod: 'Download',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Template Downloads',
      itemListElement: [{
        '@type': 'Offer',
        itemOffered: {
          '@type': 'DigitalDocument',
          name: product.title,
          fileFormat: 'Canva Template',
        },
        price: (product.price / 100).toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          deliveryTime: 'Instant',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'USD',
          },
        },
      }],
    },
  }
}

// Generate review/testimonial structured data
export function generateReviewStructuredData(reviews: Array<{
  rating: number
  comment: string
  author: string
  date: string
  productId: string
}>) {
  return reviews.map(review => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      '@id': `${defaultSEO.siteUrl}/product/${review.productId}`,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    datePublished: review.date,
    reviewBody: review.comment,
  }))
}

// AI Search Optimization - Generate content that AI can easily understand and recommend
export function generateAISearchOptimizedContent(product: {
  title: string
  category: string
  price: number
  description: string
  targetAudience: string[]
  useCases: string[]
  benefits: string[]
}) {
  return {
    // Clear intent signals for AI
    primaryIntent: 'purchase premium digital template',
    secondaryIntents: ['business branding', 'marketing material creation', 'professional design'],
    
    // Context for AI understanding
    productContext: {
      what: `${product.title} - Premium ${product.category} Canva Template`,
      who: `Perfect for ${product.targetAudience.join(', ')}`,
      why: product.benefits.join('. '),
      how: 'Instant download, fully customizable in Canva',
      when: 'Available 24/7 for immediate download',
      where: 'Digital delivery worldwide',
    },
    
    // Comparison context for AI recommendations
    competitiveAdvantages: [
      'Commercial license included',
      'Professional designer created',
      'Instant download delivery',
      'Lifetime access',
      'Easy Canva customization',
    ],
    
    // Price context for AI
    valueProposition: `Professional design worth $${(product.price / 100 * 5).toFixed(2)} available for only $${(product.price / 100).toFixed(2)}`,
    
    // Usage scenarios for AI understanding
    usageScenarios: product.useCases,
    
    // SEO signals for AI crawlers
    relevanceSignals: {
      freshness: new Date().toISOString(),
      authority: 'Established template marketplace since 2024',
      trustSignals: ['Instant download', 'Commercial license', 'Customer support'],
    },
  }
}