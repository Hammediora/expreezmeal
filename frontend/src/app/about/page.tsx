'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { CheckCircle, Users, Heart, Instagram, Menu } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export default function About() {
  return (
    <div className="min-h-screen bg-elegant-cream">
      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .values-swiper .swiper-pagination-bullet {
          background: #d4af37 !important;
          width: 12px !important;
          height: 12px !important;
          opacity: 0.5 !important;
        }
        .values-swiper .swiper-pagination-bullet-active {
          background: #d4af37 !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
        .instagram-features-swiper .swiper-pagination-bullet {
          background: #0f766e !important;
          width: 12px !important;
          height: 12px !important;
          opacity: 0.5 !important;
        }
        .instagram-features-swiper .swiper-pagination-bullet-active {
          background: #0f766e !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0 elegant-bg-image"></div>
        <div className="absolute inset-0 bg-elegant-gradient opacity-85 z-10"></div>
        <div className="absolute inset-0 bg-black opacity-25 z-10"></div>

        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6 leading-tight drop-shadow-2xl"
          >
            About <span className="text-secondary-400 drop-shadow-lg">ExpreeZmeal</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Discover the story behind Nigeria&apos;s premier fast-casual dining experience
          </motion.p>
        </div>
      </section>

      {/* Where Tradition Meets Innovation Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4 sm:space-y-6 order-2 lg:order-1"
            >
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary-100 text-secondary-700 rounded-full text-s sm:text-sm font-semibold mb-3 sm:mb-4 text-black">
                Our Story
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 leading-tight">
                Where Tradition Meets
                <span className="text-secondary-600 block mt-1 sm:mt-2">Innovation</span>
              </h2>

              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full"></div>

              <p className="text-base sm:text-lg text-neutral-900 leading-relaxed">
                At ExpreeZmeal, we blend the rich culinary heritage of Nigeria with modern
                fast-casual dining. Our chefs use time-honored recipes and premium ingredients to
                create dishes that honor tradition while embracing contemporary tastes.
              </p>

              <p className="text-base sm:text-lg text-neutral-900 leading-relaxed">
                From our signature shawarma wraps to our refreshing zobo beverages, every item on
                our menu tells a story of Nigerian culture and hospitality.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                <Link href="/menu" className="btn btn-secondary text-center">
                  View Our Menu
                </Link>
                <Link href="/contact" className="btn btn-outline text-center">
                  Contact Us
                </Link>
              </div>
            </motion.div>

            {/* Image Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative">
                {/* Main image container */}
                <div className="aspect-[4/3] lg:aspect-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl relative bg-white p-1.5 sm:p-2">
                  <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden relative">
                    <Image
                      src="/images/LogoIcon3.png"
                      alt="ExpreeZmeal Restaurant Interior"
                      width={700}
                      height={700}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary-600/10 via-transparent to-accent-600/10"></div>
                  </div>
                </div>

                {/* Decorative elements - hidden on mobile */}
                <div className="hidden sm:block absolute -top-4 -right-4 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-secondary-200 to-accent-200 rounded-full opacity-60 blur-sm"></div>
                <div className="hidden sm:block absolute top-8 sm:top-10 -left-2 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-accent-200 to-secondary-200 rounded-full opacity-40 blur-sm"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800 mb-4 sm:mb-6">
              Our Values
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Every dish we serve is guided by our core principles and commitment to excellence.
            </p>
          </motion.div>

          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-[#f8fafc] p-6 lg:p-8 rounded-2xl shadow-lg border border-[#d4af37]/20 hover:border-[#d4af37]/40 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#d4af37] to-[#facc15] rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg group-hover:shadow-[0_0_15px_#d4af37] transition-all duration-300">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-semibold text-neutral-800 mb-3 sm:mb-4 text-center">
                Quality First
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-sm sm:text-base">
                We source the finest ingredients and maintain the highest standards in every dish we
                prepare.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-[#f8fafc] p-6 lg:p-8 rounded-2xl shadow-lg border border-[#0f766e]/20 hover:border-[#0f766e]/40 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0f766e] to-[#134e4a] rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg group-hover:shadow-[0_0_15px_#0f766e] transition-all duration-300">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-semibold text-neutral-800 mb-3 sm:mb-4 text-center">
                Cultural Heritage
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-sm sm:text-base">
                We honor Nigerian culinary traditions while making them accessible to everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-[#f8fafc] p-6 lg:p-8 rounded-2xl shadow-lg border border-[#facc15]/20 hover:border-[#facc15]/40 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#facc15] to-[#d4af37] rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg group-hover:shadow-[0_0_15px_#facc15] transition-all duration-300">
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-semibold text-neutral-800 mb-3 sm:mb-4 text-center">
                Community Focus
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-sm sm:text-base">
                We believe in bringing people together through the universal language of great food.
              </p>
            </motion.div>
          </div>

          {/* Mobile Swiper View */}
          <div className="md:hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-secondary-500',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-secondary-600',
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              className="values-swiper pb-12"
            >
              <SwiperSlide>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-[#d4af37]/20 mx-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#facc15] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-800 mb-4 text-center">
                    Quality First
                  </h3>
                  <p className="text-neutral-600 text-center leading-relaxed">
                    We source the finest ingredients and maintain the highest standards in every
                    dish we prepare.
                  </p>
                </motion.div>
              </SwiperSlide>

              <SwiperSlide>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-[#0f766e]/20 mx-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0f766e] to-[#134e4a] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-800 mb-4 text-center">
                    Cultural Heritage
                  </h3>
                  <p className="text-neutral-600 text-center leading-relaxed">
                    We honor Nigerian culinary traditions while making them accessible to everyone.
                  </p>
                </motion.div>
              </SwiperSlide>

              <SwiperSlide>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-[#facc15]/20 mx-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#facc15] to-[#d4af37] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-800 mb-4 text-center">
                    Community Focus
                  </h3>
                  <p className="text-neutral-600 text-center leading-relaxed">
                    We believe in bringing people together through the universal language of great
                    food.
                  </p>
                </motion.div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800 mb-4 sm:mb-6">
              Follow Our Culinary Journey
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover behind-the-scenes moments, new menu items, and the passion behind every dish
              we serve.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <a
              href="https://www.instagram.com/exprezzmeals"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#facc15] to-[#DAA520] opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#134e4a] via-[#0f766e] to-[#134e4a] opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {/* Content */}
              <div className="relative z-10 flex items-center gap-2 sm:gap-3 text-white">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md" />
                <span className="drop-shadow-md">Follow @exprezzmeals</span>
              </div>

              {/* Glowing border */}
              <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/40 group-hover:border-[#d4af37]/60 group-hover:shadow-[0_0_20px_#d4af37] transition-all duration-300"></div>
            </a>
          </motion.div>

          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Menu className="w-6 h-6 text-secondary-600 text-emerald-800" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Daily Specials</h3>
              <p className="text-neutral-600">
                Be the first to know about our chef&apos;s daily creations and limited-time offers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <CheckCircle className="w-6 h-6 text-accent-600 text-amber-200" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Behind the Scenes</h3>
              <p className="text-neutral-600">
                Get an inside look at our kitchen and the passion that goes into every dish.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-secondary-600 text-teal-900" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Customer Stories</h3>
              <p className="text-neutral-600">
                See how our food brings people together and creates memorable experiences.
              </p>
            </motion.div>
          </div>

          {/* Mobile Swiper View */}
          <div className="md:hidden mb-8">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-secondary-500',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-secondary-600',
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              className="instagram-features-swiper pb-12"
            >
              <SwiperSlide>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-2xl shadow-lg mx-4"
                >
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Menu className="w-6 h-6 text-secondary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2 text-center">
                    Daily Specials
                  </h3>
                  <p className="text-neutral-600 text-center">
                    Be the first to know about our chef&apos;s daily creations and limited-time
                    offers.
                  </p>
                </motion.div>
              </SwiperSlide>

              <SwiperSlide>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-2xl shadow-lg mx-4"
                >
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <CheckCircle className="w-6 h-6 text-accent-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2 text-center">
                    Behind the Scenes
                  </h3>
                  <p className="text-neutral-600 text-center">
                    Get an inside look at our kitchen and the passion that goes into every dish.
                  </p>
                </motion.div>
              </SwiperSlide>

              <SwiperSlide>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-2xl shadow-lg mx-4"
                >
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-6 h-6 text-secondary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2 text-center">
                    Customer Stories
                  </h3>
                  <p className="text-neutral-600 text-center">
                    See how our food brings people together and creates memorable experiences.
                  </p>
                </motion.div>
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Instagram Feed Embed */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
              <iframe
                src="https://www.instagram.com/exprezzmeals/embed"
                className="w-full h-64 sm:h-80 md:h-96 border-0"
                title="Instagram Feed"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
