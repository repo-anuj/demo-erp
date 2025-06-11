'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import demoData from '@/data/demo-data.json'

interface DemoUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'employee'
  companyId: string
  isEmployee?: boolean
  firstName?: string
  lastName?: string
}

interface DemoCompany {
  id: string
  name: string
  email: string
  phone: string
  address: string
  website: string
  type: string
  industry: string
  employeeCount: number
  foundedYear: number
}

interface DemoContextType {
  // Authentication
  user: DemoUser | null
  isAuthenticated: boolean
  hasCompletedSignup: boolean
  hasCompletedOnboarding: boolean
  login: (email: string, password: string, isEmployee?: boolean) => Promise<boolean>
  signup: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<boolean>
  completeOnboarding: (companyData: any) => Promise<boolean>
  logout: () => void

  // Data
  company: DemoCompany
  employees: any[]
  customers: any[]
  inventory: any[]
  sales: any[]
  projects: any[]
  finance: any[]
  dashboardStats: any

  // Loading states
  loading: boolean
  setLoading: (loading: boolean) => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasCompletedSignup, setHasCompletedSignup] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('demo-user')
    const savedSignupStatus = localStorage.getItem('demo-completed-signup')
    const savedOnboardingStatus = localStorage.getItem('demo-completed-onboarding')

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('demo-user')
      }
    }

    setHasCompletedSignup(savedSignupStatus === 'true')
    setHasCompletedOnboarding(savedOnboardingStatus === 'true')
  }, [])

  const login = async (email: string, password: string, isEmployee = false): Promise<boolean> => {
    setLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check credentials against demo data
    const credentials = demoData.demoCredentials
    const validCredential = Object.values(credentials).find(
      cred => cred.email === email && cred.password === password
    )

    if (validCredential) {
      // Find the corresponding user
      const foundUser = demoData.users.find(u => u.email === email)
      if (foundUser) {
        const userWithEmployee = { ...foundUser, isEmployee }
        setUser(userWithEmployee as DemoUser)
        localStorage.setItem('demo-user', JSON.stringify(userWithEmployee))
        localStorage.setItem('demo-completed-onboarding', 'true')
        setHasCompletedOnboarding(true)
        setLoading(false)
        return true
      }
    }

    setLoading(false)
    return false
  }

  const signup = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<boolean> => {
    setLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Create new user
    const newUser: DemoUser = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'admin',
      companyId: 'demo-company-new'
    }

    setUser(newUser)
    localStorage.setItem('demo-user', JSON.stringify(newUser))
    localStorage.setItem('demo-completed-signup', 'true')
    setHasCompletedSignup(true)
    setLoading(false)
    return true
  }

  const completeOnboarding = async (companyData: any): Promise<boolean> => {
    setLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update company data in localStorage (in real app, this would be saved to backend)
    localStorage.setItem('demo-company-data', JSON.stringify(companyData))
    localStorage.setItem('demo-completed-onboarding', 'true')
    setHasCompletedOnboarding(true)
    setLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('demo-user')
    localStorage.removeItem('demo-completed-signup')
    localStorage.removeItem('demo-completed-onboarding')
    localStorage.removeItem('demo-company-data')
    setHasCompletedSignup(false)
    setHasCompletedOnboarding(false)
  }

  const value: DemoContextType = {
    // Authentication
    user,
    isAuthenticated: !!user,
    hasCompletedSignup,
    hasCompletedOnboarding,
    login,
    signup,
    completeOnboarding,
    logout,

    // Data from JSON
    company: demoData.company,
    employees: demoData.employees,
    customers: demoData.customers,
    inventory: demoData.inventory,
    sales: demoData.sales,
    projects: demoData.projects,
    finance: demoData.finance,
    dashboardStats: demoData.dashboardStats,

    // Loading states
    loading,
    setLoading,
  }

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}
