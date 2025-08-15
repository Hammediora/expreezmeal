'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Clock, Mail, Phone, MapPin, Star, Download, Share2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { apiClient, handleApiError, formatCurrency } from '@/lib/api'
import { Order } from '@/types'
import { ApiError } from 'next/dist/server/api-utils'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    const fetchOrder = async () => {
      try {
        const orderData = await apiClient.getOrder(orderId)
        setOrder(orderData)
      } catch (err) {
        setError(handleApiError(err as ApiError))
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="section-padding">
          <div className="container-custom text-center">
            <h1 className="text-4xl font-display font-bold text-neutral-800 mb-4">
              Order Not Found
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              {error || "We couldn't find the order you're looking for."}
            </p>
            <Link href="/" className="btn-primary">
              Return Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center px-4">
            {/* Success Icon and Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"
            >
              <Check className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 bg-green-200 rounded-full"
              />
            </motion.div>

            {/* Header with better messaging */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-3 sm:mb-4">
                🎉 Order Successful!
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 mb-6 sm:mb-8">
                Thank you for choosing ExpreeZmeal! Your order has been confirmed and we&apos;re
                already preparing your delicious meal.
              </p>

              {/* Order Number Highlight */}
              <div className="inline-flex items-center bg-accent-50 px-6 py-3 rounded-full mb-6">
                <span className="text-sm font-medium text-neutral-600 mr-2">Order Number:</span>
                <span className="text-lg font-bold text-accent-600">
                  #{order.id.slice(-8).toUpperCase()}
                </span>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              <button
                onClick={() =>
                  navigator.share?.({
                    title: 'ExpreeZmeal Order',
                    text: `Just placed an order at ExpreeZmeal! Order #${order.id.slice(-8).toUpperCase()}`,
                    url: window.location.href,
                  })
                }
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors">
                <Download className="w-4 h-4" />
                Receipt
              </button>
            </motion.div>

            {/* Order Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card p-8 text-left mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-neutral-800">Order Details</h2>
                <span className="text-sm text-neutral-500">
                  Order #{order.id.slice(-8).toUpperCase()}
                </span>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-neutral-100"
                  >
                    <div>
                      <h4 className="font-medium text-neutral-800">
                        Item #{item.menu_item_id.slice(-6)}
                      </h4>
                      <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                      {item.special_instructions && (
                        <p className="text-sm text-neutral-500 italic">
                          Note: {item.special_instructions}
                        </p>
                      )}
                    </div>
                    <span className="font-medium text-neutral-800">
                      {formatCurrency(item.total_price)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                {order.tip > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>Tip</span>
                    <span>{formatCurrency(order.tip)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-neutral-800 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>

              {/* Order Status */}
              <div className="mt-6 p-6 bg-accent-50 rounded-lg border border-accent-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-accent-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="font-semibold text-neutral-800 capitalize">
                      Status: {order.status.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                  <span className="text-sm text-accent-600 font-medium">Live Updates</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-neutral-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Ordered:{' '}
                    {new Date(order.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Est. Ready:{' '}
                    {new Date(Date.now() + 15 * 60000).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                {order.estimated_delivery_time && (
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-accent-600" />
                      <span className="text-sm font-medium">
                        Estimated delivery:{' '}
                        {new Date(order.estimated_delivery_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              {order.special_instructions && (
                <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-semibold text-neutral-800 mb-2">Special Instructions</h4>
                  <p className="text-neutral-600">{order.special_instructions}</p>
                </div>
              )}
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-display font-bold text-neutral-800 mb-6">
                What Happens Next?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="p-6 bg-blue-50 rounded-xl border border-blue-100"
                >
                  <div className="flex items-center mb-3">
                    <Mail className="w-6 h-6 text-blue-600 mr-3" />
                    <h4 className="font-bold text-neutral-800">Email Confirmation</h4>
                  </div>
                  <p className="text-sm text-neutral-600">
                    We&apos;ve sent a detailed confirmation email to your inbox with your order
                    details and receipt.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="p-6 bg-orange-50 rounded-xl border border-orange-100"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 text-orange-600 mr-3">🍳</div>
                    <h4 className="font-bold text-neutral-800">Kitchen Preparation</h4>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Our expert chefs are now preparing your fresh Nigerian cuisine with authentic
                    ingredients.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="p-6 bg-green-50 rounded-xl border border-green-100"
                >
                  <div className="flex items-center mb-3">
                    <Phone className="w-6 h-6 text-green-600 mr-3" />
                    <h4 className="font-bold text-neutral-800">Status Updates</h4>
                  </div>
                  <p className="text-sm text-neutral-600">
                    We&apos;ll keep you updated via email and SMS when your order is ready for
                    pickup or out for delivery.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="p-6 bg-purple-50 rounded-xl border border-purple-100"
                >
                  <div className="flex items-center mb-3">
                    <Star className="w-6 h-6 text-purple-600 mr-3" />
                    <h4 className="font-bold text-neutral-800">Enjoy & Review</h4>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Enjoy your authentic Nigerian meal and let us know how we did! Your feedback
                    helps us improve.
                  </p>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/menu" className="btn-primary flex items-center justify-center gap-2">
                  <span>🍽️</span>
                  Order Again
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Contact Us
                </Link>
                <Link href="/" className="btn-outline flex items-center justify-center gap-2">
                  Return Home
                </Link>
              </div>

              {/* Additional Help */}
              <div className="mt-8 p-6 bg-neutral-50 rounded-xl text-center">
                <h4 className="font-bold text-neutral-800 mb-3">Need Help?</h4>
                <p className="text-sm text-neutral-600 mb-4">
                  If you have any questions about your order, don&apos;t hesitate to reach out!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center justify-center gap-2 text-accent-600 hover:text-accent-700"
                  >
                    <Phone className="w-4 h-4" />
                    Call: (312) 555-0123
                  </a>
                  <a
                    href="mailto:info@bellocraft.com"
                    className="flex items-center justify-center gap-2 text-accent-600 hover:text-accent-700"
                  >
                    <Mail className="w-4 h-4" />
                    Email: info@bellocraft.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-elegant-cream flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  )
}
