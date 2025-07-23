
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import SearchSection from '@/components/SearchSection';
import DirectorySection from '@/components/DirectorySection';
import RealEstateSlider from '@/components/RealEstateSlider';
import FeaturedProperties from '@/components/FeaturedProperties';
import Services from '@/components/Services';
import WhyUseSection from '@/components/WhyUseSection';
import Stats from '@/components/Stats';
import CustomerTestimonials from '@/components/CustomerTestimonials';
import MobileAppSection from '@/components/MobileAppSection';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Marquee at the very top */}
      <Marquee />
      {/* Header overlapping with content */}
      <Header />
      {/* Content starts immediately after marquee */}
      <div className="pt-8"> {/* Reduced padding to allow header overlap */}
        <div className="relative">
          <SearchSection />
          <DirectorySection />
        </div>
        <RealEstateSlider />
        <FeaturedProperties />
        <Services />
        <WhyUseSection />
        <Stats />
        <CustomerTestimonials />
        <MobileAppSection />
        <Footer />
      </div>
      <ChatBot />
    </div>
  );
};

export default Index;
