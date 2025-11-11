import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard,
  Calendar,
  FileText,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PayoutModal } from '@/components/admin/PayoutModal';
import { TransactionHistoryModal } from '@/components/admin/TransactionHistoryModal';

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  designation: string;
  role: string;
  salary: number | null;
  status: string;
}

interface FinanceStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingPayouts: number;
  monthlyPayroll: number;
  totalTransactions: number;
  approvedPayouts: number;
}

const FinanceOverview = () => {
  const [stats, setStats] = useState<FinanceStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingPayouts: 0,
    monthlyPayroll: 0,
    totalTransactions: 0,
    approvedPayouts: 0,
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    fetchFinanceStats();
  }, []);

  const fetchFinanceStats = async () => {
    try {
      // Fetch employee data
      const { data: employeeData } = await supabase
        .from('employees')
        .select('*');

      const employees = employeeData || [];
      setEmployees(employees as Employee[]);

      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(e => e.status === 'active').length;
      const monthlyPayroll = employees
        .filter(e => e.status === 'active' && e.salary)
        .reduce((sum, e) => sum + (e.salary || 0), 0);

      // Fetch payout stats
      const { data: payouts } = await supabase
        .from('employee_payouts')
        .select('status, amount');

      const pendingPayouts = payouts?.filter(p => p.status === 'pending').length || 0;
      const approvedPayouts = payouts?.filter(p => p.status === 'approved').length || 0;

      // Fetch transaction stats
      const { data: transactions } = await supabase
        .from('employee_transactions')
        .select('id');

      const totalTransactions = transactions?.length || 0;

      setStats({
        totalEmployees,
        activeEmployees,
        pendingPayouts,
        monthlyPayroll,
        totalTransactions,
        approvedPayouts,
      });
    } catch (error) {
      console.error('Error fetching finance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Overview</h1>
          <p className="text-gray-600 mt-2">Manage payroll, payouts, and financial operations</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowPayoutModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Process Payout
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowTransactionModal(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Transactions
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeEmployees} active employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payroll</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.monthlyPayroll)}</div>
            <p className="text-xs text-muted-foreground">
              For {stats.activeEmployees} active employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingPayouts}</div>
            <p className="text-xs text-muted-foreground">
              Requires approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              All time records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => setShowPayoutModal(true)}
            >
              <DollarSign className="h-6 w-6" />
              <span>Create Payout</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => setShowTransactionModal(true)}
            >
              <FileText className="h-6 w-6" />
              <span>View Transactions</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              disabled
            >
              <TrendingUp className="h-6 w-6" />
              <span>Financial Reports</span>
              <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.pendingPayouts > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    {stats.pendingPayouts} payout request(s) pending approval
                  </p>
                  <p className="text-xs text-orange-600">Action required</p>
                </div>
              </div>
            )}
            
            {stats.approvedPayouts > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {stats.approvedPayouts} payout(s) ready for processing
                  </p>
                  <p className="text-xs text-green-600">Ready to process</p>
                </div>
              </div>
            )}

            {stats.pendingPayouts === 0 && stats.approvedPayouts === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No pending financial activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PayoutModal 
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        employees={employees}
      />
      
      <TransactionHistoryModal 
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />
    </div>
  );
};

export default FinanceOverview;
