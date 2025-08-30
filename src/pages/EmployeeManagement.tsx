import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, UserCheck, Building, Filter, Plus, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmployeeInviteModal } from '@/components/admin/EmployeeInviteModal';
import { PayoutModal } from '@/components/admin/PayoutModal';
import { TransactionHistoryModal } from '@/components/admin/TransactionHistoryModal';

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone?: string;
  department: string;
  designation: string;
  role: string;
  join_date: string;
  status: string;
  salary?: number;
  created_at: string;
  approved_at?: string;
}

interface EmployeeStats {
  total: number;
  active: number;
  pending_approval: number;
  hr_admins: number;
  finance_admins: number;
  total_monthly_payroll: number;
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [stats, setStats] = useState<EmployeeStats>({
    total: 0,
    active: 0,
    pending_approval: 0,
    hr_admins: 0,
    finance_admins: 0,
    total_monthly_payroll: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
    
    // Set up real-time subscriptions
    const employeesChannel = supabase
      .channel('employees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees'
        },
        () => {
          fetchEmployees();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(employeesChannel);
    };
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, statusFilter, roleFilter]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEmployees(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch employees',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (employeeData: Employee[]) => {
    const total = employeeData.length;
    const active = employeeData.filter(e => e.status === 'active').length;
    const pending_approval = employeeData.filter(e => e.status === 'pending_approval').length;
    const hr_admins = employeeData.filter(e => e.role === 'hr_admin').length;
    const finance_admins = employeeData.filter(e => e.role === 'finance_admin').length;
    const total_monthly_payroll = employeeData
      .filter(e => e.status === 'active' && e.salary)
      .reduce((sum, e) => sum + (e.salary || 0), 0);

    setStats({
      total,
      active,
      pending_approval,
      hr_admins,
      finance_admins,
      total_monthly_payroll
    });
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.designation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(employee => employee.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(employee => employee.role === roleFilter);
    }

    setFilteredEmployees(filtered);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending_approval':
        return 'secondary';
      case 'inactive':
        return 'outline';
      case 'terminated':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'hr_admin':
      case 'finance_admin':
        return 'destructive';
      case 'content_manager':
      case 'blog_manager':
      case 'employee_manager':
        return 'default';
      case 'employee':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleApproveEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          status: 'active',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', employeeId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Employee approved successfully'
      });

      fetchEmployees();
    } catch (error) {
      console.error('Error approving employee:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve employee',
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Employee Management</h1>
        <p className="text-muted-foreground">Manage HomeHNI employees, payroll, and transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending_approval}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">HR Admins</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.hr_admins}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Finance Admins</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.finance_admins}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{stats.total_monthly_payroll.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <Button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Invite Employee
        </Button>
        <Button 
          onClick={() => setIsPayoutModalOpen(true)}
          variant="outline"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Process Payout
        </Button>
        <Button 
          onClick={() => setIsTransactionModalOpen(true)}
          variant="outline"
        >
          <Building className="h-4 w-4 mr-2" />
          Transaction History
        </Button>
      </div>

      {/* Employees Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">All Employees</CardTitle>
              <p className="text-sm text-muted-foreground">Manage employee accounts and payroll</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending_approval">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="hr_admin">HR Admin</SelectItem>
                  <SelectItem value="finance_admin">Finance Admin</SelectItem>
                  <SelectItem value="content_manager">Content Manager</SelectItem>
                  <SelectItem value="blog_manager">Blog Manager</SelectItem>
                  <SelectItem value="employee_manager">Employee Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
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
                  <TableHead className="text-muted-foreground font-medium">Employee ID</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Name</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Email</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Department</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Designation</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Role</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Salary</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Join Date</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="border-border hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        {employee.employee_id}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {employee.full_name}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {employee.email}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {employee.department}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {employee.designation}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(employee.role)} className="capitalize">
                          {employee.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(employee.status)} className="capitalize">
                          {employee.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {employee.salary ? `₹${employee.salary.toLocaleString()}` : 'Not Set'}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {new Date(employee.join_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {employee.status === 'pending_approval' && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveEmployee(employee.id)}
                              className="h-8 px-2"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsPayoutModalOpen(true);
                            }}
                            className="h-8 px-2"
                          >
                            <DollarSign className="h-3 w-3 mr-1" />
                            Payout
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      No employees found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <EmployeeInviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onEmployeeInvited={fetchEmployees}
      />

      <PayoutModal 
        isOpen={isPayoutModalOpen}
        onClose={() => {
          setIsPayoutModalOpen(false);
          setSelectedEmployee(null);
        }}
        selectedEmployee={selectedEmployee}
        employees={employees}
      />

      <TransactionHistoryModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </div>
  );
};

export default EmployeeManagement;