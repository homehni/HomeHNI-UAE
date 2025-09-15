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
    <div className="w-full h-full bg-gray-200">
      <div className="p-4 space-y-4">
        {/* Why Post section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Why Post through us?</h2>
          
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-400 rounded-sm flex items-center justify-center mt-1">
                  <benefit.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 text-sm leading-tight">{benefit.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial section */}
        <div className="pt-3">
          <div className="mb-3">
            <h3 className="font-semibold text-base text-gray-700">30 Lac+ Home Owners Trust Us</h3>
          </div>
          
          <div className="relative">
            <div className="space-y-3">
              <div className="text-xs text-gray-600 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">{testimonials[currentTestimonial].name}</span>
                <span className="text-gray-500">{testimonials[currentTestimonial].city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyPostSection;