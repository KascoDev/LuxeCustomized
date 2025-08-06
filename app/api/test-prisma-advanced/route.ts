import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const results = {
    transactions: { status: 'unknown', details: null as any },
    aggregations: { status: 'unknown', details: null as any },
    complexQueries: { status: 'unknown', details: null as any },
    types: { status: 'unknown', details: null as any },
    overall: { status: 'unknown', message: '' }
  }

  try {
    // 1. Test Transactions
    console.log('Testing transactions...')
    
    const transactionResult = await db.$transaction(async (prisma) => {
      const category = await prisma.category.create({
        data: {
          name: 'Transaction Test Category',
          slug: 'transaction-test-' + Date.now(),
          description: 'Created in transaction'
        }
      })
      
      const product = await prisma.product.create({
        data: {
          title: 'Transaction Test Product',
          slug: 'transaction-product-' + Date.now(),
          description: 'Created in same transaction',
          price: 2999,
          canvaUrl: 'https://canva.com/test',
          images: [],
          tags: [],
          features: [],
          includes: [],
          categoryId: category.id
        }
      })
      
      return { category, product }
    })
    
    results.transactions = {
      status: 'success',
      details: {
        categoryCreated: transactionResult.category.id,
        productCreated: transactionResult.product.id,
        message: 'Transaction completed successfully'
      }
    }

    // 2. Test Aggregations
    console.log('Testing aggregations...')
    
    const aggregations = await db.product.aggregate({
      _count: { id: true },
      _avg: { price: true },
      _max: { price: true },
      _min: { price: true }
    })

    results.aggregations = {
      status: 'success',
      details: {
        totalProducts: aggregations._count.id,
        averagePrice: aggregations._avg.price,
        maxPrice: aggregations._max.price,
        minPrice: aggregations._min.price
      }
    }

    // 3. Test Complex Queries with includes and where clauses
    console.log('Testing complex queries...')
    
    const complexQuery = await db.category.findMany({
      include: {
        products: {
          where: {
            price: { gte: 2000 }
          },
          select: {
            id: true,
            title: true,
            price: true
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      },
      where: {
        name: { contains: 'Test' }
      }
    })

    results.complexQueries = {
      status: 'success',
      details: {
        categoriesFound: complexQuery.length,
        exampleCategory: complexQuery[0] ? {
          name: complexQuery[0].name,
          productCount: complexQuery[0]._count.products,
          expensiveProducts: complexQuery[0].products.length
        } : null
      }
    }

    // 4. Test TypeScript types (this validates the Prisma client generation)
    console.log('Testing TypeScript integration...')
    
    // This demonstrates that Prisma types are working properly
    const typeTest: {
      id: string;
      name: string;
      products: Array<{
        id: string;
        title: string;
        price: number;
      }>;
    }[] = await db.category.findMany({
      select: {
        id: true,
        name: true,
        products: {
          select: {
            id: true,
            title: true,
            price: true
          }
        }
      }
    })

    results.types = {
      status: 'success',
      details: {
        typeValidation: true,
        message: 'TypeScript types are properly generated and working'
      }
    }

    // Cleanup transaction test data
    await db.product.delete({ where: { id: transactionResult.product.id } })
    await db.category.delete({ where: { id: transactionResult.category.id } })

    // Overall assessment
    const allTests = [results.transactions, results.aggregations, results.complexQueries, results.types]
    const successCount = allTests.filter(test => test.status === 'success').length
    const allSuccessful = successCount === allTests.length

    results.overall = {
      status: allSuccessful ? 'success' : 'warning',
      message: allSuccessful 
        ? '🚀 Advanced Prisma features are fully operational!'
        : `⚠️ ${successCount}/${allTests.length} advanced tests passed.`
    }

    return NextResponse.json(results, { 
      status: allSuccessful ? 200 : 206 
    })

  } catch (error) {
    console.error('Advanced Prisma test error:', error)
    
    return NextResponse.json(
      { 
        error: 'Advanced Prisma test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        results 
      },
      { status: 500 }
    )
  }
}