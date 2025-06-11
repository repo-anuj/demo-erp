'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CalendarIcon, 
  Download, 
  Filter, 
  RefreshCw, 
  X,
  FileText,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';
import { format, subDays, subWeeks, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';

export interface FilterState {
  startDate?: Date;
  endDate?: Date;
  modules: string[];
  filters: Record<string, any>;
  pagination?: {
    page: number;
    pageSize: number;
  };
}

interface AnalyticsFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onExport: (format: 'csv' | 'json' | 'pdf') => void;
  isLoading?: boolean;
  data?: any;
  initialFilters?: FilterState;
}

const MODULE_OPTIONS = [
  { id: 'inventory', label: 'Inventory', description: 'Stock levels and product data' },
  { id: 'sales', label: 'Sales', description: 'Revenue and customer analytics' },
  { id: 'finance', label: 'Finance', description: 'Financial transactions and cash flow' },
  { id: 'employees', label: 'Employees', description: 'HR and workforce analytics' },
  { id: 'projects', label: 'Projects', description: 'Project progress and budgets' },
  { id: 'crossModuleAnalysis', label: 'Cross-Module', description: 'Business health insights' }
];

const DATE_PRESETS = [
  { label: 'Today', getValue: () => ({ start: new Date(), end: new Date() }) },
  { label: 'Yesterday', getValue: () => ({ start: subDays(new Date(), 1), end: subDays(new Date(), 1) }) },
  { label: 'Last 7 days', getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
  { label: 'Last 30 days', getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  { label: 'This month', getValue: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }) },
  { label: 'Last month', getValue: () => ({ 
    start: startOfMonth(subMonths(new Date(), 1)), 
    end: endOfMonth(subMonths(new Date(), 1)) 
  }) },
  { label: 'Last 3 months', getValue: () => ({ start: subMonths(new Date(), 3), end: new Date() }) },
  { label: 'Last 6 months', getValue: () => ({ start: subMonths(new Date(), 6), end: new Date() }) }
];

export function AnalyticsFilters({
  onFilterChange,
  onExport,
  isLoading = false,
  data,
  initialFilters
}: AnalyticsFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      startDate: subMonths(new Date(), 1),
      endDate: new Date(),
      modules: ['inventory', 'sales', 'finance', 'employees', 'projects', 'crossModuleAnalysis'],
      filters: {},
      pagination: { page: 1, pageSize: 50 }
    }
  );

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isModulePickerOpen, setIsModulePickerOpen] = useState(false);

  // Update parent when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleDatePreset = (preset: typeof DATE_PRESETS[0]) => {
    const { start, end } = preset.getValue();
    updateFilters({ startDate: start, endDate: end });
    setIsDatePickerOpen(false);
  };

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    const newModules = checked
      ? [...filters.modules, moduleId]
      : filters.modules.filter(id => id !== moduleId);
    
    updateFilters({ modules: newModules });
  };

  const handleSelectAllModules = () => {
    updateFilters({ modules: MODULE_OPTIONS.map(m => m.id) });
  };

  const handleDeselectAllModules = () => {
    updateFilters({ modules: [] });
  };

  const clearFilters = () => {
    setFilters({
      startDate: subMonths(new Date(), 1),
      endDate: new Date(),
      modules: ['inventory', 'sales', 'finance', 'employees', 'projects', 'crossModuleAnalysis'],
      filters: {},
      pagination: { page: 1, pageSize: 50 }
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.startDate || filters.endDate) count++;
    if (filters.modules.length !== MODULE_OPTIONS.length) count++;
    return count;
  };

  const hasData = data && (
    data.inventory?.items?.length > 0 ||
    data.sales?.transactions?.length > 0 ||
    data.finance?.transactions?.length > 0 ||
    data.employees?.employees?.length > 0 ||
    data.projects?.projects?.length > 0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Analytics Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFilterCount()} active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Filter and export your analytics data
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.startDate && !filters.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate && filters.endDate ? (
                    `${format(filters.startDate, "MMM dd")} - ${format(filters.endDate, "MMM dd")}`
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex">
                  <div className="border-r p-3 space-y-2">
                    <div className="text-sm font-medium">Quick Select</div>
                    {DATE_PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleDatePreset(preset)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  <div className="p-3">
                    <Calendar
                      mode="range"
                      selected={{
                        from: filters.startDate,
                        to: filters.endDate
                      }}
                      onSelect={(range) => {
                        updateFilters({
                          startDate: range?.from,
                          endDate: range?.to
                        });
                      }}
                      numberOfMonths={2}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Module Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Modules</label>
            <Popover open={isModulePickerOpen} onOpenChange={setIsModulePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="mr-2 h-4 w-4" />
                  {filters.modules.length === MODULE_OPTIONS.length
                    ? "All modules"
                    : `${filters.modules.length} selected`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Select Modules</div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAllModules}
                      >
                        All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeselectAllModules}
                      >
                        None
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {MODULE_OPTIONS.map((module) => (
                      <div key={module.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={module.id}
                          checked={filters.modules.includes(module.id)}
                          onCheckedChange={(checked) =>
                            handleModuleToggle(module.id, checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={module.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {module.label}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {module.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Page Size */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Page Size</label>
            <Select
              value={filters.pagination?.pageSize?.toString() || "50"}
              onValueChange={(value) =>
                updateFilters({
                  pagination: { ...filters.pagination!, pageSize: parseInt(value), page: 1 }
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select page size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
                <SelectItem value="200">200 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Data</label>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('csv')}
                disabled={isLoading || !hasData}
                className="flex-1"
              >
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('json')}
                disabled={isLoading || !hasData}
                className="flex-1"
              >
                <FileJson className="h-4 w-4 mr-1" />
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('pdf')}
                disabled={isLoading || !hasData}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.startDate || filters.endDate || filters.modules.length !== MODULE_OPTIONS.length) && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {filters.startDate && filters.endDate && (
                <Badge variant="secondary">
                  {format(filters.startDate, "MMM dd")} - {format(filters.endDate, "MMM dd")}
                </Badge>
              )}
              {filters.modules.length !== MODULE_OPTIONS.length && (
                <Badge variant="secondary">
                  {filters.modules.length === 0
                    ? "No modules"
                    : `${filters.modules.length}/${MODULE_OPTIONS.length} modules`}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
