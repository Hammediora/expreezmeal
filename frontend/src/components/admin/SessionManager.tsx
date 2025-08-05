'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Shield, LogOut, RefreshCw } from 'lucide-react'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { adminAuth, AdminSession } from '@/lib/auth'

interface SessionManagerProps {
  className?: string
}

const SessionManager: React.FC<SessionManagerProps> = ({ className = '' }) => {
  const { user, tokenTimeRemaining, refreshToken, logoutAll, loading: authLoading } = useAdminAuth()
  const [sessions, setSessions] = useState<AdminSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadSessions = useCallback(async () => {
    // Double-check that we still have a user before trying to load sessions
    if (!user) {
      console.log('Debug: loadSessions called but no user available')
      setSessions([])
      setSessionsLoading(false)
      return
    }

    try {
      setSessionsLoading(true)
      console.log('Debug: Starting to load sessions for user:', user.email)
      const response = await adminAuth.getSessions()
      setSessions(response.sessions)
      console.log('Debug: Successfully loaded sessions:', response.sessions.length)
    } catch (error) {
      console.error('Failed to load sessions:', error)
      // If there's no authentication token, just set empty sessions
      setSessions([])
    } finally {
      setSessionsLoading(false)
    }
  }, [user])

  useEffect(() => {
    // Only load sessions if user is authenticated and auth context is not loading
    if (user && !authLoading) {
      loadSessions()
    } else {
      // If no user or still loading auth, clear sessions and stop loading
      setSessions([])
      setSessionsLoading(false)
    }
  }, [user, authLoading, loadSessions])

  const handleRefreshToken = async () => {
    try {
      setRefreshing(true)
      await refreshToken()
      await loadSessions() // Reload sessions after refresh
    } catch (error) {
      console.error('Failed to refresh token:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleLogoutAll = async () => {
    if (
      confirm(
        'Are you sure you want to logout from all devices? This will end all active sessions.'
      )
    ) {
      await logoutAll()
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

  if (!user) return null

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Session Management
        </h3>
        <button
          onClick={handleRefreshToken}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Token
        </button>
      </div>

      {/* Token Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Session:</span>
          <div className="flex items-center">
            {tokenTimeRemaining > 300 ? (
              <span className="text-green-600 font-medium">
                {formatTimeRemaining(tokenTimeRemaining)}
              </span>
            ) : tokenTimeRemaining > 60 ? (
              <span className="text-yellow-600 font-medium">
                Expiring Soon ({formatTimeRemaining(tokenTimeRemaining)})
              </span>
            ) : (
              <span className="text-red-600 font-medium">Expired</span>
            )}
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Session Management</h4>
          <button
            onClick={handleLogoutAll}
            className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout All Devices
          </button>
        </div>

        {sessionsLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <span className="font-medium text-gray-900">
                    {sessions.length} Active Sessions
                  </span>
                  <p className="text-sm text-gray-600">Signed in on {sessions.length} device(s)</p>
                </div>
              </div>
              <button
                onClick={loadSessions}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security Tips */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h5 className="font-medium text-amber-800 mb-2">Security Tips</h5>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Regularly review your active sessions</li>
          <li>• Logout from devices you no longer use</li>
          <li>• Use &ldquo;Logout All&rdquo; if you suspect unauthorized access</li>
          <li>• Your session will auto-refresh when it&rsquo;s about to expire</li>
        </ul>
      </div>
    </div>
  )
}

export default SessionManager
