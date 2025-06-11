'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, RefreshCw, Plus, TrendingUp } from 'lucide-react';

interface EmptyAnalyticsProps {
  onRefresh?: () => void;
}

export function EmptyAnalytics({ onRefresh }: EmptyAnalyticsProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <BarChart3 className="h-12 w-12 text-primary" />
        </div>
        
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-xl font-semibold">No Analytics Data Available</h3>
          <p className="text-muted-foreground">
            Start by adding some data to your inventory, sales, or finance modules to see comprehensive analytics and insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          )}
          <Button onClick={() => window.location.href = '/inventory'}>
            <Plus className="mr-2 h-4 w-4" />
            Add Inventory
          </Button>
          <Button onClick={() => window.location.href = '/sales'}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Record Sales
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Analytics will automatically update as you add more business data</p>
        </div>
      </CardContent>
    </Card>
  );
}
