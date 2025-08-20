import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AdditionalInfo } from '@/types/property';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Phone } from 'lucide-react';

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
  currentStep?: number;
  totalSteps?: number;
}

export const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep = 6,
  totalSteps = 8
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

  const steps = [
    { number: 1, title: "Property Details", icon: Home, active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, title: "Location Details", icon: MapPin, active: currentStep === 2, completed: currentStep > 2 },
    { number: 3, title: "Rental Details", icon: Building, active: currentStep === 3, completed: currentStep > 3 },
    { number: 4, title: "Amenities", icon: Sparkles, active: currentStep === 4, completed: currentStep > 4 },
    { number: 5, title: "Photos & Videos", icon: Camera, active: currentStep === 5, completed: currentStep > 5 },
    { number: 6, title: "Additional Info", icon: FileText, active: currentStep === 6, completed: currentStep > 6 },
    { number: 7, title: "Schedule", icon: Calendar, active: currentStep === 7, completed: currentStep > 7 },
    { number: 8, title: "Preview & Submit", icon: Phone, active: currentStep === 8, completed: currentStep > 8 },
  ];

  return (
    <div className="flex">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-52 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-6">
          <nav className="space-y-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    step.active 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
                      : step.completed 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-gray-500'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.active 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : step.completed 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 bg-white'
                  }`}>
                    {step.completed ? (
                      <span className="text-xs">✓</span>
                    ) : (
                      <span className="text-xs">{step.number}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step.title}</div>
                  </div>
                </div>
              );
            })}
          </nav>
          
          {/* Help Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm text-gray-900 mb-2">Need Help?</h3>
            <p className="text-xs text-gray-600 mb-3">
              Contact our support team for assistance with your property listing.
            </p>
            <Button variant="outline" size="sm" className="w-full text-xs">
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-semibold text-primary mb-6">Additional Information</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Property Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Property Description</FormLabel>
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
                        <FormLabel className="text-sm font-medium">Previous Occupancy</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
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
                        <FormLabel className="text-sm font-medium">Who will show the property?*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
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
                        <FormLabel className="text-sm font-medium">I want to get my property painted</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
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
                        <FormLabel className="text-sm font-medium">I want to get my property cleaned</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
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
                      <FormLabel className="text-sm font-medium">Secondary Number</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted h-12">
                            <span className="text-sm">🇮🇳</span>
                            <span className="ml-2 text-sm">+91</span>
                          </div>
                          <Input
                            placeholder="Secondary Number"
                            className="rounded-l-none h-12"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={onBack} className="h-12 px-8">
                    Back
                  </Button>
                  <Button type="submit" className="h-12 px-8">
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