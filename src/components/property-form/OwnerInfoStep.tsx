import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ownerInfoSchema, OwnerInfoFormData } from '@/schemas/propertyValidation';
import { OwnerInfo } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface OwnerInfoStepProps {
  initialData: Partial<OwnerInfo>;
  onNext: (data: OwnerInfo) => void;
}

export const OwnerInfoStep: React.FC<OwnerInfoStepProps> = ({
  initialData,
  onNext
}) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors, touchedFields }
  } = useForm<OwnerInfoFormData>({
    resolver: zodResolver(ownerInfoSchema),
    defaultValues: {
      whatsappUpdates: false,
      propertyType: 'Residential',
      ...initialData,
    },
    mode: 'onTouched' // Only show errors after user interaction
  });

  
  const selectedPropertyType = watch('propertyType');
  const selectedListingType = watch('listingType');
  const whatsappUpdates = watch('whatsappUpdates');
  const formValues = watch();

  // Get available listing types based on property type
  const getListingTypes = () => {
    switch (selectedPropertyType) {
      case 'Commercial':
        return ['Rent', 'Sale'];
      case 'Land/Plot':
        return ['Resale'];
      default: // Residential
        return ['Rent', 'Resale', 'PG/Hostel', 'Flatmates'];
    }
  };

  // Reset listing type when property type changes
  useEffect(() => {
    const availableTypes = getListingTypes();
    if (selectedListingType && !availableTypes.includes(selectedListingType)) {
      setValue('listingType', undefined);
      trigger('listingType');
    }
  }, [selectedPropertyType, selectedListingType, setValue, trigger]);


  // Auto-fill detection and validation
  useEffect(() => {
    const detectAutoFill = () => {
      trigger(); // Trigger validation after potential auto-fill
    };

    const timer = setTimeout(detectAutoFill, 100);
    return () => clearTimeout(timer);
  }, [trigger]);

  // Custom validation check for button state
  const isFormValid = () => {
    const values = getValues();
    return !!(values.phoneNumber && 
             values.propertyType && values.listingType && agreedToTerms);
  };

  const handleBlur = () => {
    trigger(); // Validate on blur to catch auto-filled values
  };

  const onSubmit = (data: OwnerInfoFormData) => {
    onNext(data as OwnerInfo);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-8">
      {/* Top Left Corner Decoration */}
      <div className="absolute top-0 left-0 w-16 h-16 z-10">
        <div className="w-full h-full border-l-8 border-t-8 border-brand-red"></div>
      </div>
      
      {/* Bottom Right Corner Decoration */}
      <div className="absolute bottom-0 right-0 w-16 h-16 z-10">
        <div className="w-full h-full border-r-8 border-b-8 border-brand-red"></div>
      </div>

      <Card className="w-full border border-muted rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-primary text-2xl font-bold">
            {selectedListingType === 'Rent' || !selectedListingType ? 
              'Start Posting Your Property Today – 100% Free' : 
              'Start Posting Your Property For FREE'
            }
          </CardTitle>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
            

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Mobile Number *</Label>
              <div className="flex">
                <Select defaultValue="+91">
                  <SelectTrigger className="w-20 rounded-r-none border-r-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber')}
                  placeholder="Enter your mobile number"
                  className={`flex-1 rounded-l-none ${errors.phoneNumber && touchedFields.phoneNumber ? 'border-destructive' : ''}`}
                  onBlur={handleBlur}
                  onInput={handleBlur}
                  autoComplete="tel"
                />
              </div>
              {errors.phoneNumber && touchedFields.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* WhatsApp Updates Toggle */}
<div className="flex items-center gap-3">
  <Label className="text-base font-medium text-foreground">Get updates on WhatsApp</Label>
  {/* <span className="text-sm font-medium text-foreground">WhatsApp</span> */}
  <Switch
    defaultChecked // ✅ This makes it checked by default
    onCheckedChange={(checked) => setValue('whatsappUpdates', checked)}
  />
            </div>
          </div>

          {/* Property Type Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Property Type</h3>
            <Tabs 
              value={selectedPropertyType} 
              onValueChange={(value) => {
                setValue('propertyType', value as 'Residential' | 'Commercial' | 'Land/Plot');
                trigger('propertyType');
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Residential">Residential</TabsTrigger>
                <TabsTrigger value="Commercial">Commercial</TabsTrigger>
                <TabsTrigger value="Land/Plot" className="relative">
                  Land/Plot
                  <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {errors.propertyType && touchedFields.propertyType && (
              <p className="text-sm text-destructive">{errors.propertyType.message}</p>
            )}
          </div>

          {/* Property Listing Type Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {selectedPropertyType === 'Residential' ? 'I want to' : 'I want to'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getListingTypes().map((type) => {
                let buttonText = type;
                if (type === 'Rent') {
                  buttonText = 'Rent';
                } else if (type === 'PG/Hostel') {
                  buttonText = 'List PG/Hostel';
                } else if (type === 'Flatmates') {
                  buttonText = 'Flatmates';
                }
                
                return (
                  <Button
                    key={type}
                    type="button"
                    variant={selectedListingType === type ? "default" : "outline"}
                    className="h-12 text-xs md:text-sm"
                    onClick={() => {
                      setValue('listingType', type as any);
                      trigger('listingType');
                    }}
                  >
                    {buttonText}
                  </Button>
                );
              })}
            </div>
            {errors.listingType && touchedFields.listingType && (
              <p className="text-sm text-destructive">{errors.listingType.message}</p>
            )}
          </div>

          {/* Terms & Conditions Agreement */}
          <div className="pt-6 border-t">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms-agreement"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="terms-agreement" className="text-sm text-gray-700 cursor-pointer">
                  By clicking 'Start Posting Your Property For FREE', you acknowledge that you have read, understood, and agreed to the above{' '}
                  <Dialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
                    <DialogTrigger asChild>
                      <span className="text-brand-red underline hover:text-brand-red-dark cursor-pointer">
                        Terms & Conditions
                      </span>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold border-b pb-2">Terms and Conditions</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-6">
                        <div className="space-y-4">
                          <p className="text-sm leading-relaxed">
                            By posting a property for sale or rent on HomeHNI.com, you agree to the following Terms & Conditions. Please read carefully before proceeding. To continue posting your property, you must click 'Start Posting Your Property For FREE'.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Eligibility</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>You must be the legal owner of the property or hold valid authorization (Power of Attorney / Builder Authorization / Agent Agreement) to list it.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Property must comply with all local laws, building codes, and RERA regulations (where applicable).</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Fake, duplicate, or unauthorized listings are strictly prohibited.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Accuracy of Information</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>You must provide true, accurate, and complete details of the property, including price, location, ownership type, amenities, and photos/videos.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Misleading, exaggerated, or fraudulent information may lead to the removal of your listing and account suspension.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>All uploaded media (photos, videos, floor plans, documents) must be owned by you or used with proper permission.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Property Verification</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>HomeHNI.com reserves the right to verify listings before or after publishing.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Verification may include ownership proof, builder approvals, or rental agreements.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Unverified or suspicious listings may be rejected or taken down without notice.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Pricing & Offers</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>The listed price must be genuine and in accordance with market/legal norms.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>You are solely responsible for honoring the rental/sale terms you publish.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>HomeHNI.com does not guarantee deals, pricing accuracy, or buyer/tenant interest.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Lead & Communication Policy</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Leads generated from your property listing are for your use only and cannot be resold, transferred, or misused.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Communication with buyers/tenants must be professional and lawful.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Abuse, harassment, or spam will result in immediate termination.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Responsibilities of Sellers/Landlords</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Ensure that the property is free from legal disputes, encumbrances, or restrictions.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Provide clear agreements and receipts to buyers/tenants during transactions.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Maintain property in good condition for rental or sale viewings.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Prohibited Listings</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Illegal constructions or unauthorized developments.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Properties under litigation or government restrictions.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Duplicate postings of the same property to manipulate visibility.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Misuse of HomeHNI.com for promotions unrelated to property sales/rentals.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Fees & Payments</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Certain premium listings, lead packages, or promotional tools may require payment.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>All payments are non-refundable as per our Refund & Cancellation Policy.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>HomeHNI.com does not charge commission on sales or rentals unless explicitly stated.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Liability Disclaimer</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>HomeHNI.com acts as a facilitator and is not a party to your transaction with buyers/tenants.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>We do not verify financial capability or intent of buyers/tenants — due diligence is your responsibility.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>HomeHNI.com will not be liable for disputes, defaults, losses, or damages arising from your property listing.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Suspension & Termination</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Listings that violate these terms may be suspended or permanently removed.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Fraudulent activity will lead to blacklisting and possible legal action.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg text-brand-red">Governing Law</h3>
                          <ul className="space-y-2 text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>These Terms are governed by the laws of India.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-brand-red mt-1">•</span>
                              <span>Disputes shall be subject to the courts of Hyderabad.</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t text-center">
                          <p className="text-sm font-medium">
                            By clicking 'Start Posting Your Property For FREE', you acknowledge that you have read, understood, and agreed to the above Terms & Conditions.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  .
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              {selectedListingType === 'Rent' ? 
                'List Your Property For FREE' :
                'Start Posting Your Property For FREE'
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  );
};