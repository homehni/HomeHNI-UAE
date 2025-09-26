import { useCallback, useState } from "react";
import { loadRazorpayScript } from "@/lib/loadRazorpay";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
          title: "Configuration Error",
          description: "Razorpay key not configured. Please set up your Razorpay key in environment variables.",
          variant: "destructive",
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
          console.log("Payment successful:", response);
          // Minimal client-only success handling
          // TODO: On real flow, post response to backend for verification.
          toast({
            title: "Payment Successful!",
            description: "Redirecting to confirmation page...",
          });
          
          // Send comprehensive payment emails
          try {
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
          } catch (error) {
            console.error('Failed to send payment confirmation emails:', error);
          }
          
          setTimeout(() => {
            window.location.href = `/payment/success?payment_id=${response.razorpay_payment_id || ""}`;
          }, 1000);
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal dismissed");
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled by user.",
              variant: "destructive",
            });
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
        title: "Payment Error",
        description: `Payment setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [amountPaise, planName, notes, prefill, toast]);

  return (
    <Button disabled={loading} onClick={onClick} className={className}>
      {loading ? "Opening…" : label}
    </Button>
  );
}