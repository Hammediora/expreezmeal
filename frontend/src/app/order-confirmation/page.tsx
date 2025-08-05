'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { apiClient, handleApiError, formatCurrency } from '@/lib/api'
import { Order } from '@/types'
import { ApiError } from 'next/dist/server/api-utils'

export default function OrderConfirmationPage() {
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
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"
            >
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-3 sm:mb-4">
                Order Confirmed!
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 mb-6 sm:mb-8">
                Thank you for your order! We&apos;re preparing your delicious Nigerian cuisine.
              </p>
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
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Order Status */}
              <div className="mt-6 p-4 bg-accent-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent-500 rounded-full mr-3"></div>
                  <span className="font-semibold text-neutral-800 capitalize">
                    Status: {order.status.replace('_', ' ').toLowerCase()}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mt-2">
                  Your order was placed on{' '}
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {order.estimated_delivery_time && (
                  <p className="text-sm text-neutral-600">
                    Estimated delivery:{' '}
                    {new Date(order.estimated_delivery_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
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
              className="space-y-4"
            >
              <h3 className="text-xl font-display font-bold text-neutral-800 mb-4">
                What&apos;s Next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-semibold text-neutral-800 mb-2">📧 Order Confirmation</h4>
                  <p className="text-sm text-neutral-600">
                    We&apos;ve sent a confirmation email with your order details.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-semibold text-neutral-800 mb-2">🍳 Preparation</h4>
                  <p className="text-sm text-neutral-600">
                    Our chefs are now preparing your fresh Nigerian cuisine.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-semibold text-neutral-800 mb-2">🚗 Delivery</h4>
                  <p className="text-sm text-neutral-600">
                    We&apos;ll notify you when your order is out for delivery.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-semibold text-neutral-800 mb-2">🎉 Enjoy!</h4>
                  <p className="text-sm text-neutral-600">
                    Sit back and get ready for an amazing dining experience.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/menu" className="btn-primary">
                  Order Again
                </Link>
                <Link href="/" className="btn-secondary">
                  Return Home
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
