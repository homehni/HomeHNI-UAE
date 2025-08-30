import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import service images
import homeSecurityImage from '@/assets/home-security-services.jpg';
import legalServicesImage from '@/assets/legal-services.jpg';
import handoverServicesImage from '@/assets/handover-services.jpg';
import propertyManagementImage from '@/assets/property-management.jpg';
import architectsImage from '@/assets/architects.jpg';
import interiorDesignImage from '@/assets/interior-design.jpg';
import packersMoversImage from '@/assets/packers-movers-hero.jpg';
import paintingCleaningImage from '@/assets/painting-cleaning.jpg';
import loansImage from '@/assets/loans.jpg';

const HomeServices = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const services = [
    {
      image: loansImage,
      title: 'Loans',
      onClick: () => navigate('/loans')
    },
    {
      image: homeSecurityImage,
      title: 'Home Security Services',
      onClick: () => navigate('/home-security-services')
    },
    {
      image: legalServicesImage,
      title: 'Legal Services',
      onClick: () => navigate('/legal-services')
    },
    {
      image: handoverServicesImage,
      title: 'Handover Services',
      onClick: () => navigate('/handover-services')
    },
    {
      image: propertyManagementImage,
      title: 'Property Management',
      onClick: () => navigate('/property-management')
    },
    {
      image: architectsImage,
      title: 'Architects',
      onClick: () => navigate('/architects')
    },
    {
      image: interiorDesignImage,
      title: 'Interior Designers',
      onClick: () => navigate('/interior')
    },
    {
      image: packersMoversImage,
      title: 'Packers & Movers',
      onClick: () => navigate('/packers-movers')
    },
    {
      image: paintingCleaningImage,
      title: 'Painting & Cleaning',
      badge: 'FLAT 25% OFF',
      badgeColor: 'bg-amber-400',
      onClick: () => navigate('/painting-cleaning')
    }
  ];

  // Create infinite scroll by duplicating services
  const infiniteServices = [...services, ...services, ...services];

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    // Dynamic scroll amount based on viewport
    const cardWidth = 320; // Width of one card plus gap
    const viewportWidth = window.innerWidth;
    const scrollAmount = viewportWidth < 768 ? cardWidth * 2 : cardWidth * 3; // Scroll more cards at once
    
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const newScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const autoScroll = () => {
      if (isHovered) return;
      
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const currentScroll = scrollContainer.scrollLeft;
      
      if (currentScroll >= maxScroll * 0.66) {
        // Reset to beginning for infinite scroll
        scrollContainer.scrollLeft = 0;
      } else {
        // Increased scroll speed to match RealEstateSlider
        scrollContainer.scrollLeft += 1.5;
      }
    };

    // Use requestAnimationFrame for smoothest scrolling
    let animationId: number;
    const smoothScroll = () => {
      autoScroll();
      animationId = requestAnimationFrame(smoothScroll);
    };
    
    animationId = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);


  return (
    <section className="py-8 md:py-12 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Home Services</h2>
        </div>

        {/* Scroll Navigation Buttons - Hidden on mobile */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        
        <button
          onClick={() => scroll('right')}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>

        {/* Scrolling Container */}
        <div 
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {infiniteServices.map((service, index) => (
            <div
              key={index}
              onClick={service.onClick}
              className="flex-shrink-0 w-60 cursor-pointer group transition-all duration-300"
            >
              <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 h-48 overflow-hidden">
                {/* Badge */}
                {service.badge && (
                  <div className={`absolute top-3 right-3 z-10 ${service.badgeColor} text-gray-800 px-2 py-1 rounded text-xs font-bold`}>
                    {service.badge}
                  </div>
                )}
                
                {/* Service Image */}
                <div className="h-32 w-full overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Service Title */}
<div className="pt-2 px-4 text-center">
                  <h3 className="text-base font-bold text-gray-900">
                    {service.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServices;