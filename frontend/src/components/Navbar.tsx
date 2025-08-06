'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Cart from './Cart'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const {
    isOpen: cartOpen,
    toggleCart,
    setCartOpen,
    getItemCount,
    items,
    updateQuantity,
    removeItem,
  } = useCart()

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        // Always show navbar at the top
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlNavbar)
    return () => window.removeEventListener('scroll', controlNavbar)
  }, [lastScrollY])

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
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-elegant-cream/95 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-primary-100"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Custom Luxury Logo */}
          <div className="flex items-center flex-1">
            <Link href="/" className="flex-shrink-0 group relative">
              {/* Elegant Box Frame - Responsive */}
              <div className="rounded-lg sm:rounded-xl px-2 py-1 sm:px-4 sm:py-2 border border-[#d4af37]/40 bg-black/20 backdrop-blur-md shadow-[0_0_8px_#134e4a,0_0_4px_#d4af37] transition-all duration-300 group-hover:border-[#d4af37]/60 group-hover:bg-black/30 group-hover:shadow-[0_0_12px_#134e4a,0_0_8px_#d4af37]">
                <div className="flex flex-col">
                  <div className="flex items-baseline tracking-tight">
                    {/* Custom "E" with embellishments - Responsive sizing */}
                    <span className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#d4af37] via-[#f4cd6f] to-[#d4af37] relative font-serif drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">
                      E
                      <div className="absolute -top-1 sm:-top-2 left-0 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-[#DAA520] rounded-full opacity-90 shadow-md" />
                      <div className="absolute -bottom-0.5 sm:-bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent opacity-50" />
                    </span>

                    {/* Brand name segments - Responsive sizing */}
                    <span className="text-xl sm:text-2xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#facc15] via-[#ffdd99] to-[#facc15] font-serif drop-shadow-[0_1px_2px_rgba(255,255,255,0.2)] ml-0.5 sm:ml-1">
                      xprezz
                    </span>
                    <span className="text-xl sm:text-2xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#d4af37] via-[#f4cd6f] to-[#d4af37] font-serif drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)] mx-0.5">
                      Z
                    </span>
                    <span className="text-xl sm:text-2xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#facc15] via-[#ffe58a] to-[#facc15] font-serif drop-shadow-[0_1px_2px_rgba(255,255,255,0.2)]">
                      meal
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DAA520]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg sm:rounded-xl blur-sm"></div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
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
              <ShoppingCart className="w-6 h-6" />
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Cart Button - Mobile */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-primary-700 hover:text-secondary-600 transition-all duration-300 hover:bg-primary-50 rounded-lg group"
            >
              <ShoppingCart className="w-5 h-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-700 hover:text-secondary-600 focus:outline-none focus:text-secondary-600 p-2 hover:bg-primary-50 rounded-lg transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            <div className="px-1 pt-2 pb-3 space-y-1 bg-elegant-cream border-t border-primary-100">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-primary-700 hover:text-secondary-600 block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary-50 border-l-4 border-transparent hover:border-secondary-500"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
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
