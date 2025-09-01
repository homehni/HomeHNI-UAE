import React from 'react';
import SearchSection from '@/components/SearchSection';
import DirectorySection from '@/components/DirectorySection';
import RealEstateSlider from '@/components/RealEstateSlider';
import HomeServices from '@/components/HomeServices';
import Services from '@/components/Services';
import Stats from '@/components/Stats';
import CustomerTestimonials from '@/components/CustomerTestimonials';
import MobileAppSection from '@/components/MobileAppSection';
import WhyUseSection from '@/components/WhyUseSection';
import FeaturedProperties from '@/components/FeaturedProperties';

interface PageSection {
  id: string;
  section_type: string;
  content: any;
  sort_order: number;
  page_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SectionRendererProps {
  section: PageSection;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  if (!section.is_active) {
    return null;
  }

  const renderSection = () => {
    switch (section.section_type) {
      case 'hero_search':
        return <SearchSection />;
      
      case 'services':
        return <Services />;
      
      case 'stats':
        return <Stats />;
      
      case 'directory':
        return <DirectorySection />;
      
      case 'real_estate_slider':
        return <RealEstateSlider />;
      
      case 'home_services':
        return <HomeServices />;
      
      case 'featured_properties':
        return <FeaturedProperties />;
      
      case 'testimonials':
        return <CustomerTestimonials />;
      
      case 'mobile_app':
        return <MobileAppSection />;
      
      case 'why_use':
        return <WhyUseSection />;
      
      default:
        return (
          <div className="py-8 px-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-gray-600">
              Unknown section type: <strong>{section.section_type}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This section type needs to be implemented in the SectionRenderer component.
            </p>
          </div>
        );
    }
  };

  return (
    <div data-section-id={section.id} data-section-type={section.section_type}>
      {renderSection()}
    </div>
  );
};