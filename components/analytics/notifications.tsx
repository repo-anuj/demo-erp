'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Bell, 
  AlertTriangle, 
  TrendingDown, 
  Package, 
  DollarSign,
  Users,
  CheckCircle,
  X
} from 'lucide-react';
import { formatCurrency, formatNumber } from './chart-components';
import { useDemo } from '@/contexts/demo-context';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  module: string;
  read: boolean;
  actionable?: boolean;
}

export function NotificationsPopover() {
  const { inventory, sales, finance, employees: hr } = useDemo();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Generate notifications based on data
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];

      // Ensure data arrays exist before processing
      if (!inventory || !sales || !finance || !hr) {
        return;
      }

      // Inventory alerts
      const lowStockItems = inventory.filter(item => item && item.quantity < 10);
      if (lowStockItems.length > 0) {
        newNotifications.push({
          id: 'low-stock',
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${lowStockItems.length} items are running low on stock`,
          timestamp: new Date(),
          module: 'Inventory',
          read: false,
          actionable: true
        });
      }

      // Out of stock items
      const outOfStockItems = inventory.filter(item => item && item.quantity === 0);
      if (outOfStockItems.length > 0) {
        newNotifications.push({
          id: 'out-of-stock',
          type: 'error',
          title: 'Out of Stock',
          message: `${outOfStockItems.length} items are completely out of stock`,
          timestamp: new Date(),
          module: 'Inventory',
          read: false,
          actionable: true
        });
      }

      // High value inventory
      const highValueItems = inventory.filter(item => item && item.price && item.quantity && (item.price * item.quantity > 5000));
      if (highValueItems.length > 0) {
        newNotifications.push({
          id: 'high-value-inventory',
          type: 'info',
          title: 'High Value Inventory',
          message: `${highValueItems.length} items have high inventory value`,
          timestamp: new Date(),
          module: 'Inventory',
          read: false
        });
      }

      // Sales performance
      const totalRevenue = sales.reduce((sum, sale) => sum + (sale?.total || 0), 0);
      if (totalRevenue > 50000) {
        newNotifications.push({
          id: 'sales-milestone',
          type: 'success',
          title: 'Sales Milestone',
          message: `Congratulations! You've reached ${formatCurrency(totalRevenue)} in total sales`,
          timestamp: new Date(),
          module: 'Sales',
          read: false
        });
      }

      // Recent large sales
      const largeSales = sales.filter(sale => sale && sale.total > 1000);
      if (largeSales.length > 0) {
        newNotifications.push({
          id: 'large-sales',
          type: 'success',
          title: 'Large Sales Detected',
          message: `${largeSales.length} sales transactions over $1,000`,
          timestamp: new Date(),
          module: 'Sales',
          read: false
        });
      }

      // Finance alerts
      const totalIncome = finance.filter(t => t && t.type === 'income').reduce((sum, t) => sum + (t?.amount || 0), 0);
      const totalExpenses = finance.filter(t => t && t.type === 'expense').reduce((sum, t) => sum + (t?.amount || 0), 0);
      const netCashflow = totalIncome - totalExpenses;

      if (netCashflow < 0) {
        newNotifications.push({
          id: 'negative-cashflow',
          type: 'warning',
          title: 'Negative Cash Flow',
          message: `Current cash flow is ${formatCurrency(netCashflow)}`,
          timestamp: new Date(),
          module: 'Finance',
          read: false,
          actionable: true
        });
      }

      // High expenses
      if (totalIncome > 0 && totalExpenses > totalIncome * 0.8) {
        newNotifications.push({
          id: 'high-expenses',
          type: 'warning',
          title: 'High Expense Ratio',
          message: `Expenses are ${((totalExpenses / totalIncome) * 100).toFixed(1)}% of income`,
          timestamp: new Date(),
          module: 'Finance',
          read: false,
          actionable: true
        });
      }

      // HR notifications
      const activeEmployees = hr.filter(emp => emp && emp.status === 'active').length;
      const totalEmployees = hr.length;

      if (activeEmployees < totalEmployees) {
        newNotifications.push({
          id: 'inactive-employees',
          type: 'info',
          title: 'Employee Status Update',
          message: `${totalEmployees - activeEmployees} employees are not currently active`,
          timestamp: new Date(),
          module: 'HR',
          read: false
        });
      }

      // System notifications
      if (inventory.length > 0 || sales.length > 0 || finance.length > 0 || hr.length > 0) {
        newNotifications.push({
          id: 'data-updated',
          type: 'info',
          title: 'Analytics Updated',
          message: 'Your analytics data has been refreshed with the latest information',
          timestamp: new Date(),
          module: 'System',
          read: false
        });
      }

      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [inventory, sales, finance, hr]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <X className="h-4 w-4 text-red-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Inventory':
        return <Package className="h-3 w-3" />;
      case 'Sales':
        return <TrendingDown className="h-3 w-3" />;
      case 'Finance':
        return <DollarSign className="h-3 w-3" />;
      case 'HR':
        return <Users className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div 
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        notification.read 
                          ? 'bg-muted/50 border-muted' 
                          : 'bg-background border-border hover:bg-muted/30'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between space-x-2">
                        <div className="flex items-start space-x-2 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className={`text-sm font-medium ${
                                notification.read ? 'text-muted-foreground' : 'text-foreground'
                              }`}>
                                {notification.title}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                <div className="flex items-center space-x-1">
                                  {getModuleIcon(notification.module)}
                                  <span>{notification.module}</span>
                                </div>
                              </Badge>
                            </div>
                            <p className={`text-xs mt-1 ${
                              notification.read ? 'text-muted-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {notification.actionable && (
                        <div className="mt-2 pt-2 border-t">
                          <Button size="sm" variant="outline" className="text-xs">
                            Take Action
                          </Button>
                        </div>
                      )}
                    </div>
                    {index < notifications.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
