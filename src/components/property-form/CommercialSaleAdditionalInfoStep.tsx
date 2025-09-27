import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { AdditionalInfo } from '@/types/property';

const commercialSaleAdditionalInfoSchema = z.object({
  description: z.string().optional(),
  previousOccupancy: z.string().optional(),
  paintingRequired: z.string().optional(),
  cleaningRequired: z.string().optional(),
});

type CommercialSaleAdditionalInfoForm = z.infer<typeof commercialSaleAdditionalInfoSchema>;

interface CommercialSaleAdditionalInfoStepProps {
  initialData?: Partial<AdditionalInfo>;
  onNext: (data: Partial<AdditionalInfo>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialSaleAdditionalInfoStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: CommercialSaleAdditionalInfoStepProps) => {
  const form = useForm<CommercialSaleAdditionalInfoForm>({
    resolver: zodResolver(commercialSaleAdditionalInfoSchema),
    defaultValues: {
      description: initialData?.description || '',
      previousOccupancy: initialData?.previousOccupancy || '',
      paintingRequired: initialData?.paintingRequired || '',
      cleaningRequired: initialData?.cleaningRequired || '',
    },
  });

  const onSubmit = (data: CommercialSaleAdditionalInfoForm) => {
    onNext(data);
  };

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8">
        <h1 className="text-2xl font-semibold text-red-600 mb-2 pt-6 sm:pt-6">Additional Information</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your commercial property, its unique features, location advantages, etc."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="previousOccupancy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Occupancy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occupancy type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="owner-occupied">Owner Occupied</SelectItem>
                      <SelectItem value="tenant-occupied">Tenant Occupied</SelectItem>
                      <SelectItem value="vacant">Vacant</SelectItem>
                      <SelectItem value="under-construction">Under Construction</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paintingRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Painting Required?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select painting requirement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="fresh-paint">Freshly Painted</SelectItem>
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
                  <FormLabel>Cleaning Required?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cleaning requirement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="deep-cleaning">Deep Cleaning</SelectItem>
                      <SelectItem value="ready-to-move">Ready to Move</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};