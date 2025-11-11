import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AdditionalInfo } from '@/types/property';

const commercialAdditionalInfoSchema = z.object({
  description: z.string().optional(),
  previousOccupancy: z.string().min(1, 'Please select previous occupancy'),
  paintingRequired: z.string().optional(),
  cleaningRequired: z.string().optional(),
});

type CommercialAdditionalInfoForm = z.infer<typeof commercialAdditionalInfoSchema>;

interface CommercialAdditionalInfoStepProps {
  initialData?: Partial<AdditionalInfo>;
  onNext: (data: AdditionalInfo) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialAdditionalInfoStep: React.FC<CommercialAdditionalInfoStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const form = useForm<CommercialAdditionalInfoForm>({
    resolver: zodResolver(commercialAdditionalInfoSchema),
    defaultValues: {
      description: initialData.description || '',
      previousOccupancy: initialData.previousOccupancy || '',
      paintingRequired: initialData.paintingRequired || '',
      cleaningRequired: initialData.cleaningRequired || '',
    },
  });

  const onSubmit = (data: CommercialAdditionalInfoForm) => {
    onNext(data as AdditionalInfo);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-primary mb-6">Additional Information</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your property in detail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                          <SelectValue placeholder="Select Previous Occupancy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bachelor">Bachelor</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Company">Company</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between" style={{ visibility: 'hidden' }}>
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">
                Next: Schedule ({currentStep + 1}/{totalSteps})
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
