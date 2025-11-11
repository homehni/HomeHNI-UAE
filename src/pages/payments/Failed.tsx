import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16 pt-16 md:pt-24">
        <div className="max-w-xl mx-auto text-center">
          <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4 md:mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Payment Cancelled</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-4">
            Your payment was cancelled or failed to process. Don't worry, no charges were made to your account.
          </p>
          <div className="space-y-3 md:space-y-4 px-4">
            <Link 
              to="/" 
              className="inline-block bg-brand-red text-white hover:bg-brand-maroon-dark px-4 md:px-6 py-2 md:py-3 rounded-md font-medium transition-colors text-sm md:text-base w-full sm:w-auto"
            >
              Return to Home
            </Link>
            <div>
              <button 
                onClick={() => window.history.back()} 
                className="text-brand-red hover:text-brand-red/80 underline text-xs md:text-sm"
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
