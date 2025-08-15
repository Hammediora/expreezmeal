'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingCart, Settings, Info } from 'lucide-react'
import { MenuItem, CustomizationOption, CartItemCustomization } from '../types'
import NutritionModal from './NutritionModal'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  menuItem: MenuItem | null
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    customizations?: CartItemCustomization[],
    specialInstructions?: string
  ) => void
}

export default function ProductModal({
  isOpen,
  onClose,
  menuItem,
  onAddToCart,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedCustomizations, setSelectedCustomizations] = useState<{ [key: string]: string }>(
    {}
  )
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [showNutritionModal, setShowNutritionModal] = useState(false)

  useEffect(() => {
    if (isOpen && menuItem) {
      setQuantity(1)
      setSelectedCustomizations({})
      setSpecialInstructions('')
    }
  }, [isOpen, menuItem])

  if (!isOpen || !menuItem) return null

  const handleCustomizationChange = (optionId: string, choiceId: string) => {
    setSelectedCustomizations(prev => ({
      ...prev,
      [optionId]: choiceId,
    }))
  }

  const calculateTotalPrice = () => {
    let totalPrice = menuItem.price

    if (menuItem.customization_options) {
      menuItem.customization_options.forEach((option: CustomizationOption) => {
        const selectedChoiceId = selectedCustomizations[option.id]
        if (selectedChoiceId) {
          const selectedChoice = option.choices?.find(choice => choice.id === selectedChoiceId)
          if (selectedChoice && selectedChoice.price_modifier) {
            totalPrice += selectedChoice.price_modifier
          }
        }
      })
    }

    return totalPrice * quantity
  }

  const handleAddToCart = () => {
    const customizations: CartItemCustomization[] = Object.entries(selectedCustomizations).map(
      ([optionId, choiceId]) => {
        const option = menuItem.customization_options?.find(opt => opt.id === optionId)
        const choice = option?.choices?.find(c => c.id === choiceId)
        return {
          customization_option_id: optionId,
          option_choice_id: choiceId,
          option_name: option?.name || '',
          choice_name: choice?.name || '',
          price_modifier: choice?.price_modifier || 0,
        }
      }
    )

    onAddToCart(
      menuItem,
      quantity,
      customizations.length > 0 ? customizations : undefined,
      specialInstructions || undefined
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg sm:w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 sm:scale-in-95 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-neutral-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 truncate pr-2">
            {menuItem.name}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 transition-colors p-2 hover:bg-neutral-100 rounded-full flex-shrink-0"
            aria-label="Close modal"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 pb-20 sm:pb-6">
          {/* Image */}
          {menuItem.image_url && (
            <div className="relative w-full h-40 sm:h-56 mb-4 sm:mb-6 rounded-xl overflow-hidden">
              <Image
                src={menuItem.image_url}
                alt={menuItem.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Description */}
          <p className="text-neutral-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
            {menuItem.description}
          </p>

          {/* Nutrition Info Button */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => setShowNutritionModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-amber-800 hover:text-amber-900 transition-all duration-200 text-sm font-medium"
            >
              <Info size={16} />
              <span>View Nutrition Info</span>
            </button>
          </div>

          {/* Base Price */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-neutral-700 font-medium text-sm sm:text-base">Base Price:</span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                ${(menuItem.price / 100).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Customizations */}
          {menuItem.customization_options && menuItem.customization_options.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-neutral-900 flex items-center">
                <Settings className="mr-2" size={18} />
                <span className="text-sm sm:text-base">Customize Your Order</span>
              </h3>
              {menuItem.customization_options.map((option: CustomizationOption) => (
                <div
                  key={option.id}
                  className="mb-4 sm:mb-6 p-3 sm:p-4 bg-neutral-50 rounded-xl border border-neutral-100"
                >
                  <label className="block text-sm sm:text-base font-semibold text-neutral-800 mb-2 sm:mb-3">
                    {option.name} {option.is_required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    {option.choices?.map(choice => (
                      <label
                        key={choice.id}
                        className="flex items-center p-2 sm:p-3 rounded-lg border border-neutral-200 hover:bg-white hover:border-emerald-200 transition-all duration-200 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`option-${option.id}`}
                          value={choice.id}
                          checked={selectedCustomizations[option.id] === choice.id}
                          onChange={() => handleCustomizationChange(option.id, choice.id)}
                          className="mr-2 sm:mr-3 text-emerald-600 focus:ring-emerald-500 scale-110 flex-shrink-0"
                        />
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="font-medium text-neutral-800 text-sm sm:text-base truncate pr-2">
                            {choice.name}
                          </span>
                          {choice.price_modifier && choice.price_modifier > 0 && (
                            <span className="text-xs sm:text-sm font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full flex-shrink-0">
                              +${(choice.price_modifier / 100).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm sm:text-base font-semibold text-neutral-800 mb-2 sm:mb-3">
              Special Instructions (Optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests, dietary requirements, or cooking preferences..."
              className="w-full p-3 sm:p-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none placeholder-neutral-500 text-sm sm:text-base"
              rows={3}
            />
          </div>

          {/* Quantity and Total */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 p-3 sm:p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-3 sm:space-y-0">
            <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
              <span className="text-sm sm:text-base font-semibold text-neutral-800">Quantity:</span>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-full border-2 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 transition-all duration-200 text-black"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} className="sm:w-4 sm:h-4" />
                </button>
                <span className="px-3 sm:px-4 py-2 bg-white rounded-lg text-center min-w-[2.5rem] sm:min-w-[3rem] font-bold text-base sm:text-lg border border-neutral-200 text-black">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-full border-2 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 transition-all duration-200 text-black"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xs sm:text-sm text-neutral-600 mb-1">Total:</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                ${(calculateTotalPrice() / 100).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
            <span className="truncate">
              Add to Cart - ${(calculateTotalPrice() / 100).toFixed(2)}
            </span>
          </button>
        </div>
      </div>

      {/* Nutrition Modal */}
      <NutritionModal
        isOpen={showNutritionModal}
        onClose={() => setShowNutritionModal(false)}
        menuItem={menuItem}
      />
    </div>
  )
}
