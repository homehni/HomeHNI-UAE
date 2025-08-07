import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdditionalInfo } from '@/types/property';

const additionalInfoSchema = z.object({
  description: z.string().optional(),
  highlights: z.string().optional(),
  restrictions: z.string().optional(),
  documents: z.string().optional(),
  developmentPotential: z.string().optional(),
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
  const { register, handleSubmit } = useForm<AdditionalInfoForm>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: initialData,
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
          {/* Property Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Plot Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your land/plot, its unique features, location advantages, and what makes it special..."
              rows={4}
              className="w-full"
            />
            <p className="text-gray-500 text-xs">
              Include details about the plot's topography, natural features, accessibility, and potential uses
            </p>
          </div>

          {/* Key Highlights */}
          <div className="space-y-2">
            <Label htmlFor="highlights" className="text-sm font-medium text-gray-700">
              Key Highlights & Selling Points
            </Label>
            <Textarea
              id="highlights"
              {...register('highlights')}
              placeholder="List the key selling points, unique advantages, and highlights of your plot..."
              rows={3}
              className="w-full"
            />
            <p className="text-gray-500 text-xs">
              Example: Corner plot, near metro station, facing park, approved layout, ready for construction
            </p>
          </div>

          {/* Development Potential */}
          <div className="space-y-2">
            <Label htmlFor="developmentPotential" className="text-sm font-medium text-gray-700">
              Development Potential & Future Prospects
            </Label>
            <Textarea
              id="developmentPotential"
              {...register('developmentPotential')}
              placeholder="Describe the development potential, zoning details, construction possibilities, and future value prospects..."
              rows={3}
              className="w-full"
            />
            <p className="text-gray-500 text-xs">
              Include information about permitted construction, FSI, height restrictions, and upcoming developments in the area
            </p>
          </div>

          {/* Legal & Restrictions */}
          <div className="space-y-2">
            <Label htmlFor="restrictions" className="text-sm font-medium text-gray-700">
              Legal Information & Restrictions
            </Label>
            <Textarea
              id="restrictions"
              {...register('restrictions')}
              placeholder="Mention any legal restrictions, easements, covenants, or special conditions..."
              rows={3}
              className="w-full"
            />
            <p className="text-gray-500 text-xs">
              Include details about building restrictions, setback requirements, land use limitations, or community guidelines
            </p>
          </div>

          {/* Available Documents */}
          <div className="space-y-2">
            <Label htmlFor="documents" className="text-sm font-medium text-gray-700">
              Available Documents
            </Label>
            <Textarea
              id="documents"
              {...register('documents')}
              placeholder="List all available documents like title deed, survey settlement, tax receipts, NOCs..."
              rows={3}
              className="w-full"
            />
            <p className="text-gray-500 text-xs">
              Example: Clear title deed, survey settlement record, property tax receipts, RERA certificate, NOC certificates
            </p>
          </div>

          {/* Information Guidelines */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Tips for Writing Effective Descriptions:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Mention nearby landmarks, schools, hospitals, and transportation</li>
              <li>• Highlight future development projects in the vicinity</li>
              <li>• Include soil quality, drainage, and natural features</li>
              <li>• Specify any architectural guidelines or community features</li>
              <li>• Mention investment potential and growth prospects</li>
              <li>• Be honest about any limitations or challenges</li>
              <li>• Use specific details rather than generic statements</li>
            </ul>
          </div>

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