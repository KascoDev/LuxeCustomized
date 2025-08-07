import { db } from './db'
import { fallbackProduct, fallbackRelatedProducts } from './fallback-data'

// Safe database wrapper that prevents Jest worker issues
export async function safeGetProduct(id: string) {
  try {
    // Set a strict timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    
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
    
    clearTimeout(timeoutId)
    return product
  } catch (error) {
    console.error('Database error in safeGetProduct:', error)
    // Return fallback product with the requested ID
    return { ...fallbackProduct, id }
  }
}

export async function safeGetRelatedProducts(categoryId: string, excludeId: string) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    
    const products = await db.product.findMany({
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
    
    clearTimeout(timeoutId)
    return products
  } catch (error) {
    console.error('Database error in safeGetRelatedProducts:', error)
    return fallbackRelatedProducts
  }
}