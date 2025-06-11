'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, RefreshCw, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionsTable } from '@/components/finance/transactions-table';
import { TransactionDialog } from '@/components/finance/transaction-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDemo } from '@/contexts/demo-context';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  categoryColor?: string;
  categoryIcon?: string;
  account: string;
  reference?: string;
  status: string;
  sourceType?: 'finance' | 'sales' | 'inventory';
  originalData?: any;
}

export default function TransactionsPage() {
  const { finance } = useDemo();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Categories for filtering
  const [categories, setCategories] = useState<string[]>([]);

  // Demo data initialization
  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      
      // Convert demo finance data to transaction format
      const demoTransactions: Transaction[] = finance.map(item => ({
        id: item.id,
        date: item.date,
        description: item.description,
        amount: item.amount,
        type: item.type,
        category: item.category,
        account: 'Demo Account',
        status: 'completed',
        sourceType: 'finance'
      }));

      setTransactions(demoTransactions);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(finance.map(item => item.category)));
      setCategories(uniqueCategories);

      setIsLoading(false);
    };

    initializeData();
  }, [finance]);

  // Apply all filters and pagination
  const applyFilters = (transactionsToFilter = transactions) => {
    // Apply tab filter
    let filtered = transactionsToFilter;
    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.type === activeTab);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.account.toLowerCase().includes(query) ||
        (t.reference && t.reference.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status.toLowerCase() === selectedStatus.toLowerCase());
    }
    
    // Calculate total pages
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
    
    // If current page is now beyond total pages, adjust it
    if (currentPage > Math.max(1, Math.ceil(filtered.length / itemsPerPage))) {
      setCurrentPage(1);
    }
    
    // Store the filtered results
    setFilteredTransactions(filtered);
  };

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [activeTab, searchQuery, selectedCategory, selectedStatus, transactions, itemsPerPage]);

  // Transaction handlers
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    alert('Demo Mode: Transaction deletion simulated');
  };

  const handleDuplicateTransaction = (transaction: Transaction) => {
    alert('Demo Mode: Transaction duplication simulated');
  };

  const handleViewOriginal = (transaction: Transaction) => {
    alert('Demo Mode: View original transaction simulated');
  };

  const handleTransactionSuccess = () => {
    setDialogOpen(false);
    setEditingTransaction(null);
    alert('Demo Mode: Transaction saved successfully');
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  // Get paginated transactions
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary stats for current filtered transactions
  const summaryStats = {
    totalIncome: filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    totalTransactions: filteredTransactions.length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              Manage and track all your financial transactions
            </p>
          </div>
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
          <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and track all your financial transactions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alert('Demo Mode: Data refreshed');
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleAddTransaction}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summaryStats.totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summaryStats.totalExpenses)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              summaryStats.totalIncome - summaryStats.totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(summaryStats.totalIncome - summaryStats.totalExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredTransactions.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'all' ? 'All Transactions' :
                   activeTab === 'income' ? 'Income Transactions' : 'Expense Transactions'}
                </CardTitle>
                <CardDescription>
                  Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <TransactionsTable
                  transactions={paginatedTransactions}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                  onDuplicate={handleDuplicateTransaction}
                  onViewOriginal={handleViewOriginal}
                />
              </CardContent>

              {/* Pagination */}
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                    {filteredTransactions.length} transactions
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(parseInt(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="10 per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Filter className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-medium">No transactions found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || (selectedCategory && selectedCategory !== 'all') || (selectedStatus && selectedStatus !== 'all')
                      ? 'Try adjusting your filters or add a new transaction.'
                      : 'Start by adding your first transaction.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {(searchQuery || (selectedCategory && selectedCategory !== 'all') || (selectedStatus && selectedStatus !== 'all')) && (
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  )}
                  <Button onClick={handleAddTransaction}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Transaction Dialog */}
      <TransactionDialog
        transaction={editingTransaction}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}
