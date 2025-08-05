'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { useAdminAuth } from '@/context/AdminAuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'manager' | 'staff'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'staff' }) => {
  const { user, loading, isAuthenticated } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/admin/login')
        return
      }

      // Check role permissions
      if (requiredRole === 'admin' && user?.role !== 'admin') {
        router.push('/admin/dashboard') // Redirect to dashboard if not admin
        return
      }

      if (requiredRole === 'manager' && !['admin', 'manager'].includes(user?.role || '')) {
        router.push('/admin/dashboard')
        return
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
   if (!isAuthenticated) {
    return null
  }

  // Check role permissions and show access denied if needed
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">Access Denied</h2>
          <p className="text-neutral-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (requiredRole === 'manager' && !['admin', 'manager'].includes(user?.role || '')) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">Access Denied</h2>
          <p className="text-neutral-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
