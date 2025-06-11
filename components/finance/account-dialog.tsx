'use client';

import { useState } from 'react';
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
import { Loader2 } from 'lucide-react';

// Account schema
const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["bank", "cash", "credit", "investment", "other"]),
  number: z.string().optional(),
  balance: z.coerce.number(),
  currency: z.string().min(1, "Currency is required"),
  institutionName: z.string().optional(),
  description: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountDialogProps {
  account: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AccountDialog({
  account,
  open,
  onOpenChange,
  onSuccess,
}: AccountDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values or existing account values
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: account
      ? {
          name: account.name || "",
          type: account.type || "bank",
          number: account.number || "",
          balance: account.balance || 0,
          currency: account.currency || "USD",
          institutionName: account.institutionName || "",
          description: account.description || "",
        }
      : {
          name: "",
          type: "bank" as const,
          number: "",
          balance: 0,
          currency: "USD",
          institutionName: "",
          description: "",
        },
  });

  // Handle form submission
  const onSubmit = async (values: AccountFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Demo mode - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Demo Mode: Account data:', values);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Demo Mode: Account submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {account ? "Edit Account" : "Add New Account"}
          </DialogTitle>
          <DialogDescription>
            {account
              ? "Update your financial account details."
              : "Enter the details of your financial account."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Account Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Main Checking Account" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bank">Bank Account</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of financial account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Institution Name */}
            <FormField
              control={form.control}
              name="institutionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Chase Bank, Wells Fargo" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the bank or financial institution
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Number (Optional) */}
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. xxxx-xxxx-xxxx-1234" {...field} />
                  </FormControl>
                  <FormDescription>
                    The last 4 digits or a reference number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Balance */}
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The current balance of this account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about this account"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Any additional information about this account
                  </FormDescription>
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
                {account ? "Update" : "Create"} Account
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
