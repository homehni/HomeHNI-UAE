import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Calendar, Eye, CheckCircle } from 'lucide-react';

const resaleScheduleSchema = z.object({
  availability: z.enum(['everyday', 'weekday', 'weekend']).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  availableAllDay: z.boolean().optional(),
});

type ResaleScheduleData = z.infer<typeof resaleScheduleSchema>;

interface ResaleScheduleStepProps {
  initialData?: Partial<ResaleScheduleData>;
  onNext: (data: ResaleScheduleData) => void;
  onBack: () => void;
  onSubmit?: (data: ResaleScheduleData) => void;
  formId?: string;
}

export const ResaleScheduleStep: React.FC<ResaleScheduleStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  onSubmit,
  formId
}) => {
  const form = useForm<ResaleScheduleData>({
    resolver: zodResolver(resaleScheduleSchema),
    defaultValues: {
      availability: initialData.availability || 'everyday',
      startTime: initialData.startTime || '09:00',
      endTime: initialData.endTime || '18:00',
      availableAllDay: initialData.availableAllDay || false,
    },
  });

const handleFormSubmit = (data: ResaleScheduleData) => {
  console.log('[ResaleScheduleStep] Submit clicked with data:', data);
  if (onSubmit) {
    onSubmit(data);
  } else {
    onNext(data);
  }
};

  const watchAvailableAllDay = form.watch('availableAllDay');

  return (
    <div className="max-w-4xl">
      <div className="bg-background rounded-lg border p-8">
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Set your availability for property visits
          </h2>
        </div>

        <Form {...form}>
          <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Painting Service Card */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 relative overflow-hidden border border-orange-200/50 shadow-lg">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-orange-500 text-sm font-bold">%</span>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Freshly painted homes get rented out{' '}
                    <span className="text-orange-600 font-bold">73% faster</span>
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Get professional painting services at the best prices
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
                      Book Now
                    </Button>
                    <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded-lg">
                      I Don't Want
                    </Button>
                  </div>
                </div>
                <div className="absolute right-4 top-4 w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-30"></div>
                <div className="absolute right-8 bottom-16 w-12 h-12 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full opacity-50"></div>
              </div>

              {/* Cleaning Service Card */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 relative overflow-hidden border border-teal-200/50 shadow-lg">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-teal-500 text-sm font-bold">✨</span>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Get your house tenant-ready with{' '}
                    <span className="text-teal-600 font-bold">Deep Cleaning</span>
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Trusted by 50,000+ owners
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium">
                      Book Now
                    </Button>
                    <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded-lg">
                      I Don't Want
                    </Button>
                  </div>
                </div>
                <div className="absolute right-4 top-4 w-16 h-16 bg-gradient-to-br from-cyan-300 to-teal-300 rounded-full opacity-30"></div>
                <div className="absolute right-8 bottom-16 w-12 h-12 bg-gradient-to-br from-teal-300 to-cyan-300 rounded-full opacity-50"></div>
              </div>
            </div>

            {/* Availability Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">When are you available for property visits?</h3>
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
                        <span className="font-semibold">Weekdays Only</span>
                        <span className="text-xs text-muted-foreground">Mon-Fri</span>
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'weekend' ? 'default' : 'outline'}
                        className="h-16 flex flex-col"
                        onClick={() => field.onChange('weekend')}
                      >
                        <span className="font-semibold">Weekends Only</span>
                        <span className="text-xs text-muted-foreground">Sat-Sun</span>
                      </Button>
                    </div>
                  )}
                />
              </div>

              {/* Time Schedule */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Preferred time for visits</h3>
                
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
                        Available All Day (10 AM to 7 PM)
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

            {/* Action Buttons */}
            <div className="flex justify-between pt-8" style={{ visibility: 'hidden' }}>
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
    </div>
  );
};