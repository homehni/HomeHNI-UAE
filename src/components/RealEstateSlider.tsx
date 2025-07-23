import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RealEstateSlider = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const slides = [
    {
      image: '/lovable-uploads/beee2872-8a8a-4331-9d4f-3d88ac1c9948.png',
      title: 'Invest in Real Estate',
    },
    {
      image: '/lovable-uploads/4668a80f-108d-4ef0-929c-b21403b6fdaa.png',
      title: 'Sell/Rent your property',
    },
    {
      image: '/lovable-uploads/981bce75-81a9-4afe-a63a-3efc7448e319.png',
      title: 'Plots/Land',
    },
    {
      image: '/lovable-uploads/e491693e-a750-42b7-bdf6-cdff47be335b.png',
      title: 'Explore Insights',
    },
    {
      image: '/lovable-uploads/982cdd16-c759-4f19-9526-09591d45d1d7.png',
      title: 'PG and co-living',
    },
    {
      image: '/lovable-uploads/adbf8e36-1860-4c28-9fa4-778552598b4b.png',
      title: 'Buying commercial spaces',
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="pb-16 bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            GET STARTED WITH EXPLORING REAL ESTATE OPTIONS
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover endless possibilities in real estate with our comprehensive solutions
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slides Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="flex-none w-48 bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground text-center">
                    {slide.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealEstateSlider;