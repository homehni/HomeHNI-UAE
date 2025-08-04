import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Phone } from 'lucide-react';
import { AdditionalInfo } from '@/types/property';

const formSchema = z.object({
  description: z.string().optional(),
  previousOccupancy: z.string().optional(),
  whoWillShow: z.string().optional(),
  paintingRequired: z.string().optional(),
  cleaningRequired: z.string().optional(),
  secondaryNumber: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AdditionalInfoStepProps {
  initialData?: Partial<AdditionalInfo>;
  onNext: (data: AdditionalInfo) => void;
  onBack: () => void;
}

const steps = [
  { number: 1, title: "Property Details", icon: Home, completed: true },
  { number: 2, title: "Location Details", icon: MapPin, completed: true },
  { number: 3, title: "Rental Details", icon: Building, completed: true },
  { number: 4, title: "Amenities", icon: Sparkles, completed: true },
  { number: 5, title: "Gallery", icon: Camera, completed: true },
  { number: 6, title: "Additional Information", icon: FileText, completed: false, current: true },
  { number: 7, title: "Schedule", icon: Calendar, completed: false },
];

export const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || '',
      previousOccupancy: initialData.previousOccupancy || '',
      whoWillShow: initialData.whoWillShow || '',
      paintingRequired: initialData.paintingRequired || '',
      cleaningRequired: initialData.cleaningRequired || '',
      secondaryNumber: initialData.secondaryNumber || '',
    },
  });

  const onSubmit = (data: FormData) => {
    onNext(data as AdditionalInfo);
  };

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
            <span className="text-sm text-muted-foreground">80% Done</span>
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
          <div className="max-w-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-foreground mb-2">Additional Information</h1>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Property Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Property Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide any specific description you want to add about your property like furnishing and other amenities..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Previous Occupancy */}
                  <FormField
                    control={form.control}
                    name="previousOccupancy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Previous Occupancy</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bachelor">Bachelor</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Who will show */}
                  <FormField
                    control={form.control}
                    name="whoWillShow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Who will show the property?*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="I will show" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="owner">I will show</SelectItem>
                            <SelectItem value="agent">Agent will show</SelectItem>
                            <SelectItem value="tenant">Current tenant will show</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Painting */}
                  <FormField
                    control={form.control}
                    name="paintingRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">I want to get my property painted</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="already-done">Already Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Cleaning */}
                  <FormField
                    control={form.control}
                    name="cleaningRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">I want to get my property cleaned</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="already-done">Already Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Secondary Number */}
                <FormField
                  control={form.control}
                  name="secondaryNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Secondary Number</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                            <span className="text-sm">🇮🇳</span>
                            <span className="ml-2 text-sm">+91</span>
                          </div>
                          <Input
                            placeholder="Secondary Number"
                            className="rounded-l-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator className="my-8" />

                {/* Action Buttons */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={onBack} className="px-8">
                    Back
                  </Button>
                  <Button type="submit" className="px-8">
                    Save & Continue
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