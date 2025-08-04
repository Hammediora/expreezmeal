'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function About() {
  return (
    <div className="min-h-screen bg-elegant-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0 elegant-bg-image"></div>
        <div className="absolute inset-0 bg-elegant-gradient opacity-85 z-10"></div>
        <div className="absolute inset-0 bg-black opacity-25 z-10"></div>

        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 leading-tight drop-shadow-2xl"
          >
            About <span className="text-secondary-400 drop-shadow-lg">ExpreeZmeal</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl mb-8 text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Discover the story behind Nigeria&apos;s premier fast-casual dining experience
          </motion.p>
        </div>
      </section>

      {/* Where Tradition Meets Innovation Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">
                Our Story
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-neutral-800 leading-tight">
                Where Tradition Meets
                <span className="text-secondary-600 block mt-2">Innovation</span>
              </h2>

              <div className="w-24 h-1 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full"></div>

              <p className="text-lg text-neutral-600 leading-relaxed">
                At ExpreeZmeal, we blend the rich culinary heritage of Nigeria with modern
                fast-casual dining. Our chefs use time-honored recipes and premium ingredients to
                create dishes that honor tradition while embracing contemporary tastes.
              </p>

              <p className="text-lg text-neutral-600 leading-relaxed">
                From our signature shawarma wraps to our refreshing zobo beverages, every item on
                our menu tells a story of Nigerian culture and hospitality.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/menu"
                  className="bg-secondary-600 hover:bg-secondary-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-center"
                >
                  View Our Menu
                </Link>
                <Link
                  href="/contact"
                  className="bg-transparent border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 text-center"
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
              className="relative"
            >
              <div className="relative">
                {/* Main image container */}
                <div className="aspect-[4/3] lg:aspect-auto rounded-3xl overflow-hidden shadow-2xl relative bg-white p-2">
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    <Image
                      src="/images/elegantRestaurat.jpg"
                      alt="ExpreeZmeal Restaurant Interior"
                      width={700}
                      height={700}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary-600/10 via-transparent to-accent-600/10"></div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-secondary-200 to-accent-200 rounded-full opacity-60 blur-sm"></div>
                <div className="absolute top-10 -left-2 w-16 h-16 bg-gradient-to-br from-accent-200 to-secondary-200 rounded-full opacity-40 blur-sm"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-6">
              Our Values
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Every dish we serve is guided by our core principles and commitment to excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-[#f8fafc] p-8 rounded-2xl shadow-lg border border-[#d4af37]/20 hover:border-[#d4af37]/40 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#facc15] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-[0_0_15px_#d4af37] transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-neutral-800 mb-4 text-center">
                Quality First
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed">
                We source the finest ingredients and maintain the highest standards in every dish we
                prepare.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-[#f8fafc] p-8 rounded-2xl shadow-lg border border-[#0f766e]/20 hover:border-[#0f766e]/40 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#0f766e] to-[#134e4a] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-[0_0_15px_#0f766e] transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-neutral-800 mb-4 text-center">
                Cultural Heritage
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed">
                We honor Nigerian culinary traditions while making them accessible to everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-[#f8fafc] p-8 rounded-2xl shadow-lg border border-[#facc15]/20 hover:border-[#facc15]/40 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#facc15] to-[#d4af37] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-[0_0_15px_#facc15] transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-neutral-800 mb-4 text-center">
                Community Focus
              </h3>
              <p className="text-neutral-600 text-center leading-relaxed">
                We believe in bringing people together through the universal language of great food.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-6">
              Follow Our Culinary Journey
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover behind-the-scenes moments, new menu items, and the passion behind every dish
              we serve.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8"
          >
            <a
              href="https://www.instagram.com/exprezzmeals"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#facc15] to-[#DAA520] opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#134e4a] via-[#0f766e] to-[#134e4a] opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3 text-white">
                <svg className="w-6 h-6 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="drop-shadow-md">Follow @exprezzmeals</span>
              </div>

              {/* Glowing border */}
              <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/40 group-hover:border-[#d4af37]/60 group-hover:shadow-[0_0_20px_#d4af37] transition-all duration-300"></div>
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
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
                <svg className="w-6 h-6 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
                <svg className="w-6 h-6 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Customer Stories</h3>
              <p className="text-neutral-600">
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
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <iframe
                src="https://www.instagram.com/exprezzmeals/embed"
                className="w-full h-96 border-0"
                title="Instagram Feed"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
