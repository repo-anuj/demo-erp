'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, ShoppingCart, TrendingUp, Users, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { DataTable } from '@/components/sales/data-table';
import { columns } from '@/components/sales/columns';
import { AddSaleDialog } from '@/components/sales/add-sale-dialog';
import { Overview } from '@/components/sales/overview';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function SalesPage() {
  const [salesData, setSalesData] = useState<any>({
    currentPeriod: {},
    growth: {},
    salesByDay: []
  });
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with demo data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo sales data
        const demoSales = [
          {
            id: '1',
            invoiceNumber: 'INV-001',
            customer: { id: '1', name: 'John Doe', email: 'john@example.com' },
            date: new Date('2024-01-15'),
            status: 'completed',
            total: 1250.00,
            items: [
              { id: '1', product: 'MacBook Pro', quantity: 1, unitPrice: 1250.00, total: 1250.00 }
            ]
          },
          {
            id: '2',
            invoiceNumber: 'INV-002',
            customer: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
            date: new Date('2024-01-14'),
            status: 'pending',
            total: 850.00,
            items: [
              { id: '2', product: 'Dell Laptop', quantity: 1, unitPrice: 850.00, total: 850.00 }
            ]
          }
        ];
        
        setSales(demoSales);
        
        // Demo metrics
        setSalesData({
          currentPeriod: {
            totalSales: demoSales.length,
            totalRevenue: demoSales.reduce((sum, sale) => sum + sale.total, 0),
            totalCustomers: new Set(demoSales.map(sale => sale.customer.id)).size,
            averageOrderValue: demoSales.reduce((sum, sale) => sum + sale.total, 0) / demoSales.length
          },
          growth: {
            sales: 15.2,
            revenue: 23.1,
            customers: 8.5,
            averageOrderValue: 12.3
          },
          salesByDay: [
            { name: 'Jan 10', total: 400 },
            { name: 'Jan 11', total: 300 },
            { name: 'Jan 12', total: 600 },
            { name: 'Jan 13', total: 800 },
            { name: 'Jan 14', total: 850 },
            { name: 'Jan 15', total: 1250 }
          ]
        });
        
      } catch (error) {
        console.error('Error fetching sales data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load sales data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const hasSales = sales.length > 0;

  // Calculate growth indicators
  const getGrowthIndicator = (growth: number | null) => {
    if (growth === null) return "No previous data";
    if (growth > 0) return `+${growth.toFixed(1)}% from last period`;
    if (growth < 0) return `${growth.toFixed(1)}% from last period`;
    return "No change from last period";
  };

  const getGrowthColor = (growth: number | null) => {
    if (growth === null) return "text-muted-foreground";
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        {hasSales && <AddSaleDialog />}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : (salesData.currentPeriod?.totalSales || 0)}
            </div>
            <p className={`text-xs ${getGrowthColor(salesData.growth?.sales)}`}>
              {loading ? "Loading..." : getGrowthIndicator(salesData.growth?.sales)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatCurrency(salesData.currentPeriod?.totalRevenue || 0)}
            </div>
            <p className={`text-xs ${getGrowthColor(salesData.growth?.revenue)}`}>
              {loading ? "Loading..." : getGrowthIndicator(salesData.growth?.revenue)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : (salesData.currentPeriod?.totalCustomers || 0)}
            </div>
            <p className={`text-xs ${getGrowthColor(salesData.growth?.customers)}`}>
              {loading ? "Loading..." : getGrowthIndicator(salesData.growth?.customers)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatCurrency(salesData.currentPeriod?.averageOrderValue || 0)}
            </div>
            <p className={`text-xs ${getGrowthColor(salesData.growth?.averageOrderValue)}`}>
              {loading ? "Loading..." : getGrowthIndicator(salesData.growth?.averageOrderValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading sales data...</p>
              </div>
            ) : hasSales && salesData.salesByDay?.length > 0 ? (
              <Overview 
                data={salesData.salesByDay?.map((item: any) => ({
                  name: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  total: item.revenue || 0,
                }))} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-center space-y-3">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Sales Data Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Start adding sales to see your revenue trends and analytics.
                  </p>
                  <AddSaleDialog />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading recent sales...</p>
              </div>
            ) : hasSales ? (
              <div className="space-y-4">
                {sales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {sale.customer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sale.customer.email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {formatCurrency(sale.total)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-center space-y-3">
                  <Users className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No recent sales</p>
                  <AddSaleDialog />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading sales data...</p>
            </div>
          ) : hasSales ? (
            <DataTable columns={columns} data={sales} />
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-center space-y-3">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">No Sales Data Available</h3>
                <p className="text-sm text-muted-foreground">
                  Start adding sales to see your business metrics and analytics.
                </p>
                <AddSaleDialog />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
