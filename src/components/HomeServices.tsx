import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HomeServices = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const services = [
    {
      icon: '🏠',
      title: 'Loans',
      description: 'Get the best home loan deals with competitive interest rates and quick processing.',
      onClick: () => navigate('/loans')
    },
    {
      icon: '🔒',
      title: 'Home Security Services',
      description: 'Complete security solutions for your home with advanced monitoring systems.',
      onClick: () => navigate('/home-security-services')
    },
    {
      icon: '⚖️',
      title: 'Legal Services',
      description: 'Expert legal assistance for property documentation and legal compliance.',
      onClick: () => navigate('/legal-services')
    },
    {
      icon: '📋',
      title: 'Handover Services',
      description: 'Seamless property handover with complete inspection and documentation.',
      onClick: () => navigate('/handover-services')
    },
    {
      icon: '🏢',
      title: 'Property Management',
      description: 'Professional property management services for hassle-free rental income.',
      onClick: () => navigate('/property-management')
    },
    {
      icon: '📐',
      title: 'Architects',
      description: 'Connect with certified architects for your dream home design and construction.',
      onClick: () => navigate('/architects')
    },
    {
      icon: '🎨',
      title: 'Interior Designers',
      description: 'Transform your space with expert interior design and decoration services.',
      onClick: () => navigate('/interior')
    },
    {
      icon: '📦',
      title: 'Packers & Movers',
      description: 'Reliable packing and moving services for safe relocation of your belongings.',
      onClick: () => navigate('/packers-movers')
    },
    {
      icon: '🎨',
      title: 'Painting & Cleaning',
      badge: 'FLAT 25% OFF',
      badgeColor: 'bg-amber-400',
      description: 'Professional painting and deep cleaning services for your property.',
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
        // Very smooth scroll - smaller increment for fluid motion
        scrollContainer.scrollLeft += 0.5;
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
              <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 h-48 p-4">
                {/* Badge */}
                {service.badge && (
                  <div className={`absolute top-3 right-3 ${service.badgeColor} text-gray-800 px-2 py-1 rounded text-xs font-bold`}>
                    {service.badge}
                  </div>
                )}
                
                {/* Service Icon */}
                <div className="flex justify-center mb-3">
                  <div className="text-3xl bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center">
                    {service.icon}
                  </div>
                </div>

                {/* Service Title */}
                <div className="text-center">
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
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