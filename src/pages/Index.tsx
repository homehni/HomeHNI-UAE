
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import SearchSection, { SearchSectionRef } from '@/components/SearchSection';
import DirectorySection from '@/components/DirectorySection';
import MobilePropertyServices from '@/components/MobilePropertyServices';
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
  const location = useLocation();
  const searchSectionRef = useRef<SearchSectionRef>(null);
  
  useEffect(() => {
    if (location.state?.scrollToSearch) {
      setTimeout(() => {
        const heroSearchElement = document.getElementById('hero-search');
        if (heroSearchElement) {
          heroSearchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Focus the search input after scrolling
          if (searchSectionRef.current) {
            searchSectionRef.current.focusSearchInput();
          }
        }
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white">
      {/* Marquee at the very top */}
      <Marquee />
      {/* Header overlapping with content */}
      <Header />
      {/* Content starts immediately after marquee */}
      <div className="pt-8"> {/* Reduced padding to allow header overlap */}
        <div className="relative">
          <SearchSection ref={searchSectionRef} />
          <DirectorySection />
        </div>
        <MobilePropertyServices />
        <RealEstateSlider />
        <FeaturedProperties />
        <Services />
        <WhyUseSection />
        <Stats />
        <CustomerTestimonials />
        <MobileAppSection />
        <Footer searchSectionRef={searchSectionRef} />
      </div>
      <ChatBot />
    </div>
  );
};

export default Index;
