'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Users,
  DollarSign,
  MessageCircle,
} from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import './contact.module.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ContactFormData } from '@/types'
import { contactApi } from '@/lib/api'
import { BUSINESS_INFO } from '@/lib/constants'

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiry_type: 'general',
    event_date: '',
    guest_count: undefined,
    budget_range: '',
    special_requirements: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [showCateringFields, setShowCateringFields] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // Handle special logic for catering fields
    if (name === 'subject' && value === 'catering') {
      setShowCateringFields(true)
      setFormData(prev => ({
        ...prev,
        [name]: value,
        inquiry_type: 'catering',
      }))
    } else if (name === 'subject' && value !== 'catering') {
      setShowCateringFields(false)
      setFormData(prev => ({
        ...prev,
        [name]: value,
        inquiry_type: value,
        event_date: '',
        guest_count: undefined,
        budget_range: '',
        special_requirements: '',
      }))
    } else if (name === 'guest_count') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value) : undefined,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Prepare data for submission
      const submissionData: ContactFormData = {
        ...formData,
        // Only include catering fields if it's a catering inquiry
        ...(formData.inquiry_type === 'catering'
          ? {
              event_date: formData.event_date || undefined,
              guest_count: formData.guest_count || undefined,
              budget_range: formData.budget_range || undefined,
              special_requirements: formData.special_requirements || undefined,
            }
          : {}),
      }

      const response = await contactApi.submitContactForm(submissionData)

      setSubmitMessage(
        `Thank you for your message! We've received your inquiry (ID: ${response.inquiry_id.slice(0, 8)}) and will get back to you soon.`
      )

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiry_type: 'general',
        event_date: '',
        guest_count: undefined,
        budget_range: '',
        special_requirements: '',
      })
      setShowCateringFields(false)
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitMessage(
        `Sorry, there was an error sending your message. Please try again or contact us directly.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-64 sm:h-72 md:h-80 lg:h-96 flex items-center justify-center hero-bg">
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mb-2 sm:mb-3 md:mb-4"
          >
            Contact Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-neutral-200"
          >
            We&apos;d love to hear from you. Get in touch with us today.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-24 bg-[#fefcf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-neutral-800 mb-4 sm:mb-6">
                Get in Touch
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-neutral-900 mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
                Have questions about our menu, want to place a large order, or just want to say
                hello? We&apos;re here to help! Reach out to us through any of the channels below.
              </p>

              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-start space-x-4 sm:space-x-6 p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-red-100 to-red-200 p-3 sm:p-4 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-800 mb-2">Location</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-neutral-600 leading-relaxed">
                      {BUSINESS_INFO.address.street}
                      <br />
                      {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state}{' '}
                      {BUSINESS_INFO.address.zipCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 sm:space-x-6 p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 sm:p-4 rounded-full flex-shrink-0">
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-800 mb-2">Phone</h3>
                    <div className="space-y-1">
                      <a
                        href={`tel:${BUSINESS_INFO.contact.phones.main.replace(/[^\d]/g, '')}`}
                        className="block text-sm sm:text-base lg:text-lg text-neutral-600 hover:text-green-600 transition-colors"
                      >
                        {BUSINESS_INFO.contact.phones.main}
                      </a>
                      <a
                        href={`tel:${BUSINESS_INFO.contact.phones.orders.replace(/[^\d]/g, '')}`}
                        className="block text-sm sm:text-base lg:text-lg text-neutral-600 hover:text-green-600 transition-colors"
                      >
                        {BUSINESS_INFO.contact.phones.orders}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 sm:space-x-6 p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 sm:p-4 rounded-full flex-shrink-0">
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-800 mb-2">Email</h3>
                    <div className="space-y-1">
                      <a
                        href={`mailto:${BUSINESS_INFO.contact.emails.info}`}
                        className="block text-sm sm:text-base lg:text-lg text-neutral-600 hover:text-purple-600 transition-colors break-all"
                      >
                        {BUSINESS_INFO.contact.emails.info}
                      </a>
                      <a
                        href={`mailto:${BUSINESS_INFO.contact.emails.orders}`}
                        className="block text-sm sm:text-base lg:text-lg text-neutral-600 hover:text-purple-600 transition-colors break-all"
                      >
                        {BUSINESS_INFO.contact.emails.orders}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 sm:space-x-6 p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 sm:p-4 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-800 mb-2">Hours</h3>
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base lg:text-lg text-neutral-600">
                        {BUSINESS_INFO.hours.weekdays}
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg text-neutral-600">
                        {BUSINESS_INFO.hours.weekend}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl border border-neutral-100 hover:shadow-3xl transition-shadow duration-300"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-neutral-800 mb-6 sm:mb-8">
                Send us a Message
              </h2>

              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 sm:p-5 rounded-xl mb-6 sm:mb-8 text-sm sm:text-base shadow-sm ${
                    submitMessage.includes('error')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  {submitMessage}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm sm:text-base font-semibold text-neutral-700 mb-2 sm:mb-3"
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
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-300 text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 hover:border-neutral-300"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm sm:text-base font-semibold text-neutral-700 mb-2 sm:mb-3"
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
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-300 text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 hover:border-neutral-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm sm:text-base font-semibold text-neutral-700 mb-2 sm:mb-3"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-300 text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 hover:border-neutral-300"
                      placeholder="(312) 555-0123"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm sm:text-base font-semibold text-neutral-700 mb-2 sm:mb-3"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-300 text-base sm:text-lg text-neutral-900 hover:border-neutral-300"
                    >
                      <option value="" className="text-neutral-500">
                        Select a subject
                      </option>
                      <option value="general" className="text-neutral-900">
                        General Inquiry
                      </option>
                      <option value="order" className="text-neutral-900">
                        Order Support
                      </option>
                      <option value="catering" className="text-neutral-900">
                        Catering Services
                      </option>
                      <option value="feedback" className="text-neutral-900">
                        Feedback
                      </option>
                      <option value="partnership" className="text-neutral-900">
                        Partnership
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm sm:text-base font-semibold text-neutral-700 mb-2 sm:mb-3"
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
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-300 resize-vertical text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 hover:border-neutral-300"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Catering Fields - Only show when catering is selected */}
                {showCateringFields && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 sm:space-y-8 p-6 sm:p-8 bg-gradient-to-br from-secondary-50 via-accent-50 to-secondary-100 rounded-2xl border-2 border-secondary-200 shadow-inner"
                  >
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6 flex items-center">
                      <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                      </div>
                      Catering Event Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div>
                        <label
                          htmlFor="event_date"
                          className="block text-sm sm:text-base font-semibold text-neutral-700 mb-2 sm:mb-3"
                        >
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                          Event Date
                        </label>
                        <input
                          type="date"
                          id="event_date"
                          name="event_date"
                          value={formData.event_date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-300 text-base sm:text-lg text-neutral-900 hover:border-neutral-300"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="guest_count"
                          className="block text-sm sm:text-base font-semibold text-neutral-700 mb-2 sm:mb-3"
                        >
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                          Number of Guests
                        </label>
                        <input
                          type="number"
                          id="guest_count"
                          name="guest_count"
                          value={formData.guest_count || ''}
                          onChange={handleInputChange}
                          min="1"
                          max="1000"
                          className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-300 text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 hover:border-neutral-300"
                          placeholder="e.g., 50"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="budget_range"
                        className="block text-sm sm:text-base font-semibold text-neutral-700 mb-2 sm:mb-3"
                      >
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                        Budget Range
                      </label>
                      <select
                        id="budget_range"
                        name="budget_range"
                        value={formData.budget_range}
                        onChange={handleInputChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-300 text-base sm:text-lg text-neutral-900 hover:border-neutral-300"
                      >
                        <option value="" className="text-neutral-500">
                          Select budget range
                        </option>
                        <option value="under-500" className="text-neutral-900">
                          Under $500
                        </option>
                        <option value="500-1000" className="text-neutral-900">
                          $500 - $1,000
                        </option>
                        <option value="1000-2500" className="text-neutral-900">
                          $1,000 - $2,500
                        </option>
                        <option value="2500-5000" className="text-neutral-900">
                          $2,500 - $5,000
                        </option>
                        <option value="5000-10000" className="text-neutral-900">
                          $5,000 - $10,000
                        </option>
                        <option value="above-10000" className="text-neutral-900">
                          Above $10,000
                        </option>
                        <option value="flexible" className="text-neutral-900">
                          Flexible / Discuss
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="special_requirements"
                        className="block text-sm sm:text-base font-semibold text-neutral-700 mb-2 sm:mb-3"
                      >
                        Special Requirements or Dietary Restrictions
                      </label>
                      <textarea
                        id="special_requirements"
                        name="special_requirements"
                        value={formData.special_requirements}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-300 resize-vertical text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 hover:border-neutral-300"
                        placeholder="Any dietary restrictions, theme preferences, specific menu requests, etc."
                      />
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-4 sm:py-5 px-6 sm:px-8 text-base sm:text-lg lg:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-3"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Contact Us Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-bl from-[#2f2e2b] to-[#999792]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-3 sm:mb-4">
              We&apos;re Here to Help
            </h2>
            <p className="text-base sm:text-lg text-white max-w-3xl mx-auto">
              Whether you have questions about our menu, need catering services, or want to share
              feedback, we&apos;re always ready to assist you.
            </p>
          </div>

          {/* Desktop Grid View (hidden on mobile) */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl border border-neutral-100 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-600" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-neutral-800 mb-3">
                Catering Services
              </h3>
              <p className="text-sm lg:text-base text-neutral-600 leading-relaxed">
                Planning an event? Let us cater your special occasion with our delicious Nigerian
                cuisine and exceptional service. Perfect for weddings, corporate events, and
                celebrations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl border border-neutral-100 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-neutral-800 mb-3">Order Support</h3>
              <p className="text-sm lg:text-base text-neutral-600 leading-relaxed">
                Need help with your order? Have questions about our menu items or ingredients? Our
                friendly team is ready to assist you with anything you need.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl border border-neutral-100 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 lg:w-10 lg:h-10 text-orange-600" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-neutral-800 mb-3">
                Feedback & Suggestions
              </h3>
              <p className="text-sm lg:text-base text-neutral-600 leading-relaxed">
                Your opinion matters to us! Share your feedback, suggestions, or let us know about
                your dining experience. Help us serve you better.
              </p>
            </motion.div>
          </div>

          {/* Mobile Swiper View (visible only on mobile) */}
          <div className="md:hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              className="contactSwiper pb-12"
            >
              <SwiperSlide>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 text-center mx-4"
                >
                  <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-3">Catering Services</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Planning an event? Let us cater your special occasion with our delicious
                    Nigerian cuisine and exceptional service. Perfect for weddings, corporate
                    events, and celebrations.
                  </p>
                </motion.div>
              </SwiperSlide>

              <SwiperSlide>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 text-center mx-4"
                >
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Phone className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-3">Order Support</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Need help with your order? Have questions about our menu items or ingredients?
                    Our friendly team is ready to assist you with anything you need.
                  </p>
                </motion.div>
              </SwiperSlide>

              <SwiperSlide>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 text-center mx-4"
                >
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-3">
                    Feedback & Suggestions
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Your opinion matters to us! Share your feedback, suggestions, or let us know
                    about your dining experience. Help us serve you better.
                  </p>
                </motion.div>
              </SwiperSlide>
            </Swiper>
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 sm:p-10 lg:p-12 rounded-3xl shadow-2xl border border-neutral-100 max-w-5xl mx-auto hover:shadow-3xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-800 mb-4 sm:mb-6">
                Quick Response Promise
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-neutral-600 mb-6 sm:mb-8 leading-relaxed">
                We aim to respond to all inquiries within 24 hours during business days. For urgent
                matters, please call us directly at{' '}
                <a
                  href="tel:3125550123"
                  className="text-secondary-600 hover:text-secondary-700 font-bold underline decoration-2 underline-offset-2 transition-colors duration-300"
                >
                  (312) 555-0123
                </a>
              </p>
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm sm:text-base lg:text-lg text-neutral-500">
                <span className="flex items-center bg-neutral-50 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  <span className="font-semibold">Mon-Sat: 11AM-9PM</span>
                </span>
                <span className="flex items-center bg-neutral-50 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  <span className="font-semibold">Sun: 12PM-8PM</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
