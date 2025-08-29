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
import { useToast } from "@/hooks/use-toast";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { Building2, MapPin, DollarSign, Loader2, CheckCircle, Home } from "lucide-react";
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

  const [statesData, setStatesData] = useState<any>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

  // Update cities when state changes
  useEffect(() => {
    if (statesData && formData.state && formData.country === "India") {
      const stateCities = statesData[formData.state];
      setCities(stateCities || []);
    } else {
      setCities([]);
    }
  }, [formData.state, statesData, formData.country]);

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
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
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
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Post Your Requirement
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Tell us what you need and we'll match you with the best options.
              </p>
            </div>
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Form - Static below hero */}
      <section className="hidden lg:block px-4 py-8 bg-background">
        <div className="container mx-auto max-w-2xl">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3 text-center">Post Your Requirement</h3>
              <p className="text-base text-muted-foreground mb-8 text-center">Fill the form & we'll match you with the best options</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your full name"
                  className="h-12 text-base bg-background"
                  required 
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}

                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Phone Number"
                  className="h-12 text-base bg-background"
                  required 
                />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}

                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email ID"
                  className="h-12 text-base bg-background"
                  required 
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}

                <div className="flex gap-3">
                  <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {countryOptions.map(country => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={formData.state} 
                    onValueChange={(value) => {
                      handleInputChange("state", value);
                      handleInputChange("city", "");
                    }}
                  >
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {formData.country === "India" && statesData && Object.keys(statesData).map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                      {formData.country === "UAE" && (
                        <>
                          <SelectItem value="Dubai">Dubai</SelectItem>
                          <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                          <SelectItem value="Sharjah">Sharjah</SelectItem>
                        </>
                      )}
                      {formData.country === "USA" && (
                        <>
                          <SelectItem value="California">California</SelectItem>
                          <SelectItem value="Texas">Texas</SelectItem>
                          <SelectItem value="New York">New York</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>

                  <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                      {cities.length === 0 && formData.state && (
                        <SelectItem value="Other">Other</SelectItem>
                      )}
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
                      value={formData.budgetMax}
                      onChange={(e) => handleInputChange("budgetMax", e.target.value)}
                      placeholder="Budget Required"
                      className="h-12 text-base bg-background pl-12"
                    />
                  </div>
                </div>

                {/* Conditional Fields */}
                {["Buy", "Sell", "Lease"].includes(formData.intent) && (
                  <div className="transition-all duration-300 ease-in-out">
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
                    {errors.propertyType && <p className="text-sm text-destructive mt-1">{errors.propertyType}</p>}
                  </div>
                )}

                {formData.intent === "Service" && (
                  <div className="transition-all duration-300 ease-in-out space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {serviceOptions.slice(0, 6).map(service => (
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
                    {formData.services.includes("Others") && (
                      <Input
                        value={formData.otherService}
                        onChange={(e) => handleInputChange("otherService", e.target.value)}
                        placeholder="Please specify"
                        className="h-12 text-base bg-background"
                      />
                    )}
                    {errors.services && <p className="text-sm text-destructive mt-1">{errors.services}</p>}
                  </div>
                )}

                {formData.premiumSelected && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Premium Service Selected - {getCurrencySymbol()}999</p>
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
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="NetBanking" id="netbanking-mobile" />
                        <Label htmlFor="netbanking-mobile" className="text-sm cursor-pointer">Net Banking</Label>
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

      {/* Mobile Form - Static below hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3 text-center">Post Your Requirement</h3>
              <p className="text-base text-muted-foreground mb-8 text-center">Fill the form & we'll match you with the best options</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your full name"
                  className="h-12 text-base bg-background"
                  required 
                />

                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Phone Number"
                  className="h-12 text-base bg-background"
                  required 
                />

                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email ID"
                  className="h-12 text-base bg-background"
                  required 
                />

                <div className="flex gap-3">
                  <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {countryOptions.map(country => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={formData.state} 
                    onValueChange={(value) => {
                      handleInputChange("state", value);
                      handleInputChange("city", "");
                    }}
                  >
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {formData.country === "India" && statesData && Object.keys(statesData).map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
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
                      value={formData.budgetMax}
                      onChange={(e) => handleInputChange("budgetMax", e.target.value)}
                      placeholder="Budget Required"
                      className="h-12 text-base bg-background pl-12"
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
    </div>
  );
};

export default PostService;