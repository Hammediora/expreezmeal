'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAdminAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/admin/login')
      }
    }
  }, [loading, isAuthenticated, router])

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Redirecting...</p>
      </div>
    </div>
  )
}
