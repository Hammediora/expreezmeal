'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CartItem, MenuItem, CartItemCustomization, APP_CONFIG } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | {
      type: 'ADD_ITEM'
      payload: MenuItem & {
        quantity?: number
        special_instructions?: string
        customizations?: CartItemCustomization[]
      }
    }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType extends CartState {
  addItem: (
    item: MenuItem,
    quantity?: number,
    customizations?: CartItemCustomization[],
    specialInstructions?: string
  ) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (open: boolean) => void
  getItemCount: () => number
  getSubtotal: () => number
  getTax: () => number
  getTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item =>
          item.menu_item_id === action.payload.id &&
          item.special_instructions === action.payload.special_instructions &&
          JSON.stringify(item.customizations || []) ===
            JSON.stringify(action.payload.customizations || [])
      )
      const quantity = action.payload.quantity || 1

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const newItems = [...state.items]
        newItems[existingItemIndex].quantity += quantity
        return { ...state, items: newItems }
      } else {
        // Calculate total customization cost
        const customizationCost = (action.payload.customizations || []).reduce(
          (total, customization) => total + customization.price_modifier,
          0
        )

        // Add new item
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random()}`,
          menu_item_id: action.payload.id,
          name: action.payload.name,
          price: action.payload.sale_price || action.payload.price,
          quantity,
          image_url: action.payload.image_url,
          special_instructions: action.payload.special_instructions,
          customizations: action.payload.customizations || [],
          total_customization_cost: customizationCost,
        }
        return { ...state, items: [...state.items, newItem] }
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(item => item.id !== action.payload.id) }
      }

      const newItems = state.items.map(item =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      )
      return { ...state, items: newItems }
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload.id) }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload }

    case 'LOAD_CART':
      return { ...state, items: action.payload }

    default:
      return state
  }
}

const CART_STORAGE_KEY = 'expreezmeal_cart'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state.items])

  const addItem = (
    item: MenuItem,
    quantity = 1,
    customizations?: CartItemCustomization[],
    specialInstructions?: string
  ) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...item,
        quantity,
        special_instructions: specialInstructions,
        customizations: customizations,
      },
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const setCartOpen = (open: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: open })
  }

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  const getSubtotal = () => {
    return state.items.reduce((sum, item) => {
      const itemTotal = (item.price + (item.total_customization_cost || 0)) * item.quantity
      return sum + itemTotal
    }, 0)
  }

  const getTax = () => {
    return getSubtotal() * APP_CONFIG.TAX_RATE // US sales tax
  }

  const getTotal = () => {
    return getSubtotal() + getTax()
  }

  const contextValue: CartContextType = {
    ...state,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    toggleCart,
    setCartOpen,
    getItemCount,
    getSubtotal,
    getTax,
    getTotal,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
