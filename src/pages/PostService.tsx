import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { Building2, Users, CreditCard, Calculator, TrendingUp, FileText, MapPin, Crown, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Globe, Shield as ShieldCheck, Headphones, Smartphone, Download, Home, Percent, DollarSign, Loader2 } from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";

interface FormData {
  name: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  intent: string;
  propertyType: string;
  services: string[];
  otherService: string;
  budgetMin: string;
  budgetMax: string;
  currency: string;
  premiumSelected: boolean;
  paymentMethod: string;
  notes: string;
}

const PostService = () => {
  const [statesData, setStatesData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateDesktop, setSelectedStateDesktop] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [citiesDesktop, setCitiesDesktop] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    country: "India",
    state: "",
    city: "",
    intent: "",
    propertyType: "",
    services: [],
    otherService: "",
    budgetMin: "",
    budgetMax: "",
    currency: "INR",
    premiumSelected: false,
    paymentMethod: "",
    notes: ""
  });

  const services = [{
    icon: Home,
    title: "Property Requirements",
    description: "Get matched with the perfect property options."
  }, {
    icon: Building2,
    title: "Investment Advisory",
    description: "Expert guidance for your property investments."
  }, {
    icon: Calculator,
    title: "Market Analysis",
    description: "Detailed market insights and property valuations."
  }, {
    icon: TrendingUp,
    title: "Portfolio Management",
    description: "Professional management of your property portfolio."
  }, {
    icon: CreditCard,
    title: "Financial Planning",
    description: "Comprehensive financial planning for property purchases."
  }, {
    icon: FileText,
    title: "Legal Documentation",
    description: "Complete legal support and documentation services."
  }];

  const targetAudience = [{
    icon: Home,
    title: "Property Buyers",
    description: "Looking for their dream property with best options"
  }, {
    icon: TrendingUp,
    title: "Property Investors",
    description: "Seeking profitable investment opportunities"
  }, {
    icon: Building2,
    title: "Property Sellers",
    description: "Want to get the best value for their property"
  }];

  const comparisonData = [{
    feature: "Instant Property Matching",
    homeHNI: true,
    others: false
  }, {
    feature: "Premium Property Options",
    homeHNI: true,
    others: false
  }, {
    feature: "Dedicated Property Advisor",
    homeHNI: true,
    others: false
  }, {
    feature: "Market Analysis Reports",
    homeHNI: true,
    others: false
  }, {
    feature: "Legal Documentation Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Zero Brokerage Options",
    homeHNI: true,
    others: false
  }, {
    feature: "24/7 Customer Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Property Investment Guidance",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Rajesh Kumar",
    role: "Property Buyer",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Found my perfect home in just 2 days! The team matched my requirements perfectly."
  }, {
    name: "Priya Sharma",
    role: "Property Seller",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Sold my property at the best market price. Excellent service and support!"
  }, {
    name: "Amit Patel",
    role: "Property Investor",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Great investment opportunities and professional guidance. Highly recommended!"
  }];

  const faqs = [{
    question: "How does the property matching service work?",
    answer: "We analyze your requirements and match them with our extensive database of properties. Our AI-powered system ensures you get the most relevant options based on your budget, location, and preferences."
  }, {
    question: "What types of properties do you handle?",
    answer: "We handle all types of properties including residential apartments, independent houses, commercial spaces, plots, and investment properties across major cities."
  }, {
    question: "Is there any charge for posting requirements?",
    answer: "Basic requirement posting is completely free. We also offer premium services with additional benefits like priority matching and dedicated advisor support."
  }, {
    question: "How quickly will I get matched properties?",
    answer: "Most users receive their first set of matched properties within 24 hours of posting their requirements. Premium users get priority matching within 2-4 hours."
  }, {
    question: "What is included in premium service?",
    answer: "Premium service includes priority matching, featured placement, dedicated property advisor, market analysis reports, and 24/7 support for just ₹999 one-time."
  }];

  const { submissionState, setSubmitting, showSuccessToast, showErrorToast, updateProgress } = useFormSubmission();
  const { toast } = useToast();

  // Load states and cities data
  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch('/data/india_states_cities.json');
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error('Failed to load states data:', error);
      }
    };
    loadStatesData();
  }, []);

  // Update cities when state changes (mobile)
  useEffect(() => {
    if (statesData && selectedState) {
      const cities = statesData[selectedState];
      setCities(cities || []);
    } else {
      setCities([]);
    }
  }, [selectedState, statesData]);

  // Update cities when state changes (desktop)
  useEffect(() => {
    if (statesData && selectedStateDesktop) {
      const cities = statesData[selectedStateDesktop];
      setCitiesDesktop(cities || []);
    } else {
      setCitiesDesktop([]);
    }
  }, [selectedStateDesktop, statesData]);

  // Update currency based on country
  useEffect(() => {
    let currency = "INR";
    switch (formData.country) {
      case "UAE":
        currency = "AED";
        break;
      case "USA":
        currency = "USD";
        break;
      case "India":
      default:
        currency = "INR";
        break;
    }
    setFormData(prev => ({ ...prev, currency }));
  }, [formData.country]);

  const intentOptions = [
    { value: "Buy", label: "Buy" },
    { value: "Sell", label: "Sell" },
    { value: "Lease", label: "Lease" },
    { value: "Service", label: "Service" }
  ];

  const propertyTypes = [
    "Apartment/Flat",
    "Independent House/Villa", 
    "Plot/Land",
    "Office",
    "Retail/Shop",
    "Warehouse",
    "Industrial",
    "Co-working",
    "Others"
  ];

  const serviceOptions = [
    "Property Management",
    "Tenant Management", 
    "Rental & Leasing",
    "Property Valuation",
    "Legal & Documentation",
    "Home Interiors",
    "Home Loan Assistance",
    "Property Maintenance & Repairs",
    "NRI Property Assistance",
    "Sale Advisory",
    "Buy Advisory", 
    "Due Diligence",
    "Others"
  ];

  const countryOptions = [
    { value: "India", label: "India", symbol: "₹" },
    { value: "UAE", label: "UAE", symbol: "AED" },
    { value: "USA", label: "USA", symbol: "$" }
  ];

  const getCurrencySymbol = () => {
    return countryOptions.find(c => c.value === formData.country)?.symbol || "₹";
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^\d]/g, ""))) {
      newErrors.phone = "Phone number must be 10-15 digits";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.intent) newErrors.intent = "Please select what you want to do";
    
    if (["Buy", "Sell", "Lease"].includes(formData.intent) && !formData.propertyType) {
      newErrors.propertyType = "Property type is required";
    }
    
    if (formData.intent === "Service" && formData.services.length === 0) {
      newErrors.services = "Please select at least one service";
    }
    
    if (formData.services.includes("Others") && !formData.otherService.trim()) {
      newErrors.otherService = "Please specify the service";
    }

    if (formData.budgetMin && formData.budgetMax) {
      if (Number(formData.budgetMin) > Number(formData.budgetMax)) {
        newErrors.budget = "Minimum budget cannot be greater than maximum budget";
      }
    }

    if (formData.premiumSelected && !formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    let newServices = [...formData.services];
    if (checked) {
      newServices.push(service);
    } else {
      newServices = newServices.filter(s => s !== service);
    }
    handleInputChange("services", newServices);
  };

  const initiatePayment = async (amount: number, currency: string): Promise<boolean> => {
    // Mock payment function - replace with real payment gateway
    updateProgress("Processing payment...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showErrorToast("Validation Error", "Please correct the errors and try again");
      return;
    }

    setSubmitting(true);
    
    try {
      // Handle premium payment if selected
      if (formData.premiumSelected) {
        updateProgress("Processing payment...");
        const paymentSuccess = await initiatePayment(999, formData.currency);
        if (!paymentSuccess) {
          throw new Error("Payment failed");
        }
      }

      // Submit form data
      updateProgress("Submitting your requirement...");
      
      const submissionData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        intent: formData.intent,
        ...(["Buy", "Sell", "Lease"].includes(formData.intent) && { propertyType: formData.propertyType }),
        ...(formData.intent === "Service" && { services: formData.services }),
        ...(formData.services.includes("Others") && { otherService: formData.otherService }),
        budget: {
          min: Number(formData.budgetMin) || 0,
          max: Number(formData.budgetMax) || 0,
          currency: formData.currency
        },
        premiumSelected: formData.premiumSelected,
        paymentMethod: formData.premiumSelected ? formData.paymentMethod : null,
        notes: formData.notes
      };

      // Mock API call - replace with real endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate reference ID
      const refId = `REQ${Date.now().toString().slice(-6)}`;
      setReferenceId(refId);
      setShowSuccess(true);
      
      if (formData.premiumSelected) {
        showSuccessToast("Success", "Payment captured (test) - Your requirement has been posted!");
      } else {
        showSuccessToast("Success", "Your requirement has been posted successfully!");
      }

    } catch (error) {
      showErrorToast("Submission Failed", "Please try again or contact support");
    } finally {
      setSubmitting(false);
    }
  };

  // SEO
  useEffect(() => {
    document.title = "Post Your Property Requirement | Home HNI";
    const desc = "Tell us what you need and we'll match you with the best property options. Post your buying, selling, leasing, or service requirements.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + '/post-service');
  }, []);

  if (showSuccess) {
    return (
      <div className="min-h-screen">
        <Marquee />
        <Header />
        
        <section className="pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <Card className="p-8">
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h1 className="text-2xl font-bold text-foreground">Requirement Posted Successfully!</h1>
                <p className="text-muted-foreground">
                  Your requirement has been submitted and our team will get back to you shortly.
                </p>
                <div className="bg-muted p-4 rounded-lg w-full text-left">
                  <h3 className="font-semibold mb-2">Submission Summary:</h3>
                  <p><strong>Reference ID:</strong> {referenceId}</p>
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Location:</strong> {formData.city}, {formData.state}</p>
                  <p><strong>Intent:</strong> {formData.intent}</p>
                  {formData.budgetMin && formData.budgetMax && (
                    <p><strong>Budget:</strong> {getCurrencySymbol()} {formData.budgetMin} - {getCurrencySymbol()} {formData.budgetMax}</p>
                  )}
                  {formData.premiumSelected && (
                    <p><strong>Premium Service:</strong> Active</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => setShowSuccess(false)} variant="outline">
                    Post Another Requirement
                  </Button>
                  <Button onClick={() => window.location.href = "/"}>
                    Go Home
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
                Post Your Requirement
                <br className="hidden md:block" />
                <span className="block">& Get Perfect Matches</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Tell us what you need and we'll match you with the best property options
                from our verified network of properties and services.
              </p>
            </div>

            {/* Right: Placeholder for form on desktop */}
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Form Container for Large Screens */}
      <div className="hidden lg:block fixed top-32 right-8 z-40 w-96">
        <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2 text-center">Post Your Requirement</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">Fill the form & get perfect matches</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input 
                placeholder="Name" 
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required 
              />

              <div className="flex gap-2">
                <Select defaultValue="+91">
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+971">🇦🇪 +971</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="flex-1"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required 
                />
              </div>

              <Input 
                type="email" 
                placeholder="Email ID"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required 
              />

              <div className="flex gap-2">
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Country" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={setSelectedStateDesktop}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="State" /></SelectTrigger>
                  <SelectContent>
                    {statesData && Object.keys(statesData).map((state: string) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="City" /></SelectTrigger>
                  <SelectContent>
                    {citiesDesktop.map((city: string) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Select value={formData.intent} onValueChange={(value) => {
                  handleInputChange("intent", value);
                  handleInputChange("propertyType", "");
                  handleInputChange("services", []);
                }}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="I want to" /></SelectTrigger>
                  <SelectContent>
                    {intentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
                    {getCurrencySymbol()}
                  </span>
                  <Input
                    type="number"
                    placeholder="Budget"
                    className="pl-12"
                    value={formData.budgetMax}
                    onChange={(e) => handleInputChange("budgetMax", e.target.value)}
                  />
                </div>
              </div>

              {/* Conditional Fields */}
              {["Buy", "Sell", "Lease"].includes(formData.intent) && (
                <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                  <SelectTrigger><SelectValue placeholder="Property Type" /></SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {formData.intent === "Service" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-1">
                    {serviceOptions.slice(0, 4).map(service => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.services.includes(service)}
                          onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                        />
                        <Label htmlFor={service} className="text-xs cursor-pointer">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Toggle */}
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">Premium - {getCurrencySymbol()}999</span>
                <Switch
                  checked={formData.premiumSelected}
                  onCheckedChange={(checked) => handleInputChange("premiumSelected", checked)}
                />
              </div>

              {formData.premiumSelected && (
                <RadioGroup 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  className="flex gap-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="UPI" id="upi-desktop" />
                    <Label htmlFor="upi-desktop" className="text-xs cursor-pointer">UPI</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="Card" id="card-desktop" />
                    <Label htmlFor="card-desktop" className="text-xs cursor-pointer">Card</Label>
                  </div>
                </RadioGroup>
              )}

              <Button type="submit" className="w-full" disabled={submissionState.isSubmitting}>
                {submissionState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {submissionState.uploadProgress}
                  </>
                ) : (
                  "Post Requirement Now!"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Form - Static below hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3 text-center">Post Your Requirement</h3>
              <p className="text-base text-muted-foreground mb-8 text-center">Fill the form & get perfect matches</p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <Input 
                  placeholder="Name" 
                  className="h-12 text-base bg-background"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required 
                />

                <div className="flex gap-3">
                  <Select defaultValue="+91">
                    <SelectTrigger className="w-32 h-12 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1 h-12 text-base bg-background"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required 
                  />
                </div>

                <Input 
                  type="email" 
                  placeholder="Email ID" 
                  className="h-12 text-base bg-background"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />

                <div className="flex gap-3">
                  <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="UAE">UAE</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={setSelectedState}>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {statesData && Object.keys(statesData).map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {cities.map((city: string) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Select value={formData.intent} onValueChange={(value) => {
                    handleInputChange("intent", value);
                    handleInputChange("propertyType", "");
                    handleInputChange("services", []);
                  }}>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="I want to" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {intentOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
                      {getCurrencySymbol()}
                    </span>
                    <Input
                      type="number"
                      placeholder="Budget"
                      className="h-12 text-base bg-background pl-12"
                      value={formData.budgetMax}
                      onChange={(e) => handleInputChange("budgetMax", e.target.value)}
                    />
                  </div>
                </div>

                {["Buy", "Sell", "Lease"].includes(formData.intent) && (
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                    <SelectTrigger className="h-12 bg-background">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {formData.intent === "Service" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      {serviceOptions.slice(0, 8).map(service => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-${service}`}
                            checked={formData.services.includes(service)}
                            onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                          />
                          <Label htmlFor={`mobile-${service}`} className="text-sm cursor-pointer">
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.services.includes("Others") && (
                      <Input
                        value={formData.otherService}
                        onChange={(e) => handleInputChange("otherService", e.target.value)}
                        placeholder="Please specify"
                        className="h-12 text-base bg-background"
                      />
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Premium Service - {getCurrencySymbol()}999</span>
                  <Switch
                    checked={formData.premiumSelected}
                    onCheckedChange={(checked) => handleInputChange("premiumSelected", checked)}
                  />
                </div>

                {formData.premiumSelected && (
                  <div className="bg-muted p-3 rounded-lg">
                    <RadioGroup 
                      value={formData.paymentMethod} 
                      onValueChange={(value) => handleInputChange("paymentMethod", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="UPI" id="upi-mobile" />
                        <Label htmlFor="upi-mobile" className="text-sm cursor-pointer">UPI</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Card" id="card-mobile" />
                        <Label htmlFor="card-mobile" className="text-sm cursor-pointer">Card</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <Button type="submit" className="w-full h-12" disabled={submissionState.isSubmitting}>
                  {submissionState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {submissionState.uploadProgress}
                    </>
                  ) : (
                    "Post Requirement Now!"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Property Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive property solutions to meet all your real estate needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Who We Serve
            </h2>
            <p className="text-lg text-muted-foreground">
              Tailored property solutions for every type of real estate need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {targetAudience.map((audience, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6">
                  <audience.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {audience.title}
                </h3>
                <p className="text-muted-foreground">
                  {audience.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Home HNI?
            </h2>
            <p className="text-lg text-muted-foreground">
              See how we compare to other property service providers
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-semibold">Features</th>
                    <th className="text-center p-4 font-semibold text-primary">Home HNI</th>
                    <th className="text-center p-4 font-semibold">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-4 font-medium">{item.feature}</td>
                      <td className="text-center p-4">
                        {item.homeHNI ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-4">
                        {item.others ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Real experiences from satisfied property seekers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Get answers to common questions about our property services
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default PostService;