'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AdminUser, AdminLoginRequest } from '@/types'
import {
  adminAuth,
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  getTokenTimeRemaining,
  isTokenValid,
} from '@/lib/auth'

// Configuration constants
const AUTO_LOGOUT_THRESHOLD_SECONDS = 60

interface AdminAuthContextType {
  user: AdminUser | null
  loading: boolean
  login: (credentials: AdminLoginRequest) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  refreshToken: () => Promise<void>
  isAuthenticated: boolean
  tokenTimeRemaining: number
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

interface AdminAuthProviderProps {
  children: React.ReactNode
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [tokenTimeRemaining, setTokenTimeRemaining] = useState(0)
  const router = useRouter()

  // Function to update token time remaining
  const updateTokenTimeRemaining = useCallback(() => {
    const stored = getStoredAuth()
    if (stored && isTokenValid(stored.token)) {
      const remaining = getTokenTimeRemaining(stored.token)
      setTokenTimeRemaining(remaining)

      // Auto logout if token expires in less than AUTO_LOGOUT_THRESHOLD_SECONDS
      if (remaining < AUTO_LOGOUT_THRESHOLD_SECONDS && remaining > 0) {
        console.warn('Token expiring soon, logging out...')
        // Use clearStoredAuth directly to avoid circular dependency
        clearStoredAuth()
        setUser(null)
        setTokenTimeRemaining(0)
        router.push('/admin/login')
      }
    } else {
      setTokenTimeRemaining(0)
    }
  }, [router])

  // Function definitions
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      await adminAuth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearStoredAuth()
      setUser(null)
      setTokenTimeRemaining(0)
      setLoading(false)
      router.push('/admin/login')
    }
  }, [router])

  const refreshToken = useCallback(async () => {
    try {
      const response = await adminAuth.refreshToken()
      const stored = getStoredAuth()

      if (stored) {
        setStoredAuth(response.access_token, stored.user)
        updateTokenTimeRemaining()
        console.log('Token refreshed successfully')
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error
    }
  }, [updateTokenTimeRemaining])

  // Auto refresh token when it's about to expire
  const autoRefreshToken = useCallback(async () => {
    const stored = getStoredAuth()
    if (stored && isTokenValid(stored.token)) {
      const remaining = getTokenTimeRemaining(stored.token)

      // Refresh token if it expires in less than 5 minutes
      if (remaining < 300 && remaining > 60) {
        try {
          console.log('Auto-refreshing token...')
          await refreshToken()
        } catch (error) {
          console.error('Auto token refresh failed:', error)
          logout()
        }
      }
    }
  }, [refreshToken, logout])

  // Update token time remaining every minute
  useEffect(() => {
    updateTokenTimeRemaining()
    const interval = setInterval(updateTokenTimeRemaining, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [updateTokenTimeRemaining])

  // Auto refresh token check every 2 minutes
  useEffect(() => {
    const interval = setInterval(autoRefreshToken, 120000) // Check every 2 minutes
    return () => clearInterval(interval)
  }, [autoRefreshToken])

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const stored = getStoredAuth()
        if (stored) {
          // Verify token is still valid with server
          try {
            const verifiedUser = await adminAuth.verifyToken(stored.token)
            setUser(verifiedUser)
            updateTokenTimeRemaining()
          } catch (error) {
            console.error('Token verification failed:', error)
            clearStoredAuth()
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        clearStoredAuth()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [updateTokenTimeRemaining])

  const login = async (credentials: AdminLoginRequest) => {
    try {
      setLoading(true)
      const response = await adminAuth.login(credentials)

      setStoredAuth(response.access_token, response.user)
      setUser(response.user)
      updateTokenTimeRemaining()

      // Redirect to dashboard
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logoutAll = async () => {
    try {
      setLoading(true)
      await adminAuth.logoutAll()
    } catch (error) {
      console.error('Logout all error:', error)
    } finally {
      clearStoredAuth()
      setUser(null)
      setTokenTimeRemaining(0)
      setLoading(false)
      router.push('/admin/login')
    }
  }

  const value: AdminAuthContextType = {
    user,
    loading,
    login,
    logout,
    logoutAll,
    refreshToken,
    isAuthenticated: !!user,
    tokenTimeRemaining,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export default AdminAuthProvider
