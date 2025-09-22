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
}

export const LandPlotScheduleStep: React.FC<LandPlotScheduleStepProps> = ({
  initialData,
  onNext,
  onBack,
  onSubmit
}) => {
  const [paintingResponse, setPaintingResponse] = useState<'book' | 'decline' | null>(null);
  const [cleaningResponse, setCleaningResponse] = useState<'book' | 'decline' | null>(null);

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

  return (
    <div className="bg-background p-6">
        <div className="text-left mb-8">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Schedule Property Visits
          </h2>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
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
                        onClick={() => {
                          setValue('paintingService', 'book');
                          setPaintingResponse('book');
                          window.open('/painting-cleaning', '_blank');
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
                          setValue('paintingService', 'decline');
                          setPaintingResponse('decline');
                        }}
                      >
                        I Don't Want
                      </Button>
                    </div>
                  )}
                </div>
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
                        onClick={() => {
                          setValue('cleaningService', 'book');
                          setCleaningResponse('book');
                          window.open('/painting-cleaning', '_blank');
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
                          setValue('cleaningService', 'decline');
                          setCleaningResponse('decline');
                        }}
                      >
                        I Don't Want
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute right-4 top-4 w-16 h-16 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full opacity-40"></div>
              <div className="absolute right-8 bottom-4 w-12 h-12 bg-gradient-to-br from-cyan-300 to-teal-300 rounded-full opacity-60"></div>
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
      </div>
  );
};