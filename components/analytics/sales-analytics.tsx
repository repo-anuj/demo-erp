'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';
import { 
  CustomBarChart, 
  CustomPieChart, 
  CustomLineChart,
  MultiLineChart,
  formatCurrency, 
  formatNumber,
  ChartSkeleton 
} from './chart-components';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO } from 'date-fns';

interface SalesAnalyticsProps {
  data: {
    transactions: any[];
    metrics: {
      totalSales: number;
      totalRevenue: number;
      recentSales: any[];
      salesByCustomer: { name: string; amount: number }[];
      salesTimeSeries: { date: string; amount: number }[];
    };
  };
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function SalesAnalytics({ 
  data, 
  isLoading = false,
  onPageChange,
  onPageSizeChange 
}: SalesAnalyticsProps) {
  const { transactions, metrics } = data;

  // Calculate additional metrics
  const averageSaleValue = metrics.totalRevenue / metrics.totalSales || 0;
  const uniqueCustomers = new Set(transactions.map(t => t.customer)).size;
  const averageCustomerValue = metrics.totalRevenue / uniqueCustomers || 0;
  
  // Prepare chart data
  const customerChartData = metrics.salesByCustomer?.slice(0, 10).map(customer => ({
    name: customer.name.length > 15 ? customer.name.substring(0, 15) + '...' : customer.name,
    amount: customer.amount,
    value: customer.amount
  })) || [];

  // Sales by status
  const salesByStatus = transactions.reduce((acc, sale) => {
    acc[sale.status] = (acc[sale.status] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(salesByStatus).map(([name, amount]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    amount,
    value: amount
  }));

  // Monthly sales trend (simplified)
  const monthlySales = transactions.reduce((acc, sale) => {
    const month = format(parseISO(sale.date), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const monthlyChartData = Object.entries(monthlySales).map(([month, amount]) => ({
    month,
    amount,
    sales: amount
  }));

  // Top performing items (if available in sales data)
  const itemSales = transactions.reduce((acc, sale) => {
    if (sale.items) {
      sale.items.forEach((item: any) => {
        const key = item.name || item.product || 'Unknown Item';
        acc[key] = (acc[key] || 0) + (item.total || item.price * item.quantity || 0);
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const topItemsData = Object.entries(itemSales)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([name, amount]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      amount,
      value: amount
    }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ChartSkeleton height={20} />
              </CardHeader>
              <CardContent>
                <ChartSkeleton height={40} />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ChartSkeleton height={300} />
          <ChartSkeleton height={300} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {formatNumber(metrics.totalSales)} sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageSaleValue)}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(uniqueCustomers)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(averageCustomerValue)} per customer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              Total completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <CustomBarChart
          data={customerChartData}
          xKey="name"
          yKey="amount"
          title="Sales by Customer"
          description="Revenue generated by top customers"
          height={300}
          formatter={formatCurrency}
        />

        <CustomPieChart
          data={statusChartData}
          nameKey="name"
          valueKey="amount"
          title="Sales by Status"
          description="Revenue distribution by transaction status"
          height={300}
          formatter={formatCurrency}
        />
      </div>

      {/* Monthly Trend */}
      {monthlyChartData.length > 1 && (
        <CustomLineChart
          data={monthlyChartData}
          xKey="month"
          yKey="amount"
          title="Monthly Sales Trend"
          description="Revenue trends over time"
          height={300}
          formatter={formatCurrency}
        />
      )}

      {/* Top Items */}
      {topItemsData.length > 0 && (
        <CustomBarChart
          data={topItemsData}
          xKey="name"
          yKey="amount"
          title="Top Selling Items"
          description="Best performing products by revenue"
          height={300}
          formatter={formatCurrency}
        />
      )}

      {/* Recent Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Recent Sales
          </CardTitle>
          <CardDescription>
            Latest sales transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 15).map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {format(parseISO(sale.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {sale.customer || 'Walk-in Customer'}
                    </TableCell>
                    <TableCell>
                      {sale.items?.length || 1} item{(sale.items?.length || 1) !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell>{formatCurrency(sale.total)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          sale.status === 'completed' ? "default" : 
                          sale.status === 'pending' ? "secondary" : 
                          "destructive"
                        }
                      >
                        {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {transactions.length > 15 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing 15 of {transactions.length} transactions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Insights</CardTitle>
          <CardDescription>
            Key observations and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Revenue Performance</p>
                <p className="text-sm text-muted-foreground">
                  Total revenue of {formatCurrency(metrics.totalRevenue)} from {metrics.totalSales} transactions, 
                  averaging {formatCurrency(averageSaleValue)} per sale
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Customer Base</p>
                <p className="text-sm text-muted-foreground">
                  {uniqueCustomers} unique customers with an average customer value of {formatCurrency(averageCustomerValue)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Top Customer</p>
                <p className="text-sm text-muted-foreground">
                  {customerChartData[0]?.name || 'N/A'} is your highest value customer 
                  {customerChartData[0] ? ` with ${formatCurrency(customerChartData[0].amount)} in sales` : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Sales Distribution</p>
                <p className="text-sm text-muted-foreground">
                  Sales are distributed across {Object.keys(salesByStatus).length} status categories, 
                  with most transactions being {Object.entries(salesByStatus).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'completed'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
