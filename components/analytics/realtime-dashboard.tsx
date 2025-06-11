'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Clock
} from 'lucide-react';
import { formatCurrency, formatNumber } from './chart-components';

interface RealtimeDashboardProps {
  data: any;
  isLoading?: boolean;
  onRefresh?: () => void;
}

interface RealtimeMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  unit: 'currency' | 'number' | 'percentage';
  icon: any;
  color: string;
}

export function RealtimeDashboard({ data, isLoading = false, onRefresh }: RealtimeDashboardProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [metrics, setMetrics] = useState<RealtimeMetric[]>([]);

  // Simulate real-time connection status
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection issues
      const shouldDisconnect = Math.random() < 0.05; // 5% chance
      setIsConnected(!shouldDisconnect);
      
      if (!shouldDisconnect) {
        setLastUpdated(new Date());
        updateMetrics();
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [data]);

  // Update metrics with simulated real-time changes
  const updateMetrics = () => {
    if (!data) return;

    const newMetrics: RealtimeMetric[] = [
      {
        id: 'revenue',
        label: 'Total Revenue',
        value: (data.sales?.metrics?.totalRevenue || 0) + Math.random() * 1000,
        previousValue: data.sales?.metrics?.totalRevenue || 0,
        change: Math.random() * 10 - 5, // -5% to +5%
        changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
        unit: 'currency',
        icon: DollarSign,
        color: 'text-green-600'
      },
      {
        id: 'inventory-value',
        label: 'Inventory Value',
        value: (data.inventory?.metrics?.totalValue || 0) + Math.random() * 500,
        previousValue: data.inventory?.metrics?.totalValue || 0,
        change: Math.random() * 5 - 2.5, // -2.5% to +2.5%
        changeType: Math.random() > 0.6 ? 'increase' : 'decrease',
        unit: 'currency',
        icon: Package,
        color: 'text-blue-600'
      },
      {
        id: 'active-users',
        label: 'Active Users',
        value: Math.floor(Math.random() * 50) + 10,
        previousValue: Math.floor(Math.random() * 45) + 8,
        change: Math.random() * 20 - 10, // -10% to +10%
        changeType: Math.random() > 0.4 ? 'increase' : 'decrease',
        unit: 'number',
        icon: Users,
        color: 'text-purple-600'
      },
      {
        id: 'conversion-rate',
        label: 'Conversion Rate',
        value: Math.random() * 10 + 2, // 2% to 12%
        previousValue: Math.random() * 9 + 2,
        change: Math.random() * 2 - 1, // -1% to +1%
        changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
        unit: 'percentage',
        icon: TrendingUp,
        color: 'text-orange-600'
      }
    ];

    setMetrics(newMetrics);
  };

  // Initialize metrics
  useEffect(() => {
    updateMetrics();
  }, [data]);

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return formatNumber(value);
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Activity className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Real-time Dashboard
            </CardTitle>
            <CardDescription>
              Live business metrics and performance indicators
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  Disconnected
                </>
              )}
            </Badge>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs text-muted-foreground">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Real-time Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => {
              const IconComponent = metric.icon;
              return (
                <div key={metric.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${metric.color}`} />
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                    {getChangeIcon(metric.changeType)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {formatValue(metric.value, metric.unit)}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">
                        vs {formatValue(metric.previousValue, metric.unit)}
                      </span>
                      <Badge 
                        variant={metric.changeType === 'increase' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {metric.changeType === 'increase' ? '+' : ''}{metric.change.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Activity Feed */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live Activity Feed
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {[
                { time: '2 min ago', event: 'New sale recorded', amount: '$1,250', type: 'sale' },
                { time: '5 min ago', event: 'Inventory updated', amount: '15 items', type: 'inventory' },
                { time: '8 min ago', event: 'Payment received', amount: '$850', type: 'payment' },
                { time: '12 min ago', event: 'New customer registered', amount: '', type: 'customer' },
                { time: '15 min ago', event: 'Stock alert triggered', amount: '3 items low', type: 'alert' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'sale' ? 'bg-green-500' :
                      activity.type === 'inventory' ? 'bg-blue-500' :
                      activity.type === 'payment' ? 'bg-purple-500' :
                      activity.type === 'customer' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    <span>{activity.event}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.amount && (
                      <Badge variant="outline" className="text-xs">
                        {activity.amount}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-green-600">99.9%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-blue-600">45ms</div>
              <div className="text-xs text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {isConnected ? metrics.length : 0}
              </div>
              <div className="text-xs text-muted-foreground">Active Metrics</div>
            </div>
          </div>

          {!isConnected && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <WifiOff className="h-4 w-4" />
                <span className="font-medium">Connection Lost</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Real-time updates are temporarily unavailable. Data will sync when connection is restored.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
