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
    <div className="w-full h-full bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="p-5 space-y-5">
        {/* Why Post section */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Why Post through us?</h2>
          
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 group hover:transform hover:translate-x-1 transition-all duration-300">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mt-1 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <benefit.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{benefit.title}</h3>
                  <p className="text-gray-600 text-xs mt-1">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial section */}
        <div className="border-t border-gray-200/50 pt-5">
          <div className="mb-4">
            <h3 className="font-bold text-base text-gray-800 mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">30 Lac+ Home Owners Trust Us</h3>
          </div>
          
          <div className="relative">
            <div className="space-y-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/50 hover:shadow-lg transition-shadow duration-300">
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  "{testimonials[currentTestimonial].text}"
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-800">{testimonials[currentTestimonial].name}</span>
                <span className="text-gray-600 font-medium">{testimonials[currentTestimonial].city}</span>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-500 shadow-md' 
                      : 'bg-gray-300 hover:bg-gray-400'
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