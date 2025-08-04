'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MenuCard from '@/components/MenuCard'
import ProductModal from '@/components/ProductModal'
import ChefRecommendationsModal from '@/components/ChefRecommendationsModal'
import { apiClient, handleApiError } from '@/lib/api'
import { MenuItem, Category, CartItemCustomization } from '@/types'
import { useCart } from '@/context/CartContext'
import { ApiError } from 'next/dist/server/api-utils'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChefModalOpen, setIsChefModalOpen] = useState(false)
  const { addItem } = useCart()

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
      ? menuItems
      : menuItems.filter(item => item.category_id === selectedCategory)

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center hero-bg">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-display font-bold mb-4"
          >
            Our Menu
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral-200"
          >
            Discover authentic Nigerian flavors crafted with love and tradition
          </motion.p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="section-padding pb-16">
        <div className="container-custom">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-secondary-600 text-white shadow-lg'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                All Items
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
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
                  <svg
                    className="w-16 h-16 text-neutral-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 011-1h1a2 2 0 011 1v1M9 7V6a2 2 0 011-1h1a2 2 0 011 1v1"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-neutral-600 mb-2">No items found</h3>
                  <p className="text-neutral-500">
                    Try selecting a different category or check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      <section className="pt-20 pb-16 bg-neutral-50">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-4">
              Can&apos;t Decide?
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Try our chef&apos;s recommendations or create your own combo. Our team is here to help
              you find the perfect meal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary" onClick={() => setIsChefModalOpen(true)}>
                Chef&apos;s Recommendations
              </button>
              <button className="btn-secondary">Contact Us for Help</button>
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
    </div>
  )
}
