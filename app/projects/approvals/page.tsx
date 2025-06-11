'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/contexts/demo-context';

interface TaskApproval {
  id: string;
  taskName: string;
  projectName: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  dueDate: string;
}

export default function TaskApprovalsPage() {
  const { user, isAuthenticated } = useDemo();
  const [approvals, setApprovals] = useState<TaskApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const { toast } = useToast();
  const router = useRouter();

  // Demo data for task approvals
  const demoApprovals: TaskApproval[] = [
    {
      id: 'approval-1',
      taskName: 'Database Migration',
      projectName: 'rgonomic',
      requestedBy: 'Anuj Dubey',
      requestedAt: '2024-01-15T10:30:00Z',
      status: 'pending',
      description: 'Migrate user data to new database schema',
      priority: 'high',
      estimatedHours: 16,
      dueDate: '2024-01-20'
    },
    {
      id: 'approval-2',
      taskName: 'UI Component Updates',
      projectName: 'web app',
      requestedBy: 'nigga nigga',
      requestedAt: '2024-01-14T14:20:00Z',
      status: 'approved',
      description: 'Update existing UI components to match new design system',
      priority: 'medium',
      estimatedHours: 8,
      dueDate: '2024-01-18'
    },
    {
      id: 'approval-3',
      taskName: 'API Integration',
      projectName: 'chating APP',
      requestedBy: 'shubham Dha',
      requestedAt: '2024-01-13T09:15:00Z',
      status: 'pending',
      description: 'Integrate third-party messaging API',
      priority: 'high',
      estimatedHours: 12,
      dueDate: '2024-01-22'
    },
    {
      id: 'approval-4',
      taskName: 'Performance Optimization',
      projectName: 'Delivery app',
      requestedBy: 'Anuj Dubey',
      requestedAt: '2024-01-12T16:45:00Z',
      status: 'rejected',
      description: 'Optimize delivery route calculation algorithm',
      priority: 'low',
      estimatedHours: 20,
      dueDate: '2024-01-25'
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchApprovals = async () => {
      setIsLoading(true);
      try {
        // Use demo data
        setApprovals(demoApprovals);
        
        // Calculate stats
        const statsData = {
          total: demoApprovals.length,
          pending: demoApprovals.filter(a => a.status === 'pending').length,
          approved: demoApprovals.filter(a => a.status === 'approved').length,
          rejected: demoApprovals.filter(a => a.status === 'rejected').length,
        };
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching approvals:', error);
        toast({
          title: 'Error',
          description: 'Failed to load task approvals. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovals();
  }, [isAuthenticated, router, toast]);

  const handleApproval = async (id: string, action: 'approve' | 'reject') => {
    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      setApprovals(prev => prev.map(approval => 
        approval.id === id 
          ? { ...approval, status: action === 'approve' ? 'approved' : 'rejected' }
          : approval
      ));

      // Update stats
      const updatedApprovals = approvals.map(approval => 
        approval.id === id 
          ? { ...approval, status: action === 'approve' ? 'approved' : 'rejected' }
          : approval
      );
      
      const statsData = {
        total: updatedApprovals.length,
        pending: updatedApprovals.filter(a => a.status === 'pending').length,
        approved: updatedApprovals.filter(a => a.status === 'approved').length,
        rejected: updatedApprovals.filter(a => a.status === 'rejected').length,
      };
      setStats(statsData);

      toast({
        title: 'Success',
        description: `Task ${action === 'approve' ? 'approved' : 'rejected'} successfully (demo mode)`,
      });
    } catch (error) {
      console.error('Error updating approval:', error);
      toast({
        title: 'Error',
        description: 'Failed to update approval. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.push('/projects')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Task Approvals</h2>
            <p className="text-muted-foreground">Review and approve task requests from team members</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <p>Loading approvals...</p>
          </div>
        ) : approvals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No pending approvals</h3>
              <p className="text-muted-foreground text-center">
                All task requests have been reviewed. New requests will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          approvals.map((approval) => (
            <Card key={approval.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{approval.taskName}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Project: {approval.projectName}</span>
                      <span>•</span>
                      <span>Requested by: {approval.requestedBy}</span>
                      <span>•</span>
                      <span>{formatDate(approval.requestedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(approval.priority)}>
                      {approval.priority}
                    </Badge>
                    <Badge variant={getStatusColor(approval.status)}>
                      {approval.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">{approval.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Estimated Hours:</span> {approval.estimatedHours}h
                    </div>
                    <div>
                      <span className="font-medium">Due Date:</span> {new Date(approval.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  {approval.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproval(approval.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApproval(approval.id, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
