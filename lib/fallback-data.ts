// Fallback data to use when database is unavailable
export const fallbackProduct = {
  id: 'fallback-product',
  title: 'Premium Digital Template',
  slug: 'premium-digital-template',
  description: 'A beautiful, professionally designed template perfect for your business needs.',
  price: 2999, // $29.99
  originalPrice: 4999, // $49.99
  canvaUrl: 'https://canva.com/design/sample',
  images: ['/placeholder.svg'],
  featured: true,
  tags: ['business', 'professional', 'modern'],
  features: [
    'Easy to customize',
    'High-quality design',
    'Commercial license included',
    'Instant download'
  ],
  includes: [
    'Canva template link',
    'Usage instructions',
    'Commercial license',
    'Email support'
  ],
  status: 'ACTIVE' as const,
  category: {
    id: 'business',
    name: 'Business',
    slug: 'business'
  },
  _count: {
    orders: 25
  },
  createdAt: new Date(),
  updatedAt: new Date()
}

export const fallbackRelatedProducts = [
  {
    ...fallbackProduct,
    id: 'related-1',
    title: 'Social Media Pack',
    description: 'Complete social media template collection',
    price: 1999
  },
  {
    ...fallbackProduct,
    id: 'related-2', 
    title: 'Brand Identity Kit',
    description: 'Professional branding templates',
    price: 3999
  }
]