'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { apiClient, handleApiError, formatCurrency } from '@/lib/api'
import { CheckoutFormData, Address } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    delivery_address: {
      id: '',
      user_id: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Nigeria',
      is_default: true,
      address_type: 'DELIVERY'
    },
    payment_method: 'card',
    special_instructions: '',
    tip_amount: 0
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu')
    }
  }, [items, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        delivery_address: {
          ...prev.delivery_address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'tip_amount' ? parseFloat(value) || 0 : value
      }))
    }
  }

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
    setError(null)
  }

  const validateStep1 = () => {
    const { delivery_address } = formData
    return delivery_address.address_line1 && 
           delivery_address.city && 
           delivery_address.state && 
           delivery_address.postal_code
  }

  const handleSubmitOrder = async () => {
    if (!validateStep1()) {
      setError('Please fill in all required address fields')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const orderData = {
        order_type: 'DELIVERY',
        items: items.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          special_instructions: item.special_instructions
        })),
        subtotal: getSubtotal(),
        tax: getTax(),
        tip: formData.tip_amount,
        total: getTotal() + formData.tip_amount,
        special_instructions: formData.special_instructions
      }

      const order = await apiClient.createOrder(orderData)
      
      // Clear cart and redirect to success page
      clearCart()
      router.push(`/order-confirmation?orderId=${order.id}`)
      
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = getSubtotal()
  const tax = getTax()
  const finalTotal = getTotal() + formData.tip_amount

  if (items.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-display font-bold text-neutral-800 mb-4">
                Checkout
              </h1>
              <p className="text-lg text-neutral-600">
                Complete your order and get ready for delicious Nigerian cuisine!
              </p>
            </motion.div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        currentStep >= step
                          ? 'bg-secondary-600 text-white'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 h-1 transition-colors ${
                          currentStep > step ? 'bg-secondary-600' : 'bg-neutral-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Main Content */}
              <div className="lg:col-span-2">
                
                {/* Step 1: Delivery Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card p-8"
                  >
                    <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                      Delivery Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="address.address_line1"
                          value={formData.delivery_address.address_line1}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                          placeholder="Enter your street address"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          name="address.address_line2"
                          value={formData.delivery_address.address_line2}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                          placeholder="Apartment, suite, etc."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.delivery_address.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                          placeholder="City"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData.delivery_address.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                          placeholder="State"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="address.postal_code"
                          value={formData.delivery_address.postal_code}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                          placeholder="Postal Code"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="address.country"
                          value={formData.delivery_address.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-neutral-50"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-8">
                      <button
                        onClick={() => validateStep1() && handleStepChange(2)}
                        disabled={!validateStep1()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card p-8"
                  >
                    <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                      Payment & Tip
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-4">
                          Payment Method
                        </label>
                        <div className="space-y-3">
                          {['card', 'bank_transfer', 'cash'].map((method) => (
                            <label key={method} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-neutral-50">
                              <input
                                type="radio"
                                name="payment_method"
                                value={method}
                                checked={formData.payment_method === method}
                                onChange={handleInputChange}
                                className="mr-3 text-secondary-600"
                              />
                              <span className="font-medium">
                                {method === 'card' && 'Credit/Debit Card'}
                                {method === 'bank_transfer' && 'Bank Transfer'}
                                {method === 'cash' && 'Cash on Delivery'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Add Tip (Optional)
                        </label>
                        <div className="flex space-x-3 mb-3">
                          {[0, 50, 100, 200].map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, tip_amount: amount }))}
                              className={`px-4 py-2 rounded-lg border transition-colors ${
                                formData.tip_amount === amount
                                  ? 'bg-secondary-600 text-white border-secondary-600'
                                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-secondary-300'
                              }`}
                            >
                              {amount === 0 ? 'No Tip' : formatCurrency(amount)}
                            </button>
                          ))}
                        </div>
                        <input
                          type="number"
                          name="tip_amount"
                          value={formData.tip_amount}
                          onChange={handleInputChange}
                          min="0"
                          step="10"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                          placeholder="Custom tip amount"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button
                        onClick={() => handleStepChange(1)}
                        className="btn-secondary"
                      >
                        Back to Address
                      </button>
                      <button
                        onClick={() => handleStepChange(3)}
                        className="btn-primary"
                      >
                        Review Order
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card p-8"
                  >
                    <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                      Review Your Order
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-neutral-800 mb-2">Delivery Address</h3>
                        <div className="p-4 bg-neutral-50 rounded-lg">
                          <p>{formData.delivery_address.address_line1}</p>
                          {formData.delivery_address.address_line2 && (
                            <p>{formData.delivery_address.address_line2}</p>
                          )}
                          <p>{formData.delivery_address.city}, {formData.delivery_address.state} {formData.delivery_address.postal_code}</p>
                          <p>{formData.delivery_address.country}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-neutral-800 mb-2">Payment Method</h3>
                        <div className="p-4 bg-neutral-50 rounded-lg">
                          <p className="capitalize">
                            {formData.payment_method.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          name="special_instructions"
                          value={formData.special_instructions}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                          placeholder="Any special requests or instructions for your order..."
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="p-4 bg-red-100 text-red-700 rounded-lg mt-6">
                        {error}
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-8">
                      <button
                        onClick={() => handleStepChange(2)}
                        className="btn-secondary"
                        disabled={isSubmitting}
                      >
                        Back to Payment
                      </button>
                      <button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Placing Order...
                          </div>
                        ) : (
                          `Place Order • ${formatCurrency(finalTotal)}`
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6 sticky top-6"
                >
                  <h3 className="text-xl font-display font-bold text-neutral-800 mb-6">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-800">{item.name}</h4>
                          <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-neutral-800">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Tax (7.5%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    {formData.tip_amount > 0 && (
                      <div className="flex justify-between text-neutral-600">
                        <span>Tip</span>
                        <span>{formatCurrency(formData.tip_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-neutral-800 pt-2 border-t">
                      <span>Total</span>
                      <span>{formatCurrency(finalTotal)}</span>
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