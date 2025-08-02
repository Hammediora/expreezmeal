/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Elegant gold-green palette - sophisticated and inviting
        primary: {
          50: '#f7f9f7',
          100: '#eef2ee', 
          200: '#d5e3d7',
          300: '#b3ccb7',
          400: '#9ab0a6', // Light sage green
          500: '#6a9b86', // Main elegant green
          600: '#5a8a73',
          700: '#4a7360',
          800: '#384b42', // Deep forest green
          900: '#2a453a',
        },
        secondary: {
          50: '#fefbf0',
          100: '#fdf6e0',
          200: '#fbecb8',
          300: '#f8dc8a',
          400: '#f5ca55',
          500: '#d4af37', // Rich gold
          600: '#b8941f',
          700: '#9c7a19',
          800: '#806113',
          900: '#64480d',
        },
        accent: {
          50: '#f0f4f8',
          100: '#dce7f0',
          200: '#b8d0e2',
          300: '#94b7d3',
          400: '#6c96b6', // Soft blue-grey
          500: '#4f7a9c',
          600: '#425f82',
          700: '#384b68',
          800: '#2e3b4e',
          900: '#1f2834',
        },
        dark: {
          50: '#f7f7f7',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#384b42', // Deep forest green
          900: '#0a0a0a',
        },
        elegant: {
          cream: '#fefefe',
          sage: '#6a9b86',
          gold: '#d4af37',
          forest: '#384b42',
          mist: '#9ab0a6',
          shadow: '#2a453a',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "linear-gradient(135deg, rgba(56,75,66,0.9) 0%, rgba(106,155,134,0.7) 100%)",
        'elegant-gradient': "linear-gradient(135deg, rgba(56,75,66,0.95) 0%, rgba(212,175,55,0.1) 100%)",
        'gold-shimmer': "linear-gradient(90deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.3) 50%, rgba(212,175,55,0.1) 100%)",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}