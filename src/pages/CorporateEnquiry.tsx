import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, FileText, Truck, Paintbrush, Sparkles, Snowflake, Building, Users, Home, PhoneCall, Mail, MapPin, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
const CorporateEnquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    employees: ''
  });
  const [stickyFormData, setStickyFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    employees: ''
  });
  const {
    toast
  } = useToast();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Enquiry Submitted Successfully",
      description: "Our team will reach out with a custom offer plan for your company."
    });
    // Reset form
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      city: '',
      employees: ''
    });
  };
  const handleStickyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStickyFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleStickySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Enquiry Submitted Successfully",
      description: "Our team will reach out with a custom offer plan for your company."
    });
    // Reset sticky form
    setStickyFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      city: '',
      employees: ''
    });
  };
  const services = [{
    icon: Search,
    title: "House Search",
    description: "Expert assistance in finding the perfect home"
  }, {
    icon: FileText,
    title: "Rental Agreement",
    description: "Professional drafting and legal compliance"
  }, {
    icon: Truck,
    title: "Packers & Movers",
    description: "Hassle-free relocation services"
  }, {
    icon: Paintbrush,
    title: "Home Painting",
    description: "Professional painting solutions"
  }, {
    icon: Sparkles,
    title: "Home Cleaning",
    description: "Comprehensive cleaning services"
  }, {
    icon: Snowflake,
    title: "AC Servicing",
    description: "Professional maintenance and repairs"
  }];
  const workingSteps = [{
    step: "1",
    title: "Sign Up with Us",
    description: "Once onboarded, we'll create exclusive, customized offers tailored for your company."
  }, {
    step: "2",
    title: "Employees Choose Their Service",
    description: "Through our website or app, employees can select and book services with ease."
  }, {
    step: "3",
    title: "Unlock Offers",
    description: "Employees simply fill in basic details and unlock exclusive discounts."
  }];
  const benefits = [{
    icon: Truck,
    title: "Packers & Movers",
    description: "Hassle-free relocation and on-time delivery"
  }, {
    icon: Home,
    title: "House-hunting Assistance",
    description: "Buy, Sell, or Rent properties with expert help"
  }, {
    icon: Sparkles,
    title: "Home Services",
    description: "Cleaning, Painting, AC Services and more — on demand"
  }];
  return <div className="min-h-screen bg-background">
      {/* Sticky Corporate Enquiry Form - Desktop Only */}
      <div className="hidden xl:block fixed top-32 right-6 z-50 w-96">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 p-6 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-red to-brand-red-dark rounded-full mx-auto mb-3 flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Corporate Enquiry</h3>
            <p className="text-sm text-gray-600">Get custom solutions for your company</p>
          </div>
          
          <form onSubmit={handleStickySubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input name="name" placeholder="Your Name *" value={stickyFormData.name} onChange={handleStickyInputChange} required className="text-sm" />
              <Input name="company" placeholder="Company Name *" value={stickyFormData.company} onChange={handleStickyInputChange} required className="text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input name="phone" type="tel" placeholder="Phone Number *" value={stickyFormData.phone} onChange={handleStickyInputChange} required className="text-sm" />
              <Input name="email" type="email" placeholder="Official Email *" value={stickyFormData.email} onChange={handleStickyInputChange} required className="text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input name="city" placeholder="City" value={stickyFormData.city} onChange={handleStickyInputChange} className="text-sm" />
              <Input name="employees" type="number" placeholder="Number of Employees" value={stickyFormData.employees} onChange={handleStickyInputChange} className="text-sm" />
            </div>
            <Button type="submit" className="w-full bg-brand-red hover:bg-brand-red-dark text-sm">
              Submit Enquiry
            </Button>
          </form>
        </div>
      </div>
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto text-center xl:pr-96">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive Corporate Solutions
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Partner with us to receive the best prices on a wide range of professional real estate and home services — exclusively for your employees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-brand-red hover:bg-brand-red-dark" onClick={() => document.getElementById('form')?.scrollIntoView()}>
              Sign Up for Your Company
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('services')?.scrollIntoView()}>
              Know More
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 text-center xl:pr-96">
          <h2 className="text-2xl font-semibold text-foreground mb-8">Trusted by Leading Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="bg-card p-6 rounded-lg border border-border">
                <div className="h-12 bg-muted rounded flex items-center justify-center">
                  <Building className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 px-4" id="services">
        <div className="max-w-6xl mx-auto xl:pr-96">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Explore Our Solutions for Your:
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Employees */}
            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-brand-red mr-3" />
                <h3 className="text-2xl font-bold text-foreground">Employees</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  House Search Support
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Rental Agreements
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Packers and Movers
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Home Painting
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Home Cleaning
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  AC Servicing
                </li>
              </ul>
            </div>

            {/* Office Space */}
            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="flex items-center mb-6">
                <Building className="h-8 w-8 text-brand-red mr-3" />
                <h3 className="text-2xl font-bold text-foreground">Office Space</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Assistance with leasing
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Customized relocation plans
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Office shifting & setup
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 xl:pr-96">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Services We Offer to Your Employees
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => <div key={index} className="bg-card p-6 rounded-lg border border-border text-center">
                <service.icon className="h-12 w-12 text-brand-red mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto xl:pr-96">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {workingSteps.map((step, index) => <div key={index} className="text-center">
                <div className="w-16 h-16 bg-brand-red text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Why Use Our Corporate Solutions */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 xl:pr-96">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Use Our Corporate Solutions?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => <div key={index} className="bg-card p-6 rounded-lg border border-border">
                <benefit.icon className="h-10 w-10 text-brand-red mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Mobile Corporate Enquiry Form */}
      <section className="xl:hidden py-8 px-4 bg-muted/30">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Corporate Enquiry</h3>
              <p className="text-sm text-gray-600">Get custom solutions for your company</p>
            </div>
            
            <form onSubmit={handleStickySubmit} className="space-y-4">
              <div>
                <Input name="name" placeholder="Your Name *" value={stickyFormData.name} onChange={handleStickyInputChange} required />
              </div>
              <div>
                <Input name="company" placeholder="Company Name *" value={stickyFormData.company} onChange={handleStickyInputChange} required />
              </div>
              <div>
                <Input name="phone" type="tel" placeholder="Phone Number *" value={stickyFormData.phone} onChange={handleStickyInputChange} required />
              </div>
              <div>
                <Input name="email" type="email" placeholder="Official Email *" value={stickyFormData.email} onChange={handleStickyInputChange} required />
              </div>
              <div>
                <Input name="city" placeholder="City" value={stickyFormData.city} onChange={handleStickyInputChange} />
              </div>
              <div>
                <Input name="employees" type="number" placeholder="Number of Employees" value={stickyFormData.employees} onChange={handleStickyInputChange} />
              </div>
              <Button type="submit" className="w-full bg-brand-red hover:bg-brand-red-dark">
                Submit Enquiry
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Corporate Services Footer */}
      <section className="py-16 bg-muted/30 border-t">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-12">
            {/* Employee Services Section */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Employee Services</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">House Search in Mumbai</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">House Search in Delhi</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">House Search in Bangalore</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">House Search in Pune</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">House Search in Hyderabad</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">House Search in Chennai</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Rental Agreements</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Packers & Movers</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Home Painting Services</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Home Cleaning Services</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">AC Servicing</span>
              </div>
            </div>

            {/* Corporate Office Solutions Section */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Corporate Office Solutions</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Office Leasing in Mumbai</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Corporate Relocation Services</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Office Setup & Design</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Facility Management</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Commercial Property Valuation</span>
              </div>
            </div>

            {/* Corporate Benefits & Support Section */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Corporate Benefits & Support</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Exclusive Corporate Discounts</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Priority Customer Support</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Custom Service Packages</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Bulk Service Orders</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Employee Training & Onboarding</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Analytics & Reporting</span>
                <span className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer transition-colors">Dedicated Account Manager</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Home HNI. All rights reserved. | 
              <a href="/privacy-policy" className="hover:text-foreground ml-1">Privacy Policy</a> | 
              <a href="/terms-and-conditions" className="hover:text-foreground ml-1">Terms & Conditions</a>
            </p>
          </div>
        </div>
      </section>

    </div>;
};
export default CorporateEnquiry;