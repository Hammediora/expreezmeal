'use client'

import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'

interface PaymentFormProps {
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
  isLoading?: boolean
  amount: number
}

export default function PaymentForm({
  onSuccess,
  onError,
  isLoading = false,
  amount,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      onError('Stripe has not loaded yet')
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id)
      }
    } catch {
      onError('An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Information</h3>
          <p className="text-gray-600">Total: ${(amount / 100).toFixed(2)}</p>
        </div>

        <PaymentElement
          options={{
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
          }}
        />
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#facc15] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">Secure Payment</p>
            <p className="text-xs text-amber-600">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={!stripe || isLoading || isProcessing}
        className="w-full bg-gradient-to-r from-[#d4af37] to-[#facc15] hover:from-[#c9a632] hover:to-[#e6b800] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Complete Payment • ${(amount / 100).toFixed(2)}</span>
          </div>
        )}
      </motion.button>

      <div className="text-center text-xs text-gray-500">
        <p>By completing your purchase, you agree to our Terms of Service</p>
      </div>
    </motion.form>
  )
}
