import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyDraft } from '@/types/propertyDraft';

const ownerInfoSchema = z.object({
  owner_name: z.string().min(1, 'Full name is required'),
  owner_phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  owner_email: z.string().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "Please enter a valid email address"
  }).optional(),
  owner_role: z.enum(['owner', 'agent', 'builder'])
});

type OwnerInfoFormData = z.infer<typeof ownerInfoSchema>;

interface OwnerInfoStepProps {
  data: Partial<PropertyDraft>;
  onNext: (data: Partial<PropertyDraft>) => void;
}

export const OwnerInfoStep = ({ data, onNext }: OwnerInfoStepProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<OwnerInfoFormData>({
    resolver: zodResolver(ownerInfoSchema),
    mode: 'onSubmit',
    defaultValues: {
      owner_name: data.owner_name || '',
      owner_phone: data.owner_phone || '',
      owner_email: data.owner_email || '',
      owner_role: data.owner_role || 'owner'
    }
  });

  console.log('OwnerInfoStep: Current form errors:', errors);
  console.log('OwnerInfoStep: Form is valid:', isValid);
  console.log('OwnerInfoStep: Current form values:', watch());

  const onSubmit = (formData: OwnerInfoFormData) => {
    console.log('OwnerInfoStep: Form validation passed!');
    console.log('OwnerInfoStep: Form data:', formData);
    console.log('OwnerInfoStep: Form errors:', errors);
    console.log('OwnerInfoStep: Is form valid:', isValid);
    
    const submitData = {
      ...formData,
      step_completed: 1
    };
    
    console.log('OwnerInfoStep: Final submit data:', submitData);
    console.log('OwnerInfoStep: Calling onNext...');
    
    onNext(submitData);
    
    console.log('OwnerInfoStep: onNext called successfully');
  };

  const ownerRole = watch('owner_role');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Owner Information</CardTitle>
        <p className="text-muted-foreground">
          Please provide your contact details and role
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, (errors) => console.log('Form validation errors:', errors))} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="owner_name">Full Name *</Label>
            <Input
              id="owner_name"
              {...register('owner_name')}
              placeholder="Enter your full name"
              className={errors.owner_name ? 'border-destructive' : ''}
            />
            {errors.owner_name && (
              <p className="text-sm text-destructive">{errors.owner_name.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="owner_phone">Phone Number *</Label>
            <Input
              id="owner_phone"
              type="tel"
              {...register('owner_phone')}
              placeholder="Enter your phone number"
              className={errors.owner_phone ? 'border-destructive' : ''}
            />
            {errors.owner_phone && (
              <p className="text-sm text-destructive">{errors.owner_phone.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="owner_email">Email Address (Optional)</Label>
            <Input
              id="owner_email"
              type="email"
              {...register('owner_email')}
              placeholder="Enter your email address"
              className={errors.owner_email ? 'border-destructive' : ''}
            />
            {errors.owner_email && (
              <p className="text-sm text-destructive">{String(errors.owner_email.message)}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-3">
            <Label>Role *</Label>
            <RadioGroup
              value={ownerRole}
              onValueChange={(value) => setValue('owner_role', value as 'owner' | 'agent' | 'builder')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">Owner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="agent" id="agent" />
                <Label htmlFor="agent">Agent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="builder" id="builder" />
                <Label htmlFor="builder">Builder</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="px-8"
            >
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};