"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDate, formatCurrency } from "@/lib/utils"
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Eye, 
  Edit, 
  FileText, 
  Trash2, 
  Copy, 
  Download,
  ShoppingCart,
  User,
  Receipt
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Define the Sale type based on our Prisma schema
export type Sale = {
  id: string
  invoiceNumber?: string | null
  customerId: string
  customer: {
    id: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
  }
  employeeId?: string | null
  employee?: {
    id: string
    firstName: string
    lastName: string
  } | null
  date: Date
  status: string
  total: number
  tax?: number | null
  notes?: string | null
  items: {
    id: string
    product: string
    productId: string
    description?: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  companyId: string
  createdAt: Date
  updatedAt: Date
}

// Component for viewing sale details
const SaleDetailsDialog = ({ sale, isOpen, onClose }: { 
  sale: Sale; 
  isOpen: boolean; 
  onClose: () => void 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
            Sale Details
          </DialogTitle>
          <DialogDescription>
            Invoice #{sale.invoiceNumber || `INV-${sale.id.substring(0, 8)}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <User className="mr-2 h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{sale.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{sale.customer.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{sale.customer.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-sm">{sale.customer.address || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sale Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Receipt className="mr-2 h-4 w-4" />
                Sale Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-sm">{formatDate(sale.date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={sale.status === 'completed' ? 'default' : sale.status === 'pending' ? 'secondary' : 'destructive'}>
                    {sale.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-sm font-semibold">{formatCurrency(sale.total)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tax</p>
                  <p className="text-sm">{sale.tax ? formatCurrency(sale.tax) : 'N/A'}</p>
                </div>
              </div>
              {sale.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm">{sale.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sale.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.product}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.total)}</p>
                      </div>
                    </div>
                    {index < sale.items.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              // Generate and download invoice
              window.open(`/api/sales/invoice/${sale.id}`, '_blank');
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Invoice number cell with tooltip
const InvoiceNumberCell = ({ row }: { row: any }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const sale = row.original;
  const invoiceNumber = sale.invoiceNumber || `INV-${sale.id.substring(0, 8)}`;
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium text-primary"
              onClick={() => setIsDetailsOpen(true)}
            >
              {invoiceNumber}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <SaleDetailsDialog 
        sale={sale} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
      />
    </>
  );
};

export const columns: ColumnDef<Sale>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
    cell: InvoiceNumberCell,
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => <div>{row.original.customer.name}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatDate(row.getValue("date")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      return formatCurrency(amount);
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const router = useRouter();
      const { toast } = useToast();
      const [isDetailsOpen, setIsDetailsOpen] = useState(false);
      const sale = row.original;
      
      const copyToClipboard = () => {
        const text = `Invoice #${sale.invoiceNumber || `INV-${sale.id.substring(0, 8)}`} - ${sale.customer.name} - ${formatCurrency(sale.total)}`;
        navigator.clipboard.writeText(text);
        toast({
          title: "Copied to clipboard",
          description: "Sale information has been copied to clipboard",
          duration: 2000,
        });
      };
      
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Info
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.open(`/api/sales/invoice/${sale.id}`, '_blank')}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <SaleDetailsDialog 
            sale={sale} 
            isOpen={isDetailsOpen} 
            onClose={() => setIsDetailsOpen(false)} 
          />
        </>
      );
    },
  },
];
