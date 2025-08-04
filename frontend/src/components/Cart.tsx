'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { CartItem, APP_CONFIG } from '@/types'
import { formatCurrency } from '@/lib/api'

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout?: () => void // Made optional since we handle it internally
}

const Cart = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) => {
  const router = useRouter()
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)

  const subtotal = items.reduce((sum, item) => {
    const customizationCost =
      item.customizations?.reduce(
        (customSum, custom) => customSum + (custom.price_modifier || 0),
        0
      ) || 0
    const itemTotalPrice = item.price * item.quantity + customizationCost * item.quantity
    return sum + itemTotalPrice
  }, 0)
  const tax = subtotal * APP_CONFIG.TAX_RATE // US sales tax
  const total = subtotal + tax

  const handleCheckout = async () => {
    setIsProcessingCheckout(true)

    try {
      // Call the optional onCheckout prop if provided
      if (onCheckout) {
        await onCheckout()
      }

      onClose()
      router.push('/checkout')
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 flex flex-col max-h-screen sm:max-w-sm md:max-w-md"
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-display font-bold text-neutral-800">Your Cart</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-neutral-400 mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-neutral-500 mb-6">Add some delicious items to get started!</p>
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-[#d4af37] to-[#facc15] hover:from-[#c9a632] hover:to-[#e6b800] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      {/* Item Image */}
                      <div className="w-12 h-12 bg-neutral-200 rounded-lg flex-shrink-0 overflow-hidden relative">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-neutral-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-neutral-800 truncate">{item.name}</h4>

                        {/* Customizations */}
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {item.customizations.map((customization, index) => (
                              <div
                                key={index}
                                className="text-xs text-neutral-600 flex justify-between"
                              >
                                <span>
                                  {customization.option_name}: {customization.choice_name}
                                </span>
                                {customization.price_modifier > 0 && (
                                  <span className="text-secondary-600 font-medium">
                                    +{formatCurrency(customization.price_modifier / 100)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Special Instructions */}
                        {item.special_instructions && (
                          <div className="mt-1 text-xs text-neutral-500 italic">
                            Note: {item.special_instructions}
                          </div>
                        )}

                        <p className="text-secondary-600 font-semibold mt-1">
                          {formatCurrency(
                            (item.price +
                              (item.customizations?.reduce(
                                (sum, custom) => sum + (custom.price_modifier || 0),
                                0
                              ) || 0)) /
                              100
                          )}
                          {item.quantity > 1 && (
                            <span className="text-neutral-500 text-sm ml-1">× {item.quantity}</span>
                          )}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-7 h-7 rounded-full bg-white hover:bg-[#d4af37] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-gray-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-white hover:bg-[#d4af37] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-gray-200"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-white">
                {/* Order Summary */}
                <div className="space-y-3 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal / 100)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Tax ({(APP_CONFIG.TAX_RATE * 100).toFixed(2)}%)</span>
                    <span>{formatCurrency(tax / 100)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-neutral-800 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#d4af37]">{formatCurrency(total / 100)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#facc15] hover:from-[#c9a632] hover:to-[#e6b800] text-white font-semibold text-lg py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessingCheckout ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Cart
