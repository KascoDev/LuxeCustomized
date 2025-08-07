import { notFound } from 'next/navigation'
import { generateProductMetadata, generateProductStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo'
import { StructuredData } from '@/components/seo/StructuredData'
import ProductClient from './ProductClient'
import { safeGetProduct, safeGetRelatedProducts } from '@/lib/safe-db'

// Force dynamic rendering to avoid Jest worker issues
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

interface Props {
  params: Promise<{ id: string }>
}


export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await safeGetProduct(id)
  
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
  
  // Use safe database functions with built-in fallbacks
  const product = await safeGetProduct(id)
  const relatedProducts = await safeGetRelatedProducts(product.category.id, product.id)
  
  if (!product) {
    notFound()
  }

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
// Temporarily disabled to debug Jest worker issue
// export async function generateStaticParams() {
//   try {
//     const products = await db.product.findMany({
//       where: {
//         status: 'ACTIVE',
//         featured: true
//       },
//       select: {
//         id: true
//       },
//       take: 50 // Generate static pages for top 50 featured products
//     })

//     return products.map((product) => ({
//       id: product.id,
//     }))
//   } catch (error) {
//     return []
//   }
// }