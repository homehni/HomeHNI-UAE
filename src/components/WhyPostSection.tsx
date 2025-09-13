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
    <div className="w-full h-full bg-gray-50 border-r border-gray-200">
      <div className="p-6 space-y-6">
        {/* Why Post section */}
        <div>
          <h2 className="text-xl font-medium text-gray-700 mb-5">Why Post through us?</h2>
          
          <div className="space-y-5">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200/70 rounded-full flex items-center justify-center mt-1">
                  <benefit.icon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 text-base leading-tight">{benefit.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="mb-4">
            <h3 className="font-semibold text-lg text-gray-700 mb-4">30 Lac+ Home Owners Trust Us</h3>
          </div>
          
          <div className="relative">
            <div className="space-y-4">
              <div className="bg-white/80 rounded-lg p-4 shadow-sm border border-gray-200/50">
                <p className="text-sm text-gray-600 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{testimonials[currentTestimonial].name}</span>
                <span className="text-gray-500">{testimonials[currentTestimonial].city}</span>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-gray-600' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyPostSection;