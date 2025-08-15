'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ShoppingCart, Trash2, Plus, Minus, ImageOff } from 'lucide-react'
import { CartItem, APP_CONFIG } from '@/types'
import { formatCurrency } from '@/lib/api'
import { useCart } from '@/context/CartContext'

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
  const { getSubtotal, getTax, getTotal } = useCart()

  // Use cart context functions for consistency - they handle cents properly
  const subtotal = getSubtotal() // returns cents
  const tax = getTax() // returns cents
  const total = getTotal() // returns cents

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
            className="fixed right-0 top-0 h-screen w-full sm:max-w-sm md:max-w-md bg-white shadow-2xl z-50 flex flex-col max-h-screen"
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-800">
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                  <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400 mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-600 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-500 mb-4 sm:mb-6">
                    Add some delicious items to get started!
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-[#d4af37] to-[#facc15] hover:from-[#c9a632] hover:to-[#e6b800] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
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
                      className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      {/* Item Image */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-200 rounded-lg flex-shrink-0 overflow-hidden relative">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 40px, 48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="w-5 h-5 sm:w-8 sm:h-8 text-neutral-400" />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-neutral-900 truncate text-sm sm:text-base">
                          {item.name}
                        </h4>

                        {/* Customizations */}
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {item.customizations.map((customization, index) => (
                              <div
                                key={index}
                                className="text-xs text-neutral-700 flex justify-between"
                              >
                                <span>
                                  {customization.option_name}: {customization.choice_name}
                                </span>
                                {customization.price_modifier > 0 && (
                                  <span className="font-medium text-shadow-black">
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

                        <p className="text-black font-semibold mt-1">
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
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white hover:bg-[#d4af37] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-gray-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 text-black" />
                        </button>
                        <span className="w-4 sm:w-6 text-center font-semibold text-xs sm:text-sm text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white hover:bg-[#d4af37] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-gray-200 "
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 text-black" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 sm:p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white">
                {/* Order Summary */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between text-neutral-600 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal / 100)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 text-sm sm:text-base">
                    <span>Tax ({(APP_CONFIG.TAX_RATE * 100).toFixed(2)}%)</span>
                    <span>{formatCurrency(tax / 100)}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-bold text-neutral-800 pt-2 sm:pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#d4af37]">{formatCurrency(total / 100)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#facc15] hover:from-[#c9a632] hover:to-[#e6b800] text-white font-semibold text-base sm:text-lg py-3 sm:py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessingCheckout ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
