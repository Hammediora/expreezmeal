'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, ChevronDown } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MenuCard from '@/components/MenuCard'
import ProductModal from '@/components/ProductModal'
import ChefRecommendationsModal from '@/components/ChefRecommendationsModal'
import { apiClient, handleApiError } from '@/lib/api'
import { MenuItem, Category, CartItemCustomization } from '@/types'
import { useCart } from '@/context/CartContext'
import { ApiError } from 'next/dist/server/api-utils'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChefModalOpen, setIsChefModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items, cats] = await Promise.all([
          apiClient.getMenuItems(),
          apiClient.getCategories(),
        ])
        setMenuItems(items)
        setCategories(cats)
      } catch (err) {
        setError(handleApiError(err as ApiError))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems.filter(item => !item.dietary_flags?.includes('combo')) // Exclude combos from main menu
      : menuItems.filter(
          item => item.category_id === selectedCategory && !item.dietary_flags?.includes('combo')
        )

  const handleCardClick = (itemId: string) => {
    const item = filteredItems.find(item => item.id === itemId)
    if (item) {
      setSelectedItem(item)
      setIsModalOpen(true)
    }
  }

  const handleModalAddToCart = (
    item: MenuItem,
    quantity: number,
    customizations?: CartItemCustomization[],
    specialInstructions?: string
  ) => {
    addItem(item, quantity, customizations, specialInstructions)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId)
    setIsDropdownOpen(false) // Close dropdown when category is selected
    if (categoryId !== 'all') {
      setLoading(true)
      try {
        const items = await apiClient.getMenuItems(categoryId)
        setMenuItems(items)
      } catch (err) {
        setError(handleApiError(err as ApiError))
      } finally {
        setLoading(false)
      }
    }
  }

  const getSelectedCategoryName = () => {
    if (selectedCategory === 'all') return 'All Items'
    const category = categories.find(cat => cat.id === selectedCategory)
    return category?.name || 'All Items'
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-64 xs:h-72 sm:h-80 md:h-96 lg:h-[28rem] flex items-center justify-center hero-bg">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-3 xs:px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-2 xs:mb-3 sm:mb-4 leading-tight"
          >
            Our Menu
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-200 leading-relaxed max-w-3xl mx-auto"
          >
            Discover authentic Nigerian flavors crafted with love and tradition
          </motion.p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="pt-6 xs:pt-8 sm:pt-12 lg:pt-16 pb-8 xs:pb-12 sm:pb-16">
        <div className="container-custom px-3 xs:px-4 sm:px-6">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8 md:mb-12"
          >
            {/* Mobile Dropdown (sm and below) */}
            <div className="block sm:hidden mb-6">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-left font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-all duration-300 flex items-center justify-between"
                >
                  <span>{getSelectedCategoryName()}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto"
                  >
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`w-full px-4 py-3 text-left font-semibold transition-all duration-300 hover:bg-neutral-50 ${
                        selectedCategory === 'all'
                          ? 'bg-secondary-50 text-secondary-700 border-l-4 border-secondary-500'
                          : 'text-neutral-700'
                      }`}
                    >
                      All Items
                    </button>
                    {categories
                      .filter(category => category.name !== 'Combos')
                      .map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryChange(category.id)}
                          className={`w-full px-4 py-3 text-left font-semibold transition-all duration-300 hover:bg-neutral-50 ${
                            selectedCategory === category.id
                              ? 'bg-secondary-50 text-secondary-700 border-l-4 border-secondary-500'
                              : 'text-neutral-700'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Tablet Swiper (sm to lg) */}
            <div className="hidden sm:block lg:hidden mb-6">
              <Swiper
                modules={[FreeMode]}
                spaceBetween={12}
                slidesPerView="auto"
                freeMode={true}
                centeredSlides={true}
                centeredSlidesBounds={true}
                className="category-swiper"
              >
                <SwiperSlide style={{ width: 'auto' }}>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`px-4 py-2.5 rounded-full font-semibold transition-all duration-300 text-sm whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-secondary-600 text-white shadow-lg'
                        : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    All Items
                  </button>
                </SwiperSlide>
                {categories
                  .filter(category => category.name !== 'Combos')
                  .map(category => (
                    <SwiperSlide key={category.id} style={{ width: 'auto' }}>
                      <button
                        onClick={() => handleCategoryChange(category.id)}
                        className={`px-4 py-2.5 rounded-full font-semibold transition-all duration-300 text-sm whitespace-nowrap ${
                          selectedCategory === category.id
                            ? 'bg-secondary-600 text-white shadow-lg'
                            : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                        }`}
                      >
                        {category.name}
                      </button>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>

            {/* Desktop Flex Layout (lg and above) */}
            <div className="hidden lg:flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-base ${
                  selectedCategory === 'all'
                    ? 'bg-secondary-600 text-white shadow-lg'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                All Items
              </button>
              {categories
                .filter(category => category.name !== 'Combos')
                .map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-base ${
                      selectedCategory === category.id
                        ? 'bg-secondary-600 text-white shadow-lg'
                        : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
            </div>
          </motion.div>

          {/* Menu Items Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary mt-4">
                Try Again
              </button>
            </div>
          ) : (
            <>
              {filteredItems.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-600 mb-2">No items found</h3>
                  <p className="text-neutral-500">
                    Try selecting a different category or check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <MenuCard
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        salePrice={item.sale_price}
                        imageUrl={item.image_url}
                        preparationTime={item.preparation_time}
                        calories={item.calories}
                        isFeature={item.is_featured}
                        hasCustomizations={
                          item.customization_options && item.customization_options.length > 0
                        }
                        onCardClick={handleCardClick}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-8 xs:pt-12 sm:pt-16 lg:pt-20 pb-8 xs:pb-12 sm:pb-16 bg-neutral-50">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800 mb-2 xs:mb-3 sm:mb-4 leading-tight">
              Can&apos;t Decide?
            </h2>
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-neutral-600 mb-4 xs:mb-6 sm:mb-8 max-w-2xl lg:max-w-3xl mx-auto px-3 xs:px-4 leading-relaxed">
              Try our chef&apos;s recommendations or create your own combo. Our team is here to help
              you find the perfect meal.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center px-3 xs:px-4 max-w-md xs:max-w-lg mx-auto">
              <button
                className="btn-primary flex-1 xs:flex-initial text-sm xs:text-base"
                onClick={() => setIsChefModalOpen(true)}
              >
                Chef&apos;s Recommendations
              </button>
              <button className="btn-secondary flex-1 xs:flex-initial text-sm xs:text-base">
                Contact Us for Help
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        menuItem={selectedItem}
        onAddToCart={handleModalAddToCart}
      />

      {/* Chef Recommendations Modal */}
      <ChefRecommendationsModal
        isOpen={isChefModalOpen}
        onClose={() => setIsChefModalOpen(false)}
        menuItems={menuItems}
      />

      {/* Custom Styles */}
      <style jsx global>{`
        .category-swiper {
          padding: 4px 0;
        }

        .category-swiper .swiper-wrapper {
          align-items: center;
        }

        @media (max-width: 640px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 475px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  )
}
