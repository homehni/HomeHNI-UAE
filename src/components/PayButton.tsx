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
      await loadRazorpayScript();

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID as string;
      if (!key) {
        toast({
          title: "Configuration Error",
          description: "Razorpay key missing. Please contact support.",
          variant: "destructive",
        });
        return;
      }

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
        handler: function (response: any) {
          // Minimal client-only success handling
          // TODO: On real flow, post response to backend for verification.
          toast({
            title: "Payment Successful!",
            description: "Redirecting to confirmation page...",
          });
          setTimeout(() => {
            window.location.href = `/payment/success?payment_id=${response.razorpay_payment_id || ""}`;
          }, 1000);
        },
        modal: {
          ondismiss: function () {
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

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "Payment popup failed to open. Try again.",
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