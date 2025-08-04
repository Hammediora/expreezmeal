// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Menu & Category Types
export interface Category {
  id: string
  name: string
  description: string
  image_url?: string
  display_order: number
}

export interface OptionChoice {
  id: string
  name: string
  price_modifier: number
  is_default: boolean
  display_order: number
}

export interface CustomizationOption {
  id: string
  name: string
  type: 'SINGLE_SELECT' | 'MULTI_SELECT'
  is_required: boolean
  display_order: number
  choices: OptionChoice[]
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string
  price: number
  sale_price?: number
  image_url?: string
  is_available: boolean
  is_featured: boolean
  preparation_time?: number
  calories?: number
  allergens?: string[]
  dietary_flags?: string[]
  customization_options?: CustomizationOption[]
}

// Cart Types
export interface CartItemCustomization {
  customization_option_id: string
  option_choice_id: string
  option_name: string
  choice_name: string
  price_modifier: number
}

export interface CartItem {
  id: string
  menu_item_id: string
  name: string
  price: number
  quantity: number
  special_instructions?: string
  image_url?: string
  customizations?: CartItemCustomization[]
  total_customization_cost?: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  tip: number
  total: number
}

// Order Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
export type OrderType = 'DELIVERY' | 'PICKUP' | 'DINE_IN'

export interface OrderItem {
  id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  total_price: number
  special_instructions?: string
}

export interface Order {
  id: string
  status: OrderStatus
  order_type: OrderType
  subtotal: number
  tax: number
  tip: number
  total: number
  created_at: string
  estimated_delivery_time?: string
  special_instructions?: string
  items: OrderItem[]
}

// User Types
export interface User {
  id: string
  full_name: string
  email: string
  phone?: string
  is_superuser: boolean
  created_at: string
  last_login?: string
}

export interface Address {
  id: string
  user_id: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  address_type: 'BILLING' | 'DELIVERY' | 'PICKUP'
}

// Form Types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface CheckoutFormData {
  delivery_address: Address
  payment_method: string
  special_instructions?: string
  tip_amount?: number
}

// Simple customer info for pickup orders
export interface PickupCustomerInfo {
  name: string
  phone: string
  email?: string
}

export interface PickupCheckoutFormData {
  customer: PickupCustomerInfo
  payment_method: string
  special_instructions?: string
  tip_amount?: number
}

// Component Props Types
export interface PageProps {
  params: { [key: string]: string | string[] | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  CATEGORIES: '/api/categories',
  MENU_ITEMS: '/api/menu-items',
  FEATURED_ITEMS: '/api/menu-items/featured',
  ORDERS: '/api/orders',
} as const

// App Configuration
export const APP_CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  APP_NAME: 'ExpreeZmeal',
  CURRENCY: '$',
  TAX_RATE: 0.0875, // 8.75% sales tax (typical for Chicago)
  DEFAULT_TIP_PERCENTAGE: 15,
} as const