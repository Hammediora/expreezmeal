'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Check,
  User,
  CreditCard,
  Phone,
  Mail,
  FileText,
  DollarSign,
  ShoppingCart,
  MapPin,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StripeProvider from '@/components/StripeProvider'
import PaymentForm from '@/components/PaymentForm'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/api'
import { BUSINESS_INFO } from '@/lib/constants'
import { PickupCheckoutFormData, PickupCustomerInfo } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')
  const [orderCompleted, setOrderCompleted] = useState(false) // Track if order was completed

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

  // Redirect if cart is empty (but not if order was just completed)
  useEffect(() => {
    if (items.length === 0 && !orderCompleted) {
      router.push('/menu')
    }
  }, [items, router, orderCompleted])

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
          email: formData.customer.email || BUSINESS_INFO.contact.emails.customer,
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
            customer_email: formData.customer.email || BUSINESS_INFO.contact.emails.customer,
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
      setOrderCompleted(true) // Mark order as completed to prevent cart-empty redirect
      clearCart()

      // Small delay to ensure state updates are processed before redirect
      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${orderId}`)
      }, 100)
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
  //bg-[#fefcf8]
  // bg-gradient-to-t from-[#2f2e2b] to-[#999792]   from-[#83ebfd] to-[#d49902]
  // bg-gradient-to-br from-emerald-900 via-slate-800 to-teal-900

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-8 sm:py-16 lg:py-20 min-h-screen bg-gradient-to-br from-emerald-900/10 via-slate-800/90 to-teal-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6 sm:mb-8 lg:mb-12"
            >
              <div className="flex flex-col xs:flex-row items-center justify-center space-y-2 xs:space-y-0 xs:space-x-3 mb-3 sm:mb-4 lg:mb-6">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
                  Checkout
                </h1>
              </div>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-emerald-100 px-2 xs:px-4 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                Complete your order for pickup - exquisite Nigerian cuisine crafted with passion
                awaits your arrival
              </p>
            </motion.div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-6 sm:mb-8 lg:mb-12 px-2 xs:px-4">
              <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-6 lg:space-x-8">
                {[
                  { step: 1, label: 'Customer Info', Icon: User, iconColor: 'text-blue-600' },
                  { step: 2, label: 'Payment', Icon: CreditCard, iconColor: 'text-green-600' },
                  { step: 3, label: 'Confirmation', Icon: Check, iconColor: 'text-purple-600' },
                ].map(({ step, label, Icon, iconColor }) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center group">
                      <div
                        className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-xs xs:text-sm sm:text-base lg:text-lg relative overflow-hidden ${
                          currentStep >= step
                            ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white shadow-xl shadow-emerald-600/25 transform scale-105'
                            : 'bg-white shadow-lg border-2 border-neutral-200 hover:border-emerald-300'
                        }`}
                      >
                        {currentStep >= step && (
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-emerald-600/30 animate-pulse opacity-30"></div>
                        )}
                        <span className="relative z-10">
                          {currentStep > step ? (
                            <Check className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Icon
                              className={`w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ${currentStep >= step ? '' : iconColor}`}
                            />
                          )}
                        </span>
                      </div>
                      <span
                        className={`text-xs xs:text-xs sm:text-sm mt-1 xs:mt-2 text-center max-w-[60px] xs:max-w-[70px] sm:max-w-none font-medium transition-colors duration-300 leading-tight ${
                          currentStep >= step ? 'text-emerald-300' : 'text-emerald-200'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-8 xs:w-12 sm:w-20 lg:w-24 h-1 mt-[-12px] xs:mt-[-16px] transition-all duration-500 rounded-full ${
                          currentStep > step
                            ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 shadow-sm'
                            : 'bg-neutral-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 xs:gap-6 sm:gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-400 text-red-800 px-3 xs:px-4 sm:px-6 py-3 xs:py-4 rounded-xl mb-4 xs:mb-6 sm:mb-8 mx-2 xs:mx-4 lg:mx-0 text-xs xs:text-sm sm:text-base shadow-lg"
                  >
                    <div className="flex items-center space-x-2 xs:space-x-3">
                      <AlertCircle className="w-4 h-4 xs:w-5 xs:h-5 text-red-500 flex-shrink-0" />
                      <span className="font-medium">{error}</span>
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Customer Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 p-3 xs:p-4 sm:p-6 lg:p-8 xl:p-10 mx-2 xs:mx-4 lg:mx-0 hover:shadow-3xl transition-shadow duration-300"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 xs:space-x-3 mb-4 xs:mb-6 sm:mb-8">
                        <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg xs:rounded-xl flex items-center justify-center shadow-lg">
                          <User className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-display font-bold text-neutral-800">
                          Pickup Information
                        </h2>
                      </div>

                      <div className="mb-4 xs:mb-6 sm:mb-8 p-3 xs:p-4 sm:p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 border border-green-200 rounded-xl xs:rounded-2xl shadow-sm">
                        <div className="flex items-start space-x-2 xs:space-x-3">
                          <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                            <Check className="w-2 h-2 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs xs:text-sm sm:text-base font-semibold text-green-800 mb-1">
                              Pickup Location
                            </p>
                            <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                              {BUSINESS_INFO.address.full}
                            </p>
                            <div className="flex items-center space-x-1 mt-1 xs:mt-2">
                              <MapPin className="w-2 h-2 xs:w-3 xs:h-3 text-green-600" />
                              <p className="text-xs text-green-600 font-medium">
                                {BUSINESS_INFO.hours.pickup.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 sm:space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm sm:text-base font-semibold text-neutral-700 mb-3">
                              <span className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-neutral-600" />
                                <span>Full Name *</span>
                              </span>
                            </label>
                            <input
                              type="text"
                              name="customer.name"
                              value={formData.customer.name}
                              onChange={handleInputChange}
                              className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-elegant-gold focus:border-elegant-gold transition-all duration-300 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 shadow-sm hover:border-neutral-300"
                              placeholder="John Doe"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm sm:text-base font-semibold text-neutral-700 mb-3">
                              <span className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-neutral-600" />
                                <span>Phone Number *</span>
                              </span>
                            </label>
                            <input
                              type="tel"
                              name="customer.phone"
                              value={formData.customer.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-elegant-gold focus:border-elegant-gold transition-all duration-300 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 shadow-sm hover:border-neutral-300"
                              placeholder="(312) 555-0123"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm sm:text-base font-semibold text-neutral-700 mb-3">
                            <span className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-neutral-600" />
                              <span>Email (optional)</span>
                            </span>
                          </label>
                          <input
                            type="email"
                            name="customer.email"
                            value={formData.customer.email}
                            onChange={handleInputChange}
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-elegant-gold focus:border-elegant-gold transition-all duration-300 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 shadow-sm hover:border-neutral-300"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm sm:text-base font-semibold text-neutral-700 mb-3">
                            <span className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-neutral-600" />
                              <span>Special Instructions (optional)</span>
                            </span>
                          </label>
                          <textarea
                            name="special_instructions"
                            value={formData.special_instructions}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-elegant-gold focus:border-elegant-gold transition-all duration-300 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 shadow-sm hover:border-neutral-300 resize-none"
                            placeholder="Any special requests for your order... (e.g., extra spicy, less salt, etc.)"
                          />
                        </div>

                        <div>
                          <label className="block text-sm sm:text-base font-semibold text-neutral-700 mb-3">
                            <span className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-neutral-600" />
                              <span>Tip Amount (optional)</span>
                            </span>
                          </label>
                          <select
                            name="tip_amount"
                            value={formData.tip_amount}
                            onChange={handleInputChange}
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-elegant-gold focus:border-elegant-gold transition-all duration-300 bg-neutral-50 text-neutral-900 shadow-sm hover:border-neutral-300 cursor-pointer"
                            title="Select tip amount"
                          >
                            <option value={0}>No tip</option>
                            <option value={(subtotal * 0.15) / 100}>
                              15% - {formatCurrency((subtotal * 0.15) / 100)}
                            </option>
                            <option value={(subtotal * 0.18) / 100}>
                              18% - {formatCurrency((subtotal * 0.18) / 100)}
                            </option>
                            <option value={(subtotal * 0.2) / 100}>
                              20% - {formatCurrency((subtotal * 0.2) / 100)}
                            </option>
                            <option value={(subtotal * 0.25) / 100}>
                              25% - {formatCurrency((subtotal * 0.25) / 100)}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end mt-8 sm:mt-10">
                        <motion.button
                          onClick={createOrder}
                          disabled={isSubmitting || !validateStep1()}
                          className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900 text-white font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-emerald-600/25 hover:shadow-emerald-700/40 transform hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden group text-sm sm:text-base lg:text-lg"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative z-10 flex items-center justify-center space-x-2">
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <span>Continue to Payment</span>
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment */}
                {currentStep === 2 && clientSecret && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-8 lg:p-10 mx-4 lg:mx-0 hover:shadow-3xl transition-shadow duration-300"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center shadow-lg">
                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-neutral-800">
                            Payment Information
                          </h2>
                        </div>
                        <motion.button
                          onClick={() => setCurrentStep(1)}
                          className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors duration-300 flex items-center space-x-2 group"
                          whileHover={{ x: -5 }}
                        >
                          <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
                          <span>Back to Customer Info</span>
                        </motion.button>
                      </div>

                      <StripeProvider clientSecret={clientSecret}>
                        <PaymentForm
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          isLoading={isSubmitting}
                          amount={finalTotal} // finalTotal is already in cents
                        />
                      </StripeProvider>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-8 sticky top-6 hover:shadow-3xl transition-shadow duration-300"
                >
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-800">
                        Order Summary
                      </h3>
                    </div>

                    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                      {items.map(item => (
                        <div
                          key={`${item.id}-${item.customizations?.map(c => c.option_choice_id).join('-') || 'no-custom'}`}
                          className="flex justify-between items-start p-4 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-800 text-sm sm:text-base mb-1">
                              {item.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-neutral-600 mb-2">
                              Qty: <span className="font-medium">{item.quantity}</span>
                            </p>
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="text-xs text-neutral-500 space-y-1">
                                {item.customizations.map((custom, idx) => (
                                  <div key={idx} className="flex items-center space-x-1">
                                    <span className="text-emerald-600 text-sm">+</span>
                                    <span>{custom.choice_name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-neutral-800 text-sm sm:text-base">
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

                    <div className="border-t border-neutral-200 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                      <div className="flex justify-between text-neutral-700 font-medium">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal / 100)}</span>
                      </div>
                      <div className="flex justify-between text-neutral-700 font-medium">
                        <span>Tax</span>
                        <span>{formatCurrency(tax / 100)}</span>
                      </div>
                      {tipAmount > 0 && (
                        <div className="flex justify-between text-neutral-700 font-medium">
                          <span>Tip</span>
                          <span>{formatCurrency(tipAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg sm:text-xl font-bold text-neutral-800 pt-3 sm:pt-4 border-t border-neutral-200">
                        <span>Total</span>
                        <span className="text-emerald-700">{formatCurrency(finalTotal / 100)}</span>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 border border-green-200 rounded-2xl shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm sm:text-base font-semibold text-green-800 mb-1">
                            Ready for Pickup
                          </p>
                          <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                            {BUSINESS_INFO.hours.pickup.message}
                          </p>
                          <div className="flex items-center space-x-1 mt-2">
                            <Clock className="w-3 h-3 text-green-600" />
                            <p className="text-xs text-green-600 font-medium">
                              Fresh & Hot Guarantee
                            </p>
                          </div>
                        </div>
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
