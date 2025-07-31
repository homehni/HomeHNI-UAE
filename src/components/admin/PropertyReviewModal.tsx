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
import { CheckCircle, XCircle, MapPin, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

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
  images: string[];
  status: string;
  created_at: string;
  rejection_reason?: string;
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{property.title}</span>
            <Badge className={getStatusColor(property.status)}>
              {property.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Images */}
          {property.images && property.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {property.images.slice(0, 6).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {property.locality}, {property.city}, {property.state}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Submitted: {format(new Date(property.created_at), 'PPP')}
                </span>
              </div>

              <div>
                <span className="font-semibold">Type: </span>
                {property.property_type} - {property.listing_type}
              </div>

              <div>
                <span className="font-semibold">Configuration: </span>
                {property.bhk_type}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-semibold">Price: </span>
                ₹{property.expected_price?.toLocaleString()}
              </div>

              <div>
                <span className="font-semibold">Area: </span>
                {property.super_area} sq ft
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {property.description}
              </p>
            </div>
          )}

          {/* Rejection Reason */}
          {property.status === 'rejected' && property.rejection_reason && (
            <div>
              <h4 className="font-semibold mb-2 text-red-600">Rejection Reason</h4>
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {property.rejection_reason}
              </p>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <div className="space-y-3">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this property..."
                className="min-h-[100px]"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  disabled={!rejectionReason.trim() || loading}
                >
                  Confirm Rejection
                </Button>
                <Button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {property.status === 'pending' && !showRejectForm && (
            <div className="flex space-x-3 pt-4 border-t">
              <Button
                onClick={() => onApprove(property.id)}
                className="flex items-center space-x-2"
                disabled={loading}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </Button>
              
              <Button
                onClick={() => setShowRejectForm(true)}
                variant="destructive"
                className="flex items-center space-x-2"
                disabled={loading}
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};