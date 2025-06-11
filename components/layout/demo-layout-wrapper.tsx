'use client'

import { usePathname } from 'next/navigation'
import { useDemo } from '@/contexts/demo-context'
import { Sidebar } from './sidebar'
import { Header } from './header'

interface DemoLayoutWrapperProps {
  children: React.ReactNode
}

export function DemoLayoutWrapper({ children }: DemoLayoutWrapperProps) {
  const pathname = usePathname()
  const { isAuthenticated, hasCompletedOnboarding } = useDemo()

  // Auth pages that don't need the main layout
  const isAuthPage = pathname === '/' || pathname === '/auth/signin' || pathname === '/auth/signup' || pathname === '/auth/onboarding'

  // Show auth layout for unauthenticated users or on auth pages
  if (!isAuthenticated || isAuthPage) {
    return (
      <>
        {/* Demo Banner */}
        <div className="demo-banner">
          🚀 This is a demo version of ERP-AI with placeholder data.
          <span className="ml-2 font-semibold">
            Try: admin@demo.com / demo123
          </span>
        </div>
        {children}
      </>
    )
  }

  // Show main ERP layout for authenticated users who completed onboarding
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
