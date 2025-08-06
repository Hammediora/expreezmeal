'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Clock,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  Check,
  AlertTriangle,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { adminApiClient } from '@/lib/adminApi'
import { formatCurrency, handleApiError } from '@/lib/api'
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
  const [successMessage, setSuccessMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
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

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const items = await adminApiClient.getMenuItems()
      setMenuItems(items)
    } catch (err: unknown) {
      setError(handleApiError(err))
      console.error('Failed to fetch menu items:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await adminApiClient.getCategories()
      setCategories(categoriesData)
    } catch (err: unknown) {
      console.error('Failed to fetch categories:', err)
    }
  }, [])

  useEffect(() => {
    fetchMenuItems()
    fetchCategories()
  }, [fetchMenuItems, fetchCategories])

  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Image file size must be less than 5MB')
      return
    }

    try {
      setUploadingImage(true)
      setError('')

      const result = await adminApiClient.uploadImage(file)
      setFormData({ ...formData, image_url: result.url })
      setSuccessMessage('Image uploaded successfully!')

      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err: unknown) {
      setError(handleApiError(err))
      console.error('Failed to upload image:', err)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.price) {
      setError('Name and price are required')
      return
    }

    try {
      setError('')

      if (editingItem) {
        await adminApiClient.updateMenuItem(editingItem.id, formData)
        setSuccessMessage('Menu item updated successfully!')
      } else {
        await adminApiClient.createMenuItem(formData)
        setSuccessMessage('Menu item created successfully!')
      }

      resetForm()
      fetchMenuItems()

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err: unknown) {
      setError(handleApiError(err))
    }
  }

  const handleDelete = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      return
    }

    try {
      setError('')
      await adminApiClient.deleteMenuItem(itemId)
      setSuccessMessage('Menu item deleted successfully!')
      fetchMenuItems()

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err: unknown) {
      setError(handleApiError(err))
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      category_id: item.category_id || '',
      name: item.name,
      description: item.description || '',
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
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <AdminLayout title="Menu Management" subtitle="Manage menu items and categories">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading menu items...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Menu Management"
        subtitle={`Manage menu items and categories • ${filteredItems.length} items`}
      >
        <div className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-600 font-medium">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Header Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="border border-neutral-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
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
                className="flex items-center space-x-2 px-4 py-2.5 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Menu Item</span>
              </button>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 bg-neutral-100">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-12 h-12 text-neutral-400" />
                    </div>
                  )}

                  {/* Status badges */}
                  <div className="absolute top-2 left-2 flex space-x-1">
                    {item.is_featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                    {!item.is_available && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-neutral-50 transition-colors"
                      aria-label="Edit item"
                    >
                      <Edit2 className="w-4 h-4 text-neutral-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-neutral-800 line-clamp-1">{item.name}</h3>
                    <div className="flex items-center space-x-1">
                      {item.is_available ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{item.description}</p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {item.sale_price ? (
                        <>
                          <span className="text-lg font-bold text-secondary-600">
                            {formatCurrency(item.sale_price)}
                          </span>
                          <span className="text-sm text-neutral-500 line-through">
                            {formatCurrency(item.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-neutral-800">
                          {formatCurrency(item.price)}
                        </span>
                      )}
                    </div>

                    {item.preparation_time && (
                      <div className="flex items-center text-xs text-neutral-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.preparation_time}m
                      </div>
                    )}
                  </div>

                  {(() => {
                    const category = categories.find(cat => cat.id === item.category_id)
                    return category && (
                      <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                        {category.name}
                      </span>
                    )
                  })()}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">No menu items found</h3>
              <p className="text-neutral-600 mb-4">
                {searchTerm || selectedCategory
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first menu item to get started.'}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              >
                Add Menu Item
              </button>
            </div>
          )}

          {/* Add/Edit Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-800">
                      {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </h3>
                    <button
                      onClick={resetForm}
                      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                      aria-label="Close form"
                      title="Close form"
                    >
                      <X className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                        placeholder="Enter item name"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category_id}
                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
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

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={e =>
                          setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Sale Price */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Sale Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.sale_price || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            sale_price: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Preparation Time */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Prep Time (minutes)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.preparation_time || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            preparation_time: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                        placeholder="15"
                      />
                    </div>

                    {/* Calories */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Calories
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.calories || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            calories: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                        placeholder="250"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Enter item description"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Image</label>
                    <div className="space-y-4">
                      {formData.image_url && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                          <Image
                            src={formData.image_url}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-4">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file)
                            }}
                            className="hidden"
                          />
                          <div className="flex items-center space-x-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                          </div>
                        </label>

                        {formData.image_url && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Switches */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="is_available"
                        checked={formData.is_available}
                        onChange={e => setFormData({ ...formData, is_available: e.target.checked })}
                        className="w-4 h-4 text-secondary-600 focus:ring-secondary-500 border-neutral-300 rounded"
                      />
                      <label
                        htmlFor="is_available"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Available for ordering
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={formData.is_featured}
                        onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-4 h-4 text-secondary-600 focus:ring-secondary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="is_featured" className="text-sm font-medium text-neutral-700">
                        Featured item
                      </label>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingItem ? 'Update Item' : 'Create Item'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default AdminMenu
