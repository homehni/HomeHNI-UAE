import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, UserCheck, ShieldCheck, Building, Filter, Trash2, Plus, UserCog, Settings2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AddUserModal } from '@/components/admin/AddUserModal';

interface User {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  role: string;
  property_roles: string[]; // All roles used when posting properties
  properties_count: number;
  verification_status: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    property_owners: 0,
    admins: 0,
    buyers: 0,
    sellers: 0,
    content_managers: 0,
    active_listings: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    
    // Set up real-time subscriptions for immediate updates
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profiles table changed:', payload);
          fetchUsers();
        }
      )
      .subscribe();

    const userRolesChannel = supabase
      .channel('user-roles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles'
        },
        (payload) => {
          console.log('User roles changed:', payload);
          fetchUsers();
        }
      )
      .subscribe();

    const propertiesChannel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        (payload) => {
          console.log('Properties table changed:', payload);
          fetchUsers();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(userRolesChannel);
      supabase.removeChannel(propertiesChannel);
    };
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      // Get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          full_name,
          phone,
          verification_status,
          created_at
        `);

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: userRolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get auth users data for email
      const { data: authUsers, error: authError } = await supabase
        .rpc('get_user_profiles');

      if (authError) throw authError;

      // Get property counts and owner roles for each user
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('user_id, owner_role');

      if (propError) throw propError;

      const propertyCountMap = properties?.reduce((acc, prop) => {
        acc[prop.user_id] = (acc[prop.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Create property roles map (all distinct roles used by each user when posting properties)
      const propertyRolesMap = properties?.reduce((acc, prop) => {
        if (!acc[prop.user_id]) {
          acc[prop.user_id] = [];
        }
        if (prop.owner_role && !acc[prop.user_id].includes(prop.owner_role)) {
          acc[prop.user_id].push(prop.owner_role);
        }
        return acc;
      }, {} as Record<string, string[]>) || {};

      // Create role map
      const roleMap = userRolesData?.reduce((acc, userRole) => {
        acc[userRole.user_id] = userRole.role;
        return acc;
      }, {} as Record<string, string>) || {};

      // Combine profile data with auth data
      const usersData: User[] = profilesData?.map((profile) => {
        const authUser = authUsers?.find(u => u.id === profile.user_id);
        const role = roleMap[profile.user_id] || 'buyer';
        const propertyRoles = propertyRolesMap[profile.user_id] || [];
        
        return {
          id: profile.id,
          user_id: profile.user_id,
          full_name: profile.full_name || 'Not Provided',
          email: authUser?.email || 'Not Provided',
          phone: profile.phone || 'Not Provided',
          created_at: profile.created_at,
          role: role,
          property_roles: propertyRoles,
          properties_count: propertyCountMap[profile.user_id] || 0,
          verification_status: profile.verification_status || 'unverified'
        };
      }) || [];

      setUsers(usersData);

      // Calculate stats
      const total = usersData.length;
      const propertyOwners = usersData.filter(u => u.properties_count > 0).length;
      const admins = usersData.filter(u => u.role === 'admin').length;
      const buyers = usersData.filter(u => u.role === 'buyer').length;
      const sellers = usersData.filter(u => u.role === 'seller').length;
      const contentManagers = usersData.filter(u => 
        ['content_manager', 'blog_content_creator', 'static_page_manager', 'sales_team', 'property_moderator', 'lead_manager'].includes(u.role)
      ).length;
      const activeListings = Object.values(propertyCountMap).reduce((sum, count) => sum + count, 0);

      setStats({ 
        total, 
        property_owners: propertyOwners, 
        admins, 
        buyers, 
        sellers, 
        content_managers: contentManagers,
        active_listings: activeListings 
      });
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
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'content_manager':
      case 'blog_content_creator':
      case 'static_page_manager':
        return 'default';
      case 'sales_team':
      case 'property_moderator':
      case 'lead_manager':
        return 'secondary';
      case 'seller':
        return 'outline';
      case 'buyer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getVerificationBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'unverified':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      // Delete user's properties first
      const { error: propertiesError } = await supabase
        .from('properties')
        .delete()
        .eq('user_id', userId);

      if (propertiesError) throw propertiesError;

      // Delete user roles
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (rolesError) throw rolesError;

      // Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Update local state
      setUsers(users.filter(user => user.user_id !== userId));
      
      toast({
        title: 'Success',
        description: `User ${userName} has been deleted successfully`,
        variant: 'default'
      });

      // Refresh users data to update stats
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
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
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.property_owners}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Content Team</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.content_managers}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Buyers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.buyers}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sellers</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.sellers}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.active_listings}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">All Users</CardTitle>
              <p className="text-sm text-muted-foreground">Manage user accounts and roles</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={() => setIsAddUserModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add User
              </Button>
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="content_manager">Content Manager</SelectItem>
                  <SelectItem value="blog_content_creator">Blog Creator</SelectItem>
                  <SelectItem value="static_page_manager">Page Manager</SelectItem>
                  <SelectItem value="sales_team">Sales Team</SelectItem>
                  <SelectItem value="property_moderator">Property Moderator</SelectItem>
                  <SelectItem value="lead_manager">Lead Manager</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                </SelectContent>
              </Select>
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
                  <TableHead className="text-muted-foreground font-medium">Account Role</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Property Roles</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Properties</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Joined</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        {user.full_name}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {user.phone}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.property_roles.length > 0 ? (
                            user.property_roles.map((role, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="capitalize text-xs"
                              >
                                {role}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getVerificationBadgeVariant(user.verification_status)} className="capitalize">
                          {user.verification_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          {user.properties_count}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete user "{user.full_name}"? This will permanently remove their account, profile, and all associated properties. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteUser(user.user_id, user.full_name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {roleFilter === 'all' ? 'No users found' : `No ${roleFilter}s found`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={fetchUsers}
      />
    </div>
  );
};

export default AdminUsers;