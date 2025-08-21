import { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Building2,
  MessageSquare,
  TrendingUp,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalLeads: number;
  pendingProperties: number;
  newLeads: number;
  monthlyGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'property_listed' | 'lead_generated' | 'property_approved';
  description: string;
  timestamp: string;
  user?: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Optimized data fetching with React Query and caching
  const fetchDashboardStats = useCallback(async () => {
    const [usersResult, propertiesResult, leadsResult] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('properties').select('id, status', { count: 'exact' }),
      supabase.from('leads').select('id, status, created_at', { count: 'exact' }),
    ]);

    if (usersResult.error) throw usersResult.error;
    if (propertiesResult.error) throw propertiesResult.error;
    if (leadsResult.error) throw leadsResult.error;

    const pendingProperties = propertiesResult.data?.filter(p => p.status === 'pending').length || 0;
    const newLeads = leadsResult.data?.filter(l => l.status === 'new').length || 0;

    return {
      totalUsers: usersResult.count || 0,
      totalProperties: propertiesResult.count || 0,
      totalLeads: leadsResult.count || 0,
      pendingProperties,
      newLeads,
      monthlyGrowth: 12.5, // Mock data - replace with real calculation
    };
  }, []);

  // React Query for caching and background refetching
  const { 
    data: stats = {
      totalUsers: 0,
      totalProperties: 0,
      totalLeads: 0,
      pendingProperties: 0,
      newLeads: 0,
      monthlyGrowth: 0,
    }, 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    refetchInterval: 60000, // Auto-refetch every minute
    refetchOnWindowFocus: true,
    retry: 2,
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error Loading Dashboard',
        description: 'Failed to load dashboard statistics.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Mock recent activity data - in a real app, this would also use React Query
  const recentActivity = useMemo(() => [
    {
      id: '1',
      type: 'user_registered' as const,
      description: 'New user registered',
      timestamp: '2 hours ago',
      user: 'john.doe@example.com',
    },
    {
      id: '2',
      type: 'property_listed' as const,
      description: 'New property listing submitted',
      timestamp: '4 hours ago',
      user: 'agent.smith@example.com',
    },
    {
      id: '3',
      type: 'lead_generated' as const,
      description: 'New lead for luxury apartment',
      timestamp: '6 hours ago',
    },
    {
      id: '4',
      type: 'property_approved' as const,
      description: 'Property listing approved',
      timestamp: '1 day ago',
      user: 'admin',
    },
  ], []);

  // Real-time subscriptions for live updates
  useEffect(() => {
    const channels = [
      supabase
        .channel('admin-dashboard-properties')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'properties' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
          }
        )
        .subscribe(),

      supabase
        .channel('admin-dashboard-profiles')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'profiles' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
          }
        )
        .subscribe(),

      supabase
        .channel('admin-dashboard-leads')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'leads' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
          }
        )
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [queryClient]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registered':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'property_listed':
        return <Building2 className="h-4 w-4 text-green-500" />;
      case 'lead_generated':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'property_approved':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Monthly Growth',
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const actionItems = [
    {
      title: 'Pending Properties',
      count: stats.pendingProperties,
      action: 'Review',
      href: '/admin/listings',
      urgent: stats.pendingProperties > 0,
    },
    {
      title: 'New Leads',
      count: stats.newLeads,
      action: 'Manage',
      href: '/admin/leads',
      urgent: stats.newLeads > 5,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="ml-4 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Lower section skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="h-4 w-4 mt-1" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
              Requires Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {actionItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-gray-600">
                      {item.count} {item.count === 1 ? 'item' : 'items'} pending
                    </p>
                  </div>
                  {item.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = item.href}
                >
                  {item.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                    )}
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => window.location.href = '/admin/users'}
            >
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => window.location.href = '/admin/listings'}
            >
              <Building2 className="h-6 w-6" />
              <span>Review Listings</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => window.location.href = '/admin/analytics'}
            >
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;