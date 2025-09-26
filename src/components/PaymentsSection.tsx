import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, CreditCard, Download, Check, Clock, X, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

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
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
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
        setFilteredPayments(data || []);
      } catch (error) {
        console.error('Error loading payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.id]);

  // Filter payments based on selected filters
  useEffect(() => {
    let filtered = payments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (planFilter !== 'all') {
      filtered = filtered.filter(payment => payment.plan_name === planFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, statusFilter, planFilter]);

  // Get unique plan names for filter
  const uniquePlanNames = [...new Set(payments.map(payment => payment.plan_name))];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-gray-600" />;
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
      case 'cancelled':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Cancelled</Badge>;
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

  const generateInvoicePDF = async (payment: Payment) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    
    // Set colors
    const primaryColor = [0, 102, 204]; // Blue
    const secondaryColor = [128, 128, 128]; // Gray
    
    // Company Header
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    // Company Name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PropertyHub', 20, 20);
    
    // Invoice Title
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INVOICE', pageWidth - 20, 50, { align: 'right' });
    
    // Invoice Details Box
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.rect(pageWidth - 70, 55, 60, 30);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Invoice #: ${payment.invoice_number || payment.payment_id.slice(-8)}`, pageWidth - 65, 62);
    pdf.text(`Date: ${format(new Date(payment.payment_date), 'dd/MM/yyyy')}`, pageWidth - 65, 68);
    pdf.text(`Payment ID: ${payment.payment_id.slice(-8)}`, pageWidth - 65, 74);
    pdf.text(`Status: ${payment.status.toUpperCase()}`, pageWidth - 65, 80);
    
    // Company Details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('From:', 20, 50);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('PropertyHub Pvt Ltd', 20, 58);
    pdf.text('123 Business District', 20, 64);
    pdf.text('Mumbai, Maharashtra 400001', 20, 70);
    pdf.text('Email: billing@propertyhub.com', 20, 76);
    pdf.text('Phone: +91 9876543210', 20, 82);
    pdf.text('GST: 27ABCDE1234F5Z6', 20, 88);
    
    // Customer Details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bill To:', 20, 110);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(user?.email || 'Customer', 20, 118);
    pdf.text('Customer ID: ' + (user?.id?.slice(-8) || 'N/A'), 20, 124);
    
    // Service Details Table
    const tableY = 150;
    
    // Table Header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, tableY, pageWidth - 40, 15, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description', 25, tableY + 10);
    pdf.text('Plan Type', 100, tableY + 10);
    pdf.text('Duration', 130, tableY + 10);
    pdf.text('Amount', pageWidth - 25, tableY + 10, { align: 'right' });
    
    // Table Content
    const rowY = tableY + 20;
    pdf.setFont('helvetica', 'normal');
    pdf.text(payment.plan_name, 25, rowY);
    pdf.text(payment.plan_type || 'Subscription', 100, rowY);
    pdf.text(payment.plan_duration || 'Monthly', 130, rowY);
    pdf.text(`₹${payment.amount_rupees.toLocaleString()}`, pageWidth - 25, rowY, { align: 'right' });
    
    // Total Section
    const totalY = rowY + 30;
    pdf.line(20, totalY - 5, pageWidth - 20, totalY - 5);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Subtotal:', pageWidth - 80, totalY);
    pdf.text(`₹${payment.amount_rupees.toLocaleString()}`, pageWidth - 25, totalY, { align: 'right' });
    
    pdf.text('GST (18%):', pageWidth - 80, totalY + 8);
    const gstAmount = Math.round(payment.amount_rupees * 0.18);
    pdf.text(`₹${gstAmount.toLocaleString()}`, pageWidth - 25, totalY + 8, { align: 'right' });
    
    pdf.setFontSize(12);
    pdf.text('Total Amount:', pageWidth - 80, totalY + 18);
    const totalAmount = payment.amount_rupees + gstAmount;
    pdf.text(`₹${totalAmount.toLocaleString()}`, pageWidth - 25, totalY + 18, { align: 'right' });
    
    // Payment Details
    const paymentDetailsY = totalY + 40;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Payment Details:', 20, paymentDetailsY);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Payment Method: ${payment.payment_method || 'Razorpay'}`, 20, paymentDetailsY + 8);
    pdf.text(`Transaction Date: ${format(new Date(payment.payment_date), 'PPP')}`, 20, paymentDetailsY + 16);
    pdf.text(`Currency: ${payment.currency}`, 20, paymentDetailsY + 24);
    
    // Footer
    const footerY = pageHeight - 40;
    pdf.setTextColor(128, 128, 128);
    pdf.setFontSize(8);
    pdf.text('Thank you for your business!', 20, footerY);
    pdf.text('This is a computer-generated invoice and does not require a signature.', 20, footerY + 8);
    pdf.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, footerY + 16);
    
    // Terms and Conditions
    pdf.text('Terms: Payment is due within 30 days. Late payments may incur additional charges.', 20, footerY + 24);
    
    // Save the PDF
    const fileName = `Invoice_${payment.invoice_number || payment.payment_id.slice(-8)}_${format(new Date(payment.payment_date), 'yyyy-MM-dd')}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Your Payments</h1>
        <p className="text-sm text-gray-500">{filteredPayments.length} of {payments.length} transaction{payments.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Plan:</label>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {uniquePlanNames.map((planName) => (
                  <SelectItem key={planName} value={planName}>
                    {planName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(statusFilter !== 'all' || planFilter !== 'all') && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setStatusFilter('all');
                setPlanFilter('all');
              }}
              className="text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <Filter className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No payments found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more results</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPayments.map((payment) => (
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
      )}

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
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => generateInvoicePDF(selectedPayment)}
                  >
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