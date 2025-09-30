import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LandPlotDetails } from '@/types/landPlotProperty';

const landPlotDetailsSchema = z.object({
  plotArea: z.number().optional().or(z.nan()).transform(val => isNaN(val) ? undefined : val),
  plotAreaUnit: z.enum(['sq-ft', 'sq-yard', 'sq-m', 'acre', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'gunta', 'aankadam', 'hectare', 'chataks', 'perch']).optional(),
  plotLength: z.number().optional().or(z.nan()).transform(val => isNaN(val) ? undefined : val),
  plotWidth: z.number().optional().or(z.nan()).transform(val => isNaN(val) ? undefined : val),
  boundaryWall: z.enum(['yes', 'no', 'partial']).optional(),
  floorsAllowed: z.number().optional().or(z.nan()).transform(val => isNaN(val) ? undefined : val),
  gatedProject: z.enum(['yes', 'no']).optional(),
  gatedCommunity: z.boolean().optional(),
  surveyNumber: z.string().optional(),
  subDivision: z.string().optional(),
  villageName: z.string().optional(),
});

type LandPlotDetailsForm = z.infer<typeof landPlotDetailsSchema>;

interface LandPlotPropertyDetailsStepProps {
  initialData: Partial<LandPlotDetails>;
  onNext: (data: LandPlotDetailsForm) => void;
  onBack: () => void;
  listingType?: 'Industrial land' | 'Agricultural Land' | 'Commercial land';
}

export const LandPlotPropertyDetailsStep: React.FC<LandPlotPropertyDetailsStepProps> = ({
  initialData,
  onNext,
  onBack,
  listingType,
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LandPlotDetailsForm>({
    resolver: zodResolver(landPlotDetailsSchema),
    defaultValues: {
      ...initialData,
      plotArea: initialData.plotArea || undefined,
      plotLength: initialData.plotLength || undefined,
      plotWidth: initialData.plotWidth || undefined,
      floorsAllowed: undefined,
      gatedProject: 'no',
      gatedCommunity: initialData.gatedCommunity || false,
      plotAreaUnit: initialData.plotAreaUnit || 'sq-ft',
    }
  });

  const plotAreaUnit = watch('plotAreaUnit');

  const onSubmit = (data: LandPlotDetailsForm) => {
    console.log('Form submission data:', data);
    onNext(data);
  };

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8 pt-4 md:pt-0">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Land/Plot Details</h2>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
          {/* Property Title */}
          {/* <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Property Title *
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="e.g., Residential Plot in Prime Location"
              className="w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div> */}

          {/* Plot Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plotArea" className="text-sm font-medium text-gray-700">
                Plot Area
              </Label>
              <div className="flex gap-2">
                <Input
                  id="plotArea"
                  type="number"
                  min="1"
                  {...register('plotArea', { 
                    valueAsNumber: true,
                    min: { value: 1, message: "Plot area must be at least 1" }
                  })}
                  onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                  onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); } }}
                  placeholder="e.g., 1200"
                  className="h-12 flex-1 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
                <Select onValueChange={(value) => setValue('plotAreaUnit', value as any)} defaultValue="sq-ft">
                  <SelectTrigger className="h-12 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sq-ft">sq.ft.</SelectItem>
                    <SelectItem value="sq-yard">sq.yard</SelectItem>
                    <SelectItem value="sq-m">sq.m.</SelectItem>
                    <SelectItem value="acre">acres</SelectItem>
                    <SelectItem value="marla">marla</SelectItem>
                    <SelectItem value="cents">cents</SelectItem>
                    <SelectItem value="bigha">bigha</SelectItem>
                    <SelectItem value="kottah">kottah</SelectItem>
                    <SelectItem value="kanal">kanal</SelectItem>
                    <SelectItem value="grounds">grounds</SelectItem>
                    <SelectItem value="ares">ares</SelectItem>
                    <SelectItem value="biswa">biswa</SelectItem>
                    <SelectItem value="gunta">gunta</SelectItem>
                    <SelectItem value="aankadam">aankadam</SelectItem>
                    <SelectItem value="hectare">hectares</SelectItem>
                    <SelectItem value="chataks">chataks</SelectItem>
                    <SelectItem value="perch">perch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.plotArea && (
                <p className="text-red-500 text-sm">{errors.plotArea.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="boundaryWall" className="text-sm font-medium text-gray-700">
                Boundary Wall
              </Label>
              <Select onValueChange={(value) => setValue('boundaryWall', value as any)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select boundary wall status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes - Complete</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Plot Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plotLength" className="text-sm font-medium text-gray-700">
                 Length (ft)
              </Label>
              <Input
                id="plotLength"
                type="number"
                min="1"
                {...register('plotLength', { 
                  valueAsNumber: true,
                  min: { value: 1, message: "Plot length must be at least 1" }
                })}
                onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); } }}
                placeholder="e.g., 60"
                className="h-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plotWidth" className="text-sm font-medium text-gray-700">
                Width (ft)
              </Label>
              <Input
                id="plotWidth"
                type="number"
                min="1"
                {...register('plotWidth', { 
                  valueAsNumber: true,
                  min: { value: 1, message: "Plot width must be at least 1" }
                })}
                onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); } }}
                placeholder="e.g., 40"
                className="h-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          {/* Land Type & Road Details */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landType" className="text-sm font-medium text-gray-700">
                Land Type *
              </Label>
              <Select onValueChange={(value) => setValue('landType', value as any)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select land type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="agricultural">Agricultural</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="institutional">Institutional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roadFacing" className="text-sm font-medium text-gray-700">
                Road Facing *
              </Label>
              <Select onValueChange={(value) => setValue('roadFacing', value as any)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select road facing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="north-east">North-East</SelectItem>
                  <SelectItem value="north-west">North-West</SelectItem>
                  <SelectItem value="south-east">South-East</SelectItem>
                  <SelectItem value="south-west">South-West</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          {/* Floors Allowed and Gated Project */}
          <div className={`grid grid-cols-1 ${listingType === 'Agricultural Land' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
            {listingType !== 'Agricultural Land' && (
              <div className="space-y-2">
                <Label htmlFor="floorsAllowed" className="text-sm font-medium text-gray-700">
                  Floors allowed for construction
                </Label>
                <Input
                  id="floorsAllowed"
                  type="number"
                  min="1"
                  {...register('floorsAllowed', { 
                    valueAsNumber: true,
                    min: { value: 1, message: "Floors allowed must be at least 1" }
                  })}
                  onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                  onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); } }}
                  placeholder="3"
                  className="h-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
                {errors.floorsAllowed && (
                  <p className="text-red-500 text-sm">{errors.floorsAllowed.message}</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Is the Land/Plot inside a gated project?
              </Label>
              <Select onValueChange={(value) => setValue('gatedProject', value as any)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        {/* Navigation Buttons - Removed, using sticky buttons instead */}
        </form>
      </div>
  );
};