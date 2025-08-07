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
import { toast } from "sonner"
import { FileUpload } from "@/components/ui/file-upload"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  createdAt: string
  _count: {
    products: number
  }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: ""
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      toast.error('Failed to fetch categories')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully')
        fetchCategories()
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to save category')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Category deleted successfully')
        fetchCategories()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete category')
      }
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || ""
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", image: "" })
    setEditingCategory(null)
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="min-h-screen bg-stone-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-light text-white mb-2">Categories</h1>
            <p className="text-sm sm:text-base text-stone-400">Organize your products into categories</p>
          </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white hover:bg-stone-100 text-stone-900" onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>Create a new category to organize your products</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
                      <div>
                        <Label htmlFor="name">Category Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter category name"
                          className="mt-2"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe this category..."
                          className="mt-2"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Category Image</Label>
                        <div className="mt-2">
                          <FileUpload
                            maxFiles={1}
                            existingFiles={formData.image ? [formData.image] : []}
                            onFilesUploaded={(urls) => setFormData({ ...formData, image: urls[0] || "" })}
                            onFileRemoved={() => setFormData({ ...formData, image: "" })}
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-white hover:bg-stone-100 text-stone-900">
                        Create Category
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <div className="bg-stone-800 rounded-lg border border-stone-700 p-4 sm:p-6 mb-6">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-stone-700 border-stone-600 text-white placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Categories Table */}
            <div className="bg-stone-800 rounded-lg border border-stone-700 overflow-hidden">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-stone-700">
                    <TableHead className="text-stone-300">Category</TableHead>
                    <TableHead className="text-stone-300">Description</TableHead>
                    <TableHead className="text-stone-300">Products</TableHead>
                    <TableHead className="text-stone-300">Created</TableHead>
                    <TableHead className="text-right text-stone-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow className="border-stone-700">
                      <TableCell colSpan={5} className="text-center py-8 text-stone-400">
                        Loading categories...
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length === 0 ? (
                    <TableRow className="border-stone-700">
                      <TableCell colSpan={5} className="text-center py-8 text-stone-400">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id} className="border-stone-700">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {category.image && (
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium text-white">{category.name}</div>
                              <div className="text-sm text-stone-400">/{category.slug}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-stone-300">
                            {category.description || "No description"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-stone-300 border-stone-600">{category._count.products} products</Badge>
                        </TableCell>
                        <TableCell className="text-white">{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="text-stone-300 hover:text-white hover:bg-stone-700" onClick={() => openEditDialog(category)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-stone-700"
                              onClick={() => handleDelete(category.id)}
                              disabled={category._count.products > 0}
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div>
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this category..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label>Category Image</Label>
                <div className="mt-2">
                  <FileUpload
                    maxFiles={1}
                    existingFiles={formData.image ? [formData.image] : []}
                    onFilesUploaded={(urls) => setFormData({ ...formData, image: urls[0] || "" })}
                    onFileRemoved={() => setFormData({ ...formData, image: "" })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-white hover:bg-stone-100 text-stone-900">
                Update Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}