'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { ReactNode } from 'react'

// Initialize Stripe with proper error handling
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is not set.');
}
const stripePromise = loadStripe(publishableKey);

interface StripeProviderProps {
  children: ReactNode
  clientSecret?: string
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#d4af37',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
      rules: {
        '.Tab': {
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb',
          transition: 'all 0.2s ease',
        },
        '.Tab:hover': {
          backgroundColor: '#f3f4f6',
          borderColor: '#d4af37',
        },
        '.Tab--selected': {
          backgroundColor: '#d4af37',
          borderColor: '#d4af37',
          color: '#ffffff',
        },
        '.Input': {
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          fontSize: '16px',
          padding: '12px',
        },
        '.Input:focus': {
          borderColor: '#d4af37',
          boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.1)',
        },
        '.Button': {
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          padding: '12px 24px',
          transition: 'all 0.2s ease',
        },
      },
    },
  }

  return (
    <Elements
      stripe={stripePromise}
      options={clientSecret ? options : { appearance: options.appearance }}
    >
      {children}
    </Elements>
  )
}
