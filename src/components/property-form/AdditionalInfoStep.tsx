import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AdditionalInfo } from '@/types/property';

const additionalInfoSchema = z.object({
  description: z.string().optional(),
  specialFeatures: z.array(z.string()),
  onMainRoad: z.boolean(),
  cornerProperty: z.boolean(),
  gatedSociety: z.boolean(),
});

interface AdditionalInfoStepProps {
  initialData?: Partial<AdditionalInfo>;
  onNext: (data: AdditionalInfo) => void;
  onBack: () => void;
}

const specialFeaturesList = [
  'Servant Room', 'Study Room', 'Pooja Room', 'Store Room',
  'Home Theater', 'Intercom Facility', 'Private Garden/Terrace',
  'Swimming Pool', 'Water Purifier', 'Modular Kitchen'
];

export const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<AdditionalInfo>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      description: initialData.description || '',
      specialFeatures: initialData.specialFeatures || [],
      onMainRoad: initialData.onMainRoad || false,
      cornerProperty: initialData.cornerProperty || false,
      gatedSociety: initialData.gatedSociety || false,
    },
  });

  const onSubmit = (data: AdditionalInfo) => {
    onNext(data);
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const currentFeatures = form.getValues('specialFeatures');
    if (checked) {
      form.setValue('specialFeatures', [...currentFeatures, feature]);
    } else {
      form.setValue('specialFeatures', currentFeatures.filter(f => f !== feature));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
        <CardDescription>Add more details about your property</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your property in detail. Mention unique features, nearby landmarks, and what makes it special..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Special Features</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {specialFeaturesList.map((feature) => (
                      <FormItem
                        key={feature}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(feature)}
                            onCheckedChange={(checked) =>
                              handleFeatureChange(feature, checked as boolean)
                            }
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {feature}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="text-lg font-semibold">Property Highlights</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="onMainRoad"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        On Main Road
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cornerProperty"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Corner Property
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gatedSociety"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Gated Society
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">
                Next: Preview & Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};