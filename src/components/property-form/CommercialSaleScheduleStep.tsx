import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [availableAllDay, setAvailableAllDay] = useState(initialData?.availableAllDay ?? true);

  const form = useForm<CommercialSaleScheduleForm>({
    resolver: zodResolver(commercialSaleScheduleSchema),
    defaultValues: {
      availability: initialData?.availability || 'everyday',
      startTime: initialData?.startTime || '',
      endTime: initialData?.endTime || '',
      availableAllDay: availableAllDay,
      paintingService: initialData?.paintingService || 'decline',
      cleaningService: initialData?.cleaningService || 'decline',
    },
  });

  const onSubmit = (data: CommercialSaleScheduleForm) => {
    const scheduleData = {
      ...data,
      availableAllDay,
    };
    onNext(scheduleData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule & Services</h2>
        <p className="text-gray-600">Set your availability for property viewings</p>
        <div className="mt-4 text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>When are you available for property viewings? *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="everyday">Everyday (Monday to Sunday)</SelectItem>
                    <SelectItem value="weekday">Weekdays Only (Monday to Friday)</SelectItem>
                    <SelectItem value="weekend">Weekends Only (Saturday & Sunday)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availableAllDay"
                checked={availableAllDay}
                onCheckedChange={(checked) => setAvailableAllDay(checked === true)}
              />
              <label
                htmlFor="availableAllDay"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Available all day
              </label>
            </div>

            {!availableAllDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-medium">Additional Services</h3>
            
            <FormField
              control={form.control}
              name="paintingService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Would you like to book painting services?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select painting service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="book">Yes, book painting service</SelectItem>
                      <SelectItem value="decline">No, not required</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cleaningService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Would you like to book cleaning services?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cleaning service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="book">Yes, book cleaning service</SelectItem>
                      <SelectItem value="decline">No, not required</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};