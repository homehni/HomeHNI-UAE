
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
        <div className="relative pb-20 sm:pb-0">
          <SearchSection ref={searchSectionRef} />
          <DirectorySection />
        </div>
        
        {/* <MobilePostPropertyBanner /> */}
        
        {/* Additional Scrollable Sections */}
        <ScrollableSection
          title="Featured Partners"
          items={[
            { id: 'partner-1', name: 'Emaar Properties', description: 'Premium Real Estate Solutions', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop' },
            { id: 'partner-2', name: 'Dubai Properties', description: 'Trusted Property Advisors', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop' },
            { id: 'partner-3', name: 'Nakheel Developers', description: 'Expert Consultation Services', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop' },
            { id: 'partner-4', name: 'Damac Properties', description: 'Quality Home Builders', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop' },
            { id: 'partner-5', name: 'Sobha Realty', description: 'Luxury Property Specialists', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop' },
            { id: 'partner-6', name: 'Meraas Holdings', description: 'Commercial Space Experts', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop' },
            { id: 'partner-7', name: 'Aldar Properties', description: 'Abu Dhabi Real Estate Leaders', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=300&fit=crop' },
            { id: 'partner-8', name: 'MAG Properties', description: 'Innovative Development Solutions', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop' },
            { id: 'partner-9', name: 'Azizi Developments', description: 'Modern Living Communities', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop' },
            { id: 'partner-10', name: 'Ellington Properties', description: 'Boutique Residential Projects', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop' },
            { id: 'partner-11', name: 'Select Group', description: 'Premium Lifestyle Developments', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop' },
            { id: 'partner-12', name: 'Omniyat Properties', description: 'Ultra-Luxury Real Estate', image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=400&h=300&fit=crop' },
          ]}
        />
        
        <ScrollableSection
          title="Top Locations"
          items={[
            { id: 'location-1', name: 'Downtown Dubai', description: 'Prime Urban Location', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' },
            { id: 'location-2', name: 'Dubai Marina', description: 'Scenic Views & Access', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
            { id: 'location-3', name: 'Business Bay', description: 'Commercial Hub', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop' },
            { id: 'location-4', name: 'Jumeirah Village', description: 'Family-Friendly Community', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop' },
            { id: 'location-5', name: 'Palm Jumeirah', description: 'Exclusive Properties', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop' },
            { id: 'location-6', name: 'Arabian Ranches', description: 'Peaceful Living', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop' },
            { id: 'location-7', name: 'Dubai Hills Estate', description: 'Golf Course Living', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop' },
            { id: 'location-8', name: 'JBR - Jumeirah Beach', description: 'Beachfront Lifestyle', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop' },
            { id: 'location-9', name: 'Dubai Sports City', description: 'Active Living Community', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
            { id: 'location-10', name: 'Al Barsha', description: 'Central Location', image: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=400&h=300&fit=crop' },
            { id: 'location-11', name: 'Dubai Silicon Oasis', description: 'Tech Hub District', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop' },
            { id: 'location-12', name: 'Emirates Hills', description: 'Luxury Gated Community', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop' },
          ]}
        />
        
        <ScrollableSection
          title="Property Types"
          items={[
            { id: 'type-1', name: 'Apartments', description: 'Modern Living Spaces', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop' },
            { id: 'type-2', name: 'Villas', description: 'Luxury Homes', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop' },
            { id: 'type-3', name: 'Commercial', description: 'Business Properties', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop' },
            { id: 'type-4', name: 'Land Plots', description: 'Investment Opportunities', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop' },
            { id: 'type-5', name: 'Penthouse', description: 'Premium Residences', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop' },
            { id: 'type-6', name: 'Townhouses', description: 'Spacious Family Homes', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop' },
            { id: 'type-7', name: 'Studio Apartments', description: 'Compact & Affordable', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop' },
            { id: 'type-8', name: 'Duplex Apartments', description: 'Two-Level Living', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=300&fit=crop' },
            { id: 'type-9', name: 'Offices', description: 'Commercial Workspaces', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop' },
            { id: 'type-10', name: 'Retail Spaces', description: 'Shop & Showroom Units', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop' },
            { id: 'type-11', name: 'Warehouses', description: 'Storage & Logistics', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
            { id: 'type-12', name: 'Hotel Apartments', description: 'Serviced Living', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
          ]}
        />
        
        <ScrollableSection
          title="Investment Opportunities"
          items={[
            { id: 'invest-1', name: 'High ROI Projects', description: 'Maximum Returns', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop' },
            { id: 'invest-2', name: 'Pre-Launch Offers', description: 'Early Bird Benefits', image: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=400&h=300&fit=crop' },
            { id: 'invest-3', name: 'Rental Properties', description: 'Steady Income', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop' },
            { id: 'invest-4', name: 'Resale Properties', description: 'Ready to Move In', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop' },
            { id: 'invest-5', name: 'Luxury Investments', description: 'Premium Assets', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop' },
            { id: 'invest-6', name: 'Budget-Friendly', description: 'Affordable Options', image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=400&h=300&fit=crop' },
            { id: 'invest-7', name: 'Off-Plan Projects', description: 'Future Value Growth', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop' },
            { id: 'invest-8', name: 'Payment Plans', description: 'Flexible Installments', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop' },
            { id: 'invest-9', name: 'Golden Visa Eligible', description: 'Residency Benefits', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=300&fit=crop' },
            { id: 'invest-10', name: 'Waterfront Properties', description: 'Prime Locations', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop' },
            { id: 'invest-11', name: 'Golf Course Views', description: 'Exclusive Lifestyle', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop' },
            { id: 'invest-12', name: 'Beachfront Units', description: 'Coastal Living', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop' },
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
