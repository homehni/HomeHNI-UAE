import React, { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';

interface PropertyGalleryCarouselProps {
  images: string[];
  autoScrollInterval?: number;
  className?: string;
}

export const PropertyGalleryCarousel: React.FC<PropertyGalleryCarouselProps> = ({
  images,
  autoScrollInterval = 4000,
  className
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Split images - first image for main carousel, rest for grid
  const mainCarouselImages = images.slice(0, 3); // First 3 for carousel
  const gridImages = images.slice(3); // Rest for grid

  // Update current slide
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!api) return;

    const startAutoScroll = () => {
      timerRef.current = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, autoScrollInterval);
    };

    const stopAutoScroll = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    startAutoScroll();

    // Pause on hover
    const container = api.containerNode();
    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);

    return () => {
      stopAutoScroll();
      container.removeEventListener('mouseenter', stopAutoScroll);
      container.removeEventListener('mouseleave', startAutoScroll);
    };
  }, [api, autoScrollInterval]);

  return (
    <div className={cn("relative", className)}>
      {/* Main Gallery Grid - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left: Large Carousel - Takes 2 columns */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-[450px] md:h-[550px] bg-muted shadow-xl">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full h-full"
          >
            <CarouselContent className="-ml-0">
              {mainCarouselImages.map((image, index) => (
                <CarouselItem key={index} className="pl-0 basis-full">
                  <div className="relative w-full h-[450px] md:h-[550px]">
                    <img
                      src={image}
                      alt={`Property main view ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* RERA Badge */}
            <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg z-10 flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              </svg>
              RERA CERTIFIED
            </div>

            {/* Action Buttons Overlay */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 shadow-md"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 shadow-md"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {mainCarouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    current === index
                      ? "w-8 bg-white shadow-md"
                      : "w-1.5 bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>

        {/* Right: Image Grid - Takes 1 column */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {gridImages.map((image, index) => (
            <div
              key={index}
              className={cn(
                "relative rounded-xl overflow-hidden bg-muted cursor-pointer group shadow-md",
                // On mobile: first 2 images, on desktop: all 4 images with equal height
                "h-[220px] md:h-[265px]"
              )}
            >
              <img
                src={image}
                alt={`Property interior ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/30 transition-all duration-300" />
              
              {/* View All Photos overlay on last image */}
              {index === gridImages.length - 1 && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                  <Button
                    variant="secondary"
                    className="bg-white hover:bg-white/95 shadow-lg text-sm font-semibold"
                  >
                    📷 View All {images.length} Photos
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
