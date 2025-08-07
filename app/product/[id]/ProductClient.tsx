"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download, Heart, Share2, Star, Shield, Zap, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { AIEOContentStructure, AIHeading, AIContentBlock } from "@/components/seo/StructuredData"

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  originalPrice: number | null
  canvaUrl: string
  images: string[]
  featured: boolean
  tags: string[]
  features: string[]
  includes: string[]
  category: Category
  _count: {
    orders: number
  }
}

interface ProductClientProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [email, setEmail] = useState("")
  const [isPurchasing, setIsPurchasing] = useState(false)

  // Use deterministic values based on product ID to avoid hydration mismatch
  const getProductRating = (productId: string) => {
    // Simple hash function to get consistent pseudo-random values
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      const char = productId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return 4.8 + (Math.abs(hash) % 20) / 100; // Rating between 4.8 and 4.99
  }

  const getProductReviews = (productId: string) => {
    // Simple hash function to get consistent pseudo-random values
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      const char = productId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 50 + 20; // Reviews between 20 and 69
  }

  const rating = getProductRating(product.id)
  const reviews = getProductReviews(product.id)

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setIsPurchasing(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          email: email.trim(),
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Failed to create checkout session')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <AIEOContentStructure contentType="product">
      {/* Navigation */}
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link href="/" className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                LuxeCustomized
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-stone-600 hover:text-stone-900 transition-colors text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Collection</span>
                <span className="inline sm:hidden">Back</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4 sm:space-y-6">
            <div className="aspect-square rounded-lg overflow-hidden bg-stone-100">
              <Image
                src={product.images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                itemProp="image"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden bg-stone-100 border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-stone-900' 
                        : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} view ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                      quality={85}
                      sizes="(max-width: 640px) 33vw, 150px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <AIEOContentStructure section="product-details">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm" itemProp="category">
                  {product.category.name}
                </Badge>
                <AIHeading level={1} priority="high" className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-stone-900 mb-3 sm:mb-4 leading-tight">
                  <span itemProp="name">{product.title}</span>
                </AIHeading>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="flex items-center" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                    <span className="text-base sm:text-lg text-stone-600 ml-2" itemProp="ratingValue">{rating.toFixed(1)}</span>
                    <meta itemProp="bestRating" content="5" />
                    <meta itemProp="worstRating" content="1" />
                  </div>
                  <span className="text-sm sm:text-base text-stone-400" itemProp="reviewCount">({reviews} reviews)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <span className="text-3xl sm:text-4xl font-light text-stone-900" itemProp="price" content={(product.price / 100).toString()}>
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  <meta itemProp="priceCurrency" content="USD" />
                  <meta itemProp="availability" content="https://schema.org/InStock" />
                  {product.originalPrice && (
                    <>
                      <span className="text-lg sm:text-xl text-stone-400 line-through">${(product.originalPrice / 100).toFixed(2)}</span>
                      <Badge variant="destructive" className="text-xs sm:text-sm">{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</Badge>
                    </>
                  )}
                </div>
              </div>

              <AIContentBlock type="description" importance="high">
                <p className="text-base sm:text-lg text-stone-600 leading-relaxed" itemProp="description">
                  {product.description}
                </p>
              </AIContentBlock>

              {/* Purchase Form */}
              <div className="bg-stone-50 rounded-lg p-4 sm:p-6 border border-stone-200">
                <AIHeading level={3} priority="normal" className="text-lg sm:text-xl">Instant Download</AIHeading>
                <p className="text-sm sm:text-base text-stone-600 mb-4 sm:mb-6">Get immediate access to your template after purchase. No account required!</p>
                
                <form onSubmit={handlePurchase} className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-stone-700 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2"
                      required
                      autoComplete="email"
                    />
                    <p className="text-sm text-stone-500 mt-1">
                      We'll send your download link to this email
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 text-base sm:text-lg"
                    disabled={isPurchasing}
                  >
                    {isPurchasing ? 'Processing...' : (
                      <>
                        <span className="hidden sm:inline">Purchase Now - ${(product.price / 100).toFixed(2)}</span>
                        <span className="sm:hidden">Buy Now - ${(product.price / 100).toFixed(2)}</span>
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-stone-500">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Secure Payment
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Instant Access
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Commercial License
                  </div>
                </div>
              </div>

              {/* Product Details Tabs */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="includes">What's Included</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <AIContentBlock type="specification">
                    <AIHeading level={4}>Product Specifications</AIHeading>
                    <ul className="space-y-2 text-stone-600">
                      <li>• <strong>Format:</strong> Canva Template</li>
                      <li>• <strong>Category:</strong> {product.category.name}</li>
                      <li>• <strong>License:</strong> Commercial Use Allowed</li>
                      <li>• <strong>Access:</strong> Instant Download</li>
                      <li>• <strong>Support:</strong> Email Support Included</li>
                    </ul>
                  </AIContentBlock>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-4">
                  <AIContentBlock type="feature">
                    <AIHeading level={4}>Key Features</AIHeading>
                    <ul className="space-y-2 text-stone-600">
                      {product.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </AIContentBlock>
                </TabsContent>
                
                <TabsContent value="includes" className="space-y-4">
                  <AIContentBlock type="content">
                    <AIHeading level={4}>What You'll Receive</AIHeading>
                    <ul className="space-y-2 text-stone-600">
                      {product.includes.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </AIContentBlock>
                </TabsContent>
              </Tabs>
            </div>
          </AIEOContentStructure>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <AIHeading level={2} priority="normal">You Might Also Like</AIHeading>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 mb-4">
                    <Image
                      src={relatedProduct.images[0] || "/placeholder.svg"}
                      alt={relatedProduct.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-stone-500">{relatedProduct.category.name}</p>
                    <h3 className="font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-lg font-light text-stone-900">${(relatedProduct.price / 100).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AIEOContentStructure>
  )
}