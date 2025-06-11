'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  PieChart,
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  CustomBarChart, 
  CustomPieChart, 
  CustomLineChart,
  MultiLineChart,
  StackedBarChart,
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

interface FinanceAnalyticsProps {
  data: {
    transactions: any[];
    metrics: {
      totalTransactions: number;
      income: number;
      expenses: number;
      netCashflow: number;
      incomeByCategory: { name: string; amount: number }[];
      expensesByCategory: { name: string; amount: number }[];
      financeTimeSeries: { date: string; income: number; expenses: number }[];
    };
  };
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function FinanceAnalytics({ 
  data, 
  isLoading = false,
  onPageChange,
  onPageSizeChange 
}: FinanceAnalyticsProps) {
  const { transactions, metrics } = data;

  // Calculate additional metrics
  const profitMargin = metrics.income > 0 ? ((metrics.netCashflow / metrics.income) * 100) : 0;
  const expenseRatio = metrics.income > 0 ? ((metrics.expenses / metrics.income) * 100) : 0;
  const averageTransactionValue = metrics.totalTransactions > 0 ? 
    (metrics.income + metrics.expenses) / metrics.totalTransactions : 0;
  
  // Prepare chart data
  const incomeChartData = metrics.incomeByCategory?.slice(0, 8).map(cat => ({
    name: cat.name.length > 15 ? cat.name.substring(0, 15) + '...' : cat.name,
    amount: cat.amount,
    value: cat.amount
  })) || [];

  const expenseChartData = metrics.expensesByCategory?.slice(0, 8).map(cat => ({
    name: cat.name.length > 15 ? cat.name.substring(0, 15) + '...' : cat.name,
    amount: cat.amount,
    value: cat.amount
  })) || [];

  // Cash flow comparison
  const cashflowData = [
    { name: 'Income', amount: metrics.income, value: metrics.income },
    { name: 'Expenses', amount: metrics.expenses, value: metrics.expenses },
    { name: 'Net Cashflow', amount: metrics.netCashflow, value: Math.abs(metrics.netCashflow) }
  ];

  // Monthly cash flow trend (simplified)
  const monthlyCashflow = transactions.reduce((acc, transaction) => {
    const month = format(parseISO(transaction.date), 'MMM yyyy');
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expenses += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const monthlyChartData = Object.values(monthlyCashflow).map((data: any) => ({
    ...data,
    netCashflow: data.income - data.expenses
  }));

  // Transaction type distribution
  const transactionTypes = transactions.reduce((acc, transaction) => {
    acc[transaction.type] = (acc[transaction.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeDistributionData = Object.entries(transactionTypes).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
    value: count
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
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.income)}</div>
            <p className="text-xs text-muted-foreground">
              From {transactions.filter(t => t.type === 'income').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(metrics.expenses)}</div>
            <p className="text-xs text-muted-foreground">
              From {transactions.filter(t => t.type === 'expense').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
            <DollarSign className={`h-4 w-4 ${metrics.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(metrics.netCashflow)}
            </div>
            <p className="text-xs text-muted-foreground">
              {profitMargin.toFixed(1)}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expense Ratio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseRatio.toFixed(1)}%</div>
            <Progress value={Math.min(expenseRatio, 100)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Of total income
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            Financial Health Overview
          </CardTitle>
          <CardDescription>
            Key financial performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className={`text-3xl font-bold ${metrics.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.netCashflow >= 0 ? '✓' : '⚠'}
              </div>
              <p className="font-medium mt-2">Cash Flow Status</p>
              <p className="text-sm text-muted-foreground">
                {metrics.netCashflow >= 0 ? 'Positive' : 'Negative'}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className={`text-3xl font-bold ${profitMargin > 20 ? 'text-green-600' : profitMargin > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(0)}%
              </div>
              <p className="font-medium mt-2">Profit Margin</p>
              <p className="text-sm text-muted-foreground">
                {profitMargin > 20 ? 'Excellent' : profitMargin > 10 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className={`text-3xl font-bold ${expenseRatio < 70 ? 'text-green-600' : expenseRatio < 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                {expenseRatio.toFixed(0)}%
              </div>
              <p className="font-medium mt-2">Expense Control</p>
              <p className="text-sm text-muted-foreground">
                {expenseRatio < 70 ? 'Excellent' : expenseRatio < 90 ? 'Good' : 'High'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <CustomPieChart
          data={incomeChartData}
          nameKey="name"
          valueKey="amount"
          title="Income by Category"
          description="Revenue sources breakdown"
          height={300}
          formatter={formatCurrency}
        />

        <CustomPieChart
          data={expenseChartData}
          nameKey="name"
          valueKey="amount"
          title="Expenses by Category"
          description="Spending distribution"
          height={300}
          formatter={formatCurrency}
        />
      </div>

      {/* Cash Flow Comparison */}
      <CustomBarChart
        data={cashflowData}
        xKey="name"
        yKey="amount"
        title="Cash Flow Summary"
        description="Income vs Expenses comparison"
        height={300}
        formatter={formatCurrency}
      />

      {/* Monthly Trend */}
      {monthlyChartData.length > 1 && (
        <MultiLineChart
          data={monthlyChartData}
          xKey="month"
          lines={[
            { key: 'income', name: 'Income', color: '#10B981' },
            { key: 'expenses', name: 'Expenses', color: '#EF4444' },
            { key: 'netCashflow', name: 'Net Cashflow', color: '#3B82F6' }
          ]}
          title="Monthly Cash Flow Trend"
          description="Income and expenses over time"
          height={300}
          formatter={formatCurrency}
        />
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Recent Transactions
          </CardTitle>
          <CardDescription>
            Latest financial transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 15).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.type === 'income' ? "default" : "secondary"}
                      >
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
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

      {/* Financial Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
          <CardDescription>
            Key observations and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${metrics.netCashflow >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="font-medium">Cash Flow Health</p>
                <p className="text-sm text-muted-foreground">
                  {metrics.netCashflow >= 0 ? 'Positive' : 'Negative'} cash flow of {formatCurrency(Math.abs(metrics.netCashflow))} 
                  {metrics.netCashflow >= 0 ? ' indicates healthy financial performance' : ' requires immediate attention'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${profitMargin > 15 ? 'bg-green-500' : profitMargin > 5 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <div>
                <p className="font-medium">Profitability</p>
                <p className="text-sm text-muted-foreground">
                  Profit margin of {profitMargin.toFixed(1)}% is {profitMargin > 15 ? 'excellent' : profitMargin > 5 ? 'acceptable' : 'concerning'} 
                  for sustainable business operations
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Top Income Source</p>
                <p className="text-sm text-muted-foreground">
                  {incomeChartData[0]?.name || 'N/A'} generates the highest income 
                  {incomeChartData[0] ? ` at ${formatCurrency(incomeChartData[0].amount)}` : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Largest Expense</p>
                <p className="text-sm text-muted-foreground">
                  {expenseChartData[0]?.name || 'N/A'} is your largest expense category 
                  {expenseChartData[0] ? ` at ${formatCurrency(expenseChartData[0].amount)}` : ''}
                </p>
              </div>
            </div>
            
            {expenseRatio > 90 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium">Action Required</p>
                  <p className="text-sm text-muted-foreground">
                    High expense ratio of {expenseRatio.toFixed(1)}% suggests need for cost optimization
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
