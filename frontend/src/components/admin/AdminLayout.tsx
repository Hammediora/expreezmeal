'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AdminSidebar, { MobileSidebarToggle } from './AdminSidebar'
import { useAdminAuth } from '@/context/AdminAuthContext'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Dashboard', subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAdminAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MobileSidebarToggle onToggle={toggleSidebar} />
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-800">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm sm:text-base text-neutral-600 mt-1">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Current Time */}
              <div className="hidden sm:block text-right">
                <p className="text-sm text-neutral-500">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-neutral-400">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* User Profile Dropdown Trigger */}
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-neutral-50">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.full_name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-neutral-800">
                    {user?.full_name || 'Admin User'}
                  </p>
                  <p className="text-xs text-neutral-500">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-neutral-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-neutral-500">© 2024 ExpreeZmeal. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-sm text-neutral-500">
              <span>Admin Panel v1.0</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default AdminLayout
