import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Store Preview Tool',
  description: 'Preview your app listing in App Store and Google Play simultaneously',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white h-screen overflow-hidden">
        {children}
      </body>
    </html>
  )
}
