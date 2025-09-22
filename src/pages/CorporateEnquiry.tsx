import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, FileText, Truck, Paintbrush, Sparkles, Snowflake, Building, Users, Home, PhoneCall, Mail, MapPin, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import { useToast } from '@/hooks/use-toast';

// Import company logos
import companyLogo1 from '@/assets/company-logo-1.png';
import companyLogo2 from '@/assets/company-logo-2.png';
import companyLogo3 from '@/assets/company-logo-3.png';
import companyLogo4 from '@/assets/company-logo-4.png';

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
  const { toast } = useToast();

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

  const services = [
    {
      icon: Search,
      title: "House Search",
      description: "Expert assistance in finding the perfect home"
    },
    {
      icon: FileText,
      title: "Rental Agreement",
      description: "Professional drafting and legal compliance"
    },
    {
      icon: Truck,
      title: "Packers & Movers",
      description: "Hassle-free relocation services"
    },
    {
      icon: Paintbrush,
      title: "Home Painting",
      description: "Professional painting solutions"
    },
    {
      icon: Sparkles,
      title: "Home Cleaning",
      description: "Comprehensive cleaning services"
    },
    {
      icon: Snowflake,
      title: "AC Servicing",
      description: "Professional maintenance and repairs"
    }
  ];

  const workingSteps = [
    {
      step: "1",
      title: "Sign Up with Us",
      description: "Once onboarded, we'll create exclusive, customized offers tailored for your company."
    },
    {
      step: "2",
      title: "Employees Choose Their Service",
      description: "Through our website or app, employees can select and book services with ease."
    },
    {
      step: "3",
      title: "Unlock Offers",
      description: "Employees simply fill in basic details and unlock exclusive discounts."
    }
  ];

  const benefits = [
    {
      icon: Truck,
      title: "Packers & Movers",
      description: "Hassle-free relocation and on-time delivery"
    },
    {
      icon: Home,
      title: "House-hunting Assistance",
      description: "Buy, Sell, or Rent properties with expert help"
    },
    {
      icon: Sparkles,
      title: "Home Services",
      description: "Cleaning, Painting, AC Services and more — on demand"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Corporate Enquiry Form - Desktop Only */}
      <div className="hidden xl:block fixed top-32 right-6 z-50 w-96">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-primary p-6 backdrop-blur-sm">
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
            <Button type="submit" className="w-full bg-brand-red hover:bg-brand-red-dark text-white text-sm">
              Submit Enquiry
            </Button>
          </form>
        </div>
      </div>

      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-20 md:pb-32 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')"
      }}>
        <div className="absolute inset-0 bg-red-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Comprehensive Corporate Solutions
                <br className="hidden md:block" />
                <span className="block">for Your Business</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Partner with us to receive the best prices on a wide range of professional 
                real estate and home services — exclusively for your employees.
              </p>
            </div>

            {/* Right: Placeholder for sticky form on desktop */}
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile & Tablet Corporate Enquiry Form - Below Hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-primary p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-red to-brand-red-dark rounded-full mx-auto mb-3 flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Corporate Enquiry</h3>
              <p className="text-sm text-gray-600">Get custom solutions for your company</p>
            </div>
            
            <form onSubmit={handleStickySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input name="name" placeholder="Your Name *" value={stickyFormData.name} onChange={handleStickyInputChange} required className="text-sm" />
                <Input name="company" placeholder="Company Name *" value={stickyFormData.company} onChange={handleStickyInputChange} required className="text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input name="phone" type="tel" placeholder="Phone Number *" value={stickyFormData.phone} onChange={handleStickyInputChange} required className="text-sm" />
                <Input name="email" type="email" placeholder="Official Email *" value={stickyFormData.email} onChange={handleStickyInputChange} required className="text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input name="city" placeholder="City" value={stickyFormData.city} onChange={handleStickyInputChange} className="text-sm" />
                <Input name="employees" type="number" placeholder="Number of Employees" value={stickyFormData.employees} onChange={handleStickyInputChange} className="text-sm" />
              </div>
              <Button type="submit" className="w-full bg-brand-red hover:bg-brand-red-dark text-white text-sm">
                Submit Enquiry
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-8">Trusted by Leading Companies</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <img src={companyLogo1} alt="TechCorp" className="h-20 w-auto mx-auto object-contain" />
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <img src={companyLogo2} alt="FinanceMax" className="h-20 w-auto mx-auto object-contain" />
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <img src={companyLogo3} alt="ConsultPro" className="h-20 w-auto mx-auto object-contain" />
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <img src={companyLogo4} alt="IndustrialMax" className="h-20 w-auto mx-auto object-contain" />
                </div>
              </div>
            </div>
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 px-4" id="services">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                Explore Our Solutions for Your:
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                {/* Employees */}
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-6">
                    <Users className="h-8 w-8 text-brand-red mr-3" />
                    <h3 className="text-2xl font-bold text-foreground">Employees</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      House Search Support
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Rental Agreements
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Packers and Movers
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Home Painting
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Home Cleaning
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      AC Servicing
                    </li>
                  </ul>
                </div>

                {/* Office Space */}
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-6">
                    <Building className="h-8 w-8 text-brand-red mr-3" />
                    <h3 className="text-2xl font-bold text-foreground">Office Space</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Assistance with leasing
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Customized relocation plans
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      Office shifting & setup
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                Services We Offer to Your Employees
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                    <service.icon className="h-12 w-12 text-brand-red mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {workingSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-brand-red text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Why Use Our Corporate Solutions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                Why Use Our Corporate Solutions?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <benefit.icon className="h-10 w-10 text-brand-red mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Corporate Services Footer */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl space-y-12">
              {/* Employee Services Section */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Employee Services</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">House Search in Mumbai</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">House Search in Delhi</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">House Search in Bangalore</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">House Search in Pune</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">House Search in Hyderabad</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">House Search in Chennai</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Rental Agreements</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Packers & Movers</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Home Painting Services</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Home Cleaning Services</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">AC Servicing</span>
                </div>
              </div>

              {/* Corporate Office Solutions Section */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Corporate Office Solutions</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Office Leasing in Mumbai</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Corporate Relocation Services</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Office Setup & Design</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Office Leasing in Delhi</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Office Leasing in Bangalore</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Employee Relocation Services</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Facility Management</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Commercial Property Valuation</span>
                </div>
              </div>

              {/* Corporate Benefits & Support Section */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Corporate Benefits & Support</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Exclusive Corporate Discounts</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Priority Customer Support</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Custom Service Packages</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Bulk Service Orders</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Employee Training & Onboarding</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Analytics & Reporting</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">Dedicated Account Manager</span>
                </div>
              </div>
            </div>
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-300 text-center">
            <p className="text-sm text-gray-600">
              © 2024 Home HNI. All rights reserved. | 
              <a href="/privacy-policy" className="hover:text-foreground ml-1">Privacy Policy</a> | 
              <a href="/terms-and-conditions" className="hover:text-foreground ml-1">Terms & Conditions</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporateEnquiry;