'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Clock, Flame, Sparkles, Plus } from 'lucide-react'

interface MenuCardProps {
  id: string
  name: string
  description: string
  price: number
  salePrice?: number
  imageUrl?: string
  preparationTime?: number
  calories?: number
  isFeature?: boolean
  hasCustomizations?: boolean
  onCardClick?: (id: string) => void
}

const MenuCard = ({
  id,
  name,
  description,
  price,
  salePrice,
  imageUrl,
  preparationTime,
  calories,
  isFeature = false,
  hasCustomizations = false,
  onCardClick,
}: MenuCardProps) => {
  const displayPrice = salePrice || price
  const hasDiscount = salePrice && salePrice < price

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onClick={() => onCardClick?.(id)}
      className={`card group relative overflow-hidden cursor-pointer bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 ${
        isFeature ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20' : ''
      }`}
    >
      {/* Featured Badge */}
      {isFeature && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pulse flex items-center gap-1">
            <Sparkles size={12} />
            Featured
          </span>
        </div>
      )}

      {/* Customizable Badge */}
      {hasCustomizations && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            ⚙️ Customizable
          </span>
        </div>
      )}

      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            💥 SALE
          </span>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
        {imageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

            {/* Click to view text overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/95 backdrop-blur-sm text-neutral-800 px-6 py-3 rounded-full font-semibold text-sm shadow-lg border border-white/50">
                {hasCustomizations ? '🎨 Click to Customize' : '👆 Click to Add'}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
            <div className="text-6xl opacity-30">🍽️</div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900 line-clamp-1 group-hover:text-emerald-600 transition-colors duration-300">
            {name}
          </h3>
          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-sm text-neutral-500 line-through">${price.toFixed(2)}</span>
            )}
            <span className="text-xl sm:text-2xl font-bold text-emerald-600">
              ${displayPrice.toFixed(2)}
            </span>
            {hasCustomizations && (
              <span className="text-xs text-blue-600 font-medium">from this price</span>
            )}
          </div>
        </div>

        <p className="text-neutral-700 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-600 mb-4">
          {preparationTime && (
            <div className="flex items-center bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <Clock size={16} className="mr-1 text-orange-500" />
              <span className="font-medium">{preparationTime} min</span>
            </div>
          )}
          {calories && (
            <div className="flex items-center bg-red-50 px-3 py-1 rounded-full border border-red-100">
              <svg
                className="w-4 h-4 mr-1 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
              </svg>
              <span className="font-medium">{calories} cal</span>
            </div>
          )}
        </div>

        {/* Interactive Bottom Section */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            {hasCustomizations ? (
              <>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Customizable Options</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="font-medium">Ready to Order</span>
              </>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300 shadow-md"
          >
            <Plus size={20} className="text-white" strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10"></div>
      </div>
    </motion.div>
  )
}

export default MenuCard
