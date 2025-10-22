import { supabase } from '@/integrations/supabase/client';
import { OwnerInfo, PropertyInfo } from '@/types/property';
import { uploadPropertyImagesByType } from './fileUploadService';

export interface PropertyDraft {
  id?: string;
  user_id?: string;
  
  // Property Selection Data
  property_type: string;
  listing_type: string;
  
  // Owner Information
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  whatsapp_updates?: boolean;
  
  // Property Details
  apartment_type?: string;
  apartment_name?: string;
  bhk_type?: string;
  floor_no?: number;
  total_floors?: number;
  property_age?: string;
  facing?: string;
  built_up_area?: number;
  carpet_area?: number;
  
  // Commercial-specific fields
  space_type?: string;
  building_type?: string;
  furnishing_status?: string;
  super_built_up_area?: number;
  power_load?: string;
  ceiling_height?: string;
  entrance_width?: string;
  loading_facility?: boolean;
  on_main_road?: boolean;
  corner_property?: boolean;
  
  // Land/Plot-specific fields
  plot_area?: number;
  plot_area_unit?: string;
  plot_length?: number;
  plot_width?: number;
  boundary_wall?: string;
  corner_plot?: boolean;
  road_facing?: string;
  road_width?: number;
  land_type?: string;
  plot_shape?: string;
  gated_community?: boolean;
  gated_project?: string;
  floors_allowed?: number;
  survey_number?: string;
  sub_division?: string;
  village_name?: string;
  
  // Land/Plot infrastructure fields
  electricity_connection?: string;
  sewage_connection?: string;
  
  // Location Details
  state?: string;
  city?: string;
  locality?: string;
  pincode?: string;
  society_name?: string;
  landmark?: string;
  
  // Rental Details
  expected_rent?: number;
  expected_deposit?: number;
  rent_negotiable?: boolean;
  monthly_maintenance?: string;
  available_from?: string;
  preferred_tenant?: string;
  description?: string;
  
  // Sale Details
  expected_price?: number;
  price_negotiable?: boolean;
  possession_date?: string;
  ownership_type?: string;
  approved_by?: string;
  
  // Amenities
  furnishing?: string;
  parking?: string;
  power_backup?: string;
  lift?: string;
  water_supply?: string;
  security?: string;
  gym?: string;
  gated_security?: string;
  current_property_condition?: string;
  directions_tip?: string;
  
  // Gallery
  images?: string[];
  categorized_images?: any; // JSONB field for categorized image structure
  video?: string;
  
  // Additional Info
  additional_info?: any;
  
  // Schedule Info
  schedule_info?: any;
  
  // Metadata
  current_step?: number;
  is_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class PropertyDraftService {
  /**
   * Create a new property draft
   */
  static async createDraft(data: Partial<PropertyDraft>): Promise<PropertyDraft> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('User authentication error:', userError);
        throw new Error('User not authenticated');
      }

      console.log('Creating draft for user:', user.id);
      console.log('Draft data:', data);

