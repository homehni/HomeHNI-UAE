import React from 'react';
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
              
              <div className="bg-accent/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-foreground leading-relaxed mb-3">
                  "HomeHNI made selling my property incredibly smooth and stress-free. Their team 
                  provided excellent guidance throughout the process and helped me find qualified 
                  buyers quickly. The platform's user-friendly interface and professional support 
                  made all the difference in achieving the best price for my property."
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Rajesh Kumar</span>
                <span className="text-muted-foreground">Mumbai</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyPostSection;