"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Download, Filter, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    title: string
    slug: string
  }
}

interface Order {
  id: string
  email: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
  downloadToken?: string
  downloadExpiry?: string
  stripeSessionId?: string
}

const statusColors = {
  PENDING: "!bg-yellow-900/20 !text-yellow-400 !border-yellow-900/30",
  PROCESSING: "!bg-blue-900/20 !text-blue-400 !border-blue-900/30", 
  COMPLETED: "!bg-green-900/20 !text-green-400 !border-green-900/30",
  FAILED: "!bg-red-900/20 !text-red-400 !border-red-900/30",
  REFUNDED: "!bg-stone-700 !text-stone-300 !border-stone-600"
}

const statusLabels = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed", 
  FAILED: "Failed",
  REFUNDED: "Refunded"
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Order status updated')
        fetchOrders()
      } else {
        toast.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order status')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.product.title.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">Orders</h1>
          <p className="text-sm sm:text-base text-stone-400">Manage customer orders and downloads</p>
        </div>
        <Button 
          onClick={fetchOrders}
          variant="outline" 
          className="border-stone-600 bg-stone-800 text-white hover:bg-stone-700 w-full sm:w-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            type="text"
            placeholder="Search orders, emails, or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-stone-800 border-stone-600 text-white placeholder:text-stone-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px] bg-stone-800 border-stone-600 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-stone-800 border-stone-600">
            <SelectItem value="all" className="text-white">All Status</SelectItem>
            <SelectItem value="PENDING" className="text-white">Pending</SelectItem>
            <SelectItem value="PROCESSING" className="text-white">Processing</SelectItem>
            <SelectItem value="COMPLETED" className="text-white">Completed</SelectItem>
            <SelectItem value="FAILED" className="text-white">Failed</SelectItem>
            <SelectItem value="REFUNDED" className="text-white">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-stone-800 rounded-lg border border-stone-700 overflow-hidden">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-stone-700">
              <TableHead className="text-stone-300">Order ID</TableHead>
              <TableHead className="text-stone-300">Customer</TableHead>
              <TableHead className="text-stone-300">Products</TableHead>
              <TableHead className="text-stone-300">Total</TableHead>
              <TableHead className="text-stone-300">Status</TableHead>
              <TableHead className="text-stone-300">Date</TableHead>
              <TableHead className="text-stone-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-stone-400">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-stone-400">
                  {searchTerm || statusFilter !== "all" ? "No orders match your filters" : "No orders found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-stone-700">
                  <TableCell className="text-white font-mono text-sm">
                    {order.id.slice(-8)}
                  </TableCell>
                  <TableCell className="text-white">
                    {order.email}
                  </TableCell>
                  <TableCell className="text-stone-300">
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-sm">
                          {item.quantity}x {item.product.title}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                    >
                      <SelectTrigger className="w-[120px] bg-transparent border-none p-0">
                        <Badge className={`border ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent className="bg-stone-800 border-stone-600">
                        <SelectItem value="PENDING" className="text-white">Pending</SelectItem>
                        <SelectItem value="PROCESSING" className="text-white">Processing</SelectItem>
                        <SelectItem value="COMPLETED" className="text-white">Completed</SelectItem>
                        <SelectItem value="FAILED" className="text-white">Failed</SelectItem>
                        <SelectItem value="REFUNDED" className="text-white">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-stone-300">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-stone-400 hover:text-white"
                        onClick={() => {
                          toast.info('Order details coming soon')
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {order.downloadToken && (
                        <Button
                          variant="ghost"
                          size="sm" 
                          className="text-stone-400 hover:text-white"
                          onClick={() => {
                            toast.info('Download management coming soon')
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 sm:mt-8">
        <div className="bg-stone-800 p-4 rounded-lg border border-stone-700">
          <h3 className="text-stone-400 text-sm mb-1">Total Orders</h3>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
        </div>
        <div className="bg-stone-800 p-4 rounded-lg border border-stone-700">
          <h3 className="text-stone-400 text-sm mb-1">Completed</h3>
          <p className="text-2xl font-bold text-green-400">
            {orders.filter(o => o.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="bg-stone-800 p-4 rounded-lg border border-stone-700">
          <h3 className="text-stone-400 text-sm mb-1">Pending</h3>
          <p className="text-2xl font-bold text-yellow-400">
            {orders.filter(o => o.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-stone-800 p-4 rounded-lg border border-stone-700">
          <h3 className="text-stone-400 text-sm mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-white">
            {formatPrice(orders
              .filter(o => o.status === 'COMPLETED')
              .reduce((sum, o) => sum + o.totalAmount, 0)
            )}
          </p>
        </div>
      </div>
    </div>
  )
}