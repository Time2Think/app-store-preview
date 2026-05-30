import type { Metadata } from 'next'
import { Inter, Roboto } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ios',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-android',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Store Preview Tool',
  description: 'Preview your app listing in App Store and Google Play simultaneously',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${roboto.variable}`}>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white h-screen overflow-hidden">
        {children}
      </body>
    </html>
  )
}
