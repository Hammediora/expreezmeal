'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Filter,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { adminApiClient } from '@/lib/adminApi'
import { formatCurrency, handleApiError } from '@/lib/api'

interface ReportsData {
  period: string
  date_range: {
    start: string
    end: string
  }
  summary: {
    total_revenue: number
    total_orders: number
    avg_order_value: number
    total_customers: number
  }
  revenue_chart: Array<{
    date: string
    revenue: number
    orders: number
  }>
  order_status: Array<{
    status: string
    count: number
  }>
  top_menu_items: Array<{
    name: string
    quantity_sold: number
    revenue: number
  }>
  order_types: Array<{
    type: string
    count: number
  }>
}

const ReportsPage: React.FC = () => {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('30')

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await adminApiClient.getReports(selectedPeriod)
      setReportsData(data)
    } catch (err: unknown) {
      setError(handleApiError(err))
      console.error('Failed to fetch reports:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedPeriod])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'PREPARING':
        return 'bg-orange-100 text-orange-800'
      case 'READY':
        return 'bg-green-100 text-green-800'
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const formatStatus = (status: string) => {
    return status
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <AdminLayout title="Reports" subtitle="Business analytics and insights">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading reports...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Reports" subtitle="Business analytics and insights">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Reports" subtitle="Business analytics and insights">
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-neutral-500" />
                <select
                  value={selectedPeriod}
                  onChange={e => setSelectedPeriod(e.target.value)}
                  className="border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  aria-label="Select time period"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                {reportsData && (
                  <div className="text-sm text-neutral-600">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {formatDate(reportsData.date_range.start)} -{' '}
                    {formatDate(reportsData.date_range.end)}
                  </div>
                )}

                <button
                  onClick={fetchReports}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {reportsData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {formatCurrency(reportsData.summary.total_revenue)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12.5% vs last period</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Total Orders</p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {reportsData.summary.total_orders.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <ShoppingBag className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8.2% vs last period</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Avg Order Value</p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {formatCurrency(reportsData.summary.avg_order_value)}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+3.8% vs last period</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Total Customers</p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {reportsData.summary.total_customers.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+15.3% vs last period</span>
                  </div>
                </motion.div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-800">Revenue Trend</h3>
                    <BarChart3 className="w-5 h-5 text-neutral-400" />
                  </div>

                  <div className="space-y-4">
                    {reportsData.revenue_chart.slice(-7).map(item => (
                      <div key={item.date} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                          <span className="text-sm text-neutral-600">{formatDate(item.date)}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-neutral-800">
                            {formatCurrency(item.revenue)}
                          </p>
                          <p className="text-xs text-neutral-500">{item.orders} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Order Status Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-800">Order Status</h3>
                    <PieChart className="w-5 h-5 text-neutral-400" />
                  </div>

                  <div className="space-y-3">
                    {reportsData.order_status.map(item => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                          >
                            {formatStatus(item.status)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-neutral-800">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Menu Items */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-neutral-800 mb-6">Top Menu Items</h3>

                  <div className="space-y-4">
                    {reportsData.top_menu_items.slice(0, 5).map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-secondary-700">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-800">{item.name}</p>
                            <p className="text-xs text-neutral-500">{item.quantity_sold} sold</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-neutral-800">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Order Types */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-neutral-800 mb-6">Order Types</h3>

                  <div className="space-y-4">
                    {reportsData.order_types.map(item => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.type === 'DELIVERY'
                                ? 'bg-blue-100 text-blue-800'
                                : item.type === 'PICKUP'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {item.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-neutral-800">{item.count}</span>
                          <p className="text-xs text-neutral-500">
                            {Math.round((item.count / reportsData.summary.total_orders) * 100)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default ReportsPage
