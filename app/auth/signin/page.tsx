'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useDemo } from '@/contexts/demo-context'
import { toast } from 'sonner'
import { Building2, Users, BarChart3, Package, DollarSign, Briefcase, Eye, EyeOff } from 'lucide-react'

export default function SigninPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isEmployee, setIsEmployee] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, isAuthenticated, loading } = useDemo()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    const success = await login(email, password, isEmployee)
    
    if (success) {
      toast.success('Welcome back! Redirecting to dashboard...')
      router.push('/dashboard')
    } else {
      toast.error('Invalid credentials. Try the demo accounts below.')
    }
  }

  const fillDemoCredentials = (role: 'admin' | 'manager' | 'employee') => {
    const credentials = {
      admin: { email: 'admin@demo.com', password: 'demo123' },
      manager: { email: 'manager@demo.com', password: 'demo123' },
      employee: { email: 'employee@demo.com', password: 'demo123' }
    }
    
    setEmail(credentials[role].email)
    setPassword(credentials[role].password)
    setIsEmployee(role === 'employee')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Features showcase */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              ERP-AI Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Experience the power of modern Enterprise Resource Planning with our interactive demo
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Company Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive business overview</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">HR Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Employee tracking & payroll</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Package className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Inventory</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stock management & tracking</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Sales & Finance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue tracking & reporting</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Briefcase className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Project Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Task tracking & collaboration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time insights & KPIs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your ERP account or try our demo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isEmployee"
                    checked={isEmployee}
                    onCheckedChange={(checked) => setIsEmployee(checked as boolean)}
                    disabled={loading}
                  />
                  <Label htmlFor="isEmployee" className="text-sm">
                    Sign in as employee
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or try demo accounts
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fillDemoCredentials('admin')}
                    disabled={loading}
                  >
                    Admin
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fillDemoCredentials('manager')}
                    disabled={loading}
                  >
                    Manager
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fillDemoCredentials('employee')}
                    disabled={loading}
                  >
                    Employee
                  </Button>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Sign up for free
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  Demo mode • No real data stored
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
