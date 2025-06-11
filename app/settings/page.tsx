'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useDemo } from '@/contexts/demo-context';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Package,
  DollarSign,
  Users,
  FolderOpen,
  BarChart3,
  Settings as SettingsIcon,
  TrendingUp
} from 'lucide-react';

function SettingsContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const [saving, setSaving] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Welcome to ERP System',
      message: 'Your account has been successfully created and configured. You now have access to all modules including inventory, sales, finance, HR, projects, and analytics.',
      createdAt: new Date().toISOString(),
      read: false,
      type: 'info',
      module: 'System'
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'USB-C Hub (5 units) and Desk Organizer (0 units) are running low on stock. Consider reordering to maintain adequate inventory levels.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      type: 'warning',
      module: 'Inventory'
    },
    {
      id: '3',
      title: 'New Sale Recorded',
      message: 'A new sale of $8,999.25 has been recorded for Global Tech Solutions. Total revenue for this month has increased significantly.',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false,
      type: 'success',
      module: 'Sales'
    },
    {
      id: '4',
      title: 'System Update',
      message: 'New features have been added to the analytics dashboard including AI-powered insights, real-time monitoring, and advanced reporting capabilities.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'info',
      module: 'System'
    },
    {
      id: '5',
      title: 'Monthly Financial Report',
      message: 'Your monthly financial report is ready for review. Net cash flow shows positive trends with total income of $45,798.75.',
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'info',
      module: 'Finance'
    },
    {
      id: '6',
      title: 'Project Milestone Achieved',
      message: 'Website Redesign project has reached 75% completion. The project is on track to meet the deadline with budget utilization at 68%.',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      read: false,
      type: 'success',
      module: 'Projects'
    },
    {
      id: '7',
      title: 'Employee Performance Review Due',
      message: 'Performance reviews for 3 employees are due this week. Please complete the evaluations in the HR module.',
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'warning',
      module: 'HR'
    },
    {
      id: '8',
      title: 'High Expense Alert',
      message: 'Monthly expenses have reached 85% of total income. Review expense categories to identify potential cost optimization opportunities.',
      createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'warning',
      module: 'Finance'
    },
    {
      id: '9',
      title: 'Analytics Report Generated',
      message: 'Your weekly analytics report has been generated and is available for download. The report includes insights from all business modules.',
      createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'info',
      module: 'Analytics'
    },
    {
      id: '10',
      title: 'Backup Completed Successfully',
      message: 'Daily system backup has been completed successfully. All your data is securely backed up and protected.',
      createdAt: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'success',
      module: 'System'
    }
  ]);

  // Demo user data
  const [user, setUser] = useState({
    id: 'demo-user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    bio: 'Experienced business professional with expertise in operations and management.',
    role: 'Administrator',
    location: 'New York, USA',
    image: null,
    darkMode: false,
    compactView: false
  });

  // Demo company data
  const [company, setCompany] = useState({
    id: 'demo-company-1',
    name: 'Demo Company Inc.',
    industry: 'Technology',
    size: 'Medium'
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In demo mode, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setUser(prev => ({ ...prev, image: imageUrl as any }));
      
      toast.success('Profile picture updated successfully.');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      
      const firstName = (document.getElementById("firstName") as HTMLInputElement).value;
      const lastName = (document.getElementById("lastName") as HTMLInputElement).value;
      const bio = (document.getElementById("bio") as HTMLTextAreaElement).value;
      const role = (document.getElementById("role") as HTMLInputElement).value;
      const location = (document.getElementById("location") as HTMLInputElement).value;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser(prev => ({
        ...prev,
        firstName,
        lastName,
        bio,
        role,
        location,
      }));

      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCompany = async () => {
    try {
      setSaving(true);
      const name = (document.getElementById("company") as HTMLInputElement).value;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      setCompany(prev => ({ ...prev, name }));

      toast.success('Company information updated successfully.');
    } catch (error) {
      toast.error('Failed to update company information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setSaving(true);
      
      const currentPassword = (document.getElementById("currentPassword") as HTMLInputElement).value;
      const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
      const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;

      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error('Please fill in all password fields.');
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match.');
        return;
      }

      if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long.');
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Clear password fields
      (document.getElementById("currentPassword") as HTMLInputElement).value = '';
      (document.getElementById("newPassword") as HTMLInputElement).value = '';
      (document.getElementById("confirmPassword") as HTMLInputElement).value = '';

      toast.success('Password changed successfully.');
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleToggleDarkMode = (checked: boolean) => {
    setUser(prev => ({ ...prev, darkMode: checked }));
    toast.success(`Dark mode ${checked ? 'enabled' : 'disabled'}.`);
  };

  const handleToggleCompactView = (checked: boolean) => {
    setUser(prev => ({ ...prev, compactView: checked }));
    toast.success(`Compact view ${checked ? 'enabled' : 'disabled'}.`);
  };

  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || user.email[0].toUpperCase();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Inventory':
        return <Package className="h-3 w-3" />;
      case 'Sales':
        return <TrendingUp className="h-3 w-3" />;
      case 'Finance':
        return <DollarSign className="h-3 w-3" />;
      case 'HR':
        return <Users className="h-3 w-3" />;
      case 'Projects':
        return <FolderOpen className="h-3 w-3" />;
      case 'Analytics':
        return <BarChart3 className="h-3 w-3" />;
      case 'System':
        return <SettingsIcon className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  if (userLoading || companyLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your public profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.image || "/placeholder-avatar.jpg"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="picture">Profile Picture</Label>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    defaultValue={user?.firstName || ""}
                    placeholder="Enter your first name"
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName"
                    defaultValue={user?.lastName || ""}
                    placeholder="Enter your last name"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue={user?.bio || ""}
                  placeholder="Write something about yourself"
                  className="h-32"
                  disabled={saving}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company"
                    defaultValue={company?.name || ""}
                    placeholder="Company name"
                    disabled={saving}
                    onBlur={() => handleUpdateCompany()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role"
                    defaultValue={user?.role || ""}
                    placeholder="Your role"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  defaultValue={user?.location || ""}
                  placeholder="City, Country"
                  disabled={saving}
                />
              </div>

              <Button onClick={handleUpdateProfile} disabled={saving}>
                {saving ? "Saving..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  disabled={saving}
                />
              </div>
              <Button onClick={handleChangePassword} disabled={saving}>
                {saving ? "Changing..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    View your recent notifications and updates from all modules.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  >
                    Mark All Read
                  </Button>
                </div>
              </div>

              {/* Notification Statistics */}
              <div className="grid gap-4 md:grid-cols-4 mt-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {notifications.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {notifications.filter(n => !n.read).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Unread</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {notifications.filter(n => n.type === 'warning').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Warnings</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {notifications.filter(n => n.type === 'success').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Success</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {notificationLoading ? (
                <div className="text-center py-4">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 border ${
                        notification.read ? "bg-muted/50" : "bg-background"
                      } ${getNotificationBorderColor(notification.type)} cursor-pointer transition-colors hover:bg-muted/30`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-start justify-between space-x-4">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`text-sm font-medium ${
                                notification.read ? 'text-muted-foreground' : 'text-foreground'
                              }`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center space-x-1">
                                {getModuleIcon(notification.module)}
                                <span className="text-xs text-muted-foreground">
                                  {notification.module}
                                </span>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className={`text-sm ${
                              notification.read ? 'text-muted-foreground' : 'text-muted-foreground'
                            } leading-relaxed`}>
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <time className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </time>
                          <time className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </time>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notification Preferences */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive browser push notifications
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when inventory is running low
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sales Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts for new sales and milestones
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Financial Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about financial thresholds and reports
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about system updates and maintenance
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize your display preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark mode
                  </p>
                </div>
                <Switch
                  checked={user?.darkMode}
                  onCheckedChange={handleToggleDarkMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Use a more compact view for dense information
                  </p>
                </div>
                <Switch
                  checked={user?.compactView}
                  onCheckedChange={handleToggleCompactView}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10"><div className="text-center">Loading...</div></div>}>
      <SettingsContent />
    </Suspense>
  );
}
