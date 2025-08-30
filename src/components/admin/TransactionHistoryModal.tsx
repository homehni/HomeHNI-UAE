import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, DollarSign, Calendar, User } from 'lucide-react';

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description?: string;
  reference_number?: string;
  transaction_date: string;
  created_at: string;
  employees: {
    employee_id: string;
    full_name: string;
  };
}

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter, dateFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employee_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const employeeIds = Array.from(new Set((data || []).map((t: any) => t.employee_id))).filter(Boolean) as string[];

      let employeesMap: Record<string, { employee_id: string; full_name: string }> = {};
      if (employeeIds.length) {
        const { data: emps, error: empErr } = await supabase
          .from('employees')
          .select('id, employee_id, full_name')
          .in('id', employeeIds);
        if (empErr) throw empErr;
        employeesMap = Object.fromEntries(
          (emps || []).map((e: any) => [e.id, { employee_id: e.employee_id, full_name: e.full_name }])
        );
      }

      const mapped = (data || []).map((t: any) => ({
        ...t,
        employees: employeesMap[t.employee_id] || { employee_id: '', full_name: 'Unknown' }
      })) as Transaction[];

      setTransactions(mapped);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transaction history',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.employees.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.employees.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.transaction_type === typeFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter(transaction => 
        new Date(transaction.created_at) >= startDate
      );
    }

    setFilteredTransactions(filtered);
  };

  const getTransactionTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'salary':
        return 'default';
      case 'bonus':
        return 'secondary';
      case 'reimbursement':
        return 'outline';
      case 'advance':
        return 'destructive';
      case 'penalty':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'salary':
        return <DollarSign className="h-4 w-4" />;
      case 'bonus':
        return <DollarSign className="h-4 w-4" />;
      case 'reimbursement':
        return <DollarSign className="h-4 w-4" />;
      case 'advance':
        return <DollarSign className="h-4 w-4" />;
      case 'penalty':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const calculateTotalAmount = () => {
    return filteredTransactions.reduce((sum, transaction) => {
      return transaction.transaction_type === 'penalty' 
        ? sum - transaction.amount 
        : sum + transaction.amount;
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
          <DialogDescription id="dialog-description">
            View and filter all employee financial transactions.
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type_filter">Transaction Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
                <SelectItem value="reimbursement">Reimbursement</SelectItem>
                <SelectItem value="advance">Advance</SelectItem>
                <SelectItem value="penalty">Penalty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_filter">Date Range</Label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Total Amount</Label>
            <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">
                ₹{calculateTotalAmount().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        {getTransactionTypeIcon(transaction.transaction_type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground">
                            {transaction.employees.employee_id} - {transaction.employees.full_name}
                          </h4>
                          <Badge variant={getTransactionTypeBadgeVariant(transaction.transaction_type)}>
                            {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description || 'No description provided'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </div>
                          {transaction.reference_number && (
                            <div className="flex items-center">
                              <span>Ref: {transaction.reference_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        transaction.transaction_type === 'penalty' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.transaction_type === 'penalty' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};