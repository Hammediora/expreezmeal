'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

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
  onAddToCart?: (id: string) => void
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
  onAddToCart
}: MenuCardProps) => {
  const displayPrice = salePrice || price
  const hasDiscount = salePrice && salePrice < price

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`card group relative overflow-hidden ${isFeature ? 'ring-2 ring-secondary-500 shadow-lg shadow-secondary-500/20' : ''}`}
    >
      {/* Featured Badge */}
      {isFeature && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-secondary-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Featured
          </span>
        </div>
      )}

      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Sale
          </span>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-48 sm:h-52 md:h-56 bg-primary-50 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Overlay with Quick Add Button */}
        <div className="absolute inset-0 bg-primary-800 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="bg-white text-primary-700 px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:bg-secondary-500 hover:text-white shadow-lg"
            onClick={() => onAddToCart?.(id)}
          >
            Quick Add
          </motion.button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-display font-semibold text-primary-800 line-clamp-1 group-hover:text-secondary-600 transition-colors duration-300">
            {name}
          </h3>
          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-sm text-primary-400 line-through">
                ₦{price.toFixed(2)}
              </span>
            )}
            <span className="text-lg sm:text-xl font-bold text-secondary-600">
              ₦{displayPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-primary-600 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-primary-500 mb-4">
          {preparationTime && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {preparationTime} min
            </div>
          )}
          {calories && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              {calories} cal
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddToCart?.(id)}
          className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg focus-elegant"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  )
}

export default MenuCard