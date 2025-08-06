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

const resaleAdditionalInfoSchema = z.object({
  description: z.string().optional(),
  previousOccupancy: z.string().optional(),
  whoWillShow: z.string().optional(),
  paintingRequired: z.string().optional(),
  cleaningRequired: z.string().optional(),
  secondaryNumber: z.string().optional(),
});

type ResaleAdditionalInfoData = z.infer<typeof resaleAdditionalInfoSchema>;

interface ResaleAdditionalInfoStepProps {
  initialData?: Partial<AdditionalInfo>;
  onNext: (data: AdditionalInfo) => void;
  onBack: () => void;
}

export const ResaleAdditionalInfoStep: React.FC<ResaleAdditionalInfoStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<ResaleAdditionalInfoData>({
    resolver: zodResolver(resaleAdditionalInfoSchema),
    defaultValues: {
      description: initialData.description || '',
      previousOccupancy: initialData.previousOccupancy || '',
      whoWillShow: initialData.whoWillShow || '',
      paintingRequired: initialData.paintingRequired || '',
      cleaningRequired: initialData.cleaningRequired || '',
      secondaryNumber: initialData.secondaryNumber || '',
    },
  });

  const onSubmit = (data: ResaleAdditionalInfoData) => {
    onNext(data as AdditionalInfo);
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-background rounded-lg border p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Additional Information</h2>
          <p className="text-muted-foreground">Help buyers learn more about your property</p>
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
                      placeholder="Describe your property's key features, nearby amenities, or any special highlights that would interest buyers..."
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
                    <FormLabel className="text-base font-medium">Current/Previous Occupancy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="owner-occupied">Owner Occupied</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="bachelor">Bachelor</SelectItem>
                        <SelectItem value="vacant">Vacant</SelectItem>
                        <SelectItem value="under-construction">Under Construction</SelectItem>
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
                    <FormLabel className="text-base font-medium">Who will show the property? *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="I will show" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="owner">I will show</SelectItem>
                        <SelectItem value="agent">Agent will show</SelectItem>
                        <SelectItem value="caretaker">Caretaker will show</SelectItem>
                        <SelectItem value="occupant">Current occupant will show</SelectItem>
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
                    <FormLabel className="text-base font-medium">Property painting status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="recently-painted">Recently Painted</SelectItem>
                        <SelectItem value="good-condition">Good Paint Condition</SelectItem>
                        <SelectItem value="needs-touch-up">Needs Touch-up</SelectItem>
                        <SelectItem value="needs-repainting">Needs Complete Repainting</SelectItem>
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
                    <FormLabel className="text-base font-medium">Property cleaning status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="well-maintained">Well Maintained</SelectItem>
                        <SelectItem value="regular-cleaning">Regular Cleaning Done</SelectItem>
                        <SelectItem value="needs-cleaning">Needs Cleaning</SelectItem>
                        <SelectItem value="deep-cleaning-required">Deep Cleaning Required</SelectItem>
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
                  <FormLabel className="text-base font-medium">Secondary Contact Number</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                        <span className="text-sm">🇮🇳</span>
                        <span className="ml-2 text-sm">+91</span>
                      </div>
                      <Input
                        placeholder="Secondary Contact Number"
                        className="rounded-l-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="bg-muted text-muted-foreground">
                Back
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};