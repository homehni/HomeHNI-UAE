import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScheduleInfo } from '@/types/property';
import { Eye, Calendar, Clock } from 'lucide-react';

const scheduleSchema = z.object({
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
}

export const LandPlotScheduleStep: React.FC<LandPlotScheduleStepProps> = ({
  initialData,
  onNext,
  onBack,
  onSubmit
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Schedule Property Visits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-8">
          {/* Informational Cards */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                type="button"
                onClick={() => setValue('availability', 'everyday')}
                variant={availability === 'everyday' ? 'default' : 'outline'}
                className={`h-16 text-center ${availability === 'everyday' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300 text-gray-700'}`}
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
                className={`h-16 text-center ${availability === 'weekday' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300 text-gray-700'}`}
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
                className={`h-16 text-center ${availability === 'weekend' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300 text-gray-700'}`}
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
      </CardContent>
    </Card>
  );
};