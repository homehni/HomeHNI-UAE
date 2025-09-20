import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Eye, Calendar } from 'lucide-react';
import { ScheduleInfo } from '@/types/property';

const commercialSaleScheduleSchema = z.object({
  availability: z.enum(['everyday', 'weekday', 'weekend']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  availableAllDay: z.boolean().optional(),
});

type CommercialSaleScheduleForm = z.infer<typeof commercialSaleScheduleSchema>;

interface CommercialSaleScheduleStepProps {
  initialData?: Partial<ScheduleInfo>;
  onNext: (data: Partial<ScheduleInfo>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  onSubmit?: (data: Partial<ScheduleInfo>) => void;
}

export const CommercialSaleScheduleStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps,
  onSubmit
}: CommercialSaleScheduleStepProps) => {
  const form = useForm<CommercialSaleScheduleForm>({
    resolver: zodResolver(commercialSaleScheduleSchema),
    defaultValues: {
      availability: initialData?.availability || 'everyday',
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '18:00',
      availableAllDay: initialData?.availableAllDay ?? true,
    },
  });

const handleFormSubmit = (data: CommercialSaleScheduleForm) => {
  if (onSubmit) {
    onSubmit(data);
  } else {
    onNext(data);
  }
};

  const watchAvailableAllDay = form.watch('availableAllDay');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-left">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Schedule Property Visits
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flexible Timing Card */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-100 rounded-xl p-6 border border-teal-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Properties with flexible visit timings get{' '}
                    <span className="text-teal-600 font-bold">60% more inquiries</span>
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Make it easy for serious buyers to visit your property
                  </p>
                </div>
              </div>
            </div>

            {/* Clear Availability Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Clear availability helps buyers{' '}
                    <span className="text-blue-600 font-bold">plan visits better</span>
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Reduce unnecessary calls and get more serious inquiries
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              When are you available for property visits?
            </h3>
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    type="button"
                    onClick={() => field.onChange('everyday')}
                    variant={field.value === 'everyday' ? 'default' : 'outline'}
                    className={`h-16 text-center ${field.value === 'everyday' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300 text-gray-700'}`}
                  >
                    <div>
                      <div className="font-semibold">Everyday</div>
                      <div className="text-sm opacity-80">(Mon-Sun)</div>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => field.onChange('weekday')}
                    variant={field.value === 'weekday' ? 'default' : 'outline'}
                    className={`h-16 text-center ${field.value === 'weekday' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300 text-gray-700'}`}
                  >
                    <div>
                      <div className="font-semibold">Weekdays Only</div>
                      <div className="text-sm opacity-80">(Mon-Fri)</div>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => field.onChange('weekend')}
                    variant={field.value === 'weekend' ? 'default' : 'outline'}
                    className={`h-16 text-center ${field.value === 'weekend' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300 text-gray-700'}`}
                  >
                    <div>
                      <div className="font-semibold">Weekends Only</div>
                      <div className="text-sm opacity-80">(Sat-Sun)</div>
                    </div>
                  </Button>
                </div>
              )}
            />
          </div>

          {/* Time Schedule Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Preferred time for visits
            </h3>
            
            <FormField
              control={form.control}
              name="availableAllDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      className="border-gray-400"
                    />
                  </FormControl>
                  <FormLabel className="text-base font-medium cursor-pointer">
                    Available All Day (10 AM to 7 PM)
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Start Time</label>
                <div className="flex items-center space-x-3 border rounded-lg p-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <Input
                        type="time"
                        value={watchAvailableAllDay ? '10:00' : field.value}
                        disabled={watchAvailableAllDay}
                        onChange={!watchAvailableAllDay ? field.onChange : undefined}
                        className="border-0 p-0 h-auto text-sm"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">End Time</label>
                <div className="flex items-center space-x-3 border rounded-lg p-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <Input
                        type="time"
                        value={watchAvailableAllDay ? '19:00' : field.value}
                        disabled={watchAvailableAllDay}
                        onChange={!watchAvailableAllDay ? field.onChange : undefined}
                        className="border-0 p-0 h-auto text-sm"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards - Removed */}
        </form>
      </Form>
    </div>
  );
};