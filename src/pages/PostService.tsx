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
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { Loader2, CheckCircle } from "lucide-react";
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
  budgetRange: number[];
  currency: string;
  premiumSelected: boolean;
  paymentMethod: string;
  notes: string;
}

const PostService = () => {
  const [statesData, setStatesData] = useState<any>(null);
  const [cities, setCities] = useState<string[]>([]);
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
    budgetRange: [0, 50000000],
    currency: "INR",
    premiumSelected: false,
    paymentMethod: "",
    notes: ""
  });

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

  const formatBudgetAmount = (amount: number) => {
    const symbol = getCurrencySymbol();
    if (amount >= 10000000) { // 1 crore or more
      return `${symbol} ${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) { // 1 lakh or more
      return `${symbol} ${(amount / 100000).toFixed(1)} L`;
    } else if (amount >= 1000) { // 1 thousand or more
      return `${symbol} ${(amount / 1000).toFixed(0)}K`;
    } else {
      return `${symbol} ${amount.toLocaleString()}`;
    }
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

    if (formData.budgetRange[0] > formData.budgetRange[1]) {
      newErrors.budget = "Minimum budget cannot be greater than maximum budget";
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
          min: formData.budgetRange[0],
          max: formData.budgetRange[1],
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
                  {formData.budgetRange[0] > 0 && formData.budgetRange[1] > 0 && (
                    <p><strong>Budget:</strong> {formatBudgetAmount(formData.budgetRange[0])} - {formatBudgetAmount(formData.budgetRange[1])}</p>
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
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Post Your Requirement
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tell us what you need and we'll match you with the best options from our verified network.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-2 h-12"
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-base font-medium">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-2 h-12"
                      placeholder="Your phone number"
                    />
                    {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-2 h-12"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label className="text-base font-medium">Country *</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryOptions.map(country => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium">State *</Label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(value) => {
                        handleInputChange("state", value);
                        handleInputChange("city", ""); // Reset city when state changes
                      }}
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
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
                    {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <Label className="text-base font-medium">City *</Label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                        {cities.length === 0 && formData.state && (
                          <SelectItem value="Other">Other (Please specify in notes)</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                  </div>
                </div>

                {/* Intent Selection */}
                <div>
                  <Label className="text-base font-medium">I want to *</Label>
                  <Select value={formData.intent} onValueChange={(value) => {
                    handleInputChange("intent", value);
                    // Reset dependent fields
                    handleInputChange("propertyType", "");
                    handleInputChange("services", []);
                  }}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="What do you want to do?" />
                    </SelectTrigger>
                    <SelectContent>
                      {intentOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.intent && <p className="text-sm text-destructive mt-1">{errors.intent}</p>}
                </div>

                {/* Conditional Fields */}
                {["Buy", "Sell", "Lease"].includes(formData.intent) && (
                  <div className="transition-all duration-300 ease-in-out">
                    <Label className="text-base font-medium">Property Type *</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.propertyType && <p className="text-sm text-destructive mt-1">{errors.propertyType}</p>}
                  </div>
                )}

                {formData.intent === "Service" && (
                  <div className="transition-all duration-300 ease-in-out space-y-4">
                    <div>
                      <Label className="text-base font-medium">Services We Offer *</Label>
                      <p className="text-sm text-muted-foreground mb-3">Select at least one service</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {serviceOptions.map(service => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              id={service}
                              checked={formData.services.includes(service)}
                              onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                            />
                            <Label htmlFor={service} className="text-sm cursor-pointer">
                              {service}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.services && <p className="text-sm text-destructive mt-1">{errors.services}</p>}
                    </div>

                    {formData.services.includes("Others") && (
                      <div className="transition-all duration-300 ease-in-out">
                        <Label htmlFor="otherService" className="text-base font-medium">Please specify *</Label>
                        <Input
                          id="otherService"
                          value={formData.otherService}
                          onChange={(e) => handleInputChange("otherService", e.target.value)}
                          className="mt-2 h-12"
                          placeholder="Describe the service you need"
                        />
                        {errors.otherService && <p className="text-sm text-destructive mt-1">{errors.otherService}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* Budget Range */}
                <div>
                  <Label className="text-base font-medium">Budget Range</Label>
                  <div className="mt-4 space-y-4">
                    <div className="px-4">
                      <Slider
                        value={formData.budgetRange}
                        onValueChange={(value) => handleInputChange("budgetRange", value)}
                        max={50000000}
                        min={0}
                        step={100000}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{formatBudgetAmount(formData.budgetRange[0])}</span>
                      <span>{formatBudgetAmount(formData.budgetRange[1])}</span>
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                      Range: {formatBudgetAmount(formData.budgetRange[0])} - {formatBudgetAmount(formData.budgetRange[1])}
                    </div>
                  </div>
                  {errors.budget && <p className="text-sm text-destructive mt-1">{errors.budget}</p>}
                </div>

                {/* Premium Service */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-base font-medium">Premium Listing & Concierge Support — {getCurrencySymbol()}999 one-time</Label>
                    <Switch
                      checked={formData.premiumSelected}
                      onCheckedChange={(checked) => handleInputChange("premiumSelected", checked)}
                    />
                  </div>
                   {formData.premiumSelected && (
                     <div className="mt-4 space-y-4 transition-all duration-300 ease-in-out">
                       {/* Premium Service Features are now shown below the form */}
                     </div>
                   )}
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="notes" className="text-base font-medium">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="mt-2 min-h-[100px]"
                    placeholder="Anything else we should know?"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-lg"
                  disabled={submissionState.isSubmitting}
                >
                  {submissionState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {submissionState.uploadProgress}
                    </>
                  ) : (
                    "Post Requirement"
                  )}
                </Button>
               </form>
               
               {/* Premium Service Features moved below the form */}
               {formData.premiumSelected && (
                 <div className="mt-6 space-y-4 transition-all duration-300 ease-in-out">
                   <div className="bg-primary/5 p-4 rounded-lg">
                     <h4 className="font-semibold text-primary mb-3">Premium Service Features:</h4>
                     <div className="grid md:grid-cols-2 gap-6">
                       <ul className="space-y-2 text-sm">
                         <li className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-primary rounded-full"></div>
                           <span>Dedicated Relationship Manager (RM)</span>
                         </li>
                         <li className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-primary rounded-full"></div>
                           <span>Regular Updates via WhatsApp</span>
                         </li>
                         <li className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-primary rounded-full"></div>
                           <span>Regular Updates via Email and SMS</span>
                         </li>
                         <li className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-primary rounded-full"></div>
                           <span>IVR Support for Priority Assistance</span>
                         </li>
                       </ul>
                       <ul className="space-y-2 text-sm">
                         <li className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-primary rounded-full"></div>
                           <span>Weekly Lead Reports</span>
                         </li>
                         <li className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-primary rounded-full"></div>
                           <span>Free Consultation Credits</span>
                         </li>
                         <li className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-primary rounded-full"></div>
                           <span>Verified Tag for Priority Visibility</span>
                         </li>
                          <li className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-primary rounded-full"></div>
                           <span>Verified Leads & Top Rated Service Providers</span>
                         </li>
                       </ul>
                     </div>
                   </div>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PostService;