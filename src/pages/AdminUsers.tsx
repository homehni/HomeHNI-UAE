import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, UserCheck, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  role: string;
  properties_count: number;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      // Get all properties with owner information directly from properties table
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('user_id, owner_name, owner_email, owner_phone, created_at')
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Get unique user IDs
      const uniqueUserIds = [...new Set(properties?.map(p => p.user_id) || [])];

      // Get property counts for each user
      const propertyCountMap = properties?.reduce((acc, prop) => {
        acc[prop.user_id] = (acc[prop.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Create user data by aggregating the most complete information for each user
      const usersData = uniqueUserIds.map((userId) => {
        const userProperties = properties?.filter(p => p.user_id === userId) || [];
        const firstPropertyDate = userProperties[userProperties.length - 1]?.created_at;

        // Find the property with the most complete owner information
        let bestProperty = userProperties[0]; // Start with most recent
        for (const property of userProperties) {
          if (property.owner_name && property.owner_email && property.owner_phone) {
            bestProperty = property;
            break; // Found a complete record
          }
          // If current best is missing info but this one has some, use this one
          if ((!bestProperty?.owner_name && property.owner_name) ||
              (!bestProperty?.owner_email && property.owner_email) ||
              (!bestProperty?.owner_phone && property.owner_phone)) {
            bestProperty = property;
          }
        }

        return {
          id: userId,
          name: bestProperty?.owner_name || 'Not Provided',
          email: bestProperty?.owner_email || 'Not Provided', 
          phone: bestProperty?.owner_phone || 'Not Provided',
          created_at: firstPropertyDate || new Date().toISOString(),
          role: 'user', // All property submitters are regular users
          properties_count: propertyCountMap[userId] || 0
        };
      });

      // Only filter out users where ALL information is missing
      const validUsers = usersData.filter(user => 
        user.name !== 'Not Provided' || user.email !== 'Not Provided' || user.phone !== 'Not Provided'
      );

      setUsers(validUsers);

      // Calculate stats
      const total = validUsers.length;
      const admins = 0; // No admins in this list
      const regularUsers = total;

      setStats({ total, admins, users: regularUsers });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Users Management</h1>
        <p className="text-muted-foreground">View and manage user accounts and roles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Property Owners</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.users}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {users.reduce((sum, user) => sum + user.properties_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Property Owners</CardTitle>
              <p className="text-sm text-muted-foreground">Users who have submitted property listings</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-muted-foreground font-medium">Name</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Email</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Phone</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Properties</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {user.phone}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {user.properties_count}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No property owners found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;