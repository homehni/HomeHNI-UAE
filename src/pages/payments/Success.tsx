import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentSuccess() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const paymentId = params.get("payment_id") || "N/A";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase! Your payment has been processed successfully.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 mb-8">
            <p className="text-sm text-muted-foreground mb-2">Payment ID:</p>
            <p className="font-mono text-sm">{paymentId}</p>
          </div>
          <div className="space-y-4">
            <Link 
              to="/" 
              className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Return to Home
            </Link>
            <div>
              <Link 
                to="/dashboard" 
                className="text-primary hover:text-primary/80 underline text-sm"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}