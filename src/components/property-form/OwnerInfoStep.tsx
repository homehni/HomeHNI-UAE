import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ownerInfoSchema, OwnerInfoFormData } from '@/schemas/propertyValidation';
import { OwnerInfo } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OwnerInfoStepProps {
  initialData: Partial<OwnerInfo>;
  onNext: (data: OwnerInfo) => void;
}

export const OwnerInfoStep: React.FC<OwnerInfoStepProps> = ({
  initialData,
  onNext
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors, touchedFields }
  } = useForm<OwnerInfoFormData>({
    resolver: zodResolver(ownerInfoSchema),
    defaultValues: initialData,
    mode: 'onTouched' // Only show errors after user interaction
  });

  const selectedRole = watch('role');
  const formValues = watch();

  // Auto-fill detection and validation
  useEffect(() => {
    const detectAutoFill = () => {
      trigger(); // Trigger validation after potential auto-fill
    };

    const timer = setTimeout(detectAutoFill, 100);
    return () => clearTimeout(timer);
  }, [trigger]);

  // Custom validation check for button state
  const isFormValid = () => {
    const values = getValues();
    return !!(values.fullName && values.phoneNumber && values.email && values.role);
  };

  const handleBlur = () => {
    trigger(); // Validate on blur to catch auto-filled values
  };

  const onSubmit = (data: OwnerInfoFormData) => {
    onNext(data as OwnerInfo);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-primary">Owner Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder="Enter your full name"
              className={errors.fullName ? 'border-destructive' : ''}
              onBlur={handleBlur}
              onInput={handleBlur}
              autoComplete="name"
            />
            {errors.fullName && touchedFields.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              {...register('phoneNumber')}
              placeholder="Enter your phone number"
              className={errors.phoneNumber ? 'border-destructive' : ''}
              onBlur={handleBlur}
              onInput={handleBlur}
              autoComplete="tel"
            />
            {errors.phoneNumber && touchedFields.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email address"
              className={errors.email ? 'border-destructive' : ''}
              onBlur={handleBlur}
              onInput={handleBlur}
              autoComplete="email"
            />
            {errors.email && touchedFields.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Role *</Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setValue('role', value as 'Owner' | 'Agent' | 'Builder')}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Owner" id="owner" />
                <Label htmlFor="owner">Owner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agent" id="agent" />
                <Label htmlFor="agent">Agent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Builder" id="builder" />
                <Label htmlFor="builder">Builder</Label>
              </div>
            </RadioGroup>
            {errors.role && touchedFields.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="bg-primary hover:bg-primary/90"
            >
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};