import React, { useEffect, useRef } from 'react';
import { Home, Building, TrendingUp, MapPin, Users, ShoppingBag, Briefcase, BarChart3, Building2, PlusCircle } from 'lucide-react';

const MobilePropertyServices = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const services = [
    { icon: Home, label: 'Buy', hasNew: false },
    { icon: Building, label: 'Rent', hasNew: false },
    { icon: TrendingUp, label: 'Invest', hasNew: true },
    { icon: MapPin, label: 'Plot / Land', hasNew: false },
    { icon: Users, label: 'Co-working Spaces', hasNew: false },
    { icon: ShoppingBag, label: 'Buy Commercial', hasNew: false },
    { icon: Briefcase, label: 'Lease Commercial', hasNew: false },
    { icon: BarChart3, label: 'Insights', hasNew: true },
    { icon: Building2, label: 'PG', hasNew: false },
    { icon: PlusCircle, label: 'Post a property', hasNew: false }
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
    <section className="sm:hidden bg-white pb-8 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get started with</h2>
        <p className="text-gray-600">Explore real estate options in top cities</p>
      </div>
      
      <div 
        ref={scrollRef}
        className="overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-4 px-4 animate-fade-in" style={{ width: 'fit-content' }}>
          {services.map((service, index) => (
            <div key={index} className="relative bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center min-h-[100px] hover:bg-gray-100 transition-colors flex-shrink-0 hover-scale" style={{ width: 'calc((100vw - 48px) / 2)' }}>
              {service.hasNew && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  NEW
                </span>
              )}
              <service.icon className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-700 text-center leading-tight">
                {service.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobilePropertyServices;
