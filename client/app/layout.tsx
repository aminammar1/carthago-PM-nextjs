import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DashboardWrapper from './DashboardWrapper'
import { Toaster } from '@/components/ui/sonner' // Import Toaster
import { GlobalLoader } from '@/components/ui/global-loader'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'chartagoPM - Project Management Made Simple',
  description:
    'Modern project management platform with team collaboration tools',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${inter.variable} antialiased`}>
        <GlobalLoader />
        <DashboardWrapper>{children}</DashboardWrapper>
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  )
}
