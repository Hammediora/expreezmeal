'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { AdminStats } from '@/types'
import { formatCurrency } from '@/lib/api'
import { adminApiClient } from '@/lib/adminApi'

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Try to fetch from backend first, fall back to mock data
        try {
          const data = await adminApiClient.getDashboardStats()
          setStats(data)
        } catch (apiError) {
          console.warn('Failed to fetch from API, using mock data:', apiError)

          // Mock data for demonstration
          const mockStats: AdminStats = {
            total_orders: 248,
            total_revenue: 12847.5,
            orders_today: 15,
            revenue_today: 542.3,
            most_popular_items: [
              { item_name: 'Chicken Shawarma', order_count: 45, revenue: 1350.0 },
              { item_name: 'Beef Shawarma', order_count: 38, revenue: 1520.0 },
              { item_name: 'Jollof Rice', order_count: 32, revenue: 800.0 },
              { item_name: 'Zobo Drink', order_count: 28, revenue: 336.0 },
              { item_name: 'Meat Pie', order_count: 24, revenue: 432.0 },
            ],
            recent_orders: [],
          }
          setStats(mockStats)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Overview of your restaurant">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard" subtitle="Overview of your restaurant">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.total_revenue || 0),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'vs last month',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Orders',
      value: (stats?.total_orders || 0).toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      description: 'vs last month',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(stats?.revenue_today || 0),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'vs yesterday',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Orders Today',
      value: (stats?.orders_today || 0).toString(),
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: Clock,
      description: 'vs yesterday',
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening at your restaurant today."
      >
        <div className="space-y-6 xs:space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 xs:p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3 xs:mb-4">
                  <div
                    className={`w-10 h-10 xs:w-12 xs:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <card.icon className="w-5 h-5 xs:w-6 xs:h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-xs xs:text-sm font-medium px-2 py-1 rounded-full ${
                      card.changeType === 'positive'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {card.changeType === 'positive' ? (
                      <ArrowUpRight className="w-3 h-3 xs:w-4 xs:h-4" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 xs:w-4 xs:h-4" />
                    )}
                    <span>{card.change}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl xs:text-2xl font-bold text-neutral-800 mb-1">
                    {card.value}
                  </h3>
                  <p className="text-sm xs:text-base text-neutral-600 font-medium">{card.title}</p>
                  <p className="text-xs text-neutral-400 mt-1">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xs:gap-8">
            {/* Most Popular Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-neutral-200 p-4 xs:p-6"
            >
              <div className="flex items-center justify-between mb-4 xs:mb-6">
                <h3 className="text-lg xs:text-xl font-semibold text-neutral-800">
                  Most Popular Items
                </h3>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-black" />
                  <span className="text-sm text-neutral-500">Top 5</span>
                </div>
              </div>

              <div className="space-y-3 xs:space-y-4">
                {stats?.most_popular_items.slice(0, 5).map((item, index) => (
                  <div
                    key={item.item_name}
                    className="flex items-center justify-between p-3 xs:p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 xs:space-x-4">
                      <div
                        className={`w-8 h-8 xs:w-10 xs:h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black'
                            : index === 1
                              ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black'
                              : index === 2
                                ? 'bg-gradient-to-br from-yellow-600 to-yellow-700 text-black'
                                : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-black text-sm xs:text-base">
                          {item.item_name}
                        </p>
                        <p className="text-xs xs:text-sm text-black">{item.order_count} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-black text-sm xs:text-base">
                        {formatCurrency(item.revenue)}
                      </p>
                      <p className="text-xs text-black">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 xs:p-6"
            >
              <h3 className="text-lg xs:text-xl font-semibold text-neutral-800 mb-4 xs:mb-6">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button className="w-full btn-primary text-sm xs:text-base py-2 xs:py-3">
                  View New Orders
                </button>
                <button className="w-full btn-secondary text-sm xs:text-base py-2 xs:py-3">
                  Manage Menu
                </button>
                <button className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-4 py-2 xs:py-3 rounded-lg transition-colors text-sm xs:text-base">
                  Generate Report
                </button>
                <button className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-4 py-2 xs:py-3 rounded-lg transition-colors text-sm xs:text-base">
                  View Analytics
                </button>
              </div>

              {/* System Status */}
              <div className="mt-6 p-3 xs:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">System Status</span>
                </div>
                <p className="text-xs text-green-600">All systems operational</p>
                <p className="text-xs text-green-500 mt-1">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default AdminDashboard
