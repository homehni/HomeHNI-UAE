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
      subtitle: 'FLAT 25% OFF',
      onClick: () => navigate('/painting-cleaning')
    },
    {
      icon: Home,
      title: 'Home Cleaning',
      subtitle: 'STARTS @ ₹399',
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
      title: 'Rental Agreement',
      subtitle: 'ONLINE PROCESS',
      onClick: () => navigate('/rental-agreement')
    },
    {
      icon: CreditCard,
      title: 'Rent Payment',
      subtitle: 'SECURE & EASY',
      onClick: () => {}
    },
    {
      icon: Wrench,
      title: 'Plumbing Services',
      subtitle: '24/7 AVAILABLE',
      onClick: () => {}
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
      icon: ClipboardList,
      title: 'Property Valuation',
      subtitle: 'FREE ESTIMATE',
      onClick: () => {}
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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Home Services</h2>
          <button className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1">
            See All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-6 w-fit animate-fade-in">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  onClick={service.onClick}
                  className="relative flex-shrink-0 w-80 h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                >
                  {/* Service content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold w-fit shadow-md">
                      {service.subtitle}
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-6 translate-x-6"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/10 rounded-full translate-y-4 -translate-x-4"></div>
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