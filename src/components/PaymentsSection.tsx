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
import homeHniLogo from '@/assets/home-hni-logo-invoice.png';

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

  // Helper: Load an image and return a data URL for jsPDF
  const loadImageDataURL = (src: string) =>
    new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas 2D context not available'));
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load logo image'));
      img.src = src;
    });

  const generateInvoicePDF = async (payment: Payment) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    
    // Set colors - Red theme #DC2626 for Home HNI
    const primaryColor = [220, 38, 38]; // #DC2626 red color
    const secondaryColor = [128, 128, 128]; // Gray
    const textColor = [0, 0, 0]; // Black for uniform text
    
    // Company Header with red background for logo
    pdf.setFillColor(220, 38, 38); // #DC2626 red color
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Add Home HNI logo
    try {
      const logoWidth = 60;
      const logoHeight = 20;
      const dataUrl = await loadImageDataURL(homeHniLogo as string);
      pdf.addImage(dataUrl, 'PNG', 20, 10, logoWidth, logoHeight);
    } catch (error) {
      // Fallback to text if logo fails to load
      pdf.setTextColor(220, 38, 38);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HOME HNI', 20, 25);
    }
    
    // Reset text color for consistent formatting
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    // Invoice Title - Uniform formatting
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INVOICE', pageWidth - 20, 60, { align: 'right' });
    
    // Invoice Details Box - Professional styling
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.rect(pageWidth - 80, 70, 70, 35);
    
    // Uniform text formatting for invoice details
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Invoice #: ${payment.invoice_number || payment.payment_id.slice(-8)}`, pageWidth - 75, 77);
    pdf.text(`Date: ${format(new Date(payment.payment_date), 'dd/MM/yyyy')}`, pageWidth - 75, 84);
    pdf.text(`Payment ID: ${payment.payment_id.slice(-8)}`, pageWidth - 75, 91);
    pdf.text(`Status: ${payment.status.toUpperCase()}`, pageWidth - 75, 98);
    
    // Company Details - Uniform formatting
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('From:', 20, 60);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Home HNI Pvt Ltd', 20, 70);
    pdf.text('Plot No: 52 E/P', 20, 77);
    pdf.text('CBI Colony Sahebnagar Kalan', 20, 84);
    pdf.text('Email: homehni8@gmail.com', 20, 91);
    pdf.text('Phone: +91 8074 017 388', 20, 98);
    pdf.text('GST: 27ABCDE1234F5Z6', 20, 105);
    
    // Customer Details - Uniform formatting
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bill To:', 20, 125);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(user?.email || 'Customer', 20, 135);
    pdf.text('Customer ID: ' + (user?.id?.slice(-8) || 'N/A'), 20, 142);
    pdf.text('GST Number: _____________________', 20, 149);
    
    // Service Details Table - Professional design matching reference
    const tableY = 167;
    
    // Main table border
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.5);
    pdf.rect(20, tableY, pageWidth - 40, 35);
    
    // Table Header with light gray background
    pdf.setFillColor(245, 245, 245);
    pdf.rect(20, tableY, pageWidth - 40, 15, 'F');
    
    // Header borders - consistent with table structure
    pdf.line(20, tableY + 15, pageWidth - 20, tableY + 15);
    pdf.line(80, tableY, 80, tableY + 35);
    pdf.line(130, tableY, 130, tableY + 35);
    pdf.line(160, tableY, 160, tableY + 35);
    
    // Table headers - uniform formatting
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.text('Description', 25, tableY + 10);
    pdf.text('Plan Type', 85, tableY + 10);
    pdf.text('Duration', 135, tableY + 10);
    pdf.text('Amount', pageWidth - 25, tableY + 10, { align: 'right' });
    
    // Table Content Row - uniform formatting
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(payment.plan_name, 25, tableY + 25);
    pdf.text(payment.plan_type || 'subscription', 85, tableY + 25);
    pdf.text(payment.plan_duration || '1 month', 135, tableY + 25);
    pdf.text(`Rs. ${payment.amount_rupees.toLocaleString()}`, pageWidth - 25, tableY + 25, { align: 'right' });
    
    // Totals Section - Right aligned with uniform formatting
    const totalY = tableY + 60;
    const totalX = pageWidth - 80;
    
    // Subtotal - uniform text
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text('Subtotal:', totalX, totalY);
    pdf.text(`Rs. ${payment.amount_rupees.toLocaleString()}`, pageWidth - 25, totalY, { align: 'right' });
    
    // GST - uniform text
    pdf.text('GST (18%):', totalX, totalY + 12);
    const gstAmount = Math.round(payment.amount_rupees * 0.18);
    pdf.text(`Rs. ${gstAmount.toLocaleString()}`, pageWidth - 25, totalY + 12, { align: 'right' });
    
    // Total line separator
    pdf.setLineWidth(0.5);
    pdf.line(totalX, totalY + 20, pageWidth - 20, totalY + 20);
    
    // Total Amount - uniform bold formatting
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Total Amount:', totalX, totalY + 32);
    const totalAmount = payment.amount_rupees + gstAmount;
    pdf.text(`Rs. ${totalAmount.toLocaleString()}`, pageWidth - 25, totalY + 32, { align: 'right' });
    
    // Payment Details Section - uniform formatting
    const paymentDetailsY = totalY + 60;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Payment Details:', 20, paymentDetailsY);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Payment Method: ${payment.payment_method || 'razorpay'}`, 20, paymentDetailsY + 15);
    pdf.text(`Transaction Date: ${format(new Date(payment.payment_date), 'MMMM do, yyyy')}`, 20, paymentDetailsY + 25);
    pdf.text(`Currency: ${payment.currency}`, 20, paymentDetailsY + 35);
    
    // Save the PDF
    const fileName = `HomeHNI_Invoice_${payment.invoice_number || payment.payment_id.slice(-8)}_${format(new Date(payment.payment_date), 'yyyy-MM-dd')}.pdf`;
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