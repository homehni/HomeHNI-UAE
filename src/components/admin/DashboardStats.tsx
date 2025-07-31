import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    deleted: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Properties',
      value: stats.total,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      change: '+5%',
      changeType: 'neutral' as const,
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: '+18%',
      changeType: 'positive' as const,
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      change: '-8%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <Card 
          key={index} 
          className={cn(
            "transition-all duration-200 hover:shadow-md hover:-translate-y-1",
            item.borderColor,
            "border-l-4"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={cn("rounded-lg p-2.5", item.bgColor)}>
              <item.icon className={cn("h-4 w-4", item.color)} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold text-foreground">
              {item.value.toLocaleString()}
            </div>
            <div className="flex items-center text-xs">
              {item.changeType === 'positive' ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <AlertTriangle className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={cn(
                "font-medium",
                item.changeType === 'positive' ? "text-green-600" : "text-red-600"
              )}>
                {item.change}
              </span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};