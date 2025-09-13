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
    <div className="hidden lg:block lg:w-1/2 xl:w-2/5 relative">
      {/* Green circular border design */}
      <div className="relative h-full min-h-[600px] flex items-center justify-center">
        <div className="relative w-full max-w-md">
          {/* Main circular border */}
          <div className="absolute inset-0 border-4 border-primary rounded-full transform scale-110"></div>
          
          {/* Content container */}
          <div className="relative bg-background/95 backdrop-blur-sm rounded-2xl p-8 mx-4 shadow-lg border border-border/50">
            
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
                  "I posted a property ad online on NoBroker. Its an efficient real estate website because 
                  despite my busy schedule they did a great job of contacting me at the right times. To 
                  keep me updated they sent mails & messages. They found a great tenant for my 
                  rental property as per my demands."
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Aldrin</span>
                <span className="text-muted-foreground">Bangalore</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyPostSection;