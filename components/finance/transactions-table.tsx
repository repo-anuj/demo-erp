'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Copy, Edit, MoreHorizontal, Trash, ShoppingCart, Receipt, Eye, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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
  sourceType?: 'sales' | 'inventory' | 'finance';
  originalData?: any;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onDuplicate: (transaction: Transaction) => void;
  onViewOriginal?: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
  onDuplicate,
  onViewOriginal,
}: TransactionsTableProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getSourceIcon = (sourceType?: string) => {
    switch (sourceType) {
      case 'sales':
        return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case 'inventory':
        return <Receipt className="h-4 w-4 text-amber-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSourceTooltip = (sourceType?: string) => {
    switch (sourceType) {
      case 'sales':
        return 'Generated from sales transaction';
      case 'inventory':
        return 'Generated from inventory purchase';
      default:
        return 'Manual finance transaction';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className={transaction.sourceType
                ? transaction.sourceType === 'sales'
                  ? "bg-blue-50 hover:bg-blue-100"
                  : transaction.sourceType === 'inventory'
                  ? "bg-amber-50 hover:bg-amber-100"
                  : undefined
                : undefined
              }
            >
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <div title={getSourceTooltip(transaction.sourceType)}>
                    {getSourceIcon(transaction.sourceType)}
                  </div>
                  <span>
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  {transaction.reference && (
                    <div className="text-sm text-muted-foreground">
                      Ref: {transaction.reference}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {transaction.categoryIcon && (
                    <span>{transaction.categoryIcon}</span>
                  )}
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: transaction.categoryColor,
                      color: transaction.categoryColor,
                    }}
                  >
                    {transaction.category}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{transaction.account}</TableCell>
              <TableCell>
                <div className={`font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(transaction.status)}>
                  {transaction.status}
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
                    <DropdownMenuItem onClick={() => onEdit(transaction)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(transaction)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    {transaction.sourceType && onViewOriginal && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewOriginal(transaction)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Original
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
