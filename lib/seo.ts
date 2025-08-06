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
}

const defaultSEO = {
  siteName: 'LuxeCustomized',
  defaultTitle: 'LuxeCustomized - Premium Digital Templates',
  defaultDescription: 'Exquisite digital templates for discerning creatives. Elevate your brand with our curated collection of premium Canva templates designed for entrepreneurs, coaches, and creative professionals.',
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
    'entrepreneur resources'
  ],
  defaultImage: '/og-image.jpg',
  siteUrl: process.env.NEXTAUTH_URL || 'https://luxecustomized.com',
  twitterHandle: '@luxecustomized',
  facebookAppId: '123456789', // Replace with actual Facebook App ID
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noIndex = false,
}: SEOProps = {}): Metadata {
  const seo = {
    title: title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.defaultTitle,
    description: description || defaultSEO.defaultDescription,
    keywords: [...defaultSEO.defaultKeywords, ...keywords].join(', '),
    canonical: canonicalUrl || defaultSEO.siteUrl,
    image: ogImage || defaultSEO.defaultImage,
  }

  return {
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
    },
    category: 'Design Templates',
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