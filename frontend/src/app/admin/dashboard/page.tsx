'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import SessionManager from '@/components/admin/SessionManager'
import { AdminStats } from '@/types'
import { formatCurrency } from '@/lib/api'

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // For demo purposes, we'll use mock data
        // In production, uncomment the line below
        // const data = await adminApiClient.getDashboardStats()

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
          ],
          recent_orders: [],
        }

        setStats(mockStats)
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
    },
    {
      title: 'Total Orders',
      value: (stats?.total_orders || 0).toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      description: 'vs last month',
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(stats?.revenue_today || 0),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'vs yesterday',
    },
    {
      title: 'Orders Today',
      value: (stats?.orders_today || 0).toString(),
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: Clock,
      description: 'vs yesterday',
    },
  ]

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening at your restaurant today."
      >
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      card.changeType === 'positive'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {card.changeType === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{card.change}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-800 mb-1">{card.value}</h3>
                  <p className="text-sm text-neutral-500">{card.title}</p>
                  <p className="text-xs text-neutral-400 mt-1">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Popular Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-800">Most Popular Items</h3>
                <Star className="w-5 h-5 text-secondary-600" />
              </div>

              <div className="space-y-4">
                {stats?.most_popular_items.map((item, index) => (
                  <div key={item.item_name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          index === 0
                            ? 'bg-secondary-100 text-secondary-700'
                            : index === 1
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">{item.item_name}</p>
                        <p className="text-sm text-neutral-500">{item.order_count} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-800">
                        {formatCurrency(item.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-800">Quick Actions</h3>
                <Users className="w-5 h-5 text-primary-600" />
              </div>

              <div className="space-y-3">
                <a
                  href="/admin/orders"
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-secondary-300 hover:bg-secondary-50 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-5 h-5 text-neutral-600 group-hover:text-secondary-600" />
                    <span className="font-medium text-neutral-800">View Orders</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-secondary-600" />
                </a>

                <a
                  href="/admin/menu"
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                    <span className="font-medium text-neutral-800">Manage Menu</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
                </a>

                <a
                  href="/admin/receipts"
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-accent-300 hover:bg-accent-50 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-neutral-600 group-hover:text-accent-600" />
                    <span className="font-medium text-neutral-800">Generate Reports</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-accent-600" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
          >
            <h3 className="text-lg font-semibold text-neutral-800 mb-6">Recent Activity</h3>

            <div className="space-y-4">
              {/* Mock recent activities */}
              {[
                { action: 'New order received', time: '2 minutes ago', type: 'order' },
                { action: 'Menu item updated', time: '15 minutes ago', type: 'menu' },
                { action: 'Order completed', time: '23 minutes ago', type: 'order' },
                { action: 'Payment received', time: '35 minutes ago', type: 'payment' },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.type === 'order'
                        ? 'bg-green-500'
                        : activity.type === 'menu'
                          ? 'bg-blue-500'
                          : 'bg-secondary-500'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">{activity.action}</p>
                    <p className="text-xs text-neutral-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Session Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SessionManager />
          </motion.div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default AdminDashboard
