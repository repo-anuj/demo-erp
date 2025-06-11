'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Clock, DollarSign, Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useDemo } from '@/contexts/demo-context';
import { Project } from '@/components/projects/columns';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, isAuthenticated } = useDemo();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchProject = async () => {
      setIsLoading(true);
      try {
        // Find project in demo data
        const foundProject = projects.find((p: any) => p.id === params.id);
        
        if (!foundProject) {
          toast({
            title: 'Error',
            description: 'Project not found',
            variant: 'destructive',
          });
          router.push('/projects');
          return;
        }

        // Format project data to match expected structure
        const formattedProject: Project = {
          ...foundProject,
          tasks: foundProject.tasks || [],
          milestones: foundProject.milestones || [],
          teamMembers: foundProject.teamMembers || [],
          tags: foundProject.tags || [],
          createdAt: foundProject.createdAt || new Date().toISOString(),
          updatedAt: foundProject.updatedAt || new Date().toISOString()
        };

        setProject(formattedProject);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project. Please try again.',
          variant: 'destructive',
        });
        router.push('/projects');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id, projects, isAuthenticated, router, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'on_hold': return 'outline';
      case 'cancelled': return 'destructive';
      case 'planning': return 'outline';
      default: return 'outline';
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

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-center items-center h-[400px]">
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-center items-center h-[400px]">
          <p>Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{project.name}</h2>
            <p className="text-muted-foreground">{project.type.charAt(0).toUpperCase() + project.type.slice(1)} Project</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getStatusColor(project.status)}>
            {project.status.replace('_', ' ')}
          </Badge>
          <Badge variant={getPriorityColor(project.priority)}>
            {project.priority} priority
          </Badge>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{project.completionPercentage}%</div>
              <Progress value={project.completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(project.budget)}</div>
            <p className="text-xs text-muted-foreground">
              Spent: {formatCurrency(project.expenses)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.teamMembers.length + 1}</div>
            <p className="text-xs text-muted-foreground">
              Including manager
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(project.endDate)}</div>
            <p className="text-xs text-muted-foreground">
              {new Date(project.endDate) < new Date() && project.status !== 'completed' ? (
                <span className="text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Overdue
                </span>
              ) : (
                'On track'
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({project.tasks.length})</TabsTrigger>
          <TabsTrigger value="milestones">Milestones ({project.milestones.length})</TabsTrigger>
          <TabsTrigger value="team">Team ({project.teamMembers.length + 1})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{project.description || 'No description available'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p className="text-sm">{formatDate(project.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p className="text-sm">{formatDate(project.endDate)}</p>
                  </div>
                </div>

                {project.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-sm whitespace-pre-line">{project.notes}</p>
                  </div>
                )}

                {project.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {project.client && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Client Name</p>
                    <p className="text-sm">{project.client.name}</p>
                  </div>
                  {project.client.company && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Company</p>
                      <p className="text-sm">{project.client.company}</p>
                    </div>
                  )}
                  {project.client.email && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{project.client.email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {project.tasks.length > 0 ? (
            <div className="space-y-3">
              {project.tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">{task.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Assigned to: {task.assigneeName}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{task.status.replace('_', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center gap-2">
                      <Progress value={task.completionPercentage} className="h-2" />
                      <span className="text-xs">{task.completionPercentage}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                <p className="text-muted-foreground text-center">
                  Tasks will appear here once they are added to this project.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {project.milestones.length > 0 ? (
            <div className="space-y-3">
              {project.milestones.map((milestone) => (
                <Card key={milestone.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">{milestone.name}</CardTitle>
                      <Badge variant="outline">{milestone.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Target: {formatDate(milestone.targetDate)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No milestones yet</h3>
                <p className="text-muted-foreground text-center">
                  Milestones will appear here once they are added to this project.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Project Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">{project.projectManager.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{project.projectManager.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.projectManager.role} • {project.projectManager.department}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {project.teamMembers.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.role} • {member.department}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No team members</h3>
                  <p className="text-muted-foreground text-center">
                    Only the project manager is assigned to this project.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
