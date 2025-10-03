import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { sendFreshlyPaintedEmail, sendDeepCleaningEmail } from '@/services/emailService';
import { OwnerInfo, PropertyInfo } from '@/types/property';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Clock, PaintBucket, CheckCircle } from 'lucide-react';
const scheduleSchema = z.object({
  paintingService: z.enum(['book', 'decline']).optional(),
  cleaningService: z.enum(['book', 'decline']).optional(),
  availability: z.enum(['everyday', 'weekday', 'weekend']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  availableAllDay: z.boolean().optional()
});
type ScheduleFormData = z.infer<typeof scheduleSchema>;
interface ScheduleStepProps {
  initialData?: Partial<ScheduleFormData>;
  onNext?: (data: ScheduleFormData) => void;
  onBack: () => void;
  onSubmit?: (data: ScheduleFormData) => void;
  ownerInfo?: Partial<OwnerInfo>;
  propertyInfo?: any;
}
export const ScheduleStep: React.FC<ScheduleStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  onSubmit,
  ownerInfo,
  propertyInfo
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paintingResponse, setPaintingResponse] = useState<'book' | 'decline' | null>(null);
  const [cleaningResponse, setCleaningResponse] = useState<'book' | 'decline' | null>(null);
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      paintingService: initialData.paintingService,
      cleaningService: initialData.cleaningService,
      availability: initialData.availability || 'everyday',
      startTime: initialData.startTime || '09:00',
      endTime: initialData.endTime || '18:00',
      availableAllDay: initialData.availableAllDay || false
    }
  });
  const handlePaintingBookNow = async () => {
    if (!ownerInfo?.email || !ownerInfo?.fullName) {
      toast({
        title: "Error",
        description: "Unable to send request. Please ensure your email and name are properly entered.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Handle different property data structures from different forms
      const locality = propertyInfo?.locationDetails?.locality || '';
      const expectedPrice = propertyInfo?.rentalDetails?.expectedPrice || 
                           propertyInfo?.rentalDetails?.expectedRent || 
                           '';

      await sendFreshlyPaintedEmail(
        ownerInfo.email,
        ownerInfo.fullName,
        ownerInfo.propertyType || '',
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
    if (!ownerInfo?.email || !ownerInfo?.fullName) {
      toast({
        title: "Error",
        description: "Unable to send request. Please ensure your email and name are properly entered.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Handle different property data structures from different forms
      const locality = propertyInfo?.locationDetails?.locality || '';
      const expectedPrice = propertyInfo?.rentalDetails?.expectedPrice || 
                           propertyInfo?.rentalDetails?.expectedRent || 
                           '';

      await sendDeepCleaningEmail(
        ownerInfo.email,
        ownerInfo.fullName,
        ownerInfo.propertyType || '',
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

  const onFormSubmit = (data: ScheduleFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else if (onNext) {
      onNext(data);
    }
  };
  const watchAvailableAllDay = form.watch('availableAllDay');
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-primary mb-6 pt-4 md:pt-0">
        Make house visits hassle-free by providing us your availability
      </h1>

      <Form {...form}>
        <form id="schedule-form" onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
          {/* Service Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Painting Service */}
            <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-100 rounded-xl p-6 relative overflow-hidden border border-orange-200/50 shadow-lg">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <PaintBucket className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Freshly painted homes get rented out{' '}
                  <span className="text-orange-600 font-bold">73% faster</span>
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Get professional painting services at the best prices
                </p>
                <FormField control={form.control} name="paintingService" render={({
                field
              }) => <div className="space-y-3">
                        {paintingResponse ? <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Your response has been captured
                          </span>
                        </div> : <div className="flex gap-3">
                          <Button 
                            type="button" 
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 h-auto rounded-md font-medium" 
                            onClick={handlePaintingBookNow}
                          >
                            Book Now
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 h-auto rounded-md font-medium" 
                            onClick={() => {
                              field.onChange('decline');
                              setPaintingResponse('decline');
                            }}
                          >
                            I Don't Want
                          </Button>
                        </div>}
                    </div>} />
              </div>
              <div className="absolute right-4 top-4 w-16 h-16 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full opacity-40"></div>
              <div className="absolute right-8 bottom-4 w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-60"></div>
            </div>

            {/* Cleaning Service */}
            <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 rounded-xl p-6 relative overflow-hidden border border-teal-200/50 shadow-lg">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Get your house tenant-ready with{' '}
                  <span className="text-teal-600 font-bold">Deep Cleaning</span>
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Trusted by 50,000+ owners
                </p>
                <FormField control={form.control} name="cleaningService" render={({
                field
              }) => <div className="space-y-3">
                        {cleaningResponse ? <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Your response has been captured
                          </span>
                        </div> : <div className="flex gap-3">
                          <Button 
                            type="button" 
                            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 h-auto rounded-md font-medium" 
                            onClick={handleCleaningBookNow}
                          >
                            Book Now
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 h-auto rounded-md font-medium" 
                            onClick={() => {
                              field.onChange('decline');
                              setCleaningResponse('decline');
                            }}
                          >
                            I Don't Want
                          </Button>
                        </div>}
                    </div>} />
              </div>
              <div className="absolute right-4 top-4 w-16 h-16 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full opacity-40"></div>
              <div className="absolute right-8 bottom-4 w-12 h-12 bg-gradient-to-br from-cyan-300 to-teal-300 rounded-full opacity-60"></div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Availability</h3>
              <FormField control={form.control} name="availability" render={({
              field
            }) => <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button type="button" variant={field.value === 'everyday' ? 'default' : 'outline'} className="h-16 flex flex-col" onClick={() => field.onChange('everyday')}>
                      <span className="font-semibold">Everyday</span>
                      <span className="text-xs text-muted-foreground">Mon-Sun</span>
                    </Button>
                    <Button type="button" variant={field.value === 'weekday' ? 'default' : 'outline'} className="h-16 flex flex-col" onClick={() => field.onChange('weekday')}>
                      <span className="font-semibold">Weekday</span>
                      <span className="text-xs text-muted-foreground">Mon-Fri</span>
                    </Button>
                    <Button type="button" variant={field.value === 'weekend' ? 'default' : 'outline'} className="h-16 flex flex-col" onClick={() => field.onChange('weekend')}>
                      <span className="font-semibold">Weekend</span>
                      <span className="text-xs text-muted-foreground">Sat-Sun</span>
                    </Button>
                  </div>} />
            </div>

            {/* Time Schedule */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Time Schedule</h3>
              
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
                      Available All Day
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


        </form>
      </Form>
    </div>
  );
};