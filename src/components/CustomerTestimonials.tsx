import React, { useEffect, useRef } from 'react';
import { Star, ShieldCheck, Play, Users, BadgeIndianRupee } from 'lucide-react';

// Sample data
const testimonials = [
  {
    name: "Rajesh Kumar",
    roleCity: "Buyer • Bengaluru", 
    rating: 5,
    text: "Home HNI made my property search incredibly smooth. The verified listings and transparent process saved me months of searching. I found my dream home in just 3 weeks!",
    date: "Aug 2025",
    verified: true,
    initial: "R"
  },
  {
    name: "Priya Sharma",
    roleCity: "Owner • Pune",
    rating: 5, 
    text: "Excellent service! They helped me sell my property at the best market price. The legal support and documentation process was handled professionally.",
    date: "Jul 2025",
    verified: true,
    initial: "P"
  },
  {
    name: "Amit Patel",
    roleCity: "Buyer • Mumbai",
    rating: 5,
    text: "Zero brokerage and complete transparency. The team guided me through every step of the buying process. Highly recommended for first-time buyers!",
    date: "Sep 2025", 
    verified: true,
    initial: "A"
  },
  {
    name: "Sunita Reddy",
    roleCity: "Owner • Hyderabad",
    rating: 5,
    text: "Professional service from start to finish. They found genuine buyers quickly and handled all the paperwork efficiently. Great experience overall!",
    date: "Aug 2025",
    verified: true,
    initial: "S"
  }
];

export function TrustMetricsRow() {
  return (
    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700 mb-8">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-[#d21404] fill-current" />
        <span>4.8/5 (2,143 reviews)</span>
      </div>
      <div className="hidden sm:block w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-[#d21404]" />
        <span>12k+ owners matched</span>
      </div>
      <div className="hidden sm:block w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-2">
        <BadgeIndianRupee className="w-4 h-4 text-[#d21404]" />
        <span>₹18+ crore brokerage saved</span>
      </div>
    </div>
  );
}

export function VideoTile({ 
  thumbnail = "/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png", 
  duration = "2:13", 
  title = "Customer Success Stories" 
}) {
  const handlePlayClick = () => {
    console.log("Play video:", title);
    // TODO: Open video modal
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
        <img 
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        
        {/* Play Button */}
        <button
          onClick={handlePlayClick}
          className="absolute inset-0 flex items-center justify-center group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d21404] rounded-2xl"
          aria-label="Play customer testimonial video"
        >
          <div className="w-16 h-16 bg-white rounded-full shadow-lg ring-4 ring-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Play className="w-6 h-6 text-[#d21404] fill-current ml-1" />
          </div>
        </button>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      
      {/* Caption */}
      <div className="flex items-center gap-1 text-gray-700">
        <Play className="w-3 h-3 text-[#d21404]" />
        <span className="text-sm">Watch customer stories</span>
      </div>
    </div>
  );
}

export function TestimonialCard({ 
  name, 
  roleCity, 
  rating, 
  text, 
  date, 
  verified, 
  initial 
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 min-h-[280px] sm:min-h-[240px] flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-gray-700">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
            <div className="flex">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-[#d21404] fill-current" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            {verified && (
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </div>
            )}
            <span>{roleCity}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
      </div>

      {/* Quote - Full text with proper spacing */}
      <div className="flex-1 flex items-start">
        <p className="text-gray-700 text-sm leading-relaxed text-left">
          "{text}"
        </p>
      </div>
    </div>
  );
}

function AutoScrollTestimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let currentIndex = 0;
    let isScrolling = false;
    let intervalId: NodeJS.Timeout;

    const getScrollWidth = () => {
      const containerWidth = scrollContainer.offsetWidth;
      // Calculate width based on responsive classes
      if (window.innerWidth >= 768) {
        // md and up - cards are 75% width
        return containerWidth * 0.75 + 16; // 75% + gap
      } else {
        // mobile - cards are 90% width  
        return containerWidth * 0.9 + 16; // 90% + gap
      }
    };

    const scrollToIndex = (index: number) => {
      if (!scrollContainer || isScrolling) return;
      
      isScrolling = true;
      const scrollWidth = getScrollWidth();
      const scrollPosition = index * scrollWidth;
      
      scrollContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });

      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrolling = false;
      }, 600);
    };

    const autoScroll = () => {
      if (isScrolling) return;
      
      currentIndex = (currentIndex + 1) % testimonials.length;
      scrollToIndex(currentIndex);
    };

    // Start auto-scrolling after initial delay
    const startTimer = setTimeout(() => {
      intervalId = setInterval(autoScroll, 4000);
    }, 2000);

    // Handle resize to recalculate scroll positions
    const handleResize = () => {
      if (!isScrolling) {
        scrollToIndex(currentIndex);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="overflow-x-auto -mx-4 px-4 pb-2"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style>
          {`
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <div className="flex gap-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-[90%] md:w-[75%] flex-shrink-0">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Our customers love us
          </h2>
          <p className="text-gray-600 mb-6">
            Real stories from verified buyers & owners.
          </p>
          <TrustMetricsRow />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Video */}
          <VideoTile />
          
          {/* Right Column - Testimonials */}
          <div className="space-y-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden">
          {/* Video First */}
          <div className="mb-8">
            <VideoTile />
          </div>
          
          {/* Auto-scrolling Testimonials */}
          <AutoScrollTestimonials />
        </div>
      </div>
    </section>
  );
}

const CustomerTestimonials = TestimonialsSection;

export default CustomerTestimonials;
