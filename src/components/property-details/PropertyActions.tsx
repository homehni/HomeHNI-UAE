import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Edit, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RentalStatusService } from '@/services/rentalStatusService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface PropertyActionsProps {
  onContact: () => void;
  onScheduleVisit: () => void;
  property: {
    id: string;
    user_id?: string;
    status?: string;
    rental_status?: 'available' | 'rented' | 'sold';
  };
  onPropertyStatusUpdate?: (newStatus: 'available' | 'rented' | 'sold') => void;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({ 
  onContact, 
  onScheduleVisit,
  property,
  onPropertyStatusUpdate
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOwner, setIsOwner] = useState(false);
  const [ownershipChecked, setOwnershipChecked] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Check property ownership by querying the database
  useEffect(() => {
    const checkOwnership = async () => {
      if (!user || !property.id) {
        setIsOwner(false);
        setOwnershipChecked(true);
        return;
      }

      try {
        console.log('PropertyActions: Checking ownership for property:', property.id, 'user:', user.id);
        
        // Check in properties table first
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('user_id')
          .eq('id', property.id)
          .eq('user_id', user.id)
          .limit(1);

        console.log('PropertyActions: Properties table check:', { propertyData, propertyError });

        if (propertyData && propertyData.length > 0) {
          console.log('PropertyActions: User owns this property (properties table)');
          setIsOwner(true);
          setOwnershipChecked(true);
          return;
        }

        // Check in property_submissions table
        const { data: submissionData, error: submissionError } = await supabase
          .from('property_submissions')
          .select('user_id')
          .eq('id', property.id)
          .eq('user_id', user.id)
          .limit(1);

        console.log('PropertyActions: Property submissions check:', { submissionData, submissionError });

        if (submissionData && submissionData.length > 0) {
          console.log('PropertyActions: User owns this property (property_submissions table)');
          setIsOwner(true);
        } else {
          console.log('PropertyActions: User does not own this property');
          setIsOwner(false);
        }

        setOwnershipChecked(true);
      } catch (error) {
        console.error('PropertyActions: Error checking ownership:', error);
        setIsOwner(false);
        setOwnershipChecked(true);
      }
    };

    checkOwnership();
  }, [user, property.id]);
  
  // Debug logging
  console.log('PropertyActions Debug:', {
    user: user ? { id: user.id, email: user.email } : null,
    property_user_id: property.user_id,
    property_id: property.id,
    property_status: property.status,
    isOwner: isOwner,
    ownershipChecked: ownershipChecked,
    userLoggedIn: !!user,
    propertyHasUserId: !!property.user_id,
    idsMatch: user?.id === property.user_id
  });

  const handleEditProperty = () => {
    navigate(`/edit-property/${property.id}?tab=basic`);
  };

  const handleMarkRentedOut = async () => {
    if (!user || !property.id) return;
    
    setIsUpdatingStatus(true);
    
    try {
      console.log('PropertyActions: Marking property as rented:', property.id);
      
      const newStatus = property.rental_status === 'rented' ? 'available' : 'rented';
      
      // Use RentalStatusService to update the status
      const result = await RentalStatusService.updatePropertyRentalStatus(
        property.id, 
        newStatus, 
        user.id
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to update property status');
      }

      // Call the parent callback to update the UI
      if (onPropertyStatusUpdate) {
        onPropertyStatusUpdate(newStatus);
      }

      toast({
        title: newStatus === 'rented' ? "Property Marked as Rented" : "Property Marked as Available",
        description: newStatus === 'rented' 
          ? "Your property is now marked as rented out and will show a RENTED watermark."
          : "Your property is now marked as available for rent.",
      });

      // Send deal closed email when property is marked as rented
      if (newStatus === 'rented' && user.email) {
        try {
          const { sendDealClosedEmail } = await import('@/services/emailService');
          await sendDealClosedEmail(
            user.email,
            user.user_metadata?.full_name || 'Property Owner',
            {
              locality: 'Your property location',
              dealType: 'rent'
            }
          );
        } catch (error) {
          console.error('Failed to send deal closed email:', error);
        }
      }

      console.log('PropertyActions: Successfully updated property status to:', newStatus);
      
    } catch (error) {
      console.error('PropertyActions: Error updating rental status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update property status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Show loading state while checking ownership
  if (!ownershipChecked) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
      </div>
    );
  }

  // Show owner-specific UI if user owns the property
  if (isOwner) {
    const isPending = property.status === 'pending' || property.status === 'under_review' || !property.status;
    
    return (
      <div className="space-y-3">
        {/* Verification Status - Only show if property is still pending */}
        {isPending && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Your property is currently under verification.
              </span>
            </div>
          </div>
        )}
        
        {/* Action Buttons for Owners */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Edit Property Button */}
          <Button 
            onClick={handleEditProperty}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-3 font-medium flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Property
          </Button>

          {/* Mark Rented Out Button */}
          <Button 
            onClick={handleMarkRentedOut}
            disabled={isUpdatingStatus}
            className={`flex-1 rounded-lg py-3 font-medium flex items-center justify-center gap-2 ${
              property.rental_status === 'rented'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {isUpdatingStatus 
              ? 'Updating...' 
              : property.rental_status === 'rented' 
                ? 'Mark Available' 
                : 'Mark Rented Out'
            }
          </Button>
        </div>
      </div>
    );
  }

  // Show regular visitor UI for non-owners
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onContact}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium"
        >
          Contact
        </Button>
        <div className="flex-1 relative">
          <Button 
            onClick={onScheduleVisit}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium"
          >
            Schedule Visit
          </Button>
          <div className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded-full items-center gap-1 hidden sm:flex">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified Availability</span>
          </div>
        </div>
      </div>
      {/* Mobile verification badge */}
      <div className="flex items-center justify-center gap-1 bg-black text-white text-xs px-2 py-1 rounded-full sm:hidden">
        <ShieldCheck className="w-3 h-3" />
        <span>Verified Availability</span>
      </div>
    </div>
  );
};