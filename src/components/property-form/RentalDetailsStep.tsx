import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RentalDetails } from '@/types/property';

const rentalDetailsSchema = z.object({
  listingType: z.enum(['Sale', 'Rent']),
  expectedPrice: z.number().min(1, 'Price is required'),
  maintenanceCharges: z.number().optional(),
  securityDeposit: z.number().optional(),
  brokerageType: z.string().optional(),
  availableFrom: z.string().optional(),
  preferredTenants: z.string().optional(),
  superArea: z.number().min(1, 'Super area is required'),
  carpetArea: z.number().optional(),
  builtUpArea: z.number().optional(),
});

interface RentalDetailsStepProps {
  initialData?: Partial<RentalDetails>;
  onNext: (data: RentalDetails) => void;
  onBack: () => void;
}

export const RentalDetailsStep: React.FC<RentalDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<RentalDetails>({
    resolver: zodResolver(rentalDetailsSchema),
    defaultValues: {
      listingType: initialData.listingType || 'Rent',
      expectedPrice: initialData.expectedPrice || 0,
      maintenanceCharges: initialData.maintenanceCharges || 0,
      securityDeposit: initialData.securityDeposit || 0,
      brokerageType: initialData.brokerageType || '',
      availableFrom: initialData.availableFrom || '',
      preferredTenants: initialData.preferredTenants || '',
      superArea: initialData.superArea || 0,
      carpetArea: initialData.carpetArea || 0,
      builtUpArea: initialData.builtUpArea || 0,
    },
  });

  const listingType = form.watch('listingType');

  const onSubmit = (data: RentalDetails) => {
    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental Details</CardTitle>
        <CardDescription>Set your pricing and rental preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="listingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Listing Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Rent">For Rent</SelectItem>
                      <SelectItem value="Sale">For Sale</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expectedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {listingType === 'Sale' ? 'Expected Price (₹)' : 'Monthly Rent (₹)'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder={listingType === 'Sale' ? '50,00,000' : '25,000'}
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {listingType === 'Rent' && (
                <FormField
                  control={form.control}
                  name="securityDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Deposit (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="50,000"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {listingType === 'Rent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maintenanceCharges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance Charges (₹/month)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2,000"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available From</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Immediately">Immediately</SelectItem>
                          <SelectItem value="Within 15 days">Within 15 days</SelectItem>
                          <SelectItem value="Within 30 days">Within 30 days</SelectItem>
                          <SelectItem value="After 30 days">After 30 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {listingType === 'Rent' && (
              <FormField
                control={form.control}
                name="preferredTenants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Tenants</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenant preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Any">Any</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Working Professional">Working Professional</SelectItem>
                        <SelectItem value="Students">Students</SelectItem>
                        <SelectItem value="Bachelor">Bachelor</SelectItem>
                        <SelectItem value="Company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Area Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="superArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Super Built-up Area (sq ft)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1200"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carpetArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carpet Area (sq ft)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1000"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="builtUpArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Built-up Area (sq ft)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1100"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="brokerageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brokerage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brokerage type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="No Brokerage">No Brokerage</SelectItem>
                      <SelectItem value="1 Month">1 Month</SelectItem>
                      <SelectItem value="2 Months">2 Months</SelectItem>
                      <SelectItem value="Negotiable">Negotiable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">
                Next: Amenities
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};