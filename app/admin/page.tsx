"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, ShoppingCart, BarChart3, DollarSign, TrendingUp, Users, Eye, ArrowRight, Tags } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCategories: number
  recentOrders: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCategories: 0,
    recentOrders: []
  })
  const [isLoading, setIsLoading] = useState(true)

  console.log('🏠 Admin dashboard rendering...')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all data in parallel
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/categories')
      ])

      const products = productsRes.ok ? await productsRes.json() : []
      const orders = ordersRes.ok ? await ordersRes.json() : []
      const categories = categoriesRes.ok ? await categoriesRes.json() : []

      // Calculate revenue from completed orders
      const completedOrders = orders.filter((order: any) => order.status === 'COMPLETED')
      const totalRevenue = completedOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0)

      // Get recent orders (last 5)
      const recentOrders = orders.slice(0, 5)

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        totalCategories: categories.length,
        recentOrders
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const quickActions = [
    {
      title: "View Analytics",
      description: "Monitor sales and performance metrics",
      href: "/admin/analytics",
      icon: BarChart3,
      color: "text-blue-500"
    },
    {
      title: "Manage Customers",
      description: "View and manage customer accounts",
      href: "/admin/customers",
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Store Settings",
      description: "Configure store preferences",
      href: "/admin/settings", 
      icon: Eye,
      color: "text-purple-500"
    }
  ]

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-stone-400">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-stone-800 border-stone-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? "..." : formatPrice(stats.totalRevenue)}
            </div>
            <p className="text-xs text-stone-400 mt-1">
              From completed orders
            </p>
          </CardContent>
        </Card>

        <Card className="bg-stone-800 border-stone-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-400">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? "..." : stats.totalOrders}
            </div>
            <p className="text-xs text-stone-400 mt-1">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card className="bg-stone-800 border-stone-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-400">Products</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? "..." : stats.totalProducts}
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Digital templates
            </p>
          </CardContent>
        </Card>

        <Card className="bg-stone-800 border-stone-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-400">Categories</CardTitle>
            <Tags className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? "..." : stats.totalCategories}
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Product categories
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Quick Actions */}
        <Card className="bg-stone-800 border-stone-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-stone-400">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center p-3 sm:p-4 rounded-lg bg-stone-750 hover:bg-stone-700 transition-colors group"
              >
                <action.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${action.color} mr-3 sm:mr-4 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium group-hover:text-white text-sm sm:text-base">
                    {action.title}
                  </h3>
                  <p className="text-stone-400 text-sm">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-500 group-hover:text-stone-400" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="bg-stone-800 border-stone-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Orders</CardTitle>
              <CardDescription className="text-stone-400">
                Latest customer orders
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-stone-400 hover:text-white" asChild>
              <Link href="/admin/orders">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-stone-400 text-center py-4">Loading orders...</p>
            ) : stats.recentOrders.length === 0 ? (
              <p className="text-stone-400 text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{order.email}</p>
                      <p className="text-stone-400 text-sm">
                        {order.items?.length || 0} items • {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatPrice(order.totalAmount)}</p>
                      <p className={`text-sm ${
                        order.status === 'COMPLETED' ? 'text-green-400' :
                        order.status === 'PENDING' ? 'text-yellow-400' :
                        order.status === 'FAILED' ? 'text-red-400' : 'text-stone-400'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}