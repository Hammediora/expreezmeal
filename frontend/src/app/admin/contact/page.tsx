'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Eye,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  DollarSign,
  XCircle,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { contactApi } from '@/lib/api'
import { ContactInquiry } from '@/types'

const ContactInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null)
  const [filter, setFilter] = useState<{
    status: string
    inquiry_type: string
  }>({
    status: '',
    inquiry_type: '',
  })

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await contactApi.getContactInquiries({
        status: filter.status || undefined,
        inquiry_type: filter.inquiry_type || undefined,
      })
      setInquiries(response.inquiries)
    } catch (err) {
      console.error('Failed to fetch inquiries:', err)
      setError('Failed to load contact inquiries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const updateInquiryStatus = async (inquiryId: string, status: string, adminNotes?: string) => {
    try {
      await contactApi.updateInquiryStatus(inquiryId, status, adminNotes)
      await fetchInquiries() // Refresh the list
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry({
          ...selectedInquiry,
          status: status as 'new' | 'in_progress' | 'resolved' | 'closed',
          admin_notes: adminNotes,
        })
      }
    } catch (err) {
      console.error('Failed to update inquiry status:', err)
    }
  }

  const getStatusBadge = (status: string, isRead: boolean) => {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full'
    const readIndicator = !isRead ? '🔴 ' : ''

    switch (status) {
      case 'new':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{readIndicator}New</span>
        )
      case 'in_progress':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            {readIndicator}In Progress
          </span>
        )
      case 'resolved':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {readIndicator}Resolved
          </span>
        )
      case 'closed':
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{readIndicator}Closed</span>
        )
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{readIndicator}Unknown</span>
        )
    }
  }

  const getInquiryTypeBadge = (type: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded'

    switch (type) {
      case 'catering':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>🍽️ Catering</span>
      case 'order':
        return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>📦 Order</span>
      case 'feedback':
        return <span className={`${baseClasses} bg-teal-100 text-teal-800`}>💬 Feedback</span>
      case 'partnership':
        return (
          <span className={`${baseClasses} bg-indigo-100 text-indigo-800`}>🤝 Partnership</span>
        )
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>❓ General</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Contact Inquiries" subtitle="Manage customer inquiries and requests">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Contact Inquiries" subtitle="Manage customer inquiries and requests">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchInquiries}
              className="px-4 py-2 bg-[#5a8a73] text-white rounded-lg hover:bg-[#4a7360]"
            >
              Try Again
            </button>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Contact Inquiries" subtitle="Manage customer inquiries and requests">
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filter.status}
                  onChange={e => setFilter({ ...filter, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  aria-label="Filter by status"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Type
                </label>
                <select
                  value={filter.inquiry_type}
                  onChange={e => setFilter({ ...filter, inquiry_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  aria-label="Filter by inquiry type"
                >
                  <option value="">All Types</option>
                  <option value="general">General</option>
                  <option value="order">Order</option>
                  <option value="catering">Catering</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
            </div>
          </div>

          {/* Inquiries List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {inquiries.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No contact inquiries found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inquiries.map(inquiry => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {inquiry.name}
                              </div>
                              <div className="text-sm text-gray-500">{inquiry.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{inquiry.subject}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {inquiry.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getInquiryTypeBadge(inquiry.inquiry_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(inquiry.status, inquiry.is_read)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(inquiry.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                            title="View inquiry details"
                            aria-label="View inquiry details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Inquiry Detail Modal */}
          {selectedInquiry && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedInquiry.subject}
                      </h2>
                      <div className="flex items-center space-x-2 mt-2">
                        {getInquiryTypeBadge(selectedInquiry.inquiry_type)}
                        {getStatusBadge(selectedInquiry.status, selectedInquiry.is_read)}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Close details"
                      aria-label="Close inquiry details"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="font-medium">{selectedInquiry.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-500 mr-2" />
                          <a
                            href={`mailto:${selectedInquiry.email}`}
                            className="text-primary-600 hover:underline"
                          >
                            {selectedInquiry.email}
                          </a>
                        </div>
                        {selectedInquiry.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-500 mr-2" />
                            <a
                              href={`tel:${selectedInquiry.phone}`}
                              className="text-primary-600 hover:underline"
                            >
                              {selectedInquiry.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-500 mr-2" />
                          <span>{formatDate(selectedInquiry.created_at)}</span>
                        </div>
                      </div>

                      {/* Catering Details */}
                      {selectedInquiry.inquiry_type === 'catering' && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Event Details</h4>
                          <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                            {selectedInquiry.event_date && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-purple-600 mr-2" />
                                <span>{selectedInquiry.event_date}</span>
                              </div>
                            )}
                            {selectedInquiry.guest_count && (
                              <div className="flex items-center">
                                <Users className="w-4 h-4 text-purple-600 mr-2" />
                                <span>{selectedInquiry.guest_count} guests</span>
                              </div>
                            )}
                            {selectedInquiry.budget_range && (
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 text-purple-600 mr-2" />
                                <span>{selectedInquiry.budget_range}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message and Actions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Message</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="whitespace-pre-wrap text-gray-700">
                          {selectedInquiry.message}
                        </p>
                      </div>

                      {selectedInquiry.special_requirements && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Special Requirements</h4>
                          <div className="bg-yellow-50 rounded-lg p-4">
                            <p className="text-gray-700">{selectedInquiry.special_requirements}</p>
                          </div>
                        </div>
                      )}

                      {/* Status Actions */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateInquiryStatus(selectedInquiry.id, 'in_progress')}
                            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => updateInquiryStatus(selectedInquiry.id, 'resolved')}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Mark Resolved
                          </button>
                          <button
                            onClick={() => updateInquiryStatus(selectedInquiry.id, 'closed')}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                            className="px-3 py-1 bg-[#5a8a73] text-white rounded text-sm hover:bg-[#4a7360]"
                          >
                            Reply via Email
                          </a>
                          {selectedInquiry.phone && (
                            <a
                              href={`tel:${selectedInquiry.phone}`}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              Call Customer
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default ContactInquiriesPage
