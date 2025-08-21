import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScheduleInfo } from '@/types/property';

const scheduleSchema = z.object({
  availability: z.enum(['everyday', 'weekday', 'weekend']).optional(),
  availableAllDay: z.boolean().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  scheduleInstructions: z.string().optional(),
});

type ScheduleForm = z.infer<typeof scheduleSchema>;

interface LandPlotScheduleStepProps {
  initialData: Partial<ScheduleInfo>;
  onNext: (data: ScheduleForm) => void;
  onBack: () => void;
}

export const LandPlotScheduleStep: React.FC<LandPlotScheduleStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      ...initialData,
      availableAllDay: initialData.availableAllDay ?? true,
    }
  });

  const availability = watch('availability');
  const availableAllDay = watch('availableAllDay');

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Schedule Site Visit
        </CardTitle>
        <p className="text-gray-600">
          Set your availability for site visits and viewing appointments
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="availability" className="text-sm font-medium text-gray-700">
              When are you available for site visits?
            </Label>
            <Select onValueChange={(value) => setValue('availability', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyday">Everyday</SelectItem>
                  <SelectItem value="weekday">Weekdays only (Mon-Fri)</SelectItem>
                  <SelectItem value="weekend">Weekends only (Sat-Sun)</SelectItem>
                </SelectContent>
            </Select>
            {errors.availability && (
              <p className="text-red-500 text-sm">{errors.availability.message}</p>
            )}
          </div>

          {/* All Day Availability */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="availableAllDay"
              defaultChecked={initialData.availableAllDay}
              onCheckedChange={(checked) => setValue('availableAllDay', !!checked)}
            />
            <Label htmlFor="availableAllDay" className="text-sm font-medium text-gray-700">
              Available all day
            </Label>
          </div>

          {/* Time Range */}
          {!availableAllDay && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                  Available From
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register('startTime')}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                  Available Until
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  {...register('endTime')}
                  className="w-full"
                />
              </div>
            </div>
          )}


          {/* Schedule Instructions */}
          <div className="space-y-2">
            <Label htmlFor="scheduleInstructions" className="text-sm font-medium text-gray-700">
              Special Instructions for Visitors
            </Label>
            <Textarea
              id="scheduleInstructions"
              {...register('scheduleInstructions')}
              placeholder="Any special instructions for site visits, directions, or requirements..."
              rows={3}
              className="w-full"
            />
            <p className="text-gray-500 text-xs">
              Include any important information visitors should know before visiting the plot
            </p>
          </div>

          {/* Site Visit Guidelines */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Site Visit Guidelines:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Always schedule visits during daylight hours for safety</li>
              <li>• Ensure easy access to the plot for visitors</li>
              <li>• Have plot documents ready for verification</li>
              <li>• Mark plot boundaries clearly for visitors</li>
              <li>• Provide clear directions from nearest landmark</li>
              <li>• Be present during scheduled visits or arrange for a representative</li>
              <li>• Keep your contact number active for communication</li>
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Next: Preview & Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};