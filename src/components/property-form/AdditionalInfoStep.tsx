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
    <div className="ml-80 p-6 space-y-8">
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
  );
};