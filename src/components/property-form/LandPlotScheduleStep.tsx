import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScheduleInfo } from '@/types/property';

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
}

export const LandPlotScheduleStep: React.FC<LandPlotScheduleStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [paintingService, setPaintingService] = useState<'book' | 'decline' | null>(null);
  const [cleaningService, setCleaningService] = useState<'book' | 'decline' | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      availableAllDay: initialData.availableAllDay ?? true,
      availability: initialData.availability,
      startTime: initialData.startTime,
      endTime: initialData.endTime,
    }
  });

  const availability = watch('availability');
  const availableAllDay = watch('availableAllDay');

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Make house visits hassle-free by providing us your availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-8">
          {/* Services Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Painting Service */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Freshly painted homes get rented out{' '}
                    <span className="text-teal-600 font-bold">73% faster</span>
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Get professional painting services at the best prices
                  </p>
                </div>
                <div className="w-20 h-20 bg-yellow-200 rounded-lg flex items-center justify-center ml-4">
                  🎨
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setPaintingService('book')}
                  variant={paintingService === 'book' ? 'default' : 'outline'}
                  className={paintingService === 'book' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                >
                  Book Now
                </Button>
                <Button
                  type="button"
                  onClick={() => setPaintingService('decline')}
                  variant={paintingService === 'decline' ? 'default' : 'outline'}
                  className={paintingService === 'decline' ? 'bg-gray-500 hover:bg-gray-600' : ''}
                >
                  I Don't Want Painting
                </Button>
              </div>
            </div>

            {/* Cleaning Service */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Get your house tenant-ready with{' '}
                    <span className="text-teal-600 font-bold">Deep Cleaning</span>
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Trusted by 50,000+ owners
                  </p>
                </div>
                <div className="w-20 h-20 bg-yellow-200 rounded-lg flex items-center justify-center ml-4">
                  🧽
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setCleaningService('book')}
                  variant={cleaningService === 'book' ? 'default' : 'outline'}
                  className={cleaningService === 'book' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                >
                  Book Now
                </Button>
                <Button
                  type="button"
                  onClick={() => setCleaningService('decline')}
                  variant={cleaningService === 'decline' ? 'default' : 'outline'}
                  className={cleaningService === 'decline' ? 'bg-gray-500 hover:bg-gray-600' : ''}
                >
                  I Don't Want Cleaning
                </Button>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Availability</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  onClick={() => setValue('availability', 'everyday')}
                  variant={availability === 'everyday' ? 'default' : 'outline'}
                  className={`text-center ${availability === 'everyday' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-gray-300'}`}
                >
                  <div>
                    <div className="font-semibold">Everyday</div>
                    <div className="text-xs">Mon-Sun</div>
                  </div>
                </Button>
                <Button
                  type="button"
                  onClick={() => setValue('availability', 'weekday')}
                  variant={availability === 'weekday' ? 'default' : 'outline'}
                  className={`text-center ${availability === 'weekday' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-gray-300'}`}
                >
                  <div>
                    <div className="font-semibold">Weekday</div>
                    <div className="text-xs">Mon-Fri</div>
                  </div>
                </Button>
                <Button
                  type="button"
                  onClick={() => setValue('availability', 'weekend')}
                  variant={availability === 'weekend' ? 'default' : 'outline'}
                  className={`text-center ${availability === 'weekend' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-gray-300'}`}
                >
                  <div>
                    <div className="font-semibold">Weekend</div>
                    <div className="text-xs">Sat-Sun</div>
                  </div>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Select Time Schedule</h3>
              <div className="space-y-4">
                {!availableAllDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        🕐
                      </div>
                      <Input
                        type="time"
                        defaultValue="07:00"
                        {...register('startTime')}
                        className="border-0 p-0 h-auto"
                      />
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        🕙
                      </div>
                      <Input
                        type="time"
                        defaultValue="22:00"
                        {...register('endTime')}
                        className="border-0 p-0 h-auto"
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="availableAllDay"
                    checked={availableAllDay}
                    onCheckedChange={(checked) => setValue('availableAllDay', !!checked)}
                    className="border-teal-600 text-teal-600"
                  />
                  <Label htmlFor="availableAllDay" className="text-sm font-medium text-foreground">
                    Available All Day
                  </Label>
                </div>
              </div>
            </div>
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
              Save & Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};