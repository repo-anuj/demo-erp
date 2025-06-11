'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  RefreshCw, 
  DollarSign, 
  Calendar, 
  BarChart2, 
  AlertTriangle,
  Edit,
  Trash,
  MoreHorizontal
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Budget {
  id: string;
  name: string;
  description?: string;
  type: 'annual' | 'monthly' | 'quarterly' | 'project';
  startDate: string;
  endDate: string;
  status: 'active' | 'archived' | 'draft';
  totalBudget: number;
  totalSpent: number;
  items: BudgetItem[];
}

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  spent: number;
  category?: string;
}

export default function BudgetsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Demo data initialization
  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      
      // Demo budgets
      const demoBudgets: Budget[] = [
        {
          id: 'budget-1',
          name: 'Q4 2024 Marketing Budget',
          description: 'Marketing expenses for Q4 2024',
          type: 'quarterly',
          startDate: '2024-10-01',
          endDate: '2024-12-31',
          status: 'active',
          totalBudget: 50000,
          totalSpent: 32500,
          items: [
            { id: 'item-1', name: 'Digital Advertising', amount: 25000, spent: 18000, category: 'Marketing' },
            { id: 'item-2', name: 'Content Creation', amount: 15000, spent: 9500, category: 'Marketing' },
            { id: 'item-3', name: 'Events & Trade Shows', amount: 10000, spent: 5000, category: 'Marketing' }
          ]
        },
        {
          id: 'budget-2',
          name: 'Office Supplies 2024',
          description: 'Annual office supplies and equipment budget',
          type: 'annual',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'active',
          totalBudget: 12000,
          totalSpent: 8500,
          items: [
            { id: 'item-4', name: 'Office Supplies', amount: 6000, spent: 4200, category: 'Office' },
            { id: 'item-5', name: 'Equipment', amount: 6000, spent: 4300, category: 'Office' }
          ]
        },
        {
          id: 'budget-3',
          name: 'Software Licenses',
          description: 'Monthly software and SaaS subscriptions',
          type: 'monthly',
          startDate: '2024-11-01',
          endDate: '2024-11-30',
          status: 'active',
          totalBudget: 5000,
          totalSpent: 4800,
          items: [
            { id: 'item-6', name: 'Development Tools', amount: 2000, spent: 1950, category: 'Software' },
            { id: 'item-7', name: 'Design Software', amount: 1500, spent: 1450, category: 'Software' },
            { id: 'item-8', name: 'Business Apps', amount: 1500, spent: 1400, category: 'Software' }
          ]
        }
      ];

      setBudgets(demoBudgets);
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Filter budgets based on active tab
  const filteredBudgets = budgets.filter(budget => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return budget.status === 'active';
    return budget.status === activeTab;
  });

  // Calculate budget progress
  const getBudgetProgress = (budget: Budget) => {
    return budget.totalBudget > 0 ? (budget.totalSpent / budget.totalBudget) * 100 : 0;
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Get budget type label
  const getBudgetTypeLabel = (type: string) => {
    switch (type) {
      case 'annual':
        return 'Annual';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'project':
        return 'Project';
      default:
        return type;
    }
  };

  // Handle budget actions
  const handleCreateBudget = () => {
    setSelectedBudget(null);
    setDialogOpen(true);
    alert('Demo Mode: Budget creation dialog would open');
  };

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setDialogOpen(true);
    alert('Demo Mode: Budget editing dialog would open');
  };

  const handleDeleteBudget = (budgetId: string) => {
    alert('Demo Mode: Budget deletion simulated');
  };

  const handleRefresh = () => {
    alert('Demo Mode: Data refreshed');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">
            Create and track budgets to manage your expenses
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleCreateBudget}>
            <Plus className="mr-2 h-4 w-4" />
            Create Budget
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgets.length}</div>
            <p className="text-xs text-muted-foreground">
              {budgets.filter(b => b.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <BarChart2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(budgets.reduce((sum, b) => sum + b.totalBudget, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all budgets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(budgets.reduce((sum, b) => sum + b.totalSpent, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {((budgets.reduce((sum, b) => sum + b.totalSpent, 0) / budgets.reduce((sum, b) => sum + b.totalBudget, 0)) * 100).toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(budgets.reduce((sum, b) => sum + (b.totalBudget - b.totalSpent), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Available to spend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budgets Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Budgets</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredBudgets.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'all' ? 'All Budgets' :
                   activeTab === 'active' ? 'Active Budgets' :
                   activeTab === 'draft' ? 'Draft Budgets' : 'Archived Budgets'}
                </CardTitle>
                <CardDescription>
                  Showing {filteredBudgets.length} budget{filteredBudgets.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Spent</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBudgets.map((budget) => {
                        const progress = getBudgetProgress(budget);
                        const remaining = budget.totalBudget - budget.totalSpent;

                        return (
                          <TableRow key={budget.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div className="font-medium">{budget.name}</div>
                                {budget.description && (
                                  <div className="text-sm text-muted-foreground">
                                    {budget.description}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {getBudgetTypeLabel(budget.type)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{new Date(budget.startDate).toLocaleDateString()}</div>
                                <div className="text-muted-foreground">
                                  to {new Date(budget.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {formatCurrency(budget.totalBudget)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {formatCurrency(budget.totalSpent)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatCurrency(remaining)} remaining
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <Progress value={progress} className="w-[60px]" />
                                <div className="text-xs text-muted-foreground">
                                  {progress.toFixed(1)}%
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(budget.status)}>
                                {budget.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleEditBudget(budget)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteBudget(budget.id)}
                                    className="text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-medium">
                    {activeTab === 'all' ? 'No budgets found' :
                     activeTab === 'active' ? 'No active budgets' :
                     activeTab === 'draft' ? 'No draft budgets' : 'No archived budgets'}
                  </h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'all'
                      ? 'Create your first budget to start tracking expenses.'
                      : `You don't have any ${activeTab} budgets.`}
                  </p>
                </div>
                <Button onClick={handleCreateBudget}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Budget
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
