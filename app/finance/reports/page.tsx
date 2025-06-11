'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useDemo } from '@/contexts/demo-context';

export default function ReportsPage() {
  const { finance } = useDemo();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    transactionCount: 0,
    topCategories: [] as { category: string; amount: number; type: string }[]
  });

  // Demo data initialization
  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      
      // Calculate report data from demo finance data
      const totalIncome = finance
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

      const totalExpenses = finance
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

      // Calculate top categories
      const categoryTotals = finance.reduce((acc, item) => {
        const key = `${item.category}-${item.type}`;
        if (!acc[key]) {
          acc[key] = { category: item.category, amount: 0, type: item.type };
        }
        acc[key].amount += item.amount;
        return acc;
      }, {} as Record<string, { category: string; amount: number; type: string }>);

      const topCategories = Object.values(categoryTotals)
        .sort((a, b) => (b as any).amount - (a as any).amount)
        .slice(0, 5);

      setReportData({
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        transactionCount: finance.length,
        topCategories: topCategories as { category: string; amount: number; type: string; }[]
      });

      setIsLoading(false);
    };

    initializeData();
  }, [finance]);

  const handleExportReport = (reportType: string) => {
    alert(`Demo Mode: ${reportType} report export simulated`);
  };

  const handleRefresh = () => {
    alert('Demo Mode: Reports refreshed');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Financial Reports</h1>
          <Button disabled>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground">
            Generate and view comprehensive financial reports
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => handleExportReport('All Reports')}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(reportData.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {finance.filter(f => f.type === 'income').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(reportData.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {finance.filter(f => f.type === 'expense').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              reportData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(reportData.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.netProfit >= 0 ? 'Profitable' : 'Loss'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.transactionCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Total recorded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="profit-loss" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profit & Loss Statement
                <Button size="sm" onClick={() => handleExportReport('Profit & Loss')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardTitle>
              <CardDescription>
                Summary of income and expenses for the current period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Total Income</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(reportData.totalIncome)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <span className="font-medium">Total Expenses</span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(reportData.totalExpenses)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <span className="font-bold">Net Profit/Loss</span>
                  <span className={`font-bold text-xl ${
                    reportData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(reportData.netProfit)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cash Flow Statement
                <Button size="sm" onClick={() => handleExportReport('Cash Flow')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardTitle>
              <CardDescription>
                Track cash inflows and outflows over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Cash Flow Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed cash flow charts and analysis would be displayed here
                </p>
                <Button onClick={() => handleExportReport('Cash Flow')}>
                  Generate Cash Flow Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance-sheet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Balance Sheet
                <Button size="sm" onClick={() => handleExportReport('Balance Sheet')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardTitle>
              <CardDescription>
                Assets, liabilities, and equity overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Balance Sheet Report</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive balance sheet with assets and liabilities would be shown here
                </p>
                <Button onClick={() => handleExportReport('Balance Sheet')}>
                  Generate Balance Sheet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Expense Analysis by Category
                <Button size="sm" onClick={() => handleExportReport('Expense Analysis')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardTitle>
              <CardDescription>
                Breakdown of expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.topCategories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        category.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">{category.category}</span>
                      <span className="text-sm text-muted-foreground">
                        ({category.type})
                      </span>
                    </div>
                    <span className={`font-bold ${
                      category.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
