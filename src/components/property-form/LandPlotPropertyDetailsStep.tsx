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
  // title: z.string().min(1, 'Property title is required'),
  plotArea: z.number().min(1, 'Plot area is required'),
  plotAreaUnit: z.enum(['sq-ft', 'sq-yard', 'acre', 'hectare', 'bigha', 'biswa']),
  plotLength: z.number().optional(),
  plotWidth: z.number().optional(),
  boundaryWall: z.enum(['yes', 'no', 'partial']),
  // cornerPlot: z.boolean(),
  // roadFacing: z.enum(['east', 'west', 'north', 'south', 'north-east', 'north-west', 'south-east', 'south-west']),
  // roadWidth: z.number().min(1, 'Road width is required'),
  // landType: z.enum(['residential', 'commercial', 'agricultural', 'industrial', 'institutional']),
  // plotShape: z.enum(['regular', 'irregular']),
  gatedCommunity: z.boolean(),
  surveyNumber: z.string().optional(),
  subDivision: z.string().optional(),
  villageName: z.string().optional(),
});

type LandPlotDetailsForm = z.infer<typeof landPlotDetailsSchema>;

interface LandPlotPropertyDetailsStepProps {
  initialData: Partial<LandPlotDetails>;
  onNext: (data: LandPlotDetailsForm) => void;
  onBack: () => void;
}

export const LandPlotPropertyDetailsStep: React.FC<LandPlotPropertyDetailsStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LandPlotDetailsForm>({
    resolver: zodResolver(landPlotDetailsSchema),
    defaultValues: {
      ...initialData,
      plotArea: initialData.plotArea || undefined,
      plotLength: initialData.plotLength || undefined,
      plotWidth: initialData.plotWidth || undefined,
      gatedCommunity: initialData.gatedCommunity || false,
    }
  });

  const plotAreaUnit = watch('plotAreaUnit');

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Land/Plot Details
        </CardTitle>
        <p className="text-gray-600">
          Enter the basic details about your land/plot
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
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
                Plot Area (sq.ft)*
              </Label>
              <Input
                id="plotArea"
                type="number"
                {...register('plotArea', { valueAsNumber: true })}
                placeholder="e.g., 1200"
                className="w-full"
              />
              {errors.plotArea && (
                <p className="text-red-500 text-sm">{errors.plotArea.message}</p>
              )}
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="plotAreaUnit" className="text-sm font-medium text-gray-700">
                Unit *
              </Label>
              <Select onValueChange={(value) => setValue('plotAreaUnit', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sq-ft">Square Feet</SelectItem>
                  <SelectItem value="sq-yard">Square Yard</SelectItem>
                  <SelectItem value="acre">Acre</SelectItem>
                  <SelectItem value="hectare">Hectare</SelectItem>
                  <SelectItem value="bigha">Bigha</SelectItem>
                  <SelectItem value="biswa">Biswa</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
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
                {...register('plotLength', { valueAsNumber: true })}
                placeholder="e.g., 60"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plotWidth" className="text-sm font-medium text-gray-700">
                Width (ft)
              </Label>
              <Input
                id="plotWidth"
                type="number"
                {...register('plotWidth', { valueAsNumber: true })}
                placeholder="e.g., 40"
                className="w-full"
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
                <SelectTrigger>
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
                <SelectTrigger>
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

          {/* Road Width & Boundary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div className="space-y-2">
              <Label htmlFor="roadWidth" className="text-sm font-medium text-gray-700">
                Road Width (feet) *
              </Label>
              <Input
                id="roadWidth"
                type="number"
                {...register('roadWidth', { valueAsNumber: true })}
                placeholder="e.g., 20"
                className="w-full"
              />
              {errors.roadWidth && (
                <p className="text-red-500 text-sm">{errors.roadWidth.message}</p>
              )}
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="boundaryWall" className="text-sm font-medium text-gray-700">
                Boundary Wall *
              </Label>
              <Select onValueChange={(value) => setValue('boundaryWall', value as any)}>
                <SelectTrigger>
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

          {/* Plot Shape & Additional Info */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plotShape" className="text-sm font-medium text-gray-700">
                Plot Shape *
              </Label>
              <Select onValueChange={(value) => setValue('plotShape', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="irregular">Irregular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="surveyNumber" className="text-sm font-medium text-gray-700">
                Survey Number
              </Label>
              <Input
                id="surveyNumber"
                {...register('surveyNumber')}
                placeholder="e.g., 123/4"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subDivision" className="text-sm font-medium text-gray-700">
                Sub Division
              </Label>
              <Input
                id="subDivision"
                {...register('subDivision')}
                placeholder="e.g., Block A"
                className="w-full"
              />
            </div>
          </div> */}

          {/* Village Name */}
          {/* <div className="space-y-2">
            <Label htmlFor="villageName" className="text-sm font-medium text-gray-700">
              Village Name (if applicable)
            </Label>
            <Input
              id="villageName"
              {...register('villageName')}
              placeholder="Enter village name"
              className="w-full"
            />
          </div> */}

          {/* Checkboxes */}
          {/* <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cornerPlot"
                onCheckedChange={(checked) => setValue('cornerPlot', !!checked)}
              />
              <Label htmlFor="cornerPlot" className="text-sm font-medium text-gray-700">
                Corner Plot
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gatedCommunity"
                onCheckedChange={(checked) => setValue('gatedCommunity', !!checked)}
              />
              <Label htmlFor="gatedCommunity" className="text-sm font-medium text-gray-700">
                Gated Community
              </Label>
            </div>
          </div> */}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={true}
            >
              Back
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Next: Location Details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};