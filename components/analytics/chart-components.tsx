'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Color palette for charts
export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#14B8A6', // Teal
  '#F43F5E'  // Rose
];

// Value formatters
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Loading skeleton for charts
export const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div className="space-y-3">
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className={`h-[${height}px] w-full`} />
  </div>
);

// Bar Chart Component
interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  description?: string;
  height?: number;
  color?: string;
  formatter?: (value: number) => string;
  isLoading?: boolean;
}

export const CustomBarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  title,
  description,
  height = 300,
  color = CHART_COLORS[0],
  formatter = formatNumber,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ChartSkeleton height={height} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis tickFormatter={formatter} />
            <Tooltip content={<CustomTooltip formatter={formatter} />} />
            <Bar dataKey={yKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Pie Chart Component
interface PieChartProps {
  data: any[];
  nameKey: string;
  valueKey: string;
  title?: string;
  description?: string;
  height?: number;
  formatter?: (value: number) => string;
  isLoading?: boolean;
}

export const CustomPieChart: React.FC<PieChartProps> = ({
  data,
  nameKey,
  valueKey,
  title,
  description,
  height = 300,
  formatter = formatNumber,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ChartSkeleton height={height} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={valueKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [formatter(value as number), valueKey]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Line Chart Component
interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  description?: string;
  height?: number;
  color?: string;
  formatter?: (value: number) => string;
  isLoading?: boolean;
}

export const CustomLineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  title,
  description,
  height = 300,
  color = CHART_COLORS[0],
  formatter = formatNumber,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ChartSkeleton height={height} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis tickFormatter={formatter} />
            <Tooltip content={<CustomTooltip formatter={formatter} />} />
            <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Area Chart Component
interface AreaChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  description?: string;
  height?: number;
  color?: string;
  formatter?: (value: number) => string;
  isLoading?: boolean;
}

export const CustomAreaChart: React.FC<AreaChartProps> = ({
  data,
  xKey,
  yKey,
  title,
  description,
  height = 300,
  color = CHART_COLORS[0],
  formatter = formatNumber,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ChartSkeleton height={height} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis tickFormatter={formatter} />
            <Tooltip content={<CustomTooltip formatter={formatter} />} />
            <Area type="monotone" dataKey={yKey} stroke={color} fill={color} fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Multi-Line Chart Component
interface MultiLineChartProps {
  data: any[];
  xKey: string;
  lines: { key: string; name: string; color?: string }[];
  title?: string;
  description?: string;
  height?: number;
  formatter?: (value: number) => string;
  isLoading?: boolean;
}

export const MultiLineChart: React.FC<MultiLineChartProps> = ({
  data,
  xKey,
  lines,
  title,
  description,
  height = 300,
  formatter = formatNumber,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ChartSkeleton height={height} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis tickFormatter={formatter} />
            <Tooltip content={<CustomTooltip formatter={formatter} />} />
            <Legend />
            {lines.map((line, index) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color || CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
                name={line.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Stacked Bar Chart Component
interface StackedBarChartProps {
  data: any[];
  xKey: string;
  bars: { key: string; name: string; color?: string }[];
  title?: string;
  description?: string;
  height?: number;
  formatter?: (value: number) => string;
  isLoading?: boolean;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  xKey,
  bars,
  title,
  description,
  height = 300,
  formatter = formatNumber,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ChartSkeleton height={height} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis tickFormatter={formatter} />
            <Tooltip content={<CustomTooltip formatter={formatter} />} />
            <Legend />
            {bars.map((bar, index) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                stackId="a"
                fill={bar.color || CHART_COLORS[index % CHART_COLORS.length]}
                name={bar.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Radar Chart Component
interface RadarChartProps {
  data: any[];
  title?: string;
  description?: string;
  height?: number;
  isLoading?: boolean;
}

export const CustomRadarChart: React.FC<RadarChartProps> = ({
  data,
  title,
  description,
  height = 300,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ChartSkeleton height={height} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar
              name="Value"
              dataKey="value"
              stroke={CHART_COLORS[0]}
              fill={CHART_COLORS[0]}
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
