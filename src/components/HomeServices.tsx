import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AUTO_SPEED_PX_PER_SEC = 300; // ⬅️ Increase/decrease to control auto-scroll speed

const HomeServices: React.FC = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const services = [
    {
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center',
      title: 'Loans',
      onClick: () => navigate('/loans'),
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      title: 'Home Security Services',
      onClick: () => navigate('/home-security-services'),
    },
    {
      image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=300&fit=crop&crop=center',
      title: 'Legal Services',
      onClick: () => navigate('/legal-services'),
    },
    {
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center',
      title: 'Handover Services',
      onClick: () => navigate('/handover-services'),
    },
    {
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center',
      title: 'Property Management Services',
      onClick: () => navigate('/property-management'),
    },
    {
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop&crop=center',
      title: 'Architects',
      onClick: () => navigate('/architects'),
    },
    {
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
      title: 'Interior Designers',
      onClick: () => navigate('/interior'),
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      title: 'Packers & Movers',
      onClick: () => navigate('/packers-movers'),
    },
    {
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center',
      title: 'Painting & Cleaning',
      badge: 'FLAT 25% OFF',
      badgeColor: 'bg-amber-400',
      onClick: () => navigate('/painting-cleaning'),
    },
  ];

  // Duplicate for seamless looping (3x)
  const infiniteServices = [...services, ...services, ...services];

  // Helper: advance one card (card width + gap)
  const getCardAdvance = () => {
    const el = scrollContainerRef.current;
    if (!el) return 320;
    const card = el.querySelector<HTMLElement>('.service-card');
    const styles = window.getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    return (card?.offsetWidth || 304) + gap; // default ~ (w-80 + gap)
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const delta = getCardAdvance() * (direction === 'left' ? -1 : 1);
    el.scrollTo({ left: el.scrollLeft + delta, behavior: 'smooth' });

    // If user scrolls left from start, wrap to the middle copy
    const oneSet = el.scrollWidth / 3;
    requestAnimationFrame(() => {
      if (el.scrollLeft < 0) el.scrollLeft += oneSet;
      if (el.scrollLeft > oneSet * 2) el.scrollLeft -= oneSet;
    });
  };

  // Time-based auto-scroll with rAF
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Start from the middle copy to allow seamless wrap in both directions
    const oneSet = el.scrollWidth / 3;
    el.scrollLeft = oneSet;

    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000; // seconds
      last = now;

      if (!isPaused) {
        el.scrollLeft += AUTO_SPEED_PX_PER_SEC * dt;

        // Seamless wrap
        const w = el.scrollWidth / 3;
        if (el.scrollLeft >= w * 2) {
          // Jump back by one set instantly (no visual jump because content is duplicated)
          el.scrollLeft -= w;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      // keep user within bounds on orientation/resize
      const w = el.scrollWidth / 3;
      if (el.scrollLeft >= w * 2) el.scrollLeft -= w;
      if (el.scrollLeft < 0) el.scrollLeft += w;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [isPaused]);

  return (
    <section className="py-8 md:py-12 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Home Services</h2>
        </div>

        {/* Scroll Navigation Buttons */}
        <button
          aria-label="Scroll left"
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>

        <button
          aria-label="Scroll right"
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>

        {/* Scrolling Container */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.overflow-x-auto::-webkit-scrollbar{display:none}`}</style>

          {infiniteServices.map((service, index) => (
            <div
              key={`${service.title}-${index}`}
              onClick={service.onClick}
              className="service-card flex-shrink-0 w-80 cursor-pointer group hover:scale-105 transition-all duration-300"
            >
              <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 h-full">
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Badge */}
                  {service.badge && (
                    <div
                      className={`absolute top-4 left-4 ${service.badgeColor} text-gray-800 px-3 py-1 rounded-full text-sm font-bold shadow-md`}
                    >
                      {service.badge}
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Service Title */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 text-center">{service.title}</h3>
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
