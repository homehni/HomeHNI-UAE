import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  designation: string;
  role: string;
  salary?: number;
}

interface PayoutRequest {
  id: string;
  employee_id: string;
  payout_type: string;
  amount: number;
  description?: string;
  status: string;
  requested_at: string;
  employees: {
    full_name: string;
    employee_id: string;
  };
}

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee?: Employee | null;
  employees: Employee[];
}

export const PayoutModal: React.FC<PayoutModalProps> = ({
  isOpen,
  onClose,
  selectedEmployee,
  employees
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'approve' | 'process'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    payout_type: 'salary' as 'salary' | 'bonus' | 'reimbursement' | 'advance',
    amount: '',
    description: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchPayoutRequests();
      if (selectedEmployee) {
        setFormData(prev => ({
          ...prev,
          employee_id: selectedEmployee.id
        }));
      }
    }
  }, [isOpen, selectedEmployee]);

  const fetchPayoutRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_payouts')
        .select(`
          *,
          employees(full_name, employee_id)
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setPayoutRequests(data || []);
    } catch (error) {
      console.error('Error fetching payout requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payout requests',
        variant: 'destructive'
      });
    }
  };

  const handleCreatePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('employee-payout', {
        body: {
          action: 'create',
          employee_id: formData.employee_id,
          payout_type: formData.payout_type,
          amount: parseFloat(formData.amount),
          description: formData.description
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'Success',
          description: data.message
        });
        fetchPayoutRequests();
        setFormData({
          employee_id: selectedEmployee?.id || '',
          payout_type: 'salary',
          amount: '',
          description: ''
        });
      } else {
        throw new Error(data.error || 'Failed to create payout request');
      }

    } catch (err: any) {
      console.error('Payout creation error:', err);
      toast({
        title: 'Error',
        description: err?.message || 'Failed to create payout request',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveReject = async (payoutId: string, action: 'approve' | 'reject', rejectionReason?: string) => {
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('employee-payout', {
        body: {
          action,
          payout_id: payoutId,
          rejection_reason: rejectionReason
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'Success',
          description: data.message
        });
        fetchPayoutRequests();
      } else {
        throw new Error(data.error || `Failed to ${action} payout`);
      }

    } catch (err: any) {
      console.error(`Payout ${action} error:`, err);
      toast({
        title: 'Error',
        description: err?.message || `Failed to ${action} payout`,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessPayout = async (payoutId: string) => {
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('employee-payout', {
        body: {
          action: 'process',
          payout_id: payoutId
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'Success',
          description: data.message
        });
        fetchPayoutRequests();
      } else {
        throw new Error(data.error || 'Failed to process payout');
      }

    } catch (err: any) {
      console.error('Payout processing error:', err);
      toast({
        title: 'Error',
        description: err?.message || 'Failed to process payout',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'paid':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'paid':
        return <DollarSign className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payout Management</DialogTitle>
          <div id="dialog-description" className="text-sm text-muted-foreground">
            Create, approve, and process employee payouts through the system.
          </div>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b">
          <Button
            variant={activeTab === 'create' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('create')}
            className="rounded-b-none"
          >
            Create Payout
          </Button>
          <Button
            variant={activeTab === 'approve' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('approve')}
            className="rounded-b-none"
          >
            Approve/Reject
          </Button>
          <Button
            variant={activeTab === 'process' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('process')}
            className="rounded-b-none"
          >
            Process Payments
          </Button>
        </div>

        {/* Create Payout Tab */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreatePayout} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee *</Label>
                <Select 
                  value={formData.employee_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employee_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.employee_id} - {employee.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payout_type">Payout Type *</Label>
                <Select 
                  value={formData.payout_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payout_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payout type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                    <SelectItem value="reimbursement">Reimbursement</SelectItem>
                    <SelectItem value="advance">Advance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount"
                  required
                  min="1"
                  step="0.01"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter payout description"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Payout Request'
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Approve/Reject Tab */}
        {activeTab === 'approve' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pending Payout Requests</h3>
            {payoutRequests
              .filter(request => request.status === 'pending')
              .map((request) => (
                <Card key={request.id} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {request.employees.employee_id} - {request.employees.full_name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {request.payout_type.charAt(0).toUpperCase() + request.payout_type.slice(1)} | 
                          ₹{request.amount.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {request.description && (
                      <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveReject(request.id, 'approve')}
                        disabled={isSubmitting}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApproveReject(request.id, 'reject', 'Rejected by finance admin')}
                        disabled={isSubmitting}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {payoutRequests.filter(request => request.status === 'pending').length === 0 && (
              <p className="text-center text-muted-foreground py-8">No pending payout requests</p>
            )}
          </div>
        )}

        {/* Process Payments Tab */}
        {activeTab === 'process' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Approved Payouts - Ready for Processing</h3>
            {payoutRequests
              .filter(request => request.status === 'approved')
              .map((request) => (
                <Card key={request.id} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {request.employees.employee_id} - {request.employees.full_name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {request.payout_type.charAt(0).toUpperCase() + request.payout_type.slice(1)} | 
                          ₹{request.amount.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {request.description && (
                      <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleProcessPayout(request.id)}
                      disabled={isSubmitting}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Process Payment (Stripe)
                    </Button>
                  </CardContent>
                </Card>
              ))}
            {payoutRequests.filter(request => request.status === 'approved').length === 0 && (
              <p className="text-center text-muted-foreground py-8">No approved payouts ready for processing</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};