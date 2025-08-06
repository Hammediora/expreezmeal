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

        @media (min-width: 475px) {
          .values-swiper .swiper-pagination-bullet,
          .instagram-features-swiper .swiper-pagination-bullet {
            width: 12px !important;
            height: 12px !important;
          }
        }

        /* Custom container class */
        .container-custom {
          max-width: 1280px;
          margin: 0 auto;
        }

        /* Hero background */
        .hero-bg {
          background:
            linear-gradient(
              135deg,
              rgba(20, 184, 166, 0.9) 0%,
              rgba(134, 239, 172, 0.8) 50%,
              rgba(251, 191, 36, 0.9) 100%
            ),
            url('/images/elegantRestaurant2.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        @media (max-width: 768px) {
          .hero-bg {
            background-attachment: scroll;
          }
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section className="relative h-64 xs:h-72 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] flex items-center justify-center overflow-hidden hero-bg">
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        <div className="relative z-20 text-center text-white max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-2 xs:mb-3 sm:mb-4 md:mb-6 leading-tight"
          >
            About <span className="text-secondary-400">ExpreeZmeal</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-200 leading-relaxed max-w-4xl mx-auto"
          >
            Discover the story behind Nigeria&apos;s premier fast-casual dining experience
          </motion.p>
        </div>
      </section>

      {/* Where Tradition Meets Innovation Section */}
      <section className="pt-6 xs:pt-8 sm:pt-12 lg:pt-16 pb-8 xs:pb-12 sm:pb-16 lg:pb-20 bg-[#fefcf8] shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom px-3 xs:px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-3 xs:space-y-4 sm:space-y-6 order-2 lg:order-1"
            >
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary-100 text-black rounded-full text-s sm:text-sm font-semibold mb-2 xs:mb-3 sm:mb-4">
                Our Story
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 leading-tight">
                Where Tradition Meets
                <span className="text-secondary-600 block mt-1 sm:mt-2">Innovation</span>
              </h2>

              <div className="w-12 xs:w-16 sm:w-24 h-1 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full"></div>

              <p className="text-sm xs:text-base sm:text-lg text-neutral-700 leading-relaxed">
                At ExpreeZmeal, we blend the rich culinary heritage of Nigeria with modern
                fast-casual dining. Our chefs use time-honored recipes and premium ingredients to
                create dishes that honor tradition while embracing contemporary tastes.
              </p>

              <p className="text-sm xs:text-base sm:text-lg text-neutral-700 leading-relaxed">
                From our signature shawarma wraps to our refreshing zobo beverages, every item on
                our menu tells a story of Nigerian culture and hospitality.
              </p>

              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-2 xs:pt-3 sm:pt-4 max-w-md xs:max-w-lg">
                <Link
                  href="/menu"
                  className="btn-primary flex-1 xs:flex-initial text-center text-sm xs:text-base"
                >
                  View Our Menu
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary flex-1 xs:flex-initial text-center text-sm xs:text-base"
                >
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
                <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl relative bg-white p-2 sm:p-3">
                  <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden relative">
                    <Image
                      src="/images/LogoIcon3.png"
                      alt="ExpreeZmeal Logo"
                      width={600}
                      height={600}
                      className="w-full h-full object-contain"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary-600/10 via-transparent to-accent-600/10"></div>
                  </div>
                </div>

                {/* Decorative elements - hidden on small screens */}
                <div className="hidden sm:block absolute -top-3 -right-3 lg:-top-4 lg:-right-4 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-br from-secondary-200 to-accent-200 rounded-full opacity-60 blur-sm"></div>
                <div className="hidden sm:block absolute top-6 sm:top-8 lg:top-10 -left-2 w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 bg-gradient-to-br from-accent-200 to-secondary-200 rounded-full opacity-40 blur-sm"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-gradient-to-t from-[#2f2e2b] to-[#999792] pt-8 xs:pt-12 sm:pt-16 lg:pt-20 pb-8 xs:pb-12 sm:pb-16 lg:pb-20">
        <div className="container-custom px-3 xs:px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-6 xs:mb-8 sm:mb-12"
          >
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800 mb-3 xs:mb-4 sm:mb-6">
              Our Values
            </h2>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-neutral-900 max-w-3xl mx-auto leading-relaxed">
              Every dish we serve is guided by our core principles and commitment to excellence.
            </p>
          </motion.div>

          {/* Mobile Swiper View (xs to sm) */}
          <div className="block sm:hidden mb-6">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
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
              className="values-swiper pb-12"
            >
              <SwiperSlide>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-white to-neutral-50 p-5 xs:p-6 rounded-2xl shadow-lg border border-secondary-200/30 mx-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#facc15] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg xs:text-xl font-display font-semibold text-neutral-800 mb-3 xs:mb-4 text-center">
                    Quality First
                  </h3>
                  <p className="text-neutral-600 text-center leading-relaxed text-sm xs:text-base">
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
                  className="bg-gradient-to-br from-white to-neutral-50 p-5 xs:p-6 rounded-2xl shadow-lg border border-primary-200/30 mx-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0f766e] to-[#134e4a] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg xs:text-xl font-display font-semibold text-neutral-800 mb-3 xs:mb-4 text-center">
                    Cultural Heritage
                  </h3>
                  <p className="text-neutral-600 text-center leading-relaxed text-sm xs:text-base">
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
                  className="bg-gradient-to-br from-white to-neutral-50 p-5 xs:p-6 rounded-2xl shadow-lg border border-accent-200/30 mx-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#facc15] to-[#d4af37] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg xs:text-xl font-display font-semibold text-neutral-800 mb-3 xs:mb-4 text-center">
                    Community Focus
                  </h3>
                  <p className="text-neutral-600 text-center leading-relaxed text-sm xs:text-base">
                    We believe in bringing people together through the universal language of great
                    food.
                  </p>
                </motion.div>
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Tablet Grid View (sm to lg) */}
          <div className="hidden sm:grid lg:hidden grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-neutral-50 p-6 md:p-8 rounded-2xl shadow-lg border border-secondary-200/30 hover:border-secondary-400/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#facc15] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-display font-semibold text-neutral-800 mb-3 md:mb-4 text-center">
                Quality First
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-sm md:text-base">
                We source the finest ingredients and maintain the highest standards in every dish we
                prepare.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-neutral-50 p-6 md:p-8 rounded-2xl shadow-lg border border-primary-200/30 hover:border-primary-400/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#0f766e] to-[#134e4a] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-display font-semibold text-neutral-800 mb-3 md:mb-4 text-center">
                Cultural Heritage
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-sm md:text-base">
                We honor Nigerian culinary traditions while making them accessible to everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-neutral-50 p-6 md:p-8 rounded-2xl shadow-lg border border-accent-200/30 hover:border-accent-400/50 hover:shadow-xl transition-all duration-300 group sm:col-span-2 md:col-span-1"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#facc15] to-[#d4af37] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-display font-semibold text-neutral-800 mb-3 md:mb-4 text-center">
                Community Focus
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-sm md:text-base">
                We believe in bringing people together through the universal language of great food.
              </p>
            </motion.div>
          </div>

          {/* Desktop Grid View (lg and above) */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-neutral-50 p-8 xl:p-10 rounded-2xl shadow-lg border border-secondary-200/30 hover:border-secondary-400/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#facc15] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl xl:text-2xl font-display font-semibold text-neutral-800 mb-4 xl:mb-6 text-center">
                Quality First
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-base xl:text-lg">
                We source the finest ingredients and maintain the highest standards in every dish we
                prepare.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-neutral-50 p-8 xl:p-10 rounded-2xl shadow-lg border border-primary-200/30 hover:border-primary-400/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#0f766e] to-[#134e4a] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl xl:text-2xl font-display font-semibold text-neutral-800 mb-4 xl:mb-6 text-center">
                Cultural Heritage
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-base xl:text-lg">
                We honor Nigerian culinary traditions while making them accessible to everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-neutral-50 p-8 xl:p-10 rounded-2xl shadow-lg border border-accent-200/30 hover:border-accent-400/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#facc15] to-[#d4af37] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl xl:text-2xl font-display font-semibold text-neutral-800 mb-4 xl:mb-6 text-center">
                Community Focus
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-base xl:text-lg">
                We believe in bringing people together through the universal language of great food.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="bg-gradient-to-b from-[#a8a7a3f3] to-[#3c3a36] pt-8 xs:pt-12 sm:pt-16 lg:pt-20 pb-8 xs:pb-12 sm:pb-16 lg:pb-20">
        <div className="container-custom px-3 xs:px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-6 xs:mb-8 sm:mb-12"
          >
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800 mb-3 xs:mb-4 sm:mb-6">
              Follow Our Culinary Journey
            </h2>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-neutral-800 max-w-3xl mx-auto leading-relaxed">
              Discover behind-the-scenes moments, new menu items, and the passion behind every dish
              we serve.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6 xs:mb-8 sm:mb-12"
          >
            <a
              href="https://www.instagram.com/exprezzmeals"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 xs:gap-3 px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 rounded-full font-semibold text-sm xs:text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
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

          {/* Mobile Swiper View (xs to md) */}
          <div className="block md:hidden mb-6 xs:mb-8">
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
                  className="bg-white p-4 xs:p-5 sm:p-6 rounded-2xl shadow-lg mx-2 xs:mx-3"
                >
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-3 xs:mb-4 mx-auto">
                    <Menu className="w-5 h-5 xs:w-6 xs:h-6 text-black" />
                  </div>
                  <h3 className="text-base xs:text-lg font-semibold text-neutral-800 mb-2 text-center">
                    Daily Specials
                  </h3>
                  <p className="text-neutral-600 text-center text-sm xs:text-base leading-relaxed">
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
                  className="bg-white p-4 xs:p-5 sm:p-6 rounded-2xl shadow-lg mx-2 xs:mx-3"
                >
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-accent-100 rounded-full flex items-center justify-center mb-3 xs:mb-4 mx-auto">
                    <CheckCircle className="w-5 h-5 xs:w-6 xs:h-6 text-black" />
                  </div>
                  <h3 className="text-base xs:text-lg font-semibold text-neutral-800 mb-2 text-center">
                    Behind the Scenes
                  </h3>
                  <p className="text-neutral-600 text-center text-sm xs:text-base leading-relaxed">
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
                  className="bg-white p-4 xs:p-5 sm:p-6 rounded-2xl shadow-lg mx-2 xs:mx-3"
                >
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-primary-100 rounded-full flex items-center justify-center mb-3 xs:mb-4 mx-auto">
                    <Users className="w-5 h-5 xs:w-6 xs:h-6 text-black" />
                  </div>
                  <h3 className="text-base xs:text-lg font-semibold text-neutral-800 mb-2 text-center">
                    Customer Stories
                  </h3>
                  <p className="text-neutral-600 text-center text-sm xs:text-base leading-relaxed">
                    See how our food brings people together and creates memorable experiences.
                  </p>
                </motion.div>
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Desktop Grid View (md and above) */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto mb-6 lg:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-secondary-100 rounded-full flex items-center justify-center mb-4 lg:mb-6 mx-auto group-hover:bg-secondary-200 transition-colors duration-300">
                <Menu className="w-6 h-6 lg:w-7 lg:h-7 text-black" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-neutral-800 mb-2 lg:mb-3 text-center">
                Daily Specials
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-sm lg:text-base">
                Be the first to know about our chef&apos;s daily creations and limited-time offers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-accent-100 rounded-full flex items-center justify-center mb-4 lg:mb-6 mx-auto group-hover:bg-accent-200 transition-colors duration-300">
                <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7 text-black" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-neutral-800 mb-2 lg:mb-3 text-center">
                Behind the Scenes
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-sm lg:text-base">
                Get an inside look at our kitchen and the passion that goes into every dish.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4 lg:mb-6 mx-auto group-hover:bg-primary-200 transition-colors duration-300">
                <Users className="w-6 h-6 lg:w-7 lg:h-7 text-black" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-neutral-800 mb-2 lg:mb-3 text-center">
                Customer Stories
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed text-sm lg:text-base">
                See how our food brings people together and creates memorable experiences.
              </p>
            </motion.div>
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
                className="w-full h-48 xs:h-56 sm:h-64 md:h-80 lg:h-96 border-0"
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
