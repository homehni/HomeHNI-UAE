
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

// Lazy load heavy components
import { 
  LazyFeaturedProperties, 
  LazyRealEstateSlider, 
  LazyHomeServices,
  LazyCustomerTestimonials,
  LazyMobileAppSection 
} from '@/components/LazyComponents';

// Import loading skeletons
import {
  FeaturedPropertiesSkeleton,
  RealEstateSliderSkeleton,
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
      <div className="pt-8"> {/* Reduced padding to allow header overlap */}
        <div className="relative">
          <SearchSection ref={searchSectionRef} />
          <DirectorySection />
        </div>
        
        <Suspense fallback={<RealEstateSliderSkeleton />}>
          <LazyRealEstateSlider />
        </Suspense>
        
        <Suspense fallback={<HomeServicesSkeleton />}>
          <LazyHomeServices />
        </Suspense>
        
        <Suspense fallback={<FeaturedPropertiesSkeleton />}>
          <LazyFeaturedProperties />
        </Suspense>
        
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
