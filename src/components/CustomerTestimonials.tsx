import React, { useEffect, useRef, useState } from 'react';
import { Star, ShieldCheck, Play, Users, BadgeIndianRupee, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCMSContent } from '@/hooks/useCMSContent';

/** 
 * 🔗 ADD YOUR VIDEO URL HERE (use the GitHub "raw" file URL)
 * Example: https://raw.githubusercontent.com/your/repo/branch/public/videos/testimonials.mp4
 */
const VIDEO_SRC = "/lovable-uploads/Property Listing.mp4";
const VIDEO_POSTER = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"; // UAE/Dubai modern real estate image

// Enhanced testimonials data with more variety
const testimonials = [
  {
    name: "Ahmed Al Mansoori",
    roleCity: "Buyer • Dubai Marina",
    rating: 5,
    text: "Home HNI made my property search incredibly smooth. The verified listings and transparent process saved me months of searching. I found my dream home in just 3 weeks!",
    date: "Aug 2025",
    verified: true,
    initial: "A",
    category: "Property Purchase"
  },
  {
    name: "Fatima Al Zaabi",
    roleCity: "Owner • Jumeirah",
    rating: 5,
    text: "Excellent service! They helped me sell my property at the best market price. The legal support and documentation process was handled professionally.",
    date: "Jul 2025",
    verified: true,
    initial: "F",
    category: "Property Sale"
  },
  {
    name: "Mohammed Hassan",
    roleCity: "Buyer • Downtown Dubai",
    rating: 5,
    text: "Professional service and complete transparency. The team guided me through every step of the buying process. Highly recommended for first-time buyers!",
    date: "Sep 2025",
    verified: true,
    initial: "M",
    category: "First-time Buyer"
  },
  {
    name: "Sarah Al Maktoum",
    roleCity: "Owner • Business Bay",
    rating: 5,
    text: "Professional service from start to finish. They found genuine buyers quickly and handled all the paperwork efficiently. Great experience overall!",
    date: "Aug 2025",
    verified: true,
    initial: "S",
    category: "Property Sale"
  },
  {
    name: "Omar Al Suwaidi",
    roleCity: "Buyer • Palm Jumeirah",
    rating: 5,
    text: "The property verification process was thorough and the team was always available to answer my questions. Made the entire buying experience stress-free.",
    date: "Oct 2025",
    verified: true,
    initial: "O",
    category: "Property Purchase"
  },
  {
    name: "Layla Al Shamsi",
    roleCity: "Owner • Al Reem Island",
    rating: 5,
    text: "Outstanding customer service and quick turnaround time. They helped me get the best price for my property with minimal hassle.",
    date: "Sep 2025",
    verified: true,
    initial: "L",
    category: "Property Sale"
  }
];

export function TrustMetricsRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-700 mb-8">
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
        <Star className="w-4 h-4 text-[#800000] fill-current" />
        <span className="font-medium">4.8/5 (2,143 reviews)</span>
      </div>
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
        <Users className="w-4 h-4 text-[#800000]" />
        <span className="font-medium">12k+ owners matched</span>
      </div>
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
        <BadgeIndianRupee className="w-4 h-4 text-[#800000]" />
        <span className="font-medium">12k+ successful transactions</span>
      </div>
    </div>
  );
}

/** ===========================
 *  VideoTile — actual <video>
 *  =========================== */
export function VideoTile({
  src = "",
  title = "Customer Success Stories",
  poster = VIDEO_POSTER,
}: {
  src?: string;
  title?: string;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-sm">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="metadata"
          playsInline
          muted
          // show controls only while playing for a clean look
          controls={isPlaying}
          className="w-full h-full object-cover"
          onEnded={() => setIsPlaying(false)}
        />
        {!isPlaying && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        )}

        {/* Overlay Play button (hidden while playing) */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ef4444] rounded-2xl"
            aria-label="Play video"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#ef4444] to-[#dc2626] rounded-full shadow-xl ring-4 ring-[#ef4444]/30 flex items-center justify-center group-hover:scale-110 group-hover:ring-[#ef4444]/50 transition-all duration-300">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="flex items-center gap-1 text-gray-700">
        <Play className="w-3 h-3 text-[#ef4444]" />
        <span className="text-sm">{title}</span>
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
  initial,
  category
}) {
  return (
    <div className="group relative rounded-lg sm:rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 h-auto sm:h-[260px] min-h-[240px] sm:min-h-0 flex flex-col">
      {/* Quote Icon */}
      <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
        <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-[#800000]" />
      </div>

      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#800000] to-[#700000] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-xs font-bold text-white">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-0.5 truncate">{name}</h4>
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1 flex-wrap">
                <span className="truncate">{roleCity}</span>
                <span>•</span>
                <span>{date}</span>
              </div>
            </div>
            <div className="flex flex-shrink-0 ml-1">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#800000] fill-current" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {verified && (
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">
                <ShieldCheck className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                <span>Verified</span>
              </div>
            )}
            {category && (
              <div className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">
                {category}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="flex-1 flex items-start overflow-hidden mt-2">
        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed text-left line-clamp-5 sm:line-clamp-6">
          "{text}"
        </p>
      </div>
    </div>
  );
}

/** ===========================
 *  Infinite Carousel Component
 *  =========================== */
function InfiniteTestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalItems = testimonials.length;

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % totalItems);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  // Get the three testimonials to display
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % totalItems;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
      {/* Navigation Arrows - Hidden on mobile */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="hidden md:flex absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous testimonials"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="hidden md:flex absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next testimonials"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div className="flex gap-2 sm:gap-3 transition-all duration-500 ease-in-out">
          {visibleTestimonials.map((testimonial, index) => (
            <div
              key={`${currentIndex}-${index}`}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 px-1 sm:px-0"
            >
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-3 sm:mt-4 space-x-1.5 sm:space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
              index === currentIndex
                ? 'bg-[#800000]'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { content: cmsContent } = useCMSContent('testimonials_section');
  
  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {cmsContent?.content?.heading || cmsContent?.content?.title || 'Our Customers Love Us'}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {cmsContent?.content?.description || 'Real stories from verified buyers & owners who found their perfect property with us.'}
          </p>
          <TrustMetricsRow />
        </div>

        {/* Video Section */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <VideoTile src={VIDEO_SRC} poster={VIDEO_POSTER} title="Customer Success Stories" />
          </div>
        </div>

        {/* Infinite Testimonials Carousel */}
        <div className="mb-12">
          <InfiniteTestimonialCarousel />
        </div>

        {/* See All Testimonials Button - Centered */}
        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg" className="border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors">
            <Link to="/testimonials">See All Testimonials</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const CustomerTestimonials = TestimonialsSection;
export default CustomerTestimonials;
