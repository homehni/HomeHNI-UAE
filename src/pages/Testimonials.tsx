import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Prameet",
      role: "Tenant, Mumbai",
      text: "Finding a roommate through Home Hni was a breeze. After six years of hunting in Mumbai, I finally met the perfect co-tenant. The platform's filters and owner-direct contact made all the difference.",
      rating: 5
    },
    {
      name: "Mohammed Kouse",
      role: "Owner, Bangalore",
      text: "Home Hni is a game‑changer. As a property owner, the platform's seamless Refer‑&‑Earn program is stellar. The app is intuitive, and within days I had quality leads—without any brokerage.",
      rating: 5
    },
    {
      name: "Ayan",
      role: "Property Owner",
      text: "Absolutely amazed by Home Hni. The Refer‑&‑Earn feature is brilliant—just a few clicks, and I was earning. My friends also joined and benefited. Smooth onboarding and fast payouts.",
      rating: 5
    },
    {
      name: "Balasubramaniyam",
      role: "Owner, Hyderabad",
      text: "Exceptional service from Home Hni's concierge team. Quick responses, dedicated support through the paid listing plan—booked solid tenant matches within days. Highly recommend!",
      rating: 5
    },
    {
      name: "Tiasha",
      role: "Tenant, Gurgaon",
      text: "I signed up for the Relax Plan. My relationship manager, Sayantan, was efficient and precise with my requirements. I got multiple perfect matches and locked a great place within a week.",
      rating: 5
    },
    {
      name: "Balamurali",
      role: "Tenant, Chennai",
      text: "I had concerns about delays and rent pricing, but the responses from Home Hni were practically instant. Within two days, I had shortlisted properties that fit my budget and needs.",
      rating: 5
    },
    {
      name: "Tomy Thomas",
      role: "Owner, Delhi",
      text: "Home Hni's concept impressed me—and the execution matched it. Listing my apartment was seamless, responses were genuine and direct. A hassle‑free experience that I highly recommend.",
      rating: 5
    },
    {
      name: "Venkatesh",
      role: "Owner, Pune",
      text: "Superb service. The response time was fantastic—a curated tenant call within hours. The platform is user‑friendly, efficient, and trustworthy.",
      rating: 5
    },
    {
      name: "Kriti",
      role: "Flatmate Seeker, Mumbai",
      text: "Looking for a flatmate is often stressful, but Home Hni made it simple. Found a great roommate in no time—just the way it should be.",
      rating: 5
    },
    {
      name: "Anoop Nair",
      role: "Owner, Bengaluru",
      text: "The Relax plan delivered excellently. Found a tenant fast, paperwork handled efficiently, and zero broker interaction. Highly recommended.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Marquee at the very top */}
      <Marquee />
      
      {/* Header overlapping with content */}
      <Header />
      
      {/* Main content */}
      <div className="pt-8">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-brand-red to-brand-maroon text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🌟 What Our Clients Say
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Testimonials
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-6 p-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="w-80 flex-shrink-0 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-brand-red text-white font-semibold">
                            {testimonial.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            {testimonial.role}
                          </p>
                          <div className="flex space-x-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 text-yellow-400"
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        "{testimonial.text}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>

        {/* Mobile Responsive Grid View */}
        <section className="py-16 bg-white lg:hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={`mobile-${index}`} className="bg-gray-50 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-brand-red text-white font-semibold">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          {testimonial.role}
                        </p>
                        <div className="flex space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      "{testimonial.text}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Testimonials;