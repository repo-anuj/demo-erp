'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useDemo } from '@/contexts/demo-context'
import { toast } from 'sonner'
import { Building2, Users, Package, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

interface FormData {
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  companyWebsite: string
  industry: string
  companyType: string
  employeeCount: string
  foundedYear: string
  departments: string[]
}

const INITIAL_FORM_DATA: FormData = {
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  companyAddress: '',
  companyWebsite: '',
  industry: '',
  companyType: '',
  employeeCount: '',
  foundedYear: '',
  departments: []
}

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Real Estate',
  'Consulting',
  'Other'
]

const COMPANY_TYPES = [
  'Corporation',
  'LLC',
  'Partnership',
  'Sole Proprietorship',
  'Non-profit'
]

const DEPARTMENTS = [
  'Human Resources',
  'Finance',
  'Sales',
  'Marketing',
  'Engineering',
  'Operations',
  'Customer Service',
  'Legal'
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const totalSteps = 4
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const { user, completeOnboarding, loading, hasCompletedSignup } = useDemo()

  // Redirect if not signed up
  useEffect(() => {
    if (!user && !hasCompletedSignup) {
      router.push('/auth/signup')
    }
  }, [user, hasCompletedSignup, router])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDepartmentChange = (department: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      departments: checked 
        ? [...prev.departments, department]
        : prev.departments.filter(d => d !== department)
    }))
  }

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        return formData.companyName && formData.companyEmail
      case 2:
        return formData.industry && formData.companyType
      case 3:
        return formData.employeeCount && formData.departments.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => Math.min(prev + 1, totalSteps))
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast.error('Please complete all required fields')
      return
    }

    const success = await completeOnboarding(formData)
    
    if (success) {
      toast.success('Welcome to ERP-AI! Your company setup is complete.')
      router.push('/dashboard')
    } else {
      toast.error('Failed to complete setup. Please try again.')
    }
  }

  const fillDemoData = () => {
    setFormData({
      companyName: 'TechCorp Solutions',
      companyEmail: 'info@techcorp-demo.com',
      companyPhone: '+1 (555) 123-4567',
      companyAddress: '123 Business Ave, Tech City, TC 12345',
      companyWebsite: 'https://techcorp-demo.com',
      industry: 'Technology',
      companyType: 'Corporation',
      employeeCount: '50-100',
      foundedYear: '2015',
      departments: ['Human Resources', 'Engineering', 'Sales', 'Finance']
    })
  }

  if (!user && !hasCompletedSignup) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Company Setup</h1>
          </div>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-xl">Step {step} of {totalSteps}</CardTitle>
            <Button variant="outline" size="sm" onClick={fillDemoData} disabled={loading}>
              Fill Demo Data
            </Button>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <CardDescription className="text-center">
                Let's start with basic company information
              </CardDescription>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email *</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    placeholder="info@company.com"
                    value={formData.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.companyPhone}
                    onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <Input
                    id="companyAddress"
                    placeholder="123 Business St, City, State 12345"
                    value={formData.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    placeholder="https://company.com"
                    value={formData.companyWebsite}
                    onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <CardDescription className="text-center">
                Tell us about your business
              </CardDescription>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyType">Company Type *</Label>
                  <Select value={formData.companyType} onValueChange={(value) => handleInputChange('companyType', value)} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    placeholder="2020"
                    value={formData.foundedYear}
                    onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <CardDescription className="text-center">
                Configure your team structure
              </CardDescription>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Number of Employees *</Label>
                  <Select value={formData.employeeCount} onValueChange={(value) => handleInputChange('employeeCount', value)} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-100">51-100 employees</SelectItem>
                      <SelectItem value="101-500">101-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Departments *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DEPARTMENTS.map((department) => (
                      <div key={department} className="flex items-center space-x-2">
                        <Checkbox
                          id={department}
                          checked={formData.departments.includes(department)}
                          onCheckedChange={(checked) => handleDepartmentChange(department, checked as boolean)}
                          disabled={loading}
                        />
                        <Label htmlFor={department} className="text-sm">
                          {department}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <CardDescription>
                Perfect! Let's review your company setup
              </CardDescription>
              <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                <p><strong>Company:</strong> {formData.companyName}</p>
                <p><strong>Industry:</strong> {formData.industry}</p>
                <p><strong>Type:</strong> {formData.companyType}</p>
                <p><strong>Employees:</strong> {formData.employeeCount}</p>
                <p><strong>Departments:</strong> {formData.departments.join(', ')}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                You can always update this information later in your settings.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1 || loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {step < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!validateCurrentStep() || loading}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateCurrentStep() || loading}
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
