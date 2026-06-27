'use client'

import { Inter, Outfit, Playfair_Display } from 'next/font/google'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import AnalyticsTracker from '@/components/layout/AnalyticsTracker'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
  }))

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable}`}>
      <head>
        <title>Kite Side — Ras Sudr Egypt</title>
        <meta name="description" content="IKO certified kitesurfing center on Egypt's Red Sea" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Kite Side — Ras Sudr Egypt" />
        <meta property="og:description" content="IKO certified kitesurfing center on Egypt's Red Sea" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <AnalyticsTracker />
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </QueryClientProvider>
      </body>
    </html>
  )
}
