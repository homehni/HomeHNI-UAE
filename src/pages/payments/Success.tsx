import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";

const PaymentSuccess = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const paymentId = params.get("payment_id") || "N/A";

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 lg:pb-16">
        <div className="max-w-lg sm:max-w-xl mx-auto text-center">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4 sm:mb-6" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Payment Successful!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-2">
            Thank you for your purchase! Your payment has been processed successfully.
          </p>
          <div className="bg-muted/50 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8 mx-2 sm:mx-0">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Payment ID:</p>
            <p className="font-mono text-xs sm:text-sm break-all">{paymentId}</p>
          </div>
          <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
            <Link 
              to="/" 
              className="inline-block w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors text-sm sm:text-base"
            >
              Return to Home
            </Link>
            <div>
              <Link 
                to="/dashboard?tab=payments" 
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
};

export default PaymentSuccess;
