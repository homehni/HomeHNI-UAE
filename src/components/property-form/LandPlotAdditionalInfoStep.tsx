import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdditionalInfo } from '@/types/property';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const additionalInfoSchema = z.object({
  ownership: z.enum(['freehold', 'leasehold', 'cooperative_society', 'power_of_attorney']),
  saleDeedCertificate: z.enum(['yes', 'no']),
  encumbranceCertificate: z.enum(['yes', 'no']),
  conversionCertificate: z.enum(['yes', 'no']),
  reraApproved: z.enum(['yes', 'no']),
});

type AdditionalInfoForm = z.infer<typeof additionalInfoSchema>;

interface LandPlotAdditionalInfoStepProps {
  initialData: Partial<AdditionalInfo>;
  onNext: (data: AdditionalInfoForm) => void;
  onBack: () => void;
}

export const LandPlotAdditionalInfoStep: React.FC<LandPlotAdditionalInfoStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const { handleSubmit, setValue, formState: { errors } } = useForm<AdditionalInfoForm>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      ownership: 'freehold',
      saleDeedCertificate: 'yes',
      encumbranceCertificate: 'yes',
      conversionCertificate: 'yes',
      reraApproved: 'yes',
    }
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Additional Information
        </CardTitle>
        <p className="text-gray-600">
          Provide additional details that will help buyers understand your land/plot better
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          <TooltipProvider>
            {/* Ownership Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Ownership</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="ownership-freehold"
                    name="ownership"
                    value="freehold"
                    onChange={() => setValue('ownership', 'freehold')}
                    className="w-4 h-4 text-red-600"
                    defaultChecked
                  />
                  <Label htmlFor="ownership-freehold" className="text-sm text-gray-700">
                    Freehold
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-teal-600" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border shadow-lg">
                      <p className="text-sm">Complete ownership of the property and land</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="ownership-leasehold"
                    name="ownership"
                    value="leasehold"
                    onChange={() => setValue('ownership', 'leasehold')}
                    className="w-4 h-4 text-red-600"
                  />
                  <Label htmlFor="ownership-leasehold" className="text-sm text-gray-700">
                    Leasehold
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-teal-600" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border shadow-lg">
                      <p className="text-sm">Property held under a lease agreement for a specific period</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="ownership-cooperative"
                    name="ownership"
                    value="cooperative_society"
                    onChange={() => setValue('ownership', 'cooperative_society')}
                    className="w-4 h-4 text-red-600"
                  />
                  <Label htmlFor="ownership-cooperative" className="text-sm text-gray-700">
                    Co-operative Society
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-teal-600" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border shadow-lg">
                      <p className="text-sm">Property owned through a cooperative housing society</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="ownership-poa"
                    name="ownership"
                    value="power_of_attorney"
                    onChange={() => setValue('ownership', 'power_of_attorney')}
                    className="w-4 h-4 text-red-600"
                  />
                  <Label htmlFor="ownership-poa" className="text-sm text-gray-700">
                    Power of Attorney
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-teal-600" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border shadow-lg">
                      <p className="text-sm">Property transferred through Power of Attorney</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Certificate Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sale Deed Certificate */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Do you have Sale Deed Certificate?
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-teal-600" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border shadow-lg">
                      <p className="text-sm">Legal document proving ownership of the property</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={(value) => setValue('saleDeedCertificate', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Encumbrance Certificate */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Do you have Encumbrance certificate?
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-teal-600" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border shadow-lg">
                      <p className="text-sm">Certificate showing property is free from legal dues</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={(value) => setValue('encumbranceCertificate', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conversion Certificate */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Do you have Conversion certificate?
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-teal-600" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border shadow-lg">
                      <p className="text-sm">Certificate for converting agricultural land to non-agricultural use</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={(value) => setValue('conversionCertificate', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* RERA Approved */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Is the property RERA Approved?
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-teal-600" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border shadow-lg">
                      <p className="text-sm">Real Estate Regulatory Authority approval for the project</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={(value) => setValue('reraApproved', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TooltipProvider>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Next: Schedule Viewing
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};