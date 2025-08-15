'use client'

import React from 'react'
import { X, Zap, Activity, Target, Beef } from 'lucide-react'
import { MenuItem } from '../types'
import { nutritionData, getNutritionData, type NutritionInfo } from '@/data/nutritionData'

interface NutritionModalProps {
  isOpen: boolean
  onClose: () => void
  menuItem: MenuItem | null
}

export default function NutritionModal({ isOpen, onClose, menuItem }: NutritionModalProps) {
  if (!isOpen || !menuItem) return null

  const nutrition =
    nutritionData[menuItem.id] || menuItem.calories
      ? {
          calories: menuItem.calories,
          protein: undefined,
          carbs: undefined,
          fat: undefined,
          fiber: undefined,
          sodium: undefined,
          sugar: undefined,
        }
      : null

  const hasNutritionData = nutrition && Object.values(nutrition).some(value => value !== undefined)

  const nutritionItems = [
    {
      icon: Zap,
      label: 'Calories',
      value: nutrition?.calories,
      unit: 'kcal',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      icon: Beef,
      label: 'Protein',
      value: nutrition?.protein,
      unit: 'g',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      icon: Activity,
      label: 'Carbohydrates',
      value: nutrition?.carbs,
      unit: 'g',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: Target,
      label: 'Fat',
      value: nutrition?.fat,
      unit: 'g',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
  ]

  const detailedItems = [
    {
      label: 'Dietary Fiber',
      value: nutrition?.fiber,
      unit: 'g',
    },
    {
      label: 'Sodium',
      value: nutrition?.sodium,
      unit: 'mg',
    },
    {
      label: 'Sugar',
      value: nutrition?.sugar,
      unit: 'g',
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md sm:w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 sm:scale-in-95 duration-300 border border-amber-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-amber-200 sticky top-0 bg-gradient-to-r from-amber-50 to-orange-50 z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-1">
              Nutrition Information
            </h2>
            <p className="text-sm text-neutral-600 truncate">{menuItem.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 transition-colors p-2 hover:bg-white/50 rounded-full flex-shrink-0"
            aria-label="Close nutrition modal"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {hasNutritionData ? (
            <>
              {/* Main nutrition cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                {nutritionItems.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 sm:p-4 rounded-xl border ${item.bgColor} ${item.borderColor} text-center`}
                  >
                    <div className={`inline-flex p-2 rounded-full ${item.bgColor} mb-2`}>
                      <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">
                      {item.label}
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-neutral-900">
                      {item.value !== undefined ? `${item.value}${item.unit}` : '—'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed nutrition */}
              {detailedItems.some(item => item.value !== undefined) && (
                <div className="bg-white/70 rounded-xl border border-amber-200 p-4 mb-6">
                  <h3 className="text-sm font-semibold text-neutral-800 mb-3">
                    Additional Information
                  </h3>
                  <div className="space-y-2">
                    {detailedItems.map(
                      (item, index) =>
                        item.value !== undefined && (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">{item.label}:</span>
                            <span className="text-sm font-medium text-neutral-900">
                              {item.value}
                              {item.unit}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}

              {/* Dietary flags */}
              {menuItem.dietary_flags && menuItem.dietary_flags.length > 0 && (
                <div className="bg-white/70 rounded-xl border border-amber-200 p-4 mb-6">
                  <h3 className="text-sm font-semibold text-neutral-800 mb-3">
                    Dietary Information
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {menuItem.dietary_flags.map((flag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                      >
                        {flag.charAt(0).toUpperCase() + flag.slice(1).replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergen information */}
              {menuItem.allergens && menuItem.allergens.length > 0 && (
                <div className="bg-red-50 rounded-xl border border-red-200 p-4 mb-6">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">
                    ⚠️ Allergen Information
                  </h3>
                  <p className="text-sm text-red-700">Contains: {menuItem.allergens.join(', ')}</p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="text-xs text-neutral-500 text-center bg-white/50 p-3 rounded-lg border border-amber-200">
                <p className="mb-1">
                  <strong>Nutritional values are estimates</strong>
                </p>
                <p>
                  Actual values may vary based on preparation method and ingredients. Consult with
                  our staff for detailed allergen information.
                </p>
              </div>
            </>
          ) : (
            // No nutrition data available
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Nutrition Information Coming Soon
              </h3>
              <p className="text-sm text-neutral-600 mb-6 max-w-xs mx-auto">
                We&apos;re working hard to provide detailed nutrition information for all our menu
                items. Check back soon!
              </p>

              {/* Show basic info if available */}
              {(menuItem.calories || menuItem.dietary_flags?.length) && (
                <div className="bg-white/70 rounded-xl border border-amber-200 p-4 text-left">
                  {menuItem.calories && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-600">Estimated Calories:</span>
                      <span className="text-sm font-medium text-neutral-900">
                        {menuItem.calories} kcal
                      </span>
                    </div>
                  )}

                  {menuItem.dietary_flags && menuItem.dietary_flags.length > 0 && (
                    <div>
                      <span className="text-sm text-neutral-600 block mb-2">
                        Dietary Information:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {menuItem.dietary_flags.map((flag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                          >
                            {flag.charAt(0).toUpperCase() + flag.slice(1).replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
