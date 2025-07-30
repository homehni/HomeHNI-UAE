import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MultiStepForm } from '@/components/property-form';
import { OwnerInfo, PropertyInfo } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const PostProperty: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a property listing.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare property data for database
      const propertyData = {
        user_id: user.id,
        title: data.propertyInfo.title,
        property_type: data.propertyInfo.propertyType,
        listing_type: data.propertyInfo.listingType,
        bhk_type: data.propertyInfo.bhkType,
        bathrooms: data.propertyInfo.bathrooms,
        balconies: data.propertyInfo.balconies,
        super_area: data.propertyInfo.superArea,
        carpet_area: data.propertyInfo.carpetArea,
        expected_price: data.propertyInfo.expectedPrice,
        state: data.propertyInfo.state,
        city: data.propertyInfo.city,
        locality: data.propertyInfo.locality,
        pincode: data.propertyInfo.pincode,
        description: data.propertyInfo.description,
        availability_type: 'Immediate', // Default value
        status: 'active'
      };

      // Insert property into database
      const { data: property, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your property has been submitted successfully.",
      });

      // Redirect to dashboard after successful submission
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error submitting property:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MultiStepForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};