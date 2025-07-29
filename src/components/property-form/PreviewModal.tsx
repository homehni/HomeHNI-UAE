import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PropertyDraft } from '@/types/propertyDraft';
import { MapPin, Home, Bed, Bath, Square, Eye, Video } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PropertyDraft;
}

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  }
  return `₹${price.toLocaleString()}`;
};

export const PreviewModal = ({ isOpen, onClose, data }: PreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Property Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{data.title}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {data.expected_price ? formatPrice(data.expected_price) : 'Price not set'}
              </span>
              <Badge variant="secondary" className="capitalize">
                For {data.listing_type}
              </Badge>
            </div>
          </div>

          {/* Property Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{data.property_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{data.bhk_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{data.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{data.super_area} sq ft</span>
                </div>
              </div>
              
              {data.balconies && (
                <div className="mt-4">
                  <span className="text-sm text-muted-foreground">
                    {data.balconies} Balconies
                  </span>
                </div>
              )}
              
              {data.carpet_area && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">
                    Carpet Area: {data.carpet_area} sq ft
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </h3>
              <div className="space-y-2">
                <p className="text-sm">{data.locality}, {data.city}</p>
                <p className="text-sm text-muted-foreground">{data.state} - {data.pincode}</p>
              </div>
            </CardContent>
          </Card>

          {/* Images and Videos */}
          {(data.images?.length || data.videos?.length) && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Media</h3>
                <div className="space-y-4">
                  {data.images && data.images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Images ({data.images.length})</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {data.images.slice(0, 6).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Property ${index + 1}`}
                            className="w-full h-20 object-cover rounded-md"
                          />
                        ))}
                        {data.images.length > 6 && (
                          <div className="w-full h-20 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              +{data.images.length - 6} more
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {data.videos && data.videos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Videos ({data.videos.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {data.videos.slice(0, 4).map((video, index) => (
                          <video
                            key={index}
                            src={video}
                            className="w-full h-20 object-cover rounded-md"
                            controls={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {data.description && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.description}
                </p>
              </CardContent>
            </Card>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};