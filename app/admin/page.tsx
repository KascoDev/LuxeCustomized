import Link from "next/link"
import { Package, Users, BarChart3, Settings, DollarSign, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stats = [
  {
    title: "Total Products",
    value: "42",
    change: "+12%",
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+5%",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Revenue",
    value: "$12,345",
    change: "+18%",
    icon: DollarSign,
    color: "text-purple-600",
  },
  {
    title: "Categories",
    value: "8",
    change: "+2",
    icon: BarChart3,
    color: "text-orange-600",
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin Navigation */}
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-2xl font-serif font-bold text-stone-900">
                LuxeCustomized Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-stone-600 hover:text-stone-900 transition-colors">
                <Eye className="h-4 w-4 mr-2 inline" />
                View Store
              </Link>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-stone-200 min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="flex items-center space-x-3 text-stone-900 bg-stone-100 rounded-lg px-3 py-2"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center space-x-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg px-3 py-2 transition-colors"
              >
                <Package className="h-5 w-5" />
                <span>Products</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center space-x-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg px-3 py-2 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Categories</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center space-x-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg px-3 py-2 transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>Orders</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-light text-stone-900 mb-2">Dashboard</h1>
              <p className="text-stone-600">Welcome back! Here's an overview of your store.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-stone-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stone-900">{stat.value}</div>
                    <p className="text-xs text-stone-500 mt-1">
                      <span className="text-green-600">{stat.change}</span> from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks to manage your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/admin/products">
                    <Button className="w-full justify-start bg-stone-900 hover:bg-stone-800 text-white">
                      <Package className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                  </Link>
                  <Link href="/admin/categories">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Categories
                    </Button>
                  </Link>
                  <Link href="/admin/orders">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      View Recent Orders
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates from your store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-900">New order received</p>
                        <p className="text-xs text-stone-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-900">Product published</p>
                        <p className="text-xs text-stone-500">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-900">Category created</p>
                        <p className="text-xs text-stone-500">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}