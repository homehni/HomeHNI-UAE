import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, MapPin, Calendar, Home, Ruler, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Property {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type: string;
  state: string;
  city: string;
  locality: string;
  expected_price: number;
  super_area: number;
  description: string;
  images: (string | { url: string })[];
  status: string;
  created_at: string;
  rejection_reason?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
}

interface PropertyReviewModalProps {
  property: Property | null;
  open: boolean;
  onClose: () => void;
  onApprove: (propertyId: string) => void;
  onReject: (propertyId: string, reason: string) => void;
  loading: boolean;
}

export const PropertyReviewModal: React.FC<PropertyReviewModalProps> = ({
  property,
  open,
  onClose,
  onApprove,
  onReject,
  loading
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!property) return null;

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(property.id, rejectionReason);
    setRejectionReason('');
    setShowRejectForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-background">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-primary" />
              <span className="font-semibold">{property.title}</span>
            </div>
            <Badge className={cn("px-3 py-1 font-medium", getStatusColor(property.status))}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-4 w-4" />
                  Property Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                {property.images && property.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {property.images.slice(0, 6).map((image, index) => {
                       // Handle both object format {url: "..."} and direct URL string
                       const imageUrl: string = typeof image === 'string' ? image : (image?.url || '/placeholder.svg');
                       return (
                         <div key={index} className="relative group overflow-hidden rounded-lg">
                           <img
                             src={imageUrl}
                             alt={`Property ${index + 1}`}
                             className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                             onError={(e) => {
                               e.currentTarget.src = '/placeholder.svg';
                               e.currentTarget.alt = 'Image not available';
                             }}
                           />
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                         </div>
                       );
                     })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No images available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {property.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-4 w-4" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Rejection Reason */}
            {property.status === 'rejected' && property.rejection_reason && (
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-red-700">
                    <XCircle className="h-4 w-4" />
                    Rejection Reason
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 bg-red-100 p-4 rounded-lg">
                    {property.rejection_reason}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Owner Information */}
            {(property.owner_name || property.owner_email || property.owner_phone) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {property.owner_name && (
                    <div className="flex items-start gap-3">
                      <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Name</p>
                        <p className="text-sm text-muted-foreground">{property.owner_name}</p>
                      </div>
                    </div>
                  )}

                  {property.owner_email && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Email</p>
                          <p className="text-sm text-muted-foreground">{property.owner_email}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {property.owner_phone && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Phone</p>
                          <p className="text-sm text-muted-foreground">{property.owner_phone}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {property.locality}, {property.city}, {property.state}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Type</p>
                    <p className="text-sm text-muted-foreground">
                      {property.property_type} - {property.listing_type}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Ruler className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Configuration</p>
                    <p className="text-sm text-muted-foreground">{property.bhk_type}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Expected Price</p>
                    <p className="text-lg font-bold text-primary">
                      ₹{property.expected_price?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Ruler className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Super Area</p>
                    <p className="text-sm text-muted-foreground">{property.super_area} sq ft</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Submitted On</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(property.created_at), 'PPP')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {property.status === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showRejectForm ? (
                    <div className="space-y-3">
                      <Button
                        onClick={() => onApprove(property.id)}
                        className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        disabled={loading}
                        size="lg"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve Property
                      </Button>
                      
                      <Button
                        onClick={() => setShowRejectForm(true)}
                        variant="destructive"
                        className="w-full flex items-center gap-2"
                        disabled={loading}
                        size="lg"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject Property
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="rejection-reason" className="text-sm font-medium">
                          Rejection Reason
                        </Label>
                        <Textarea
                          id="rejection-reason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Please provide a detailed reason for rejecting this property..."
                          className="min-h-[120px] resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          onClick={handleReject}
                          variant="destructive"
                          className="w-full"
                          disabled={!rejectionReason.trim() || loading}
                          size="lg"
                        >
                          Confirm Rejection
                        </Button>
                        <Button
                          onClick={() => {
                            setShowRejectForm(false);
                            setRejectionReason('');
                          }}
                          variant="outline"
                          className="w-full"
                          size="lg"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};