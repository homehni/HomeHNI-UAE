import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const HomeServices = () => {
  const navigate = useNavigate();
  const autoplay = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    dragFree: false,
    skipSnaps: false,
    align: 'start',
    containScroll: 'trimSnaps'
  }, [autoplay.current]);

  const services = [
    {
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center',
      title: 'Painting & Cleaning',
      badge: 'FLAT 25% OFF',
      badgeColor: 'bg-amber-400',
      onClick: () => navigate('/painting-cleaning')
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      title: 'Packers & Movers',
      onClick: () => navigate('/packers-movers')
    },
    {
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center',
      title: 'Handover Services',
      onClick: () => navigate('/handover-services')
    },
    {
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center',
      title: 'Loans',
      onClick: () => navigate('/loans')
    },
    {
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center',
      title: 'Home Security Services',
      onClick: () => navigate('/home-security-services')
    },
    {
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop&crop=center',
      title: 'Legal Services',
      onClick: () => navigate('/legal-services')
    },
    {
      image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop&crop=center',
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
    }
  ];


  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Home Services</h2>
        </div>

        {/* Scrolling Services - All Screen Sizes */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={service.onClick}
                className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] group cursor-pointer hover-scale"
              >
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 h-full animate-fade-in">
                  {/* Service Image */}
                  <div className="relative overflow-hidden h-32 sm:h-36 lg:h-40">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    {service.badge && (
                      <div className={`absolute top-2 left-2 lg:top-4 lg:left-4 ${service.badgeColor} text-gray-800 px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-bold shadow-md`}>
                        {service.badge}
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Service Title */}
                  <div className="p-3 lg:p-4">
                    <h3 className="text-sm lg:text-base font-bold text-gray-900 text-center leading-tight">
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