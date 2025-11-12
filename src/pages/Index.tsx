
import { useEffect, useRef, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import SearchSection, { SearchSectionRef } from '@/components/SearchSection';
import DirectorySection from '@/components/DirectorySection';
import Services from '@/components/Services';
import WhyUseSection from '@/components/WhyUseSection';
import Stats from '@/components/Stats';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import RealEstateSlider from '@/components/RealEstateSlider';
import FeaturedProperties from '@/components/FeaturedProperties';
import MobilePostPropertyBanner from '@/components/MobilePostPropertyBanner';
import ScrollableSection from '@/components/ScrollableSection';

// Lazy load heavy components
import { 
  LazyHomeServices,
  LazyCustomerTestimonials,
  LazyMobileAppSection 
} from '@/components/LazyComponents';

// Import loading skeletons
import {
  HomeServicesSkeleton,
  CustomerTestimonialsSkeleton,
  MobileAppSectionSkeleton
} from '@/components/LoadingSkeletons';

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
      <div className="md:pt-8"> {/* Only add padding on desktop where marquee is visible */}
        <div className="relative">
          <SearchSection ref={searchSectionRef} />
          <DirectorySection />
        </div>
        
        <MobilePostPropertyBanner />
        
        <RealEstateSlider />
        
        {/* Additional Scrollable Sections */}
        <ScrollableSection
          title="Featured Partners"
          items={[
            { id: 'partner-1', name: 'Partner One', description: 'Premium Real Estate Solutions' },
            { id: 'partner-2', name: 'Partner Two', description: 'Trusted Property Advisors' },
            { id: 'partner-3', name: 'Partner Three', description: 'Expert Consultation Services' },
            { id: 'partner-4', name: 'Partner Four', description: 'Quality Home Builders' },
            { id: 'partner-5', name: 'Partner Five', description: 'Luxury Property Specialists' },
            { id: 'partner-6', name: 'Partner Six', description: 'Commercial Space Experts' },
          ]}
        />
        
        <ScrollableSection
          title="Top Locations"
          items={[
            { id: 'location-1', name: 'Downtown District', description: 'Prime Urban Location' },
            { id: 'location-2', name: 'Waterfront Area', description: 'Scenic Views & Access' },
            { id: 'location-3', name: 'Business Park', description: 'Commercial Hub' },
            { id: 'location-4', name: 'Residential Zone', description: 'Family-Friendly Community' },
            { id: 'location-5', name: 'Luxury Enclave', description: 'Exclusive Properties' },
            { id: 'location-6', name: 'Suburban Heights', description: 'Peaceful Living' },
          ]}
        />
        
        <ScrollableSection
          title="Property Types"
          items={[
            { id: 'type-1', name: 'Apartments', description: 'Modern Living Spaces' },
            { id: 'type-2', name: 'Villas', description: 'Luxury Homes' },
            { id: 'type-3', name: 'Commercial', description: 'Business Properties' },
            { id: 'type-4', name: 'Land Plots', description: 'Investment Opportunities' },
            { id: 'type-5', name: 'Penthouse', description: 'Premium Residences' },
            { id: 'type-6', name: 'Townhouses', description: 'Spacious Family Homes' },
          ]}
        />
        
        <ScrollableSection
          title="Investment Opportunities"
          items={[
            { id: 'invest-1', name: 'High ROI Projects', description: 'Maximum Returns' },
            { id: 'invest-2', name: 'Pre-Launch Offers', description: 'Early Bird Benefits' },
            { id: 'invest-3', name: 'Rental Properties', description: 'Steady Income' },
            { id: 'invest-4', name: 'Resale Properties', description: 'Ready to Move In' },
            { id: 'invest-5', name: 'Luxury Investments', description: 'Premium Assets' },
            { id: 'invest-6', name: 'Budget-Friendly', description: 'Affordable Options' },
          ]}
        />
        
        <Suspense fallback={<HomeServicesSkeleton />}>
          <LazyHomeServices />
        </Suspense>
        
        {/* <FeaturedProperties /> */}
        
        <Services />
        <WhyUseSection />
        <Stats />
        
        <Suspense fallback={<CustomerTestimonialsSkeleton />}>
          <LazyCustomerTestimonials />
        </Suspense>
        
        <Suspense fallback={<MobileAppSectionSkeleton />}>
          <LazyMobileAppSection />
        </Suspense>
        <Footer searchSectionRef={searchSectionRef} />
      </div>
      <ChatBot />
    </div>
  );
};

export default Index;
