'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Star, X, Heart, ShoppingCart, Check, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { MenuItem } from '@/types'

interface RecommendedCombo {
  id: string
  name: string
  description: string
  totalPrice: number
  savings?: number
  items: {
    name: string
    customizations: string[]
  }[]
}

interface ChefRecommendationsModalProps {
  isOpen: boolean
  onClose: () => void
  menuItems: MenuItem[]
}

const ChefRecommendationsModal = ({
  isOpen,
  onClose,
  menuItems,
}: ChefRecommendationsModalProps) => {
  const { addItem, items, getItemCount, getSubtotal, updateQuantity, removeItem } = useCart()
  const [addingCombo, setAddingCombo] = useState<string | null>(null)
  const [addedCombos, setAddedCombos] = useState<Set<string>>(new Set())

  // Get menu items by name for building combos
  const getItemByName = (name: string) =>
    menuItems.find(item => item.name.toLowerCase().includes(name.toLowerCase()))

  const shawarma = getItemByName('shawarma')
  const zobo = getItemByName('zobo')
  const meatPie = getItemByName('meat pie')

  // Define chef's recommendations based on available items
  const recommendations: RecommendedCombo[] = [
    {
      id: 'og-combo',
      name: 'The OG Combo',
      description: 'Our most popular combo – pure Naija vibes in every bite and sip.',
      totalPrice: shawarma && zobo ? shawarma.price + zobo.price : 0,
      savings: 200, // $2.00 in cents
      items: [
        { name: 'Nigerian Shawarma', customizations: ['Chicken', 'Extra Sauce', 'Hotdog'] },
        { name: 'Sweetened Zobo', customizations: ['Extra Sweet'] },
      ],
    },
    {
      id: 'spicy-boost',
      name: 'Spicy Boost Box',
      description: 'For the real ones who want that fiery kick with a cool-down chaser.',
      totalPrice: shawarma && zobo ? shawarma.price + zobo.price : 0,
      savings: 150, // $1.50 in cents
      items: [
        { name: 'Nigerian Shawarma', customizations: ['Beef', 'Extra Sauce', 'Hotdog'] },
        { name: 'Unsweetened Zobo', customizations: ['Classic'] },
      ],
    },
    {
      id: 'afternoon-delight',
      name: 'Afternoon Delight',
      description: 'Perfect for a quick pick-me-up – flaky, savory, and sweet.',
      totalPrice: meatPie && zobo ? meatPie.price + zobo.price : 0,
      savings: 100, // $1.00 in cents
      items: [
        { name: 'Classic Beef Meat Pie', customizations: [] },
        { name: 'Sweetened Zobo', customizations: ['Medium Sweet'] },
      ],
    },
    {
      id: 'naija-trio',
      name: 'Naija Trio',
      description: 'The full ExpreeZ experience — snack, wrap, and refreshment.',
      totalPrice: shawarma && zobo && meatPie ? shawarma.price + zobo.price + meatPie.price : 0,
      savings: 300, // $3.00 in cents
      items: [
        { name: 'Nigerian Shawarma', customizations: ['Your Choice'] },
        { name: 'Meat Pie', customizations: [] },
        { name: 'Zobo', customizations: ['Your Preference'] },
      ],
    },
  ].filter(combo => combo.totalPrice > 0) // Only show combos where all items are available

  const handleAddCombo = async (combo: RecommendedCombo) => {
    setAddingCombo(combo.id)

    try {
      // Add each item in the combo to cart
      for (const comboItem of combo.items) {
        const menuItem = getItemByName(comboItem.name)
        if (menuItem) {
          await addItem(
            menuItem,
            1,
            comboItem.customizations.length > 0
              ? comboItem.customizations.map(custom => ({
                  customization_option_id: '',
                  option_choice_id: '',
                  option_name: 'Chef Choice',
                  choice_name: custom,
                  price_modifier: 0,
                }))
              : undefined,
            `Chef's Recommendation: ${combo.name}`
          )
        }
      }

      // Mark as added and show success
      setAddedCombos(prev => new Set([...prev, combo.id]))

      // Reset loading state after success animation
      setTimeout(() => {
        setAddingCombo(null)
      }, 1500)
    } catch (error) {
      console.error('Error adding combo:', error)
      setAddingCombo(null)
    }
  }

  if (recommendations.length === 0) return null

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-2 sm:inset-4 md:inset-8 bg-white rounded-2xl sm:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 sm:p-6 text-white relative">
              <button
                onClick={onClose}
                aria-label="Close recommendations modal"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <ChefHat className="w-6 h-6 sm:w-8 sm:h-8" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold">
                  Chef&apos;s Recommendations
                </h2>
              </div>
              <p className="text-white/90 text-sm sm:text-base">
                Handpicked combos designed to give you the perfect Nigerian flavor experience.
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {recommendations.map((combo, index) => {
                  const isAdding = addingCombo === combo.id
                  const isAdded = addedCombos.has(combo.id)

                  return (
                    <motion.div
                      key={combo.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* Combo Header */}
                      <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-3 sm:p-5 text-white relative">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold">{combo.name}</h3>
                        </div>
                        {combo.savings && (
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                              Save ${(combo.savings / 100).toFixed(2)}!
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Combo Content */}
                      <div className="p-5">
                        <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                          {combo.description}
                        </p>

                        {/* Items List */}
                        <div className="space-y-3 mb-5">
                          <h4 className="text-sm font-semibold text-neutral-800">Includes:</h4>
                          {combo.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-sm bg-amber-50 p-3 rounded-lg border border-amber-100"
                            >
                              <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="font-medium text-neutral-800 block">
                                  {item.name}
                                </span>
                                {item.customizations.length > 0 && (
                                  <div className="text-xs text-amber-700 mt-1 font-medium">
                                    + {item.customizations.join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            {combo.savings && (
                              <span className="text-sm text-neutral-500 line-through block">
                                ${((combo.totalPrice + combo.savings) / 100).toFixed(2)}
                              </span>
                            )}
                            <div className="text-2xl font-bold text-emerald-600">
                              ${(combo.totalPrice / 100).toFixed(2)}
                            </div>
                          </div>

                          <motion.button
                            onClick={() => handleAddCombo(combo)}
                            disabled={isAdding || isAdded}
                            className={`font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl min-w-[140px] justify-center ${
                              isAdded
                                ? 'bg-green-500 text-white'
                                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                            }`}
                            whileHover={{ scale: isAdded ? 1 : 1.05 }}
                            whileTap={{ scale: isAdded ? 1 : 0.95 }}
                          >
                            {isAdding ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                              </>
                            ) : isAdded ? (
                              <>
                                <Check className="w-4 h-4" />
                                Added!
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                Add Combo
                              </>
                            )}
                          </motion.button>
                        </div>

                        {/* Success Message */}
                        {isAdded && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-2 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="inline-flex items-center gap-2 text-green-700 font-medium text-sm">
                              <Heart className="w-4 h-4" />
                              Combo added to your cart!
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Current Cart Display */}
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8 bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ShoppingCart className="w-6 h-6" />
                        <h3 className="text-lg font-bold">Your Cart ({getItemCount()} items)</h3>
                      </div>
                      <div className="text-xl font-bold">${(getSubtotal() / 100).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-800 text-sm">{item.name}</h4>
                            {item.special_instructions && (
                              <p className="text-xs text-green-600 font-medium mt-1">
                                ✨ {item.special_instructions}
                              </p>
                            )}
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {item.customizations.map((custom, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full mr-1"
                                  >
                                    {custom.choice_name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 ml-4">
                            <div className="flex items-center space-x-1 bg-neutral-100 rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                                }
                                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-800"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-800"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-neutral-800 text-sm">
                                ${((item.price * item.quantity) / 100).toFixed(2)}
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Remove item from cart"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-4 bg-neutral-50 border-t border-neutral-200">
                    <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                      <span>Subtotal</span>
                      <span>${(getSubtotal() / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-lg text-neutral-800">
                      <span>Total</span>
                      <span>${(getSubtotal() / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Footer Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200"
              >
                <h3 className="text-lg font-bold text-neutral-800 mb-2">
                  Still Can&apos;t Decide?
                </h3>
                <p className="text-neutral-600 text-sm">
                  Contact our team for personalized recommendations based on your taste preferences.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ChefRecommendationsModal
