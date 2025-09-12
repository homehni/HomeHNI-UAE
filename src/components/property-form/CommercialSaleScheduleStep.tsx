import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { PaintBucket, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { ScheduleInfo } from '@/types/property';

const commercialSaleScheduleSchema = z.object({
  availability: z.enum(['everyday', 'weekday', 'weekend']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  availableAllDay: z.boolean().optional(),
  paintingService: z.enum(['book', 'decline']).optional(),
  cleaningService: z.enum(['book', 'decline']).optional(),
});

type CommercialSaleScheduleForm = z.infer<typeof commercialSaleScheduleSchema>;

interface CommercialSaleScheduleStepProps {
  initialData?: Partial<ScheduleInfo>;
  onNext: (data: Partial<ScheduleInfo>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialSaleScheduleStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: CommercialSaleScheduleStepProps) => {
  const [paintingResponse, setPaintingResponse] = useState<'book' | 'decline' | null>(initialData?.paintingService as 'book' | 'decline' || null);
  const [cleaningResponse, setCleaningResponse] = useState<'book' | 'decline' | null>(initialData?.cleaningService as 'book' | 'decline' || null);

  const form = useForm<CommercialSaleScheduleForm>({
    resolver: zodResolver(commercialSaleScheduleSchema),
    defaultValues: {
      availability: initialData?.availability || 'everyday',
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '18:00',
      availableAllDay: initialData?.availableAllDay ?? true,
      paintingService: initialData?.paintingService as 'book' | 'decline' || undefined,
      cleaningService: initialData?.cleaningService as 'book' | 'decline' || undefined,
    },
  });

  const onSubmit = (data: CommercialSaleScheduleForm) => {
    onNext(data);
  };

  const watchAvailableAllDay = form.watch('availableAllDay');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Make house visits hassle-free by providing us your availability
        </h2>
        <div className="mt-4 text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <FormField
                  control={form.control}
                  name="paintingService"
                  render={({ field }) => (
                    <div className="space-y-3">
                      {paintingResponse === 'decline' ? (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Your response has been captured
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            variant={field.value === 'book' ? 'default' : 'outline'}
                            onClick={() => {
                              field.onChange('book');
                              setPaintingResponse('book');
                            }}
                          >
                            Book Now
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => {
                              field.onChange('decline');
                              setPaintingResponse('decline');
                            }}
                          >
                            I Don't Want
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="cleaningService"
                  render={({ field }) => (
                    <div className="space-y-3">
                      {cleaningResponse === 'decline' ? (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Your response has been captured
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            size="sm"
                            className="bg-teal-500 hover:bg-teal-600 text-white"
                            variant={field.value === 'book' ? 'default' : 'outline'}
                            onClick={() => {
                              field.onChange('book');
                              setCleaningResponse('book');
                            }}
                          >
                            Book Now
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => {
                              field.onChange('decline');
                              setCleaningResponse('decline');
                            }}
                          >
                            I Don't Want
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="absolute right-4 top-4 w-16 h-16 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full opacity-40"></div>
              <div className="absolute right-8 bottom-4 w-12 h-12 bg-gradient-to-br from-cyan-300 to-teal-300 rounded-full opacity-60"></div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Availability</h3>
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      onClick={() => field.onChange('everyday')}
                      variant={field.value === 'everyday' ? 'default' : 'outline'}
                      className={`text-center ${field.value === 'everyday' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-gray-300'}`}
                    >
                      <div>
                        <div className="font-semibold">Everyday</div>
                        <div className="text-xs">Mon-Sun</div>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => field.onChange('weekday')}
                      variant={field.value === 'weekday' ? 'default' : 'outline'}
                      className={`text-center ${field.value === 'weekday' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-gray-300'}`}
                    >
                      <div>
                        <div className="font-semibold">Weekday</div>
                        <div className="text-xs">Mon-Fri</div>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => field.onChange('weekend')}
                      variant={field.value === 'weekend' ? 'default' : 'outline'}
                      className={`text-center ${field.value === 'weekend' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-gray-300'}`}
                    >
                      <div>
                        <div className="font-semibold">Weekend</div>
                        <div className="text-xs">Sat-Sun</div>
                      </div>
                    </Button>
                  </div>
                )}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Select Time Schedule</h3>
              <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <Clock className="w-3 h-3" />
                      </div>
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <Input
                            type="time"
                            value={watchAvailableAllDay ? '10:00' : field.value}
                            disabled={watchAvailableAllDay}
                            onChange={!watchAvailableAllDay ? field.onChange : undefined}
                            className="border-0 p-0 h-auto"
                          />
                        )}
                      />
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <Clock className="w-3 h-3" />
                      </div>
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <Input
                            type="time"
                            value={watchAvailableAllDay ? '19:00' : field.value}
                            disabled={watchAvailableAllDay}
                            onChange={!watchAvailableAllDay ? field.onChange : undefined}
                            className="border-0 p-0 h-auto"
                          />
                        )}
                      />
                    </div>
                  </div>
                <FormField
                  control={form.control}
                  name="availableAllDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          className="border-teal-600 text-teal-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer">
                        Available All Day
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};