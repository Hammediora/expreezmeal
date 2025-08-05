'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Star, Clock, X, Save } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { adminApiClient, apiClient, formatCurrency, handleApiError } from '@/lib/api'
import { MenuItem, Category } from '@/types'

interface MenuItemFormData {
  category_id: string
  name: string
  description: string
  price: number
  sale_price?: number
  image_url?: string
  is_available: boolean
  is_featured: boolean
  preparation_time?: number
  calories?: number
  allergens: string[]
  dietary_flags: string[]
}

const AdminMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState<MenuItemFormData>({
    category_id: '',
    name: '',
    description: '',
    price: 0,
    sale_price: undefined,
    image_url: '',
    is_available: true,
    is_featured: false,
    preparation_time: undefined,
    calories: undefined,
    allergens: [],
    dietary_flags: [],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Use public API for reading data, admin API for create/update/delete operations
      const [itemsData, categoriesData] = await Promise.all([
        apiClient.getMenuItems(), // Use public API for reading
        apiClient.getCategories(), // Use public API for reading
      ])
      setMenuItems(itemsData)
      setCategories(categoriesData)
    } catch (err: unknown) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        const updatedItem = await adminApiClient.updateMenuItem(editingItem.id, formData)
        setMenuItems(items => items.map(item => (item.id === editingItem.id ? updatedItem : item)))
      } else {
        const newItem = await adminApiClient.createMenuItem(formData)
        setMenuItems(items => [...items, newItem])
      }
      resetForm()
    } catch (err: unknown) {
      setError(handleApiError(err))
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      await adminApiClient.deleteMenuItem(itemId)
      setMenuItems(items => items.filter(item => item.id !== itemId))
    } catch (err: unknown) {
      setError(handleApiError(err))
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      category_id: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      sale_price: item.sale_price,
      image_url: item.image_url || '',
      is_available: item.is_available,
      is_featured: item.is_featured,
      preparation_time: item.preparation_time,
      calories: item.calories,
      allergens: item.allergens || [],
      dietary_flags: item.dietary_flags || [],
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      category_id: '',
      name: '',
      description: '',
      price: 0,
      sale_price: undefined,
      image_url: '',
      is_available: true,
      is_featured: false,
      preparation_time: undefined,
      calories: undefined,
      allergens: [],
      dietary_flags: [],
    })
    setEditingItem(null)
    setShowAddForm(false)
  }

  const filteredItems = menuItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <AdminLayout title="Menu Management" subtitle="Manage your restaurant menu">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading menu...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Menu Management"
        subtitle="Manage your restaurant menu items, categories, and pricing"
      >
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Filters and Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Menu Item</span>
              </button>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {item.image_url && (
                  <div className="aspect-video relative">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {item.is_featured && (
                      <div className="absolute top-2 left-2 bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>Featured</span>
                      </div>
                    )}
                    {!item.is_available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Unavailable</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-neutral-800 line-clamp-1">{item.name}</h3>
                    <div className="flex items-center space-x-1">
                      {item.is_available ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-lg text-neutral-800">
                        {formatCurrency(item.price)}
                      </span>
                      {item.sale_price && (
                        <span className="text-sm text-red-500 line-through">
                          {formatCurrency(item.sale_price)}
                        </span>
                      )}
                    </div>
                    {item.preparation_time && (
                      <div className="flex items-center space-x-1 text-xs text-neutral-500">
                        <Clock className="w-3 h-3" />
                        <span>{item.preparation_time}min</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      {categories.find(c => c.id === item.category_id)?.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-neutral-400 hover:text-blue-600 transition-colors"
                        title="Edit menu item"
                        aria-label="Edit menu item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Delete menu item"
                        aria-label="Delete menu item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-2">No menu items found</h3>
              <p className="text-neutral-600">
                {searchTerm || selectedCategory
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first menu item'}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-800">
                    {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-1 text-neutral-400 hover:text-neutral-600"
                    title="Close modal"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Enter menu item name"
                      title="Menu item name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, category_id: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      title="Select category"
                      aria-label="Select category"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="Enter menu item description"
                    title="Menu item description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="0.00"
                      title="Menu item price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Sale Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.sale_price || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          sale_price: e.target.value ? parseFloat(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="0.00"
                      title="Sale price (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Prep Time (min)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.preparation_time || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          preparation_time: e.target.value ? parseInt(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="15"
                      title="Preparation time in minutes"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                    title="Image URL (optional)"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, is_available: e.target.checked }))
                      }
                      className="rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500"
                    />
                    <span className="text-sm text-neutral-700">Available</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, is_featured: e.target.checked }))
                      }
                      className="rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500"
                    />
                    <span className="text-sm text-neutral-700">Featured</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-secondary-600 text-white px-6 py-2 rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingItem ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default AdminMenu
