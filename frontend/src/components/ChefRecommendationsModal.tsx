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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal - Enhanced responsive design with better contrast */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-1 xs:inset-2 sm:inset-4 md:inset-6 lg:inset-8 bg-white rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-screen"
          >
            {/* Header - Improved mobile spacing */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-3 xs:p-4 sm:p-6 text-white relative flex-shrink-0">
              <button
                onClick={onClose}
                aria-label="Close recommendations modal"
                className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors focus-elegant"
              >
                <X className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 mb-1.5 xs:mb-2 pr-8 xs:pr-10 sm:pr-12">
                <ChefHat className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-display font-bold leading-tight">
                  Chef&apos;s Recommendations
                </h2>
              </div>
              <p className="text-white/90 text-xs xs:text-sm sm:text-base leading-relaxed pr-8 xs:pr-10 sm:pr-12">
                Handpicked combos designed to give you the perfect Nigerian flavor experience.
              </p>
            </div>

            {/* Content - Enhanced scrolling and spacing with better contrast */}
            <div className="flex-1 overflow-y-auto p-2 xs:p-3 sm:p-6 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 max-w-6xl mx-auto">
                {recommendations.map((combo, index) => {
                  const isAdding = addingCombo === combo.id
                  const isAdded = addedCombos.has(combo.id)

                  return (
                    <motion.div
                      key={combo.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-secondary-400 transition-all duration-300"
                    >
                      {/* Combo Header - Optimized for small screens */}
                      <div className="bg-gradient-to-r from-secondary-500 to-secondary-400 p-3 xs:p-4 sm:p-5 text-white relative">
                        <div className="flex items-center space-x-2 xs:space-x-2.5 sm:space-x-3 mb-1.5 xs:mb-2 pr-12 xs:pr-14 sm:pr-16">
                          <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Star className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-bold leading-tight">{combo.name}</h3>
                        </div>
                        {combo.savings && (
                          <div className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4">
                            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-full animate-pulse whitespace-nowrap">
                              Save ${(combo.savings / 100).toFixed(2)}!
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Combo Content - Better mobile layout with improved contrast */}
                      <div className="p-3 xs:p-4 sm:p-5 bg-white">
                        <p className="text-gray-800 text-xs xs:text-sm leading-relaxed mb-3 xs:mb-4 font-medium">
                          {combo.description}
                        </p>

                        {/* Items List - Compact mobile design with better contrast */}
                        <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 mb-4 xs:mb-5">
                          <h4 className="text-xs xs:text-sm font-bold text-gray-900">Includes:</h4>
                          {combo.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-xs xs:text-sm bg-gray-50 p-2 xs:p-2.5 sm:p-3 rounded-lg border border-gray-200"
                            >
                              <Star className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-secondary-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-gray-900 block leading-tight">
                                  {item.name}
                                </span>
                                {item.customizations.length > 0 && (
                                  <div className="text-xs text-secondary-800 mt-1 font-semibold leading-tight">
                                    + {item.customizations.join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Price and CTA - Mobile-optimized layout with better contrast */}
                        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 mb-3 xs:mb-4">
                          <div className="flex-shrink-0">
                            {combo.savings && (
                              <span className="text-xs xs:text-sm text-gray-600 line-through block font-medium">
                                ${((combo.totalPrice + combo.savings) / 100).toFixed(2)}
                              </span>
                            )}
                            <div className="text-xl xs:text-2xl font-bold text-primary-700">
                              ${(combo.totalPrice / 100).toFixed(2)}
                            </div>
                          </div>

                          <motion.button
                            onClick={() => handleAddCombo(combo)}
                            disabled={isAdding || isAdded}
                            className={`font-semibold px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 rounded-lg xs:rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl w-full xs:w-auto min-w-[120px] xs:min-w-[140px] justify-center text-sm xs:text-base ${
                              isAdded
                                ? 'bg-primary-500 text-white'
                                : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
                            }`}
                            whileHover={{ scale: isAdded ? 1 : 1.02 }}
                            whileTap={{ scale: isAdded ? 1 : 0.98 }}
                          >
                            {isAdding ? (
                              <>
                                <div className="w-3.5 h-3.5 xs:w-4 xs:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="hidden xs:inline">Adding...</span>
                                <span className="xs:hidden">Add...</span>
                              </>
                            ) : isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                                Added!
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                                <span className="hidden xs:inline">Add Combo</span>
                                <span className="xs:hidden">Add</span>
                              </>
                            )}
                          </motion.button>
                        </div>

                        {/* Success Message with better contrast */}
                        {isAdded && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-2 xs:py-2.5 bg-green-50 rounded-lg border-2 border-green-300"
                          >
                            <div className="inline-flex items-center gap-2 text-green-800 font-bold text-xs xs:text-sm">
                              <Heart className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                              Combo added to your cart!
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Current Cart Display - Enhanced mobile design */}
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-6 xs:mt-8 bg-white rounded-xl xs:rounded-2xl border-2 border-primary-200 shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 xs:p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 xs:space-x-3">
                        <ShoppingCart className="w-5 h-5 xs:w-6 xs:h-6" />
                        <h3 className="text-base xs:text-lg font-bold">Your Cart ({getItemCount()} items)</h3>
                      </div>
                      <div className="text-lg xs:text-xl font-bold">${(getSubtotal() / 100).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="max-h-48 xs:max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-3 xs:p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm xs:text-base leading-tight">{item.name}</h4>
                            {item.special_instructions && (
                              <p className="text-xs text-primary-700 font-bold mt-1 leading-tight">
                                ✨ {item.special_instructions}
                              </p>
                            )}
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="mt-1.5 xs:mt-2 flex flex-wrap gap-1">
                                {item.customizations.map((custom, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-secondary-200 text-secondary-900 text-xs px-2 py-0.5 rounded-full font-semibold"
                                  >
                                    {custom.choice_name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col xs:flex-row items-end xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 flex-shrink-0">
                            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg border border-gray-300">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                                }
                                className="w-7 h-7 xs:w-8 xs:h-8 flex items-center justify-center text-gray-700 hover:text-gray-900 focus-elegant"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3 xs:w-4 xs:h-4" />
                              </button>
                              <span className="w-6 xs:w-8 text-center font-bold text-sm text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 xs:w-8 xs:h-8 flex items-center justify-center text-gray-700 hover:text-gray-900 focus-elegant"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3 xs:w-4 xs:h-4" />
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900 text-sm xs:text-base">
                                ${((item.price * item.quantity) / 100).toFixed(2)}
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-7 h-7 xs:w-8 xs:h-8 flex items-center justify-center text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors focus-elegant border border-red-300"
                              aria-label="Remove item from cart"
                            >
                              <Trash2 className="w-3 h-3 xs:w-4 xs:h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-3 xs:p-4 bg-gray-100 border-t border-gray-300">
                    <div className="flex items-center justify-between text-sm text-gray-700 mb-2 font-semibold">
                      <span>Subtotal</span>
                      <span>${(getSubtotal() / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-base xs:text-lg text-gray-900">
                      <span>Total</span>
                      <span>${(getSubtotal() / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Footer Message - Enhanced mobile design with better contrast */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-6 xs:mt-8 p-4 xs:p-6 bg-white rounded-xl xs:rounded-2xl border-2 border-gray-300 shadow-md"
              >
                <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-2">
                  Still Can&apos;t Decide?
                </h3>
                <p className="text-gray-700 text-xs xs:text-sm leading-relaxed font-medium">
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
