'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  PlusIcon, 
  RefreshCw, 
  Building2Icon,
  CreditCard,
  Wallet,
  Banknote,
  TrendingUp,
  MoreHorizontal,
  Edit,
  Trash
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { AccountDialog } from '@/components/finance/account-dialog';
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
import { Badge } from '@/components/ui/badge';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  initialBalance?: number;
  currentBalance?: number;
  currency: string;
  number?: string;
  institutionName?: string;
  description?: string;
}

export default function AccountsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);

  // Demo data initialization
  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      
      // Demo accounts
      const demoAccounts: Account[] = [
        {
          id: 'demo-account-1',
          name: 'Main Business Account',
          type: 'bank',
          balance: 50000,
          currentBalance: 50000,
          currency: 'USD',
          number: '****1234',
          institutionName: 'Demo Bank',
          description: 'Primary business checking account'
        },
        {
          id: 'demo-account-2', 
          name: 'Petty Cash',
          type: 'cash',
          balance: 1000,
          currentBalance: 1000,
          currency: 'USD',
          description: 'Office petty cash fund'
        },
        {
          id: 'demo-account-3',
          name: 'Business Credit Card',
          type: 'credit',
          balance: -2500,
          currentBalance: -2500,
          currency: 'USD',
          number: '****5678',
          institutionName: 'Demo Credit Union',
          description: 'Business expenses credit card'
        }
      ];

      setAccounts(demoAccounts);
      calculateTotalBalance(demoAccounts);
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Calculate total balance across all accounts
  const calculateTotalBalance = (accountsList: Account[]) => {
    const total = accountsList.reduce((sum, account) => {
      const balanceToUse = typeof account.currentBalance !== 'undefined'
        ? account.currentBalance
        : account.balance;

      // For credit accounts, negative balance is actually good
      const balanceValue = account.type === 'credit'
        ? -balanceToUse
        : balanceToUse;

      return sum + balanceValue;
    }, 0);

    setTotalBalance(total);
  };

  // Handle adding a new account
  const handleAddAccount = () => {
    setSelectedAccount(null);
    setAccountDialogOpen(true);
  };

  // Handle editing an account
  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setAccountDialogOpen(true);
  };

  // Handle deleting an account
  const handleDeleteAccount = (accountId: string) => {
    alert('Demo Mode: Account deletion simulated');
  };

  // Handle account dialog success
  const handleAccountSuccess = () => {
    setAccountDialogOpen(false);
    setSelectedAccount(null);
    alert('Demo Mode: Account saved successfully');
  };

  // Get account type icon
  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <Building2Icon className="h-4 w-4 text-blue-600" />;
      case 'cash':
        return <Banknote className="h-4 w-4 text-green-600" />;
      case 'credit':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      case 'investment':
        return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get account type badge variant
  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case 'bank':
        return { variant: 'default' as const, label: 'Bank' };
      case 'cash':
        return { variant: 'secondary' as const, label: 'Cash' };
      case 'credit':
        return { variant: 'outline' as const, label: 'Credit' };
      case 'investment':
        return { variant: 'destructive' as const, label: 'Investment' };
      default:
        return { variant: 'outline' as const, label: 'Other' };
    }
  };

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
  if (accounts.length === 0) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Building2Icon className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold">No Accounts Found</h2>
            <p className="text-muted-foreground max-w-md">
              You haven't created any financial accounts yet. Create your first account to track your income and expenses.
            </p>
            <Button size="lg" onClick={handleAddAccount}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Your First Account
            </Button>
          </div>
        </Card>

        <AccountDialog
          account={selectedAccount}
          open={accountDialogOpen}
          onOpenChange={setAccountDialogOpen}
          onSuccess={handleAccountSuccess}
        />
      </div>
    );
  }

  // Main accounts page with data
  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Financial Accounts</h1>
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
          <Button size="sm" onClick={handleAddAccount}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Accounts</CardTitle>
            <Building2Icon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(a => a.type === 'bank').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(accounts.filter(a => a.type === 'bank').reduce((sum, a) => sum + (a.currentBalance || a.balance), 0))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Accounts</CardTitle>
            <Banknote className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(a => a.type === 'cash').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(accounts.filter(a => a.type === 'cash').reduce((sum, a) => sum + (a.currentBalance || a.balance), 0))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(a => a.type === 'credit').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(Math.abs(accounts.filter(a => a.type === 'credit').reduce((sum, a) => sum + (a.currentBalance || a.balance), 0)))} owed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Accounts</CardTitle>
          <CardDescription>
            Manage your financial accounts and track balances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => {
                  const typeBadge = getAccountTypeBadge(account.type);
                  const currentBalance = account.currentBalance ?? account.balance;

                  return (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getAccountTypeIcon(account.type)}
                          {account.name}
                          {account.number && (
                            <span className="text-xs text-muted-foreground">
                              {account.number}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={typeBadge.variant}>
                          {typeBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${
                          account.type === 'credit'
                            ? currentBalance <= 0 ? 'text-green-600' : 'text-red-600'
                            : currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(currentBalance)} {account.currency}
                        </div>
                        {account.initialBalance !== undefined && account.initialBalance !== currentBalance && (
                          <div className="text-xs text-muted-foreground">
                            Initial: {formatCurrency(account.initialBalance)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {account.institutionName || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {account.description || '-'}
                        </div>
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
                            <DropdownMenuItem onClick={() => handleEditAccount(account)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteAccount(account.id)}
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

      <AccountDialog
        account={selectedAccount}
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
        onSuccess={handleAccountSuccess}
      />
    </div>
  );
}
