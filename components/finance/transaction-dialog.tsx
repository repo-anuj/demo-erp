'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, Check, Loader2, Plus } from 'lucide-react';
import { format } from 'date-fns';

// Transaction schema
const transactionSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  accountId: z.string().optional(),
  account: z.string().min(1, "Account is required"),
  reference: z.string().optional(),
  status: z.enum(["pending", "completed", "failed"]),
  recurring: z.boolean(),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

// Default categories
const defaultCategories = {
  expense: [
    { id: "office", name: "Office Supplies", color: "#EF4444", icon: "🏢" },
    { id: "marketing", name: "Marketing", color: "#F59E0B", icon: "📢" },
    { id: "travel", name: "Travel", color: "#3B82F6", icon: "✈️" },
    { id: "utilities", name: "Utilities", color: "#10B981", icon: "⚡" },
    { id: "software", name: "Software", color: "#8B5CF6", icon: "💻" },
    { id: "other", name: "Other", color: "#6B7280", icon: "" },
  ],
  income: [
    { id: "sales", name: "Sales", color: "#10B981", icon: "💰" },
    { id: "consulting", name: "Consulting", color: "#3B82F6", icon: "💼" },
    { id: "investment", name: "Investment", color: "#8B5CF6", icon: "📈" },
    { id: "salary", name: "Salary", color: "#10B981", icon: "💸" },
    { id: "other", name: "Other", color: "#6B7280", icon: "" },
  ],
};

// Default accounts
const defaultAccounts = [
  { id: "bank", name: "Bank Account" },
  { id: "cash", name: "Cash" },
  { id: "credit", name: "Credit Card" },
];

interface TransactionDialogProps {
  transaction: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function TransactionDialog({
  transaction,
  open,
  onOpenChange,
  onSuccess,
}: TransactionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Initialize form with default values or existing transaction values
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          date: new Date(transaction.date),
          description: transaction.description || "",
          amount: transaction.amount || 0,
          type: (transaction.type as "income" | "expense") || "expense",
          category: transaction.category || "",
          account: transaction.account || "",
          reference: transaction.reference || "",
          status: (transaction.status as "pending" | "completed" | "failed") || "completed",
          recurring: transaction.recurring || false,
          notes: transaction.notes || "",
        }
      : {
          date: new Date(),
          description: "",
          amount: 0,
          type: "expense" as const,
          category: "",
          account: "",
          reference: "",
          status: "completed" as const,
          recurring: false,
          notes: "",
        },
  });

  // Watch transaction type to load relevant categories
  const transactionType = form.watch("type");

  // Load demo categories and accounts
  useEffect(() => {
    setCategories(defaultCategories[transactionType]);
    setAccounts(defaultAccounts);
  }, [transactionType]);

  // Handle form submission
  const onSubmit = async (values: TransactionFormValues) => {
    setIsSubmitting(true);

    try {
      // Demo mode - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Demo Mode: Transaction data:', values);
      onSuccess();
    } catch (error) {
      console.error('Demo Mode: Transaction submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding new category
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        name: newCategoryName,
        color: "#6B7280",
        icon: ""
      };
      setCategories([...categories, newCategory]);
      form.setValue("category", newCategory.name);
      setNewCategoryName("");
      setShowNewCategory(false);
    }
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (transaction) {
        form.reset({
          date: new Date(transaction.date),
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type as "income" | "expense",
          category: transaction.category,
          account: transaction.account,
          reference: transaction.reference || "",
          status: transaction.status as "pending" | "completed" | "failed",
          recurring: false,
          notes: "",
        });
      } else {
        form.reset({
          date: new Date(),
          description: "",
          amount: 0,
          type: "expense",
          category: "",
          account: "",
          reference: "",
          status: "completed",
          recurring: false,
          notes: "",
        });
      }
    }
  }, [open, transaction, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "Add New Transaction"}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? "Update the details of your financial transaction."
              : "Enter the details of your financial transaction."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Date field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter transaction description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount and Type */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          <div className="flex items-center">
                            {category.icon && <span className="mr-2">{category.icon}</span>}
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                      <div className="border-t pt-2">
                        {!showNewCategory ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setShowNewCategory(true)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add new category
                          </Button>
                        ) : (
                          <div className="flex gap-2 p-2">
                            <Input
                              placeholder="Category name"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCategory();
                                }
                              }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleAddCategory}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account */}
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.name}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reference and Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Invoice #, Receipt #, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Recurring */}
            <FormField
              control={form.control}
              name="recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Recurring Transaction</FormLabel>
                    <FormDescription>
                      Mark this as a recurring transaction for future automation
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about this transaction"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {transaction ? "Update" : "Save"} Transaction
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
