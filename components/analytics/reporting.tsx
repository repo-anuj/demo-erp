'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  BarChart3,
  PieChart,
  TrendingUp,
  Settings,
  Play,
  Pause,
  Plus
} from 'lucide-react';
import { formatCurrency, formatNumber } from './chart-components';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface ReportingProps {
  aggregatedData: any;
  isLoading?: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'sales' | 'inventory' | 'comprehensive';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  format: 'pdf' | 'excel' | 'csv';
  lastGenerated?: Date;
  isActive: boolean;
}

interface ScheduledReport {
  id: string;
  templateId: string;
  name: string;
  schedule: string;
  nextRun: Date;
  status: 'active' | 'paused' | 'error';
  recipients: string[];
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedAt: Date;
  size: string;
  format: string;
  downloadUrl: string;
}

export function Reporting({ aggregatedData, isLoading = false }: ReportingProps) {
  const [activeTab, setActiveTab] = useState('templates');

  // Demo report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'financial-summary',
      name: 'Financial Summary Report',
      description: 'Comprehensive financial overview including P&L, cash flow, and expense analysis',
      type: 'financial',
      frequency: 'monthly',
      format: 'pdf',
      lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: 'sales-performance',
      name: 'Sales Performance Report',
      description: 'Detailed sales analytics with customer insights and revenue trends',
      type: 'sales',
      frequency: 'weekly',
      format: 'excel',
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: 'inventory-status',
      name: 'Inventory Status Report',
      description: 'Stock levels, low inventory alerts, and category analysis',
      type: 'inventory',
      frequency: 'daily',
      format: 'csv',
      lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: 'business-overview',
      name: 'Business Overview Report',
      description: 'Executive summary with key metrics across all business areas',
      type: 'comprehensive',
      frequency: 'quarterly',
      format: 'pdf',
      lastGenerated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isActive: false
    }
  ];

  // Demo scheduled reports
  const scheduledReports: ScheduledReport[] = [
    {
      id: 'schedule-1',
      templateId: 'financial-summary',
      name: 'Monthly Financial Report',
      schedule: 'First Monday of each month',
      nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'active',
      recipients: ['cfo@company.com', 'accounting@company.com']
    },
    {
      id: 'schedule-2',
      templateId: 'sales-performance',
      name: 'Weekly Sales Report',
      schedule: 'Every Monday at 9:00 AM',
      nextRun: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      status: 'active',
      recipients: ['sales@company.com', 'manager@company.com']
    },
    {
      id: 'schedule-3',
      templateId: 'inventory-status',
      name: 'Daily Inventory Report',
      schedule: 'Every day at 6:00 AM',
      nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000),
      status: 'paused',
      recipients: ['warehouse@company.com']
    }
  ];

  // Demo generated reports
  const generatedReports: GeneratedReport[] = [
    {
      id: 'report-1',
      name: 'Financial Summary - November 2024',
      type: 'Financial',
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      size: '2.4 MB',
      format: 'PDF',
      downloadUrl: '#'
    },
    {
      id: 'report-2',
      name: 'Sales Performance - Week 45',
      type: 'Sales',
      generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      size: '1.8 MB',
      format: 'Excel',
      downloadUrl: '#'
    },
    {
      id: 'report-3',
      name: 'Inventory Status - Today',
      type: 'Inventory',
      generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      size: '456 KB',
      format: 'CSV',
      downloadUrl: '#'
    },
    {
      id: 'report-4',
      name: 'Business Overview - Q3 2024',
      type: 'Comprehensive',
      generatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      size: '5.2 MB',
      format: 'PDF',
      downloadUrl: '#'
    }
  ];

  const handleGenerateReport = (templateId: string) => {
    toast.success('Demo Mode: Report generation started');
    console.log('Generating report for template:', templateId);
  };

  const handleDownloadReport = (reportId: string) => {
    toast.success('Demo Mode: Report download started');
    console.log('Downloading report:', reportId);
  };

  const handleToggleSchedule = (scheduleId: string) => {
    toast.success('Demo Mode: Schedule status updated');
    console.log('Toggling schedule:', scheduleId);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return <BarChart3 className="h-4 w-4 text-green-600" />;
      case 'sales':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'inventory':
        return <PieChart className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
        </TabsList>

        {/* Report Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report Templates</CardTitle>
                  <CardDescription>
                    Pre-configured report templates for different business needs
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(template.type)}
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                        </div>
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Frequency:</span>
                          <div className="font-medium capitalize">{template.frequency}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Format:</span>
                          <div className="font-medium uppercase">{template.format}</div>
                        </div>
                      </div>
                      
                      {template.lastGenerated && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Last Generated:</span>
                          <div className="font-medium">
                            {template.lastGenerated.toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleGenerateReport(template.id)}
                          disabled={isLoading}
                        >
                          <Play className="mr-2 h-3 w-3" />
                          Generate Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-3 w-3" />
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Reports */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>
                    Automated report generation and delivery schedules
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Next Run</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledReports.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">{schedule.name}</TableCell>
                        <TableCell>{schedule.schedule}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {schedule.nextRun.toLocaleDateString()} at{' '}
                            {schedule.nextRun.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {schedule.recipients.length} recipient{schedule.recipients.length !== 1 ? 's' : ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleSchedule(schedule.id)}
                            >
                              {schedule.status === 'active' ? (
                                <Pause className="h-3 w-3" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generated Reports */}
        <TabsContent value="generated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Previously generated reports available for download
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(report.type.toLowerCase())}
                            {report.type}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {report.generatedAt.toLocaleDateString()} at{' '}
                            {report.generatedAt.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{report.size}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.format}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReport(report.id)}
                          >
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
