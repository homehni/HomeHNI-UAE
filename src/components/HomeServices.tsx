import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HomeServices = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const services = [
    {
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center',
      title: 'Loans',
      onClick: () => navigate('/loans')
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      title: 'Home Security Services',
      onClick: () => navigate('/home-security-services')
    },
    {
      image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=300&fit=crop&crop=center',
      title: 'Legal Services',
      onClick: () => navigate('/legal-services')
    },
    {
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center',
      title: 'Handover Services',
      onClick: () => navigate('/handover-services')
    },
    {
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center',
      title: 'Property Management Services',
      onClick: () => navigate('/property-management')
    },
    {
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop&crop=center',
      title: 'Architects',
      onClick: () => navigate('/architects')
    },
    {
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
      title: 'Interior Designers',
      onClick: () => navigate('/interior')
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      title: 'Packers & Movers',
      onClick: () => navigate('/packers-movers')
    },
    {
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center',
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
    
    const scrollAmount = 320; // Width of one card plus gap
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
        // Reset to beginning smoothly
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: 1, behavior: 'auto' });
      }
    };

    const interval = setInterval(autoScroll, 20);
    return () => clearInterval(interval);
  }, [isHovered]);


  return (
    <section className="py-8 md:py-12 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Home Services</h2>
        </div>

        {/* Scroll Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
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
              className="flex-shrink-0 w-80 cursor-pointer group hover:scale-105 transition-all duration-300"
            >
              <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 h-full">
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {service.badge && (
                    <div className={`absolute top-4 left-4 ${service.badgeColor} text-gray-800 px-3 py-1 rounded-full text-sm font-bold shadow-md`}>
                      {service.badge}
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Service Title */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 text-center">
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