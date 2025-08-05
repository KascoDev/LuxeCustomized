"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, Eye, Settings, Package, Users, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { FileUpload } from "@/components/ui/file-upload"

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
  canvaUrl: string
  images: string[]
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  featured: boolean
  tags: string[]
  features: string[]
  includes: string[]
  categoryId: string
  category: Category
  createdAt: string
  _count: {
    orders: number
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<{
    title: string
    description: string
    price: number
    originalPrice: number
    canvaUrl: string
    categoryId: string
    images: string[]
    featured: boolean
    tags: string[]
    features: string[]
    includes: string[]
    status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  }>({
    title: "",
    description: "",
    price: 0,
    originalPrice: 0,
    canvaUrl: "",
    categoryId: "",
    images: [],
    featured: false,
    tags: [],
    features: [],
    includes: [],
    status: "DRAFT"
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (categoryFilter !== 'all') params.append('categoryId', categoryFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      toast.error('Failed to fetch products')
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
      toast.error('Failed to fetch categories')
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, categoryFilter, statusFilter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: Math.round(formData.price * 100), // Convert to cents
          originalPrice: formData.originalPrice ? Math.round(formData.originalPrice * 100) : undefined,
        }),
      })

      if (response.ok) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully')
        fetchProducts()
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to save product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete product')
      }
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price / 100, // Convert from cents
      originalPrice: product.originalPrice ? product.originalPrice / 100 : 0,
      canvaUrl: product.canvaUrl,
      categoryId: product.categoryId,
      images: product.images,
      featured: product.featured,
      tags: product.tags,
      features: product.features,
      includes: product.includes,
      status: product.status
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: 0,
      originalPrice: 0,
      canvaUrl: "",
      categoryId: "",
      images: [],
      featured: false,
      tags: [],
      features: [],
      includes: [],
      status: "DRAFT"
    })
    setEditingProduct(null)
  }

  const handleArrayInput = (value: string, field: 'tags' | 'features' | 'includes') => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean)
    setFormData({ ...formData, [field]: items })
  }

  const filteredProducts = products

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
                className="flex items-center space-x-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg px-3 py-2 transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center space-x-3 text-stone-900 bg-stone-100 rounded-lg px-3 py-2"
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-serif font-light text-stone-900 mb-2">Products</h1>
                <p className="text-stone-600">Manage your digital product catalog</p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-stone-900 hover:bg-stone-800 text-white" onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Create a new digital product for your store</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Product Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter product title"
                            className="mt-2"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            className="mt-2"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="originalPrice">Original Price (optional)</Label>
                          <Input
                            id="originalPrice"
                            type="number"
                            step="0.01"
                            value={formData.originalPrice}
                            onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe your product..."
                          className="mt-2"
                          rows={4}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="canva-url">Canva URL</Label>
                          <Input
                            id="canva-url"
                            value={formData.canvaUrl}
                            onChange={(e) => setFormData({ ...formData, canvaUrl: e.target.value })}
                            placeholder="https://canva.com/..."
                            className="mt-2"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                        />
                        <Label htmlFor="featured">Featured Product</Label>
                      </div>

                      <div>
                        <Label>Product Images</Label>
                        <div className="mt-2">
                          <FileUpload
                            maxFiles={6}
                            existingFiles={formData.images}
                            onFilesUploaded={(urls) => setFormData({ ...formData, images: urls })}
                            onFileRemoved={(url) => setFormData({ ...formData, images: formData.images.filter(img => img !== url) })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            id="tags"
                            value={formData.tags.join(', ')}
                            onChange={(e) => handleArrayInput(e.target.value, 'tags')}
                            placeholder="portfolio, template, minimalist"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="features">Features (comma-separated)</Label>
                          <Input
                            id="features"
                            value={formData.features.join(', ')}
                            onChange={(e) => handleArrayInput(e.target.value, 'features')}
                            placeholder="responsive design, easy customization"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="includes">What's Included (comma-separated)</Label>
                          <Input
                            id="includes"
                            value={formData.includes.join(', ')}
                            onChange={(e) => handleArrayInput(e.target.value, 'includes')}
                            placeholder="Canva template, instructions, font licenses"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-stone-900 hover:bg-stone-800 text-white">
                        Create Product
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg border border-stone-200 p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border border-stone-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {product.images.length > 0 && (
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium text-stone-900">{product.title}</div>
                              {product.featured && (
                                <Badge variant="secondary" className="text-xs">Featured</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            ${(product.price / 100).toFixed(2)}
                            {product.originalPrice && (
                              <div className="text-xs text-stone-500 line-through">
                                ${(product.originalPrice / 100).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product.status === "ACTIVE" ? "default" : "secondary"}
                            className={
                              product.status === "ACTIVE" 
                                ? "bg-green-100 text-green-800" 
                                : product.status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {product.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{product._count.orders}</TableCell>
                        <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/product/${product.id}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(product.id)}
                              disabled={product._count.orders > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Product Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter product title"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-originalPrice">Original Price (optional)</Label>
                  <Input
                    id="edit-originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product..."
                  className="mt-2"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-canva-url">Canva URL</Label>
                  <Input
                    id="edit-canva-url"
                    value={formData.canvaUrl}
                    onChange={(e) => setFormData({ ...formData, canvaUrl: e.target.value })}
                    placeholder="https://canva.com/..."
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="edit-featured">Featured Product</Label>
              </div>

              <div>
                <Label>Product Images</Label>
                <div className="mt-2">
                  <FileUpload
                    maxFiles={6}
                    existingFiles={formData.images}
                    onFilesUploaded={(urls) => setFormData({ ...formData, images: urls })}
                    onFileRemoved={(url) => setFormData({ ...formData, images: formData.images.filter(img => img !== url) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                  <Input
                    id="edit-tags"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleArrayInput(e.target.value, 'tags')}
                    placeholder="portfolio, template, minimalist"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-features">Features (comma-separated)</Label>
                  <Input
                    id="edit-features"
                    value={formData.features.join(', ')}
                    onChange={(e) => handleArrayInput(e.target.value, 'features')}
                    placeholder="responsive design, easy customization"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-includes">What's Included (comma-separated)</Label>
                  <Input
                    id="edit-includes"
                    value={formData.includes.join(', ')}
                    onChange={(e) => handleArrayInput(e.target.value, 'includes')}
                    placeholder="Canva template, instructions, font licenses"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-stone-900 hover:bg-stone-800 text-white">
                Update Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
