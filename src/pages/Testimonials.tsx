import React, { useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 420; // Width of card + gap
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };
  const testimonials = [{
    name: "Ahmed Al Mansoori",
    role: "Tenant, Dubai Marina",
    text: "Finding a roommate through Home Hni was a breeze. After six years of hunting in Dubai, I finally met the perfect co-tenant. The platform's filters and owner-direct contact made all the difference.",
    rating: 5
  }, {
    name: "Mohammed Al Zaabi",
    role: "Owner, Jumeirah",
    text: "Home Hni is a game‑changer. As a property owner, the platform's seamless Refer‑&‑Earn program is stellar. The app is intuitive, and within days I had quality leads—with professional service and expert guidance.",
    rating: 5
  }, {
    name: "Omar Hassan",
    role: "Property Owner",
    text: "Absolutely amazed by Home Hni. The Refer‑&‑Earn feature is brilliant—just a few clicks, and I was earning. My friends also joined and benefited. Smooth onboarding and fast payouts.",
    rating: 5
  }, {
    name: "Fatima Al Maktoum",
    role: "Owner, Business Bay",
    text: "Exceptional service from Home Hni's concierge team. Quick responses, dedicated support through the paid listing plan—booked solid tenant matches within days. Highly recommend!",
    rating: 5
  }, {
    name: "Sarah Al Suwaidi",
    role: "Tenant, Downtown Dubai",
    text: "I signed up for the Relax Plan. My relationship manager was efficient and precise with my requirements. I got multiple perfect matches and locked a great place within a week.",
    rating: 5
  }, {
    name: "Khalid Al Shamsi",
    role: "Tenant, Palm Jumeirah",
    text: "I had concerns about delays and rent pricing, but the responses from Home Hni were practically instant. Within two days, I had shortlisted properties that fit my budget and needs.",
    rating: 5
  }, {
    name: "Layla Al Nuaimi",
    role: "Owner, Al Reem Island",
    text: "Home Hni's concept impressed me—and the execution matched it. Listing my apartment was seamless, responses were genuine and direct. A hassle‑free experience that I highly recommend.",
    rating: 5
  }, {
    name: "Youssef Al Hameli",
    role: "Owner, Dubai Hills",
    text: "Superb service. The response time was fantastic—a curated tenant call within hours. The platform is user‑friendly, efficient, and trustworthy.",
    rating: 5
  }, {
    name: "Amina Al Dhaheri",
    role: "Flatmate Seeker, Dubai Marina",
    text: "Looking for a flatmate is often stressful, but Home Hni made it simple. Found a great roommate in no time—just the way it should be.",
    rating: 5
  }, {
    name: "Rashid Al Qasimi",
    role: "Owner, Arabian Ranches",
    text: "The Relax plan delivered excellently. Found a tenant fast, paperwork handled efficiently, and zero broker interaction. Highly recommended.",
    rating: 5
  }];
  return <div className="min-h-screen bg-white">
      {/* Marquee at the very top */}
      <Marquee />
      
      {/* Header overlapping with content */}
      <Header />
      
      {/* Main content */}
      <div className="pt-8">
        {/* Hero Banner Section */}
        <div className="relative h-96 bg-gradient-to-r from-[#800000] to-[#700000] overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          filter: 'brightness(0.7)'
        }} />
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide drop-shadow-2xl">
              Testimonials
            </h1>
          </div>
        </div>

        {/* Section Header */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600">
              Real experiences from our satisfied customers
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 relative">
            <div className="relative">
              {/* Left Arrow */}
              <Button variant="outline" size="icon" className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl border-gray-200" onClick={() => scroll('left')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Right Arrow */}
              <Button variant="outline" size="icon" className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl border-gray-200" onClick={() => scroll('right')}>
                <ChevronRight className="w-4 h-4" />
              </Button>

              {/* Testimonials Container */}
              <div ref={scrollRef} className="overflow-x-auto scrollbar-hide px-2 sm:px-8 md:px-12 snap-x snap-mandatory" style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
                <div className="flex space-x-3 sm:space-x-4 md:space-x-6 pb-4">
                  {testimonials.map((testimonial, index) => <Card key={index} className="w-[85vw] sm:w-[350px] md:w-[400px] flex-shrink-0 bg-white shadow-md hover:shadow-lg transition-shadow snap-center">
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                            <AvatarFallback className="bg-[#800000] text-white font-semibold text-sm sm:text-base">
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">
                              {testimonial.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-1">
                              {testimonial.role}
                            </p>
                            <div className="flex space-x-0.5 sm:space-x-1">
                              {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" />)}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed line-clamp-4 sm:line-clamp-none">
                          "{testimonial.text}"
                        </p>
                      </CardContent>
                    </Card>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Responsive Grid View */}
        
      </div>
      
      <Footer />
    </div>;
};
export default Testimonials;
