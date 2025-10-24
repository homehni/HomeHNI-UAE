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
  bathrooms?: number;
  balconies?: number;
  
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
  
  // PG/Hostel specific fields
  room_type?: string;
  gender_preference?: string;
  preferred_guests?: string;
  food_included?: string;
  gate_closing_time?: string;
  cupboard?: boolean;
  geyser?: boolean;
  tv?: boolean;
  ac?: boolean;
  bedding?: boolean;
  attached_bathroom?: boolean;
  no_smoking?: boolean;
  no_guardians_stay?: boolean;
  no_girls_entry?: boolean;
  no_drinking?: boolean;
  no_non_veg?: boolean;
  water_storage_facility?: string;
  wifi?: string;
  
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
      console.log('Draft data keys:', Object.keys(data));
      console.log('Draft data additional_info:', data.additional_info);

      // Prepare the insert data with required fields
      const insertData = {
        ...data,
        user_id: user.id,
        // Ensure required fields have default values
        property_type: data.property_type || 'Commercial',
        listing_type: data.listing_type || 'Rent',
        current_step: data.current_step || 1,
        is_completed: data.is_completed || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Insert data for draft creation:', insertData);
      console.log('Insert data keys:', Object.keys(insertData));

      const { data: draft, error } = await supabase
        .from('property_drafts')
        .insert([insertData])
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
        console.error('Failed insert data:', insertData);
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
    console.log('🔍 PropertyDraftService.updateDraft - Attempting to update draft:', {
      draftId,
      data,
      dataKeys: Object.keys(data),
      dataValues: Object.values(data)
    });

    const { data: draft, error } = await supabase
      .from('property_drafts')
      .update(data)
      .eq('id', draftId)
      .select()
      .single();

    if (error) {
      console.error('🚨 PropertyDraftService.updateDraft - Database error:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        draftId,
        dataBeingUpdated: data
      });
      throw new Error('Failed to update property draft');
    }

    console.log('✅ PropertyDraftService.updateDraft - Successfully updated draft:', draft);
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
    console.log(`🗑️ PropertyDraftService.deleteDraft: Attempting to delete draft with ID: ${draftId}`);
    
    const { error } = await supabase
      .from('property_drafts')
      .delete()
      .eq('id', draftId);

    if (error) {
      console.error('❌ PropertyDraftService.deleteDraft: Error deleting draft:', error);
      throw new Error('Failed to delete property draft');
    }
    
    console.log(`✅ PropertyDraftService.deleteDraft: Draft ${draftId} deleted successfully`);
  }

  /**
   * Clean up old completed drafts (older than 30 days)
   */
  static async cleanupOldCompletedDrafts(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { error } = await supabase
      .from('property_drafts')
      .delete()
      .eq('is_completed', true)
      .lt('updated_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.error('Error cleaning up old completed drafts:', error);
      throw new Error('Failed to cleanup old completed drafts');
    }
  }

  /**
   * Clean up old incomplete drafts (older than 7 days)
   * This is more aggressive cleanup for incomplete drafts
   */
  static async cleanupOldIncompleteDrafts(): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    console.log(`🧹 PropertyDraftService.cleanupOldIncompleteDrafts: Cleaning drafts older than ${sevenDaysAgo.toISOString()}`);
    
    const { error } = await supabase
      .from('property_drafts')
      .delete()
      .eq('is_completed', false)
      .lt('updated_at', sevenDaysAgo.toISOString());

    if (error) {
      console.error('❌ PropertyDraftService.cleanupOldIncompleteDrafts: Error cleaning up old incomplete drafts:', error);
      throw new Error('Failed to cleanup old incomplete drafts');
    }
    
    console.log('✅ PropertyDraftService.cleanupOldIncompleteDrafts: Successfully cleaned up old incomplete drafts');
  }

  /**
   * Save form data to draft (handles both create and update)
   */
  static async saveFormData(
    draftId: string | null, 
    stepData: any, 
    stepNumber: number,
    formType: 'rental' | 'sale' | 'commercial' | 'commercial-sale' | 'land' | 'pg_hostel' | 'flatmates'
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
        // Handle special floor values for commercial properties
        let floorNo = stepData.floorNo;
        if (typeof stepData.floorNo === 'string') {
          switch (stepData.floorNo) {
            case 'full':
              floorNo = -1; // Special value for "Full Building"
              break;
            case 'lower':
              floorNo = -2; // Special value for "Lower Basement"
              break;
            case 'upper':
              floorNo = -3; // Special value for "Upper Basement"
              break;
            case '99+':
              floorNo = 99; // Special value for "99+"
              break;
            default:
              floorNo = parseInt(stepData.floorNo) || 0;
          }
        }

        updateData = {
          ...updateData,
          apartment_type: stepData.apartmentType,
          apartment_name: stepData.apartmentName,
          bhk_type: stepData.bhkType,
          floor_no: floorNo,
          total_floors: stepData.totalFloors,
          property_age: stepData.propertyAge,
          facing: stepData.facing,
          built_up_area: stepData.builtUpArea,
          carpet_area: stepData.carpetArea,
          // Map tenantType to preferred_tenant for Flatmates properties
          preferred_tenant: stepData.tenantType === 'Male' ? 'male' : stepData.tenantType === 'Female' ? 'female' : stepData.tenantType === 'Any' ? 'any' : stepData.tenantType,
          // Save the actual property type from the form
          property_type: stepData.propertyType || (formType === 'land' ? 'Land/Plot' : formType === 'pg_hostel' ? 'PG/Hostel' : 'Residential'),
          // Store PG/Hostel specific fields in additional_info JSONB field
          additional_info: {
            ...(updateData.additional_info || {}),
            ...(formType === 'pg_hostel' && stepData.selectedTypes?.[0] ? { room_type: stepData.selectedTypes[0] } : {}),
          },
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
      
      case 2: // Location Details or Room Details for PG/Hostel
        if (formType === 'pg_hostel') {
          // Handle PG/Hostel room details
          updateData = {
            ...updateData,
            expected_rent: stepData.roomTypeDetails?.[Object.keys(stepData.roomTypeDetails || {})[0]]?.expectedRent,
            expected_deposit: stepData.roomTypeDetails?.[Object.keys(stepData.roomTypeDetails || {})[0]]?.expectedDeposit,
            // Store room amenities in additional_info JSONB field
            additional_info: {
              ...updateData.additional_info,
              room_amenities: stepData.roomAmenities
            }
          };
          console.log('PG/Hostel step 2 room details update data:', updateData);
          console.log('PG/Hostel step 2 roomAmenities from stepData:', stepData.roomAmenities);
          console.log('PG/Hostel step 2 stepData keys:', Object.keys(stepData));
        } else {
          // Handle location details for other property types
          updateData = {
            ...updateData,
            state: stepData.state,
            city: stepData.city,
            locality: stepData.locality,
            pincode: stepData.pincode,
            society_name: stepData.societyName,
            landmark: stepData.landmark
          };
        }
        break;
      
      case 3: // Rental/Sale Details
        console.log('=== PROPERTY DRAFT SERVICE STEP 3 DEBUG ===');
        console.log('Form type:', formType);
        console.log('Step data:', stepData);
        console.log('Expected price:', stepData.expectedPrice);
        console.log('Security deposit:', stepData.securityDeposit);
        
        if (formType === 'rental' || formType === 'flatmates') {
          updateData = {
            ...updateData,
            expected_rent: stepData.expectedPrice || stepData.expectedRent,
            expected_deposit: stepData.securityDeposit || stepData.expectedDeposit,
            rent_negotiable: stepData.rentNegotiable,
            monthly_maintenance: stepData.monthlyMaintenance,
            available_from: stepData.availableFrom && stepData.availableFrom.trim() !== '' ? stepData.availableFrom : null,
            preferred_tenant: stepData.idealFor ? (Array.isArray(stepData.idealFor) ? stepData.idealFor.join(', ') : stepData.idealFor) : undefined,
            description: stepData.description
          };
          console.log(`${formType} update data:`, updateData);
        } else if (formType === 'sale') {
          updateData = {
            ...updateData,
            expected_price: stepData.expectedPrice,
            price_negotiable: stepData.priceNegotiable,
            possession_date: stepData.possessionDate && stepData.possessionDate.trim() !== '' ? stepData.possessionDate : null,
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
            available_from: stepData.availableFrom && stepData.availableFrom.trim() !== '' ? stepData.availableFrom : null,
            possession_date: stepData.possessionDate && stepData.possessionDate.trim() !== '' ? stepData.possessionDate : null,
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
            possession_date: stepData.possessionDate && stepData.possessionDate.trim() !== '' ? stepData.possessionDate : null,
            description: stepData.description
          };
          console.log('Commercial Sale step 3 update data:', updateData);
        } else if (formType === 'land') {
          // Handle Land/Plot sale details
          updateData = {
            ...updateData,
            expected_price: stepData.expectedPrice,
            price_negotiable: stepData.priceNegotiable,
            possession_date: stepData.possessionDate && stepData.possessionDate.trim() !== '' ? stepData.possessionDate : null,
            ownership_type: stepData.ownershipType,
            approved_by: stepData.approvedBy ? (Array.isArray(stepData.approvedBy) ? stepData.approvedBy.join(', ') : stepData.approvedBy) : undefined,
            description: stepData.description
          };
          console.log('Land/Plot step 3 update data:', updateData);
        } else if (formType === 'pg_hostel') {
          // Handle PG/Hostel locality details
          updateData = {
            ...updateData,
            city: stepData.city,
            locality: stepData.locality,
            state: stepData.state,
            pincode: stepData.pincode,
            society_name: stepData.societyName,
            landmark: stepData.landmark
          };
          console.log('PG/Hostel step 3 update data:', updateData);
        }
        break;
      
      case 4: // Amenities or PG Details
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
        } else if (formType === 'pg_hostel') {
          // Handle PG/Hostel details
          updateData = {
            ...updateData,
            available_from: stepData.availableFrom && stepData.availableFrom.trim() !== '' ? stepData.availableFrom : null,
            description: stepData.description,
            // Store PG/Hostel specific data in additional_info JSONB field
            additional_info: {
              ...updateData.additional_info,
              gender_preference: stepData.genderPreference,
              preferred_guests: stepData.preferredGuests,
              food_included: stepData.foodIncluded,
              gate_closing_time: stepData.gateClosingTime,
              pg_rules: stepData.rules
            }
          };
          console.log('PG/Hostel step 4 details update data:', updateData);
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
            bathrooms: stepData.bathrooms,
            balconies: stepData.balconies,
            // Store Flatmates-specific amenities in additional_info JSONB field
            additional_info: {
              ...updateData.additional_info,
              // Room Details
              attachedBathroom: stepData.attachedBathroom,
              bathrooms: stepData.bathrooms,
              balconies: stepData.balconies,
              // Flatmate Preferences
              nonVegAllowed: stepData.nonVegAllowed,
              smokingAllowed: stepData.smokingAllowed,
              drinkingAllowed: stepData.drinkingAllowed,
              // Additional Details
              whoWillShow: stepData.whoWillShow,
              secondaryNumber: stepData.secondaryNumber,
              moreSimilarUnits: stepData.moreSimilarUnits,
              // Amenities
              waterStorageFacility: stepData.waterStorageFacility,
              wifi: stepData.wifi
            }
          };
        }
        break;
      
      case 5: // Gallery or Amenities for PG/Hostel
        if (formType === 'pg_hostel') {
          // Extract services from amenities
          const availableServices = {
            laundry: stepData.laundry === 'yes' ? 'yes' : 'no',
            room_cleaning: stepData.roomCleaning === 'yes' ? 'yes' : 'no',
            warden_facility: stepData.wardenFacility === 'yes' ? 'yes' : 'no'
          };
          
          // Handle PG/Hostel amenities
          console.log('Step 5 - Before update, existing additional_info:', updateData.additional_info);
          console.log('Step 5 - Existing room_amenities:', updateData.additional_info?.room_amenities);
          
          updateData = {
            ...updateData,
            power_backup: stepData.powerBackup,
            lift: stepData.lift,
            parking: stepData.parking,
            security: stepData.security,
            current_property_condition: stepData.currentPropertyCondition,
            directions_tip: stepData.directionsTip,
            // Store PG/Hostel specific amenities and services in additional_info JSONB field
            additional_info: {
              ...updateData.additional_info,
              water_storage_facility: stepData.waterStorageFacility,
              wifi: stepData.wifi,
              common_tv: stepData.commonTv,
              refrigerator: stepData.refrigerator,
              mess: stepData.mess,
              cooking_allowed: stepData.cookingAllowed,
              available_services: availableServices,
              // Make Food Facility dependent on Mess selection
              food_included: stepData.mess ? 'yes' : 'no'
            }
          };
          
          console.log('Step 5 - After update, new additional_info:', updateData.additional_info);
          console.log('Step 5 - Preserved room_amenities:', updateData.additional_info?.room_amenities);
          console.log('Step 5 - Mess selection:', stepData.mess);
          console.log('Step 5 - Food Facility set to:', stepData.mess ? 'yes' : 'no');
          console.log('PG/Hostel step 5 amenities update data:', updateData);
          console.log('Available services:', availableServices);
        } else {
          // Handle Gallery for other property types
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
        }
        break;
      
      case 6: // Schedule or Gallery for PG/Hostel
        if (formType === 'pg_hostel') {
          // Handle PG/Hostel gallery
          // Handle image uploads if images are File objects
          let imageUrls: string[] = [];
          if (stepData.images && Array.isArray(stepData.images) && stepData.images.length > 0) {
            // Check if images are File objects or already URLs
            const firstImage = stepData.images[0];
            if (firstImage instanceof File) {
              console.log('Uploading PG/Hostel images to storage...');
              try {
                const uploadResults = await uploadPropertyImagesByType(
                  stepData.images as File[],
                  'PG/Hostel',
                  user.id
                );
                imageUrls = uploadResults.map(result => result.url);
                console.log('PG/Hostel images uploaded successfully:', imageUrls);
              } catch (error) {
                console.error('Error uploading PG/Hostel images:', error);
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
            categorized_images: stepData.categorizedImages,
            video: stepData.video
          };
          console.log('PG/Hostel step 6 gallery update data:', updateData);
        } else {
          // Handle Schedule for other property types
          updateData = {
            ...updateData,
            schedule_info: stepData
          };
        }
        break;
      
      case 7: // Schedule for PG/Hostel
        if (formType === 'pg_hostel') {
          updateData = {
            ...updateData,
            schedule_info: stepData
          };
          console.log('PG/Hostel step 7 schedule update data:', updateData);
        }
        break;
    }

    console.log('Final updateData:', updateData);

    if (draftId) {
      // Load existing draft to preserve existing data
      const existingDraft = await this.getDraft(draftId);
      if (existingDraft) {
        // Merge existing additional_info with new data
        const mergedUpdateData = {
          ...updateData,
          additional_info: {
            ...existingDraft.additional_info,
            ...updateData.additional_info
          }
        };
        console.log('Merged updateData with existing additional_info:', mergedUpdateData);
        return await this.updateDraft(draftId, mergedUpdateData);
      } else {
        // Fallback to regular update if draft not found
        return await this.updateDraft(draftId, updateData);
      }
    } else {
      // Create new draft
      return await this.createDraft({
        ...updateData,
        // Don't pass user_id here - createDraft will handle it
        // Only set property_type if not already set from step 1
        property_type: updateData.property_type || (formType === 'rental' ? 'Residential' : 
                      formType === 'sale' ? 'Residential' :
                      formType === 'commercial' ? 'Commercial' : 
                      formType === 'commercial-sale' ? 'Commercial' : 
                      formType === 'pg_hostel' ? 'PG/Hostel' : 'Land/Plot'),
        listing_type: formType === 'rental' ? 'Rent' : 
                     formType === 'sale' ? 'Sale' :
                     formType === 'commercial' ? 'Rent' : 
                     formType === 'commercial-sale' ? 'Sale' : 
                     formType === 'pg_hostel' ? 'Rent' : 'Rent'
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

  /**
   * Load draft data for resuming a form
   */
  static async loadDraftForResume(draftId: string): Promise<{
    ownerInfo: any;
    formData: any;
    currentStep: number;
  } | null> {
    try {
      const draft = await this.getDraft(draftId);
      if (!draft) return null;

      console.log('Loading draft for resume:', draft);
      console.log('🔍 Draft boolean fields:', {
        gym: draft.gym,
        gym_type: typeof draft.gym,
        gated_security: draft.gated_security,
        gated_security_type: typeof draft.gated_security,
        non_veg_allowed: draft.non_veg_allowed,
        non_veg_allowed_type: typeof draft.non_veg_allowed,
        pet_allowed: draft.pet_allowed,
        pet_allowed_type: typeof draft.pet_allowed,
        more_similar_units: draft.more_similar_units,
        more_similar_units_type: typeof draft.more_similar_units
      });

      // Extract owner info
      const ownerInfo = {
        fullName: draft.owner_name || '',
        email: draft.owner_email || '',
        phoneNumber: draft.owner_phone || '',
        whatsappUpdates: draft.whatsapp_updates || false,
        propertyType: draft.property_type as 'Residential' | 'Commercial' | 'Land/Plot',
        listingType: draft.listing_type as 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates' | 'Sale' | 'Industrial land' | 'Agricultural Land' | 'Commercial land'
      };

      // Extract form data based on property type
      let formData: any = {};

      if (draft.property_type === 'PG/Hostel') {
        formData = {
          // Room Types
          roomTypes: {
            selectedTypes: draft.additional_info?.room_type ? [draft.additional_info.room_type] : []
          },
          // Room Details
          roomDetails: {
            roomTypeDetails: draft.expected_rent ? {
              [draft.additional_info?.room_type || 'single']: {
                expectedRent: draft.expected_rent,
                expectedDeposit: draft.expected_deposit || 0,
                availableRooms: 1
              }
            } : {},
            roomAmenities: draft.additional_info?.room_amenities || {
              cupboard: false,
              geyser: false,
              tv: false,
              ac: false,
              bedding: false,
              attachedBathroom: false
            }
          },
          // Location Details
          localityDetails: {
            state: draft.state || '',
            city: draft.city || '',
            locality: draft.locality || '',
            pincode: draft.pincode || '',
            societyName: draft.society_name || '',
            landmark: draft.landmark || ''
          },
          // PG Details
          pgDetails: {
            genderPreference: draft.additional_info?.gender_preference || 'anyone',
            preferredGuests: draft.additional_info?.preferred_guests || '',
            gateClosingTime: draft.additional_info?.gate_closing_time || '',
            foodIncluded: draft.additional_info?.food_included || ''
          },
          // Amenities
          amenities: {
            laundry: draft.additional_info?.available_services?.laundry || '',
            roomCleaning: draft.additional_info?.available_services?.room_cleaning || '',
            wardenFacility: draft.additional_info?.available_services?.warden_facility || '',
            waterStorageFacility: draft.additional_info?.water_storage_facility || false,
            wifi: draft.additional_info?.wifi || false,
            commonTv: draft.additional_info?.common_tv || false,
            refrigerator: draft.additional_info?.refrigerator || false,
            mess: draft.additional_info?.mess || false,
            cookingAllowed: draft.additional_info?.cooking_allowed || false,
            powerBackup: draft.power_backup || false,
            lift: draft.lift || false,
            parking: draft.parking || '',
            security: draft.security || '',
            currentPropertyCondition: draft.current_property_condition || '',
            directionsTip: draft.directions_tip || ''
          },
          // Gallery
          gallery: {
            images: draft.images || [],
            video: draft.video || null
          },
          // Schedule Info
          scheduleInfo: draft.schedule_info || {
            startTime: '',
            endTime: '',
            availability: '',
            availableAllDay: false,
            cleaningService: '',
            paintingService: ''
          }
        };
      } else if (draft.property_type === 'flatmates' || draft.property_type === 'Flatmates') {
        formData = {
          // Property Details
          propertyDetails: {
            apartmentType: draft.apartment_type || '',
            apartmentName: draft.apartment_name || '',
            bhkType: draft.bhk_type || '',
            floorNo: (() => {
              const floorNo = draft.floor_no || 0;
              // Convert special numeric values back to string values for form
              switch (floorNo) {
                case -1:
                  return 'full'; // "Full Building"
                case -2:
                  return 'lower'; // "Lower Basement"
                case -3:
                  return 'upper'; // "Upper Basement"
                case 99:
                  return '99+'; // "99+"
                default:
                  return floorNo;
              }
            })(),
            totalFloors: draft.total_floors || 0,
            roomType: draft.room_type || '',
            tenantType: draft.preferred_tenant || '',
            propertyAge: draft.property_age || '',
            facing: draft.facing || '',
            builtUpArea: draft.built_up_area || 0
          },
          // Location Details
          locationDetails: {
            state: draft.state || '',
            city: draft.city || '',
            locality: draft.locality || '',
            pincode: draft.pincode || '',
            societyName: draft.society_name || '',
            landmark: draft.landmark || ''
          },
          // Rental Details - using correct field names for FlattmatesRentalDetailsStep
          rentalDetails: {
            expectedRent: draft.expected_rent || 0,
            expectedDeposit: draft.expected_deposit || draft.security_deposit || 0,
            rentNegotiable: draft.rent_negotiable || false,
            monthlyMaintenance: draft.monthly_maintenance || '',
            availableFrom: draft.available_from || '',
            description: draft.description || ''
          },
          // Amenities - using correct field names for AmenitiesStep
          amenities: {
            bathrooms: draft.bathrooms || 0,
            balconies: draft.balconies || 0,
            waterSupply: draft.water_supply || '',
            petAllowed: typeof draft.pet_allowed === 'string' ? draft.pet_allowed === 'true' : (draft.pet_allowed || false),
            gym: typeof draft.gym === 'string' ? draft.gym === 'true' : (draft.gym || false),
            nonVegAllowed: typeof draft.non_veg_allowed === 'string' ? draft.non_veg_allowed === 'true' : (draft.non_veg_allowed || false),
            gatedSecurity: typeof draft.gated_security === 'string' ? draft.gated_security === 'true' : (draft.gated_security || false),
            whoWillShow: draft.who_will_show || '',
            currentPropertyCondition: draft.current_property_condition || '',
            secondaryNumber: draft.secondary_number || '',
            moreSimilarUnits: typeof draft.more_similar_units === 'string' ? draft.more_similar_units === 'true' : (draft.more_similar_units || false),
            directionsTip: draft.directions_tip || '',
            lift: draft.lift || 'Not Available',
            powerBackup: draft.power_backup || 'Not Available',
            waterStorageFacility: draft.water_storage_facility || 'Not Available',
            security: draft.security || 'Not Available',
            wifi: draft.wifi || 'Not Available',
            internetServices: draft.internet_services || 'Not Available',
            airConditioner: draft.air_conditioner || 'Not Available',
            clubHouse: draft.club_house || 'Not Available',
            intercom: draft.intercom || 'Not Available',
            swimmingPool: draft.swimming_pool || 'Not Available',
            childrenPlayArea: draft.children_play_area || 'Not Available',
            joggingTrack: draft.jogging_track || 'Not Available',
            landscapedGarden: draft.landscaped_garden || 'Not Available',
            rainwaterHarvesting: draft.rainwater_harvesting || 'Not Available',
            vaastuCompliant: draft.vaastu_compliant || 'Not Available',
            parking: draft.parking || 'Not Available'
          },
          // Gallery
          gallery: {
            images: draft.images || [],
            video: draft.video || undefined
          },
          // Additional Info
          additionalInfo: {
            description: draft.description || '',
            previousOccupancy: '',
            paintingRequired: '',
            cleaningRequired: ''
          },
          // Schedule Info
          scheduleInfo: draft.schedule_info || {
            availability: 'everyday',
            paintingService: 'decline',
            cleaningService: 'decline',
            startTime: '',
            endTime: '',
            availableAllDay: true
          }
        };
      } else {
        // For other property types (rental, sale, commercial, land)
        formData = {
          // Property Details - using correct field names for PropertyDetailsStep
          propertyDetails: {
            title: draft.apartment_name || draft.title || '',
            propertyType: draft.property_type || 'Residential',
            buildingType: draft.building_type || '',
            bhkType: draft.bhk_type || '',
            propertyAge: draft.property_age || '',
            facing: draft.facing || '',
            floorType: draft.floor_type || '',
            totalFloors: draft.total_floors || 1,
            floorNo: (() => {
              const floorNo = draft.floor_no || 0;
              // Convert special numeric values back to string values for form
              switch (floorNo) {
                case -1:
                  return 'full'; // "Full Building"
                case -2:
                  return 'lower'; // "Lower Basement"
                case -3:
                  return 'upper'; // "Upper Basement"
                case 99:
                  return '99+'; // "99+"
                default:
                  return floorNo;
              }
            })(),
            superBuiltUpArea: draft.super_built_up_area || draft.built_up_area || 0,
            onMainRoad: draft.on_main_road || false,
            cornerProperty: draft.corner_property || false,
            // Commercial specific
            spaceType: draft.space_type || '',
            furnishingStatus: draft.furnishing_status || '',
            powerLoad: draft.power_load || '',
            ceilingHeight: draft.ceiling_height || '',
            entranceWidth: draft.entrance_width || '',
            loadingFacility: draft.loading_facility || false,
            // Land/Plot specific
            plotArea: draft.plot_area || 0,
            plotAreaUnit: draft.plot_area_unit || 'sq-ft',
            plotLength: draft.plot_length || 0,
            plotWidth: draft.plot_width || 0,
            boundaryWall: draft.boundary_wall || '',
            cornerPlot: draft.corner_plot || false,
            roadFacing: draft.road_facing || '',
            roadWidth: draft.road_width || 0,
            landType: draft.land_type || '',
            plotShape: draft.plot_shape || '',
            gatedCommunity: draft.gated_community || false,
            gatedProject: draft.gated_project || '',
            floorsAllowed: draft.floors_allowed || 0,
            surveyNumber: draft.survey_number || '',
            subDivision: draft.sub_division || '',
            villageName: draft.village_name || ''
          },
          // Location Details
          locationDetails: {
            state: draft.state || '',
            city: draft.city || '',
            locality: draft.locality || '',
            pincode: draft.pincode || '',
            societyName: draft.society_name || '',
            landmark: draft.landmark || ''
          },
          // Rental Details - for commercial rent properties
          rentalDetails: {
            listingType: 'Rent',
            expectedPrice: draft.expected_rent || draft.expected_price || 0,
            rentNegotiable: draft.rent_negotiable || false,
            maintenanceExtra: draft.maintenance_extra || false,
            maintenanceCharges: draft.maintenance_charges || 0,
            securityDeposit: draft.expected_deposit || draft.security_deposit || 0,
            depositNegotiable: draft.deposit_negotiable || false,
            leaseDuration: draft.lease_duration || '',
            lockinPeriod: draft.lockin_period || '',
            availableFrom: draft.available_from || '',
            businessType: draft.business_type ? (Array.isArray(draft.business_type) ? draft.business_type : [draft.business_type]) : [],
            leaseTerm: draft.lease_term || '',
            restrictedActivities: draft.restricted_activities ? (Array.isArray(draft.restricted_activities) ? draft.restricted_activities : [draft.restricted_activities]) : []
          },
          // Sale Details - using correct field names for SaleDetailsStep
          saleDetails: {
            listingType: 'Sale',
            expectedPrice: draft.expected_price || draft.expected_rent || 0,
            priceNegotiable: draft.price_negotiable || true,
            possessionDate: draft.possession_date || '',
            registrationStatus: draft.registration_status || 'ready_to_move',
            homeLoanAvailable: draft.home_loan_available || true,
            maintenanceCharges: draft.maintenance_charges || 0,
            pricePerSqFt: draft.price_per_sqft || 0,
            bookingAmount: draft.booking_amount || 0,
            propertyAge: draft.property_age || '',
            description: draft.description || ''
          },
          // Amenities
          amenities: {
            furnishing: draft.furnishing || '',
            parking: draft.parking || '',
            powerBackup: draft.power_backup || '',
            lift: draft.lift || '',
            waterSupply: draft.water_supply || '',
            security: draft.security || '',
            gym: draft.gym || '',
            gatedSecurity: draft.gated_security || '',
            currentPropertyCondition: draft.current_property_condition || '',
            directionsTip: draft.directions_tip || '',
            bathrooms: draft.bathrooms || 0,
            balconies: draft.balconies || 0,
            // Land/Plot specific amenities
            waterSupply: draft.water_supply || '',
            electricityConnection: draft.electricity_connection || '',
            sewageConnection: draft.sewage_connection || '',
            roadWidth: draft.road_width || 0,
            gatedSecurity: draft.gated_security || '',
            directionsToProperty: draft.directions_tip || ''
          },
          // Gallery
          gallery: {
            images: draft.images || [],
            video: draft.video || undefined,
            categorizedImages: draft.categorized_images || {}
          },
          // Additional Info
          additionalInfo: {
            description: draft.description || ''
          },
          // Schedule Info
          scheduleInfo: draft.schedule_info || {
            availability: 'everyday',
            paintingService: 'decline',
            cleaningService: 'decline',
            startTime: '',
            endTime: '',
            availableAllDay: true
          }
        };
      }

      return {
        ownerInfo,
        formData,
        currentStep: draft.current_step || 1
      };
    } catch (error) {
      console.error('Error loading draft for resume:', error);
      return null;
    }
  }
}
