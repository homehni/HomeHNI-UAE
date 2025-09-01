import { useEffect, useState, useCallback, useMemo } from "react";
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
import { SearchResultsPanel } from "@/components/SearchResultsPanel";
import { usePropertySearch, PropertySearchQuery } from "@/hooks/usePropertySearch";

interface FormData {
  name: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  intent: string;
  propertyType: string;
  serviceCategory: string;
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
    serviceCategory: "",
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
  
  const {
    results,
    isLoading: searchLoading,
    error: searchError,
    debouncedSearchProperties,
    debouncedSearchServices,
    loadMore,
    clearResults
  } = usePropertySearch();

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

  // Property types based on intent (same for Buy/Sell/Lease)
  const propertyTypes = [
    // Residential
    "Apartment/Flat",
    "Independent House/Villa",
    "Plot/Land",
    "Farmhouse",
    "Studio",
    // Commercial
    "Office",
    "Retail/Shop",
    "Showroom",
    "Industrial/Warehouse",
    "Co-working",
    // Others
    "Agricultural Land",
    "Hospitality/Hotel"
  ];

  const serviceCategories = [
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
    "RCC Contractor",
    "Interior",
    "Movers",
    "Legal",
    "Finance",
    "Vastu",
    "Home Inspection",
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
    
    if (formData.intent === "Service" && !formData.serviceCategory) {
      newErrors.serviceCategory = "Please select a service category";
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

    // Clear property type when switching between intents
    if (field === 'intent') {
      if (value === 'Service') {
        setFormData(prev => ({ ...prev, propertyType: "" }));
      } else {
        setFormData(prev => ({ ...prev, serviceCategory: "" }));
      }
    }
  };

  // Debounced search effect
  const searchQuery = useMemo<PropertySearchQuery>(() => ({
    intent: formData.intent.toLowerCase() as 'buy' | 'sell' | 'lease' | 'rent' | 'new-launch' | 'pg' | 'commercial' | 'plots' | 'projects' | '',
    propertyType: formData.propertyType,
    country: formData.country,
    state: formData.state,
    city: formData.city,
    budgetMin: formData.budgetRange[0],
    budgetMax: formData.budgetRange[1]
  }), [formData.intent, formData.propertyType, formData.country, formData.state, formData.city, formData.budgetRange]);

  useEffect(() => {
    if (formData.intent === 'Service') {
      if (formData.serviceCategory && formData.country && formData.state) {
        debouncedSearchServices(formData.serviceCategory, {
          country: formData.country,
          state: formData.state,
          city: formData.city
        });
      } else {
        clearResults();
      }
    } else if (['Buy', 'Sell', 'Lease'].includes(formData.intent)) {
      // Map form intent to search bar type for proper filtering
      let mappedIntent = formData.intent.toLowerCase();
      if (formData.intent === 'Buy') {
        // Map property type to search bar categories
        if (formData.propertyType === 'Plot/Land') {
          mappedIntent = 'plots';
        } else if (['Office', 'Retail/Shop', 'Showroom', 'Industrial/Warehouse', 'Co-working'].includes(formData.propertyType)) {
          mappedIntent = 'commercial';
        } else {
          mappedIntent = 'buy';
        }
      } else if (formData.intent === 'Sell') {
        mappedIntent = 'sell';
      } else if (formData.intent === 'Lease') {
        mappedIntent = 'rent';
      }
      
      const enhancedQuery = {
        ...searchQuery,
        intent: mappedIntent as 'buy' | 'sell' | 'lease' | 'rent' | 'new-launch' | 'pg' | 'commercial' | 'plots' | 'projects' | ''
      };
      
      if (enhancedQuery.intent && enhancedQuery.country && enhancedQuery.state) {
        debouncedSearchProperties(enhancedQuery);
      } else {
        clearResults();
      }
    }
  }, [formData.intent, formData.serviceCategory, formData.propertyType, searchQuery, debouncedSearchProperties, debouncedSearchServices, clearResults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showErrorToast("Validation Error", "Please correct the errors and try again");
      return;
    }

    setSubmitting(true);
    
    try {
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
        ...(formData.intent === "Service" && { serviceCategory: formData.serviceCategory }),
        budget: {
          min: formData.budgetRange[0],
          max: formData.budgetRange[1],
          currency: formData.currency
        },
        premiumSelected: formData.premiumSelected,
        notes: formData.notes
      };

      // Mock API call - replace with real endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate reference ID
      const refId = `REQ${Date.now().toString().slice(-6)}`;
      setReferenceId(refId);
      setShowSuccess(true);
      
      showSuccessToast("Success", "Your requirement has been posted successfully!");

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

  const isPropertySearch = ['Buy', 'Sell', 'Lease'].includes(formData.intent);
  const searchType = formData.intent === 'Service' ? 'service' : 'property';

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Post Your Requirement
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tell us what you need and we'll match you with the best options from our verified network.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
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

                    {/* Location Details */}
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
                          </SelectContent>
                        </Select>
                        {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                      </div>
                    </div>

                    {/* Intent Selection */}
                    <div>
                      <Label className="text-base font-medium">I want to *</Label>
                      <Select value={formData.intent} onValueChange={(value) => handleInputChange("intent", value)}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select what you want to do" />
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

                    {/* Conditional Property Type / Service Category */}
                    {isPropertySearch && (
                      <div>
                        <Label className="text-base font-medium">Property Type *</Label>
                        <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                          <SelectTrigger className="mt-2 h-12">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.propertyType && <p className="text-sm text-destructive mt-1">{errors.propertyType}</p>}
                      </div>
                    )}

                    {formData.intent === 'Service' && (
                      <div>
                        <Label className="text-base font-medium">Service Category *</Label>
                        <Select value={formData.serviceCategory} onValueChange={(value) => handleInputChange("serviceCategory", value)}>
                          <SelectTrigger className="mt-2 h-12">
                            <SelectValue placeholder="Select service category" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceCategories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.serviceCategory && <p className="text-sm text-destructive mt-1">{errors.serviceCategory}</p>}
                      </div>
                    )}

                    {/* Budget Range */}
                    <div>
                      <Label className="text-base font-medium">Budget Range</Label>
                      <div className="mt-4">
                        <Slider
                          value={formData.budgetRange}
                          onValueChange={(value) => handleInputChange("budgetRange", value)}
                          max={50000000}
                          min={0}
                          step={100000}
                          className="mb-4"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatBudgetAmount(formData.budgetRange[0])}</span>
                          <span>{formatBudgetAmount(formData.budgetRange[1])}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Range: {formatBudgetAmount(formData.budgetRange[0])} – {formatBudgetAmount(formData.budgetRange[1])}
                        </p>
                      </div>
                      {errors.budget && <p className="text-sm text-destructive mt-1">{errors.budget}</p>}
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <Label htmlFor="notes" className="text-base font-medium">Additional Requirements</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="mt-2"
                        placeholder="Any specific requirements or additional details..."
                        rows={3}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      disabled={submissionState.isSubmitting}
                      className="w-full h-12 text-base font-medium"
                    >
                      {submissionState.isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Post Requirement"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Search Results Panel */}
            <div className="lg:sticky lg:top-4 h-fit">
              <SearchResultsPanel
                results={results}
                isLoading={searchLoading}
                error={searchError}
                searchType={searchType}
                onLoadMore={loadMore}
                onClearFilters={clearResults}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostService;
