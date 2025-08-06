"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Download, Calendar, Package, ArrowLeft, Search, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface Order {
  id: string
  email: string
  totalAmount: number
  status: string
  createdAt: string
  downloadToken: string | null
  downloadExpiry: string | null
  items: {
    id: string
    price: number
    product: {
      id: string
      title: string
      canvaUrl: string
      images: string[]
      category: {
        name: string
      }
    }
  }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const searchOrders = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(email.trim())}`)
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        if (data.length === 0) {
          toast.info('No orders found for this email address')
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to fetch orders')
      }
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchOrders()
    }
  }
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-serif font-bold text-stone-900">
                LuxeCustomized
              </Link>
              <Link href="/" className="flex items-center text-stone-600 hover:text-stone-900 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/account" className="text-stone-600 hover:text-stone-900 transition-colors">
                Account
              </Link>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Account Navigation */}
        <div className="flex items-center space-x-6 mb-8">
          <Link href="/account" className="text-stone-600 hover:text-stone-900 transition-colors">
            Profile
          </Link>
          <Link href="/account/orders" className="text-stone-900 font-medium border-b-2 border-stone-900 pb-1">
            Orders
          </Link>
          <Link href="/account/settings" className="text-stone-600 hover:text-stone-900 transition-colors">
            Settings
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-serif font-light text-stone-900 mb-2">Your Orders</h1>
                <p className="text-stone-600">Access and re-download your purchased templates</p>
              </div>
              <div className="flex items-center space-x-2 text-stone-600">
                <Package className="h-5 w-5" />
                <span className="font-medium">{orders.length} Orders</span>
              </div>
            </div>

            {/* Search Section */}
            <div className="mb-8">
              <div className="max-w-md">
                <Label htmlFor="email" className="text-sm font-medium text-stone-900 mb-2">
                  Enter your email address to find your orders
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={searchOrders} disabled={isLoading}>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-900"></div>
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-stone-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-medium text-stone-900">Order #{order.id.slice(-8).toUpperCase()}</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-stone-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <span className="font-medium">${(order.totalAmount / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {item.product.images && item.product.images.length > 0 && (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.title}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-stone-900">{item.product.title}</h4>
                            <p className="text-sm text-stone-500">{item.product.category.name}</p>
                            <p className="text-stone-600">${(item.price / 100).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {order.downloadToken && order.downloadExpiry && new Date(order.downloadExpiry) > new Date() ? (
                            <Button
                              size="sm"
                              className="bg-stone-900 hover:bg-stone-800 text-white"
                              asChild
                            >
                              <a href={item.product.canvaUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open in Canva
                              </a>
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              <Download className="h-4 w-4 mr-2" />
                              Expired
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.downloadExpiry && (
                    <div className="mt-4 p-3 bg-stone-50 rounded-lg">
                      <p className="text-sm text-stone-600">
                        Download access expires: {new Date(order.downloadExpiry).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {orders.length === 0 && hasSearched && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-stone-900 mb-2">No orders found</h3>
                <p className="text-stone-600 mb-6">No orders were found for this email address</p>
                <Button asChild>
                  <Link href="/">Browse Templates</Link>
                </Button>
              </div>
            )}

            {orders.length === 0 && !hasSearched && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-stone-900 mb-2">Find Your Orders</h3>
                <p className="text-stone-600 mb-6">Enter your email address above to find and access your purchased templates</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
