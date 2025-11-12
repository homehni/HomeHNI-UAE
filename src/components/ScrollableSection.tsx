import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollableItem {
  id: string;
  name: string;
  logo?: string;
  image?: string;
  description?: string;
  [key: string]: any;
}

interface ScrollableSectionProps {
  title: string;
  items: ScrollableItem[];
  onItemClick?: (itemId: string) => void;
  renderItem?: (item: ScrollableItem, index: number) => React.ReactNode;
  autoScroll?: boolean;
  className?: string;
}

const ScrollableSection: React.FC<ScrollableSectionProps> = ({
  title,
  items,
  onItemClick,
  renderItem,
  autoScroll = true,
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Create infinite loop by duplicating items
  const infiniteItems = items.length > 0 ? [...items, ...items] : [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll functionality for seamless loop
  useEffect(() => {
    if (!autoScroll || isPaused || items.length === 0) return;
    
    const autoScrollFunc = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const slideWidth = 264; // 240px width + 24px gap
        const totalOriginalWidth = items.length * slideWidth;

        // Smooth continuous scroll
        container.scrollBy({
          left: 1,
          behavior: 'auto'
        });

        // Reset position seamlessly when we've scrolled past the first set
        if (container.scrollLeft >= totalOriginalWidth) {
          container.scrollLeft = 0;
        }
      }
    };
    
    const interval = setInterval(autoScrollFunc, 20);
    return () => clearInterval(interval);
  }, [isPaused, items.length, autoScroll]);

  // Default render function
  const defaultRenderItem = (item: ScrollableItem, index: number) => (
    <div
      key={`${item.id}-${index}`}
      className="flex-none w-60 bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 h-48"
      onClick={() => onItemClick?.(item.id)}
    >
      <div className="h-32 overflow-hidden bg-white flex items-center justify-center p-0 mt-2 md:mt-0">
        {(item.logo || item.image) ? (
          <img
            src={item.logo || item.image}
            alt={`${item.name}`}
            loading="lazy"
            className={`w-full h-full ${item.logo ? 'object-contain p-4' : 'object-cover'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-sm">No Image</span>
          </div>
        )}
      </div>
      <div className="px-4 pt-2 pb-4 h-16 flex flex-col justify-center">
        <h3 className="text-base font-bold text-foreground text-center">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-muted-foreground text-center mt-1 line-clamp-1">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 md:py-12 bg-gradient-to-br from-background to-secondary/20 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
          {title}
        </h2>
        <div className="relative">
          {/* Navigation Buttons - Hidden on mobile */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slides Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {infiniteItems.map((item, index) =>
              renderItem ? renderItem(item, index) : defaultRenderItem(item, index)
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollableSection;

