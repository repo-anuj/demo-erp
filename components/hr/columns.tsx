'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  startDate: string;
  salary?: number;
  status: string;
  role?: string;
  password?: string;
  permissions?: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  // Add the assignments field based on the API response
  assignments?: { project: { id: string; name: string } }[];
};

// Make columns a function that accepts callbacks
export const columns = (
  onEdit: (employee: Employee) => void
  // Add onView, onManageLeave later
): ColumnDef<Employee>[] => [
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;
      return `${firstName} ${lastName}`;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => {
      const department = row.getValue('department') as string;
      return department.charAt(0).toUpperCase() + department.slice(1);
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      const date = row.getValue('startDate') as string;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: 'assignedProjects',
    header: 'Assigned Projects',
    cell: ({ row }) => {
      const employee = row.original;
      const assignments = employee.assignments || [];
      
      if (assignments.length === 0) {
        return <span className="text-sm text-muted-foreground">Unknown Project</span>;
      }
      
      return (
        <div className="flex flex-wrap gap-1">
          {assignments.map((assignment, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {assignment.project.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const employee = row.original; // Get the full employee object

      // Placeholder functions - These would eventually open modals/pages
      const handleViewProfile = (emp: Employee) => {
        alert(`Viewing profile for: ${emp.firstName} ${emp.lastName} (ID: ${emp.id})`);
        // TODO: Implement actual navigation or modal opening
      };

      const handleEditDetails = (emp: Employee) => {
        onEdit(emp); // Call the passed-in function
      };

      const handleManageLeave = (emp: Employee) => {
        alert(`Managing leave for: ${emp.firstName} ${emp.lastName} (ID: ${emp.id})`);
        // TODO: Implement actual leave management interface
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employee.id)}>
              Copy employee ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewProfile(employee)}>
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditDetails(employee)}>
              Edit details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleManageLeave(employee)}>
              Manage leave
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
