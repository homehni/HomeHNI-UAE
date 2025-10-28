import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useSettings } from '@/contexts/SettingsContext';
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
import { 
  sendRequirementSubmissionAdminAlert, 
  sendRequirementSubmissionConfirmation 
} from "@/services/emailService";

interface FormData {
  name: string;
  phone: string;
  email: string;
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
  const { user } = useAuth();
  const { profile } = useProfile();
  const { settings } = useSettings();
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    intent: "",
    propertyType: "",
    serviceCategory: "",
    services: [],
    otherService: "",
    budgetRange: [0, 50000000],
    currency: "INR",
    premiumSelected: true,
    paymentMethod: "",
    notes: ""
  });

  const { submissionState, setSubmitting, showSuccessToast, showErrorToast, updateProgress } = useFormSubmission();
  const { toast } = useToast();

  // Auto-fill form data when user is logged in
  useEffect(() => {
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.full_name || prev.name,
        email: user.email || prev.email,
        phone: profile.phone || prev.phone
      }));
    }
  }, [user, profile]);

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

  const getCurrencySymbol = () => {
    return "₹"; // Default to Indian Rupee
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showErrorToast("Validation Error", "Please correct the errors and try again");
      return;
    }

    setSubmitting(true);
    
    try {
      // Process requirement without storing in DB
      updateProgress("Processing your requirement...");
      
      // Generate reference ID
      const refId = `REQ${Date.now().toString().slice(-6)}`;
      setReferenceId(refId);
      
      const submissionPayload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        intent: formData.intent,
        ...(["Buy", "Sell", "Lease"].includes(formData.intent) && { propertyType: formData.propertyType }),
        ...(formData.intent === "Service" && { serviceType: formData.serviceCategory }),
        budget: {
          min: formData.budgetRange[0],
          max: formData.budgetRange[1],
          currency: formData.currency
        },
        premiumSelected: formData.premiumSelected,
        notes: formData.notes,
        referenceId: refId,
        submittedAt: new Date().toISOString()
      };

      // Send confirmation email to user
      updateProgress("Sending confirmation email...");
      await sendRequirementSubmissionConfirmation(
        formData.email,
        formData.name,
        {
          intent: formData.intent,
          propertyType: formData.propertyType,
          serviceCategory: formData.serviceCategory,
          budgetMin: formData.budgetRange[0],
          budgetMax: formData.budgetRange[1],
          currency: formData.currency,
          referenceId: refId
        }
      );
      
      // Send admin notification email
      const adminEmail = settings.admin_email || 'admin@homehni.com';
      await sendRequirementSubmissionAdminAlert(
        adminEmail,
        {
          userName: formData.name,
          userEmail: formData.email,
          userPhone: formData.phone,
          intent: formData.intent,
          propertyType: formData.propertyType,
          serviceCategory: formData.serviceCategory,
          budgetMin: formData.budgetRange[0],
          budgetMax: formData.budgetRange[1],
          currency: formData.currency,
          notes: formData.notes,
          referenceId: refId
        }
      );
      
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

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-6 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Post Your Requirement
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
            Tell us what you need and we'll match you with the best options from our verified network.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Personal Details */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="mt-1 h-10"
                          placeholder="Your full name"
                        />
                        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="mt-1 h-10"
                          placeholder="Your phone number"
                        />
                        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="mt-1 h-10"
                          placeholder="your.email@example.com"
                        />
                        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Intent Selection */}
                    <div>
                      <Label className="text-sm font-medium">I want to</Label>
                      <Select value={formData.intent} onValueChange={(value) => handleInputChange("intent", value)}>
                        <SelectTrigger className="mt-1 h-10">
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
                    {['Buy', 'Sell', 'Lease'].includes(formData.intent) && (
                      <div>
                        <Label className="text-sm font-medium">Property Type</Label>
                        <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                          <SelectTrigger className="mt-1 h-10">
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
                        <Label className="text-sm font-medium">Service Category</Label>
                        <Select value={formData.serviceCategory} onValueChange={(value) => handleInputChange("serviceCategory", value)}>
                          <SelectTrigger className="mt-1 h-10">
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
                      <Label className="text-sm font-medium">Budget Range</Label>
                      <div className="mt-1">
                        <Slider
                          value={formData.budgetRange}
                          onValueChange={(value) => handleInputChange("budgetRange", value)}
                          max={50000000}
                          min={0}
                          step={100000}
                          className="mb-1"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatBudgetAmount(formData.budgetRange[0])}</span>
                          <span>{formatBudgetAmount(formData.budgetRange[1])}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Range: {formatBudgetAmount(formData.budgetRange[0])} – {formatBudgetAmount(formData.budgetRange[1])}
                        </p>
                      </div>
                      {errors.budget && <p className="text-sm text-destructive mt-1">{errors.budget}</p>}
                    </div>

                    {/* Premium Service Toggle */}
                    {/* <div className="p-2 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-foreground">Premium Service</Label>
                          <p className="text-xs text-muted-foreground">
                            Priority response within 2 hours & dedicated manager
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-primary">₹999</span>
                          <Switch
                            id="premium-toggle"
                            checked={formData.premiumSelected}
                            onCheckedChange={(checked) => handleInputChange("premiumSelected", checked)}
                          />
                        </div>
                      </div>
                    </div> */}

                    {/* Additional Notes */}
                    <div>
                      <Label htmlFor="notes" className="text-sm font-medium">Additional Requirements</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="mt-1"
                        placeholder="Any specific requirements or additional details..."
                        rows={1}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      disabled={submissionState.isSubmitting}
                      className="w-full h-9 text-sm font-medium"
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
          </section>
        </div>
      );
};

export default PostService;
