import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ScheduleInfo } from '@/types/property';
import { Eye, Calendar, Clock, PaintBucket, Sparkles, CheckCircle } from 'lucide-react';
import { sendFreshlyPaintedEmail, sendDeepCleaningEmail } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const scheduleSchema = z.object({
  paintingService: z.enum(['book', 'decline']).optional(),
  cleaningService: z.enum(['book', 'decline']).optional(),
  availability: z.enum(['everyday', 'weekday', 'weekend']).optional(),
  availableAllDay: z.boolean().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

type ScheduleForm = z.infer<typeof scheduleSchema>;

interface LandPlotScheduleStepProps {
  initialData: Partial<ScheduleInfo>;
  onNext: (data: ScheduleForm) => void;
  onBack: () => void;
  onSubmit?: (data: ScheduleForm) => void;
  ownerInfo?: any;
  propertyInfo?: any;
}

export const LandPlotScheduleStep: React.FC<LandPlotScheduleStepProps> = ({
  initialData,
  onNext,
  onBack,
  onSubmit,
  ownerInfo,
  propertyInfo
}) => {
  const [paintingResponse, setPaintingResponse] = useState<'book' | 'decline' | null>(null);
  const [cleaningResponse, setCleaningResponse] = useState<'book' | 'decline' | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      paintingService: initialData.paintingService || undefined,
      cleaningService: initialData.cleaningService || undefined,
      availableAllDay: initialData.availableAllDay ?? true,
      availability: initialData.availability,
      startTime: initialData.startTime || '10:00',
      endTime: initialData.endTime || '19:00',
    }
  });

  const availability = watch('availability');
  const availableAllDay = watch('availableAllDay');
  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const paintingService = watch('paintingService');
  const cleaningService = watch('cleaningService');

  const handleFormSubmit = (data: ScheduleForm) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      onNext(data);
    }
  };

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
      console.warn('[LandPlotScheduleStep] Missing contact details for Painting', { email, fullName, ownerInfo, user });
      return;
    }

    try {
      const locality = propertyInfo?.locationDetails?.locality || '';
      const expectedPrice = propertyInfo?.saleDetails?.expectedPrice || 
                           propertyInfo?.plotDetails?.expectedPrice || 
                           '';

      await sendFreshlyPaintedEmail(
        email,
        fullName,
        propertyInfo?.plotDetails?.landType || 'land',
        locality,
        expectedPrice.toString()
      );

      toast({
        title: "Your painting service request has been submitted successfully.",
        description: "Our painting specialists will contact you within 6 hours.",
        variant: "success"
      });

      setValue('paintingService', 'book');
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
      console.warn('[LandPlotScheduleStep] Missing contact details for Cleaning', { email, fullName, ownerInfo, user });
      return;
    }

    try {
      const locality = propertyInfo?.locationDetails?.locality || '';
      const expectedPrice = propertyInfo?.saleDetails?.expectedPrice || 
                           propertyInfo?.plotDetails?.expectedPrice || 
                           '';

      await sendDeepCleaningEmail(
        email,
        fullName,
        propertyInfo?.plotDetails?.landType || 'land',
        locality,
        expectedPrice.toString()
      );

      toast({
        title: "Your cleaning service request has been submitted successfully.",
        description: "Our cleaning specialists will contact you within 6 hours.",
        variant: "success"
      });

      setValue('cleaningService', 'book');
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

  return (
    <div className="bg-background p-6">
        <div className="text-left mb-8 pt-4 md:pt-0">
          <h2 className="text-2xl font-semibold text-[#22c55e] mb-2">
            Schedule Property Visits
          </h2>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Availability Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              When are you available for property visits?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                type="button"
                onClick={() => setValue('availability', 'everyday')}
                variant={availability === 'everyday' ? 'default' : 'outline'}
                className={`h-16 text-center ${availability === 'everyday' ? 'bg-[#22c55e] hover:bg-[#16a34a] text-white' : 'border-gray-300 text-gray-700'}`}
              >
                <div>
                  <div className="font-semibold">Everyday</div>
                  <div className="text-sm opacity-80">(Mon-Sun)</div>
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => setValue('availability', 'weekday')}
                variant={availability === 'weekday' ? 'default' : 'outline'}
                className={`h-16 text-center ${availability === 'weekday' ? 'bg-[#22c55e] hover:bg-[#16a34a] text-white' : 'border-gray-300 text-gray-700'}`}
              >
                <div>
                  <div className="font-semibold">Weekdays Only</div>
                  <div className="text-sm opacity-80">(Mon-Fri)</div>
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => setValue('availability', 'weekend')}
                variant={availability === 'weekend' ? 'default' : 'outline'}
                className={`h-16 text-center ${availability === 'weekend' ? 'bg-[#22c55e] hover:bg-[#16a34a] text-white' : 'border-gray-300 text-gray-700'}`}
              >
                <div>
                  <div className="font-semibold">Weekends Only</div>
                  <div className="text-sm opacity-80">(Sat-Sun)</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Time Schedule Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Preferred time for visits
            </h3>
            
            <div className="flex items-center space-x-3">
              <Checkbox
                id="availableAllDay"
                checked={availableAllDay}
                onCheckedChange={(checked) => setValue('availableAllDay', !!checked)}
                className="border-gray-400"
              />
              <Label htmlFor="availableAllDay" className="text-base font-medium cursor-pointer">
                Available All Day (10 AM to 7 PM)
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Start Time</label>
                <div className="flex items-center space-x-3 border rounded-lg p-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <Input
                    type="time"
                    value={availableAllDay ? '10:00' : startTime || '10:00'}
                    disabled={availableAllDay}
                    onChange={(e) => !availableAllDay && setValue('startTime', e.target.value)}
                    className="border-0 p-0 h-auto text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">End Time</label>
                <div className="flex items-center space-x-3 border rounded-lg p-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <Input
                    type="time"
                    value={availableAllDay ? '19:00' : endTime || '19:00'}
                    disabled={availableAllDay}
                    onChange={(e) => !availableAllDay && setValue('endTime', e.target.value)}
                    className="border-0 p-0 h-auto text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Removed, using sticky buttons instead */}
        </form>
        
        {/* Additional spacing to ensure proper scrolling */}
        <div className="h-32"></div>
      </div>
  );
};