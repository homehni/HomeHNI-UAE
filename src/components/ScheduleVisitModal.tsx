import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Calendar as CalendarIcon, Phone, Eye, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { format, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  propertyType?: string;
  propertyArea?: string;
  bhkType?: string;
  city?: string;
  expectedPrice?: number;
}

interface ScheduleVisitFormData {
  name: string;
  email: string;
  phone: string;
  isPropertyDealer: 'yes' | 'no';
  interestedInHomeLoan: boolean;
  interestedInSiteVisit: boolean;
  immediateVisit: boolean;
  agreeToTerms: boolean;
  visitDate: Date | undefined;
  visitTime: string;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  propertyType,
  propertyArea,
  bhkType,
  city,
  expectedPrice
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookedDateTime, setBookedDateTime] = useState<string>('');
  const [formData, setFormData] = useState<ScheduleVisitFormData>({
    name: '',
    email: '',
    phone: '',
    isPropertyDealer: 'no',
    interestedInHomeLoan: false,
    interestedInSiteVisit: true,
    immediateVisit: false,
    agreeToTerms: false,
    visitDate: undefined,
    visitTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Please agree to terms",
        description: "You must agree to the terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.visitDate || !formData.visitTime) {
      toast({
        title: "Date and time required",
        description: "Please select your preferred visit date and time.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Future: Send schedule visit request to backend
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Format the booked date and time
      const formattedDateTime = formData.visitDate ? 
        `${format(formData.visitDate, "EEE, do MMMM")} at ${formData.visitTime}` : '';
      setBookedDateTime(formattedDateTime);
      setShowSuccess(true);
      
    } catch (error) {
      toast({
        title: "Error scheduling visit",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (showSuccess) {
      // Reset everything when closing success screen
      setShowSuccess(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        isPropertyDealer: 'no',
        interestedInHomeLoan: false,
        interestedInSiteVisit: true,
        immediateVisit: false,
        agreeToTerms: false,
        visitDate: undefined,
        visitTime: ''
      });
    }
    onClose();
  };

  // Success Screen Component
  const SuccessScreen = () => (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Visit Booked Successfully</h2>
        <p className="text-green-600 font-medium">{bookedDateTime}</p>
        <p className="text-sm text-gray-600">
          You will get all details regarding this visit on your registered number directly.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => window.open(`tel:${formData.phone}`, '_self')}
        >
          <Phone className="w-4 h-4" />
          Call
        </Button>
        <Button
          className="flex items-center gap-2"
          onClick={handleClose}
        >
          <Eye className="w-4 h-4" />
          View All Visits
        </Button>
      </div>
    </div>
  );

  const handleChange = (field: keyof ScheduleVisitFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {showSuccess ? (
          <SuccessScreen />
        ) : (
          <>
            <DialogHeader className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-6 w-6 p-0"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-xl font-semibold">
                You are requesting to view advertiser details.
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Property Info */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-sm">
                  <span className="font-semibold">PROPERTY DETAILS:</span>
                  <div className="font-semibold mt-2">{propertyTitle}</div>
                  <div className="text-muted-foreground">
                    {propertyArea} {bhkType && `| ${bhkType}`} {propertyType?.replace('_', ' ').toUpperCase()}
                  </div>
                  {city && <div className="text-muted-foreground">Location: {city}</div>}
                  {expectedPrice && (
                    <div className="text-muted-foreground">
                      Price: ₹{expectedPrice.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm font-medium">
                Please fill in your details to be shared with this advertiser only.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">BASIC INFORMATION</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Are you a property dealer
                        </Label>
                        <RadioGroup
                          value={formData.isPropertyDealer}
                          onValueChange={(value) => handleChange('isPropertyDealer', value)}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="dealer_yes" />
                            <Label htmlFor="dealer_yes" className="text-sm">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="dealer_no" />
                            <Label htmlFor="dealer_no" className="text-sm">No</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="mt-1"
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                        <div className="flex mt-1">
                          <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm">
                            +91 IND
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="rounded-l-none"
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">This number would be verified</p>
                      </div>

                      {/* Date and Time Selection */}
                      <div>
                        <Label className="text-sm font-medium">Visit Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1",
                                !formData.visitDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.visitDate ? format(formData.visitDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={formData.visitDate}
                              onSelect={(date) => handleChange('visitDate', date)}
                              disabled={(date) => date < startOfToday()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="time" className="text-sm font-medium">Preferred Time</Label>
                        <select
                          id="time"
                          value={formData.visitTime}
                          onChange={(e) => handleChange('visitTime', e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                          required
                        >
                          <option value="">Select time</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                          <option value="07:00 PM">07:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Optional Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">OPTIONAL INFORMATION</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="immediate_visit"
                          checked={formData.immediateVisit}
                          onCheckedChange={(checked) => handleChange('immediateVisit', checked)}
                        />
                        <Label htmlFor="immediate_visit" className="text-sm">
                          I need immediate visit
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="home_loan"
                          checked={formData.interestedInHomeLoan}
                          onCheckedChange={(checked) => handleChange('interestedInHomeLoan', checked)}
                        />
                        <Label htmlFor="home_loan" className="text-sm">
                          I am interested in home loan
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="site_visit"
                          checked={formData.interestedInSiteVisit}
                          onCheckedChange={(checked) => handleChange('interestedInSiteVisit', checked)}
                        />
                        <Label htmlFor="site_visit" className="text-sm">
                          I am interested in site visits.
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => handleChange('agreeToTerms', checked)}
                        />
                        <Label htmlFor="terms" className="text-sm leading-tight">
                          I agree to the{' '}
                          <Link 
                            to="/terms-and-conditions" 
                            className="text-blue-600 hover:underline cursor-pointer"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Terms & Conditions
                          </Link>{' '}
                          and{' '}
                          <Link 
                            to="/privacy-policy" 
                            className="text-blue-600 hover:underline cursor-pointer"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting || 
                      !formData.agreeToTerms || 
                      !formData.name.trim() || 
                      !formData.phone.trim() || 
                      !formData.email.trim() || 
                      !formData.visitDate || 
                      !formData.visitTime
                    }
                    className="px-8"
                  >
                    {isSubmitting ? 'Processing...' : 'View Advertiser Details'}
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};