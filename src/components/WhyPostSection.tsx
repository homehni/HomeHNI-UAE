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
    <div className="w-full relative bg-gray-50">
      <div className="relative h-full min-h-screen flex items-center justify-center">
        <div className="relative w-full max-w-md mx-8">
          {/* Content container */}
          <div className="relative bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-border/50">
            
            {/* Why Post section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Why Post through us?</h2>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <benefit.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{benefit.title}</h3>
                      <p className="text-muted-foreground text-xs">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial section */}
            <div className="border-t border-border/30 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <h3 className="font-bold text-lg text-foreground">30 Lac+ Home Owners Trust Us</h3>
              </div>
              
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="bg-accent/50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-foreground leading-relaxed mb-3">
                          "{testimonial.text}"
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-foreground">{testimonial.name}</span>
                        <span className="text-muted-foreground">{testimonial.city}</span>
                      </div>
                    </div>
                  ))}
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
                        ? 'bg-primary' 
                        : 'bg-muted-foreground/30'
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