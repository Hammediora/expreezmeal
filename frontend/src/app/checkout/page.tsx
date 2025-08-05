'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StripeProvider from '@/components/StripeProvider'
import PaymentForm from '@/components/PaymentForm'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/api'
import { PickupCheckoutFormData, PickupCustomerInfo } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')

  const [formData, setFormData] = useState<PickupCheckoutFormData>({
    customer: {
      name: '',
      phone: '',
      email: '',
    },
    payment_method: 'card',
    special_instructions: '',
    tip_amount: 0,
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu')
    }
  }, [items, router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name.startsWith('customer.')) {
      const customerField = name.split('.')[1] as keyof PickupCustomerInfo
      setFormData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          [customerField]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'tip_amount' ? parseFloat(value) || 0 : value,
      }))
    }
  }

  const validateStep1 = () => {
    // For pickup, we only need customer contact info (name and phone)
    const { customer } = formData
    return (
      customer.name && // Customer name
      customer.phone // Customer phone
    )
  }

  const createOrder = async () => {
    if (!validateStep1()) {
      setError('Please fill in all required customer information')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const tipAmount = formData.tip_amount ?? 0
      // getTotal() already returns cents, and tipAmount should be in cents too
      const tipAmountCents = Math.round(tipAmount * 100) // Convert tip from dollars to cents

      const orderData = {
        items: items.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          special_instructions: item.special_instructions,
          customizations: item.customizations || [],
        })),
        delivery_address: {
          name: formData.customer.name,
          email: formData.customer.email || 'customer@expreezmeal.com',
          phone: formData.customer.phone,
        },
        payment_method: formData.payment_method,
        special_instructions: formData.special_instructions,
        tip_amount: tipAmountCents, // Tip in cents
      }

      // Create order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const order = await response.json()
      setOrderId(order.order_id)

      // Create payment intent
      const totalWithTipCents = getTotal() + tipAmountCents // Both are in cents
      const paymentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalWithTipCents, // Amount in cents for Stripe
            currency: 'usd',
            order_id: order.order_id,
            customer_email: formData.customer.email || 'customer@expreezmeal.com',
            customer_name: formData.customer.name,
            customer_phone: formData.customer.phone,
          }),
        }
      )

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json()
        throw new Error(errorData.error || 'Failed to create payment intent')
      }

      const { client_secret } = await paymentResponse.json()
      setClientSecret(client_secret)
      setCurrentStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/confirm-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntentId,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to confirm payment')
      }

      // Payment confirmed - email will be sent automatically by backend
      clearCart()
      router.push(`/order-confirmation?orderId=${orderId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment confirmation failed')
    }
  }

  const handlePaymentError = (error: string) => {
    setError(error)
  }

  const subtotal = getSubtotal() // in cents
  const tax = getTax() // in cents
  const tipAmount = formData.tip_amount ?? 0 // in dollars
  const tipAmountCents = Math.round(tipAmount * 100) // convert to cents
  const finalTotal = getTotal() + tipAmountCents // both in cents

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-2 sm:mb-4">
                Checkout
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 px-4">
                Complete your order for pickup - delicious Nigerian cuisine awaits!
              </p>
            </motion.div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8 sm:mb-12 px-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {[
                  { step: 1, label: 'Customer Info' },
                  { step: 2, label: 'Payment' },
                  { step: 3, label: 'Confirmation' },
                ].map(({ step, label }) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-colors text-sm sm:text-base ${
                          currentStep >= step
                            ? 'bg-gradient-to-br from-[#d4af37] to-[#facc15] text-white shadow-lg'
                            : 'bg-neutral-200 text-neutral-500'
                        }`}
                      >
                        {step}
                      </div>
                      <span
                        className={`text-xs mt-1 text-center max-w-[60px] sm:max-w-none ${currentStep >= step ? 'text-[#d4af37] font-medium' : 'text-neutral-500'}`}
                      >
                        {label}
                      </span>
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-8 sm:w-16 h-1 mt-[-12px] transition-colors ${
                          currentStep > step
                            ? 'bg-gradient-to-r from-[#d4af37] to-[#facc15]'
                            : 'bg-neutral-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-800 px-3 sm:px-4 py-3 rounded-lg mb-4 sm:mb-6 mx-4 lg:mx-0 text-sm sm:text-base"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Step 1: Customer Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 mx-4 lg:mx-0"
                  >
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-800 mb-4 sm:mb-6">
                      Pickup Information
                    </h2>

                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-green-800">
                            Pickup Location
                          </p>
                          <p className="text-xs text-green-600">
                            123 Main Street, New York, NY 10001
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customer.name"
                          value={formData.customer.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition-colors"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="customer.phone"
                          value={formData.customer.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition-colors"
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          name="customer.email"
                          value={formData.customer.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Special Instructions (optional)
                        </label>
                        <textarea
                          name="special_instructions"
                          value={formData.special_instructions}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition-colors"
                          placeholder="Any special requests for your order..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Tip Amount (optional)
                        </label>
                        <select
                          name="tip_amount"
                          value={formData.tip_amount}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition-colors"
                          title="Select tip amount"
                        >
                          <option value={0}>No tip</option>
                          <option value={subtotal * 0.15}>
                            15% - {formatCurrency((subtotal * 0.15) / 100)}
                          </option>
                          <option value={subtotal * 0.18}>
                            18% - {formatCurrency((subtotal * 0.18) / 100)}
                          </option>
                          <option value={subtotal * 0.2}>
                            20% - {formatCurrency((subtotal * 0.2) / 100)}
                          </option>
                          <option value={subtotal * 0.25}>
                            25% - {formatCurrency((subtotal * 0.25) / 100)}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <motion.button
                        onClick={createOrder}
                        disabled={isSubmitting || !validateStep1()}
                        className="bg-gradient-to-r from-[#d4af37] to-[#facc15] hover:from-[#c9a632] hover:to-[#e6b800] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          'Continue to Payment'
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment */}
                {currentStep === 2 && clientSecret && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-display font-bold text-neutral-800">
                        Payment Information
                      </h2>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-[#d4af37] hover:text-[#c9a632] font-medium transition-colors"
                      >
                        ← Back to Customer Info
                      </button>
                    </div>

                    <StripeProvider clientSecret={clientSecret}>
                      <PaymentForm
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        isLoading={isSubmitting}
                        amount={finalTotal} // finalTotal is already in cents
                      />
                    </StripeProvider>
                  </motion.div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6"
                >
                  <h3 className="text-xl font-display font-bold text-neutral-800 mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-4 mb-6">
                    {items.map(item => (
                      <div
                        key={`${item.id}-${item.customizations?.map(c => c.option_choice_id).join('-') || 'no-custom'}`}
                        className="flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-800">{item.name}</h4>
                          <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                          {item.customizations && item.customizations.length > 0 && (
                            <div className="text-xs text-neutral-500 mt-1">
                              {item.customizations.map((custom, idx) => (
                                <div key={idx}>+ {custom.choice_name}</div>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-neutral-800">
                          {formatCurrency(
                            (item.price * item.quantity +
                              (item.customizations?.reduce(
                                (sum, custom) => sum + (custom.price_modifier || 0),
                                0
                              ) || 0) *
                                item.quantity) /
                              100
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-neutral-200 pt-4 space-y-2">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal / 100)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Tax</span>
                      <span>{formatCurrency(tax / 100)}</span>
                    </div>
                    {tipAmount > 0 && (
                      <div className="flex justify-between text-neutral-600">
                        <span>Tip</span>
                        <span>{formatCurrency(tipAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-neutral-800 pt-2 border-t border-neutral-200">
                      <span>Total</span>
                      <span>{formatCurrency(finalTotal / 100)}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">Ready for Pickup</p>
                        <p className="text-xs text-green-600">Order ready in 10-15 minutes</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
