import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Edit, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PropertyActionsProps {
  onContact: () => void;
  onScheduleVisit: () => void;
  property: {
    id: string;
    user_id?: string;
    status?: string;
  };
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({ 
  onContact, 
  onScheduleVisit,
  property
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if current user is the property owner
  const isOwner = user && property.user_id && user.id === property.user_id;
  
  // Debug logging
  console.log('PropertyActions Debug:', {
    user: user ? { id: user.id, email: user.email } : null,
    property_user_id: property.user_id,
    property_id: property.id,
    property_status: property.status,
    isOwner: isOwner,
    userLoggedIn: !!user,
    propertyHasUserId: !!property.user_id,
    idsMatch: user?.id === property.user_id
  });

  const handleEditProperty = () => {
    navigate(`/edit-property/${property.id}?tab=basic`);
  };
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
        
        {/* Edit Property Button - Always show for owners */}
        <Button 
          onClick={handleEditProperty}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Property
        </Button>
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