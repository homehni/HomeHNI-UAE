import React from 'react';
import { Phone, ShieldCheck, Users, FileText, Calendar, HandshakeIcon } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const benefits = [
    {
      icon: Phone,
      title: "No Calls From Brokers",
      description: "Your information is kept confidential and you no longer have to worry about calls from brokers."
    },
    {
      icon: ShieldCheck,
      title: "Verified Buyers/Tenants",
      description: "Thanks to our tech technology, only verified and genuine buyers/tenants can contact you."
    },
    {
      icon: Users,
      title: "Save Brokerage",
      description: "No brokers means no brokerage! Why pay out of a gift that should be yours."
    }
  ];

  const steps = [
    {
      icon: FileText,
      title: "Simple Listing Process",
      description: "As an owner, you can list your property in a few minutes. Just fill out our super simple form. Your property will go live after verification.",
      isLeft: true
    },
    {
      icon: Calendar,
      title: "Buyer/Tenant Selects Property and Schedules an Appointment",
      description: "If a tenant likes your property they will request for your contact details. With our web/rental contact information and then pay for a visit.",
      isLeft: false
    },
    {
      icon: HandshakeIcon,
      title: "Deal Closure",
      description: "Owner and tenant meet to close the deal directly. HomeHNI can help create a rental agreement and deliver it to your doorstep.",
      isLeft: true
    }
  ];

  const features = [
    { name: "Zero Brokerage", description: "Buy, sell or rent your property without paying hefty commission to agents." },
    { name: "Free Listing", description: "Post your property advertisement for rent or resale/sell. Whether you want to sell property online or rent out property, you can do it without any charges." },
    { name: "Easy and Quick Process", description: "With HomeHNI, posting your rent advertisement or listing a property for sale is seamless. Our platform guides you through simple steps, ensuring your free property listing is attractive and effective." },
    { name: "Increased Property Visibility", description: "HomeHNI's extensive reach and network ensures that your property advertisement gets maximum visibility, increasing the chances of finding the right tenants or buyers for your property." },
    { name: "Dedicated Support", description: "HomeHNI offers dedicated support to help you with the process, ensuring that your property advertisement gets the visibility it deserves." },
    { name: "Buyer/Tenant Background Verification", description: "HomeHNI prioritizes your security by verifying interactions and ensuring that only genuine tenants or buyers can contact you." }
  ];

  return (
    <div className="w-full bg-background py-16">
      {/* Top Benefits Bar */}
      <div className="bg-accent/20 py-4 mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <Phone className="w-4 h-4" />
            <span>Give a missed call to 080-000-2201 to get help in listing your property listing</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-muted-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">How it Works</h2>
        </div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className={`flex items-center gap-8 ${step.isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              <div className="flex-1">
                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                  <step.icon className="w-16 h-16 text-primary/30" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Content */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Rent or Sell Property Online Easily With HomeHNI</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Looking to sell property online or list your property for rent? HomeHNI makes it simple. Whether you want to sell a house, post a property for rent, or even sell land online, you can do it all without the hassle of dealing with intermediaries. Explore our free property advertisement and selling platform.
          </p>
          <p className="text-muted-foreground mb-12 leading-relaxed">
            HomeHNI is designed to cater to all your needs, from house rent advertisements to selling plots online. With HomeHNI, you can quickly and easily post free property ads, explore the best property selling platform, and connect with potential buyers or tenants that match your needs directly. Whether you are a homeowner wanting to sell your house or a landlord wanting to rent out a property, HomeHNI is your go-to platform for all things real estate.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-6">HomeHNI's House Sell & Rent Advertisement Services</h3>
          
          <div className="overflow-x-auto mb-12">
            <table className="w-full border border-border rounded-lg">
              <thead>
                <tr className="bg-accent/50">
                  <th className="px-6 py-3 text-left font-semibold text-foreground border-b border-border">Feature</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground border-b border-border">Description</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0">
                    <td className="px-6 py-4 font-medium text-foreground">{feature.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{feature.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-6">How to Sell Property Online With a HomeHNI Property Listing</h3>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            HomeHNI makes it easy to sell property online or list your property for rent with a simple, streamlined process that connects you directly with tenants or buyers. Here's how it works:
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">1. Easy Property Listing Process</h4>
              <p className="text-muted-foreground">Post a free property ad on HomeHNI within minutes. Simply fill out our easy-to-use form with all the relevant details, including location, amenities, and photos. Your property advertisement will go live after a quick verification.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">2. Schedule an Appointment</h4>
              <p className="text-muted-foreground">Once your property gets online, interested buyers or tenants can easily request your contact details to arrange a visit. Both parties will receive contact information, enabling them to connect directly.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">3. Property Visit and Deal Closure</h4>
              <p className="text-muted-foreground">After connecting, the property owner and tenant or buyer can arrange a site visit. HomeHNI helps facilitate a smooth deal closure by providing additional services like rental agreement creation and doorstep delivery, ensuring efficient, efficient, and professional service deals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;