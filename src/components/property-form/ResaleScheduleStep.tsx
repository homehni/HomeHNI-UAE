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
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Property Visits Info */}
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 rounded-xl p-6 relative overflow-hidden border border-green-200/50 shadow-lg">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Properties with flexible visit timings get{' '}
                    <span className="text-green-600 font-bold">60% more</span> inquiries
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Make it easy for serious buyers to visit your property
                  </p>
                </div>
                <div className="absolute right-4 top-4 w-16 h-16 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full opacity-40"></div>
                <div className="absolute right-8 bottom-4 w-12 h-12 bg-gradient-to-br from-emerald-300 to-green-300 rounded-full opacity-60"></div>
              </div>

              {/* Quick Response Info */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-xl p-6 relative overflow-hidden border border-blue-200/50 shadow-lg">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Clear availability helps buyers{' '}
                    <span className="text-blue-600 font-bold">plan visits</span> better
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Reduce unnecessary calls and get more serious inquiries
                  </p>
                </div>
                <div className="absolute right-4 top-4 w-16 h-16 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full opacity-40"></div>
                <div className="absolute right-8 bottom-4 w-12 h-12 bg-gradient-to-br from-indigo-300 to-blue-300 rounded-full opacity-60"></div>
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