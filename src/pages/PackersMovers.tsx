import { useEffect, useState } from 'react';
import { Truck, Shield, Headphones, DollarSign, MapPin, Users, CheckCircle, Star, Phone, Mail, Calendar, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import heroImage from '/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png';

const PackersMovers = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickupLocation: '',
    dropLocation: '',
    date: '',
    houseType: ''
  });

  useEffect(() => {
    // Smooth scroll to top when component mounts
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
    // Small delay to ensure page is fully loaded
    setTimeout(scrollToTop, 100);
  }, []);

  const scrollToForm = () => {
    const formElement = document.getElementById('quote-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const whyChooseItems = [
    {
      icon: Shield,
      title: "100% Trusted and Verified Movers",
      description: "All our partners are thoroughly verified and background checked"
    },
    {
      icon: CheckCircle,
      title: "Damage-Free Guarantee",
      description: "Your belongings are insured and handled with utmost care"
    },
    {
      icon: Headphones,
      title: "Live Support Till Delivery",
      description: "24/7 customer support throughout your moving journey"
    },
    {
      icon: DollarSign,
      title: "Affordable, Transparent Pricing",
      description: "No hidden charges, get the best competitive rates"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Share your shifting details",
      description: "Fill out the form with your moving requirements"
    },
    {
      step: "02", 
      title: "Get free instant quotes",
      description: "Receive quotes from 3 verified movers instantly"
    },
    {
      step: "03",
      title: "Compare & choose the best deal",
      description: "Select the mover that fits your budget and needs"
    },
    {
      step: "04",
      title: "Sit back and relax",
      description: "Let our professionals handle your move stress-free"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      rating: 5,
      review: "Excellent service! My entire 2BHK was moved without any damage. Highly recommend Home HNI for packers and movers.",
      location: "Hyderabad"
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      review: "Very professional team. They were on time and handled all my furniture with care. Great experience!",
      location: "Bangalore"
    },
    {
      name: "Anita Reddy",
      rating: 4,
      review: "Good service and reasonable pricing. The team was helpful throughout the entire moving process.",
      location: "Chennai"
    }
  ];

  const locations = [
    "Gachibowli", "Kukatpally", "Miyapur", "Madhapur", "LB Nagar", 
    "Kondapur", "Banjara Hills", "Jubilee Hills", "HITEC City", 
    "Secunderabad", "Uppal", "Dilsukhnagar", "Ameerpet", "Begumpet"
  ];

  const faqs = [
    {
      question: "How are your packers and movers verified?",
      answer: "We onboard only verified and reviewed vendors with background checks. Each partner goes through a rigorous verification process including license verification, insurance validation, and customer review analysis."
    },
    {
      question: "What if my items get damaged?",
      answer: "Our movers provide insurance coverage and we offer complete support throughout the move. In case of any damage, we ensure quick resolution and compensation as per the insurance policy."
    },
    {
      question: "How much do movers typically charge?",
      answer: "Charges vary by distance, number of items, and size of the move. Typically, local moves within the city range from ₹3,000 to ₹15,000 depending on the house size. You get multiple quotes to compare and choose the best option."
    },
    {
      question: "How long does the moving process take?",
      answer: "Local moves within the city typically take 4-8 hours, while intercity moves can take 1-3 days depending on the distance. We provide estimated timelines during the quote process."
    },
    {
      question: "Do you provide packing materials?",
      answer: "Yes, our partner movers provide all necessary packing materials including boxes, bubble wrap, protective sheets, and tape. The cost is included in the quote provided."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Marquee at the very top */}
      <Marquee />
      
      {/* Header overlapping with content */}
      <Header />
      
      {/* Hero Section */}
      <div className="pt-8">
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
          {/* Hero Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundPosition: 'center center'
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-4 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg">
                Reliable Packers and Movers
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-shadow-md">
                Shift your home stress-free with Home HNI's verified moving partners.
              </p>
              <Button 
                onClick={scrollToForm}
                size="lg" 
                className="text-lg px-8 py-4 bg-brand-red hover:bg-brand-red-dark text-white"
              >
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>




        {/* Lead Form Section */}
        <div id="quote-form" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Get Free Quotes
                </h2>
                <p className="text-lg text-gray-600">
                  Fill in your details and get instant quotes from verified movers
                </p>
              </div>
              
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="pickup">Pickup Location</Label>
                      <Input
                        id="pickup"
                        value={formData.pickupLocation}
                        onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                        placeholder="From where?"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="drop">Drop Location</Label>
                      <Input
                        id="drop"
                        value={formData.dropLocation}
                        onChange={(e) => handleInputChange('dropLocation', e.target.value)}
                        placeholder="To where?"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="date">Moving Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="house-type">House Type</Label>
                      <Select value={formData.houseType} onValueChange={(value) => handleInputChange('houseType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select house type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1bhk">1 BHK</SelectItem>
                          <SelectItem value="2bhk">2 BHK</SelectItem>
                          <SelectItem value="3bhk">3 BHK</SelectItem>
                          <SelectItem value="4bhk">4+ BHK</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full text-lg py-3 bg-brand-red hover:bg-brand-red-dark">
                    Get Quotes
                  </Button>
                </form>
                
                <p className="text-center text-gray-600 mt-4">
                  We'll connect you with 3 trusted movers in under 5 minutes.
                </p>
              </Card>
            </div>
          </div>
        </div>


        

        {/* Why Choose Home HNI Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Home HNI?
              </h2>
              <p className="text-lg text-gray-600">
                Experience hassle-free moving with our trusted partners
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseItems.map((item, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-brand-red" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Step-by-Step Process */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Simple steps to get your move started
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        

        {/* Customer Testimonials */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-600">
                Real experiences from satisfied customers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.review}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Service Coverage Locations */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                We Provide Moving Services Across India
              </h2>
              <p className="text-lg text-gray-600">
                Available in major cities and localities
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {locations.map((location, index) => (
                <div key={index} className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <MapPin className="w-5 h-5 text-brand-red mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600">
                  Everything you need to know about our moving services
                </p>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-16 bg-brand-red text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Move?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get instant quotes from verified movers and start your stress-free journey
            </p>
            <Button 
              onClick={scrollToForm}
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 bg-white text-brand-red hover:bg-gray-100"
            >
              Get Free Quotes Now
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PackersMovers;