import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, DollarSign, Calendar, Building, ArrowLeft, Receipt, CreditCard, Layout, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { VisualPageBuilder } from '@/components/admin/VisualPageBuilder';

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone?: string;
  department: string;
  designation: string;
  role: string;
  salary?: number;
  join_date: string;
  status: string;
}

interface Transaction {
  id: string;
  employee_id: string;
  transaction_type: string;
  amount: number;
  description?: string;
  transaction_date: string;
  reference_number?: string;
  created_at: string;
}

interface PayoutRequest {
  id: string;
  employee_id: string;
  amount: number;
  description?: string;
  status: string;
  payout_type: string;
  requested_at: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVisualBuilder, setShowVisualBuilder] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEmployeeData();
      fetchTransactions();
      fetchPayoutRequests();
    }
  }, [user]);

  const fetchEmployeeData = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('email', user?.email)
        .single();

      if (error) throw error;
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast({
        title: "Access Denied",
        description: "You don't have employee access to this dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchPayoutRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_payouts')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setPayoutRequests(data || []);
    } catch (error) {
      console.error('Error fetching payout requests:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'salary': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'bonus': return <DollarSign className="h-4 w-4 text-blue-600" />;
      case 'penalty': return <DollarSign className="h-4 w-4 text-red-600" />;
      default: return <Receipt className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">Loading employee dashboard...</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="max-w-4xl mx-auto pt-32 p-4">
          <Card>
            <CardContent className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Employee Access Required</h3>
              <p className="text-gray-500 mb-4">You need to be registered as an employee to access this dashboard.</p>
              <Button onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Main Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-6xl mx-auto pt-32 p-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
            <p className="text-gray-600">Welcome, {employee.full_name}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Main Dashboard
          </Button>
        </div>

        {/* Employee Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employee ID</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.employee_id}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Department</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{employee.department}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Role</CardTitle>
              <Badge className="ml-2">{employee.role}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{employee.designation}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {employee.salary ? `₹${employee.salary.toLocaleString()}` : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs - Different based on role */}
        {employee.role === 'content_manager' ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management Tools</CardTitle>
                <CardDescription>
                  Choose the content management interface that best suits your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Building className="h-5 w-5 mr-2" />
                        Visual Page Builder
                      </CardTitle>
                      <CardDescription>
                        Advanced visual editor for all pages with organized homepage sections
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-green-600">
                          <Check className="h-4 w-4 mr-1" />
                          Structured homepage editing
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Layout className="h-4 w-4 mr-1" />
                          Drag-and-drop interface
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Layout className="h-4 w-4 mr-1" />
                          Live preview
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Layout className="h-4 w-4 mr-1" />
                          All page types
                        </div>
                        <Button 
                          className="w-full mt-4"
                          onClick={() => setShowVisualBuilder(true)}
                        >
                          Open Visual Builder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
              <TabsTrigger value="payouts">Payout Requests</TabsTrigger>
              <TabsTrigger value="profile">Employee Profile</TabsTrigger>
            </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Transaction History</h2>
            </div>

            {transactions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                  <p className="text-gray-500">Your salary and transaction history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          {getTransactionTypeIcon(transaction.transaction_type)}
                          <div>
                            <h3 className="font-medium text-gray-900 capitalize">
                              {transaction.transaction_type}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {transaction.description || `${transaction.transaction_type} transaction`}
                            </p>
                            {transaction.reference_number && (
                              <p className="text-xs text-gray-500 mt-1">
                                Ref: {transaction.reference_number}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            transaction.transaction_type === 'penalty' 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            {transaction.transaction_type === 'penalty' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Payout Requests Tab */}
          <TabsContent value="payouts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Payout Requests</h2>
            </div>

            {payoutRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payout requests</h3>
                  <p className="text-gray-500">Your payout requests will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {payoutRequests.map((payout) => (
                  <Card key={payout.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900 capitalize">
                              {payout.payout_type} Payout
                            </h3>
                            <Badge variant={getStatusBadgeVariant(payout.status)}>
                              {payout.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {payout.description || `${payout.payout_type} payout request`}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Requested: {new Date(payout.requested_at).toLocaleDateString()}
                          </p>
                          {payout.approved_at && (
                            <p className="text-sm text-green-600 mt-1">
                              Approved: {new Date(payout.approved_at).toLocaleDateString()}
                            </p>
                          )}
                          {payout.rejected_at && (
                            <div className="mt-2">
                              <p className="text-sm text-red-600">
                                Rejected: {new Date(payout.rejected_at).toLocaleDateString()}
                              </p>
                              {payout.rejection_reason && (
                                <p className="text-sm text-red-600">
                                  Reason: {payout.rejection_reason}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ₹{payout.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Employee Information
                </CardTitle>
                <CardDescription>
                  Your employment details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">{employee.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Employee ID</label>
                    <p className="text-gray-900">{employee.employee_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{employee.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{employee.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <p className="text-gray-900">{employee.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Designation</label>
                    <p className="text-gray-900">{employee.designation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <Badge>{employee.role}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Join Date</label>
                    <p className="text-gray-900">
                      {new Date(employee.join_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                      {employee.status}
                    </Badge>
                  </div>
                  {employee.salary && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Monthly Salary</label>
                      <p className="text-gray-900">₹{employee.salary.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        )}
      </div>
      
      {/* Visual Builder Modal */}
      {showVisualBuilder && (
        <div className="fixed inset-0 top-0 left-0 bg-background z-50">
          <VisualPageBuilder />
          <Button 
            className="fixed top-4 right-4 z-50 p-2 h-8 w-8"
            onClick={() => setShowVisualBuilder(false)}
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
