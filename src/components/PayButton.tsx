import { useCallback, useState } from "react";
import { loadRazorpayScript } from "@/lib/loadRazorpay";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type PayButtonProps = {
  label?: string;
  amountPaise: number;         // e.g., 699900 for ₹6,999
  planName: string;            // e.g., "Agent Lifetime — Platinum"
  notes?: Record<string, string>;
  prefill?: { name?: string; email?: string; contact?: string };
  className?: string;
};

export default function PayButton({
  label = "Subscribe",
  amountPaise,
  planName,
  notes,
  prefill,
  className
}: PayButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const onClick = useCallback(async () => {
    try {
      setLoading(true);
      console.log("PayButton clicked, starting payment process...");
      
      await loadRazorpayScript();
      console.log("Razorpay script loaded successfully");

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID as string;
      console.log("Razorpay key from env:", key);
      
      if (!key || key === "YOUR_RAZORPAY_KEY_ID") {
        console.error("Razorpay key not configured properly");
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: "Payment configuration error. Please try again later.",
          className: "border-l-4 border-l-red-600 bg-white shadow-lg text-red-900 min-w-[400px] max-w-[500px] w-full",
        });
        return;
      }

      console.log("Creating Razorpay options with amount:", amountPaise);
      
      // TODO (Later): replace with a backend-created order_id and signature verification.
      const options = {
        key,
        amount: amountPaise,
        currency: "INR",
        name: "Home HNI",
        description: planName,
        notes,
        prefill,
        theme: { color: "#d21404" },
        handler: async function (response: any) {
          console.log("Payment response received:", response);
          
          try {
            // Check if payment actually succeeded
            if (!response.razorpay_payment_id) {
              throw new Error("Payment failed - no payment ID received");
            }
            
            // Record payment in database
            if (user?.id) {
              const currentDate = new Date();
              const expiryDate = new Date();
              const invoiceNumber = `INV-${Date.now()}`;
              
              // Calculate expiry based on plan (you can modify this logic)
              if (planName.toLowerCase().includes('lifetime')) {
                expiryDate.setFullYear(expiryDate.getFullYear() + 100); // 100 years for lifetime
              } else if (planName.toLowerCase().includes('year')) {
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
              } else {
                expiryDate.setMonth(expiryDate.getMonth() + 1); // Default to 1 month
              }
              
              const { error: paymentError } = await supabase
                .from('payments')
                .insert({
                  user_id: user.id,
                  payment_id: response.razorpay_payment_id,
                  plan_name: planName,
                  amount_paise: amountPaise,
                  amount_rupees: amountPaise / 100,
                  currency: 'INR',
                  status: 'success',
                  payment_method: 'razorpay',
                  payment_date: currentDate.toISOString(),
                  invoice_number: invoiceNumber,
                  plan_type: planName.toLowerCase().includes('lifetime') ? 'lifetime' : 'subscription',
                  plan_duration: planName.toLowerCase().includes('lifetime') 
                    ? 'lifetime' 
                    : planName.toLowerCase().includes('year') ? '1 year' : '1 month',
                  expires_at: expiryDate.toISOString(),
                  metadata: {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id || null,
                    razorpay_signature: response.razorpay_signature || null,
                    notes: notes
                  }
                });
              
              if (paymentError) {
                console.error('Error recording payment:', paymentError);
                toast({
                  variant: "destructive",
                  title: "Payment Error",
                  description: "Payment successful but failed to save record. Please contact support.",
                  className: "border-l-4 border-l-red-600 bg-white shadow-lg text-red-900 min-w-[400px] max-w-[500px] w-full",
                });
                return;
              }
            }
            
            // Show success toast immediately
            toast({
              title: "Payment Successful!",
              description: "Your payment has been processed and plan activated successfully.",
              variant: "success",
            });
            
            // Trigger payment emails in background to the logged-in user's email (fallback to prefill)
            (async () => {
              try {
                const recipientEmail = user?.email || prefill?.email;
                if (!recipientEmail) {
                  console.warn('No recipient email available for payment emails');
                  return;
                }

                const { 
                  sendPaymentSuccessEmail, 
                  sendPaymentInvoiceEmail 
                } = await import('@/services/emailService');
                
                const { 
                  calculateGSTAmount, 
                  calculateTotalWithGST 
                } = await import('@/utils/gstCalculator');
                
                const currentDate = new Date();
                const paymentDate = currentDate.toLocaleDateString('en-IN');
                
                // Calculate expiry date based on plan
                const expiryDate = new Date();
                if (planName.toLowerCase().includes('lifetime')) {
                  expiryDate.setFullYear(expiryDate.getFullYear() + 100);
                } else if (planName.toLowerCase().includes('year')) {
                  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                } else {
                  expiryDate.setMonth(expiryDate.getMonth() + 1);
                }
                
                // Generate proper invoice number with timestamp
                const invoiceTimestamp = Date.now();
                const invoiceNumber = `HHNI-INV-${invoiceTimestamp}`;
                
                // Calculate GST breakdown using amount including GST (amountPaise)
                const baseAmount = Math.round(amountPaise / 1.18); // Remove GST to get base in paise
                const gstAmount = calculateGSTAmount(baseAmount);
                const totalAmount = calculateTotalWithGST(baseAmount);
                
                // Determine plan details
                const planType = planName.toLowerCase().includes('lifetime') ? 'lifetime' : 'subscription';
                const planDuration = planName.toLowerCase().includes('lifetime') 
                  ? 'Lifetime Access' 
                  : planName.toLowerCase().includes('year') ? '1 Year' : '1 Month';
                
                // Get next billing date (null for lifetime plans)
                const nextBillingDate = planType === 'lifetime' 
                  ? null 
                  : expiryDate.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                
                const displayName = prefill?.name || (user as any)?.user_metadata?.full_name || 'Valued Customer';
                
                // 1) Send payment success email first
                await sendPaymentSuccessEmail(
                  recipientEmail,
                  displayName,
                  {
                    planName: planName,
                    planType: planType,
                    planDuration: planDuration,
                    baseAmount: baseAmount / 100,
                    gstAmount: gstAmount / 100,
                    totalAmount: totalAmount / 100,
                    amount: baseAmount / 100,
                    paymentId: response.razorpay_payment_id,
                    transactionId: response.razorpay_payment_id,
                    paymentDate: paymentDate,
                    expiryDate: expiryDate.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }),
                    nextBillingDate: nextBillingDate,
                    dashboardUrl: 'https://homehni.com/dashboard'
                  }
                );
                
                // Small delay to ensure sequence
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // 2) Send invoice email right after
                await sendPaymentInvoiceEmail(
                  recipientEmail,
                  displayName,
                  {
                    invoiceNumber: invoiceNumber,
                    planName: planName,
                    planType: planType,
                    planDuration: planDuration,
                    baseAmount: baseAmount / 100,
                    gstAmount: gstAmount / 100,
                    gstRate: '18%',
                    totalAmount: totalAmount / 100,
                    amount: baseAmount / 100,
                    paymentDate: paymentDate,
                    paymentId: response.razorpay_payment_id,
                    paymentMethod: 'Razorpay',
                    currency: 'INR',
                    customerName: displayName,
                    customerEmail: recipientEmail,
                    customerPhone: prefill?.contact || '',
                    billingAddress: {
                      name: displayName,
                      email: recipientEmail,
                      phone: prefill?.contact || ''
                    },
                    invoiceDownloadUrl: `https://homehni.com/invoices/${invoiceNumber}`,
                    dashboardUrl: 'https://homehni.com/dashboard'
                  }
                );
                
                console.log('Payment emails queued successfully');
              } catch (emailError) {
                console.error('Error sending payment emails:', emailError);
              }
            })();
            
            // Redirect to success page or dashboard
            setTimeout(() => {
              window.location.href = `/payment/success?payment_id=${response.razorpay_payment_id || ""}`;
            }, 2000);
          } catch (error) {
            console.error('Payment processing error:', error);
            
            // Record failed payment in database
            if (user?.id) {
              try {
                const currentDate = new Date();
                await supabase
                  .from('payments')
                  .insert({
                    user_id: user.id,
                    payment_id: response.razorpay_payment_id || `failed_${Date.now()}`,
                    plan_name: planName,
                    amount_paise: amountPaise,
                    amount_rupees: amountPaise / 100,
                    currency: 'INR',
                    status: 'failed',
                    payment_method: 'razorpay',
                    payment_date: currentDate.toISOString(),
                    invoice_number: null,
                    plan_type: planName.toLowerCase().includes('lifetime') ? 'lifetime' : 'subscription',
                    plan_duration: planName.toLowerCase().includes('lifetime') 
                      ? 'lifetime' 
                      : planName.toLowerCase().includes('year') ? '1 year' : '1 month',
                    expires_at: null,
                    metadata: {
                      error_message: error instanceof Error ? error.message : 'Unknown error',
                      failed_at: currentDate.toISOString(),
                      notes: notes
                    }
                  });
              } catch (dbError) {
                console.error('Error recording failed payment:', dbError);
              }
            }
            
            toast({
              variant: "destructive",
              title: "Payment Failed",
              description: error instanceof Error ? error.message : "Please try again or contact support.",
              className: "border-l-4 border-l-red-600 bg-white shadow-lg text-red-900 min-w-[400px] max-w-[500px] w-full",
            });
            
            setTimeout(() => {
              window.location.href = "/payment/failed";
            }, 2000);
          }
        },
        modal: {
          ondismiss: async function () {
            console.log("Payment modal dismissed");
            
            // Record cancelled payment in database
            if (user?.id) {
              try {
                const currentDate = new Date();
                const { error: paymentError } = await supabase
                  .from('payments')
                  .insert({
                    user_id: user.id,
                    payment_id: `cancelled_${Date.now()}`,
                    plan_name: planName,
                    amount_paise: amountPaise,
                    amount_rupees: amountPaise / 100,
                    currency: 'INR',
                    status: 'cancelled',
                    payment_method: 'razorpay',
                    payment_date: currentDate.toISOString(),
                    invoice_number: null,
                    plan_type: planName.toLowerCase().includes('lifetime') ? 'lifetime' : 'subscription',
                    plan_duration: planName.toLowerCase().includes('lifetime') 
                      ? 'lifetime' 
                      : planName.toLowerCase().includes('year') ? '1 year' : '1 month',
                    expires_at: null,
                    metadata: {
                      cancelled_at: currentDate.toISOString(),
                      reason: 'user_cancelled',
                      notes: notes
                    }
                  });
                
                if (!paymentError) {
                  console.log('Cancelled payment recorded successfully');
                }
              } catch (error) {
                console.error('Error recording cancelled payment:', error);
              }
            }
            
            // No toast for cancelled payments - user initiated action
            setTimeout(() => {
              window.location.href = "/payment/failed";
            }, 1000);
          },
        },
      };

      console.log("Opening Razorpay checkout with options:", options);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Payment Setup Failed",
        description: `${error instanceof Error ? error.message : "Unknown error"}`,
        className: "border-l-4 border-l-red-600 bg-white shadow-lg text-red-900 min-w-[400px] max-w-[500px] w-full",
      });
    } finally {
      setLoading(false);
    }
  }, [amountPaise, planName, notes, prefill, user]);

  return (
    <Button disabled={loading} onClick={onClick} className={className}>
      {loading ? "Opening…" : label}
    </Button>
  );
}