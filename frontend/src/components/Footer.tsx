'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Instagram, Facebook, Twitter, Video, MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react'

const Footer = () => {
  const [showQuickLinks, setShowQuickLinks] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)

  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 lg:py-12 sm:px-6 lg:px-8">
        {/* Mobile-First Layout */}
        <div className="block md:hidden">
          {/* Brand Section - Always Visible on Mobile */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <Image
                src="/images/extraLogo.png"
                alt="ExpreeZmeal"
                width={120}
                height={32}
                className="h-8 w-auto mr-3"
              />
              <h2 className="text-xl font-display font-bold text-secondary-400">
                ExpreeZmeal
              </h2>
            </div>
            <p className="text-primary-100 text-sm leading-relaxed max-w-xs mx-auto mb-4">
              Premium Nigerian fast-casual dining experience
            </p>

            {/* Social Media Links */}
            <div className="flex justify-center space-x-3 mb-6">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://www.instagram.com/exprezzmeals"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary-500 hover:bg-secondary-600 p-2 rounded-full transition-all duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-secondary-500 hover:bg-secondary-600 p-2 rounded-full transition-all duration-300"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-secondary-500 hover:bg-secondary-600 p-2 rounded-full transition-all duration-300"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-secondary-500 hover:bg-secondary-600 p-2 rounded-full transition-all duration-300"
                aria-label="Follow us on TikTok"
              >
                <Video className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Collapsible Quick Links */}
          <div className="border-t border-neutral-700 pt-4 mb-4">
            <button
              onClick={() => setShowQuickLinks(!showQuickLinks)}
              className="flex items-center justify-between w-full text-left py-2 text-accent-400 font-semibold"
            >
              <span>Quick Links</span>
              {showQuickLinks ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {showQuickLinks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 pt-2"
              >
                <Link
                  href="/"
                  className="block text-neutral-300 hover:text-white transition-colors duration-200 text-sm py-1"
                >
                  Home
                </Link>
                <Link
                  href="/menu"
                  className="block text-neutral-300 hover:text-white transition-colors duration-200 text-sm py-1"
                >
                  Menu
                </Link>
                <Link
                  href="/about"
                  className="block text-neutral-300 hover:text-white transition-colors duration-200 text-sm py-1"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="block text-neutral-300 hover:text-white transition-colors duration-200 text-sm py-1"
                >
                  Contact
                </Link>
              </motion.div>
            )}
          </div>

          {/* Collapsible Contact Info */}
          <div className="border-t border-neutral-700 pt-4 mb-6">
            <button
              onClick={() => setShowContactInfo(!showContactInfo)}
              className="flex items-center justify-between w-full text-left py-2 text-accent-400 font-semibold"
            >
              <span>Contact Info</span>
              {showContactInfo ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {showContactInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 pt-2 text-neutral-300"
              >
                <p className="flex items-center text-sm">
                  <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                  Chicago, Illinois
                </p>
                <a 
                  href="tel:3125550123"
                  className="flex items-center text-sm hover:text-white transition-colors"
                >
                  <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                  +1 (312) 555-0123
                </a>
                <a 
                  href="mailto:info@expreezmeal.com"
                  className="flex items-center text-sm hover:text-white transition-colors"
                >
                  <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="break-all">info@expreezmeal.com</span>
                </a>
              </motion.div>
            )}
          </div>
        </div>

        {/* Desktop Layout - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/images/extraLogo.png"
                alt="ExpreeZmeal"
                width={150}
                height={40}
                className="h-10 w-auto mr-4"
              />
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-secondary-400">
                ExpreeZmeal
              </h2>
            </div>
            <p className="text-primary-100 mb-6 max-w-md leading-relaxed">
              Experience the finest Nigerian fast-casual dining with our premium shawarma,
              refreshing zobo, delicious meat pies, and authentic local snacks. Luxury meets
              tradition in every bite.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://www.instagram.com/exprezzmeals"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary-500 hover:bg-secondary-600 p-3 rounded-full transition-all duration-300 hover:shadow-lg"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-secondary-500 hover:bg-secondary-600 p-3 rounded-full transition-all duration-300 hover:shadow-lg"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-secondary-500 hover:bg-secondary-600 p-3 rounded-full transition-all duration-300 hover:shadow-lg"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-secondary-500 hover:bg-secondary-600 p-3 rounded-full transition-all duration-300 hover:shadow-lg"
                aria-label="Follow us on TikTok"
              >
                <Video className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold text-accent-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-neutral-300 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-neutral-300 hover:text-white transition-colors duration-200"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-300 hover:text-white transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-300 hover:text-white transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display font-semibold text-accent-400 mb-4">
              Contact Info
            </h3>
            <div className="space-y-2 text-neutral-300">
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                Chicago, Illinois
              </p>
              <a 
                href="tel:3125550123"
                className="flex items-center hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                +1 (312) 555-0123
              </a>
              <a 
                href="mailto:info@expreezmeal.com"
                className="flex items-center hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="break-all">info@expreezmeal.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-700 mt-6 lg:mt-8 pt-4 lg:pt-6">
          {/* Mobile Bottom Section */}
          <div className="block md:hidden text-center">
            <p className="text-neutral-400 text-xs mb-3">
              © 2024 ExpreeZmeal. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link
                href="/privacy-policy"
                className="text-neutral-400 hover:text-white transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms-service"
                className="text-neutral-400 hover:text-white transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                href="/trust-safety"
                className="text-neutral-400 hover:text-white transition-colors duration-200"
              >
                Safety
              </Link>
            </div>
          </div>

          {/* Desktop Bottom Section */}
          <div className="hidden md:flex flex-col lg:flex-row justify-between items-center text-center lg:text-left">
            <p className="text-neutral-400 text-sm">
              © 2024 ExpreeZmeal. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-6 mt-4 lg:mt-0">
              <Link
                href="/privacy-policy"
                className="text-neutral-400 hover:text-white text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-service"
                className="text-neutral-400 hover:text-white text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/trust-safety"
                className="text-neutral-400 hover:text-white text-sm transition-colors duration-200"
              >
                Trust & Safety
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
