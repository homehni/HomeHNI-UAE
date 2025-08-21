import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProperties: 0,
    totalLeads: 0,
    pendingProperties: 0,
    newLeads: 0,
    monthlyGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
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

      setStats({
        totalUsers: usersResult.count || 0,
        totalProperties: propertiesResult.count || 0,
        totalLeads: leadsResult.count || 0,
        pendingProperties,
        newLeads,
        monthlyGrowth: 12.5, // Mock data - replace with real calculation
      });

      // Mock recent activity data
      setRecentActivity([
        {
          id: '1',
          type: 'user_registered',
          description: 'New user registered',
          timestamp: '2 hours ago',
          user: 'john.doe@example.com',
        },
        {
          id: '2',
          type: 'property_listed',
          description: 'New property listing submitted',
          timestamp: '4 hours ago',
          user: 'agent.smith@example.com',
        },
        {
          id: '3',
          type: 'lead_generated',
          description: 'New lead for luxury apartment',
          timestamp: '6 hours ago',
        },
        {
          id: '4',
          type: 'property_approved',
          description: 'Property listing approved',
          timestamp: '1 day ago',
          user: 'admin',
        },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error Loading Dashboard',
        description: 'Failed to load dashboard statistics.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your platform.
        </p>
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