'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Map } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ContactFormData } from '@/types'

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement actual form submission to backend
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      setSubmitMessage("Thank you for your message! We'll get back to you soon.")
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      setSubmitMessage(
        `Sorry, there was an error sending your message: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-72 sm:h-80 md:h-96 flex items-center justify-center hero-bg">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 sm:mb-4"
          >
            Contact Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-200"
          >
            We&apos;d love to hear from you. Get in touch with us today.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-display font-bold text-neutral-800 mb-6">
                Get in Touch
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Have questions about our menu, want to place a large order, or just want to say
                hello? We&apos;re here to help! Reach out to us through any of the channels below.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-1">Location</h3>
                    <p className="text-neutral-600">
                      123 Lagos Street, Victoria Island
                      <br />
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-1">Phone</h3>
                    <p className="text-neutral-600">+234 123 456 7890</p>
                    <p className="text-neutral-600">+234 123 456 7891</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-1">Email</h3>
                    <p className="text-neutral-600">info@expreezmeal.com</p>
                    <p className="text-neutral-600">orders@expreezmeal.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-100 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-1">Hours</h3>
                    <p className="text-neutral-600">Monday - Saturday: 9:00 AM - 10:00 PM</p>
                    <p className="text-neutral-600">Sunday: 11:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card p-8"
            >
              <h2 className="text-3xl font-display font-bold text-neutral-800 mb-6">
                Send us a Message
              </h2>

              {submitMessage && (
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    submitMessage.includes('error')
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors"
                      placeholder="+234 123 456 7890"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="catering">Catering Services</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section - Placeholder */}
      <section className="h-96 bg-neutral-200">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <Map className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">Interactive map coming soon</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