      const { data: draft, error } = await supabase
        .from('property_drafts')
        .insert([{
          ...data,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating draft:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Failed to create property draft: ${error.message}`);
      }

      console.log('Draft created successfully:', draft);
      return draft;
    } catch (error) {
      console.error('Error in createDraft:', error);
      throw error;
    }
  }

  /**
   * Update an existing property draft
   */
  static async updateDraft(draftId: string, data: Partial<PropertyDraft>): Promise<PropertyDraft> {
    const { data: draft, error } = await supabase
      .from('property_drafts')
      .update(data)
      .eq('id', draftId)
      .select()
      .single();

    if (error) {
      console.error('Error updating draft:', error);
      throw new Error('Failed to update property draft');
    }

    return draft;
  }

  /**
   * Get a property draft by ID
   */
  static async getDraft(draftId: string): Promise<PropertyDraft | null> {
    const { data: draft, error } = await supabase
      .from('property_drafts')
      .select('*')
      .eq('id', draftId)
      .single();

    if (error) {
      console.error('Error fetching draft:', error);
      return null;
    }

    return draft;
  }

  /**
   * Get all drafts for the current user
   */
  static async getUserDrafts(): Promise<PropertyDraft[]> {
    const { data: drafts, error } = await supabase
      .from('property_drafts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching user drafts:', error);
      return [];
    }

    return drafts || [];
  }

  /**
   * Delete a property draft
   */
  static async deleteDraft(draftId: string): Promise<void> {
    const { error } = await supabase
      .from('property_drafts')
      .delete()
      .eq('id', draftId);

    if (error) {
      console.error('Error deleting draft:', error);
      throw new Error('Failed to delete property draft');
    }
  }

  /**
   * Save form data to draft (handles both create and update)
   */
  static async saveFormData(
    draftId: string | null, 
    stepData: any, 
    stepNumber: number,
    formType: 'rental' | 'sale' | 'commercial' | 'commercial-sale' | 'land'
  ): Promise<PropertyDraft> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('User authentication error in saveFormData:', userError);
        throw new Error('User not authenticated');
      }

      console.log('Saving form data for user:', user.id);
      console.log('Step data:', stepData);
      console.log('Step number:', stepNumber);
      console.log('Form type:', formType);
      console.log('Raw stepData keys:', Object.keys(stepData));

      // Prepare data based on form type and step
      let updateData: Partial<PropertyDraft> = {
        current_step: stepNumber,
        updated_at: new Date().toISOString()
      };

    // Map step data to draft fields
    switch (stepNumber) {
      case 1: // Property Details
        updateData = {
          ...updateData,
          apartment_type: stepData.apartmentType,
          apartment_name: stepData.apartmentName,
          bhk_type: stepData.bhkType,
          floor_no: stepData.floorNo,
          total_floors: stepData.totalFloors,
          property_age: stepData.propertyAge,
          facing: stepData.facing,
          built_up_area: stepData.builtUpArea,
          carpet_area: stepData.carpetArea,
          // Save the actual property type from the form
          property_type: stepData.propertyType || (formType === 'land' ? 'Land/Plot' : 'Residential'),
          // Commercial-specific fields
          space_type: stepData.spaceType,
          building_type: stepData.buildingType,
          furnishing_status: stepData.furnishingStatus,
          super_built_up_area: stepData.superBuiltUpArea,
          power_load: stepData.powerLoad,
          ceiling_height: stepData.ceilingHeight,
          entrance_width: stepData.entranceWidth,
          loading_facility: stepData.loadingFacility,
          on_main_road: stepData.onMainRoad,
          corner_property: stepData.cornerProperty,
          // Land/Plot-specific fields
          plot_area: stepData.plotArea,
          plot_area_unit: stepData.plotAreaUnit,
          plot_length: stepData.plotLength,
          plot_width: stepData.plotWidth,
          boundary_wall: stepData.boundaryWall,
          corner_plot: stepData.cornerPlot,
          road_facing: stepData.roadFacing,
          road_width: stepData.roadWidth,
          land_type: stepData.landType,
          plot_shape: stepData.plotShape,
          gated_community: stepData.gatedCommunity,
          gated_project: stepData.gatedProject,
          floors_allowed: stepData.floorsAllowed,
          survey_number: stepData.surveyNumber,
          sub_division: stepData.subDivision,
          village_name: stepData.villageName
        };
        console.log('Step 1 Property Details update data:', updateData);
        console.log('DEBUG: stepData.propertyType:', stepData.propertyType);
        console.log('DEBUG: stepData.landType:', stepData.landType);
        break;
      
      case 2: // Location Details
        updateData = {
          ...updateData,
          state: stepData.state,
          city: stepData.city,
          locality: stepData.locality,
          pincode: stepData.pincode,
          society_name: stepData.societyName,
          landmark: stepData.landmark
        };
        break;
      
      case 3: // Rental/Sale Details
        console.log('=== PROPERTY DRAFT SERVICE STEP 3 DEBUG ===');
        console.log('Form type:', formType);
        console.log('Step data:', stepData);
        console.log('Expected price:', stepData.expectedPrice);
        console.log('Security deposit:', stepData.securityDeposit);
        
        if (formType === 'rental') {
          updateData = {
            ...updateData,
            expected_rent: stepData.expectedPrice || stepData.expectedRent,
            expected_deposit: stepData.securityDeposit || stepData.expectedDeposit,
            rent_negotiable: stepData.rentNegotiable,
            monthly_maintenance: stepData.monthlyMaintenance,
            available_from: stepData.availableFrom,
            preferred_tenant: stepData.idealFor ? (Array.isArray(stepData.idealFor) ? stepData.idealFor.join(', ') : stepData.idealFor) : undefined,
            description: stepData.description
          };
          console.log('Rental update data:', updateData);
        } else if (formType === 'sale') {
          updateData = {
            ...updateData,
            expected_price: stepData.expectedPrice,
            price_negotiable: stepData.priceNegotiable,
            possession_date: stepData.possessionDate,
            description: stepData.description
          };
        } else if (formType === 'commercial') {
          // Handle commercial rent/sale details
          updateData = {
            ...updateData,
            expected_price: stepData.expectedPrice || stepData.expectedRent,
            expected_rent: stepData.expectedPrice || stepData.expectedRent,
            expected_deposit: stepData.securityDeposit || stepData.expectedDeposit,
            rent_negotiable: stepData.rentNegotiable,
            price_negotiable: stepData.priceNegotiable,
            monthly_maintenance: stepData.monthlyMaintenance,
            available_from: stepData.availableFrom,
            possession_date: stepData.possessionDate,
            preferred_tenant: stepData.idealFor ? (Array.isArray(stepData.idealFor) ? stepData.idealFor.join(', ') : stepData.idealFor) : undefined,
            description: stepData.description
          };
          console.log('Commercial update data:', updateData);
        } else if (formType === 'commercial-sale') {
          // Handle commercial sale details
          updateData = {
            ...updateData,
            expected_price: stepData.expectedPrice,
            price_negotiable: stepData.priceNegotiable,
            possession_date: stepData.possessionDate,
            description: stepData.description
          };
          console.log('Commercial Sale step 3 update data:', updateData);
        } else if (formType === 'land') {
          // Handle Land/Plot sale details
          updateData = {
            ...updateData,
            expected_price: stepData.expectedPrice,
            price_negotiable: stepData.priceNegotiable,
            possession_date: stepData.possessionDate,
            ownership_type: stepData.ownershipType,
            approved_by: stepData.approvedBy ? (Array.isArray(stepData.approvedBy) ? stepData.approvedBy.join(', ') : stepData.approvedBy) : undefined,
            description: stepData.description
          };
          console.log('Land/Plot step 3 update data:', updateData);
        }
        break;
      
      case 4: // Amenities
        if (formType === 'land') {
          // Handle Land/Plot amenities
          updateData = {
            ...updateData,
            water_supply: stepData.waterSupply,
            electricity_connection: stepData.electricityConnection,
            sewage_connection: stepData.sewageConnection,
            road_width: stepData.roadWidth,
            gated_security: stepData.gatedSecurity,
            directions_tip: stepData.directionsToProperty,
          };
          console.log('Land/Plot step 4 amenities update data:', updateData);
        } else {
          // Handle other property types - only include properties that exist in PropertyDraft
          updateData = {
            ...updateData,
            furnishing: stepData.furnishing,
            parking: stepData.parking,
            power_backup: stepData.powerBackup,
            lift: stepData.lift,
            water_supply: stepData.waterSupply,
            security: stepData.security,
            gym: stepData.gym,
            gated_security: stepData.gatedSecurity,
            current_property_condition: stepData.currentPropertyCondition,
            directions_tip: stepData.directionsTip,
            // Note: Removed amenities that don't exist in PropertyDraft interface
          };
        }
        break;
      
      case 5: // Gallery
        // Handle image uploads if images are File objects
        let imageUrls: string[] = [];
        if (stepData.images && Array.isArray(stepData.images) && stepData.images.length > 0) {
          // Check if images are File objects or already URLs
          const firstImage = stepData.images[0];
          if (firstImage instanceof File) {
            console.log('Uploading images to storage...');
            try {
              const uploadResults = await uploadPropertyImagesByType(
                stepData.images as File[],
                updateData.property_type || 'Residential',
                user.id
              );
              imageUrls = uploadResults.map(result => result.url);
              console.log('Images uploaded successfully:', imageUrls);
            } catch (error) {
              console.error('Error uploading images:', error);
              // Don't fail the entire draft save if image upload fails
              // Just log the error and continue with empty images
              console.warn('Continuing without images due to upload failure');
              imageUrls = [];
            }
          } else if (typeof firstImage === 'string') {
            // Images are already URLs
            imageUrls = stepData.images as string[];
          }
        }
        
        updateData = {
          ...updateData,
          images: imageUrls,
          categorized_images: stepData.categorizedImages, // Save categorized structure
          video: stepData.video
        };
        break;
      
      case 6: // Schedule
        updateData = {
          ...updateData,
          schedule_info: stepData
        };
        break;
    }

    console.log('Final updateData:', updateData);

    if (draftId) {
      // Update existing draft
      return await this.updateDraft(draftId, updateData);
    } else {
      // Create new draft
      return await this.createDraft({
        ...updateData,
        user_id: user.id,
        // Only set property_type if not already set from step 1
        property_type: updateData.property_type || (formType === 'rental' ? 'Residential' : 
                      formType === 'sale' ? 'Residential' :
                      formType === 'commercial' ? 'Commercial' : 
                      formType === 'commercial-sale' ? 'Commercial' : 'Land/Plot'),
        listing_type: formType === 'rental' ? 'Rent' : 
                     formType === 'sale' ? 'Sale' :
                     formType === 'commercial' ? 'Rent' : 
                     formType === 'commercial-sale' ? 'Sale' : 'Industrial land'
      });
    }
    } catch (error) {
      console.error('Error in saveFormData:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('User not authenticated')) {
          throw new Error('Please log in to save your property draft');
        } else if (error.message.includes('Failed to upload images')) {
          throw new Error('Failed to upload images. Please try again or skip images for now');
        } else if (error.message.includes('Failed to create property draft')) {
          throw new Error('Failed to create draft. Please check your internet connection and try again');
        } else if (error.message.includes('Failed to update property draft')) {
          throw new Error('Failed to update draft. Please try again');
        }
      }
      
      throw error;
    }
  }

  /**
   * Generate preview URL for a draft
   */
  static generatePreviewUrl(draftId: string): string {
    return `/buy/preview/${draftId}/detail`;
  }
}
