import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, FileText, Truck, Clock, Shield, MapPin, Star, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';

const RentalAgreement = () => {
  const [selectedCity, setSelectedCity] = useState('');

  const scrollToForm = () => {
    const element = document.getElementById('pricing-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const cities = [
    'Delhi', 'Mumbai', 'Chennai', 'Bengaluru', 'Hyderabad', 'Pune', 'Ahmedabad', 
    'Kolkata', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad'
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      city: "Mumbai",
      rating: 5,
      text: "Got my rental agreement delivered in just 1 day. Very professional service!",
      avatar: "/lovable-uploads/02059b14-d0f2-4231-af62-ec450cb13e82.png"
    },
    {
      name: "Rajesh Kumar",
      city: "Bengaluru",
      rating: 5,
      text: "Transparent pricing and legally compliant. Highly recommend Home HNI!",
      avatar: "/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png"
    },
    {
      name: "Anita Patel",
      city: "Pune",
      rating: 5,
      text: "Saved me from visiting multiple offices. Everything done online smoothly.",
      avatar: "/lovable-uploads/03a7a41f-3920-4412-aec8-9d2ab24226ae.png"
    }
  ];

  const faqs = [
    {
      question: "Is this legally valid across India?",
      answer: "Yes, our rental agreements are drafted by legal experts and are valid across all states in India. We ensure compliance with local laws and regulations."
    },
    {
      question: "Do I need to visit your office?",
      answer: "No, the entire process is online. Simply fill the details, make payment, and we'll deliver the agreement to your doorstep or email it to you."
    },
    {
      question: "How fast can I get the agreement?",
      answer: "We deliver rental agreements within 1-2 business days for physical delivery. For digital delivery, you'll receive it within 24 hours."
    },
    {
      question: "Can I use this for commercial property?",
      answer: "Yes, we provide rental agreements for both residential and commercial properties. The format and clauses are customized based on property type."
    },
    {
      question: "What if I need modifications later?",
      answer: "We offer revision services for a nominal fee. You can request changes within 7 days of delivery."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-36 pb-24 md:pb-28 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')"
      }}>
        <div className="absolute inset-0 bg-red-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Create Your Rental
                <br className="hidden md:block" />
                <span className="block">Agreement</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                100% Legally Valid | Delivered at Your Doorstep | Stamp Paper Included
                <br />
                Available anywhere in India with complete legal compliance.
              </p>
              <Button 
                onClick={scrollToForm}
                size="lg" 
                className="bg-white text-brand-red hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Right: Placeholder for form on desktop */}
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-64"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get your rental agreement in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fill Details Online</h3>
              <p className="text-gray-600">Complete tenant and owner information through our secure online form</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Legal Draft & Print</h3>
              <p className="text-gray-600">We draft and print your agreement on valid e-stamp paper</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Doorstep Delivery</h3>
              <p className="text-gray-600">Agreement delivered to your address or emailed digitally</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Home HNI */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Home HNI for Rental Agreement?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Available Across All Cities</h3>
                <p className="text-gray-600">Pan-India service covering metros, tier-2, and tier-3 cities</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Legally Compliant Drafts</h3>
                <p className="text-gray-600">Agreements drafted by legal experts ensuring full compliance</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Fast Delivery (1-2 days)</h3>
                <p className="text-gray-600">Quick turnaround time with express delivery options</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">No Hidden Charges</h3>
                <p className="text-gray-600">Transparent pricing with no surprise fees or hidden costs</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Support for Owner & Tenant</h3>
                <p className="text-gray-600">Comprehensive support for both parties throughout the process</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">24/7 Customer Support</h3>
                <p className="text-gray-600">Round-the-clock assistance for all your queries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cities We Serve</h2>
            <p className="text-gray-600">Available across major cities in India</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cities.map((city) => (
                <div key={city} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">{city}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600">And many more cities across India...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
            <p className="text-gray-600 mb-8">No hidden charges. Stamp duty varies by state.</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card className="p-6 border-2 border-blue-200">
              <CardContent className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Rental Agreement</h3>
                <div className="text-4xl font-bold text-brand-red mb-2">₹299</div>
                <p className="text-gray-600 mb-6">+ Stamp duty as per state regulations</p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Legal draft by experts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Printed on e-stamp paper
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Doorstep delivery
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Digital copy included
                  </li>
                </ul>
                <Button className="w-full bg-brand-red hover:bg-brand-red-dark text-white">
                  Check Price for Your City
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent>
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.city}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-brand-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Rental Agreement?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers across India</p>
          <Button 
            size="lg" 
            className="bg-white text-brand-red hover:bg-gray-100 px-8 py-3 text-lg"
            onClick={scrollToForm}
          >
            Get Free Quotes Now
          </Button>
        </div>
      </section>

      {/* Sticky CTA Button for Mobile */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <Button 
          className="bg-brand-red hover:bg-brand-red-dark text-white rounded-full px-6 py-3 shadow-lg"
          onClick={scrollToForm}
        >
          Create Agreement
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default RentalAgreement;