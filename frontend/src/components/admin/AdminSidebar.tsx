'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  ChefHat,
  Receipt,
  LogOut,
  Menu,
  X,
  Settings,
  BarChart3,
  Clock,
  Shield,
} from 'lucide-react'
import { useAdminAuth } from '@/context/AdminAuthContext'

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    requiredRole: 'staff' as const,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    requiredRole: 'staff' as const,
  },
  {
    name: 'Menu',
    href: '/admin/menu',
    icon: ChefHat,
    requiredRole: 'manager' as const,
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
    requiredRole: 'manager' as const,
  },
  {
    name: 'Receipts',
    href: '/admin/receipts',
    icon: Receipt,
    requiredRole: 'staff' as const,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    requiredRole: 'admin' as const,
  },
]

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname()
  const { user, logout, tokenTimeRemaining } = useAdminAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return 'Expired'

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getTokenStatusColor = (seconds: number): string => {
    if (seconds > 1800) return 'text-green-600' // > 30 minutes
    if (seconds > 300) return 'text-yellow-600' // > 5 minutes
    return 'text-red-600' // < 5 minutes
  }

  // Filter menu items based on user role
  const visibleItems = sidebarItems.filter(item => {
    if (!user) return false

    if (item.requiredRole === 'admin') {
      return user.role === 'admin'
    }
    if (item.requiredRole === 'manager') {
      return ['admin', 'manager'].includes(user.role)
    }
    return true // staff level access
  })

  const sidebarContent = (
    <motion.div
      className="h-full bg-white border-r border-neutral-200 flex flex-col"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      exit={{ x: -280 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-display font-bold text-neutral-800">
                ExpreeZmeal
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 sm:p-6 bg-neutral-50 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {user?.full_name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">
              {user?.full_name || 'Admin User'}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                user?.role === 'admin'
                  ? 'bg-secondary-100 text-secondary-700'
                  : user?.role === 'manager'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {user?.role?.charAt(0).toUpperCase()}
              {user?.role?.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 sm:p-6 space-y-2">
        {visibleItems.map(item => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-secondary-50 text-secondary-700 border border-secondary-200'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-secondary-600' : 'text-neutral-500'}`} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Session Status */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-neutral-500" />
              <span className="text-neutral-600">Session:</span>
            </div>
            <span className={`font-medium ${getTokenStatusColor(tokenTimeRemaining)}`}>
              {formatTimeRemaining(tokenTimeRemaining)}
            </span>
          </div>
          {tokenTimeRemaining < 300 && tokenTimeRemaining > 0 && (
            <div className="mt-2 text-xs text-yellow-600 flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              Session expiring soon
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 sm:p-6 border-t border-neutral-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 h-full">{sidebarContent}</div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
            />

            {/* Sidebar */}
            <div className="lg:hidden fixed left-0 top-0 w-80 h-full z-50">{sidebarContent}</div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface MobileSidebarToggleProps {
  onToggle: () => void
}

export const MobileSidebarToggle: React.FC<MobileSidebarToggleProps> = ({ onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
      aria-label="Open sidebar menu"
    >
      <Menu className="w-6 h-6 text-neutral-600" />
    </button>
  )
}

export default AdminSidebar
