import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PaintBucket, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { sendFreshlyPaintedEmail, sendDeepCleaningEmail } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const scheduleSchema = z.object({
  paintingService: z.enum(['book', 'decline']).optional(),
  cleaningService: z.enum(['book', 'decline']).optional(),
  availability: z.enum(['everyday', 'weekday', 'weekend']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  availableAllDay: z.boolean().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface PgHostelScheduleStepProps {
  initialData?: Partial<ScheduleFormData>;
  onNext: (data: ScheduleFormData) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  onSubmit?: (data: ScheduleFormData) => void;
  ownerInfo?: any;
  propertyInfo?: any;
}

export function PgHostelScheduleStep({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps,
  onSubmit,
  ownerInfo,
  propertyInfo
}: PgHostelScheduleStepProps) {
  const navigate = useNavigate();
  const [paintingResponse, setPaintingResponse] = useState<'book' | 'decline' | null>(null);
  const [cleaningResponse, setCleaningResponse] = useState<'book' | 'decline' | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      paintingService: initialData.paintingService,
      cleaningService: initialData.cleaningService,
      availability: initialData.availability || 'everyday',
      startTime: initialData.startTime || '09:00',
      endTime: initialData.endTime || '18:00',
      availableAllDay: initialData.availableAllDay || false,
    },
  });

  const onFormSubmit = (data: ScheduleFormData) => {
    console.log('PgHostelScheduleStep - onFormSubmit called with data:', data);
    console.log('PgHostelScheduleStep - onSubmit available:', !!onSubmit);
    console.log('PgHostelScheduleStep - onNext available:', !!onNext);
    
    if (onSubmit) {
      console.log('PgHostelScheduleStep - Calling onSubmit');
      onSubmit(data);
    } else {
      console.log('PgHostelScheduleStep - Calling onNext');
      onNext(data);
    }
  };

  // Add form validation debug logging
  const handleFormSubmit = (data: ScheduleFormData) => {
    console.log('PgHostelScheduleStep - Form validation passed, data:', data);
    onFormSubmit(data);
  };

  const handleFormError = (errors: any) => {
    console.error('PgHostelScheduleStep - Form validation failed:', errors);
    console.error('PgHostelScheduleStep - Form values:', form.getValues());
  };

  // Custom form submission handler that cleans the data
  const handleFormSubmitWithCleanup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = form.getValues();
    console.log('PgHostelScheduleStep - Raw form data:', formData);
    
    // Clean the data by converting empty strings to undefined
    const cleanedData = {
      ...formData,
      paintingService: !formData.paintingService ? undefined : formData.paintingService,
      cleaningService: !formData.cleaningService ? undefined : formData.cleaningService,
    };
    
    console.log('PgHostelScheduleStep - Cleaned form data:', cleanedData);
    
    // Validate the cleaned data
    const validationResult = scheduleSchema.safeParse(cleanedData);
    
    if (validationResult.success) {
      console.log('PgHostelScheduleStep - Validation successful, submitting data');
      onFormSubmit(validationResult.data);
    } else {
      console.error('PgHostelScheduleStep - Validation failed:', validationResult.error);
      handleFormError(validationResult.error);
    }
  };

  // Debug logging for form state
  React.useEffect(() => {
    console.log('PgHostelScheduleStep - Form values changed:', form.getValues());
    console.log('PgHostelScheduleStep - Form errors:', form.formState.errors);
  }, [form.watch()]);

  const getResolvedContact = () => {
    const email = ownerInfo?.email || user?.email;
    const fullNameCandidates = [ownerInfo?.fullName, user?.user_metadata?.full_name, user?.user_metadata?.name];
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
      console.warn('[PgHostelScheduleStep] Missing contact details for Painting', { email, fullName, ownerInfo, user });
      return;
    }

    try {
      const locality = propertyInfo?.locationDetails?.locality || '';
      const expectedPrice = propertyInfo?.rentalDetails?.expectedPrice || 
                           propertyInfo?.propertyDetails?.expectedRent || 
                           '';

      await sendFreshlyPaintedEmail(
        email,
        fullName,
        'PG/Hostel',
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
      console.warn('[PgHostelScheduleStep] Missing contact details for Cleaning', { email, fullName, ownerInfo, user });
      return;
    }

    try {
      const locality = propertyInfo?.locationDetails?.locality || '';
      const expectedPrice = propertyInfo?.rentalDetails?.expectedPrice || 
                           propertyInfo?.propertyDetails?.expectedRent || 
                           '';

      await sendDeepCleaningEmail(
        email,
        fullName,
        'PG/Hostel',
        locality,
        expectedPrice.toString()
      );

      toast({
        title: "Your cleaning service request has been submitted successfully.",
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

  const watchAvailableAllDay = form.watch('availableAllDay');

  return (
    <div className="min-h-screen bg-background pb-32 sm:pb-24">
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-primary mb-2">
              Make PG visits hassle-free by providing us your availability
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={handleFormSubmitWithCleanup} className="space-y-8">
            {/* Availability Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Availability</h3>
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          type="button"
                          variant={field.value === 'everyday' ? 'default' : 'outline'}
                          className="h-16 flex flex-col"
                          onClick={() => field.onChange('everyday')}
                        >
                          <span className="font-semibold">Everyday</span>
                          <span className="text-xs text-muted-foreground">Mon-Sun</span>
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === 'weekday' ? 'default' : 'outline'}
                          className="h-16 flex flex-col"
                          onClick={() => field.onChange('weekday')}
                        >
                          <span className="font-semibold">Weekday</span>
                          <span className="text-xs text-muted-foreground">Mon-Fri</span>
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === 'weekend' ? 'default' : 'outline'}
                          className="h-16 flex flex-col"
                          onClick={() => field.onChange('weekend')}
                        >
                          <span className="font-semibold">Weekend</span>
                          <span className="text-xs text-muted-foreground">Sat-Sun</span>
                        </Button>
                      </div>
                    )}
                  />
                </div>

                {/* Time Schedule */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Select Time Schedule</h3>
                  
                  <FormField
                    control={form.control}
                    name="availableAllDay"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (checked) {
                                form.setValue('startTime', '10:00');
                                form.setValue('endTime', '19:00');
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium cursor-pointer">
                          Available All Day
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Start Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                type="time"
                                className="pl-10 h-11"
                                disabled={watchAvailableAllDay}
                                value={watchAvailableAllDay ? '10:00' : field.value}
                                onChange={!watchAvailableAllDay ? field.onChange : undefined}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">End Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                type="time"
                                className="pl-10 h-11"
                                disabled={watchAvailableAllDay}
                                value={watchAvailableAllDay ? '19:00' : field.value}
                                onChange={!watchAvailableAllDay ? field.onChange : undefined}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons - Removed, using only sticky buttons */}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
