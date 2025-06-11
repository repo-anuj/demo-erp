'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  BarChart3,
  PieChart,
  ShoppingCart
} from 'lucide-react';
import { 
  CustomBarChart, 
  CustomPieChart, 
  CustomLineChart,
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

interface InventoryAnalyticsProps {
  data: {
    items: any[];
    metrics: {
      totalItems: number;
      totalQuantity: number;
      totalValue: number;
      lowStock: number;
      categories: number;
      categoryDistribution: { name: string; count: number }[];
      stockAlerts: any[];
      topMovingItems: any[];
      itemMovement: { date: string; quantity: number }[];
    };
  };
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function InventoryAnalytics({ 
  data, 
  isLoading = false,
  onPageChange,
  onPageSizeChange 
}: InventoryAnalyticsProps) {
  const { items, metrics } = data;

  // Calculate additional metrics
  const averageItemValue = metrics.totalValue / metrics.totalItems || 0;
  const stockHealthPercentage = ((metrics.totalItems - metrics.lowStock) / metrics.totalItems) * 100 || 0;
  
  // Prepare chart data
  const categoryChartData = metrics.categoryDistribution?.map(cat => ({
    name: cat.name,
    count: cat.count,
    value: cat.count
  })) || [];

  const valueByCategory = items.reduce((acc, item) => {
    const value = item.price * item.quantity;
    acc[item.category] = (acc[item.category] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  const categoryValueData = Object.entries(valueByCategory).map(([name, value]) => ({
    name,
    value,
    amount: value
  }));

  const stockLevelData = items.slice(0, 10).map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
    quantity: item.quantity,
    value: item.quantity
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
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalItems)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(metrics.totalQuantity)} total units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(averageItemValue)} per item
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockHealthPercentage.toFixed(1)}%</div>
            <Progress value={stockHealthPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.lowStock} items need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.categories}</div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <CustomPieChart
          data={categoryChartData}
          nameKey="name"
          valueKey="count"
          title="Items by Category"
          description="Distribution of inventory items across categories"
          height={300}
          formatter={formatNumber}
        />

        <CustomBarChart
          data={categoryValueData.slice(0, 8)}
          xKey="name"
          yKey="value"
          title="Value by Category"
          description="Total inventory value per category"
          height={300}
          formatter={formatCurrency}
        />
      </div>

      {/* Stock Levels Chart */}
      <CustomBarChart
        data={stockLevelData}
        xKey="name"
        yKey="quantity"
        title="Current Stock Levels"
        description="Quantity in stock for top items"
        height={300}
        formatter={formatNumber}
      />

      {/* Stock Alerts */}
      {metrics.stockAlerts && metrics.stockAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Stock Alerts
            </CardTitle>
            <CardDescription>
              Items that need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.stockAlerts.slice(0, 10).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={item.quantity === 0 ? "destructive" : "secondary"}>
                          {item.quantity === 0 ? "Out of Stock" : "Low Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Moving Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            Inventory Overview
          </CardTitle>
          <CardDescription>
            Complete inventory item details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.slice(0, 15).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{formatNumber(item.quantity)}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          item.quantity === 0 ? "destructive" : 
                          item.quantity < 10 ? "secondary" : 
                          "default"
                        }
                      >
                        {item.quantity === 0 ? "Out of Stock" : 
                         item.quantity < 10 ? "Low Stock" : 
                         "In Stock"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {items.length > 15 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing 15 of {items.length} items
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Insights</CardTitle>
          <CardDescription>
            Key observations and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Stock Health</p>
                <p className="text-sm text-muted-foreground">
                  {stockHealthPercentage > 90 ? "Excellent" : 
                   stockHealthPercentage > 75 ? "Good" : 
                   stockHealthPercentage > 50 ? "Fair" : "Needs Attention"} - 
                  {stockHealthPercentage.toFixed(1)}% of items are adequately stocked
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Category Distribution</p>
                <p className="text-sm text-muted-foreground">
                  Inventory is spread across {metrics.categories} categories, 
                  with {categoryChartData[0]?.name || 'N/A'} being the largest category
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Value Concentration</p>
                <p className="text-sm text-muted-foreground">
                  Total inventory value of {formatCurrency(metrics.totalValue)} 
                  with an average value of {formatCurrency(averageItemValue)} per item
                </p>
              </div>
            </div>
            
            {metrics.lowStock > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium">Action Required</p>
                  <p className="text-sm text-muted-foreground">
                    {metrics.lowStock} items require immediate restocking to maintain optimal inventory levels
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
