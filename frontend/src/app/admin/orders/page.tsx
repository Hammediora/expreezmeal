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
import { OrderWithDetails } from '@/types'
import { formatCurrency } from '@/lib/api'

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Mock data for demonstration
        const mockOrders: OrderWithDetails[] = [
          {
            id: 'ORD-001',
            status: 'PREPARING',
            order_type: 'DELIVERY',
            subtotal: 25.5,
            tax: 2.24,
            tip: 3.83,
            total: 31.57,
            created_at: '2024-08-04T10:30:00Z',
            estimated_delivery_time: '2024-08-04T11:15:00Z',
            special_instructions: 'No onions please',
            items: [
              {
                id: 'OI-001',
                menu_item_id: 'MI-001',
                quantity: 1,
                unit_price: 12.99,
                total_price: 12.99,
                special_instructions: 'Extra spicy',
              },
              {
                id: 'OI-002',
                menu_item_id: 'MI-002',
                quantity: 1,
                unit_price: 12.51,
                total_price: 12.51,
              },
            ],
            customer_name: 'John Doe',
            customer_email: 'john@example.com',
            customer_phone: '+1234567890',
            payment_status: 'COMPLETED',
            updated_at: '2024-08-04T10:35:00Z',
          },
          {
            id: 'ORD-002',
            status: 'READY',
            order_type: 'PICKUP',
            subtotal: 18.5,
            tax: 1.62,
            tip: 0,
            total: 20.12,
            created_at: '2024-08-04T09:15:00Z',
            items: [
              {
                id: 'OI-003',
                menu_item_id: 'MI-003',
                quantity: 2,
                unit_price: 9.25,
                total_price: 18.5,
              },
            ],
            customer_name: 'Jane Smith',
            customer_email: 'jane@example.com',
            customer_phone: '+1987654321',
            payment_status: 'COMPLETED',
            updated_at: '2024-08-04T09:45:00Z',
          },
        ]

        setOrders(mockOrders)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

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

                <button className="flex items-center space-x-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                  <RefreshCw className="w-4 h-4" />
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
                        <span className="font-mono text-sm font-medium text-neutral-800">
                          {order.id}
                        </span>
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
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span>{order.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-semibold text-neutral-800">
                          {formatCurrency(order.total)}
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
