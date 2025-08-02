'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import Cart from './Cart'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    isOpen: cartOpen,
    toggleCart,
    setCartOpen,
    getItemCount,
    items,
    updateQuantity,
    removeItem
  } = useCart()

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleCheckout = () => {
    setCartOpen(false)
    // Navigation will be handled by the checkout page
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-elegant-cream shadow-lg sticky top-0 z-50 border-b border-primary-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-primary-800 hover:text-secondary-600 transition-colors duration-300">
                ExpreeZmeal
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-primary-700 hover:text-secondary-600 px-3 py-2 rounded-md text-sm lg:text-base font-medium transition-all duration-300 hover:bg-primary-50 relative group"
              >
                {item.name}
              </Link>
            ))}

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-3 text-primary-700 hover:text-secondary-600 transition-all duration-300 hover:bg-primary-50 rounded-lg group"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h12M7 13h10" />
              </svg>
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* Order Now Button */}
            <Link href="/menu" className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
              Order Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-700 hover:text-secondary-600 focus:outline-none focus:text-secondary-600 p-2 hover:bg-primary-50 rounded-lg transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-elegant-cream border-t border-primary-100">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-primary-700 hover:text-secondary-600 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-primary-50 border-l-4 border-transparent hover:border-secondary-500"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex space-x-4 px-3 py-2">
                <button
                  onClick={toggleCart}
                  className="relative p-3 text-primary-700 hover:text-secondary-600 transition-all duration-300 hover:bg-primary-50 rounded-lg flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h12M7 13h10" />
                  </svg>
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </button>
                <Link href="/menu" className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg text-center flex-1">
                  Order Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Cart Sidebar */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />
    </motion.nav>
  )
}

export default Navbar