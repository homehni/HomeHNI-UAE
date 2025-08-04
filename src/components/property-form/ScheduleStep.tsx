import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Clock } from 'lucide-react';

const scheduleSchema = z.object({
  paintingService: z.enum(['book', 'decline']).optional(),
  cleaningService: z.enum(['book', 'decline']).optional(),
  availability: z.enum(['everyday', 'weekday', 'weekend']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  availableAllDay: z.boolean().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface ScheduleStepProps {
  initialData?: Partial<ScheduleFormData>;
  onNext: (data: ScheduleFormData) => void;
  onBack: () => void;
}

const steps = [
  { number: 1, title: "Property Details", icon: Home, completed: true },
  { number: 2, title: "Location Details", icon: MapPin, completed: true },
  { number: 3, title: "Rental Details", icon: Building, completed: true },
  { number: 4, title: "Amenities", icon: Sparkles, completed: true },
  { number: 5, title: "Gallery", icon: Camera, completed: true },
  { number: 6, title: "Additional Information", icon: FileText, completed: true },
  { number: 7, title: "Schedule", icon: Calendar, completed: false, current: true },
];

export const ScheduleStep: React.FC<ScheduleStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      paintingService: initialData.paintingService,
      cleaningService: initialData.cleaningService,
      availability: initialData.availability || 'everyday',
      startTime: initialData.startTime || '',
      endTime: initialData.endTime || '',
      availableAllDay: initialData.availableAllDay || false,
    },
  });

  const onSubmit = (data: ScheduleFormData) => {
    onNext(data);
  };

  const watchAvailableAllDay = form.watch('availableAllDay');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-foreground">Post Your Property</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">90% Done</span>
            <Button className="bg-destructive hover:bg-destructive/90">
              Preview
            </Button>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r min-h-[calc(100vh-73px)] p-6">
          <div className="space-y-2">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  step.current
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : step.completed
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                <step.icon className={`w-4 h-4 ${step.current ? 'text-primary' : ''}`} />
                <span className={`text-sm ${step.current ? 'font-medium' : ''}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-primary mb-2">
                Make house visits hassle-free by providing us your availability
              </h1>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Painting Service */}
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold mb-2">
                        Freshly painted homes get rented out{' '}
                        <span className="text-primary font-bold">73% faster</span>
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Get professional painting services at the best prices
                      </p>
                      <FormField
                        control={form.control}
                        name="paintingService"
                        render={({ field }) => (
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              className="bg-primary hover:bg-primary/90"
                              variant={field.value === 'book' ? 'default' : 'outline'}
                              onClick={() => field.onChange('book')}
                            >
                              Book Now
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === 'decline' ? 'default' : 'outline'}
                              onClick={() => field.onChange('decline')}
                            >
                              I Don't Want Painting
                            </Button>
                          </div>
                        )}
                      />
                    </div>
                    <div className="absolute right-4 top-4 w-20 h-20 bg-yellow-300 rounded-full opacity-50"></div>
                    <div className="absolute right-8 bottom-4 w-16 h-16 bg-yellow-400 rounded-full opacity-30"></div>
                  </div>

                  {/* Cleaning Service */}
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold mb-2">
                        Get your house tenant-ready with{' '}
                        <span className="text-primary font-bold">Deep Cleaning</span>
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Trusted by 50,000+ owners
                      </p>
                      <FormField
                        control={form.control}
                        name="cleaningService"
                        render={({ field }) => (
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              className="bg-primary hover:bg-primary/90"
                              variant={field.value === 'book' ? 'default' : 'outline'}
                              onClick={() => field.onChange('book')}
                            >
                              Book Now
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === 'decline' ? 'default' : 'outline'}
                              onClick={() => field.onChange('decline')}
                            >
                              I Don't Want Cleaning
                            </Button>
                          </div>
                        )}
                      />
                    </div>
                    <div className="absolute right-4 top-4 w-20 h-20 bg-teal-300 rounded-full opacity-50"></div>
                    <div className="absolute right-8 bottom-4 w-16 h-16 bg-teal-400 rounded-full opacity-30"></div>
                  </div>
                </div>

                {/* Availability Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Availability</h3>
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
                            <span className="font-semibold">Weekday</span>
                            <span className="text-xs text-muted-foreground">Mon-Fri</span>
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 'weekend' ? 'default' : 'outline'}
                            className="h-16 flex flex-col"
                            onClick={() => field.onChange('weekend')}
                          >
                            <span className="font-semibold">Weekend</span>
                            <span className="text-xs text-muted-foreground">Sat-Sun</span>
                          </Button>
                        </div>
                      )}
                    />
                  </div>

                  {/* Time Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select Time Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  type="time"
                                  placeholder="Start time"
                                  className="pl-10"
                                  disabled={watchAvailableAllDay}
                                  {...field}
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
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  type="time"
                                  placeholder="End time"
                                  className="pl-10"
                                  disabled={watchAvailableAllDay}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="availableAllDay"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Available All Day
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-8">
                  <Button type="button" variant="outline" onClick={onBack} className="px-8">
                    Back
                  </Button>
                  <Button type="submit" className="px-8 bg-destructive hover:bg-destructive/90">
                    Finish Posting
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};