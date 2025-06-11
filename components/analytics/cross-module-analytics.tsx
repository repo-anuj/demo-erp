'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Users,
  Package,
  DollarSign,
  BarChart3,
  PieChart,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  CustomBarChart, 
  CustomPieChart, 
  MultiLineChart,
  CustomRadarChart,
  formatCurrency, 
  formatNumber,
  ChartSkeleton 
} from './chart-components';

interface CrossModuleAnalyticsProps {
  data: {
    inventory?: any;
    sales?: any;
    finance?: any;
    employees?: any;
    projects?: any;
    lastUpdated?: string;
  };
  isLoading?: boolean;
}

export function CrossModuleAnalytics({ data, isLoading = false }: CrossModuleAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <ChartSkeleton height={20} />
              </CardHeader>
              <CardContent>
                <ChartSkeleton height={40} />
              </CardContent>
            </Card>
          ))}
        </div>
        <ChartSkeleton height={300} />
      </div>
    );
  }

  // Calculate business health score
  const calculateBusinessHealth = () => {
    let score = 0;
    let maxScore = 0;

    // Financial health (30 points)
    if (data.finance?.metrics) {
      maxScore += 30;
      const netCashflow = data.finance.metrics.netCashflow || 0;
      if (netCashflow > 0) score += 30;
      else if (netCashflow > -1000) score += 15;
    }

    // Sales performance (25 points)
    if (data.sales?.metrics) {
      maxScore += 25;
      const totalRevenue = data.sales.metrics.totalRevenue || 0;
      if (totalRevenue > 10000) score += 25;
      else if (totalRevenue > 5000) score += 15;
      else if (totalRevenue > 1000) score += 10;
    }

    // Inventory management (20 points)
    if (data.inventory?.metrics) {
      maxScore += 20;
      const lowStockRatio = (data.inventory.metrics.lowStock || 0) / (data.inventory.metrics.totalItems || 1);
      if (lowStockRatio < 0.1) score += 20;
      else if (lowStockRatio < 0.2) score += 15;
      else if (lowStockRatio < 0.3) score += 10;
    }

    // Workforce (15 points)
    if (data.employees?.metrics) {
      maxScore += 15;
      const activeRatio = (data.employees.metrics.activeEmployees || 0) / (data.employees.metrics.totalEmployees || 1);
      if (activeRatio > 0.9) score += 15;
      else if (activeRatio > 0.8) score += 10;
      else if (activeRatio > 0.7) score += 5;
    }

    // Projects (10 points)
    if (data.projects?.metrics) {
      maxScore += 10;
      const activeProjects = data.projects.metrics.activeProjects || 0;
      if (activeProjects > 0) score += 10;
    }

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  };

  const businessHealthScore = calculateBusinessHealth();

  // Module performance data
  const modulePerformance = [
    {
      module: 'Sales',
      score: data.sales?.metrics?.totalRevenue > 5000 ? 85 : data.sales?.metrics?.totalRevenue > 1000 ? 65 : 45,
      status: data.sales?.metrics?.totalRevenue > 5000 ? 'excellent' : data.sales?.metrics?.totalRevenue > 1000 ? 'good' : 'needs-attention'
    },
    {
      module: 'Finance',
      score: (data.finance?.metrics?.netCashflow || 0) > 0 ? 90 : (data.finance?.metrics?.netCashflow || 0) > -1000 ? 60 : 30,
      status: (data.finance?.metrics?.netCashflow || 0) > 0 ? 'excellent' : (data.finance?.metrics?.netCashflow || 0) > -1000 ? 'good' : 'needs-attention'
    },
    {
      module: 'Inventory',
      score: ((data.inventory?.metrics?.lowStock || 0) / (data.inventory?.metrics?.totalItems || 1)) < 0.1 ? 95 : 
             ((data.inventory?.metrics?.lowStock || 0) / (data.inventory?.metrics?.totalItems || 1)) < 0.2 ? 75 : 50,
      status: ((data.inventory?.metrics?.lowStock || 0) / (data.inventory?.metrics?.totalItems || 1)) < 0.1 ? 'excellent' : 
              ((data.inventory?.metrics?.lowStock || 0) / (data.inventory?.metrics?.totalItems || 1)) < 0.2 ? 'good' : 'needs-attention'
    },
    {
      module: 'HR',
      score: ((data.employees?.metrics?.activeEmployees || 0) / (data.employees?.metrics?.totalEmployees || 1)) > 0.9 ? 90 : 
             ((data.employees?.metrics?.activeEmployees || 0) / (data.employees?.metrics?.totalEmployees || 1)) > 0.8 ? 70 : 50,
      status: ((data.employees?.metrics?.activeEmployees || 0) / (data.employees?.metrics?.totalEmployees || 1)) > 0.9 ? 'excellent' : 
              ((data.employees?.metrics?.activeEmployees || 0) / (data.employees?.metrics?.totalEmployees || 1)) > 0.8 ? 'good' : 'needs-attention'
    }
  ];

  // Business metrics overview
  const businessMetrics = [
    {
      name: 'Revenue',
      value: data.sales?.metrics?.totalRevenue || 0,
      target: 50000,
      unit: 'currency'
    },
    {
      name: 'Profit Margin',
      value: data.finance?.metrics?.income > 0 ? 
        ((data.finance.metrics.netCashflow / data.finance.metrics.income) * 100) : 0,
      target: 20,
      unit: 'percentage'
    },
    {
      name: 'Inventory Turnover',
      value: data.inventory?.metrics?.totalItems > 0 ? 
        (data.sales?.metrics?.totalSales || 0) / (data.inventory.metrics.totalItems / 12) : 0,
      target: 6,
      unit: 'number'
    },
    {
      name: 'Customer Satisfaction',
      value: 85, // Simulated metric
      target: 90,
      unit: 'percentage'
    }
  ];

  // Radar chart data for business performance
  const radarData = [
    { subject: 'Sales', value: modulePerformance.find(m => m.module === 'Sales')?.score || 0 },
    { subject: 'Finance', value: modulePerformance.find(m => m.module === 'Finance')?.score || 0 },
    { subject: 'Inventory', value: modulePerformance.find(m => m.module === 'Inventory')?.score || 0 },
    { subject: 'HR', value: modulePerformance.find(m => m.module === 'HR')?.score || 0 },
    { subject: 'Projects', value: (data.projects?.metrics?.activeProjects || 0) > 0 ? 80 : 40 },
    { subject: 'Operations', value: 75 } // Simulated metric
  ];

  // Revenue vs costs comparison
  const revenueVsCosts = [
    {
      period: 'Current',
      revenue: data.sales?.metrics?.totalRevenue || 0,
      costs: data.finance?.metrics?.expenses || 0,
      profit: (data.sales?.metrics?.totalRevenue || 0) - (data.finance?.metrics?.expenses || 0)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Business Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Business Health Score
          </CardTitle>
          <CardDescription>
            Overall business performance indicator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">{businessHealthScore.toFixed(0)}/100</div>
              <p className="text-sm text-muted-foreground">
                {businessHealthScore >= 80 ? 'Excellent' : 
                 businessHealthScore >= 60 ? 'Good' : 
                 businessHealthScore >= 40 ? 'Fair' : 'Needs Improvement'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              businessHealthScore >= 80 ? 'bg-green-100 text-green-600' : 
              businessHealthScore >= 60 ? 'bg-blue-100 text-blue-600' : 
              businessHealthScore >= 40 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
            }`}>
              {businessHealthScore >= 80 ? <CheckCircle className="h-6 w-6" /> : 
               businessHealthScore >= 40 ? <Target className="h-6 w-6" /> : 
               <AlertTriangle className="h-6 w-6" />}
            </div>
          </div>
          <Progress value={businessHealthScore} className="mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {modulePerformance.map((module) => (
              <div key={module.module} className="text-center p-3 border rounded-lg">
                <div className="font-medium">{module.module}</div>
                <div className={`text-lg font-bold ${
                  module.status === 'excellent' ? 'text-green-600' : 
                  module.status === 'good' ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {module.score}%
                </div>
                <Badge 
                  variant={
                    module.status === 'excellent' ? 'default' : 
                    module.status === 'good' ? 'secondary' : 'destructive'
                  }
                  className="text-xs"
                >
                  {module.status === 'excellent' ? 'Excellent' : 
                   module.status === 'good' ? 'Good' : 'Needs Attention'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Business Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {businessMetrics.map((metric) => {
          const progress = metric.unit === 'percentage' ? metric.value : 
                          (metric.value / metric.target) * 100;
          const displayValue = metric.unit === 'currency' ? formatCurrency(metric.value) :
                              metric.unit === 'percentage' ? `${metric.value.toFixed(1)}%` :
                              formatNumber(metric.value);
          
          return (
            <Card key={metric.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayValue}</div>
                <Progress value={Math.min(progress, 100)} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {metric.unit === 'currency' ? formatCurrency(metric.target) :
                          metric.unit === 'percentage' ? `${metric.target}%` :
                          formatNumber(metric.target)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <CustomRadarChart
          data={radarData}
          title="Business Performance Radar"
          description="Multi-dimensional business performance view"
          height={300}
        />

        <MultiLineChart
          data={revenueVsCosts}
          xKey="period"
          lines={[
            { key: 'revenue', name: 'Revenue', color: '#10B981' },
            { key: 'costs', name: 'Costs', color: '#EF4444' },
            { key: 'profit', name: 'Profit', color: '#3B82F6' }
          ]}
          title="Revenue vs Costs"
          description="Financial performance comparison"
          height={300}
          formatter={formatCurrency}
        />
      </div>

      {/* Module Integration Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Cross-Module Insights</CardTitle>
          <CardDescription>
            How different business areas are interconnected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Sales-Finance Correlation</p>
                <p className="text-sm text-muted-foreground">
                  Revenue of {formatCurrency(data.sales?.metrics?.totalRevenue || 0)} contributes to 
                  {((data.finance?.metrics?.netCashflow || 0) >= 0) ? ' positive' : ' negative'} cash flow of {formatCurrency(data.finance?.metrics?.netCashflow || 0)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Inventory-Sales Efficiency</p>
                <p className="text-sm text-muted-foreground">
                  {data.inventory?.metrics?.totalItems || 0} inventory items supporting {data.sales?.metrics?.totalSales || 0} sales transactions, 
                  indicating {((data.sales?.metrics?.totalSales || 0) / (data.inventory?.metrics?.totalItems || 1)) > 2 ? 'high' : 'moderate'} inventory turnover
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Workforce Productivity</p>
                <p className="text-sm text-muted-foreground">
                  {data.employees?.metrics?.activeEmployees || 0} active employees generating {formatCurrency((data.sales?.metrics?.totalRevenue || 0) / (data.employees?.metrics?.activeEmployees || 1))} revenue per employee
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Project Impact</p>
                <p className="text-sm text-muted-foreground">
                  {data.projects?.metrics?.activeProjects || 0} active projects with total budget of {formatCurrency(data.projects?.metrics?.totalBudget || 0)} 
                  supporting business operations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Recommendations</CardTitle>
          <CardDescription>
            AI-powered suggestions for business improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {businessHealthScore < 60 && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Immediate Attention Required</p>
                  <p className="text-sm text-red-700">
                    Business health score is below 60%. Focus on improving cash flow and reducing operational costs.
                  </p>
                </div>
              </div>
            )}
            
            {(data.inventory?.metrics?.lowStock || 0) > (data.inventory?.metrics?.totalItems || 0) * 0.2 && (
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Package className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Inventory Optimization</p>
                  <p className="text-sm text-yellow-700">
                    {data.inventory?.metrics?.lowStock || 0} items are low in stock. Consider implementing automated reordering.
                  </p>
                </div>
              </div>
            )}
            
            {(data.finance?.metrics?.netCashflow || 0) > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Growth Opportunity</p>
                  <p className="text-sm text-green-700">
                    Positive cash flow of {formatCurrency(data.finance?.metrics?.netCashflow || 0)} presents opportunities for expansion or investment.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Data-Driven Decisions</p>
                <p className="text-sm text-blue-700">
                  Continue monitoring these metrics regularly to maintain optimal business performance and identify trends early.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
