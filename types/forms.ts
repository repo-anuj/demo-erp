// Form types to help with TypeScript issues

export interface AccountFormValues {
  name: string;
  type: "bank" | "cash" | "credit" | "investment" | "other";
  number?: string;
  balance?: number;
  currency?: string;
  institutionName?: string;
  description?: string;
}

export interface TransactionFormValues {
  date: Date;
  description: string;
  amount: number;
  type: "income" | "expense";
  categoryId?: string;
  category: string;
  accountId?: string;
  account: string;
  reference?: string;
  status: "pending" | "completed" | "failed";
  recurring: boolean;
  notes?: string;
}

export interface EmployeeFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  startDate: string;
  salary?: number;
  password?: string;
  role: "employee" | "manager" | "admin";
}

export interface EmployeeUpdateValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  position?: string;
  department?: string;
  salary?: number | null;
  status?: string;
  password?: string;
  role?: "employee" | "admin" | "manager";
  permissions?: string[];
}
