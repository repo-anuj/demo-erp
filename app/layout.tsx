import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { DemoProvider } from '@/contexts/demo-context'
import { NotificationProvider } from '@/contexts/notification-context'
import { DemoLayoutWrapper } from '@/components/layout/demo-layout-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ERP-AI Demo - Enterprise Resource Planning System',
  description: 'A comprehensive, modern ERP system demo built with Next.js, TypeScript, and modern UI components. Designed for businesses of all sizes with modular features.',
  keywords: 'ERP, Enterprise Resource Planning, Business Management, Demo, Next.js, TypeScript',
  authors: [{ name: 'ERP-AI Team' }],
  openGraph: {
    title: 'ERP-AI Demo - Enterprise Resource Planning System',
    description: 'Experience the power of modern ERP systems with our interactive demo',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ERP-AI Demo Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ERP-AI Demo - Enterprise Resource Planning System',
    description: 'Experience the power of modern ERP systems with our interactive demo',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DemoProvider>
            <NotificationProvider>
              <DemoLayoutWrapper>
                {children}
              </DemoLayoutWrapper>
              <Toaster />
            </NotificationProvider>
          </DemoProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
