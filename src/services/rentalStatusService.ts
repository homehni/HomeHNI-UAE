import { supabase } from '@/integrations/supabase/client';

export type RentalStatus = 'available' | 'inactive' | 'rented' | 'sold';

export class RentalStatusService {
  /**
   * Get rental status for a single property
   */
  static async getPropertyRentalStatus(propertyId: string): Promise<RentalStatus> {
    try {
      // First try properties table
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('rental_status')
        .eq('id', propertyId)
        .maybeSingle();

      if (!propertyError && propertyData) {
        return (propertyData.rental_status as RentalStatus) || 'available';
      }

      // If not found in properties, try property_submissions table
      const { data: submissionData, error: submissionError } = await supabase
        .from('property_submissions')
        .select('rental_status')
        .eq('id', propertyId)
        .maybeSingle();

      if (!submissionError && submissionData) {
        return (submissionData.rental_status as RentalStatus) || 'available';
      }

      // Default to available if not found
      return 'available';
    } catch (error) {
      console.error('Error fetching rental status:', error);
      return 'available';
    }
  }

  /**
   * Get rental statuses for multiple properties
   */
  static async getMultiplePropertiesRentalStatus(propertyIds: string[]): Promise<Record<string, RentalStatus>> {
    const result: Record<string, RentalStatus> = {};
    
    try {
      // Get statuses from properties table
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, rental_status')
        .in('id', propertyIds);

      if (!propertiesError && propertiesData) {
        propertiesData.forEach(property => {
          result[property.id] = (property.rental_status as RentalStatus) || 'available';
        });
      }

      // Get statuses from property_submissions table for properties not found above
      const missingIds = propertyIds.filter(id => !result[id]);
      if (missingIds.length > 0) {
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('property_submissions')
          .select('id, rental_status')
          .in('id', missingIds);

        if (!submissionsError && submissionsData) {
          submissionsData.forEach(submission => {
            result[submission.id] = (submission.rental_status as RentalStatus) || 'available';
          });
        }
      }

      // Fill in defaults for any missing properties
      propertyIds.forEach(id => {
        if (!result[id]) {
          result[id] = 'available';
        }
      });

      return result;
    } catch (error) {
      console.error('Error fetching multiple rental statuses:', error);
      // Return default values for all properties
      propertyIds.forEach(id => {
        result[id] = 'available';
      });
      return result;
    }
  }

  /**
   * Update rental status for a property
   */
  static async updatePropertyRentalStatus(
    propertyId: string, 
    newStatus: RentalStatus,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('RentalStatusService: Updating property', propertyId, 'to status', newStatus, 'by user', userId);

      // First try to update in properties table
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .update({ rental_status: newStatus })
        .eq('id', propertyId)
        .eq('user_id', userId)
        .select('id')
        .maybeSingle();

      if (!propertyError && propertyData) {
        console.log('RentalStatusService: Successfully updated property in properties table');
        return { success: true };
      }

      // If not found in properties, try property_submissions table
      const { data: submissionData, error: submissionError } = await supabase
        .from('property_submissions')
        .update({ rental_status: newStatus })
        .eq('id', propertyId)
        .eq('user_id', userId)
        .select('id')
        .maybeSingle();

      if (!submissionError && submissionData) {
        console.log('RentalStatusService: Successfully updated property in property_submissions table');
        return { success: true };
      }

      // If neither worked, return error
      const errorMessage = propertyError?.message || submissionError?.message || 'Property not found or access denied';
      console.error('RentalStatusService: Failed to update rental status:', errorMessage);
      return { success: false, error: errorMessage };

    } catch (error) {
      console.error('RentalStatusService: Exception during update:', error);
      return { success: false, error: 'Failed to update rental status' };
    }
  }
}
