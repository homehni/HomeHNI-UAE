import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-8">
            Your payment was cancelled or failed to process. Don't worry, no charges were made to your account.
          </p>
          <div className="space-y-4">
            <Link 
              to="/" 
              className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Return to Home
            </Link>
            <div>
              <button 
                onClick={() => window.history.back()} 
                className="text-primary hover:text-primary/80 underline text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFailed;