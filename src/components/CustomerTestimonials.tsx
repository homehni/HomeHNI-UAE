import React, { useEffect, useRef, useState } from 'react';
import { Star, ShieldCheck, Play, Users, BadgeIndianRupee, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCMSContent } from '@/hooks/useCMSContent';

/**
 * Media
 */
const VIDEO_SRC = "/lovable-uploads/Property Listing.mp4";
const VIDEO_POSTER = "/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png";

/**
 * Demo testimonials (replace with CMS later if you want)
 */
const testimonials = [
  { name: "Rajesh Kumar", roleCity: "Buyer • Bengaluru", rating: 5, text: "Home HNI made my property search incredibly smooth. The verified listings and transparent process saved me months of searching. I found my dream home in just 3 weeks!", date: "Aug 2025", verified: true, initial: "R" },
  { name: "Priya Sharma", roleCity: "Owner • Pune", rating: 5, text: "Excellent service! They helped me sell my property at the best market price. The legal support and documentation process was handled professionally.", date: "Jul 2025", verified: true, initial: "P" },
  { name: "Amit Patel", roleCity: "Buyer • Mumbai", rating: 5, text: "Zero brokerage and complete transparency. The team guided me through every step of the buying process. Highly recommended for first-time buyers!", date: "Sep 2025", verified: true, initial: "A" },
  { name: "Sunita Reddy", roleCity: "Owner • Hyderabad", rating: 5, text: "Professional service from start to finish. They found genuine buyers quickly and handled all the paperwork efficiently. Great experience overall!", date: "Aug 2025", verified: true, initial: "S" }
];

/* ------------------------------------------
   Trust KPIs — now styled as premium chips
------------------------------------------- */
export function TrustMetricsRow() {
  const Item = ({ icon: Icon, children }: any) => (
    <div className="flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/70 backdrop-blur px-3 py-1.5 shadow-sm">
      <Icon className="w-4 h-4 text-[#d21404]" />
      <span className="text-sm text-gray-800">{children}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-3 justify-center">
      <Item icon={Star}>4.8/5 (2,143 reviews)</Item>
      <Item icon={Users}>12k+ owners matched</Item>
      <Item icon={BadgeIndianRupee}>₹18+ crore brokerage saved</Item>
    </div>
  );
}

/* ------------------------------------------
   VideoTile — elevated, with subtle overlay
------------------------------------------- */
export function VideoTile({
  src = VIDEO_SRC,
  title = "Customer Success Stories",
  poster = VIDEO_POSTER,
}: {
  src?: string; title?: string; poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setIsPlaying(true); } else { v.pause(); setIsPlaying(false); }
  };

  return (
    <div className="group relative rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-[0_10px_30px_rgba(2,8,23,0.06)]">
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="metadata"
          playsInline
          muted
          controls={isPlaying}
          className="h-full w-full object-cover"
          onEnded={() => setIsPlaying(false)}
        />
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Play video"
            className="absolute inset-0 grid place-items-center"
          >
            <span className="grid place-items-center w-16 h-16 rounded-full bg-white shadow-lg ring-4 ring-white/20 transition-transform group-hover:scale-105">
              <Play className="w-6 h-6 text-[#d21404] fill-current ml-0.5" />
            </span>
          </button>
        )}
        {/* gradient gloss */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
      </div>
      <div className="flex items-center gap-2 p-3">
        <Play className="w-4 h-4 text-[#d21404]" />
        <p className="text-sm text-gray-700">{title}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------
   Testimonial Card — upgraded visual style
------------------------------------------- */
type Testimonial = {
  name: string; roleCity: string; rating: number; text: string; date: string; verified?: boolean; initial: string;
};

export function TestimonialCard({
  name, roleCity, rating, text, date, verified, initial
}: Testimonial) {
  return (
    <div className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_8px_24px_rgba(2,8,23,0.05)] hover:shadow-[0_12px_30px_rgba(2,8,23,0.08)] transition-shadow">
      {/* top quote icon */}
      <Quote className="absolute -top-3 -left-3 w-8 h-8 text-[#d21404]/10" />
      {/* head */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center text-gray-700 font-semibold">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <div className="flex">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-[#d21404] fill-current" />
              ))}
            </div>
            {verified && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-600 px-2 py-0.5 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            )}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">{roleCity} • {date}</div>
        </div>
      </div>
      {/* body */}
      <p className="mt-4 text-gray-700 leading-relaxed">“{text}”</p>
    </div>
  );
}

/* ------------------------------------------
   Mobile carousel with snap & momentum
------------------------------------------- */
function MobileCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    let i = 0;
    let timer: ReturnType<typeof setInterval> | null = null;

    const to = (n: number) => {
      const width = scroller.clientWidth;
      scroller.scrollTo({ left: n * (width + 16), behavior: 'smooth' });
      setIndex(n);
    };

    const start = () => {
      stop();
      timer = setInterval(() => {
        i = (i + 1) % testimonials.length;
        to(i);
      }, 4000);
    };

    const stop = () => { if (timer) clearInterval(timer); timer = null; };

    start();
    scroller.addEventListener('pointerdown', stop);
    scroller.addEventListener('pointerup', start);
    scroller.addEventListener('mouseenter', stop);
    scroller.addEventListener('mouseleave', start);

    return () => { stop(); };
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {testimonials.map((t, i) => (
          <div key={i} className="snap-start shrink-0 basis-[calc(100%-1rem)]">
            <TestimonialCard {...t} />
          </div>
        ))}
      </div>

      {/* dots */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-[#d21404]' : 'w-2 bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------
   SECTION (structure dramatically improved)
------------------------------------------- */
export function TestimonialsSection() {
  const { content: cmsContent } = useCMSContent('testimonials_section');
  const title = cmsContent?.content?.heading || cmsContent?.content?.title || 'Our customers love us';
  const desc  = cmsContent?.content?.description || 'Real stories from verified buyers & owners.';

  return (
    <section
      className="
        relative py-14 sm:py-16
        bg-[radial-gradient(90%_60%_at_50%_-10%,#fff,rgba(210,20,4,0.06)_40%,rgba(210,20,4,0.08)_65%,#fff_100%)]
      "
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* top headline + actions */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block text-xs tracking-wider uppercase text-[#d21404]/80 font-semibold mb-2">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
          <p className="mt-3 text-gray-600">{desc}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild size="lg" variant="default" className="bg-[#d21404] hover:bg-[#b71104]">
              <Link to="/testimonials">See All</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/reviews/new">Write a Review</Link>
            </Button>
          </div>
          <div className="mt-6">
            <TrustMetricsRow />
          </div>
        </div>

        {/* main split: featured video + mosaic */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Featured video & caption */}
          <div className="lg:col-span-5">
            <VideoTile />
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-4 text-sm text-gray-700 shadow-sm">
              <p>
                “Watch quick stories of how buyers and owners closed deals faster with verified listings,
                concierge support and transparent documentation.”
              </p>
            </div>
          </div>

          {/* Right: masonry-like grid on desktop */}
          <div className="lg:col-span-7 hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
            {/* Make one card taller for visual rhythm */}
            <div className="sm:row-span-2">
              <TestimonialCard {...testimonials[0]} />
            </div>
            <TestimonialCard {...testimonials[1]} />
            <TestimonialCard {...testimonials[2]} />
            <TestimonialCard {...testimonials[3]} />
          </div>
        </div>

        {/* Mobile/Tablet carousel */}
        <div className="mt-10 lg:hidden">
          <MobileCarousel />
        </div>
      </div>
    </section>
  );
}

const CustomerTestimonials = TestimonialsSection;
export default CustomerTestimonials;
