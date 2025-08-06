'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useAdminAuth } from '@/context/AdminAuthContext'

const AdminLogin = () => {
  const router = useRouter()
  const { login, loading, isAuthenticated } = useAdminAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [loading, isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(formData)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string }
      setError(error.response?.data?.error || error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@expreezmeal.com',
      password: 'admin123',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
          <p className="text-neutral-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center py-6 xs:py-8 sm:py-12 px-3 xs:px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-sm xs:max-w-md w-full space-y-6 xs:space-y-8"
      >
        {/* Logo and Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-14 h-14 xs:w-16 xs:h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-3 xs:mb-4 shadow-lg border border-secondary-400"
          >
            <Image
              src="/images/headerLogo.png"
              alt="ExpreeZmeal Logo"
              width={60}
              height={60}
              className="w-10 h-10 xs:w-10 xs:h-10 object-fill"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl xs:text-3xl font-display font-bold text-white mb-2"
          >
            ExpreeZmeal Admin
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm xs:text-base text-neutral-300"
          >
            Sign in to manage your restaurant
          </motion.p>
        </div>

        {/* Demo Credentials Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 xs:p-4 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs xs:text-sm font-medium text-blue-200">Demo Credentials</p>
              <p className="text-xs text-blue-300">Click to auto-fill</p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-3 py-1.5 xs:px-4 xs:py-2 bg-blue-600 text-white text-xs xs:text-sm font-medium rounded-lg hover:bg-blue-500 transition-colors shadow-md"
            >
              Use Demo
            </button>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-neutral-200/50 p-6 xs:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 xs:p-4"
              >
                <p className="text-red-600 text-sm xs:text-base font-medium">{error}</p>
              </motion.div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-800 mb-1 xs:mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 xs:h-5 xs:w-5 text-neutral-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 xs:px-4 xs:py-3 pl-10 xs:pl-12 border border-neutral-400 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 focus:z-10 text-sm xs:text-base bg-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-neutral-800 mb-1 xs:mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 xs:h-5 xs:w-5 text-neutral-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 xs:px-4 xs:py-3 pl-10 xs:pl-12 pr-10 xs:pr-12 border border-neutral-400 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 focus:z-10 text-sm xs:text-base bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 xs:h-5 xs:w-5 text-neutral-500 hover:text-neutral-700" />
                  ) : (
                    <Eye className="h-4 w-4 xs:h-5 xs:w-5 text-neutral-500 hover:text-neutral-700" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 xs:py-3 px-4 border border-transparent text-sm xs:text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-4 xs:mt-6 text-center">
            <p className="text-xs xs:text-sm text-neutral-600">
              Need help?{' '}
              <button className="font-semibold text-secondary-600 hover:text-secondary-500 transition-colors">
                Contact Support
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <p className="text-xs xs:text-sm text-neutral-400">
            © 2024 ExpreeZmeal. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
