import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    deleted: number;
  };
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Listings',
      value: stats.total,
      icon: FileText,
      color: 'text-primary'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600'
    },
    {
      title: 'Deleted',
      value: stats.deleted,
      icon: Trash2,
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};