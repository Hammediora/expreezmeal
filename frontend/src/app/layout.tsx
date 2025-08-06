import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'ExpreeZmeal - Nigerian Fast-Casual Restaurant',
  description:
    'Luxurious Nigerian fast-casual dining featuring shawarma, zobo, meat pies, and local snacks',
  keywords: 'Nigerian food, shawarma, zobo, meat pies, fast-casual dining, luxury restaurant',
  authors: [{ name: 'ExpreeZmeal Team' }],
  icons: {
    icon: '/images/LogoIcon3.png',
    apple: '/images/LogoIcon3.png',
  },
  openGraph: {
    title: 'ExpreeZmeal - Nigerian Fast-Casual Restaurant',
    description:
      'Luxurious Nigerian fast-casual dining featuring shawarma, zobo, meat pies, and local snacks',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preload" href="/videos/shawarma-hero.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/images/elegantRestaurat.jpg" as="image" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-body text-foreground bg-background`}
        suppressHydrationWarning={true}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
