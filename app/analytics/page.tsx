'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyAnalytics } from '@/components/analytics/empty-state';
import { AIAssistant } from '@/components/analytics/ai-assistant';
import { RealtimeDashboard } from '@/components/analytics/realtime-dashboard';
import { AnalyticsFilters, FilterState } from '@/components/analytics/filters';
import { InventoryAnalytics } from '@/components/analytics/inventory-analytics';
import { SalesAnalytics } from '@/components/analytics/sales-analytics';
import { FinanceAnalytics } from '@/components/analytics/finance-analytics';
import { CrossModuleAnalytics } from '@/components/analytics/cross-module-analytics';
import { Reporting } from '@/components/analytics/reporting';
import { NotificationsPopover } from '@/components/analytics/notifications';
import { exportAsCSV, exportAsJSON } from '@/lib/export-utils';
import { LoadingIndicator } from '@/components/analytics/loading-indicator';
import { useDemo } from '@/contexts/demo-context';

export default function AnalyticsPage() {
  const { inventory, sales, finance, employees: hr, projects } = useDemo();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [aggregatedData, setAggregatedData] = useState<any>(null);

  // Use a ref to store the current filter state without triggering rerenders
  const filtersRef = useRef<FilterState>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    modules: ['inventory', 'sales', 'finance', 'employees', 'projects', 'crossModuleAnalysis'],
    filters: {},
    pagination: {
      page: 1,
      pageSize: 50
    }
  });

  // Aggregate data from all modules
  const aggregateData = useCallback(() => {
    try {
      // Calculate inventory metrics
      const inventoryMetrics = {
        totalItems: inventory.length,
        totalQuantity: inventory.reduce((sum, item) => sum + item.quantity, 0),
        totalValue: inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        lowStock: inventory.filter(item => item.quantity < 10).length,
        categories: new Set(inventory.map(item => item.category)).size,
        categoryDistribution: Object.entries(
          inventory.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([name, count]) => ({ name, count })),
        stockAlerts: inventory.filter(item => item.quantity < 10),
        topMovingItems: inventory.slice(0, 10),
        itemMovement: inventory.map(item => ({
          date: new Date().toISOString().split('T')[0],
          quantity: item.quantity
        }))
      };

      // Calculate sales metrics
      const salesMetrics = {
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
        recentSales: sales.slice(0, 10),
        salesByCustomer: Object.entries(
          sales.reduce((acc, sale) => {
            const customer = sale.customer || 'Unknown';
            acc[customer] = (acc[customer] || 0) + sale.total;
            return acc;
          }, {} as Record<string, number>)
        ).map(([name, amount]) => ({ name, amount })),
        salesTimeSeries: sales.map(sale => ({
          date: sale.date,
          amount: sale.total
        }))
      };

      // Calculate finance metrics
      const financeMetrics = {
        totalTransactions: finance.length,
        income: finance.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        expenses: finance.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        netCashflow: finance.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
                    finance.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        incomeByCategory: Object.entries(
          finance.filter(t => t.type === 'income').reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          }, {} as Record<string, number>)
        ).map(([name, amount]) => ({ name, amount })),
        expensesByCategory: Object.entries(
          finance.filter(t => t.type === 'expense').reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          }, {} as Record<string, number>)
        ).map(([name, amount]) => ({ name, amount })),
        financeTimeSeries: finance.map(t => ({
          date: t.date,
          income: t.type === 'income' ? t.amount : 0,
          expenses: t.type === 'expense' ? t.amount : 0
        }))
      };

      // Calculate employee metrics
      const employeeMetrics = {
        totalEmployees: hr.length,
        activeEmployees: hr.filter(emp => emp.status === 'active').length,
        departmentDistribution: Object.entries(
          hr.reduce((acc, emp) => {
            acc[emp.department] = (acc[emp.department] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([name, count]) => ({ name, count }))
      };

      // Calculate project metrics
      const projectMetrics = {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
        projectsByStatus: Object.entries(
          projects.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([name, count]) => ({ name, count }))
      };

      return {
        inventory: {
          items: inventory,
          metrics: inventoryMetrics
        },
        sales: {
          transactions: sales,
          metrics: salesMetrics
        },
        finance: {
          transactions: finance,
          metrics: financeMetrics
        },
        employees: {
          employees: hr,
          metrics: employeeMetrics
        },
        projects: {
          projects: projects,
          metrics: projectMetrics
        },
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error aggregating data:', error);
      return null;
    }
  }, [inventory, sales, finance, hr, projects]);

  // Load and refresh data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = aggregateData();
      if (data) {
        setAggregatedData(data);
        setHasData(
          data.inventory.items.length > 0 || 
          data.sales.transactions.length > 0 || 
          data.finance.transactions.length > 0 ||
          data.employees.employees.length > 0 ||
          data.projects.projects.length > 0
        );
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [aggregateData]);

  // Initial data load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    toast.success('Analytics data refreshed');
  }, [loadData]);

  // Handle filter changes
  const handleFilterChange = useCallback((filters: FilterState) => {
    filtersRef.current = filters;
    // In a real app, this would trigger a data reload with new filters
    console.log('Filters changed:', filters);
  }, []);

  // Handle export
  const handleExport = useCallback((format: 'csv' | 'json' | 'pdf') => {
    if (!aggregatedData) {
      toast.error('No data to export');
      return;
    }

    try {
      switch (format) {
        case 'csv':
          exportAsCSV(aggregatedData);
          toast.success('Data exported as CSV');
          break;
        case 'json':
          exportAsJSON(aggregatedData);
          toast.success('Data exported as JSON');
          break;
        case 'pdf':
          toast.info('PDF export coming soon');
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  }, [aggregatedData]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    filtersRef.current.pagination = { ...filtersRef.current.pagination!, page };
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    filtersRef.current.pagination = { ...filtersRef.current.pagination!, pageSize, page: 1 };
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-4 w-[120px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <EmptyAnalytics onRefresh={handleRefresh} />
  );

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights across all business modules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsPopover />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnalyticsFilters
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        isLoading={isLoading}
        data={aggregatedData}
        initialFilters={filtersRef.current}
      />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !hasData ? (
            <EmptyState />
          ) : (
            <>
              {/* Key Metrics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${aggregatedData?.sales?.metrics?.totalRevenue?.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From {aggregatedData?.sales?.metrics?.totalSales || 0} sales
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${aggregatedData?.inventory?.metrics?.totalValue?.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {aggregatedData?.inventory?.metrics?.totalItems || 0} items in stock
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${aggregatedData?.finance?.metrics?.netCashflow?.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {aggregatedData?.finance?.metrics?.totalTransactions || 0} transactions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {aggregatedData?.projects?.metrics?.activeProjects || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Out of {aggregatedData?.projects?.metrics?.totalProjects || 0} projects
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Cross-module analysis charts and tables would go here */}
              <CrossModuleAnalytics
                data={aggregatedData}
                isLoading={isLoading || isRefreshing}
              />

              {/* Realtime Dashboard Integration */}
              <RealtimeDashboard
                data={aggregatedData}
                isLoading={isLoading || isRefreshing}
                onRefresh={handleRefresh}
              />
            </>
          )}
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !hasData || !aggregatedData?.inventory?.items?.length ? (
            <EmptyState />
          ) : (
            <InventoryAnalytics
              data={aggregatedData.inventory}
              isLoading={isLoading || isRefreshing}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !hasData || !aggregatedData?.sales?.transactions?.length ? (
            <EmptyState />
          ) : (
            <SalesAnalytics
              data={aggregatedData.sales}
              isLoading={isLoading || isRefreshing}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </TabsContent>

        {/* Finance Tab */}
        <TabsContent value="finance" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !hasData || !aggregatedData?.finance?.transactions?.length ? (
            <EmptyState />
          ) : (
            <FinanceAnalytics
              data={aggregatedData.finance}
              isLoading={isLoading || isRefreshing}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <Reporting
              aggregatedData={aggregatedData}
              isLoading={isLoading || isRefreshing}
            />
          )}
        </TabsContent>

        {/* AI Assistant Tab */}
        <TabsContent value="ai" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <AIAssistant
              aggregatedData={aggregatedData || {}}
              isLoading={isLoading || isRefreshing}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
