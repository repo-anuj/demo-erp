'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlusIcon, 
  RefreshCw, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  BarChart3,
  PiggyBank,
  ReceiptText
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { TransactionDialog } from '@/components/finance/transaction-dialog';
import { AccountDialog } from '@/components/finance/account-dialog';
import { TransactionsTable } from '@/components/finance/transactions-table';
import { useDemo } from '@/contexts/demo-context';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  categoryColor?: string;
  categoryIcon?: string;
  account: string | { id: string; name: string; [key: string]: any };
  reference?: string;
  status: string;
  sourceType?: 'finance' | 'sales' | 'inventory';
  originalData?: any;
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  institutionName?: string;
  description?: string;
}

export default function FinancePage() {
  const { finance } = useDemo();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [hasAccounts, setHasAccounts] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    totalIncome: 0,
    salesIncome: 0,
    regularIncome: 0,
    totalExpenses: 0,
    inventoryExpenses: 0,
    regularExpenses: 0,
    balance: 0,
    pendingIncome: 0,
    pendingExpenses: 0
  });

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

      // Demo accounts
      const demoAccounts: Account[] = [
        {
          id: 'demo-account-1',
          name: 'Main Business Account',
          type: 'bank',
          balance: 50000,
          currency: 'USD',
          institutionName: 'Demo Bank',
          description: 'Primary business checking account'
        },
        {
          id: 'demo-account-2', 
          name: 'Petty Cash',
          type: 'cash',
          balance: 1000,
          currency: 'USD',
          description: 'Office petty cash fund'
        }
      ];

      setTransactions(demoTransactions);
      setAccounts(demoAccounts);
      setHasAccounts(demoAccounts.length > 0);

      // Calculate stats
      const totalIncome = finance
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

      const totalExpenses = finance
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

      setStats({
        totalIncome,
        salesIncome: totalIncome * 0.8, // Demo: 80% from sales
        regularIncome: totalIncome * 0.2, // Demo: 20% other income
        totalExpenses,
        inventoryExpenses: totalExpenses * 0.6, // Demo: 60% inventory
        regularExpenses: totalExpenses * 0.4, // Demo: 40% other expenses
        balance: totalIncome - totalExpenses,
        pendingIncome: 0,
        pendingExpenses: 0
      });

      setIsLoading(false);
    };

    initializeData();
  }, [finance]);

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setTransactionDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDialogOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    // Demo mode - show notification
    alert('Demo Mode: Transaction deletion simulated');
  };

  const handleDuplicateTransaction = (transaction: Transaction) => {
    // Demo mode - show notification
    alert('Demo Mode: Transaction duplication simulated');
  };

  const handleViewOriginal = (transaction: Transaction) => {
    // Demo mode - show notification
    alert('Demo Mode: View original transaction simulated');
  };

  const handleAddAccount = () => {
    setAccountDialogOpen(true);
  };

  // Filter transactions based on active tab
  const currentTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    return transaction.type === activeTab;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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

  // No accounts state
  if (!hasAccounts) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Finance Dashboard</CardTitle>
            <CardDescription>
              To get started with your finances, you need to create at least one account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-4 mb-8">
              <h3 className="text-xl font-medium">No Financial Accounts</h3>
              <p className="text-muted-foreground">
                Create your first bank, cash, or credit account to track your transactions.
              </p>
            </div>
            <Button size="lg" onClick={handleAddAccount}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </CardContent>
        </Card>

        <AccountDialog
          open={accountDialogOpen}
          onOpenChange={setAccountDialogOpen}
          account={null}
          onSuccess={() => {
            setAccountDialogOpen(false);
            // Refresh data in demo mode
            alert('Demo Mode: Account created successfully');
          }}
        />
      </div>
    );
  }

  // Main dashboard with data
  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Finance Dashboard</h1>
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
          <Button variant="outline" size="sm" onClick={handleAddAccount}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Account
          </Button>
          <Button size="sm" onClick={handleAddTransaction}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Income
            </CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome)}
            </div>
            <div className="space-y-1 mt-1">
              <div className="text-xs flex justify-between">
                <span>Sales:</span>
                <span className="font-medium">{formatCurrency(stats.salesIncome)}</span>
              </div>
              <div className="text-xs flex justify-between">
                <span>Other Income:</span>
                <span className="font-medium">{formatCurrency(stats.regularIncome)}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.pendingIncome > 0 && `${formatCurrency(stats.pendingIncome)} pending`}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses)}
            </div>
            <div className="space-y-1 mt-1">
              <div className="text-xs flex justify-between">
                <span>Inventory:</span>
                <span className="font-medium">{formatCurrency(stats.inventoryExpenses)}</span>
              </div>
              <div className="text-xs flex justify-between">
                <span>Other Expenses:</span>
                <span className="font-medium">{formatCurrency(stats.regularExpenses)}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.pendingExpenses > 0 && `${formatCurrency(stats.pendingExpenses)} pending`}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Profit
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.balance)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.balance >= 0 ? 'Profitable' : 'Loss'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Accounts
            </CardTitle>
            <Wallet className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Total Balance: {formatCurrency(accounts.reduce((sum, acc) => sum + acc.balance, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            View and manage your financial transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-96" />
              ) : (
                <>
                  <TransactionsTable
                    transactions={currentTransactions as any}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                    onDuplicate={handleDuplicateTransaction}
                    onViewOriginal={handleViewOriginal}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        transaction={selectedTransaction}
        onSuccess={() => {
          setTransactionDialogOpen(false);
          setSelectedTransaction(null);
          alert('Demo Mode: Transaction saved successfully');
        }}
      />

      <AccountDialog
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
        account={null}
        onSuccess={() => {
          setAccountDialogOpen(false);
          alert('Demo Mode: Account created successfully');
        }}
      />
    </div>
  );
}
