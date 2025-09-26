import { useCallback, useState } from "react";
import { loadRazorpayScript } from "@/lib/loadRazorpay";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
        toast.error("Payment configuration error. Please try again later.");
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
                toast.error("Payment successful but failed to save record. Please contact support.");
                return;
              }
            }
            
            // Send comprehensive payment emails
            if (prefill?.email) {
              const { 
                sendPlanActivatedEmail, 
                sendPaymentSuccessEmail, 
                sendPaymentInvoiceEmail 
              } = await import('@/services/emailService');
              
              const currentDate = new Date().toLocaleDateString('en-IN');
              const expiryDate = new Date();
              expiryDate.setFullYear(expiryDate.getFullYear() + 1);
              const invoiceNumber = `INV-${Date.now()}`;
              
              // Send all three emails simultaneously
              await Promise.all([
                sendPlanActivatedEmail(
                  prefill.email,
                  prefill.name || 'Valued Customer',
                  {
                    expiryDate: expiryDate.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }
                ),
                sendPaymentSuccessEmail(
                  prefill.email,
                  prefill.name || 'Valued Customer',
                  {
                    planName: planName,
                    amount: amountPaise / 100,
                    paymentId: response.razorpay_payment_id,
                    expiryDate: expiryDate.toLocaleDateString('en-IN')
                  }
                ),
                sendPaymentInvoiceEmail(
                  prefill.email,
                  prefill.name || 'Valued Customer',
                  {
                    invoiceNumber: invoiceNumber,
                    planName: planName,
                    amount: amountPaise / 100,
                    paymentDate: currentDate,
                    paymentId: response.razorpay_payment_id
                  }
                )
              ]);
            }
            
            toast.success("Payment Successful!", {
              description: "Your payment has been processed and plan activated successfully.",
              duration: 5000,
              style: {
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
              },
            });
            
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
            
            toast.error("Payment Failed", {
              description: error instanceof Error ? error.message : "Please try again or contact support.",
              duration: 5000,
              style: {
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
              },
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
      toast.error("Payment setup failed", {
        description: `${error instanceof Error ? error.message : "Unknown error"}`,
        duration: 4000,
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