import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { sendFreshlyPaintedEmail, sendDeepCleaningEmail } from '@/services/emailService';
import { OwnerInfo, PropertyInfo } from '@/types/property';
import { Clock, Calendar, Eye, CheckCircle, PaintBucket, Sparkles } from 'lucide-react';
const resaleScheduleSchema = z.object({
  paintingService: z.enum(['book', 'decline']).optional(),
  cleaningService: z.enum(['book', 'decline']).optional(),
  availability: z.enum(['everyday', 'weekday', 'weekend']).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  availableAllDay: z.boolean().optional()
});
type ResaleScheduleData = z.infer<typeof resaleScheduleSchema>;
interface ResaleScheduleStepProps {
  initialData?: Partial<ResaleScheduleData>;
  onNext: (data: ResaleScheduleData) => void;
  onBack: () => void;
  onSubmit?: (data: ResaleScheduleData) => void;
  formId?: string;
  ownerInfo?: Partial<OwnerInfo>;
  propertyInfo?: any;
}
export const ResaleScheduleStep: React.FC<ResaleScheduleStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  onSubmit,
  formId,
  ownerInfo,
  propertyInfo
}) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [paintingResponse, setPaintingResponse] = useState<'book' | 'decline' | null>(null);
  const [cleaningResponse, setCleaningResponse] = useState<'book' | 'decline' | null>(null);
  const form = useForm<ResaleScheduleData>({
    resolver: zodResolver(resaleScheduleSchema),
    defaultValues: {
      paintingService: initialData.paintingService || undefined,
      cleaningService: initialData.cleaningService || undefined,
      availability: initialData.availability || 'everyday',
      startTime: initialData.startTime || '09:00',
      endTime: initialData.endTime || '18:00',
      availableAllDay: initialData.availableAllDay || false
    }
  });
  
  // Resolve contact details from multiple sources
  const getResolvedContact = () => {
    const emailCandidates = [
      ownerInfo?.email,
      user?.email,
      propertyInfo?.ownerInfo?.email,
      propertyInfo?.contactDetails?.email,
    ] as (string | undefined)[];
    const fullNameCandidates = [
      ownerInfo?.fullName,
      (user as any)?.user_metadata?.full_name,
      (user as any)?.user_metadata?.name,
      propertyInfo?.ownerInfo?.fullName,
      propertyInfo?.ownerInfo?.name,
      propertyInfo?.contactDetails?.name,
    ] as (string | undefined)[];
    const email = emailCandidates.find(Boolean);
    const fullName = fullNameCandidates.find(Boolean);
    return { email, fullName } as { email?: string; fullName?: string };
  };

  const handlePaintingBookNow = async () => {
    const { email, fullName } = getResolvedContact();
    if (!email || !fullName) {
      toast({
        title: "Error",
        description: "Unable to send request. Please ensure your email and name are properly entered.",
        variant: "destructive"
      });
      console.warn('[ResaleScheduleStep] Missing contact details for Painting', { email, fullName, ownerInfo, user });
      return;
    }

    try {
      // Handle different property data structures from different forms
      const locality = propertyInfo?.locationDetails?.locality || '';
      const expectedPrice = propertyInfo?.saleDetails?.expectedPrice || 
                           propertyInfo?.rentalDetails?.expectedPrice || 
                           propertyInfo?.rentalDetails?.expectedRent || 
                           '';

      await sendFreshlyPaintedEmail(
        email,
        fullName,
        ownerInfo?.propertyType || propertyInfo?.propertyDetails?.propertyType || propertyInfo?.basicDetails?.propertyType || '',
        locality,
        expectedPrice.toString()
      );

      toast({
        title: "Your painting service request has been submitted successfully.",
        description: "Our painting specialists will contact you within 6 hours.",
        variant: "success"
      });

      form.setValue('paintingService', 'book');
      setPaintingResponse('book');
    } catch (error) {
      console.error('Failed to send painting service email:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCleaningBookNow = async () => {
    const { email, fullName } = getResolvedContact();
    if (!email || !fullName) {
      toast({
        title: "Error",
        description: "Unable to send request. Please ensure your email and name are properly entered.",
        variant: "destructive"
      });
      console.warn('[ResaleScheduleStep] Missing contact details for Cleaning', { email, fullName, ownerInfo, user });
      return;
    }

    try {
      // Handle different property data structures from different forms
      const locality = propertyInfo?.locationDetails?.locality || '';
      const expectedPrice = propertyInfo?.saleDetails?.expectedPrice || 
                           propertyInfo?.rentalDetails?.expectedPrice || 
                           propertyInfo?.rentalDetails?.expectedRent || 
                           '';

      await sendDeepCleaningEmail(
        email,
        fullName,
        ownerInfo?.propertyType || propertyInfo?.propertyDetails?.propertyType || propertyInfo?.basicDetails?.propertyType || '',
        locality,
        expectedPrice.toString()
      );

      toast({
        title: "Your deep cleaning service request has been submitted successfully.",
        description: "Our cleaning specialists will contact you within 6 hours.",
        variant: "success"
      });

      form.setValue('cleaningService', 'book');
      setCleaningResponse('book');
    } catch (error) {
      console.error('Failed to send cleaning service email:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFormSubmit = (data: ResaleScheduleData) => {
    console.log('[ResaleScheduleStep] Submit clicked with data:', data);
    if (onSubmit) {
      onSubmit(data);
    } else {
      onNext(data);
    }
  };
  const watchAvailableAllDay = form.watch('availableAllDay');
  return <div className="max-w-4xl">
      <div className="bg-background rounded-lg border p-8">
        <div className="text-left mb-8">
          <h2 className="text-2xl mb-6 font-semibold text-[#22c55e]">
            Set your availability for property visits
          </h2>
        </div>

        <Form {...form}>
          <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Availability Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">When are you available for property visits?</h3>
                <FormField control={form.control} name="availability" render={({
                field
              }) => <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button type="button" variant={field.value === 'everyday' ? 'default' : 'outline'} className="h-16 flex flex-col" onClick={() => field.onChange('everyday')}>
                        <span className="font-semibold">Everyday</span>
                        <span className="text-xs text-muted-foreground">Mon-Sun</span>
                      </Button>
                      <Button type="button" variant={field.value === 'weekday' ? 'default' : 'outline'} className="h-16 flex flex-col" onClick={() => field.onChange('weekday')}>
                        <span className="font-semibold">Weekdays Only</span>
                        <span className="text-xs text-muted-foreground">Mon-Fri</span>
                      </Button>
                      <Button type="button" variant={field.value === 'weekend' ? 'default' : 'outline'} className="h-16 flex flex-col" onClick={() => field.onChange('weekend')}>
                        <span className="font-semibold">Weekends Only</span>
                        <span className="text-xs text-muted-foreground">Sat-Sun</span>
                      </Button>
                    </div>} />
              </div>

              {/* Time Schedule */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Preferred time for visits</h3>
                
                <FormField control={form.control} name="availableAllDay" render={({
                field
              }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={checked => {
                    field.onChange(checked);
                    if (checked) {
                      form.setValue('startTime', '10:00');
                      form.setValue('endTime', '19:00');
                    }
                  }} />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer">
                        Available All Day (10 AM to 7 PM)
                      </FormLabel>
                    </FormItem>} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="startTime" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-sm font-medium">Start Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input type="time" className="pl-10 h-11" disabled={watchAvailableAllDay} value={watchAvailableAllDay ? '10:00' : field.value} onChange={!watchAvailableAllDay ? field.onChange : undefined} />
                          </div>
                        </FormControl>
                      </FormItem>} />
                  <FormField control={form.control} name="endTime" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-sm font-medium">End Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input type="time" className="pl-10 h-11" disabled={watchAvailableAllDay} value={watchAvailableAllDay ? '19:00' : field.value} onChange={!watchAvailableAllDay ? field.onChange : undefined} />
                          </div>
                        </FormControl>
                      </FormItem>} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8" style={{
            visibility: 'hidden'
          }}>
              <Button type="button" variant="outline" onClick={onBack} className="bg-muted text-muted-foreground">
                Back
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                {onSubmit ? 'Submit' : 'Save & Continue'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>;
};