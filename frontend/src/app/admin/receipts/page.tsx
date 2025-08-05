'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Search, Calendar, FileText, Filter, Eye } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { formatCurrency } from '@/lib/api'

interface Receipt {
  id: string
  order_id: string
  customer_name: string
  date: string
  total: number
  payment_status: 'COMPLETED' | 'PENDING' | 'FAILED'
  receipt_url?: string
}

const ReceiptsPage: React.FC = () => {
  const [receipts] = useState<Receipt[]>([
    {
      id: 'RCP-001',
      order_id: 'ORD-001',
      customer_name: 'John Doe',
      date: '2024-08-04T10:30:00Z',
      total: 31.57,
      payment_status: 'COMPLETED',
      receipt_url: '/receipts/RCP-001.pdf',
    },
    {
      id: 'RCP-002',
      order_id: 'ORD-002',
      customer_name: 'Jane Smith',
      date: '2024-08-04T09:15:00Z',
      total: 20.12,
      payment_status: 'COMPLETED',
      receipt_url: '/receipts/RCP-002.pdf',
    },
    {
      id: 'RCP-003',
      order_id: 'ORD-003',
      customer_name: 'Mike Johnson',
      date: '2024-08-03T15:45:00Z',
      total: 45.99,
      payment_status: 'COMPLETED',
      receipt_url: '/receipts/RCP-003.pdf',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch =
      receipt.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.customer_name.toLowerCase().includes(searchTerm.toLowerCase())

    const today = new Date()
    const receiptDate = new Date(receipt.date)

    let matchesDate = true
    if (dateFilter === 'today') {
      matchesDate = receiptDate.toDateString() === today.toDateString()
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      matchesDate = receiptDate >= weekAgo
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      matchesDate = receiptDate >= monthAgo
    }

    return matchesSearch && matchesDate
  })

  const handleDownloadReceipt = (receipt: Receipt) => {
    // In a real implementation, this would download the actual receipt
    console.log('Downloading receipt:', receipt.id)
    // For demo purposes, we'll just simulate a download
    const link = document.createElement('a')
    link.href = '#'
    link.download = `receipt-${receipt.order_id}.pdf`
    link.click()
  }

  const handleViewReceipt = (receipt: Receipt) => {
    // In a real implementation, this would open the receipt in a modal or new tab
    console.log('Viewing receipt:', receipt.id)
  }

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Receipts"
        subtitle={`Manage order receipts • ${filteredReceipts.length} receipts`}
      >
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID or customer name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-neutral-500" />
                  <select
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="border border-neutral-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    aria-label="Filter by date range"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>

              {/* Export Button */}
              <button className="flex items-center space-x-2 px-4 py-2.5 bg-[#5a8a73] text-white rounded-lg hover:bg-[#4a7360] transition-colors">
                <Download className="w-5 h-5" />
                <span>Export All</span>
              </button>
            </div>
          </div>

          {/* Receipts Table */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">
                      Receipt ID
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Order ID</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Customer</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Amount</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-neutral-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredReceipts.map((receipt, index) => (
                    <motion.tr
                      key={receipt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-neutral-400" />
                          <span className="font-mono text-sm font-medium text-neutral-800">
                            {receipt.id}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-neutral-600">
                          {receipt.order_id}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-medium text-neutral-800">
                          {receipt.customer_name}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-sm text-neutral-600">{formatDate(receipt.date)}</span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-semibold text-neutral-800">
                          {formatCurrency(receipt.total)}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            receipt.payment_status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : receipt.payment_status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {receipt.payment_status}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewReceipt(receipt)}
                            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                            aria-label={`View receipt ${receipt.id}`}
                          >
                            <Eye className="w-4 h-4 text-neutral-600" />
                          </button>
                          <button
                            onClick={() => handleDownloadReceipt(receipt)}
                            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                            aria-label={`Download receipt ${receipt.id}`}
                          >
                            <Download className="w-4 h-4 text-neutral-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReceipts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">No receipts found</h3>
                <p className="text-neutral-600">
                  {searchTerm || dateFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No receipts have been generated yet.'}
                </p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Total Receipts</p>
                  <p className="text-2xl font-bold text-neutral-800">{filteredReceipts.length}</p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-neutral-800">
                    {formatCurrency(
                      filteredReceipts.reduce((sum, receipt) => sum + receipt.total, 0)
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Completed Payments</p>
                  <p className="text-2xl font-bold text-neutral-800">
                    {filteredReceipts.filter(r => r.payment_status === 'COMPLETED').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Filter className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default ReceiptsPage
