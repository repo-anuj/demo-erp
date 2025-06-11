'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDemo } from '@/contexts/demo-context'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { Overview } from '@/components/dashboard/overview'
import { RecentSales } from '@/components/dashboard/recent-sales'
import { RecentEmployees } from '@/components/dashboard/recent-employees'
import { TopPerformers } from '@/components/dashboard/top-performers'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { user, isAuthenticated, sales, employees, dashboardStats } = useDemo()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    } else {
      // Simulate loading
      setTimeout(() => setLoading(false), 1000)
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  // Prepare dashboard data
  const dashboardCardData = {
    revenue: dashboardStats.totalRevenue,
    users: dashboardStats.totalEmployees,
    inventory: dashboardStats.totalInventoryValue,
    projects: dashboardStats.activeProjects
  }

  // Prepare recent sales data
  const recentSalesData = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(sale => ({
      id: sale.id,
      name: sale.customerName,
      email: `contact@${sale.customerName.toLowerCase().replace(/\s+/g, '')}.com`,
      amount: sale.total,
      date: sale.date,
      image: undefined
    }))

  // Prepare recent employees data
  const recentEmployeesData = employees
    .sort((a, b) => new Date(b.startDate || b.hireDate).getTime() - new Date(a.startDate || a.hireDate).getTime())
    .slice(0, 5)
    .map(emp => ({
      ...emp,
      name: `${emp.firstName} ${emp.lastName}`,
      hireDate: emp.startDate || emp.hireDate // Map startDate to hireDate for compatibility
    }))

  // Prepare top performers data (employees with sales)
  const employeeSalesMap = sales.reduce((acc, sale) => {
    if (sale.employeeId) {
      if (!acc[sale.employeeId]) {
        acc[sale.employeeId] = { totalSales: 0, salesCount: 0 }
      }
      acc[sale.employeeId].totalSales += sale.total
      acc[sale.employeeId].salesCount += 1
    }
    return acc
  }, {} as Record<string, { totalSales: number; salesCount: number }>)

  const topPerformersData = employees
    .map(employee => ({
      ...employee,
      name: `${employee.firstName} ${employee.lastName}`, // Add name field
      totalSales: employeeSalesMap[employee.id]?.totalSales || 0,
      salesCount: employeeSalesMap[employee.id]?.salesCount || 0
    }))
    .filter(employee => employee.totalSales > 0)
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5)

  const DashboardSkeleton = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
              <Skeleton className="h-4 w-[80px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-[120px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                  <Skeleton className="h-4 w-[60px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <DashboardCards data={dashboardCardData} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <div className="p-6">
                <div className="flex items-center justify-between space-y-2">
                  <h3 className="text-xl font-semibold">Revenue Overview</h3>
                </div>
                <Overview data={dashboardStats.monthlySales} />
              </div>
            </Card>
            <Card className="col-span-3">
              <div className="p-6">
                <div className="flex items-center justify-between space-y-2">
                  <h3 className="text-xl font-semibold">Recent Sales</h3>
                </div>
                <RecentSales data={recentSalesData} />
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between space-y-2">
                  <h3 className="text-xl font-semibold">Recent Employees</h3>
                </div>
                <RecentEmployees data={recentEmployeesData} />
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between space-y-2">
                  <h3 className="text-xl font-semibold">Top Performers</h3>
                </div>
                <TopPerformers data={topPerformersData} />
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
