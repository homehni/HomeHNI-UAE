import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Users, Star } from 'lucide-react';

const WhyPostSection: React.FC = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Zero Brokerage",
      description: "No commission charges"
    },
    {
      icon: Clock,
      title: "Faster Tenants",
      description: "Quick tenant matching"
    },
    {
      icon: Users,
      title: "10 lac tenants/buyers connections",
      description: "Vast network of verified users"
    }
  ];

  const testimonials = [
    {
      text: "HomeHNI made selling my property incredibly smooth and stress-free. Their team provided excellent guidance throughout the process and helped me find qualified buyers quickly. The platform's user-friendly interface and professional support made all the difference in achieving the best price for my property.",
      name: "Rajesh Kumar",
      city: "Mumbai"
    },
    {
      text: "I was amazed by how quickly I found the perfect tenant through HomeHNI. The verification process gave me confidence, and the zero brokerage policy saved me thousands. Highly recommend to all property owners!",
      name: "Priya Sharma",
      city: "Bangalore"
    },
    {
      text: "As a first-time property seller, I was nervous about the process. HomeHNI's team guided me at every step and helped me get the best market price. The entire experience was transparent and hassle-free.",
      name: "Amit Patel",
      city: "Delhi"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change testimonial every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="w-full relative bg-gray-100/50">
      <div className="relative h-full min-h-screen flex items-center justify-center">
        <div className="relative w-full max-w-sm mx-4">
          {/* Content container */}
          <div className="relative bg-gray-50/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
            
            {/* Why Post section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-600 mb-5">Why Post through us?</h2>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-gray-200/70 rounded-full flex items-center justify-center">
                      <benefit.icon className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 text-sm">{benefit.title}</h3>
                      <p className="text-gray-500 text-xs">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial section */}
            <div className="border-t border-gray-200/50 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <h3 className="font-semibold text-base text-gray-700">30 Lac+ Home Owners Trust Us</h3>
              </div>
              
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="bg-gray-200/40 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">
                          "{testimonial.text}"
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-600">{testimonial.name}</span>
                        <span className="text-gray-500">{testimonial.city}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial indicators */}
              <div className="flex justify-center gap-1.5 mt-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-gray-500' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyPostSection;