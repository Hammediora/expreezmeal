'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Twitter, Video, MapPin, Phone, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/images/extraLogo.png"
                alt="ExpreeZmeal"
                width={150}
                height={40}
                className="h-10 w-auto mr-4"
              />
              <h2 className="text-3xl font-display font-bold text-secondary-400">ExpreeZmeal</h2>
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
            <h3 className="text-lg font-display font-semibold text-accent-400 mb-4">Quick Links</h3>
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
                <MapPin className="w-4 h-4 mr-2" />
                Chicago, Illinois
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +1 (312) 555-0123
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                info@expreezmeal.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">© 2024 ExpreeZmeal. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
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
    </footer>
  )
}

export default Footer
