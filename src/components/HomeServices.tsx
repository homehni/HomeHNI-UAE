import React, { useEffect, useRef } from 'react';
import { 
  Paintbrush, 
  Truck, 
  FileText, 
  Calculator, 
  CreditCard, 
  Shield, 
  Home, 
  ClipboardList,
  Wrench,
  Receipt,
  Building,
  Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomeServices = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const services = [
    {
      icon: Paintbrush,
      title: 'Home Painting',
      subtitle: 'PROFESSIONAL',
      onClick: () => navigate('/painting-cleaning')
    },
    {
      icon: Home,
      title: 'Home Cleaning',
      subtitle: 'EXPERTS',
      onClick: () => navigate('/painting-cleaning')
    },
    {
      icon: Truck,
      title: 'Packers & Movers',
      subtitle: 'FREE QUOTE',
      onClick: () => navigate('/packers-movers')
    },
    {
      icon: FileText,
      title: 'Loans',
      subtitle: 'ONLINE PROCESS',
      onClick: () => navigate('/loans')
    },
    {
      icon: CreditCard,
      title: 'Home Security Services',
      subtitle: 'SECURE & EASY',
      onClick: () => navigate('/home-security-services')
    },
    {
      icon: Wrench,
      title: 'Architect',
      subtitle: 'CREATIVE',
      onClick: () => navigate('/architects')
    },
    {
      icon: Calculator,
      title: 'EMI Calculator',
      subtitle: 'INSTANT RESULTS',
      onClick: () => navigate('/rent-calculator')
    },
    {
      icon: Shield,
      title: 'Legal Services',
      subtitle: 'EXPERT ADVICE',
      onClick: () => navigate('/legal-services')
    },
    {
      icon: Receipt,
      title: 'Rent Receipt',
      subtitle: 'INSTANT GENERATE',
      onClick: () => navigate('/rent-receipts')
    },
    {
      icon: Building,
      title: 'Property Management',
      subtitle: 'FULL SERVICE',
      onClick: () => navigate('/property-management')
    },
    {
      icon: Key,
      title: 'Handover Services',
      subtitle: 'SMOOTH TRANSITION',
      onClick: () => navigate('/handover-services')
    }
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollSpeed = 30;
    let isScrollingRight = true;
    let isPaused = false;

    const autoScroll = () => {
      if (isPaused) return;

      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      
      if (maxScroll <= 0) return; // No need to scroll if content fits

      if (isScrollingRight) {
        scrollAmount += scrollStep;
        if (scrollAmount >= maxScroll) {
          isScrollingRight = false;
        }
      } else {
        scrollAmount -= scrollStep;
        if (scrollAmount <= 0) {
          isScrollingRight = true;
        }
      }
      
      scrollContainer.scrollLeft = scrollAmount;
    };

    const intervalId = setInterval(autoScroll, scrollSpeed);

    // Pause on hover
    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(intervalId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Home Services</h2>
        </div>

        <div 
          ref={scrollRef}
          className="overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-3 sm:gap-4 md:gap-6 w-fit animate-fade-in">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  onClick={service.onClick}
                  className="relative flex-shrink-0 w-64 h-36 sm:w-72 sm:h-40 md:w-80 md:h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                >
                  {/* Service content */}
                  <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-2">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-primary transition-colors leading-tight">
                          {service.title}
                        </h3>
                      </div>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold w-fit shadow-md">
                      {service.subtitle}
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/5 rounded-full -translate-y-4 translate-x-4 sm:-translate-y-5 sm:translate-x-5 md:-translate-y-6 md:translate-x-6"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-full translate-y-3 -translate-x-3 md:translate-y-4 md:-translate-x-4"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeServices;