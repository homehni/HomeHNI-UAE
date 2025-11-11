import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Eye, Calendar, PaintBucket, Sparkles, CheckCircle } from 'lucide-react';
import { ScheduleInfo } from '@/types/property';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { sendFreshlyPaintedEmail, sendDeepCleaningEmail } from '@/services/emailService';
import { OwnerInfo } from '@/types/property';
const commercialSaleScheduleSchema = z.object({
  paintingService: z.enum(['book', 'decline']).optional(),
  cleaningService: z.enum(['book', 'decline']).optional(),
  availability: z.enum(['everyday', 'weekday', 'weekend']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  availableAllDay: z.boolean().optional()
});
type CommercialSaleScheduleForm = z.infer<typeof commercialSaleScheduleSchema>;
interface CommercialSaleScheduleStepProps {
  initialData?: Partial<ScheduleInfo>;
  onNext: (data: Partial<ScheduleInfo>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  onSubmit?: (data: Partial<ScheduleInfo>) => void;
  ownerInfo?: Partial<OwnerInfo>;
  propertyInfo?: any;
}
export const CommercialSaleScheduleStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps,
  onSubmit,
  ownerInfo,
  propertyInfo
}: CommercialSaleScheduleStepProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [paintingResponse, setPaintingResponse] = useState<'book' | 'decline' | null>(null);
  const [cleaningResponse, setCleaningResponse] = useState<'book' | 'decline' | null>(null);
  const form = useForm<CommercialSaleScheduleForm>({
    resolver: zodResolver(commercialSaleScheduleSchema),
    defaultValues: {
      paintingService: initialData?.paintingService || undefined,
      cleaningService: initialData?.cleaningService || undefined,
      availability: initialData?.availability || 'everyday',
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '18:00',
      availableAllDay: initialData?.availableAllDay ?? true
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
      console.warn('[CommercialSaleScheduleStep] Missing contact details for Painting', { email, fullName, ownerInfo, user });
      return;
    }

    try {
      const locality = propertyInfo?.locationDetails?.locality || '';
      const expectedPrice = propertyInfo?.saleDetails?.expectedPrice || '';

      await sendFreshlyPaintedEmail(
        email,
        fullName,
        ownerInfo?.propertyType || propertyInfo?.propertyDetails?.propertyType || 'commercial',
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
      console.warn('[CommercialSaleScheduleStep] Missing contact details for Cleaning', { email, fullName, ownerInfo, user });
      return;
    }

    try {
      const locality = propertyInfo?.locationDetails?.locality || '';
      const expectedPrice = propertyInfo?.saleDetails?.expectedPrice || '';

      await sendDeepCleaningEmail(
        email,
        fullName,
        ownerInfo?.propertyType || propertyInfo?.propertyDetails?.propertyType || 'commercial',
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

  const handleFormSubmit = (data: CommercialSaleScheduleForm) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      onNext(data);
    }
  };
  const watchAvailableAllDay = form.watch('availableAllDay');
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-8 text-left">
        <h2 className="text-2xl text-[#ef4444] mb-2 font-semibold pt-6 sm:pt-6">
          Schedule Property Visits
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Availability Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              When are you available for property visits?
            </h3>
            <FormField control={form.control} name="availability" render={({
            field
          }) => <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button type="button" onClick={() => field.onChange('everyday')} variant={field.value === 'everyday' ? 'default' : 'outline'} className={`h-16 text-center ${field.value === 'everyday' ? 'bg-[#ef4444] hover:bg-[#dc2626] text-white' : 'border-gray-300 text-gray-700'}`}>
                    <div>
                      <div className="font-semibold">Everyday</div>
                      <div className="text-sm opacity-80">(Mon-Sun)</div>
                    </div>
                  </Button>
                  <Button type="button" onClick={() => field.onChange('weekday')} variant={field.value === 'weekday' ? 'default' : 'outline'} className={`h-16 text-center ${field.value === 'weekday' ? 'bg-[#ef4444] hover:bg-[#dc2626] text-white' : 'border-gray-300 text-gray-700'}`}>
                    <div>
                      <div className="font-semibold">Weekdays Only</div>
                      <div className="text-sm opacity-80">(Mon-Fri)</div>
                    </div>
                  </Button>
                  <Button type="button" onClick={() => field.onChange('weekend')} variant={field.value === 'weekend' ? 'default' : 'outline'} className={`h-16 text-center ${field.value === 'weekend' ? 'bg-[#ef4444] hover:bg-[#dc2626] text-white' : 'border-gray-300 text-gray-700'}`}>
                    <div>
                      <div className="font-semibold">Weekends Only</div>
                      <div className="text-sm opacity-80">(Sat-Sun)</div>
                    </div>
                  </Button>
                </div>} />
          </div>

          {/* Time Schedule Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Preferred time for visits
            </h3>
            
            <FormField control={form.control} name="availableAllDay" render={({
            field
          }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={checked => field.onChange(checked)} className="border-gray-400" />
                  </FormControl>
                  <FormLabel className="text-base font-medium cursor-pointer">
                    Available All Day (10 AM to 7 PM)
                  </FormLabel>
                </FormItem>} />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Start Time</label>
                <div className="flex items-center space-x-3 border rounded-lg p-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <FormField control={form.control} name="startTime" render={({
                  field
                }) => <Input type="time" value={watchAvailableAllDay ? '10:00' : field.value} disabled={watchAvailableAllDay} onChange={!watchAvailableAllDay ? field.onChange : undefined} className="border-0 p-0 h-auto text-sm" />} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">End Time</label>
                <div className="flex items-center space-x-3 border rounded-lg p-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <FormField control={form.control} name="endTime" render={({
                  field
                }) => <Input type="time" value={watchAvailableAllDay ? '19:00' : field.value} disabled={watchAvailableAllDay} onChange={!watchAvailableAllDay ? field.onChange : undefined} className="border-0 p-0 h-auto text-sm" />} />
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards - Removed */}
        </form>
      </Form>
    </div>;
};
