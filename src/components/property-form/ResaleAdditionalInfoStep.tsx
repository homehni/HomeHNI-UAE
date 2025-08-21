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
  allotmentLetter: z.string().optional(),
  saleDeedCertificate: z.string().optional(),
  propertyTaxPaid: z.string().optional(),
  occupancyCertificate: z.string().optional(),
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
      allotmentLetter: '',
      saleDeedCertificate: '',
      propertyTaxPaid: '',
      occupancyCertificate: '',
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Allotment Letter */}
              <FormField
                control={form.control}
                name="allotmentLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Do You have Allotment Letter?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Sale Deed Certificate */}
              <FormField
                control={form.control}
                name="saleDeedCertificate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Do You have Sale Deed Certificate?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Property Tax Paid */}
              <FormField
                control={form.control}
                name="propertyTaxPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Have you paid Property Tax?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Occupancy Certificate */}
              <FormField
                control={form.control}
                name="occupancyCertificate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Do You have Occupancy Certificate?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

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