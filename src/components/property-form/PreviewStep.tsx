import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyDraft } from '@/types/propertyDraft';
import { ArrowLeft, Edit, Save, Send } from 'lucide-react';
import { useState } from 'react';

interface PreviewStepProps {
  data: PropertyDraft;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSaveAsDraft: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSavingDraft: boolean;
}

export const PreviewStep = ({ 
  data, 
  onBack, 
  onEdit, 
  onSaveAsDraft, 
  onSubmit, 
  isSubmitting,
  isSavingDraft
}: PreviewStepProps) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Preview & Submit</CardTitle>
          <p className="text-muted-foreground">
            Review your property listing before submitting
          </p>
        </CardHeader>
      </Card>

      {/* Property Listing Preview */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{data.title}</h1>
              <div className="flex gap-2">
                <Badge variant="secondary">{data.property_type}</Badge>
                <Badge variant="outline">{data.listing_type}</Badge>
                {data.bhk_type && <Badge variant="outline">{data.bhk_type}</Badge>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {data.expected_price ? formatPrice(data.expected_price) : 'Price not set'}
              </div>
              <div className="text-sm text-muted-foreground">
                {data.super_area} sqft
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Images */}
          {data.images && data.images.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Property Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {data.videos && data.videos.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Property Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.videos.map((video, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <video
                      src={video}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Property Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type:</span>
                  <span className="capitalize">{data.property_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listing Type:</span>
                  <span className="capitalize">{data.listing_type}</span>
                </div>
                {data.bhk_type && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BHK:</span>
                    <span className="uppercase">{data.bhk_type}</span>
                  </div>
                )}
                {data.bathrooms !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bathrooms:</span>
                    <span>{data.bathrooms}</span>
                  </div>
                )}
                {data.balconies !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balconies:</span>
                    <span>{data.balconies}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Super Area:</span>
                  <span>{data.super_area} sqft</span>
                </div>
                {data.carpet_area && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carpet Area:</span>
                    <span>{data.carpet_area} sqft</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Location</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">State:</span>
                  <span>{data.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <span>{data.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Locality:</span>
                  <span>{data.locality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pincode:</span>
                  <span>{data.pincode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {data.description && (
            <div className="space-y-3">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.description}
              </p>
            </div>
          )}

          {/* Owner Information */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{data.owner_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{data.owner_phone}</span>
                </div>
              </div>
              <div className="space-y-2">
                {data.owner_email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{data.owner_email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="capitalize">{data.owner_role}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => onEdit(1)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Owner Info
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onEdit(2)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Property Info
              </Button>
              
              <Button
                variant="secondary"
                onClick={onSaveAsDraft}
                disabled={isSavingDraft}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSavingDraft ? 'Saving...' : 'Save as Draft'}
              </Button>
              
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Listing'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};