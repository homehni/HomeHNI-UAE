import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';

const HomeServices = () => {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    dragFree: true,
    skipSnaps: false 
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const services = [
    {
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center',
      title: 'Home Painting',
      badge: 'FLAT 25% OFF',
      badgeColor: 'bg-amber-400',
      onClick: () => navigate('/painting-cleaning'),
      size: 'large'
    },
    {
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=center',
      title: 'Home Cleaning',
      badge: 'STARTS @ ₹399',
      badgeColor: 'bg-amber-400',
      onClick: () => navigate('/painting-cleaning'),
      size: 'large'
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      title: 'Packers & Movers',
      onClick: () => navigate('/packers-movers'),
      size: 'small'
    },
    {
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center',
      title: 'Rental Agreement',
      onClick: () => navigate('/rental-agreement'),
      size: 'small'
    },
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center',
      title: 'Rent Payment',
      onClick: () => navigate('/rent-receipts'),
      size: 'small'
    },
    {
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center',
      title: 'Plumbing & Carpentry',
      onClick: () => navigate('/handover-services'),
      size: 'small'
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!emblaApi || isHovered) return;

    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, 3000);
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [emblaApi, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'w-80 h-48'; // Large cards for featured services
      case 'small':
        return 'w-64 h-44'; // Small square cards
      default:
        return 'w-64 h-48'; // Default size
    }
  };

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Home Services</h2>
        </div>

        {/* Desktop and Tablet Scrolling View */}
        <div className="hidden md:block">
          <div 
            className="overflow-hidden" 
            ref={emblaRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex gap-6 pl-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  onClick={service.onClick}
                  className={`flex-none ${getSizeClasses(service.size)} relative group cursor-pointer hover:scale-105 transition-all duration-300`}
                >
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 w-full h-full">
                    {/* Service Image */}
                    <div className="relative overflow-hidden h-3/4">
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
                    <div className="p-4 h-1/4 flex items-center justify-center">
                      <h3 className="text-sm font-bold text-gray-900 text-center">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Grid View */}
        <div className="md:hidden">
          {/* Large cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {services.filter(service => service.size === 'large').map((service, index) => (
              <div
                key={index}
                onClick={service.onClick}
                className="relative group cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
                  {/* Service Image */}
                  <div className="relative h-40 overflow-hidden">
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

          {/* Small cards grid */}
          <div className="grid grid-cols-2 gap-4">
            {services.filter(service => service.size === 'small').map((service, index) => (
              <div
                key={index}
                onClick={service.onClick}
                className="relative group cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
                  {/* Service Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Service Title */}
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 text-center">
                      {service.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeServices;