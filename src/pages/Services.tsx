import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import ChatBot from '@/components/ChatBot';
const Services = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />

      <main className="pt-24">
        <div className="container mx-auto px-4 pt-6 md:pt-12 pb-10">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Services</h1>
            <p className="text-gray-600">No services available at this time.</p>
          </div>
        </div>
      </main>

      <Footer />
      
      <ChatBot />
    </div>
  );
};

export default Services;
