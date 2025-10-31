// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { ContactOwnerModal } from '@/components/ContactOwnerModal';
import { ScheduleVisitModal } from '@/components/ScheduleVisitModal';
import EMICalculatorModal from '@/components/EMICalculatorModal';
import LegalServicesForm from '@/components/LegalServicesForm';
import { PropertyHero } from '@/components/property-details/PropertyHero';
import { PropertyDetailsCard } from '@/components/property-details/PropertyDetailsCard';
import { LocationCard } from '@/components/property-details/LocationCard';
import { OverviewCard } from '@/components/property-details/OverviewCard';


import { AmenitiesCard } from '@/components/property-details/AmenitiesCard';
import { NeighborhoodCard } from '@/components/property-details/NeighborhoodCard';
import { RelatedPropertiesCard } from '@/components/property-details/RelatedPropertiesCard';
import { PropertyHeader } from '@/components/property-details/PropertyHeader';
import { PropertyImageGallery } from '@/components/property-details/PropertyImageGallery';
import { PropertyInfoCards } from '@/components/property-details/PropertyInfoCards';
import { PropertyActions } from '@/components/property-details/PropertyActions';
import { PropertyWatermark } from '@/components/property-details/PropertyWatermark';
import { ReportSection } from '@/components/property-details/ReportSection';
import { ServicesCard } from '@/components/property-details/ServicesCard';
import { DescriptionCard } from '@/components/property-details/DescriptionCard';
import { PGRoomsCard } from '@/components/property-details/PGRoomsCard';
import { RentalStatusService } from '@/services/rentalStatusService';
import { supabase } from '@/integrations/supabase/client';
interface Property {
  id: string;
  user_id?: string; // Add user_id for ownership check
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price: number;
  super_area?: number;
  carpet_area?: number;
  bathrooms?: number;
  balconies?: number;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  description?: string;
  images?: string[];
  videos?: string[];
  status: string;
  rental_status?: 'available' | 'inactive' | 'rented' | 'sold';
  created_at: string;
  amenities?: any; // May come as JSONB object
  additional_documents?: Record<string, boolean>;
  // Extra optional fields for richer display
  security_deposit?: number | null;
  available_from?: string | null;
  parking?: string | null;
  age_of_building?: string | null;
  preferred_tenant?: string | null;
  plot_area_unit?: string;
  is_premium?: boolean;
  // Note: Owner contact info removed for security
}
const PropertyDetails: React.FC = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const propertyFromState = location.state as Property | undefined || null;
  
  // Also check sessionStorage for property data (when opened in new tab)
  const getInitialProperty = () => {
    if (propertyFromState) return propertyFromState;
    if (id) {
      const stored = sessionStorage.getItem(`property-${id}`);
      if (stored) {
        try {
          return JSON.parse(stored) as Property;
        } catch (e) {
          console.error('Failed to parse stored property data:', e);
        }
      }
    }
    return null;
  };
  
  const [property, setProperty] = React.useState<Property | null>(getInitialProperty());
  const [showContactModal, setShowContactModal] = React.useState(false);
  const [showScheduleVisitModal, setShowScheduleVisitModal] = React.useState(false);
  const [showEMICalculatorModal, setShowEMICalculatorModal] = React.useState(false);
  const [showLegalServicesModal, setShowLegalServicesModal] = React.useState(false);
  const [dbAmenities, setDbAmenities] = React.useState<any | null>(null);
  const [dbAdditionalDocs, setDbAdditionalDocs] = React.useState<Record<string, boolean> | null>(null);
  const [pgHostelData, setPgHostelData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);
  
  React.useEffect(() => {
    document.title = property ? `${property.title} | Property Details` : 'Property Details';
  }, [property]);

  // Handler for property status updates
  const handlePropertyStatusUpdate = (newStatus: 'available' | 'inactive' | 'rented' | 'sold') => {
    if (property) {
      setProperty({
        ...property,
        rental_status: newStatus
      });
    }
  };
  
  // Function to fetch latest property data from database
  const fetchLatestPropertyData = async () => {
    if (!id) return;
    
    console.log('🔍 PropertyDetails: Starting fetch for propertyId:', id);
    setLoading(true);
    try {
      // First, use secure public function (works for anonymous users)
      const { data: pubData, error: pubError } = await supabase
        .rpc('get_public_property_by_id', { property_id: id });

      if (!pubError && pubData && pubData.length > 0) {
        const raw = pubData[0] as any;
        console.log('✅ PropertyDetails: Found property:', raw);
        console.log('🔍 PropertyDetails: Property type from raw data:', raw.property_type);
        console.log('🔍 PropertyDetails: Checking if data is complete...');
        console.log('🔍 PropertyDetails: available_services:', raw.available_services);
        console.log('🔍 PropertyDetails: preferred_tenant:', raw.preferred_tenant);
        console.log('🔍 PropertyDetails: food_included:', raw.food_included);
        console.log('🔍 PropertyDetails: gate_closing_time:', raw.gate_closing_time);
        // Normalize image paths to public URLs
        const normalize = (s: string): string | null => {
          if (!s) return null;
          const rawStr = String(s).trim();
          if (/^https?:\/\//i.test(rawStr) || /^data:/i.test(rawStr) || rawStr.startsWith('/')) return rawStr;
          // Strip common prefixes
          const cleaned = rawStr
            .replace(/^\/?storage\/v1\/object\/public\/property-media\//i, '')
            .replace(/^property-media\//i, '')
            .replace(/^public\//i, '');
          try {
            const { data } = supabase.storage.from('property-media').getPublicUrl(cleaned);
            return data.publicUrl || null;
          } catch {
            return null;
          }
        };
        const normalizedImages = Array.isArray(raw.images)
          ? (raw.images.map((i: any) => typeof i === 'string' ? normalize(i) : normalize(i?.url)).filter(Boolean))
          : [];
        let propertyWithUserId = { 
          ...(raw as Property), 
          images: normalizedImages as string[],
          user_id: raw.user_id // Explicitly ensure user_id is included
        } as Property;

        console.log('🔍 PropertyDetails: Processing property data, type:', propertyWithUserId.property_type);

        // Check if data is complete (same logic as PropertyPreviewPage)
        const hasCompleteData = propertyWithUserId.expected_deposit !== undefined && 
                               propertyWithUserId.preferred_tenant !== undefined && 
                               propertyWithUserId.property_age !== null && 
                               (propertyWithUserId.amenities && Object.keys(propertyWithUserId.amenities).length > 0);
        
        console.log('🔍 PropertyDetails: Data completeness check:', {
          hasCompleteData,
          expected_deposit: propertyWithUserId.expected_deposit,
          preferred_tenant: propertyWithUserId.preferred_tenant,
          property_age: propertyWithUserId.property_age,
          amenities_count: propertyWithUserId.amenities ? Object.keys(propertyWithUserId.amenities).length : 0
        });

        // If data is incomplete, fetch from property_submissions (same as PropertyPreviewPage)
        if (!hasCompleteData) {
          console.log('🔍 PropertyDetails: Data incomplete, checking property_submissions...');
          try {
            const { data: subData, error: subErr } = await supabase
              .from('property_submissions')
              .select('*')
              .eq('id', id)
              .single();

            if (!subErr && subData) {
              console.log('✅ PropertyDetails: Found complete data in property_submissions:', subData);
              const payload = subData.payload as any;
              
              // Apply the same data mapping as PropertyPreviewPage
              propertyWithUserId = {
                ...propertyWithUserId,
                // Handle PG/Hostel-specific fields
                place_available_for: payload?.place_available_for || payload?.gender_preference,
                food_included: payload?.food_included,
                gate_closing_time: payload?.gate_closing_time,
                available_services: payload?.available_services,
                room_amenities: payload?.room_amenities,
                // Map amenities the same way as preview
                amenities: {
                  lift: payload?.amenities?.lift,
                  powerBackup: payload?.amenities?.powerBackup || payload?.power_backup,
                  waterSupply: payload?.amenities?.waterSupply || payload?.water_supply,
                  security: payload?.amenities?.security || payload?.security,
                  gym: payload?.amenities?.gym,
                  gatedSecurity: payload?.amenities?.gatedSecurity === true || payload?.amenities?.gatedSecurity === 'true' || payload?.amenities?.gatedSecurity === '1',
                  bathrooms: payload?.bathrooms || 0,
                  balconies: payload?.balconies || 0,
                  
                  // PG/Hostel-specific amenities from additional_info
                  common_tv: payload?.additional_info?.common_tv,
                  refrigerator: payload?.additional_info?.refrigerator,
                  mess: payload?.additional_info?.mess,
                  cooking_allowed: payload?.additional_info?.cooking_allowed,
                  room_amenities: payload?.additional_info?.room_amenities,
                  // Convert string booleans to actual booleans
                  petAllowed: payload?.amenities?.petAllowed === true || payload?.amenities?.petAllowed === 'true' || payload?.amenities?.petAllowed === '1',
                  nonVegAllowed: payload?.amenities?.nonVegAllowed === true || payload?.amenities?.nonVegAllowed === 'true' || payload?.amenities?.nonVegAllowed === '1',
                  whoWillShow: payload?.amenities?.whoWillShow,
                  currentPropertyCondition: payload?.amenities?.currentPropertyCondition,
                  // ... other amenities
                }
              };
              console.log('🔍 PropertyDetails: Updated property data with submission data:', propertyWithUserId);
            }
          } catch (e) {
            console.warn('PropertyDetails: Failed to fetch from property_submissions (non-fatal):', e);
          }
        }

        // For Flatmates and PG/Hostel properties, use the same logic as PropertyPreviewPage
        const isFlatmatesOrPG = propertyWithUserId.property_type === 'flatmates' || 
            propertyWithUserId.property_type === 'pg_hostel' ||
            propertyWithUserId.property_type?.toLowerCase().includes('pg') ||
            propertyWithUserId.property_type?.toLowerCase().includes('hostel');
            
        console.log('🔍 PROPERTY TYPE DEBUG:', {
          property_type: propertyWithUserId.property_type,
          isFlatmatesOrPG: isFlatmatesOrPG,
          id: id
        });
        
        if (isFlatmatesOrPG) {
          console.log('🔍 FLATMATES/PG DEBUG: Detected Flatmates/PG property, fetching submission data...');
          try {
            // Use the exact same data retrieval logic as PropertyPreviewPage
            const { data: subData, error: subErr } = await supabase
              .from('property_submissions')
              .select('*')
              .eq('id', id)
              .single();

            console.log('🔍 FLATMATES/PG DEBUG: Submission data:', subData);
            console.log('🔍 FLATMATES/PG DEBUG: Submission error:', subErr);

            if (!subErr && subData) {
              const payload = subData.payload as any;
              console.log('🔍 FLATMATES/PG DEBUG: Payload:', payload);
              console.log('🔍 FLATMATES/PG DEBUG: Preferred tenant from payload:', payload?.preferred_tenant);
              console.log('🔍 FLATMATES/PG DEBUG: Food included from payload:', payload?.food_included);
              console.log('🔍 FLATMATES/PG DEBUG: Gate closing time from payload:', payload?.gate_closing_time);
              console.log('🔍 FLATMATES/PG DEBUG: Available services from payload:', payload?.available_services);
              console.log('🔍 FLATMATES/PG DEBUG: Additional info from payload:', payload?.additional_info);
              
              // Apply the same data mapping as PropertyPreviewPage
              propertyWithUserId = {
                ...propertyWithUserId,
                // Handle Flatmates-specific fields
                preferred_tenant: payload?.preferred_tenant || (payload?.property_type === 'flatmates' ? payload?.gender_preference_flatmates : null),
                bathrooms: payload?.bathrooms || 0,
                balconies: payload?.balconies || 0,
                // Hide parking for Flatmates (set to null so it doesn't display)
                parking: payload?.property_type === 'flatmates' ? null : payload?.parking,
                
                // Handle PG/Hostel-specific fields
                place_available_for: payload?.place_available_for || payload?.gender_preference,
                food_included: payload?.food_included,
                gate_closing_time: payload?.gate_closing_time,
                available_services: payload?.available_services,
                room_amenities: payload?.room_amenities,
                // Map amenities the same way as preview
                amenities: {
                  lift: payload?.amenities?.lift,
                  powerBackup: payload?.amenities?.powerBackup || payload?.power_backup,
                  waterSupply: payload?.amenities?.waterSupply || payload?.water_supply,
                  security: payload?.amenities?.security || payload?.security,
                  gym: payload?.amenities?.gym,
                  gatedSecurity: payload?.amenities?.gatedSecurity === true || payload?.amenities?.gatedSecurity === 'true' || payload?.amenities?.gatedSecurity === '1',
                  bathrooms: payload?.bathrooms || 0,
                  balconies: payload?.balconies || 0,
                  // Flatmates-specific amenities from additional_info
                  attachedBathroom: payload?.additional_info?.attachedBathroom,
                  smokingAllowed: payload?.additional_info?.smokingAllowed,
                  drinkingAllowed: payload?.additional_info?.drinkingAllowed,
                  secondaryNumber: payload?.additional_info?.secondaryNumber,
                  moreSimilarUnits: payload?.additional_info?.moreSimilarUnits,
                  
                  // PG/Hostel-specific amenities from additional_info
                  common_tv: payload?.additional_info?.common_tv,
                  refrigerator: payload?.additional_info?.refrigerator,
                  mess: payload?.additional_info?.mess,
                  cooking_allowed: payload?.additional_info?.cooking_allowed,
                  room_amenities: payload?.additional_info?.room_amenities,
                  // Convert string booleans to actual booleans
                  petAllowed: payload?.amenities?.petAllowed === true || payload?.amenities?.petAllowed === 'true' || payload?.amenities?.petAllowed === '1',
                  nonVegAllowed: payload?.amenities?.nonVegAllowed === true || payload?.amenities?.nonVegAllowed === 'true' || payload?.amenities?.nonVegAllowed === '1',
                  whoWillShow: payload?.amenities?.whoWillShow,
                  currentPropertyCondition: payload?.amenities?.currentPropertyCondition,
                  directionsTip: payload?.amenities?.directionsTip,
                  internetServices: payload?.amenities?.internetServices,
                  airConditioner: payload?.amenities?.airConditioner,
                  clubHouse: payload?.amenities?.clubHouse,
                  intercom: payload?.amenities?.intercom,
                  swimmingPool: payload?.amenities?.swimmingPool,
                  childrenPlayArea: payload?.amenities?.childrenPlayArea,
                  fireSafety: payload?.amenities?.fireSafety,
                  servantRoom: payload?.amenities?.servantRoom,
                  shoppingCenter: payload?.amenities?.shoppingCenter,
                  gasPipeline: payload?.amenities?.gasPipeline,
                  park: payload?.amenities?.park,
                  rainWaterHarvesting: payload?.amenities?.rainWaterHarvesting,
                  sewageTreatmentPlant: payload?.amenities?.sewageTreatmentPlant,
                  houseKeeping: payload?.amenities?.houseKeeping,
                  visitorParking: payload?.amenities?.visitorParking,
                  waterStorageFacility: payload?.amenities?.waterStorageFacility,
                  wifi: payload?.amenities?.wifi,
                  furnishing: payload?.furnishing,
                  parking: payload?.parking
                }
              };
            }
          } catch (e) {
            console.warn('Flatmates/PG data hydration failed (non-fatal):', e);
          }
          console.log('🔍 FLATMATES/PG DEBUG: Final property data after mapping:', propertyWithUserId);
        } else {
          // Original logic for non-Flatmates properties
          // Hydrate furnishing/possession/amenities from original submission when missing (commercial/sale cases)
          try {
            const { data: subData, error: subErr } = await supabase
              .from('property_submissions')
              .select('payload')
              .eq('id', id)
              .maybeSingle();
            if (!subErr && subData?.payload) {
            const orig = subData.payload?.originalFormData?.propertyInfo || {};
            const pd = orig?.propertyDetails || {};
            const rd = orig?.rentalDetails || {};
            const amenities = orig?.amenities || {};
            const sale = orig?.saleDetails || {};
            const cs = orig?.commercialSaleDetails || {};
            
            // Extract various fields from form data
            const furnishingStatus = amenities?.furnishing || pd?.furnishingStatus || subData.payload?.furnishing_status || subData.payload?.furnishing;
            const propertyAge = pd?.propertyAge || subData.payload?.age_of_building || subData.payload?.property_age;
            const possessionDate = sale?.possessionDate || cs?.availableFrom || cs?.possessionDate || rd?.availableFrom || subData.payload?.available_from;
            const parking = amenities?.parking || subData.payload?.parking;
            const waterSupply = amenities?.waterSupply || subData.payload?.water_supply;
            const powerBackup = amenities?.powerBackup || subData.payload?.power_backup;
            // For Flatmates properties, get preferred_tenant from the correct field
            const preferredTenant = subData.payload?.property_type === 'flatmates' 
              ? subData.payload?.preferred_tenant 
              : (rd?.idealFor || subData.payload?.preferred_tenant);
            const securityDeposit = rd?.securityDeposit || subData.payload?.security_deposit;
            // For Flatmates properties, get bathrooms and balconies from the correct fields
            const bathrooms = subData.payload?.property_type === 'flatmates'
              ? (subData.payload?.bathrooms || amenities?.bathrooms || pd?.bathrooms)
              : (amenities?.bathrooms || pd?.bathrooms || subData.payload?.bathrooms);
            const balconies = subData.payload?.property_type === 'flatmates'
              ? (subData.payload?.balconies || amenities?.balconies || pd?.balconies)
              : (amenities?.balconies || pd?.balconies || subData.payload?.balconies);
            const floorNo = pd?.floorNo || subData.payload?.floor_no;
            const totalFloors = pd?.totalFloors || subData.payload?.total_floors;
            const facing = pd?.facing || subData.payload?.facing_direction;
            const floorType = pd?.floorType || subData.payload?.floor_type;
            
            // Amenities may be captured under propertyInfo.amenities or at root payload. Prefer propertyInfo
            const amenitiesFromForm = orig?.amenities || subData.payload?.amenities;

            const merged: Partial<Property> = { ...propertyWithUserId };
            if (!merged.furnishing_status && furnishingStatus) Object.assign(merged, { furnishing_status: String(furnishingStatus) });
            if (!merged.age_of_building && propertyAge) Object.assign(merged, { age_of_building: String(propertyAge) });
            if (!merged.available_from && possessionDate) Object.assign(merged, { available_from: String(possessionDate) });
            if (!merged.parking && parking) Object.assign(merged, { parking: String(parking) });
            if (!merged.water_supply && waterSupply) Object.assign(merged, { water_supply: String(waterSupply) });
            if (!merged.power_backup && powerBackup) Object.assign(merged, { power_backup: String(powerBackup) });
            if (!merged.preferred_tenant && preferredTenant) {
              // Handle array format from idealFor field
              const tenantValue = Array.isArray(preferredTenant) ? preferredTenant.join(', ') : String(preferredTenant);
              Object.assign(merged, { preferred_tenant: tenantValue });
            }
            if ((!merged.bathrooms || merged.bathrooms === 0) && bathrooms) Object.assign(merged, { bathrooms: Number(bathrooms) });
            if ((!merged.balconies || merged.balconies === 0) && balconies) Object.assign(merged, { balconies: Number(balconies) });
            if ((!merged.security_deposit || merged.security_deposit === 0) && securityDeposit !== undefined && securityDeposit !== null) {
              Object.assign(merged, { security_deposit: Number(securityDeposit) });
            }
            if (!merged.floor_no && floorNo !== undefined) Object.assign(merged, { floor_no: Number(floorNo) });
            if (!merged.total_floors && totalFloors) Object.assign(merged, { total_floors: Number(totalFloors) });
            if (!merged.facing_direction && facing) Object.assign(merged, { facing_direction: String(facing) });
            if (!merged.floor_type && floorType) Object.assign(merged, { floor_type: String(floorType) });
            
            type WithAmenities = Partial<Property> & { amenities?: unknown };
            const mergedWithAmenities = merged as WithAmenities;
            if (!mergedWithAmenities.amenities && amenitiesFromForm) {
              mergedWithAmenities.amenities = amenitiesFromForm as unknown;
            }
            propertyWithUserId = mergedWithAmenities as Property;
          }
          } catch (e) {
            console.warn('Hydration from submission payload failed (non-fatal):', e);
          }
        }
        console.log('🔍 PropertyDetails: Final property data before setting:', propertyWithUserId);
        console.log('🔍 PropertyDetails: Property type in final data:', propertyWithUserId.property_type);
        console.log('Setting property from RPC with user_id:', propertyWithUserId.user_id);
        
        // Fetch rental status for this property
        const rentalStatus = await RentalStatusService.getPropertyRentalStatus(propertyWithUserId.id);
        console.log('PropertyDetails: Fetched rental status:', rentalStatus);
        
        setProperty({
          ...propertyWithUserId,
          rental_status: rentalStatus
        });
        return;
      }

      // Fallback for admins/owners (direct table access)
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      console.log('Properties table query result (fallback):', { propertyData, propertyError });

      if (propertyData && !propertyError) {
        const raw = propertyData as any;
        console.log('Raw property data from properties table:', raw);
        console.log('Property user_id field:', raw.user_id);
        const normalizedImages = Array.isArray(raw.images) ? raw.images : [];
        const propertyWithUserId = { 
          ...(raw as Property), 
          images: normalizedImages,
          user_id: raw.user_id // Explicitly ensure user_id is included
        } as Property;
        console.log('Setting property with user_id:', propertyWithUserId.user_id);
        
        // Fetch rental status for this property
        const rentalStatus = await RentalStatusService.getPropertyRentalStatus(propertyWithUserId.id);
        console.log('PropertyDetails: Fetched rental status from properties table:', rentalStatus);
        
        setProperty({
          ...propertyWithUserId,
          rental_status: rentalStatus
        });
        return;
      }

      // If not found in properties table, try property_submissions table
      console.log('Property not found in properties table, checking property_submissions...');
      const { data: submissionData, error: submissionError } = await supabase
        .from('property_submissions')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Property submissions table query result:', { submissionData, submissionError });

      if (submissionData && !submissionError) {
        console.log('Property data found in submissions table:', submissionData);
        
        // Extract property data from the payload
        const payload = submissionData.payload;
        if (payload && payload.images) {
          // Extract plot-specific info from original form data when available
          const originalForm = payload.originalFormData || {};
          const origPropertyInfo = originalForm.propertyInfo || {};
          const plotDetails = origPropertyInfo.plotDetails || {};
          const saleDetails = origPropertyInfo.saleDetails || {};
          const plotLength = plotDetails.plotLength;
          const plotWidth = plotDetails.plotWidth;
          const roadWidth = plotDetails.roadWidth || plotDetails.road_width; // support either
          const boundaryWall = plotDetails.boundaryWall;
          const ownershipType = saleDetails.ownershipType || saleDetails.ownership_type;
          const plotAreaUnit = payload.plot_area_unit || plotDetails.plotAreaUnit;
          
          // Extract PG/Hostel multi-room data if present
          const roomTypes = origPropertyInfo.roomTypes?.selectedTypes;
          const roomTypeDetails = origPropertyInfo.roomDetails?.roomTypeDetails;
          const roomAmenities = origPropertyInfo.roomDetails?.roomAmenities;
          const pgPreferredGuests = origPropertyInfo.pgDetails?.preferredGuests;
          const pgGenderPreference = origPropertyInfo.pgDetails?.genderPreference; // 'male' | 'female' | 'anyone'
          const pgFoodIncluded = origPropertyInfo.pgDetails?.foodIncluded; // 'yes' | 'no'
          const pgGateClosingTime = origPropertyInfo.pgDetails?.gateClosingTime;
          const pgAvailableFrom = origPropertyInfo.pgDetails?.availableFrom;
          const pgParkingType = origPropertyInfo.amenities?.parkingType || origPropertyInfo.amenities?.parking || payload.parking;

          const propertyFromSubmission = {
            id: submissionData.id,
            user_id: submissionData.user_id, // Add the missing user_id field
            title: submissionData.title || payload.title || 'Untitled Property',
            property_type: payload.property_type || 'apartment',
            listing_type: payload.listing_type || 'rent',
            bhk_type: payload.bhk_type,
            expected_price: payload.expected_price || 0,
            super_area: payload.super_area,
            carpet_area: payload.carpet_area,
            plot_area_unit: plotAreaUnit, // Ensure correct area unit for plots
            // Plot specific fields for display
            plot_length: typeof plotLength === 'number' ? plotLength : undefined,
            plot_width: typeof plotWidth === 'number' ? plotWidth : undefined,
            road_width: typeof roadWidth === 'number' ? roadWidth : undefined,
            boundary_wall: boundaryWall, // 'yes' | 'no' | 'partial'
            ownership_type: ownershipType, // 'freehold' | 'leasehold' | etc.
            owner_role: ownershipType, // also map to owner_role for existing components
            bathrooms: payload.bathrooms,
            balconies: payload.balconies,
            city: submissionData.city || payload.city || 'Unknown',
            locality: payload.locality || 'Unknown',
            state: submissionData.state || payload.state || 'Unknown',
            pincode: payload.pincode || '000000',
            description: payload.description,
            images: payload.images || [], // This should contain the uploaded image URLs
            videos: payload.videos || [],
            amenities: payload.amenities || null, // Add amenities from payload
            // Extra fields from payload to enrich preview
            security_deposit: payload.security_deposit ?? null,
            available_from: pgAvailableFrom || payload.available_from || null,
            // PG-specific fields from original form
            food_included: typeof pgFoodIncluded !== 'undefined' ? (pgFoodIncluded === 'yes' ? true : false) : undefined,
            gate_closing_time: pgGateClosingTime || undefined,
            place_available_for: pgGenderPreference || undefined,
            // Use raw parking selection from form when available (none|bike|car|both)
            parking: pgParkingType ?? payload.parking ?? null,
            age_of_building: payload.age_of_building ?? null,
            preferred_tenant: payload.preferred_tenant ?? null,
            // PG preferred guests mapped for compatibility
            ...(pgPreferredGuests ? { preferred_tenant: pgPreferredGuests } : {}),
            status: submissionData.status || 'pending',
            created_at: submissionData.created_at,
            // PG/Hostel specific multi-room details (from original form)
            pg_room_types: Array.isArray(roomTypes) ? roomTypes : undefined,
            pg_room_pricing: roomTypeDetails || undefined,
            pg_room_amenities: roomAmenities || undefined
          };
          
          console.log('Converted submission to property format:', propertyFromSubmission);
          console.log('Images array from submission:', payload.images);
          console.log('Images array length:', payload.images?.length);
          
          // Fetch rental status for this property
          const rentalStatus = await RentalStatusService.getPropertyRentalStatus(propertyFromSubmission.id);
          console.log('PropertyDetails: Fetched rental status from property_submissions:', rentalStatus);
          
          setProperty({
            ...propertyFromSubmission,
            rental_status: rentalStatus
          } as Property);
          return;
        }
      }

      // If neither table has the property
      if (propertyError && submissionError) {
        console.error('Property not found in either table:', { propertyError, submissionError });
      }
    } catch (err) {
      console.error('Failed to fetch latest property data', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest property data on component mount
  React.useEffect(() => {
    fetchLatestPropertyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Check for refresh parameter in URL and refetch data
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shouldRefresh = searchParams.get('refresh');
    
    if (shouldRefresh === 'true') {
      console.log('Refresh parameter detected, refetching property data...');
      fetchLatestPropertyData();
      
      // Remove the refresh parameter from URL without causing a page reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('refresh');
      window.history.replaceState({}, '', newUrl.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Refetch data when user returns to the page (e.g., after editing)
  React.useEffect(() => {
    const handleFocus = () => {
      console.log('Page focused, refetching property data...');
      fetchLatestPropertyData();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page visible, refetching property data...');
        fetchLatestPropertyData();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  // Fetch full amenities and PG/Hostel data from DB if they weren't passed via navigation state
  React.useEffect(() => {
    const loadPropertyData = async () => {
      if (!id) return;
      try {
        // Check if it's a PG/Hostel/Coliving property
        const type = property?.property_type?.toLowerCase() || '';
        const isPGHostel = type.includes('pg') || type.includes('hostel') || type.includes('coliving');
        
        if (isPGHostel) {
          // Fetch from pg_hostel_properties table
          const { data, error } = await supabase
            .rpc('get_public_pg_hostel_property_by_id', { property_id: id });
          
          const pgRow = (!error && data && data.length > 0) ? data[0] : null;
          
          if (!error && pgRow) {
            // Transform PG/Hostel data to match PropertyDetailsCard interface
            const transformedData = {
              ...property,
              expected_rent: pgRow.expected_rent,
              expected_deposit: pgRow.expected_deposit,
              place_available_for: pgRow.place_available_for,
              preferred_guests: pgRow.preferred_guests,
              available_from: pgRow.available_from,
              food_included: pgRow.food_included,
              gate_closing_time: pgRow.gate_closing_time,
              description: pgRow.description,
              amenities: pgRow.amenities,
              available_services: pgRow.available_services,
              parking: pgRow.parking,
              landmark: pgRow.landmark,
              state: pgRow.state,
              city: pgRow.city,
              locality: pgRow.locality,
              property_type: pgRow.property_type || property?.property_type,
            };

            // Also try to hydrate per-room data from original submission payload
            try {
              const { data: subData } = await supabase
                .from('property_submissions')
                .select('payload')
                .eq('id', id)
                .maybeSingle();

              const orig = subData?.payload?.originalFormData?.propertyInfo || {};
              const roomTypes = orig?.roomTypes?.selectedTypes;
              const roomDetails = orig?.roomDetails?.roomTypeDetails;
              const roomAmenities = orig?.roomDetails?.roomAmenities;
              const pgPreferredGuests = orig?.pgDetails?.preferredGuests;
              const pgAvailableFrom = orig?.pgDetails?.availableFrom;
              const pgFoodIncluded = orig?.pgDetails?.foodIncluded; // 'yes' | 'no'
              const pgGateClosingTime = orig?.pgDetails?.gateClosingTime;
              const pgParkingType = orig?.amenities?.parking;

              if (Array.isArray(roomTypes) && roomTypes.length > 0) {
                Object.assign(transformedData, {
                  pg_room_types: roomTypes,
                  pg_room_pricing: roomDetails || {},
                  pg_room_amenities: roomAmenities || {}
                });
              }

              // Fallbacks for header/info chips when RPC row is missing values
              if (!transformedData.preferred_guests && pgPreferredGuests) {
                Object.assign(transformedData, { preferred_guests: pgPreferredGuests });
              }
              if (!transformedData.available_from && pgAvailableFrom) {
                Object.assign(transformedData, { available_from: pgAvailableFrom });
              }
              if (typeof transformedData.food_included === 'undefined' && typeof pgFoodIncluded !== 'undefined') {
                Object.assign(transformedData, { food_included: pgFoodIncluded === 'yes' });
              }
              if (!transformedData.gate_closing_time && pgGateClosingTime) {
                Object.assign(transformedData, { gate_closing_time: pgGateClosingTime });
              }
              const rawPark = (transformedData as { parking?: string } | undefined)?.parking;
              const precisePark = pgParkingType;
              const isGeneric = rawPark === 'Available' || rawPark === 'Not Available' || !rawPark;
              if (precisePark && isGeneric) {
                Object.assign(transformedData, { parking: precisePark });
              }
            } catch (e) {
              // Non-fatal; room-specific data is optional
              console.warn('PG room options not found in submission payload');
            }
            setDbAmenities(pgRow.amenities ?? null);
            setPgHostelData(transformedData);
          }
        } else {
          // Regular property - fetch amenities and additional_documents via secure RPC
          const { data, error } = await supabase
            .rpc('get_public_property_by_id', { property_id: id });
          const row = (!error && data && data.length > 0) ? data[0] : null;
          if (!error && row) {
            console.log('PropertyDetails loaded amenities from RPC:', {
              amenities: (row as any).amenities,
              additional_documents: (row as any).additional_documents,
              who_will_show: (row as any).who_will_show,
              current_property_condition: (row as any).current_property_condition,
              secondary_phone: (row as any).secondary_phone,
              water_supply: (row as any).water_supply,
              gated_security: (row as any).gated_security,
            });
            setDbAmenities((row as any).amenities ?? null);
            setDbAdditionalDocs((row as any).additional_documents ?? null);
            // Merge top-level fields if not present
            setProperty(prev => prev ? ({...prev, ...(row as any) } as any) : prev);
          }
        }
      } catch (err) {
        console.error('Failed to load property data', err);
      }
    };
    const typeCheck = property?.property_type?.toLowerCase() || '';
    if (!(property as any)?.amenities || !(property as any)?.additional_documents || 
        typeCheck.includes('pg') || typeCheck.includes('hostel') || typeCheck.includes('coliving')) {
      loadPropertyData();
    }
  }, [id, property]);
  
  const fallbackDescription = `This beautifully maintained ${property?.bhk_type ?? ''} ${property?.property_type?.replace('_', ' ') ?? 'apartment'} offers a spacious layout with abundant natural light and excellent connectivity to local conveniences. Situated in a prime locality, it features well-ventilated rooms, ample storage and proximity to schools, hospitals and public transport. A perfect choice for families looking for comfort and convenience.`;
  
  // Prepare merged property (including PG/Hostel specific if loaded)
  const isPGHostel = property?.property_type?.toLowerCase().includes('pg') || 
                    property?.property_type?.toLowerCase().includes('hostel') ||
                    property?.property_type?.toLowerCase().includes('coliving');
  const mergedProperty = property ? {
    ...(property as any),
    amenities: (property as any)?.amenities || dbAmenities || undefined,
    additional_documents: (property as any)?.additional_documents || dbAdditionalDocs || undefined,
    ...(pgHostelData || {})
  } : property;

  // Compute amenities for card: merge PG amenities + available services when applicable
  const pgData: any = pgHostelData || {};
  const mergedAmenities = isPGHostel
    ? { ...(pgData?.amenities || {}), ...(pgData?.available_services || {}) }
    : ((property as any)?.amenities || dbAmenities || undefined);

  console.log('PropertyDetails amenities debug:', {
    propertyAmenities: (property as any)?.amenities,
    dbAmenities,
    mergedAmenities,
    isPGHostel
  });

  
  if (!property) {
    return <div className="min-h-screen flex flex-col">
        <Marquee />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <h1 className="text-2xl font-semibold mb-4">Loading property...</h1>
              <p className="text-gray-600">Fetching the latest property details...</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold mb-4">Property not found</h1>
              <p className="text-gray-600 mb-6">We couldn't load this property. Please go back and try again.</p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </>
          )}
        </main>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen flex flex-col bg-background">
      <Marquee />
      <Header />
      <main className="flex-1">
        {/* Loading indicator for data refresh */}
        {loading && (
          <div className="bg-blue-50 border-b border-blue-200 py-2">
            <div className="container mx-auto px-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-blue-700">Refreshing property data...</span>
            </div>
          </div>
        )}
        
        {/* Header Section - Desktop Only */}
        <div className="hidden sm:block">
          <PropertyHeader property={mergedProperty as any} />
        </div>

        {/* Main Content */}
        <section className="pt-6 sm:pt-6 pb-6 overflow-x-hidden min-w-0">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 overflow-x-hidden">
            {/* Property Gallery and Info Grid */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-8 mb-8 min-w-0">
              {/* Left - Image Gallery */}
              <div className="lg:col-span-2 min-w-0">
                <div className="mt-0 sm:mt-0 overflow-hidden">
                  <PropertyWatermark status={mergedProperty?.status === 'rejected' ? 'rejected' : (mergedProperty?.rental_status || 'available')}>
                    <PropertyImageGallery property={mergedProperty as any} />
                  </PropertyWatermark>
                </div>
                
                {/* Header Section - Mobile Only (Below Images) */}
                <div className="block sm:hidden mt-6 overflow-hidden">
                  <PropertyHeader 
                    property={mergedProperty as any} 
                    onContact={() => setShowContactModal(true)}
                    onScheduleVisit={() => setShowScheduleVisitModal(true)}
                  />
                </div>
              </div>
              
              {/* Right - Property Info Cards */}
              <div className="space-y-6 min-w-0">
                <PropertyInfoCards property={mergedProperty as any} />
                
                {/* Action Buttons - Desktop Only */}
                <div className="hidden sm:block">
                  <PropertyActions
                    onContact={() => setShowContactModal(true)}
                    onScheduleVisit={() => setShowScheduleVisitModal(true)}
                    property={mergedProperty as any}
                    onPropertyStatusUpdate={handlePropertyStatusUpdate}
                  />
                </div>
                
                {/* Report Section */}
                <ReportSection />
              </div>
            </div>

            {/* Additional Details Sections */}
            <div className="space-y-6 overflow-x-hidden">
              {/* Apply Loan Button - Mobile Only (Before Overview) */}
              <div className="block sm:hidden px-4">
                <Link to="/loans" className="block">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium">
                    Apply Loan
                  </Button>
                </Link>
              </div>
              
              {/* Overview */}
              <OverviewCard property={mergedProperty as any} />
              
              {/* Services Card */}
              <ServicesCard />
              
              {/* Description Section */}
              <DescriptionCard property={mergedProperty as any} />
              
              {/* Amenities - Hidden as it's now part of PropertyDetailsCard */}
              {/* <AmenitiesCard amenities={mergedAmenities} /> */}

              {/* PG Room Types & Pricing */}
              {isPGHostel && (
                <PGRoomsCard property={mergedProperty as any} />
              )}
              
              
              {/* Neighborhood */}
              <NeighborhoodCard property={property} />
              
              {/* Related Properties */}
              <RelatedPropertiesCard property={property} />
            </div>
          </div>
        </section>
      </main>
      
      {/* Contact Modal */}
      {property && (
        <ContactOwnerModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          propertyId={property.id}
          propertyTitle={property.title}
          listingType={property.listing_type}
        />
      )}
      
      {/* Schedule Visit Modal */}
      {property && (
        <ScheduleVisitModal
          isOpen={showScheduleVisitModal}
          onClose={() => setShowScheduleVisitModal(false)}
          propertyId={property.id}
          propertyTitle={property.title}
          propertyType={property.property_type}
          propertyArea={(() => {
            const area = property.super_area || property.carpet_area;
            if (!area) return undefined;
            
            const isPlot = property.property_type?.toLowerCase().includes('plot') || 
                           property.property_type?.toLowerCase().includes('land');
            
            console.log('PropertyDetails propertyArea calculation:', {
              area,
              propertyType: property.property_type,
              plotAreaUnit: property.plot_area_unit,
              isPlot
            });
            
            if (isPlot && property.plot_area_unit) {
              const unitMap: Record<string, string> = {
                'sq-ft': 'sq.ft',
                'sq-yard': 'sq.yard',
                'acre': 'acre',
                'hectare': 'hectare',
                'bigha': 'bigha',
                'biswa': 'biswa',
                'gunta': 'gunta',
                'cents': 'cents',
                'marla': 'marla',
                'kanal': 'kanal',
                'kottah': 'kottah'
              };
              const displayUnit = unitMap[property.plot_area_unit] || property.plot_area_unit;
              console.log('PropertyDetails: Using plot unit:', displayUnit);
              return `${area} ${displayUnit}`;
            }
            
            console.log('PropertyDetails: Using default sq.ft');
            return `${area} sq.ft`;
          })()}
          bhkType={property.bhk_type}
          city={property.city}
          expectedPrice={(mergedProperty as any)?.expected_rent ?? property.expected_price}
        />
      )}
      
        {/* EMI Calculator Modal */}
        {property && (
          <EMICalculatorModal
            isOpen={showEMICalculatorModal}
            onClose={() => setShowEMICalculatorModal(false)}
            propertyPrice={(mergedProperty as any)?.expected_rent ?? property.expected_price}
          />
        )}
      
      {/* Legal Services Modal */}
      <LegalServicesForm
        isOpen={showLegalServicesModal}
        onClose={() => setShowLegalServicesModal(false)}
      />
      
      <Footer />
      <ChatBot />
    </div>;
};
export default PropertyDetails;