'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown, Star, Clock, DollarSign, Flame, Zap, Award, Rocket } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MenuCard from '@/components/MenuCard'
import ProductModal from '@/components/ProductModal'
import { apiClient, handleApiError } from '@/lib/api'
import { MenuItem, CartItemCustomization } from '@/types'
import { useCart } from '@/context/CartContext'
import { ApiError } from 'next/dist/server/api-utils'

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        console.log('Fetching featured items...')
        const items = await apiClient.getFeaturedItems()
        console.log('Featured items received:', items)
        setFeaturedItems(items)
      } catch (err) {
        console.error('Error fetching featured items:', err)
        setError(handleApiError(err as ApiError))
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedItems()
  }, [])

  const handleCardClick = (itemId: string) => {
    const item = featuredItems.find(item => item.id === itemId)
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

  return (
    <div className="min-h-screen bg-elegant-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          poster="/images/elegantRestaurat.jpg"
        >
          <source src="/videos/shawarma-hero.mp4" type="video/mp4" />
          <source src="/videos/shawarma-hero.webm" type="video/webm" />
          {/* Fallback for browsers that don't support video */}
        </video>

        <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0 elegant-bg-image" />

        {/* Video overlay for better text readability */}
        <div className="absolute inset-0 bg-elegant-gradient opacity-85 z-10" />
        <div className="absolute inset-0 bg-black opacity-25 z-10" />
        <div className="relative z-20 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
          >
            <span className="block mb-2">
              <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Taste the 
              </span>
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                {" "}Elegance
              </span>
            </span>
            <span className="block">
              <span className="text-white drop-shadow-2xl">of </span>
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent drop-shadow-2xl font-extrabold">
                Nigeria
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            <span className="bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent font-semibold drop-shadow-lg">
              Experience premium Nigerian fast-casual dining
            </span>
            <span className="text-white/95 drop-shadow-lg"> with our </span>
            <span className="bg-gradient-to-r from-orange-300 via-yellow-400 to-orange-300 bg-clip-text text-transparent font-bold">
              signature shawarma
            </span>
            <span className="text-white/95 drop-shadow-lg">, </span>
            <span className="bg-gradient-to-r from-purple-300 via-pink-400 to-purple-300 bg-clip-text text-transparent font-bold">
              refreshing zobo
            </span>
            <span className="text-white/95 drop-shadow-lg">, and </span>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 bg-clip-text text-transparent font-bold">
              delicious meat pies
            </span>
            <span className="text-white/95 drop-shadow-lg">.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/menu"
                className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold text-xl px-10 py-5 rounded-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 w-full sm:w-auto text-center group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Flame className="w-5 h-5" />
                  ORDER NOW
                  <Flame className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/menu"
                className="relative overflow-hidden bg-transparent border-2 border-yellow-400 text-white hover:bg-gradient-to-r hover:from-yellow-400/20 hover:via-orange-400/20 hover:to-yellow-400/20 font-bold text-xl px-10 py-5 rounded-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 w-full sm:w-auto text-center group"
                style={{
                  borderImage: 'linear-gradient(45deg, #facc15, #f97316, #facc15) 1',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Star className="w-5 h-5" />
                  VIEW MENU
                  <Star className="w-5 h-5" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating promotional badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center gap-4 mt-8 flex-wrap"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
              <Award className="w-4 h-4" />
              100% Halal
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Fast Service
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
              <Star className="w-4 h-4" />
              Premium Quality
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 via-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Most Popular
                <Flame className="w-4 h-4" />
              </span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Featured 
              </span>
              <span className="text-primary-800"> Dishes</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-primary-600 max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Discover our most popular and signature items
              </span>
              <span>, crafted with the finest ingredients and authentic Nigerian flavors that will make your taste buds dance!</span>
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
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
                    isFeature={true}
                    hasCustomizations={
                      item.customization_options && item.customization_options.length > 0
                    }
                    onCardClick={handleCardClick}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-16 pb-10 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-400/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-400/20 rounded-full animate-ping"></div>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex justify-center items-center gap-4">
                <Star className="w-12 h-12 text-yellow-300 animate-bounce" />
                <Award className="w-12 h-12 text-orange-300 animate-pulse" />
                <Star className="w-12 h-12 text-yellow-300 animate-bounce" />
              </div>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent">
                Ready to Experience 
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-green-300 bg-clip-text text-transparent">
                Nigerian Luxury?
              </span>
            </h2>
            
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent font-semibold">
                Join thousands of satisfied customers
              </span>
              <span className="text-white/95"> who have made ExpreeZmeal their go-to destination for </span>
              <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent font-bold">
                authentic Nigerian cuisine
              </span>
              <span className="text-white/95">!</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/menu" 
                  className="bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 hover:from-green-600 hover:via-emerald-700 hover:to-green-600 text-white font-bold text-xl px-10 py-4 rounded-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 inline-flex items-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  ORDER PICKUP NOW
                  <Rocket className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
            
            {/* Additional trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 flex justify-center gap-8 flex-wrap text-sm"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">5-Star Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-300" />
                <span className="font-semibold">Quick Pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-300" />
                <span className="font-semibold">Great Prices</span>
              </div>
            </motion.div>
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
    </div>
  )
}
