'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MenuCard from '@/components/MenuCard'
import { apiClient, handleApiError } from '@/lib/api'
import { MenuItem } from '@/types'
import { useCart } from '@/context/CartContext'

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const items = await apiClient.getFeaturedItems()
        setFeaturedItems(items)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedItems()
  }, [])

  const handleAddToCart = (itemId: string) => {
    const item = featuredItems.find(item => item.id === itemId)
    if (item) {
      addItem(item)
    }
  }

  return (
    <div className="min-h-screen bg-elegant-cream">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-elegant-gradient" />
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
          >
            Taste the Elegance of{' '}
            <span className="text-secondary-400 drop-shadow-lg">Nigeria</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed"
          >
            Experience premium Nigerian fast-casual dining with our signature shawarma, 
            refreshing zobo, delicious meat pies, and authentic local snacks.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          >
            <Link href="/menu" className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto text-center">
              Order Now
            </Link>
            <Link href="/menu" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-800 font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto text-center">
              View Menu
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 lg:py-24 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-primary-800 mb-6">
              Featured Dishes
            </h2>
            <p className="text-lg sm:text-xl text-primary-600 max-w-3xl mx-auto leading-relaxed">
              Discover our most popular and signature items, crafted with the finest ingredients 
              and authentic Nigerian flavors.
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
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-6">
                Where Tradition Meets Innovation
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                At ExpreeZmeal, we blend the rich culinary heritage of Nigeria with modern 
                fast-casual dining. Our chefs use time-honored recipes and premium ingredients 
                to create dishes that honor tradition while embracing contemporary tastes.
              </p>
              <p className="text-lg text-neutral-600 mb-8">
                From our signature shawarma wraps to our refreshing zobo beverages, every item 
                on our menu tells a story of Nigerian culture and hospitality.
              </p>
              <Link href="/about" className="btn-primary">
                Learn More About Us
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-secondary-100 to-accent-100 rounded-2xl flex items-center justify-center">
                <svg className="w-32 h-32 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-secondary-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Experience Nigerian Luxury?
            </h2>
            <p className="text-xl mb-8 text-secondary-100 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made ExpreeZmeal their go-to 
              destination for authentic Nigerian cuisine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/menu" className="btn-secondary text-lg px-8 py-4">
                Order for Delivery
              </Link>
              <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-secondary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 text-lg">
                Find Locations
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
