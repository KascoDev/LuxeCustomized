"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Filter, Search, Star, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AIEOContentStructure, AIHeading, AIContentBlock, StructuredData } from "@/components/seo/StructuredData"
import { FAQ, templateFAQData } from "@/components/seo/FAQ"
import { 
  generateWebsiteStructuredData, 
  generateFAQStructuredData, 
  generateCollectionStructuredData,
  generateAIContentSchema 
} from "@/lib/seo"

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
  originalPrice?: number
  images: string[]
  featured: boolean
  tags: string[]
  category: Category
  _count: {
    orders: number
  }
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  
  // For public homepage, no admin check needed
  const isAdmin = false

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, selectedCategory, sortBy])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      params.append('status', 'ACTIVE')
      if (selectedCategory !== 'all') params.append('categoryId', selectedCategory)
      if (searchTerm) params.append('search', searchTerm)
      if (sortBy === 'featured') params.append('featured', 'true')

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        
        // Set featured products for the hero section
        if (sortBy === 'featured' && !searchTerm && selectedCategory === 'all') {
          setFeaturedProducts(data.filter((p: Product) => p.featured).slice(0, 3))
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // Mock rating data since we don't have reviews yet
  const getProductRating = () => (4.5 + Math.random() * 0.5).toFixed(1)
  const getProductReviews = () => Math.floor(Math.random() * 200) + 20

  // Generate structured data for AI and search engines
  const websiteData = generateWebsiteStructuredData()
  const faqData = generateFAQStructuredData(templateFAQData)
  const collectionData = products.length > 0 ? generateCollectionStructuredData(
    products.map(p => ({ id: p.id, title: p.title, price: p.price, images: p.images })),
    'Premium Templates'
  ) : null

  const aiContentData = generateAIContentSchema({
    title: 'Premium Digital Canva Templates Collection',
    description: 'Professional Canva templates for entrepreneurs, coaches, and creative professionals. Instant download with commercial license.',
    contentType: 'template-collection',
    targetAudience: ['entrepreneurs', 'coaches', 'consultants', 'creative professionals'],
    keyBenefits: ['instant download', 'commercial license', 'professional design', 'customizable templates'],
    useCases: ['business branding', 'social media marketing', 'content creation', 'client presentations']
  })

  const structuredDataArray = [websiteData, faqData, aiContentData, collectionData].filter(Boolean)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Enhanced structured data for AI and SEO */}
      <StructuredData data={structuredDataArray} />
      {/* Navigation */}
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link href="/" className="flex items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LCC-lbqsNL0FobNj8eWA0CiO5u7QKAwekD.png"
                  alt="Luxe Customized"
                  width={180}
                  height={90}
                  className="h-10 sm:h-12 w-auto"
                  priority
                  quality={90}
                />
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="#featured" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Templates
                </Link>
                <Link href="#collection" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Collections
                </Link>
                <Link href="#faq" className="text-stone-600 hover:text-stone-900 transition-colors">
                  About
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-stone-600 p-1">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 bg-white border-r-0 w-64">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center px-4 py-6 border-b border-stone-200">
                        <Link href="/" className="flex items-center">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LCC-lbqsNL0FobNj8eWA0CiO5u7QKAwekD.png"
                            alt="Luxe Customized"
                            width={150}
                            height={75}
                            className="h-10 w-auto"
                            priority
                            quality={90}
                          />
                        </Link>
                      </div>
                      <nav className="flex-1 px-4 py-6 space-y-1">
                        <Link href="#featured" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-100">
                          Templates
                        </Link>
                        <Link href="#collection" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-100">
                          Collections
                        </Link>
                        <Link href="#faq" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-100">
                          About
                        </Link>
                        <Link href="/account/orders" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-100">
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link href="/admin/products" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-100">
                            Admin Dashboard
                          </Link>
                        )}
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <Link href="/account/orders" className="hidden md:block text-stone-600 hover:text-stone-900 transition-colors text-sm lg:text-base">
                My Orders
              </Link>
              {isAdmin && (
                <Link href="/admin/products" className="hidden md:block">
                  <Button variant="outline" size="sm" className="text-sm">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-32 overflow-hidden" style={{ backgroundColor: "#F7F2EC" }}>
        {/* Decorative Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top left star */}
          <div className="absolute top-6 left-4 sm:top-12 sm:left-12 text-amber-400">
            <svg width="20" height="20" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Top right sparkle */}
          <div className="absolute top-8 right-4 sm:top-16 sm:right-20 text-amber-400">
            <svg width="16" height="16" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5L12 0z" />
            </svg>
          </div>

          {/* Right side star - hidden on mobile */}
          <div className="absolute top-32 right-12 text-amber-400 hidden sm:block">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Left side sparkle - hidden on mobile */}
          <div className="absolute top-64 left-16 text-amber-400 hidden sm:block">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5L12 0z" />
            </svg>
          </div>

          {/* Bottom right star outline */}
          <div className="absolute bottom-32 right-16 text-amber-400">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Bottom left sparkle */}
          <div className="absolute bottom-20 left-20 text-amber-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5L12 0z" />
            </svg>
          </div>

          {/* Additional small sparkles */}
          <div className="absolute top-48 left-32 text-amber-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5L12 0z" />
            </svg>
          </div>

          <div className="absolute bottom-48 right-32 text-amber-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5L12 0z" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Luxe Script Text */}
            <div className="mb-4 sm:mb-6">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif italic text-stone-700 mb-2 relative">
                <span
                  className="relative inline-block"
                  style={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                    background: "linear-gradient(135deg, #8B7355 0%, #A0916B 50%, #8B7355 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Luxe
                </span>
              </div>
              <div className="text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.2em] sm:tracking-[0.3em] text-stone-600 font-medium uppercase">CUSTOMIZED</div>
            </div>

            <AIHeading level={1} priority="high" id="main-heading">
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-stone-900 mb-6 sm:mb-8 leading-tight block">
                Premium Digital Canva Templates
              </span>
            </AIHeading>

            <AIContentBlock type="description" importance="high">
              <p className="text-base sm:text-lg md:text-xl text-stone-600 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
                Professional Canva templates for entrepreneurs, coaches, and creative professionals. 
                Instant download with commercial license included. Transform your business with premium designs.
              </p>
            </AIContentBlock>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button size="lg" className="bg-stone-900 hover:bg-stone-800 text-white px-6 sm:px-8 py-3 text-base sm:text-lg">
                Explore Collection →
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 sm:px-8 py-3 text-base sm:text-lg bg-transparent border-stone-400 text-stone-700 hover:bg-stone-100"
              >
                View Lookbook
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Bar */}
      <section className="bg-stone-900 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8 md:space-x-12">
            {categories.slice(0, 3).map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-stone-300 hover:text-white transition-colors text-base sm:text-lg tracking-wide uppercase"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-stone-900 mb-3 sm:mb-4">Featured Templates</h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto px-4 sm:px-0">
              Our most coveted designs, chosen for their exceptional quality and timeless appeal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {isLoading ? (
              // Loading skeleton
              [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-200 aspect-square rounded-lg mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-24"></div>
                    <div className="h-6 bg-stone-200 rounded w-3/4"></div>
                    <div className="h-4 bg-stone-200 rounded w-32"></div>
                    <div className="h-6 bg-stone-200 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => {
                const rating = getProductRating()
                const reviews = getProductReviews()
                return (
                  <Link key={product.id} href={`/product/${product.id}`} className="group">
                    <div className="relative overflow-hidden rounded-lg bg-stone-100 aspect-square mb-6">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 text-stone-900">
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-stone-500 uppercase tracking-wide">{product.category.name}</p>
                      <h3 className="text-xl font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm text-stone-600 ml-1">{rating}</span>
                        </div>
                        <span className="text-sm text-stone-400">({reviews})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-light text-stone-900">${(product.price / 100).toFixed(2)}</p>
                        {product.originalPrice && (
                          <p className="text-lg text-stone-400 line-through">${(product.originalPrice / 100).toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-stone-600">No featured products available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section id="collection" className="py-12 sm:py-16" style={{ backgroundColor: "#F9F5F0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-10 md:mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-stone-900 mb-3 sm:mb-4">Complete Collection</h2>
              <p className="text-sm sm:text-base text-stone-600">Discover our full range of premium digital templates and design assets.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 lg:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input 
                  placeholder="Search templates..." 
                  className="pl-10 w-full sm:w-48 md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40 md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-28 md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low</SelectItem>
                  <SelectItem value="price-high">Price: High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isLoading ? (
              // Loading skeleton
              [...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-200 aspect-square rounded-lg mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-24"></div>
                    <div className="h-6 bg-stone-200 rounded w-3/4"></div>
                    <div className="h-4 bg-stone-200 rounded w-32"></div>
                    <div className="h-6 bg-stone-200 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product) => {
                const rating = getProductRating()
                const reviews = getProductReviews()
                return (
                  <Link key={product.id} href={`/product/${product.id}`} className="group">
                    <div className="relative overflow-hidden rounded-lg bg-white aspect-square mb-6 shadow-sm hover:shadow-md transition-shadow">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {product.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-stone-900 text-white">
                            Featured
                          </Badge>
                        </div>
                      )}
                      {product.originalPrice && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="destructive">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-stone-500 uppercase tracking-wide">{product.category.name}</p>
                      <h3 className="text-xl font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm text-stone-600 ml-1">{rating}</span>
                        </div>
                        <span className="text-sm text-stone-400">({reviews})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-light text-stone-900">${(product.price / 100).toFixed(2)}</p>
                        {product.originalPrice && (
                          <p className="text-lg text-stone-400 line-through">${(product.originalPrice / 100).toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-stone-600">No products found matching your criteria</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Button variant="outline" size="lg" className="px-6 sm:px-8 bg-transparent">
              Load More Templates
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ items={templateFAQData} />

      {/* Newsletter */}
      <section className="py-16 sm:py-20 md:py-24 bg-stone-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-white mb-4 sm:mb-6">Stay Inspired</h2>
          <p className="text-stone-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join our community of discerning creatives. Receive exclusive templates, design insights, and early access
            to new collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-stone-400"
            />
            <Button className="bg-white text-stone-900 hover:bg-stone-100">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LCC-lbqsNL0FobNj8eWA0CiO5u7QKAwekD.png"
                  alt="Luxe Customized"
                  width={200}
                  height={100}
                  className="h-14 w-auto"
                />
              </Link>
              <p className="text-stone-600 max-w-md">
                Premium digital templates crafted for the modern creative professional. Elevate your brand with our
                curated collection.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-stone-900 mb-4">Collections</h3>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <Link href="/templates" className="hover:text-stone-900 transition-colors">
                    Website Templates
                  </Link>
                </li>
                <li>
                  <Link href="/brand" className="hover:text-stone-900 transition-colors">
                    Brand Design
                  </Link>
                </li>
                <li>
                  <Link href="/print" className="hover:text-stone-900 transition-colors">
                    Print Design
                  </Link>
                </li>
                <li>
                  <Link href="/social" className="hover:text-stone-900 transition-colors">
                    Social Media
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-stone-900 mb-4">Support</h3>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <Link href="/help" className="hover:text-stone-900 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-stone-900 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-stone-900 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-stone-900 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-200 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 text-center text-stone-500">
            <p>&copy; 2024 Luxe Customized. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
