'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MoreVertical,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { OrderWithDetails, OrderStatus } from '@/types'
import { formatCurrency, handleApiError, formatOrderNumber } from '@/lib/api'
import { adminApiClient } from '@/lib/adminApi'

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const ordersData = await adminApiClient.getAllOrders()
      setOrders(ordersData.orders)
    } catch (err: unknown) {
      setError(handleApiError(err))
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId)
      setError('')
      setSuccessMessage('')

      const response = await adminApiClient.updateOrderStatus(orderId, newStatus)

      // Update the order in the local state
      setOrders(orders =>
        orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus as OrderStatus } : order
        )
      )

      // Show success message with email notification status
      const emailStatus = response.email_sent
        ? 'Email notification sent to customer.'
        : 'Status updated (email notification failed).'
      setSuccessMessage(
        `Order ${orderId} status updated to ${newStatus.replace('_', ' ').toLowerCase()}. ${emailStatus}`
      )

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err: unknown) {
      setError(handleApiError(err))
      console.error('Failed to update order status:', err)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PREPARING':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'READY':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PREPARING':
        return <Clock className="w-4 h-4" />
      case 'READY':
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Orders" subtitle="Manage customer orders">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Orders"
        subtitle={`Manage customer orders • ${filteredOrders.length} orders`}
      >
        <div className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <p className="text-green-600 font-medium">{successMessage}</p>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <p className="text-red-600 font-medium">{error}</p>
            </motion.div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-neutral-500" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    aria-label="Filter orders by status"
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="READY">Ready</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={fetchOrders}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Order ID</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Customer</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Type</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Total</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Time</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-mono text-sm font-bold text-secondary-600">
                            {formatOrderNumber(order.id, order.created_at)}
                          </span>
                          <p className="text-xs text-neutral-400 mt-1">
                            {order.id.split('-')[0]}...
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-neutral-800">{order.customer_name}</p>
                          <p className="text-sm text-neutral-500">{order.customer_email}</p>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.order_type === 'DELIVERY'
                              ? 'bg-blue-100 text-blue-800'
                              : order.order_type === 'PICKUP'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {order.order_type}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                            disabled={updatingOrderId === order.id}
                            className={`appearance-none bg-transparent border-0 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor(order.status)}`}
                            aria-label={`Update status for order ${order.id}`}
                            title={`Current status: ${order.status.replace('_', ' ')}`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="READY">Ready</option>
                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                            {updatingOrderId === order.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                            ) : (
                              getStatusIcon(order.status)
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-semibold text-neutral-800">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-sm text-neutral-600">
                          {formatDate(order.created_at)}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                            aria-label="View order details"
                          >
                            <Eye className="w-4 h-4 text-neutral-600" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                            aria-label="More actions"
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">No orders found</h3>
                <p className="text-neutral-600">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No orders have been placed yet.'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-600">Showing {filteredOrders.length} orders</p>

                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  <span className="px-3 py-2 bg-secondary-100 text-secondary-700 rounded-lg font-medium">
                    1
                  </span>
                  <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default OrdersPage
