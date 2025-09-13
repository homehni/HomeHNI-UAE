import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdditionalInfo } from '@/types/property';

const formSchema = z.object({
  description: z.string().optional(),
  previousOccupancy: z.string().optional(),
  paintingRequired: z.string().optional(),
  cleaningRequired: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AdditionalInfoStepProps {
  initialData?: Partial<AdditionalInfo>;
  onNext: (data: AdditionalInfo) => void;
  onBack: () => void;
}

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
      paintingRequired: initialData.paintingRequired || '',
      cleaningRequired: initialData.cleaningRequired || '',
    },
  });

  const onSubmit = (data: FormData) => {
    onNext(data as AdditionalInfo);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
        <p className="text-gray-600">Provide additional details about your property</p>
      </div>

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

        </form>
      </Form>
    </div>
  );
};