'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  User,
  Save,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { adminApiClient } from '@/lib/adminApi'
import { handleApiError } from '@/lib/api'

interface AdminUser {
  id: string
  full_name: string
  email: string
  phone?: string
  is_superuser: boolean
  created_at: string
  last_login?: string
  last_activity?: string
}

interface CreateAdminData {
  full_name: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
  role: 'admin' | 'manager' | 'staff'
}

const AdminSettingsPage: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newAdmin, setNewAdmin] = useState<CreateAdminData>({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
  })

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await adminApiClient.getAdminUsers()
      setAdmins(data.admins)
    } catch (err: unknown) {
      setError(handleApiError(err))
      console.error('Failed to fetch admin users:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newAdmin.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      setError('')
      await adminApiClient.createAdminUser({
        full_name: newAdmin.full_name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        password: newAdmin.password,
        role: newAdmin.role,
      })

      setSuccessMessage('Admin user created successfully!')
      setShowCreateModal(false)
      setNewAdmin({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'staff',
      })
      fetchAdmins()

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err: unknown) {
      setError(handleApiError(err))
    }
  }

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAdmin) return

    try {
      setError('')
      await adminApiClient.updateAdminUser(editingAdmin.id, {
        full_name: editingAdmin.full_name,
        email: editingAdmin.email,
        phone: editingAdmin.phone,
      })

      setSuccessMessage('Admin user updated successfully!')
      setShowEditModal(false)
      setEditingAdmin(null)
      fetchAdmins()

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err: unknown) {
      setError(handleApiError(err))
    }
  }

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete admin user "${adminName}"? This action cannot be undone.`
      )
    ) {
      return
    }

    try {
      setError('')
      await adminApiClient.deleteAdminUser(adminId)
      setSuccessMessage('Admin user deleted successfully!')
      fetchAdmins()
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err: unknown) {
      setError(handleApiError(err))
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRoleBadgeColor = (isSuper: boolean) => {
    return isSuper
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-blue-100 text-blue-800 border-blue-200'
  }

  if (loading) {
    return (
      <AdminLayout title="Settings" subtitle="Manage admin users and system settings">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Settings" subtitle="Manage admin users and system settings">
        <div className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-600 font-medium">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Admin Users Section */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-secondary-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-800">Admin Users</h2>
                    <p className="text-sm text-neutral-600">
                      Manage admin user accounts and permissions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Admin</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-neutral-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-800">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-800">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-800">
                        Last Login
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-800">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {admins.map((admin, index) => (
                      <motion.tr
                        key={admin.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-secondary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-neutral-800">{admin.full_name}</p>
                              <p className="text-sm text-neutral-500">{admin.email}</p>
                              {admin.phone && (
                                <p className="text-xs text-neutral-400">{admin.phone}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(admin.is_superuser)}`}
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {admin.is_superuser ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="text-sm text-neutral-600">
                            {formatDate(admin.last_login)}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="text-sm text-neutral-600">
                            {formatDate(admin.created_at)}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingAdmin(admin)
                                setShowEditModal(true)
                              }}
                              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                              aria-label="Edit admin"
                              title="Edit admin user"
                            >
                              <Edit className="w-4 h-4 text-neutral-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin.id, admin.full_name)}
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                              aria-label="Delete admin"
                              title="Delete admin user"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {admins.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      No admin users found
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      Create your first admin user to get started.
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                    >
                      Add Admin User
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Create Admin Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
              >
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-800">Create Admin User</h3>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                      aria-label="Close create admin modal"
                      title="Close create admin modal"
                    >
                      <X className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAdmin.full_name}
                      onChange={e => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={newAdmin.email}
                      onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={newAdmin.phone}
                      onChange={e => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Role *
                    </label>
                    <select
                      value={newAdmin.role}
                      onChange={e =>
                        setNewAdmin({
                          ...newAdmin,
                          role: e.target.value as 'admin' | 'manager' | 'staff',
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      aria-label="Select user role"
                    >
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={newAdmin.password}
                      onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Enter password"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={newAdmin.confirmPassword}
                      onChange={e => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Confirm password"
                      minLength={6}
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Create Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Edit Admin Modal */}
          {showEditModal && editingAdmin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
              >
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-800">Edit Admin User</h3>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                      aria-label="Close edit admin modal"
                      title="Close edit admin modal"
                    >
                      <X className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleUpdateAdmin} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingAdmin.full_name}
                      onChange={e =>
                        setEditingAdmin({ ...editingAdmin, full_name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Enter full name"
                      title="Full name of the admin user"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={editingAdmin.email}
                      onChange={e => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Enter email address"
                      title="Email address of the admin user"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editingAdmin.phone || ''}
                      onChange={e => setEditingAdmin({ ...editingAdmin, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Enter phone number"
                      title="Phone number of the admin user"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default AdminSettingsPage
