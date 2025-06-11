'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isDefault: boolean;
  createdAt: string;
}

const PERMISSIONS: Permission[] = [
  // Dashboard permissions
  { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to main dashboard', category: 'Dashboard' },
  { id: 'dashboard.analytics', name: 'View Analytics', description: 'Access to analytics widgets', category: 'Dashboard' },
  
  // HR permissions
  { id: 'hr.view', name: 'View Employees', description: 'View employee list and details', category: 'HR' },
  { id: 'hr.create', name: 'Add Employees', description: 'Add new employees', category: 'HR' },
  { id: 'hr.edit', name: 'Edit Employees', description: 'Edit employee information', category: 'HR' },
  { id: 'hr.delete', name: 'Delete Employees', description: 'Remove employees', category: 'HR' },
  
  // Inventory permissions
  { id: 'inventory.view', name: 'View Inventory', description: 'View inventory items', category: 'Inventory' },
  { id: 'inventory.create', name: 'Add Items', description: 'Add new inventory items', category: 'Inventory' },
  { id: 'inventory.edit', name: 'Edit Items', description: 'Edit inventory items', category: 'Inventory' },
  { id: 'inventory.delete', name: 'Delete Items', description: 'Remove inventory items', category: 'Inventory' },
  
  // Sales permissions
  { id: 'sales.view', name: 'View Sales', description: 'View sales transactions', category: 'Sales' },
  { id: 'sales.create', name: 'Create Sales', description: 'Create new sales', category: 'Sales' },
  { id: 'sales.edit', name: 'Edit Sales', description: 'Edit sales transactions', category: 'Sales' },
  { id: 'sales.delete', name: 'Delete Sales', description: 'Remove sales transactions', category: 'Sales' },
  
  // Finance permissions
  { id: 'finance.view', name: 'View Finance', description: 'View financial data', category: 'Finance' },
  { id: 'finance.create', name: 'Add Transactions', description: 'Add financial transactions', category: 'Finance' },
  { id: 'finance.edit', name: 'Edit Transactions', description: 'Edit financial transactions', category: 'Finance' },
  { id: 'finance.delete', name: 'Delete Transactions', description: 'Remove financial transactions', category: 'Finance' },
  
  // Projects permissions
  { id: 'projects.view', name: 'View Projects', description: 'View project list and details', category: 'Projects' },
  { id: 'projects.create', name: 'Create Projects', description: 'Create new projects', category: 'Projects' },
  { id: 'projects.edit', name: 'Edit Projects', description: 'Edit project information', category: 'Projects' },
  { id: 'projects.delete', name: 'Delete Projects', description: 'Remove projects', category: 'Projects' },
  
  // Analytics permissions
  { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics dashboard', category: 'Analytics' },
  { id: 'analytics.export', name: 'Export Data', description: 'Export analytics data', category: 'Analytics' },
  
  // Settings permissions
  { id: 'settings.view', name: 'View Settings', description: 'Access settings pages', category: 'Settings' },
  { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings', category: 'Settings' },
  { id: 'settings.roles', name: 'Manage Roles', description: 'Manage user roles and permissions', category: 'Settings' },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full access to all system features and settings',
      permissions: PERMISSIONS.map(p => p.id),
      userCount: 2,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Access to most features with limited administrative capabilities',
      permissions: [
        'dashboard.view', 'dashboard.analytics',
        'hr.view', 'hr.create', 'hr.edit',
        'inventory.view', 'inventory.create', 'inventory.edit',
        'sales.view', 'sales.create', 'sales.edit',
        'finance.view', 'finance.create', 'finance.edit',
        'projects.view', 'projects.create', 'projects.edit',
        'analytics.view', 'analytics.export',
        'settings.view'
      ],
      userCount: 5,
      isDefault: false,
      createdAt: '2024-01-02T00:00:00Z'
    },
    {
      id: 'employee',
      name: 'Employee',
      description: 'Basic access to view and create content',
      permissions: [
        'dashboard.view',
        'hr.view',
        'inventory.view', 'inventory.create',
        'sales.view', 'sales.create',
        'finance.view',
        'projects.view',
        'analytics.view'
      ],
      userCount: 12,
      isDefault: false,
      createdAt: '2024-01-03T00:00:00Z'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to most content',
      permissions: [
        'dashboard.view',
        'hr.view',
        'inventory.view',
        'sales.view',
        'finance.view',
        'projects.view',
        'analytics.view'
      ],
      userCount: 8,
      isDefault: false,
      createdAt: '2024-01-04T00:00:00Z'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const handleCreateRole = () => {
    if (!newRole.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    const role: Role = {
      id: `role-${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    setRoles(prev => [...prev, role]);
    setNewRole({ name: '', description: '', permissions: [] });
    setIsCreateDialogOpen(false);
    toast.success('Role created successfully');
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    });
  };

  const handleUpdateRole = () => {
    if (!editingRole || !newRole.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    setRoles(prev => prev.map(role => 
      role.id === editingRole.id 
        ? { ...role, name: newRole.name, description: newRole.description, permissions: newRole.permissions }
        : role
    ));

    setEditingRole(null);
    setNewRole({ name: '', description: '', permissions: [] });
    toast.success('Role updated successfully');
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isDefault) {
      toast.error('Cannot delete default role');
      return;
    }

    if (role?.userCount && role.userCount > 0) {
      toast.error('Cannot delete role with assigned users');
      return;
    }

    setRoles(prev => prev.filter(r => r.id !== roleId));
    toast.success('Role deleted successfully');
  };

  const handlePermissionToggle = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getPermissionsByCategory = () => {
    const categories: Record<string, Permission[]> = {};
    PERMISSIONS.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const permissionsByCategory = getPermissionsByCategory();

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions for your organization
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions for your team members.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    value={newRole.name}
                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter role name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDescription">Description</Label>
                  <Textarea
                    id="roleDescription"
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this role"
                    className="h-20"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Permissions</Label>
                {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-3">
                            <Switch
                              checked={newRole.permissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                            />
                            <div className="flex-1">
                              <Label className="text-sm font-medium">{permission.name}</Label>
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole}>
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Existing Roles
          </CardTitle>
          <CardDescription>
            Manage and configure user roles and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground truncate">
                        {role.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{role.userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {role.permissions.length} permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {role.isDefault ? (
                        <Badge variant="default">Default</Badge>
                      ) : (
                        <Badge variant="secondary">Custom</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {!role.isDefault && role.userCount === 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role: {editingRole?.name}</DialogTitle>
            <DialogDescription>
              Modify the role permissions and settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="editRoleName">Role Name</Label>
                <Input
                  id="editRoleName"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter role name"
                  disabled={editingRole?.isDefault}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRoleDescription">Description</Label>
                <Textarea
                  id="editRoleDescription"
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this role"
                  className="h-20"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Permissions</Label>
              {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-3">
                          <Switch
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                          />
                          <div className="flex-1">
                            <Label className="text-sm font-medium">{permission.name}</Label>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRole(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
