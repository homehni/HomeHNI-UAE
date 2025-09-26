import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, CreditCard, Download, Check, Clock, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Payment {
  id: string;
  payment_id: string;
  plan_name: string;
  amount_rupees: number;
  currency: string;
  status: string;
  payment_method: string;
  payment_date: string;
  invoice_number: string;
  plan_type: string;
  plan_duration: string;
  expires_at: string | null;
  metadata: any;
}

const PaymentsSection: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('payment_date', { ascending: false });

        if (error) {
          console.error('Error fetching payments:', error);
          return;
        }

        setPayments(data || []);
      } catch (error) {
        console.error('Error loading payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Success</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Your Payments</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Your Payments</h1>
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history</h3>
          <p className="text-gray-500">Your payment history will appear here once you make a purchase</p>
        </div>
      </div>
    );
  }

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Your Payments</h1>
        <p className="text-sm text-gray-500">{payments.length} transaction{payments.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-2">
        {payments.map((payment) => (
          <Card 
            key={payment.id} 
            className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            onClick={() => handlePaymentClick(payment)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">{payment.plan_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{payment.amount_rupees.toLocaleString()}</div>
                  </div>
                  {getStatusBadge(payment.status)}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{selectedPayment.plan_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(selectedPayment.payment_date), 'PPP')}</span>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{selectedPayment.amount_rupees.toLocaleString()}
                  </div>
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Payment ID</p>
                  <p className="font-mono text-xs bg-gray-50 px-2 py-1 rounded break-all">
                    {selectedPayment.payment_id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Plan Type</p>
                  <p className="capitalize">{selectedPayment.plan_type || 'Subscription'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Duration</p>
                  <p className="capitalize">{selectedPayment.plan_duration || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Payment Method</p>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="capitalize">{selectedPayment.payment_method || 'Razorpay'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Currency</p>
                  <p className="uppercase">{selectedPayment.currency}</p>
                </div>
                {selectedPayment.invoice_number && (
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Invoice Number</p>
                    <p className="font-mono text-sm">{selectedPayment.invoice_number}</p>
                  </div>
                )}
              </div>

              {selectedPayment.expires_at && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Plan expires on {format(new Date(selectedPayment.expires_at), 'PPP')}
                    </span>
                  </div>
                </div>
              )}

              {selectedPayment.invoice_number && (
                <div className="flex justify-end pt-4 border-t">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsSection;