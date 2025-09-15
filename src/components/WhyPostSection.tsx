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
    <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="p-6 space-y-6">
        {/* Why Post section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-5 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Why Post through us?</h2>
          
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300 group">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <benefit.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-5 text-white shadow-xl">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-white mb-2">30 Lac+ Home Owners Trust Us</h3>
          </div>
          
          <div className="relative">
            <div className="space-y-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <p className="text-sm text-white/95 leading-relaxed font-medium italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{testimonials[currentTestimonial].name}</span>
                <span className="text-white/80 text-sm font-medium">{testimonials[currentTestimonial].city}</span>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-white shadow-lg' 
                      : 'bg-white/50 hover:bg-white/70'
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