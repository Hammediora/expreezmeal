import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "ExpreeZmeal - Nigerian Fast-Casual Restaurant",
  description: "Luxurious Nigerian fast-casual dining featuring shawarma, zobo, meat pies, and local snacks",
  keywords: "Nigerian food, shawarma, zobo, meat pies, fast-casual dining, luxury restaurant",
  authors: [{ name: "ExpreeZmeal Team" }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "ExpreeZmeal - Nigerian Fast-Casual Restaurant",
    description: "Luxurious Nigerian fast-casual dining featuring shawarma, zobo, meat pies, and local snacks",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-body text-foreground bg-background`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
