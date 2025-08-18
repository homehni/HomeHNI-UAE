import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalProperties: number;
  totalLeads: number;
  propertyStatusBreakdown: { status: string; count: number; }[];
  userRoleBreakdown: { role: string; count: number; }[];
  monthlySignups: { month: string; count: number; }[];
  monthlyListings: { month: string; count: number; }[];
  topCities: { city: string; count: number; }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch basic counts
      const [usersResult, propertiesResult, leadsResult] = await Promise.all([
        supabase.from('profiles').select('id, user_id', { count: 'exact' }),
        supabase.from('properties').select('id', { count: 'exact' }),
        supabase.from('leads').select('id', { count: 'exact' })
      ]);

      // Fetch property status breakdown
      const { data: propertyStatuses } = await supabase
        .from('properties')
        .select('status')
        .neq('status', 'deleted');

      // Fetch user roles breakdown
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role');

      // Fetch monthly data
      const { data: monthlyUsers } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString());

      const { data: monthlyProperties } = await supabase
        .from('properties')
        .select('created_at')
        .gte('created_at', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString());

      // Fetch top cities
      const { data: cities } = await supabase
        .from('properties')
        .select('city')
        .neq('status', 'deleted');

      // Process data
      const statusBreakdown = propertyStatuses?.reduce((acc: any[], prop: any) => {
        const existing = acc.find(item => item.status === prop.status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ status: prop.status, count: 1 });
        }
        return acc;
      }, []) || [];

      const roleBreakdown = userRoles?.reduce((acc: any[], role: any) => {
        const existing = acc.find(item => item.role === role.role);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ role: role.role, count: 1 });
        }
        return acc;
      }, []) || [];

      // Process monthly data
      const monthlySignups = processMonthlyData(monthlyUsers || []);
      const monthlyListings = processMonthlyData(monthlyProperties || []);

      // Process top cities
      const cityBreakdown = cities?.reduce((acc: any[], prop: any) => {
        const existing = acc.find(item => item.city === prop.city);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ city: prop.city, count: 1 });
        }
        return acc;
      }, []) || [];

      const topCities = cityBreakdown
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setAnalytics({
        totalUsers: usersResult.count || 0,
        totalProperties: propertiesResult.count || 0,
        totalLeads: leadsResult.count || 0,
        propertyStatusBreakdown: statusBreakdown,
        userRoleBreakdown: roleBreakdown,
        monthlySignups,
        monthlyListings,
        topCities
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (data: any[]) => {
    const monthlyData: { [key: string]: number } = {};
    
    data.forEach(item => {
      const date = new Date(item.created_at);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Reports</h1>
        <p className="text-muted-foreground">Platform performance insights and metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics.totalProperties.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics.totalLeads.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Property Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Property Status Distribution</CardTitle>
                <CardDescription>Current status of all properties</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.propertyStatusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                    >
                      {analytics.propertyStatusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Role Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>User Role Distribution</CardTitle>
                <CardDescription>Breakdown by user roles</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.userRoleBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Monthly Signups */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly User Signups</CardTitle>
                <CardDescription>User registration trends over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.monthlySignups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Listings */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Property Listings</CardTitle>
                <CardDescription>Property listing trends over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.monthlyListings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--secondary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Cities by Listings</CardTitle>
              <CardDescription>Cities with the most property listings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.topCities} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="city" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};