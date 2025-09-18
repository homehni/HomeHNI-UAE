import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, FileText, Shield, Scale, User, Clock, CreditCard, ArrowRight, Star } from 'lucide-react';
import LegalServicesForm from '@/components/LegalServicesForm';

const LegalServicesEmbedded = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const scrollToContact = () => {
    setIsFormOpen(true);
  };

  const serviceHighlights = [{
    icon: FileText,
    title: "Rental Agreement",
    description: "Legally valid rental agreements delivered at your doorstep."
  }, {
    icon: Shield,
    title: "Tenant Verification",
    description: "Protect your property with police-verified tenant checks."
  }, {
    icon: Scale,
    title: "Property Legal Assistance",
    description: "Consult with certified legal experts before buying/selling property."
  }];

  const benefits = ["No Government Office Visits", "Personalised Legal Support", "Online Payment & Instant Booking", "Legally Valid Documentation", "Lowest Prices Guaranteed", "100% Convenience, 0% Stress"];

  const comingSoonServices = [{
    title: "Police Intimation",
    description: "Hassle-free police intimation for rental properties",
    icon: Shield
  }, {
    title: "Property Tax Filing",
    description: "Expert assistance with property tax documentation",
    icon: FileText
  }, {
    title: "Leave & License Agreement",
    description: "Professional drafting of leave and license agreements",
    icon: Scale
  }, {
    title: "Legal Document Review",
    description: "Expert review of property-related legal documents",
    icon: CheckCircle
  }];

  const customerReviews = [{
    name: "Rohit M.",
    location: "Mumbai",
    rating: 5,
    review: "Quick & efficient service for my rental agreement! Highly recommended.",
    avatar: "/lovable-uploads/02059b14-d0f2-4231-af62-ec450cb13e82.png"
  }, {
    name: "Neha S.",
    location: "Delhi",
    rating: 5,
    review: "Professional team. Got tenant verification done in 2 days.",
    avatar: "/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png"
  }, {
    name: "Vikas K.",
    location: "Bangalore",
    rating: 5,
    review: "Legal consultation helped me close my deal confidently.",
    avatar: "/lovable-uploads/03a7a41f-3920-4412-aec8-9d2ab24226ae.png"
  }];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center bg-no-repeat pt-8 pb-16 overflow-hidden py-[120px]" style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/lovable-uploads/d1d3a477-5764-47c6-b08f-b0cad801e543.png)'}}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 pt-8">
              Get Hassle-Free Property
              <span className="block text-white">Legal Services Across India</span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              From online rental agreements to tenant verification — all at your doorstep.
            </p>
            <Button onClick={scrollToContact} size="lg" className="bg-red-800 hover:bg-red-900 text-white px-8 py-3 text-lg">
              Book a Legal Service
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-20 -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200 rounded-full opacity-20 translate-y-24 -translate-x-24"></div>
      </section>

      {/* Service Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Legal Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive legal support for all your property needs
            </p>
          </div>
          
          {/* Mobile: Stack vertically, Tablet: 2 columns with horizontal layout, Desktop: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {serviceHighlights.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-primary hover:border-brand-red/20 p-4 md:p-6">
                <CardContent className="pt-4 md:pt-6">
                  {/* All breakpoints: Vertical centered layout */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                      <service.icon className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-brand-red" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{service.title}</h3>
                      <p className="text-gray-600 text-sm md:text-base">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose HomeHNI Legal Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HomeHNI Legal Services?</h2>
              <p className="text-gray-600">Experience the difference with our professional legal support</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon Services</h2>
            <p className="text-gray-600">Expanding our legal services to serve you better</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {comingSoonServices.map((service, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-primary">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                  <div className="mt-3">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Real experiences from satisfied customers</p>
          </div>
          
          {/* Mobile: Stack vertically, Tablet: Single column with larger cards, Desktop: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {customerReviews.map((review, index) => (
              <Card key={index} className="p-4 md:p-8 lg:p-6">
                <CardContent>
                  {/* Mobile/Desktop: Standard layout, Tablet: Enhanced horizontal layout */}
                  <div className="flex items-center mb-4 md:mb-6 lg:mb-4">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 md:w-16 md:h-16 lg:w-12 lg:h-12 rounded-full mr-4 md:mr-6 lg:mr-4" />
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:flex-col lg:items-start">
                        <div>
                          <h4 className="font-semibold text-base md:text-lg lg:text-base">{review.name}</h4>
                          <p className="text-sm md:text-base lg:text-sm text-gray-600">{review.location}</p>
                        </div>
                        <div className="flex mt-2 md:mt-0 lg:mt-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 md:h-5 md:w-5 lg:h-4 lg:w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic text-sm md:text-base lg:text-sm leading-relaxed">"{review.review}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Professional Legal Support</h2>
                <p className="text-gray-600 mb-8">
                  Our team of experienced legal professionals ensures that all your property-related 
                  legal requirements are handled with utmost care and precision. From documentation 
                  to consultation, we provide end-to-end legal support.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-brand-red mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Quick Turnaround</h3>
                      <p className="text-gray-600">Most services completed within 24-48 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <User className="h-6 w-6 text-brand-red mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Expert Consultation</h3>
                      <p className="text-gray-600">Access to certified legal experts and advisors</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <CreditCard className="h-6 w-6 text-brand-red mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Transparent Pricing</h3>
                      <p className="text-gray-600">No hidden costs, pay only for what you need</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Available Across India</h3>
                <p className="text-gray-600 mb-6">
                  Our legal services are available in all major cities across India. Whether you're 
                  in Mumbai, Delhi, Bangalore, Chennai, or any other city, we've got you covered.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Mumbai</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Delhi</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Bangalore</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Chennai</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Hyderabad</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Pune</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">And many more cities...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-brand-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need help with your legal property documents?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get expert legal assistance for all your property needs - anywhere in India
          </p>
          <Button size="lg" className="bg-white text-brand-red hover:bg-gray-100 px-8 py-3 text-lg" onClick={scrollToContact}>
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>


      {/* Legal Services Form Modal */}
      <LegalServicesForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default LegalServicesEmbedded;