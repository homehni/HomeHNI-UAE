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
      title: "1 Million+ tenants/buyers connections",
      description: "Vast network of verified users"
    }
  ];

  const testimonials = [
    {
      text: "HomeHNI made selling my property incredibly smooth and stress-free. Their team provided excellent guidance throughout the process and helped me find qualified buyers quickly. The platform's user-friendly interface and professional support made all the difference in achieving the best price for my property.",
      name: "Ahmed Al Mansoori",
      city: "Dubai"
    },
    {
      text: "I was amazed by how quickly I found the perfect tenant through HomeHNI. The verification process gave me confidence, and the zero brokerage policy saved me thousands. Highly recommend to all property owners!",
      name: "Fatima Al Zaabi",
      city: "Abu Dhabi"
    },
    {
      text: "As a first-time property seller, I was nervous about the process. HomeHNI's team guided me at every step and helped me get the best market price. The entire experience was transparent and hassle-free.",
      name: "Mohammed Al Shamsi",
      city: "Sharjah"
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
    <div className="w-full flex flex-col" style={{ background: 'linear-gradient(to bottom right, #F5F5F5, #ffffff, #F5F5F5)' }}>
      <div className="p-6 flex-1 flex flex-col">
        {/* Why Post section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-5 bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">Why Post through us?</h2>
          
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-md transition-all duration-300 group" style={{ borderColor: '#F5F5F5', borderWidth: '1px' }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300" style={{ background: 'linear-gradient(to right, #F5F5F5, #E5E5E5)' }}>
                  <benefit.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial section - positioned to align with button */}
        <div className="rounded-xl p-4 text-gray-800 shadow-xl mt-6" style={{ background: 'linear-gradient(to right, #F5F5F5, #E5E5E5)' }}>
          <div className="mb-3">
            <h3 className="font-bold text-base text-gray-800 mb-2">3 Million+ Home Owners Trust Us</h3>
          </div>
          
          <div className="relative">
              <div className="space-y-3">
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-700 leading-relaxed font-medium italic line-clamp-4">
                  "{testimonials[currentTestimonial].text}"
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 text-xs">{testimonials[currentTestimonial].name}</span>
                <span className="text-gray-600 text-xs font-medium">{testimonials[currentTestimonial].city}</span>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-gray-700 shadow-lg' 
                      : 'bg-gray-400 hover:bg-gray-500'
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
