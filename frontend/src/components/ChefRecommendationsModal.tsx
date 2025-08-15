'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChefHat,
  Star,
  X,
  Heart,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Trash2,
  Award,
  Sparkles,
  Flame,
  CircleCheck,
} from 'lucide-react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { useCart } from '@/context/CartContext'
import { MenuItem } from '@/types'
import { getActiveComboRecommendations, getChefNote } from '@/lib/comboRotation'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface RecommendedCombo {
  id: string
  name: string
  description: string
  totalPrice: number
  savings?: number
  image: string
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

  // Get all combo items from the database
  const allComboItems = menuItems.filter(item => item.dietary_flags?.includes('combo'))

  // Get today's rotating combo recommendations (only 2 combos)
  const todaysRecommendations = getActiveComboRecommendations(allComboItems)

  // Get chef's note for today
  const chefNote = getChefNote()

  // Convert MenuItem objects to RecommendedCombo format for compatibility
  const recommendations: RecommendedCombo[] = todaysRecommendations.map(combo => ({
    id: combo.id,
    name: combo.name,
    description:
      combo.description || 'A carefully crafted combination for the ultimate dining experience.',
    totalPrice: (combo.sale_price || combo.price) / 100, // Convert cents to dollars
    savings: (combo.price - (combo.sale_price || combo.price)) / 100, // Convert cents to dollars
    image: combo.image_url || '/images/menu/combo-default.jpg',
    items: [], // These are pre-built combos, so no individual items to show
  }))

  const handleAddCombo = async (combo: RecommendedCombo) => {
    setAddingCombo(combo.id)

    try {
      // Find the actual combo menu item from the database
      const dbComboItem = menuItems.find(item => item.id === combo.id)

      if (dbComboItem) {
        // Add the complete combo meal to cart
        await addItem(
          dbComboItem,
          1,
          undefined,
          `Chef's ${combo.name} - Complete combo meal with amazing savings!`
        )

        // Mark as added and show success
        setAddedCombos(prev => new Set([...prev, combo.id]))
      }

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
          {/* Elegant Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => {
              e.stopPropagation()
              onClose()
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Modal - Elegant design matching app style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            className="fixed inset-1 xs:inset-2 sm:inset-4 md:inset-6 lg:inset-8 xl:inset-12 bg-elegant-cream rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-screen border-2 border-secondary-200"
          >
            {/* Responsive Header */}
            <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 p-3 xs:p-4 sm:p-6 text-white flex-shrink-0 overflow-hidden">
              {/* Decorative background pattern - hidden on very small screens */}
              <div className="absolute inset-0 opacity-10 hidden xs:block">
                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/20 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white/15 rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-8 h-8 border border-white/10 rounded-full"></div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close recommendations modal"
                className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 focus-elegant hover:scale-110 backdrop-blur-sm border border-white/20 z-50 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 pointer-events-none" />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 mb-1.5 xs:mb-2 pr-10 xs:pr-12 sm:pr-16">
                  <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <ChefHat className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-display font-bold leading-tight">
                    Chef&apos;s Recommendations
                  </h2>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-2 py-1 ml-2">
                    <span className="text-white text-[10px] xs:text-xs font-bold">
                      NEW EVERY 2 DAYS
                    </span>
                  </div>
                </div>
                <p className="text-white text-xs xs:text-sm sm:text-base leading-relaxed pr-10 xs:pr-12 sm:pr-16 font-semibold">
                  Today&apos;s featured combos • Rotating selection of {allComboItems.length} unique
                  combinations
                </p>
              </div>
            </div>

            {/* Chef's Note Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-200 px-3 xs:px-4 sm:px-6 py-3 xs:py-4 flex-shrink-0">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-start gap-2 xs:gap-3 sm:gap-4">
                  <div className="w-6 h-6 xs:w-8 xs:h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 xs:w-4 xs:h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm xs:text-base font-bold text-amber-900 mb-1">
                      Chef&apos;s Note
                    </h3>
                    <p className="text-xs xs:text-sm text-amber-800 leading-relaxed">{chefNote}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Responsive Content Area */}
            <div className="flex-1 overflow-y-auto p-2 xs:p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-elegant-cream to-neutral-50 relative">
              {/* Background decoration - hidden on small screens */}
              <div className="absolute inset-0 opacity-5 pointer-events-none hidden sm:block">
                <div className="absolute top-10 left-10 w-32 h-32 bg-secondary-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-400 rounded-full blur-3xl"></div>
              </div>

              {/* Custom Swiper Styles */}
              <style jsx global>{`
                .chef-recommendations-swiper .swiper-pagination-bullet {
                  background: #d4af37 !important;
                  width: 8px !important;
                  height: 8px !important;
                  opacity: 0.5 !important;
                }
                .chef-recommendations-swiper .swiper-pagination-bullet-active {
                  background: #d4af37 !important;
                  opacity: 1 !important;
                  transform: scale(1.2) !important;
                }
                .chef-recommendations-swiper .swiper-pagination {
                  bottom: 8px !important;
                }
              `}</style>

              <div className="relative z-10 max-w-6xl mx-auto">
                {/* Mobile Swiper View (up to md screens) */}
                <div className="block md:hidden">
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={12}
                    slidesPerView={1}
                    pagination={{
                      clickable: true,
                      bulletClass: 'swiper-pagination-bullet',
                      bulletActiveClass: 'swiper-pagination-bullet-active',
                    }}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    className="chef-recommendations-swiper pb-8"
                  >
                    {recommendations.map((combo, index) => {
                      const isAdding = addingCombo === combo.id
                      const isAdded = addedCombos.has(combo.id)
                      const comboIcon =
                        index === 0 ? Award : index === 1 ? Flame : index === 2 ? Heart : Sparkles

                      return (
                        <SwiperSlide key={combo.id}>
                          <div className="px-2">
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="menu-card-elegant rounded-xl xs:rounded-2xl overflow-hidden shadow-lg"
                            >
                              {/* Mobile Combo Header with Image */}
                              <div className="relative bg-gradient-to-r from-secondary-500 to-secondary-400 overflow-hidden">
                                {/* Food Image */}
                                <div className="relative h-24 xs:h-28 sm:h-32">
                                  <Image
                                    src={combo.image}
                                    alt={combo.name}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-600/80 to-transparent"></div>
                                </div>

                                {/* Header Content Over Image */}
                                <div className="absolute inset-0 p-3 xs:p-4 text-white flex flex-col justify-between">
                                  {/* Savings Badge */}
                                  {combo.savings && (
                                    <div className="flex justify-end">
                                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-white shadow-lg">
                                        Save ${(combo.savings / 100).toFixed(2)}!
                                      </span>
                                    </div>
                                  )}

                                  {/* Title at Bottom */}
                                  <div className="relative z-10">
                                    <div className="flex items-center gap-2 xs:gap-3">
                                      <div className="w-6 h-6 xs:w-7 xs:h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/30">
                                        {React.createElement(comboIcon, {
                                          className: 'w-3 h-3 xs:w-3.5 xs:h-3.5 text-white',
                                        })}
                                      </div>
                                      <h3 className="text-sm xs:text-base font-display font-bold leading-tight drop-shadow-lg">
                                        {combo.name}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Mobile Combo Content */}
                              <div className="p-3 xs:p-4 bg-white">
                                <p className="text-neutral-800 text-xs xs:text-sm leading-relaxed mb-3 font-semibold line-clamp-2">
                                  {combo.description}
                                </p>

                                {/* Compact Items List */}
                                <div className="space-y-2 mb-4">
                                  <h4 className="text-xs font-display font-bold text-neutral-800 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-secondary-600" />
                                    Includes:
                                  </h4>
                                  {combo.items.slice(0, 2).map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 text-xs bg-gradient-to-r from-secondary-50 to-primary-50 p-2 rounded-lg border border-secondary-200"
                                    >
                                      <div className="w-4 h-4 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-2 h-2 text-neutral-800" />
                                      </div>
                                      <span className="font-bold text-neutral-800 font-display truncate">
                                        {item.name}
                                      </span>
                                    </div>
                                  ))}
                                  {combo.items.length > 2 && (
                                    <div className="text-xs text-secondary-700 font-semibold text-center">
                                      +{combo.items.length - 2} more items
                                    </div>
                                  )}
                                </div>

                                {/* Mobile Price and CTA */}
                                <div className="flex items-center justify-between gap-3 mb-3">
                                  <div className="flex-shrink-0">
                                    {combo.savings && (
                                      <div className="flex items-center gap-1 mb-1">
                                        <span className="text-xs text-gray-500 line-through">
                                          ${combo.totalPrice.toFixed(2)}
                                        </span>
                                      </div>
                                    )}
                                    <div className="text-lg xs:text-xl font-display font-bold text-neutral-900">
                                      ${(combo.totalPrice - (combo.savings || 0)).toFixed(2)}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleAddCombo(combo)}
                                    disabled={isAdding || isAdded}
                                    className={`flex-1 max-w-[120px] px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center gap-1.5 justify-center ${
                                      isAdded
                                        ? 'bg-green-600 text-white'
                                        : 'bg-secondary-500 hover:bg-secondary-600 text-neutral-800'
                                    }`}
                                  >
                                    {isAdding ? (
                                      <>
                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        <span>Adding...</span>
                                      </>
                                    ) : isAdded ? (
                                      <>
                                        <Check className="w-3 h-3" />
                                        Added!
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingCart className="w-3 h-3" />
                                        Add
                                      </>
                                    )}
                                  </button>
                                </div>

                                {/* Mobile Success Message */}
                                {isAdded && (
                                  <div className="text-center py-2 bg-gradient-to-r from-green-50 to-primary-50 rounded-lg border border-green-300">
                                    <div className="inline-flex items-center gap-1 text-green-800 font-bold text-xs">
                                      <Heart className="w-3 h-3" />
                                      Added to cart!
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                </div>

                {/* Desktop Grid View (md screens and up) */}
                <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {recommendations.map((combo, index) => {
                    const isAdding = addingCombo === combo.id
                    const isAdded = addedCombos.has(combo.id)
                    const comboIcon =
                      index === 0 ? Award : index === 1 ? Flame : index === 2 ? Heart : Sparkles

                    return (
                      <motion.div
                        key={combo.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="menu-card-elegant rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                      >
                        {/* Desktop Combo Header with Image */}
                        <div className="relative bg-gradient-to-r from-secondary-500 to-secondary-400 overflow-hidden">
                          {/* Food Image */}
                          <div className="relative h-32 lg:h-40">
                            <Image
                              src={combo.image}
                              alt={combo.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary-600/80 to-transparent"></div>
                          </div>

                          {/* Header Content Over Image */}
                          <div className="absolute inset-0 p-4 lg:p-5 text-white flex flex-col justify-between">
                            {/* Header decoration */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>

                            {/* Savings Badge */}
                            {combo.savings && (
                              <div className="flex justify-end">
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3 + index * 0.1 }}
                                  className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg z-10"
                                >
                                  Save ${(combo.savings / 100).toFixed(2)}!
                                </motion.span>
                              </div>
                            )}

                            {/* Title at Bottom */}
                            <div className="relative z-10">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                                  {React.createElement(comboIcon, {
                                    className: 'w-4 h-4 lg:w-5 lg:h-5 text-white',
                                  })}
                                </div>
                                <h3 className="text-base lg:text-xl font-display font-bold leading-tight drop-shadow-lg">
                                  {combo.name}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Combo Content */}
                        <div className="p-4 lg:p-5 bg-white">
                          <p className="text-neutral-800 text-sm lg:text-base leading-relaxed mb-4 font-semibold">
                            {combo.description}
                          </p>

                          {/* Desktop Items List */}
                          <div className="space-y-3 mb-5">
                            <h4 className="text-sm font-display font-bold text-neutral-800 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-secondary-600" />
                              What&apos;s Included:
                            </h4>
                            {combo.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="group flex items-start gap-3 text-sm bg-gradient-to-r from-secondary-50 to-primary-50 p-3 rounded-xl border border-secondary-200 hover:border-secondary-300 transition-all duration-300"
                              >
                                <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                  <CircleCheck className="w-5 h-5 text-neutral-800" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="font-bold text-neutral-800 block leading-tight font-display">
                                    {item.name}
                                  </span>
                                  {item.customizations.length > 0 && (
                                    <div className="text-xs text-neutral-700 mt-1 font-bold leading-tight flex items-center gap-1">
                                      <Sparkles className="w-3 h-3" />
                                      {item.customizations.join(' • ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Desktop Price and CTA */}
                          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
                            <div className="flex-shrink-0">
                              {combo.savings && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm text-gray-500 line-through">
                                    ${combo.totalPrice.toFixed(2)}
                                  </span>
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                                    Save ${combo.savings.toFixed(2)}
                                  </span>
                                </div>
                              )}
                              <div className="text-2xl lg:text-3xl font-display font-bold text-neutral-900">
                                ${(combo.totalPrice - (combo.savings || 0)).toFixed(2)}
                              </div>
                            </div>

                            <motion.button
                              onClick={() => handleAddCombo(combo)}
                              disabled={isAdding || isAdded}
                              className={`w-full lg:w-auto min-w-[160px] ${
                                isAdded ? 'btn btn-primary' : 'btn btn-secondary'
                              } ${isAdding || isAdded ? 'pointer-events-none' : ''}`}
                              whileHover={{ scale: isAdded ? 1 : 1.02 }}
                              whileTap={{ scale: isAdded ? 1 : 0.98 }}
                            >
                              {isAdding ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                  <span className="hidden lg:inline">Adding to Cart...</span>
                                  <span className="lg:hidden">Adding...</span>
                                </>
                              ) : isAdded ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Added to Cart!
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4" />
                                  <span className="hidden lg:inline">Add to Cart</span>
                                  <span className="lg:hidden">Add</span>
                                </>
                              )}
                            </motion.button>
                          </div>

                          {/* Desktop Success Message */}
                          {isAdded && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-3 bg-gradient-to-r from-green-50 to-primary-50 rounded-xl border-2 border-green-300"
                            >
                              <div className="inline-flex items-center gap-2 text-green-800 font-bold">
                                <Heart className="w-4 h-4" />
                                Perfect choice! Added to your cart
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Responsive Cart Display */}
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-4 xs:mt-6 sm:mt-8 menu-card-elegant rounded-xl xs:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl"
                >
                  <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 p-3 xs:p-4 sm:p-5 text-white overflow-hidden">
                    {/* Decorative elements - hidden on very small screens */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-6 -translate-y-6 hidden xs:block"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-4 translate-y-4 hidden xs:block"></div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2 xs:gap-3">
                        <div className="w-6 h-6 xs:w-8 xs:h-8 bg-white/20 rounded-lg xs:rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                          <ShoppingCart className="w-3 h-3 xs:w-4 xs:h-4 text-white" />
                        </div>
                        <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-display font-bold">
                          Your Cart ({getItemCount()} {getItemCount() === 1 ? 'item' : 'items'})
                        </h3>
                      </div>
                      <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-display font-bold">
                        ${(getSubtotal() / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="max-h-48 xs:max-h-56 sm:max-h-64 overflow-y-auto bg-white">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-3 xs:p-4 border-b border-neutral-200 last:border-b-0 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-3 xs:gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display font-bold text-neutral-800 text-xs xs:text-sm sm:text-base leading-tight">
                              {item.name}
                            </h4>
                            {item.special_instructions && (
                              <p className="text-xs text-secondary-800 font-bold mt-1 leading-tight flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-secondary-600" />
                                {item.special_instructions}
                              </p>
                            )}
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="mt-1.5 xs:mt-2 flex flex-wrap gap-1">
                                {item.customizations.slice(0, 2).map((custom, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-secondary-100 text-secondary-800 text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full font-semibold border border-secondary-300"
                                  >
                                    {custom.choice_name}
                                  </span>
                                ))}
                                {item.customizations.length > 2 && (
                                  <span className="text-xs text-secondary-600 font-semibold">
                                    +{item.customizations.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col xs:flex-row items-end xs:items-center gap-2 flex-shrink-0">
                            <div className="flex items-center bg-neutral-100 rounded-lg xs:rounded-xl border border-neutral-300 overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                                }
                                className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-800 hover:bg-neutral-200 transition-colors focus-elegant"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                              </button>
                              <span className="w-6 xs:w-7 sm:w-8 text-center font-bold text-xs xs:text-sm text-neutral-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-800 hover:bg-neutral-200 transition-colors focus-elegant"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="font-display font-bold text-neutral-800 text-xs xs:text-sm sm:text-base">
                                ${((item.price * item.quantity) / 100).toFixed(2)}
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 flex items-center justify-center text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors focus-elegant border border-red-300 hover:border-red-400"
                              aria-label="Remove item from cart"
                            >
                              <Trash2 className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-3 xs:p-4 bg-gradient-to-r from-neutral-100 to-neutral-50 border-t border-neutral-300">
                    <div className="flex items-center justify-between text-xs xs:text-sm text-neutral-800 mb-2 font-bold">
                      <span>Subtotal</span>
                      <span>${(getSubtotal() / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between font-display font-bold text-base xs:text-lg text-neutral-900">
                      <span>Total</span>
                      <span className="text-neutral-900">${(getSubtotal() / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Responsive Footer Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-4 xs:mt-6 sm:mt-8"
              >
                <motion.button
                  onClick={() => {
                    onClose()
                    window.location.href = '/contact'
                  }}
                  className="w-full p-4 xs:p-5 sm:p-6 menu-card-elegant shadow-lg relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus-elegant group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Decorative background - hidden on very small screens */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 group-hover:from-primary-100 group-hover:to-secondary-100 transition-all duration-300"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-secondary-200 rounded-full transform translate-x-6 -translate-y-6 opacity-30 group-hover:opacity-50 transition-opacity duration-300 hidden xs:block"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary-200 rounded-full transform -translate-x-4 translate-y-4 opacity-30 group-hover:opacity-50 transition-opacity duration-300 hidden xs:block"></div>

                  <div className="relative z-10">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <ChefHat className="w-5 h-5 xs:w-6 xs:h-6 text-white" />
                    </div>
                    <h3 className="text-base xs:text-lg sm:text-xl font-display font-bold text-neutral-800 mb-2 xs:mb-3 group-hover:text-primary-800 transition-colors duration-300">
                      Still Can&apos;t Decide?
                    </h3>
                    <p className="text-neutral-800 text-xs xs:text-sm sm:text-base leading-relaxed font-semibold max-w-xs xs:max-w-sm sm:max-w-md mx-auto group-hover:text-neutral-900 transition-colors duration-300">
                      Our culinary team is here to help! Contact us for personalized
                      recommendations.
                    </p>
                    <div className="mt-3 xs:mt-4 flex items-center justify-center gap-2 text-neutral-800 group-hover:text-neutral-900 transition-colors duration-300">
                      <span className="text-xs xs:text-sm font-bold">Click to Contact Us</span>
                      <svg
                        className="w-3 h-3 xs:w-4 xs:h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ChefRecommendationsModal
