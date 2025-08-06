import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const results = {
    connection: { status: 'unknown', details: null as any },
    schema: { status: 'unknown', details: null as any },
    crud: { status: 'unknown', details: null as any },
    relationships: { status: 'unknown', details: null as any },
    cleanup: { status: 'unknown', details: null as any },
    overall: { status: 'unknown', message: '' }
  }

  try {
    // 1. Test Basic Connection
    console.log('Testing Prisma connection...')
    const connectionTest = await db.$executeRaw`SELECT NOW() as current_time, version() as version`
    results.connection = { 
      status: 'success', 
      details: { message: 'Connection successful', result: connectionTest } 
    }

    // 2. Test Schema Integrity - Check if tables exist
    console.log('Testing schema integrity...')
    const tables = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    ` as Array<{table_name: string}>
    
    const expectedTables = ['Account', 'Session', 'User', 'VerificationToken', 'Category', 'Product', 'Order', 'OrderItem']
    const existingTables = tables.map(t => t.table_name)
    const missingTables = expectedTables.filter(table => !existingTables.includes(table))
    
    results.schema = { 
      status: missingTables.length === 0 ? 'success' : 'warning', 
      details: { 
        existing: existingTables, 
        expected: expectedTables,
        missing: missingTables 
      } 
    }

    // 3. Test CRUD Operations - Create a test category
    console.log('Testing CRUD operations...')
    
    // Create
    const testCategory = await db.category.create({
      data: {
        name: 'Test Category Prisma',
        slug: 'test-category-prisma-' + Date.now(),
        description: 'Test category for Prisma validation'
      }
    })
    
    // Read
    const foundCategory = await db.category.findUnique({
      where: { id: testCategory.id }
    })
    
    // Update  
    const updatedCategory = await db.category.update({
      where: { id: testCategory.id },
      data: { description: 'Updated test description' }
    })
    
    // Count
    const categoryCount = await db.category.count()
    
    results.crud = { 
      status: 'success', 
      details: { 
        created: testCategory.id,
        found: !!foundCategory,
        updated: updatedCategory.description === 'Updated test description',
        totalCategories: categoryCount
      } 
    }

    // 4. Test Relationships - Create product with category relationship
    console.log('Testing relationships...')
    
    const testProduct = await db.product.create({
      data: {
        title: 'Test Product Prisma',
        slug: 'test-product-prisma-' + Date.now(),
        description: 'Test product for relationship validation',
        price: 1999,
        canvaUrl: 'https://canva.com/test',
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        tags: ['test', 'prisma'],
        features: ['Feature 1', 'Feature 2'],
        includes: ['Template', 'Instructions'],
        categoryId: testCategory.id
      }
    })

    // Test relationship query
    const productWithCategory = await db.product.findUnique({
      where: { id: testProduct.id },
      include: { category: true }
    })

    const categoryWithProducts = await db.category.findUnique({
      where: { id: testCategory.id },
      include: { products: true }
    })

    results.relationships = { 
      status: 'success', 
      details: { 
        productCreated: testProduct.id,
        productHasCategory: !!productWithCategory?.category,
        categoryHasProduct: (categoryWithProducts?.products.length || 0) > 0,
        categoryName: productWithCategory?.category?.name
      } 
    }

    // 5. Cleanup test data
    console.log('Cleaning up test data...')
    await db.product.delete({ where: { id: testProduct.id } })
    await db.category.delete({ where: { id: testCategory.id } })
    
    results.cleanup = { 
      status: 'success', 
      details: { message: 'Test data cleaned up successfully' } 
    }

    // Overall assessment
    const allTests = [results.connection, results.schema, results.crud, results.relationships, results.cleanup]
    const successCount = allTests.filter(test => test.status === 'success').length
    const allSuccessful = successCount === allTests.length

    results.overall = {
      status: allSuccessful ? 'success' : 'warning',
      message: allSuccessful 
        ? '🎉 Prisma is fully operational! All tests passed.'
        : `⚠️ ${successCount}/${allTests.length} tests passed. Check individual results.`
    }

    return NextResponse.json(results, { 
      status: allSuccessful ? 200 : 206 
    })

  } catch (error) {
    console.error('Prisma test error:', error)
    
    // Try to cleanup in case of error
    try {
      // Attempt cleanup in case test data was created
      const testCategories = await db.category.findMany({
        where: { name: { contains: 'Test Category Prisma' } }
      })
      for (const cat of testCategories) {
        await db.product.deleteMany({ where: { categoryId: cat.id } })
        await db.category.delete({ where: { id: cat.id } })
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError)
    }

    return NextResponse.json(
      { 
        error: 'Prisma test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        results 
      },
      { status: 500 }
    )
  }
}