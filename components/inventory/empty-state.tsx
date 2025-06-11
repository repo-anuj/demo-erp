'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="rounded-full bg-muted p-4">
          <Package className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No inventory items yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start building your inventory by adding your first product. You can track stock levels, 
            manage categories, and monitor your business assets.
          </p>
        </div>
        <Button onClick={onAddClick} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Add First Product
        </Button>
      </CardContent>
    </Card>
  );
}
