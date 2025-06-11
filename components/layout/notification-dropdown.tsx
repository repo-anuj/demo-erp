'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info,
  Package,
  DollarSign,
  Users,
  FolderOpen,
  BarChart3,
  Settings as SettingsIcon,
  TrendingUp,
  UserPlus,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/contexts/notification-context';
import { formatDistanceToNow } from 'date-fns';

export function NotificationDropdown() {
  const { notifications, loading, markAsRead, unreadCount, refreshNotifications } = useNotifications();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Refresh notifications when dropdown is opened
  useEffect(() => {
    if (open) {
      refreshNotifications();
    }
  }, [open, refreshNotifications]);

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to the link if provided
    if (notification.link) {
      router.push(notification.link);
      setOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getModuleIcon = (entityType?: string) => {
    switch (entityType) {
      case 'inventory':
        return <Package className="h-3 w-3 text-blue-600" />;
      case 'sale':
      case 'sales':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'finance':
        return <DollarSign className="h-3 w-3 text-yellow-600" />;
      case 'employee':
      case 'hr':
        return <Users className="h-3 w-3 text-purple-600" />;
      case 'project':
        return <FolderOpen className="h-3 w-3 text-orange-600" />;
      case 'analytics':
        return <BarChart3 className="h-3 w-3 text-indigo-600" />;
      case 'system':
        return <SettingsIcon className="h-3 w-3 text-gray-600" />;
      case 'customer':
        return <UserPlus className="h-3 w-3 text-teal-600" />;
      default:
        return <Bell className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getModuleName = (entityType?: string) => {
    switch (entityType) {
      case 'inventory':
        return 'Inventory';
      case 'sale':
      case 'sales':
        return 'Sales';
      case 'finance':
        return 'Finance';
      case 'employee':
      case 'hr':
        return 'HR';
      case 'project':
        return 'Projects';
      case 'analytics':
        return 'Analytics';
      case 'system':
        return 'System';
      case 'customer':
        return 'Customers';
      default:
        return 'General';
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };

  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      case 'info':
      default:
        return 'outline';
    }
  };

  // Get recent notifications (last 10)
  const recentNotifications = notifications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="outline" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                className="h-6 px-2 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <ScrollArea className="h-80">
            {recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start space-x-2 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-primary rounded-full ml-2" />
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mb-1">
                        {getModuleIcon(notification.entityType)}
                        <span className="text-xs text-muted-foreground font-medium">
                          {getModuleName(notification.entityType)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-wrap gap-1">
                          {notification.metadata?.amount && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-800">
                              ${notification.metadata.amount.toLocaleString()}
                            </span>
                          )}
                          {notification.metadata?.currentStock !== undefined && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                              notification.metadata.currentStock === 0
                                ? 'bg-red-100 text-red-800'
                                : notification.metadata.currentStock < 10
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {notification.metadata.currentStock} units
                            </span>
                          )}
                          {notification.metadata?.progress !== undefined && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-purple-100 text-purple-800">
                              {notification.metadata.progress}% complete
                            </span>
                          )}
                        </div>
                        <Badge variant={getNotificationBadgeVariant(notification.type)} className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-center justify-center"
          onClick={() => {
            router.push('/settings?tab=notifications');
            setOpen(false);
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
