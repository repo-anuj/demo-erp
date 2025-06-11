'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, BarChart3 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
  showSkeleton?: boolean;
}

export function LoadingIndicator({ 
  message = "Loading analytics data...", 
  showSkeleton = false 
}: LoadingIndicatorProps) {
  if (showSkeleton) {
    return (
      <div className="space-y-6">
        {/* Skeleton for metrics cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-4 w-[120px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton for charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[300px] mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[300px] mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Skeleton for table */}
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-[200px] mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="relative">
            <BarChart3 className="h-12 w-12 text-primary" />
            <Loader2 className="h-6 w-6 text-primary animate-spin absolute -top-1 -right-1" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">Processing Analytics</h3>
          <p className="text-muted-foreground">{message}</p>
        </div>

        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </CardContent>
    </Card>
  );
}
