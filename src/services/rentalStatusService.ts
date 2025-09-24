import { supabase } from '@/integrations/supabase/client';

export type RentalStatus = 'available' | 'rented' | 'sold';

export class RentalStatusService {
  /**
   * Get rental status for a single property
   */
  static async getPropertyRentalStatus(propertyId: string): Promise<RentalStatus> {
    try {
      console.log('RentalStatusService: Fetching rental status for property:', propertyId);

      // First check in properties table
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('rental_status')
        .eq('id', propertyId)
        .limit(1);

      if (propertyData && propertyData.length > 0 && propertyData[0].rental_status) {
        console.log('RentalStatusService: Found rental status in properties table:', propertyData[0].rental_status);
        return propertyData[0].rental_status as RentalStatus;
      }

      // If not found in properties, check property_submissions
      const { data: submissionData, error: submissionError } = await supabase
        .from('property_submissions')
        .select('rental_status')
        .eq('id', propertyId)
        .limit(1);

      if (submissionData && submissionData.length > 0 && submissionData[0].rental_status) {
        console.log('RentalStatusService: Found rental status in property_submissions table:', submissionData[0].rental_status);
        return submissionData[0].rental_status as RentalStatus;
      }

      console.log('RentalStatusService: No rental status found, defaulting to available');
      return 'available';
    } catch (error) {
      console.error('RentalStatusService: Error fetching rental status:', error);
      return 'available';
    }
  }

  /**
   * Get rental statuses for multiple properties
   */
  static async getMultiplePropertiesRentalStatus(propertyIds: string[]): Promise<Record<string, RentalStatus>> {
    try {
      if (propertyIds.length === 0) return {};

      console.log('RentalStatusService: Fetching rental statuses for', propertyIds.length, 'properties');

      const result: Record<string, RentalStatus> = {};

      // First check in properties table
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, rental_status')
        .in('id', propertyIds);

      if (propertiesData) {
        propertiesData.forEach(property => {
          if (property.rental_status) {
            result[property.id] = property.rental_status as RentalStatus;
          }
        });
      }

      // For properties not found in properties table, check property_submissions
      const remainingIds = propertyIds.filter(id => !result[id]);
      if (remainingIds.length > 0) {
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('property_submissions')
          .select('id, rental_status')
          .in('id', remainingIds);

        if (submissionsData) {
          submissionsData.forEach(property => {
            if (property.rental_status) {
              result[property.id] = property.rental_status as RentalStatus;
            }
          });
        }
      }

      // Fill in 'available' for any remaining properties
      propertyIds.forEach(id => {
        if (!result[id]) {
          result[id] = 'available';
        }
      });

      console.log('RentalStatusService: Fetched rental statuses:', result);
      return result;
    } catch (error) {
      console.error('RentalStatusService: Error fetching multiple rental statuses:', error);
      // Return 'available' for all properties on error
      const result: Record<string, RentalStatus> = {};
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
      console.log('RentalStatusService: Updating rental status for property:', propertyId, 'to:', newStatus);

      // Update in properties table first
      const { error: propertyError } = await supabase
        .from('properties')
        .update({ rental_status: newStatus })
        .eq('id', propertyId)
        .eq('user_id', userId);

      if (propertyError && propertyError.code !== 'PGRST116') {
        console.log('RentalStatusService: Properties table update error:', propertyError);
      }

      // Also update in property_submissions table if exists
      const { error: submissionError } = await supabase
        .from('property_submissions')
        .update({ rental_status: newStatus })
        .eq('id', propertyId)
        .eq('user_id', userId);

      if (submissionError && submissionError.code !== 'PGRST116') {
        console.log('RentalStatusService: Property submissions update error:', submissionError);
      }

      console.log('RentalStatusService: Successfully updated rental status to:', newStatus);
      return { success: true };
    } catch (error) {
      console.error('RentalStatusService: Error updating rental status:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
