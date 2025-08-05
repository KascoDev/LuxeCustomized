"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Download, ArrowLeft, Copy, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

interface OrderDetails {
  id: string
  email: string
  totalAmount: number
  status: string
  downloadToken: string | null
  downloadExpiry: Date | null
  items: {
    id: string
    product: {
      id: string
      title: string
      canvaUrl: string
      images: string[]
      category: {
        name: string
      }
    }
    price: number
  }[]
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId)
    } else {
      setError('Invalid order session')
      setIsLoading(false)
    }
  }, [sessionId])

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/orders/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        setDownloadUrl(data.downloadUrl)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to verify payment')
      }
    } catch (error) {
      setError('Failed to load order details')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Link copied to clipboard!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-stone-900"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Order Error</CardTitle>
            <CardDescription>{error || 'Order not found'}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const product = order.items[0]?.product
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-serif font-bold text-stone-900">
              LuxeCustomized
            </Link>
            <Link href="/" className="flex items-center text-stone-600 hover:text-stone-900 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-serif font-light text-stone-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-stone-600">
            Thank you for your purchase. Your digital template is ready for download.
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Order #{order.id.slice(-8).toUpperCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Info */}
              <div className="flex space-x-4">
                {product && product.images.length > 0 && (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-stone-900 mb-2">{product?.title}</h3>
                  <p className="text-sm text-stone-500 mb-2">{product?.category.name}</p>
                  <p className="text-lg font-medium text-stone-900">
                    ${(order.totalAmount / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Email:</span>
                  <span className="text-stone-900">{order.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status:</span>
                  <span className="text-green-600 font-medium">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total:</span>
                  <span className="text-stone-900 font-medium">
                    ${(order.totalAmount / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Your Download
            </CardTitle>
            <CardDescription>
              Access your Canva template instantly. This link will expire in 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {downloadUrl ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Canva
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(downloadUrl)}
                  className="sm:w-auto"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  Download link is being generated. Please check your email for the download link.
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-stone-50 p-4 rounded-lg">
              <h4 className="font-medium text-stone-900 mb-2">How to use your template:</h4>
              <ol className="text-sm text-stone-600 space-y-1">
                <li>1. Click the "Open in Canva" button above</li>
                <li>2. The template will open in your Canva account</li>
                <li>3. Customize colors, text, and images to match your brand</li>
                <li>4. Download or share your finished design</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Email Confirmation */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium text-stone-900 mb-2">Check Your Email</h3>
              <p className="text-stone-600 mb-4">
                We've sent a confirmation email to <strong>{order.email}</strong> with your download link and purchase details.
              </p>
              <p className="text-sm text-stone-500">
                Don't see the email? Check your spam folder or contact support.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
