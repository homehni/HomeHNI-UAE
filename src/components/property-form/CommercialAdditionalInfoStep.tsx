import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdditionalInfo } from '@/types/property';

const commercialAdditionalInfoSchema = z.object({
  description: z.string().optional(),
  previousOccupancy: z.string().optional(),
  whoWillShow: z.string().optional(),
  paintingRequired: z.string().optional(),
  cleaningRequired: z.string().optional(),
  secondaryNumber: z.string().optional(),
});

type CommercialAdditionalInfoForm = z.infer<typeof commercialAdditionalInfoSchema>;

interface CommercialAdditionalInfoStepProps {
  initialData?: Partial<AdditionalInfo>;
  onNext: (data: AdditionalInfo) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const CommercialAdditionalInfoStep: React.FC<CommercialAdditionalInfoStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<CommercialAdditionalInfoForm>({
    resolver: zodResolver(commercialAdditionalInfoSchema),
    defaultValues: {
      description: initialData.description || '',
      previousOccupancy: initialData.previousOccupancy || '',
      whoWillShow: initialData.whoWillShow || '',
      paintingRequired: initialData.paintingRequired || '',
      cleaningRequired: initialData.cleaningRequired || '',
      secondaryNumber: initialData.secondaryNumber || '',
    },
  });

  const onSubmit = (data: CommercialAdditionalInfoForm) => {
    onNext(data as AdditionalInfo);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-primary mb-6">Commercial Additional Information</h1>
        
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
                      placeholder="Describe your commercial property, its features, and what makes it special..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Previous Occupancy and Who Will Show */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="previousOccupancy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Previous Occupancy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Previous Occupancy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Never Rented">Never Rented</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Retail Store">Retail Store</SelectItem>
                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whoWillShow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Who Will Show the Property</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Who Will Show" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="I will show myself">I will show myself</SelectItem>
                        <SelectItem value="Building Security">Building Security</SelectItem>
                        <SelectItem value="Property Manager">Property Manager</SelectItem>
                        <SelectItem value="Agent">Agent</SelectItem>
                        <SelectItem value="Caretaker">Caretaker</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Services Required */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="paintingRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Painting Required</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Painting Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="No">No Painting Required</SelectItem>
                        <SelectItem value="Minor Touch-up">Minor Touch-up</SelectItem>
                        <SelectItem value="Full Painting">Full Painting Required</SelectItem>
                        <SelectItem value="Fresh Painting Done">Fresh Painting Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cleaningRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Cleaning Required</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Cleaning Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="No">No Cleaning Required</SelectItem>
                        <SelectItem value="Light Cleaning">Light Cleaning</SelectItem>
                        <SelectItem value="Deep Cleaning">Deep Cleaning Required</SelectItem>
                        <SelectItem value="Sanitized">Recently Sanitized</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Secondary Contact */}
            <FormField
              control={form.control}
              name="secondaryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Secondary Contact Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter secondary contact number"
                      className="h-12"
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(value);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="px-8 py-2"
              >
                Back
              </Button>
              
              <Button 
                type="submit"
                className="px-8 py-2 bg-primary text-white hover:bg-primary/90"
              >
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};