import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { ContactOwnerModal } from '@/components/ContactOwnerModal';
import { ScheduleVisitModal } from '@/components/ScheduleVisitModal';
import EMICalculatorModal from '@/components/EMICalculatorModal';
import LegalServicesForm from '@/components/LegalServicesForm';
import { PropertyHero } from '@/components/property-details/PropertyHero';
import { PropertyDetailsCard } from '@/components/property-details/PropertyDetailsCard';
import { LocationCard } from '@/components/property-details/LocationCard';
import { OverviewCard } from '@/components/property-details/OverviewCard';
import { RoomDetailsCard } from '@/components/property-details/RoomDetailsCard';
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
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';

// Helper function to generate property title from data
const generatePropertyTitle = (data: any): string => {
  const bhkType = data.bhk_type || data.bhkType || '';
  const propertyType = data.property_type || data.propertyType || 'Property';
  const listingType = data.listing_type || data.listingType || 'Rent';
  const spaceType = data.space_type || data.spaceType || '';
  const landType = data.land_type || data.landType || '';
  
  console.log('DEBUG: generatePropertyTitle received data:', JSON.stringify(data, null, 2));
  console.log(`DEBUG: propertyType: ${propertyType}, landType: ${landType}, listingType: ${listingType}`);
  
  // Capitalize first letter of each word
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  
  const formattedBhkType = bhkType ? capitalize(bhkType.replace(/\s+/g, ' ')) : '';
  const formattedPropertyType = capitalize(propertyType);
  const formattedListingType = capitalize(listingType);
  // Map space type values to their display names
  const getSpaceTypeDisplayName = (value: string): string => {
    const spaceTypeMap: Record<string, string> = {
      'office': 'Office Space',
      'retail': 'Retail Shop',
      'warehouse': 'Warehouse Space',
      'showroom': 'Showroom',
      'restaurant': 'Restaurant/Cafe',
      'co-working': 'Co-Working Space',
      'co-living': 'Co-Living',
      'industrial': 'Industrial Space'
    };
    return spaceTypeMap[value] || capitalize(value);
  };
  
  const formattedSpaceType = spaceType ? getSpaceTypeDisplayName(spaceType) : '';
  
  // For commercial properties, use space type if available
  if (propertyType.toLowerCase().includes('commercial') && formattedSpaceType) {
    return `${formattedSpaceType} For ${formattedListingType}`;
  }
  
  // For Flatmates properties
  if (propertyType.toLowerCase() === 'flatmates') {
    // Get the actual apartment type from the form data
    const apartmentType = data.apartment_type || data.apartmentType || 'Apartment';
    const formattedApartmentType = capitalize(apartmentType);
    
    if (formattedBhkType && formattedApartmentType) {
      return `${formattedBhkType} ${formattedApartmentType} for Flatmates`;
    } else if (formattedApartmentType) {
      return `${formattedApartmentType} for Flatmates`;
    } else {
      return 'Property for Flatmates';
    }
  }

  // For PG/Hostel properties
  if (propertyType.toLowerCase().includes('pg') || propertyType.toLowerCase().includes('hostel')) {
    const roomType = data.room_type || data.roomType || '';
    const roomTypeMap: Record<string, string> = {
      'single': 'Single',
      'double': 'Double',
      'three': 'Three', 
      'four': 'Four'
    };
    const formattedRoomType = roomType ? roomTypeMap[roomType.toLowerCase()] || capitalize(roomType) : '';
    const pgType = propertyType.toLowerCase().includes('pg') ? 'PG' : 'Hostel';
    
    if (formattedRoomType) {
      return `${formattedRoomType} ${pgType} Property`;
    } else {
      return `${pgType} Property`;
    }
  }

  // For Land/Plot properties, prioritize land_type over property_type
  if (landType && (propertyType === 'Land/Plot' || propertyType.toLowerCase() === 'land' || propertyType.toLowerCase() === 'plot')) {
    // Map land type values to proper display names
    const getLandTypeDisplayName = (value: string): string => {
      const landTypeMap: Record<string, string> = {
        'industrial': 'Industrial Land',
        'commercial': 'Commercial Land', 
        'agricultural': 'Agricultural Land',
        'residential': 'Residential Land',
        'institutional': 'Institutional Land'
      };
      return landTypeMap[value] || capitalize(value) + ' Land';
    };
    
    const formattedLandType = getLandTypeDisplayName(landType);
    return `${formattedLandType} For Sale`; // Always "For Sale" for land properties
  }
  
  // Fallback: check if property_type contains land/plot keywords
  if (propertyType.toLowerCase().includes('land') || propertyType.toLowerCase().includes('plot')) {
    const formattedLandType = 'Land';
    return `${formattedLandType} For ${formattedListingType}`;
  }
  
  if (formattedBhkType && formattedPropertyType) {
    return `${formattedBhkType} ${formattedPropertyType} For ${formattedListingType}`;
  } else if (formattedPropertyType) {
    return `${formattedPropertyType} For ${formattedListingType}`;
  } else {
    return 'Property';
  }
};

interface PropertyPreviewData {
  id: string;
  user_id?: string;
  title?: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price?: number;
  expected_rent?: number;
  expected_deposit?: number;
  price_negotiable?: boolean;
  possession_date?: string;
  ownership_type?: string;
  approved_by?: string;
  super_area?: number;
  carpet_area?: number;
  built_up_area?: number;
  bathrooms?: number;
  balconies?: number;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  description?: string;
  images?: string[];
  categorized_images?: any; // JSONB field for categorized image structure
  videos?: string[];
  status?: string;
  rental_status?: 'available' | 'inactive' | 'rented' | 'sold';
  created_at: string;
  amenities?: any;
  additional_documents?: Record<string, boolean>;
  security_deposit?: number | null;
  available_from?: string | null;
  parking?: string | null;
  age_of_building?: string | null;
  preferred_tenant?: string | null;
  
  // Owner info
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  
  // Additional draft fields
  apartment_type?: string;
  apartment_name?: string;
  floor_no?: number;
  total_floors?: number;
  property_age?: string;
  space_type?: string;
  building_type?: string;
  furnishing_status?: string;
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
  pg_rules?: any;
  available_services?: {
    laundry?: string;
    room_cleaning?: string;
    warden_facility?: string;
  };
  
  // Flatmates specific fields
  existing_flatmates?: number;
  gender_preference_flatmates?: string;
  occupation?: string;
  lifestyle_preference?: string;
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  maintenance_extra?: boolean;
  maintenance_charges?: number;
  deposit_negotiable?: boolean;
  lease_duration?: string;
  lockin_period?: string;
  brokerage_type?: string;
  preferred_tenants?: string;
  ideal_for?: string[];
  
  // PG/Hostel amenities
  common_tv?: boolean;
  refrigerator?: boolean;
  mess?: boolean;
  cooking_allowed?: boolean;
  
  // PG/Hostel room amenities
  room_amenities?: {
    cupboard?: boolean;
    geyser?: boolean;
    tv?: boolean;
    ac?: boolean;
    bedding?: boolean;
    attachedBathroom?: boolean;
  };
  
  facing?: string;
  rent_negotiable?: boolean;
  monthly_maintenance?: string;
  furnishing?: string;
  power_backup?: string;
  lift?: string;
  water_supply?: string;
  security?: string;
  gym?: string;
  gated_security?: string;
  current_property_condition?: string;
  directions_tip?: string;
  video?: string;
  additional_info?: any;
  
  // Additional amenities fields
  pet_allowed?: boolean;
  non_veg_allowed?: boolean;
  who_will_show?: string;
  secondary_phone?: string;
  more_similar_units?: boolean;
  internet_services?: string;
  air_conditioner?: string;
  club_house?: string;
  intercom?: string;
  swimming_pool?: string;
  children_play_area?: string;
  fire_safety?: string;
  servant_room?: string;
  shopping_center?: string;
  gas_pipeline?: string;
  park?: string;
  rain_water_harvesting?: string;
  sewage_treatment_plant?: string;
  house_keeping?: string;
  visitor_parking?: string;
  water_storage_facility?: string;
  wifi?: string;
  schedule_info?: any;
  current_step?: number;
  is_completed?: boolean;
  updated_at?: string;
}

export const PropertyPreviewPage: React.FC = () => {
  const params = useParams<{ draftId?: string; id?: string; slug?: string }>();
  const navigate = useNavigate();
  
  // Use either draftId or id - both should work
  // Support both old format (/property/:id) and new format (/property/:slug/:id)
  const propertyId = params.draftId || params.id;
  const [propertyData, setPropertyData] = useState<PropertyPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showScheduleVisitModal, setShowScheduleVisitModal] = useState(false);
  const [showEMICalculatorModal, setShowEMICalculatorModal] = useState(false);
  const [showLegalServicesModal, setShowLegalServicesModal] = useState(false);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) {
        setError('Invalid property ID');
        setLoading(false);
        return;
      }

      console.log('PropertyPreviewPage: Starting fetch for propertyId:', propertyId);
      console.log('PropertyPreviewPage: URL params - draftId:', params.draftId, 'id:', params.id, 'slug:', params.slug);

      try {
        console.log('🔍 SEARCHING FOR PROPERTY ID:', propertyId);
        console.log('🔍 URL PARAMS:', { draftId: params.draftId, id: params.id, slug: params.slug, propertyId });
        // First try to fetch from property_drafts table (for drafts with complete data)
        const { data: draftData, error: draftError } = await supabase
          .from('property_drafts')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (!draftError && draftData) {
          console.log('✅ FOUND in property_drafts table:', draftData);
          const draftDataAny = draftData as any; // Cast to any to access all fields
          console.log('Property age debug:', {
            property_age: draftDataAny.property_age,
            propertyAge: draftDataAny.propertyAge,
            age_of_building: draftDataAny.age_of_building
          });
          
          // Convert property_drafts data to PropertyPreviewData format
          const convertedData: PropertyPreviewData = {
            id: draftData.id,
            user_id: draftData.user_id,
            title: draftDataAny.property_title || draftDataAny.title || (() => {
              console.log('DEBUG: Calling generatePropertyTitle with draftDataAny:', JSON.stringify(draftDataAny, null, 2));
              console.log('DEBUG: draftDataAny.land_type:', draftDataAny.land_type);
              console.log('DEBUG: draftDataAny.listing_type:', draftDataAny.listing_type);
              
              // For existing drafts with null land_type, derive it from listing_type ONLY for Land/Plot properties
              if (!draftDataAny.land_type && draftDataAny.listing_type && 
                  (draftDataAny.property_type === 'Land/Plot' || draftDataAny.property_type?.toLowerCase() === 'land' || draftDataAny.property_type?.toLowerCase() === 'plot')) {
                const landTypeMap: Record<string, string> = {
                  'Industrial land': 'industrial',
                  'Commercial land': 'commercial', 
                  'Agricultural Land': 'agricultural'
                };
                const derivedLandType = landTypeMap[draftDataAny.listing_type] || 'industrial';
                console.log('DEBUG: Derived land_type from listing_type for Land/Plot property:', derivedLandType);
                draftDataAny.land_type = derivedLandType;
              }
              
              return generatePropertyTitle(draftDataAny);
            })(),
            property_type: draftData.property_type || 'residential',
            listing_type: draftData.listing_type || 'rent',
            bhk_type: draftData.bhk_type,
            expected_price: draftDataAny.expected_price || 0,
            expected_rent: draftDataAny.expected_rent || draftDataAny.expected_price || 0,
            expected_deposit: draftDataAny.expected_deposit || draftDataAny.security_deposit || 0,
            price_negotiable: draftDataAny.price_negotiable,
            possession_date: draftDataAny.possession_date,
            ownership_type: draftDataAny.ownership_type,
            approved_by: draftDataAny.approved_by,
            super_area: draftDataAny.super_area || draftDataAny.built_up_area || 0,
            carpet_area: draftData.carpet_area || 0,
            bathrooms: draftData.bathrooms || 0,
            balconies: draftData.balconies || 0,
            city: draftData.city,
            locality: draftData.locality || '',
            state: draftData.state,
            pincode: draftData.pincode || '',
            description: draftData.description || '',
            images: draftData.images ? draftData.images.map((img: string) => {
              console.log('Processing draft image:', img, 'Type:', typeof img);
              // Handle double-quoted URLs (remove quotes if present)
              let cleanImg = img;
              if (typeof img === 'string' && img.startsWith('"') && img.endsWith('"')) {
                cleanImg = img.slice(1, -1); // Remove quotes
                console.log('Removed quotes from draft image URL:', cleanImg);
              }
              
              // If it's already a full URL, use it directly
              if (cleanImg && (cleanImg.startsWith('http') || cleanImg.startsWith('data:'))) {
                console.log('Using full draft URL:', cleanImg);
                return cleanImg;
              }
              
              // If it's a relative path, get the public URL from Supabase storage
              if (cleanImg && !cleanImg.startsWith('http') && !cleanImg.startsWith('data:')) {
                const { data } = supabase.storage.from('property-media').getPublicUrl(cleanImg);
                console.log('Converted draft relative path to full URL:', data.publicUrl);
                return data.publicUrl;
              }
              
              console.log('Using original draft image URL:', cleanImg);
              return cleanImg;
            }) : [],
            categorized_images: (draftData as any).categorized_images,
            video: (draftData as any).video || undefined,
            created_at: draftData.created_at,
            // Map amenities from individual fields in property_drafts
            amenities: {
              lift: draftDataAny.lift,
              powerBackup: draftDataAny.power_backup,
              waterSupply: draftDataAny.water_supply,
              security: draftDataAny.security,
              gym: draftDataAny.gym,
              gatedSecurity: draftDataAny.gated_security === true || draftDataAny.gated_security === 'true' || draftDataAny.gated_security === '1',
              bathrooms: draftData.bathrooms || 0,
              balconies: draftData.balconies || 0,
              // Convert string booleans to actual booleans
              petAllowed: draftDataAny.pet_allowed === true || draftDataAny.pet_allowed === 'true' || draftDataAny.pet_allowed === '1',
              nonVegAllowed: draftDataAny.non_veg_allowed === true || draftDataAny.non_veg_allowed === 'true' || draftDataAny.non_veg_allowed === '1',
              whoWillShow: draftDataAny.who_will_show,
              currentPropertyCondition: draftDataAny.current_property_condition,
              directionsTip: draftDataAny.directions_tip,
              internetServices: draftDataAny.internet_services,
              airConditioner: draftDataAny.air_conditioner,
              clubHouse: draftDataAny.club_house,
              intercom: draftDataAny.intercom,
              swimmingPool: draftDataAny.swimming_pool,
              childrenPlayArea: draftDataAny.children_play_area,
              fireSafety: draftDataAny.fire_safety,
              servantRoom: draftDataAny.servant_room,
              shoppingCenter: draftDataAny.shopping_center,
              gasPipeline: draftDataAny.gas_pipeline,
              park: draftDataAny.park,
              rainWaterHarvesting: draftDataAny.rain_water_harvesting,
              sewageTreatmentPlant: draftDataAny.sewage_treatment_plant,
              houseKeeping: draftDataAny.house_keeping,
              visitorParking: draftDataAny.visitor_parking,
              waterStorageFacility: draftDataAny.water_storage_facility,
              wifi: draftDataAny.wifi,
              furnishing: draftDataAny.furnishing,
              parking: draftDataAny.parking
            },
            // Map other fields
            available_from: draftDataAny.available_from,
            parking: draftDataAny.parking,
            furnishing: draftDataAny.furnishing,
            floor_no: draftDataAny.floor_no,
            total_floors: draftDataAny.total_floors,
            property_age: draftDataAny.property_age,
            preferred_tenant: draftDataAny.preferred_tenant,
            space_type: draftDataAny.space_type,
            building_type: draftDataAny.building_type,
            furnishing_status: draftDataAny.furnishing_status,
            // Land/Plot-specific fields
            plot_area: draftDataAny.plot_area,
            plot_area_unit: draftDataAny.plot_area_unit,
            plot_length: draftDataAny.plot_length,
            plot_width: draftDataAny.plot_width,
            boundary_wall: draftDataAny.boundary_wall,
            corner_plot: draftDataAny.corner_plot,
            road_facing: draftDataAny.road_facing,
            road_width: draftDataAny.road_width,
            land_type: draftDataAny.land_type,
            plot_shape: draftDataAny.plot_shape,
            gated_community: draftDataAny.gated_community,
            gated_project: draftDataAny.gated_project,
            floors_allowed: draftDataAny.floors_allowed,
            survey_number: draftDataAny.survey_number,
            sub_division: draftDataAny.sub_division,
            village_name: draftDataAny.village_name,
            electricity_connection: draftDataAny.electricity_connection,
            sewage_connection: draftDataAny.sewage_connection,
            // PG/Hostel specific fields (from additional_info JSONB)
            room_type: draftDataAny.room_type || draftDataAny.additional_info?.room_type,
            gender_preference: draftDataAny.additional_info?.gender_preference,
            preferred_guests: draftDataAny.additional_info?.preferred_guests,
            food_included: draftDataAny.additional_info?.food_included,
            gate_closing_time: draftDataAny.additional_info?.gate_closing_time,
            pg_rules: draftDataAny.additional_info?.pg_rules,
            available_services: draftDataAny.additional_info?.available_services,
            // Flatmates specific fields (from additional_info JSONB)
            existing_flatmates: draftDataAny.additional_info?.existing_flatmates,
            gender_preference_flatmates: draftDataAny.additional_info?.gender_preference_flatmates,
            occupation: draftDataAny.additional_info?.occupation,
            lifestyle_preference: draftDataAny.additional_info?.lifestyle_preference,
            smoking_allowed: draftDataAny.additional_info?.smoking_allowed,
            pets_allowed: draftDataAny.additional_info?.pets_allowed,
            maintenance_extra: draftDataAny.additional_info?.maintenance_extra,
            maintenance_charges: draftDataAny.additional_info?.maintenance_charges,
            deposit_negotiable: draftDataAny.additional_info?.deposit_negotiable,
            lease_duration: draftDataAny.additional_info?.lease_duration,
            lockin_period: draftDataAny.additional_info?.lockin_period,
            brokerage_type: draftDataAny.additional_info?.brokerage_type,
            preferred_tenants: draftDataAny.additional_info?.preferred_tenants,
            ideal_for: draftDataAny.additional_info?.ideal_for,
            // PG/Hostel amenities from additional_info
            common_tv: draftDataAny.additional_info?.common_tv,
            refrigerator: draftDataAny.additional_info?.refrigerator,
            mess: draftDataAny.additional_info?.mess,
            cooking_allowed: draftDataAny.additional_info?.cooking_allowed,
            // PG/Hostel room amenities from additional_info
            room_amenities: draftDataAny.additional_info?.room_amenities,
            // Debug logging for PG/Hostel services
            ...(draftDataAny.property_type?.toLowerCase().includes('pg') || draftDataAny.property_type?.toLowerCase().includes('hostel') || draftDataAny.property_type === 'PG/Hostel' ? {
              debug_services: {
                property_type: draftDataAny.property_type,
                available_services: draftDataAny.additional_info?.available_services,
                additional_info: draftDataAny.additional_info
              }
            } : {}),
            facing: draftDataAny.facing_direction,
            power_backup: draftDataAny.power_backup,
            lift: draftDataAny.lift,
            water_supply: draftDataAny.water_supply,
            security: draftDataAny.security,
            gym: draftDataAny.gym,
            gated_security: draftDataAny.gated_security === true || draftDataAny.gated_security === 'true' || draftDataAny.gated_security === '1' ? 'Yes' : 'No',
            current_property_condition: draftDataAny.current_property_condition,
            directions_tip: draftDataAny.directions_tip,
            // Additional amenities fields
            pet_allowed: draftDataAny.pet_allowed === true || draftDataAny.pet_allowed === 'true' || draftDataAny.pet_allowed === '1',
            non_veg_allowed: draftDataAny.non_veg_allowed === true || draftDataAny.non_veg_allowed === 'true' || draftDataAny.non_veg_allowed === '1',
            who_will_show: draftDataAny.who_will_show,
            secondary_phone: draftDataAny.secondary_phone,
            internet_services: draftDataAny.internet_services,
            air_conditioner: draftDataAny.air_conditioner,
            club_house: draftDataAny.club_house,
            intercom: draftDataAny.intercom,
            swimming_pool: draftDataAny.swimming_pool,
            children_play_area: draftDataAny.children_play_area,
            fire_safety: draftDataAny.fire_safety,
            servant_room: draftDataAny.servant_room,
            shopping_center: draftDataAny.shopping_center,
            gas_pipeline: draftDataAny.gas_pipeline,
            park: draftDataAny.park,
            rain_water_harvesting: draftDataAny.rain_water_harvesting,
            sewage_treatment_plant: draftDataAny.sewage_treatment_plant,
            house_keeping: draftDataAny.house_keeping,
            visitor_parking: draftDataAny.visitor_parking,
            water_storage_facility: draftDataAny.water_storage_facility,
            wifi: draftDataAny.wifi
          };
          
          console.log('DEBUG: Final convertedData for property_drafts:', JSON.stringify({
            plot_area: convertedData.plot_area,
            plot_area_unit: convertedData.plot_area_unit,
            plot_length: convertedData.plot_length,
            plot_width: convertedData.plot_width,
            boundary_wall: convertedData.boundary_wall,
            land_type: convertedData.land_type,
            property_type: convertedData.property_type
          }, null, 2));
          
          console.log('Converted data for property_drafts table:', JSON.stringify({
            amenities: convertedData.amenities,
            amenities_petAllowed: convertedData.amenities.petAllowed,
            amenities_nonVegAllowed: convertedData.amenities.nonVegAllowed,
            amenities_gym: convertedData.amenities.gym,
            amenities_gatedSecurity: convertedData.amenities.gatedSecurity,
            images: convertedData.images,
            images_length: Array.isArray(convertedData.images) ? convertedData.images.length : 'not array',
            images_content: convertedData.images,
            expected_deposit: convertedData.expected_deposit,
            preferred_tenant: convertedData.preferred_tenant,
            property_age: convertedData.property_age,
            pet_allowed: convertedData.pet_allowed,
            non_veg_allowed: convertedData.non_veg_allowed,
            gym: convertedData.gym,
            gated_security: convertedData.gated_security,
            floor_debug: {
              floor_no: convertedData.floor_no,
              total_floors: convertedData.total_floors,
              raw_floor_no: draftDataAny.floor_no,
              raw_total_floors: draftDataAny.total_floors
            }
          }, null, 2));
          
          setPropertyData(convertedData);
          setLoading(false);
          return;
        } else {
          console.log('❌ NOT found in property_drafts table. Error:', draftError);
        }

        // If not found in drafts, try to fetch from properties table (for published properties)
        console.log('Not found in drafts, checking properties table...');
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (!propertyError && propertyData) {
          console.log('✅ FOUND in properties table:', propertyData);
          console.log('Properties table property age debug:', {
            property_age: (propertyData as any).property_age,
            age_of_building: (propertyData as any).age_of_building
          });
          const propertyDataAny = propertyData as any; // Cast to any to access all fields
          
          // Check if the data is complete (has amenities, deposit, etc.)
          const hasCompleteData = propertyDataAny.expected_deposit > 0 || 
                                 propertyDataAny.preferred_tenant || 
                                 propertyDataAny.property_age ||
                                 Object.values(propertyDataAny).some(value => 
                                   typeof value === 'string' && value && value !== 'null' && 
                                   ['lift', 'gym', 'fire_safety', 'swimming_pool', 'internet_services'].includes(value)
                                 );
          
          console.log('Properties table data completeness check:', {
            hasCompleteData,
            expected_deposit: propertyDataAny.expected_deposit,
            preferred_tenant: propertyDataAny.preferred_tenant,
            property_age: propertyDataAny.property_age,
            amenities_count: Object.keys(propertyDataAny).filter(key => 
              ['lift', 'gym', 'fire_safety', 'swimming_pool', 'internet_services', 'air_conditioner', 'club_house'].includes(key) && 
              propertyDataAny[key] && propertyDataAny[key] !== 'null'
            ).length
          });
          
          // If data is incomplete, try property_submissions table first
          if (!hasCompleteData) {
            console.log('Properties table has incomplete data, checking property_submissions...');
            const { data: submissionData, error: submissionError } = await supabase
              .from('property_submissions')
              .select('*')
              .eq('id', propertyId)
              .single();

            if (!submissionError && submissionData) {
              console.log('✅ FOUND complete data in property_submissions table:', submissionData);
              console.log('Property_submissions property age debug:', JSON.stringify({
                property_age: (submissionData.payload as any)?.property_age,
                age_of_building: (submissionData.payload as any)?.age_of_building
              }, null, 2));
              const payload = submissionData.payload as any;
              console.log('Property_submissions payload data:', JSON.stringify({
                payload: payload,
                payload_type: typeof payload,
                images: payload?.images,
                images_type: typeof payload?.images,
                images_length: Array.isArray(payload?.images) ? payload.images.length : 'not array',
                images_content: payload?.images,
                // Debug specific fields that are missing
                deposit: payload?.expected_deposit,
                preferred_tenant: payload?.preferred_tenant,
                age_of_building: payload?.property_age,
                pet_allowed: payload?.pet_allowed,
                non_veg_allowed: payload?.non_veg_allowed,
                gym: payload?.gym,
                gated_security: payload?.gated_security,
                // Debug amenities structure
                amenities_structure: payload?.amenities,
                furnishing: payload?.furnishing,
                parking: payload?.parking,
                // Debug all available keys in payload
                payload_keys: Object.keys(payload || {}),
                // Debug Commercial rental data
                rental_details: payload?.originalFormData?.rentalDetails,
                expected_price_debug: {
                  top_level: payload?.expected_price,
                  camel_case: payload?.expectedPrice,
                  nested: payload?.originalFormData?.rentalDetails?.expectedPrice
                },
                deposit_debug: {
                  security_deposit: payload?.security_deposit,
                  expected_deposit: payload?.expected_deposit,
                  nested: payload?.originalFormData?.rentalDetails?.securityDeposit
                },
                // Debug specific amenity fields
                lift: payload?.lift,
                power_backup: payload?.power_backup,
                water_supply: payload?.water_supply,
                security: payload?.security
              }, null, 2));
              
              // Convert property_submissions data to PropertyPreviewData format
              const convertedData: PropertyPreviewData = {
                id: submissionData.id,
                user_id: submissionData.user_id,
                title: submissionData.title || generatePropertyTitle(payload),
                property_type: payload?.property_type || 'residential',
                listing_type: payload?.listing_type || 'rent',
                bhk_type: payload?.bhk_type,
                expected_price: payload?.expected_price || payload?.expectedPrice || payload?.originalFormData?.rentalDetails?.expectedPrice || 0,
                expected_rent: payload?.expected_price || payload?.expectedPrice || payload?.originalFormData?.rentalDetails?.expectedPrice || 0, // For rental properties
                expected_deposit: payload?.security_deposit || payload?.expected_deposit || payload?.originalFormData?.rentalDetails?.securityDeposit || 0, // Use security_deposit first
                super_area: payload?.super_area || payload?.built_up_area || 0,
                carpet_area: payload?.carpet_area || 0,
                bathrooms: payload?.bathrooms || 0,
                balconies: payload?.balconies || 0,
                city: submissionData.city,
                locality: payload?.locality || '',
                state: submissionData.state,
                pincode: payload?.pincode || '',
                description: payload?.description || '',
                images: payload?.images ? payload.images.map((img: string) => {
                  console.log('Processing image:', img, 'Type:', typeof img);
                  // Handle double-quoted URLs (remove quotes if present)
                  let cleanImg = img;
                  if (typeof img === 'string' && img.startsWith('"') && img.endsWith('"')) {
                    cleanImg = img.slice(1, -1); // Remove quotes
                    console.log('Removed quotes from image URL:', cleanImg);
                  }
                  
                  // If it's already a full URL, use it directly
                  if (cleanImg && (cleanImg.startsWith('http') || cleanImg.startsWith('data:'))) {
                    console.log('Using full URL:', cleanImg);
                    return cleanImg;
                  }
                  
                  // If it's a relative path, get the public URL from Supabase storage
                  if (cleanImg && !cleanImg.startsWith('http') && !cleanImg.startsWith('data:')) {
                    const { data } = supabase.storage.from('property-media').getPublicUrl(cleanImg);
                    console.log('Converted relative path to full URL:', data.publicUrl);
                    return data.publicUrl;
                  }
                  
                  console.log('Using original image URL:', cleanImg);
                  return cleanImg;
                }) : [],
                video: payload?.video || undefined,
                created_at: submissionData.created_at,
                // Map PG/Hostel-specific fields
                gender_preference: payload?.place_available_for || payload?.gender_preference,
                food_included: payload?.food_included,
                gate_closing_time: payload?.gate_closing_time,
                available_services: payload?.available_services,
                room_amenities: payload?.room_amenities,
                // Map amenities from payload.amenities object
                amenities: {
                  lift: payload?.amenities?.lift,
                  powerBackup: payload?.amenities?.powerBackup || payload?.power_backup,
                  waterSupply: payload?.amenities?.waterSupply || payload?.water_supply,
                  security: payload?.amenities?.security || payload?.security,
                  gym: payload?.amenities?.gym,
                  gatedSecurity: payload?.amenities?.gatedSecurity === true || payload?.amenities?.gatedSecurity === 'true' || payload?.amenities?.gatedSecurity === '1',
                  bathrooms: payload?.amenities?.bathrooms || payload?.bathrooms || 0,
                  balconies: payload?.amenities?.balconies || payload?.balconies || 0,
                  // Convert string booleans to actual booleans
                  petAllowed: payload?.amenities?.petAllowed === true || payload?.amenities?.petAllowed === 'true' || payload?.amenities?.petAllowed === '1',
                  nonVegAllowed: payload?.amenities?.nonVegAllowed === true || payload?.amenities?.nonVegAllowed === 'true' || payload?.amenities?.nonVegAllowed === '1',
                  whoWillShow: payload?.amenities?.whoWillShow,
                  currentPropertyCondition: payload?.amenities?.currentPropertyCondition,
                  
                  // PG/Hostel-specific amenities from additional_info
                  common_tv: payload?.additional_info?.common_tv,
                  refrigerator: payload?.additional_info?.refrigerator,
                  mess: payload?.additional_info?.mess,
                  cooking_allowed: payload?.additional_info?.cooking_allowed,
                  room_amenities: payload?.additional_info?.room_amenities,
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
                  parking: payload?.amenities?.parking || payload?.parking,
                  // Flatmates-specific amenities from additional_info
                  attachedBathroom: payload?.additional_info?.attachedBathroom,
                  smokingAllowed: payload?.additional_info?.smokingAllowed,
                  drinkingAllowed: payload?.additional_info?.drinkingAllowed,
                  secondaryNumber: payload?.additional_info?.secondaryNumber,
                  moreSimilarUnits: payload?.additional_info?.moreSimilarUnits
                },
                // Map other fields
                available_from: payload?.available_from,
                parking: payload?.parking,
                furnishing: payload?.furnishing,
                floor_no: payload?.floor_no,
                total_floors: payload?.total_floors,
                property_age: payload?.age_of_building || payload?.property_age,
                facing: payload?.facing,
                preferred_tenant: payload?.preferred_tenant, // Added this
                power_backup: payload?.power_backup,
                lift: payload?.lift,
                water_supply: payload?.water_supply,
                security: payload?.security,
                gym: payload?.gym,
                gated_security: payload?.amenities?.gatedSecurity === true || payload?.amenities?.gatedSecurity === 'true' || payload?.amenities?.gatedSecurity === '1' ? 'Yes' : 'No',
                current_property_condition: payload?.current_property_condition,
                directions_tip: payload?.directions_tip,
                // Additional amenities fields
                pet_allowed: payload?.amenities?.petAllowed === true || payload?.amenities?.petAllowed === 'true' || payload?.amenities?.petAllowed === '1',
                non_veg_allowed: payload?.amenities?.nonVegAllowed === true || payload?.amenities?.nonVegAllowed === 'true' || payload?.amenities?.nonVegAllowed === '1',
                who_will_show: payload?.amenities?.whoWillShow,
                secondary_phone: payload?.amenities?.secondaryNumber,
                internet_services: payload?.amenities?.internetServices,
                air_conditioner: payload?.amenities?.airConditioner,
                club_house: payload?.amenities?.clubHouse,
                intercom: payload?.amenities?.intercom,
                swimming_pool: payload?.amenities?.swimmingPool,
                children_play_area: payload?.amenities?.childrenPlayArea,
                fire_safety: payload?.amenities?.fireSafety,
                servant_room: payload?.amenities?.servantRoom,
                shopping_center: payload?.amenities?.shoppingCenter,
                gas_pipeline: payload?.amenities?.gasPipeline,
                park: payload?.amenities?.park,
                rain_water_harvesting: payload?.amenities?.rainWaterHarvesting,
                sewage_treatment_plant: payload?.amenities?.sewageTreatmentPlant,
                house_keeping: payload?.amenities?.houseKeeping,
                visitor_parking: payload?.amenities?.visitorParking,
                water_storage_facility: payload?.amenities?.waterStorageFacility,
                wifi: payload?.amenities?.wifi,
                // Land/Plot specific fields
                plot_area: payload?.super_area || payload?.plot_area,
                plot_area_unit: payload?.plot_area_unit,
                plot_length: payload?.plot_length,
                plot_width: payload?.plot_width,
                boundary_wall: payload?.boundary_wall,
                corner_plot: payload?.corner_plot,
                road_facing: payload?.road_facing,
                road_width: payload?.road_width,
                land_type: payload?.land_type,
                plot_shape: payload?.plot_shape,
                gated_community: payload?.gated_community,
                gated_project: payload?.gated_project,
                floors_allowed: payload?.floors_allowed,
                survey_number: payload?.survey_number,
                sub_division: payload?.sub_division,
                village_name: payload?.village_name,
                ownership_type: payload?.ownership_type,
                approved_by: payload?.approved_by,
                electricity_connection: payload?.amenities?.electricityConnection,
                sewage_connection: payload?.amenities?.sewageConnection,
                price_negotiable: payload?.price_negotiable,
                possession_date: payload?.possession_date
              };
              
              console.log('Converted data for property_submissions table:', JSON.stringify({
                amenities: convertedData.amenities,
                amenities_petAllowed: convertedData.amenities.petAllowed,
                amenities_nonVegAllowed: convertedData.amenities.nonVegAllowed,
                amenities_gym: convertedData.amenities.gym,
                amenities_gatedSecurity: convertedData.amenities.gatedSecurity,
                images: convertedData.images,
                images_length: Array.isArray(convertedData.images) ? convertedData.images.length : 'not array',
                images_content: convertedData.images,
                // Debug missing fields
                expected_deposit: convertedData.expected_deposit,
                preferred_tenant: convertedData.preferred_tenant,
                property_age: convertedData.property_age,
                pet_allowed: convertedData.pet_allowed,
                non_veg_allowed: convertedData.non_veg_allowed,
                gym: convertedData.gym,
                gated_security: convertedData.gated_security
              }, null, 2));
              
              setPropertyData(convertedData);
              setLoading(false);
              return;
            } else {
              console.log('❌ NOT found in property_submissions table. Error:', submissionError);
            }
          }
          console.log('Properties table raw data:', JSON.stringify({
            id: propertyData.id,
            title: propertyData.title,
            expected_price: propertyData.expected_price || (propertyData as any).expectedPrice || 0,
            expected_deposit: propertyDataAny.expected_deposit,
            security_deposit: propertyDataAny.security_deposit,
            deposit: propertyDataAny.deposit,
            super_area: propertyData.super_area,
            carpet_area: propertyData.carpet_area,
            bathrooms: propertyData.bathrooms,
            balconies: propertyData.balconies,
            property_age: propertyData.property_age,
            age_of_building: propertyDataAny.age_of_building,
            preferred_tenant: propertyDataAny.preferred_tenant,
            images: propertyData.images,
            amenities: propertyData.amenities,
            pet_allowed: propertyDataAny.pet_allowed,
            non_veg_allowed: propertyDataAny.non_veg_allowed,
            gym: propertyDataAny.gym,
            gated_security: propertyDataAny.gated_security,
            furnishing: propertyData.furnishing,
            parking: propertyDataAny.parking,
            // Check all possible field names
            all_keys: Object.keys(propertyDataAny),
            // Check specific amenity fields
            lift: propertyDataAny.lift,
            power_backup: propertyDataAny.power_backup,
            water_supply: propertyDataAny.water_supply,
            security: propertyDataAny.security,
            internet_services: propertyDataAny.internet_services,
            air_conditioner: propertyDataAny.air_conditioner,
            club_house: propertyDataAny.club_house,
            intercom: propertyDataAny.intercom,
            swimming_pool: propertyDataAny.swimming_pool,
            children_play_area: propertyDataAny.children_play_area,
            fire_safety: propertyDataAny.fire_safety,
            servant_room: propertyDataAny.servant_room,
            shopping_center: propertyDataAny.shopping_center,
            gas_pipeline: propertyDataAny.gas_pipeline,
            park: propertyDataAny.park,
            rain_water_harvesting: propertyDataAny.rain_water_harvesting,
            sewage_treatment_plant: propertyDataAny.sewage_treatment_plant,
            house_keeping: propertyDataAny.house_keeping,
            visitor_parking: propertyDataAny.visitor_parking,
            water_storage_facility: propertyDataAny.water_storage_facility,
            wifi: propertyDataAny.wifi
          }, null, 2));
          const amenitiesData = propertyData.amenities as any;
          console.log('Properties table amenities data:', JSON.stringify({
            amenities_json: amenitiesData,
            amenities_type: typeof amenitiesData,
            pet_allowed: amenitiesData?.pet_allowed,
            pet_allowed_type: typeof amenitiesData?.pet_allowed,
            non_veg_allowed: amenitiesData?.non_veg_allowed,
            non_veg_allowed_type: typeof amenitiesData?.non_veg_allowed,
            gated_security: amenitiesData?.gated_security,
            gated_security_type: typeof amenitiesData?.gated_security,
            gym: amenitiesData?.gym,
            gym_type: typeof amenitiesData?.gym,
            images: propertyData.images,
            images_type: typeof propertyData.images,
            images_length: Array.isArray(propertyData.images) ? propertyData.images.length : 'not array',
            images_content: propertyData.images
          }, null, 2));
          // Convert properties table data to PropertyPreviewData format
          const convertedData: PropertyPreviewData = {
            id: propertyData.id,
            user_id: propertyData.user_id,
            title: propertyData.title || generatePropertyTitle(propertyData),
            property_type: propertyData.property_type,
            listing_type: propertyData.listing_type,
            bhk_type: propertyData.bhk_type,
            expected_price: propertyData.expected_price || (propertyData as any).expectedPrice || 0,
            expected_rent: propertyData.expected_price || (propertyData as any).expectedPrice || 0, // For rental properties
            expected_deposit: propertyDataAny.expected_deposit || propertyDataAny.security_deposit || propertyDataAny.deposit || 0,
            super_area: propertyData.super_area,
            carpet_area: propertyData.carpet_area,
            bathrooms: propertyData.bathrooms,
            balconies: propertyData.balconies,
            city: propertyData.city,
            locality: propertyData.locality,
            state: propertyData.state,
            pincode: propertyData.pincode,
            description: propertyData.description,
            images: propertyData.images ? propertyData.images.map((img: string) => {
              console.log('Processing image:', img, 'Type:', typeof img);
              // Handle double-quoted URLs (remove quotes if present)
              let cleanImg = img;
              if (typeof img === 'string' && img.startsWith('"') && img.endsWith('"')) {
                cleanImg = img.slice(1, -1); // Remove quotes
                console.log('Removed quotes from image URL:', cleanImg);
              }
              
              // If it's already a full URL, use it directly
              if (cleanImg && (cleanImg.startsWith('http') || cleanImg.startsWith('data:'))) {
                console.log('Using full URL:', cleanImg);
                return cleanImg;
              }
              
              // If it's a relative path, get the public URL from Supabase storage
              if (cleanImg && !cleanImg.startsWith('http') && !cleanImg.startsWith('data:')) {
                const { data } = supabase.storage.from('property-media').getPublicUrl(cleanImg);
                console.log('Converted relative path to full URL:', data.publicUrl);
                return data.publicUrl;
              }
              
              console.log('Using original image URL:', cleanImg);
              return cleanImg;
            }) : [],
            videos: propertyData.videos || [],
            status: propertyData.status,
            created_at: propertyData.created_at,
            // Map amenities from individual fields (since amenities JSON is empty)
            amenities: {
              lift: propertyDataAny.lift,
              powerBackup: propertyDataAny.power_backup,
              waterSupply: propertyDataAny.water_supply,
              security: propertyDataAny.security,
              gym: propertyDataAny.gym,
              gatedSecurity: propertyDataAny.gated_security === true || propertyDataAny.gated_security === 'true' || propertyDataAny.gated_security === '1',
              bathrooms: propertyData.bathrooms,
              balconies: propertyData.balconies,
              // Convert string booleans to actual booleans
              petAllowed: propertyDataAny.pet_allowed === true || propertyDataAny.pet_allowed === 'true' || propertyDataAny.pet_allowed === '1',
              nonVegAllowed: propertyDataAny.non_veg_allowed === true || propertyDataAny.non_veg_allowed === 'true' || propertyDataAny.non_veg_allowed === '1',
              whoWillShow: propertyDataAny.who_will_show,
              currentPropertyCondition: propertyDataAny.current_property_condition,
              directionsTip: propertyDataAny.directions_tip,
              internetServices: propertyDataAny.internet_services,
              airConditioner: propertyDataAny.air_conditioner,
              clubHouse: propertyDataAny.club_house,
              intercom: propertyDataAny.intercom,
              swimmingPool: propertyDataAny.swimming_pool,
              childrenPlayArea: propertyDataAny.children_play_area,
              fireSafety: propertyDataAny.fire_safety,
              servantRoom: propertyDataAny.servant_room,
              shoppingCenter: propertyDataAny.shopping_center,
              gasPipeline: propertyDataAny.gas_pipeline,
              park: propertyDataAny.park,
              rainWaterHarvesting: propertyDataAny.rain_water_harvesting,
              sewageTreatmentPlant: propertyDataAny.sewage_treatment_plant,
              houseKeeping: propertyDataAny.house_keeping,
              visitorParking: propertyDataAny.visitor_parking,
              waterStorageFacility: propertyDataAny.water_storage_facility,
              wifi: propertyDataAny.wifi,
              furnishing: propertyData.furnishing,
              parking: propertyDataAny.parking,
              // Land/Plot infrastructure fields
              electricityConnection: propertyDataAny.electricity_connection,
              sewageConnection: propertyDataAny.sewage_connection
            },
            // Map other fields
            available_from: propertyData.availability_date,
            parking: propertyDataAny.parking,
            furnishing: propertyData.furnishing,
            floor_no: propertyData.floor_no,
            total_floors: propertyData.total_floors,
            property_age: propertyData.property_age || propertyDataAny.age_of_building,
            facing: propertyData.facing_direction,
            preferred_tenant: propertyDataAny.preferred_tenant,
            power_backup: propertyDataAny.power_backup,
            lift: propertyDataAny.lift,
            water_supply: propertyDataAny.water_supply,
            security: propertyDataAny.security,
            gym: propertyDataAny.gym,
            gated_security: propertyDataAny.gated_security === true || propertyDataAny.gated_security === 'true' || propertyDataAny.gated_security === '1' ? 'Yes' : 'No',
            current_property_condition: propertyDataAny.current_property_condition,
            directions_tip: propertyDataAny.directions_tip,
            // Additional amenities fields
            pet_allowed: propertyDataAny.pet_allowed === true || propertyDataAny.pet_allowed === 'true' || propertyDataAny.pet_allowed === '1',
            non_veg_allowed: propertyDataAny.non_veg_allowed === true || propertyDataAny.non_veg_allowed === 'true' || propertyDataAny.non_veg_allowed === '1',
            who_will_show: propertyDataAny.who_will_show,
            secondary_phone: propertyDataAny.secondary_phone,
            internet_services: propertyDataAny.internet_services,
            air_conditioner: propertyDataAny.air_conditioner,
            club_house: propertyDataAny.club_house,
            intercom: propertyDataAny.intercom,
            swimming_pool: propertyDataAny.swimming_pool,
            children_play_area: propertyDataAny.children_play_area,
            fire_safety: propertyDataAny.fire_safety,
            servant_room: propertyDataAny.servant_room,
            shopping_center: propertyDataAny.shopping_center,
            gas_pipeline: propertyDataAny.gas_pipeline,
            park: propertyDataAny.park,
            rain_water_harvesting: propertyDataAny.rain_water_harvesting,
            sewage_treatment_plant: propertyDataAny.sewage_treatment_plant,
            house_keeping: propertyDataAny.house_keeping,
            visitor_parking: propertyDataAny.visitor_parking,
            water_storage_facility: propertyDataAny.water_storage_facility,
            wifi: propertyDataAny.wifi,
            // Land/Plot specific fields
            plot_area: propertyDataAny.plot_area,
            plot_area_unit: propertyDataAny.plot_area_unit,
            plot_length: propertyDataAny.plot_length,
            plot_width: propertyDataAny.plot_width,
            boundary_wall: propertyDataAny.boundary_wall,
            corner_plot: propertyDataAny.corner_plot,
            road_facing: propertyDataAny.road_facing,
            road_width: propertyDataAny.road_width,
            land_type: propertyDataAny.land_type,
            plot_shape: propertyDataAny.plot_shape,
            gated_community: propertyDataAny.gated_community,
            gated_project: propertyDataAny.gated_project,
            floors_allowed: propertyDataAny.floors_allowed,
            survey_number: propertyDataAny.survey_number,
            sub_division: propertyDataAny.sub_division,
            village_name: propertyDataAny.village_name,
            ownership_type: propertyDataAny.ownership_type,
            approved_by: propertyDataAny.approved_by,
            electricity_connection: propertyDataAny.electricity_connection,
            sewage_connection: propertyDataAny.sewage_connection,
            price_negotiable: propertyDataAny.price_negotiable,
            possession_date: propertyDataAny.possession_date
          };
          
          console.log('Converted data for properties table:', JSON.stringify({
            amenities: convertedData.amenities,
            amenities_petAllowed: convertedData.amenities.petAllowed,
            amenities_nonVegAllowed: convertedData.amenities.nonVegAllowed,
            amenities_gym: convertedData.amenities.gym,
            amenities_gatedSecurity: convertedData.amenities.gatedSecurity,
            images: convertedData.images,
            images_length: Array.isArray(convertedData.images) ? convertedData.images.length : 'not array',
            images_content: convertedData.images,
            // Debug missing fields
            expected_deposit: convertedData.expected_deposit,
            preferred_tenant: convertedData.preferred_tenant,
            property_age: convertedData.property_age,
            pet_allowed: convertedData.pet_allowed,
            non_veg_allowed: convertedData.non_veg_allowed,
            gym: convertedData.gym,
            gated_security: convertedData.gated_security
          }, null, 2));
          
          setPropertyData(convertedData);
          setLoading(false);
          return;
        } else {
          console.log('❌ NOT found in properties table. Error:', propertyError);
          
          // Check if this property exists in property_submissions table
          console.log('Checking property_submissions table for propertyId:', propertyId);
          const { data: submissionData, error: submissionError } = await supabase
            .from('property_submissions')
            .select('*')
            .eq('id', propertyId)
            .single();

          if (!submissionError && submissionData) {
            console.log('✅ FOUND in property_submissions table:', submissionData);
            const payload = submissionData.payload as any;
            console.log('Property_submissions payload data:', JSON.stringify({
              payload: payload,
              payload_type: typeof payload,
              images: payload?.images,
              images_type: typeof payload?.images,
              images_length: Array.isArray(payload?.images) ? payload.images.length : 'not array',
              images_content: payload?.images,
              // Debug specific fields that are missing
              deposit: payload?.expected_deposit,
              preferred_tenant: payload?.preferred_tenant,
              age_of_building: payload?.property_age,
              pet_allowed: payload?.pet_allowed,
              non_veg_allowed: payload?.non_veg_allowed,
              gym: payload?.gym,
              gated_security: payload?.gated_security,
              // Debug amenities structure
              amenities_structure: payload?.amenities,
              furnishing: payload?.furnishing,
              parking: payload?.parking,
              // Debug all available keys in payload
              payload_keys: Object.keys(payload || {}),
              // Debug specific amenity fields
              lift: payload?.lift,
              power_backup: payload?.power_backup,
              water_supply: payload?.water_supply,
              security: payload?.security
            }, null, 2));
            
            // Convert property_submissions data to PropertyPreviewData format
            const convertedData: PropertyPreviewData = {
              id: submissionData.id,
              user_id: submissionData.user_id,
              title: submissionData.title || generatePropertyTitle(payload),
              property_type: payload?.property_type || 'residential',
              listing_type: payload?.listing_type || 'rent',
              bhk_type: payload?.bhk_type,
              expected_price: payload?.expected_price || payload?.expectedPrice || payload?.originalFormData?.rentalDetails?.expectedPrice || 0,
              expected_rent: payload?.expected_price || payload?.expectedPrice || payload?.originalFormData?.rentalDetails?.expectedPrice || 0, // For rental properties
              expected_deposit: payload?.expected_deposit || payload?.security_deposit || payload?.originalFormData?.rentalDetails?.securityDeposit || 0,
              super_area: payload?.super_area || payload?.built_up_area || 0,
              carpet_area: payload?.carpet_area || 0,
              bathrooms: payload?.bathrooms || 0,
              balconies: payload?.balconies || 0,
              city: submissionData.city,
              locality: payload?.locality || '',
              state: submissionData.state,
              pincode: payload?.pincode || '',
              description: payload?.description || '',
              images: payload?.images ? payload.images.map((img: string) => {
                console.log('Processing image:', img, 'Type:', typeof img);
                // Handle double-quoted URLs (remove quotes if present)
                let cleanImg = img;
                if (typeof img === 'string' && img.startsWith('"') && img.endsWith('"')) {
                  cleanImg = img.slice(1, -1); // Remove quotes
                  console.log('Removed quotes from image URL:', cleanImg);
                }
                
                // If it's already a full URL, use it directly
                if (cleanImg && (cleanImg.startsWith('http') || cleanImg.startsWith('data:'))) {
                  console.log('Using full URL:', cleanImg);
                  return cleanImg;
                }
                
                // If it's a relative path, get the public URL from Supabase storage
                if (cleanImg && !cleanImg.startsWith('http') && !cleanImg.startsWith('data:')) {
                  const { data } = supabase.storage.from('property-media').getPublicUrl(cleanImg);
                  console.log('Converted relative path to full URL:', data.publicUrl);
                  return data.publicUrl;
                }
                
                console.log('Using original image URL:', cleanImg);
                return cleanImg;
              }) : [],
              videos: payload?.videos || [],
              status: submissionData.status,
              created_at: submissionData.created_at,
              // Map amenities from payload.amenities object
              amenities: {
                lift: payload?.amenities?.lift,
                powerBackup: payload?.amenities?.powerBackup || payload?.power_backup,
                waterSupply: payload?.amenities?.waterSupply || payload?.water_supply,
                security: payload?.amenities?.security || payload?.security,
                gym: payload?.amenities?.gym,
                gatedSecurity: payload?.amenities?.gatedSecurity === true || payload?.amenities?.gatedSecurity === 'true' || payload?.amenities?.gatedSecurity === '1',
                bathrooms: payload?.bathrooms || 0,
                balconies: payload?.balconies || 0,
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
                // Land/Plot specific amenities
                electricityConnection: payload?.amenities?.electricityConnection || payload?.electricity_connection,
                sewageConnection: payload?.amenities?.sewageConnection || payload?.sewage_connection,
                rainWaterHarvesting: payload?.amenities?.rainWaterHarvesting,
                sewageTreatmentPlant: payload?.amenities?.sewageTreatmentPlant,
                houseKeeping: payload?.amenities?.houseKeeping,
                visitorParking: payload?.amenities?.visitorParking,
                waterStorageFacility: payload?.amenities?.waterStorageFacility,
                wifi: payload?.amenities?.wifi,
                furnishing: payload?.furnishing,
                parking: payload?.parking
              },
              // Map other fields
              available_from: payload?.available_from,
              parking: payload?.parking,
              furnishing: payload?.furnishing,
              floor_no: payload?.floor_no,
              total_floors: payload?.total_floors,
              property_age: payload?.age_of_building || payload?.property_age,
              facing: payload?.facing,
              preferred_tenant: payload?.preferred_tenant || (payload?.property_type === 'flatmates' ? payload?.gender_preference_flatmates : null), // Added this
              power_backup: payload?.power_backup,
              lift: payload?.lift,
              water_supply: payload?.water_supply,
              security: payload?.security,
              gym: payload?.gym,
              gated_security: payload?.gated_security === true || payload?.gated_security === 'true' || payload?.gated_security === '1' ? 'Yes' : 'No',
              current_property_condition: payload?.current_property_condition,
              directions_tip: payload?.directions_tip,
              // Additional amenities fields
              pet_allowed: payload?.pet_allowed === true || payload?.pet_allowed === 'true' || payload?.pet_allowed === '1',
              non_veg_allowed: payload?.non_veg_allowed === true || payload?.non_veg_allowed === 'true' || payload?.non_veg_allowed === '1',
              who_will_show: payload?.who_will_show,
              secondary_phone: payload?.secondary_phone,
              internet_services: payload?.internet_services,
              air_conditioner: payload?.air_conditioner,
              club_house: payload?.club_house,
              intercom: payload?.intercom,
              swimming_pool: payload?.swimming_pool,
              children_play_area: payload?.children_play_area,
              fire_safety: payload?.fire_safety,
              servant_room: payload?.servant_room,
              shopping_center: payload?.shopping_center,
              gas_pipeline: payload?.gas_pipeline,
              park: payload?.park,
              rain_water_harvesting: payload?.rain_water_harvesting,
              sewage_treatment_plant: payload?.sewage_treatment_plant,
              house_keeping: payload?.house_keeping,
              visitor_parking: payload?.visitor_parking,
              water_storage_facility: payload?.water_storage_facility,
              wifi: payload?.wifi
            };
            
            console.log('Converted data for property_submissions table:', JSON.stringify({
              amenities: convertedData.amenities,
              amenities_petAllowed: convertedData.amenities.petAllowed,
              amenities_nonVegAllowed: convertedData.amenities.nonVegAllowed,
              amenities_gym: convertedData.amenities.gym,
              amenities_gatedSecurity: convertedData.amenities.gatedSecurity,
              images: convertedData.images,
              images_length: Array.isArray(convertedData.images) ? convertedData.images.length : 'not array',
              images_content: convertedData.images,
              // Debug missing fields
              expected_deposit: convertedData.expected_deposit,
              preferred_tenant: convertedData.preferred_tenant,
              property_age: convertedData.property_age,
              pet_allowed: convertedData.pet_allowed,
              non_veg_allowed: convertedData.non_veg_allowed,
              gym: convertedData.gym,
              gated_security: convertedData.gated_security
            }, null, 2));
            
            setPropertyData(convertedData);
            setLoading(false);
            return;
          } else {
            console.log('❌ NOT found in property_submissions table. Error:', submissionError);
          }
        }

        // If not found in properties table, try property_submissions table (for recently submitted properties)
        console.log('Not found in properties table, checking property_submissions...');
        const { data: submissionData, error: submissionError } = await supabase
          .from('property_submissions')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (!submissionError && submissionData) {
          console.log('✅ FOUND in property_submissions table:', submissionData);
          const payload = submissionData.payload as any;
          console.log('Property_submissions payload data:', {
            payload: payload,
            payload_type: typeof payload,
            images: payload?.images,
            images_type: typeof payload?.images,
            images_length: Array.isArray(payload?.images) ? payload.images.length : 'not array',
            images_content: payload?.images,
            // Debug specific fields that are missing
            deposit: payload?.expected_deposit,
            preferred_tenant: payload?.preferred_tenant,
            age_of_building: payload?.property_age,
            pet_allowed: payload?.pet_allowed,
            non_veg_allowed: payload?.non_veg_allowed,
            gym: payload?.gym,
            gated_security: payload?.gated_security,
            // Debug amenities structure
            amenities_structure: payload?.amenities,
            furnishing: payload?.furnishing,
            parking: payload?.parking,
            // Debug all available keys in payload
            payload_keys: Object.keys(payload || {}),
            // Debug specific amenity fields
            lift: payload?.lift,
            power_backup: payload?.power_backup,
            water_supply: payload?.water_supply,
            security: payload?.security
          });
          
          // Convert property_submissions data to PropertyPreviewData format
          const convertedData: PropertyPreviewData = {
            id: submissionData.id,
            user_id: submissionData.user_id,
            title: submissionData.title || generatePropertyTitle(payload),
            property_type: payload?.property_type || 'residential',
            listing_type: payload?.listing_type || 'rent',
            bhk_type: payload?.bhk_type,
            expected_price: payload?.expected_price || payload?.expectedPrice || payload?.originalFormData?.rentalDetails?.expectedPrice || 0,
            expected_rent: payload?.expected_price || payload?.expectedPrice || payload?.originalFormData?.rentalDetails?.expectedPrice || 0, // For rental properties
            expected_deposit: payload?.expected_deposit || payload?.deposit || payload?.originalFormData?.rentalDetails?.securityDeposit || 0,
            super_area: payload?.super_area || payload?.built_up_area || 0,
            carpet_area: payload?.carpet_area || 0,
            bathrooms: payload?.bathrooms || 0,
            balconies: payload?.balconies || 0,
            city: submissionData.city,
            locality: payload?.locality || '',
            state: submissionData.state,
            pincode: payload?.pincode || '',
            description: payload?.description || '',
            images: payload?.images ? payload.images.map((img: string) => {
              console.log('Processing image:', img, 'Type:', typeof img);
              // Normalize image URLs - convert relative paths to full URLs
              if (img && !img.startsWith('http') && !img.startsWith('data:')) {
                // If it's a relative path, get the public URL from Supabase storage
                const { data } = supabase.storage.from('property-media').getPublicUrl(img);
                console.log('Converted image URL:', data.publicUrl);
                return data.publicUrl;
              }
              console.log('Using original image URL:', img);
              return img;
            }) : [],
            videos: payload?.videos || [],
            status: submissionData.status,
            created_at: submissionData.created_at,
            // Map amenities from payload
            amenities: {
              lift: payload?.lift,
              powerBackup: payload?.power_backup,
              waterSupply: payload?.water_supply,
              security: payload?.security,
              gym: payload?.gym,
              gatedSecurity: payload?.gated_security === true || payload?.gated_security === 'true' || payload?.gated_security === '1',
              bathrooms: payload?.bathrooms || 0,
              balconies: payload?.balconies || 0,
              // Convert string booleans to actual booleans
              petAllowed: payload?.pet_allowed === true || payload?.pet_allowed === 'true' || payload?.pet_allowed === '1',
              nonVegAllowed: payload?.non_veg_allowed === true || payload?.non_veg_allowed === 'true' || payload?.non_veg_allowed === '1',
              whoWillShow: payload?.who_will_show,
              currentPropertyCondition: payload?.current_property_condition,
              directionsTip: payload?.directions_tip,
              internetServices: payload?.internet_services,
              airConditioner: payload?.air_conditioner,
              clubHouse: payload?.club_house,
              intercom: payload?.intercom,
              swimmingPool: payload?.swimming_pool,
              childrenPlayArea: payload?.children_play_area,
              fireSafety: payload?.fire_safety,
              servantRoom: payload?.servant_room,
              shoppingCenter: payload?.shopping_center,
              gasPipeline: payload?.gas_pipeline,
              park: payload?.park,
              rainWaterHarvesting: payload?.rain_water_harvesting,
              sewageTreatmentPlant: payload?.sewage_treatment_plant,
              houseKeeping: payload?.house_keeping,
              visitorParking: payload?.visitor_parking,
              waterStorageFacility: payload?.water_storage_facility,
              wifi: payload?.wifi,
              furnishing: payload?.furnishing,
              parking: payload?.parking
            },
            // Map other fields
            available_from: payload?.available_from,
            parking: payload?.parking,
            furnishing: payload?.furnishing,
            floor_no: payload?.floor_no,
            total_floors: payload?.total_floors,
            property_age: payload?.age_of_building || payload?.property_age,
            facing: payload?.facing,
            preferred_tenant: payload?.preferred_tenant || (payload?.property_type === 'flatmates' ? payload?.gender_preference_flatmates : null),
            power_backup: payload?.power_backup,
            lift: payload?.lift,
            water_supply: payload?.water_supply,
            security: payload?.security,
            gym: payload?.gym,
            gated_security: payload?.gated_security === true || payload?.gated_security === 'true' || payload?.gated_security === '1' ? 'Yes' : 'No',
            current_property_condition: payload?.current_property_condition,
            directions_tip: payload?.directions_tip,
            // Additional amenities fields
            pet_allowed: payload?.pet_allowed === true || payload?.pet_allowed === 'true' || payload?.pet_allowed === '1',
            non_veg_allowed: payload?.non_veg_allowed === true || payload?.non_veg_allowed === 'true' || payload?.non_veg_allowed === '1',
            who_will_show: payload?.who_will_show,
            secondary_phone: payload?.secondary_phone,
            internet_services: payload?.internet_services,
            air_conditioner: payload?.air_conditioner,
            club_house: payload?.club_house,
            intercom: payload?.intercom,
            swimming_pool: payload?.swimming_pool,
            children_play_area: payload?.children_play_area,
            fire_safety: payload?.fire_safety,
            servant_room: payload?.servant_room,
            shopping_center: payload?.shopping_center,
            gas_pipeline: payload?.gas_pipeline,
            park: payload?.park,
            rain_water_harvesting: payload?.rain_water_harvesting,
            sewage_treatment_plant: payload?.sewage_treatment_plant,
            house_keeping: payload?.house_keeping,
            visitor_parking: payload?.visitor_parking,
            water_storage_facility: payload?.water_storage_facility,
            wifi: payload?.wifi,
            // Flatmates specific fields
            existing_flatmates: payload?.existing_flatmates,
            gender_preference_flatmates: payload?.gender_preference_flatmates,
            occupation: payload?.occupation,
            lifestyle_preference: payload?.lifestyle_preference,
            smoking_allowed: payload?.smoking_allowed,
            pets_allowed: payload?.pets_allowed,
            maintenance_extra: payload?.maintenance_extra,
            maintenance_charges: payload?.maintenance_charges,
            deposit_negotiable: payload?.deposit_negotiable,
            lease_duration: payload?.lease_duration,
            lockin_period: payload?.lockin_period,
            brokerage_type: payload?.brokerage_type,
            preferred_tenants: payload?.preferred_tenants,
            ideal_for: payload?.ideal_for
          };
          
          console.log('Converted data for property_submissions table:', {
            amenities: convertedData.amenities,
            amenities_petAllowed: convertedData.amenities.petAllowed,
            amenities_nonVegAllowed: convertedData.amenities.nonVegAllowed,
            amenities_gym: convertedData.amenities.gym,
            amenities_gatedSecurity: convertedData.amenities.gatedSecurity,
            images: convertedData.images,
            images_length: Array.isArray(convertedData.images) ? convertedData.images.length : 'not array',
            images_content: convertedData.images,
            // Debug missing fields
            expected_deposit: convertedData.expected_deposit,
            preferred_tenant: convertedData.preferred_tenant,
            property_age: convertedData.property_age,
            pet_allowed: convertedData.pet_allowed,
            non_veg_allowed: convertedData.non_veg_allowed,
            gym: convertedData.gym,
            gated_security: convertedData.gated_security
          });
          
          setPropertyData(convertedData);
          setLoading(false);
          return;
        }

        // If not found in either table
        console.error('Property not found in either drafts or properties table');
        setError('Property not found');
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load property data');
        setLoading(false);
      }
    };

    fetchPropertyData();

    // Set up polling for real-time updates (only for drafts)
    const interval = setInterval(() => {
      if (propertyData && propertyData.status === 'draft') {
        fetchPropertyData();
      }
    }, 2000);

    return () => clearInterval(interval);
    }, [propertyId]);

  useEffect(() => {
    if (propertyData) {
      const isDraft = propertyData.status === 'draft';
      document.title = `${propertyData.bhk_type || 'Property'} ${propertyData.property_type} For ${propertyData.listing_type} | ${isDraft ? 'Preview' : 'Property Details'}`;
    }
  }, [propertyData]);

  // Convert draft data to Property format for existing components
  const convertDraftToProperty = (draft: PropertyPreviewData) => {
    console.log('Converting draft to property:', draft);
    console.log('Images data:', {
      images: draft.images,
      imagesType: typeof draft.images,
      imagesLength: Array.isArray(draft.images) ? draft.images.length : 'not array',
      firstImage: Array.isArray(draft.images) && draft.images.length > 0 ? draft.images[0] : 'no images'
    });
    console.log('Built-up area values:', {
      super_area: draft.super_area,
      built_up_area: draft.built_up_area,
      final_super_area: draft.super_area || draft.built_up_area || 0
    });
    
    const converted = {
      id: draft.id,
      user_id: draft.user_id,
      title: draft.title || `${draft.bhk_type || 'Property'} ${draft.property_type} For ${draft.listing_type}`,
      property_type: draft.property_type,
      listing_type: draft.listing_type,
      bhk_type: draft.bhk_type,
      expected_price: draft.expected_price || draft.expected_rent || 0,
      expected_rent: draft.expected_rent || 0,
      price_negotiable: draft.price_negotiable,
      possession_date: draft.possession_date,
      ownership_type: draft.ownership_type,
      approved_by: draft.approved_by,
      super_area: draft.super_area || draft.built_up_area || 0,
      carpet_area: draft.carpet_area || 0,
      bathrooms: draft.bathrooms || 1,
      balconies: draft.balconies || 0,
      city: draft.city,
      locality: draft.locality,
      state: draft.state,
      pincode: draft.pincode,
      description: draft.description,
      images: draft.images || [],
      videos: draft.videos || [],
      status: 'draft',
      rental_status: 'available' as const,
      created_at: draft.created_at,
      // Land/Plot specific fields
      plot_area: draft.plot_area,
      plot_area_unit: draft.plot_area_unit,
      plot_length: draft.plot_length,
      plot_width: draft.plot_width,
      boundary_wall: draft.boundary_wall,
      corner_plot: draft.corner_plot,
      road_facing: draft.road_facing,
      road_width: draft.road_width,
      land_type: draft.land_type,
      plot_shape: draft.plot_shape,
      gated_community: draft.gated_community,
      gated_project: draft.gated_project,
      floors_allowed: draft.floors_allowed,
      survey_number: draft.survey_number,
      sub_division: draft.sub_division,
      village_name: draft.village_name,
      electricity_connection: draft.electricity_connection,
      sewage_connection: draft.sewage_connection,
      amenities: {
        // Map individual amenities fields to amenities object
        lift: draft.lift,
        powerBackup: draft.power_backup,
        waterSupply: draft.water_supply,
        security: draft.security,
        gym: draft.gym,
        gatedSecurity: draft.gated_security,
        bathrooms: draft.bathrooms,
        balconies: draft.balconies,
        petAllowed: draft.pet_allowed,
        nonVegAllowed: draft.non_veg_allowed,
        whoWillShow: draft.who_will_show,
        currentPropertyCondition: draft.current_property_condition,
        directionsTip: draft.directions_tip,
        internetServices: draft.internet_services,
        airConditioner: draft.air_conditioner,
        clubHouse: draft.club_house,
        intercom: draft.intercom,
        swimmingPool: draft.swimming_pool,
        childrenPlayArea: draft.children_play_area,
        fireSafety: draft.fire_safety,
        servantRoom: draft.servant_room,
        shoppingCenter: draft.shopping_center,
        gasPipeline: draft.gas_pipeline,
        park: draft.park,
        rainWaterHarvesting: draft.rain_water_harvesting,
        sewageTreatmentPlant: draft.sewage_treatment_plant,
        houseKeeping: draft.house_keeping,
        visitorParking: draft.visitor_parking,
        waterStorageFacility: draft.water_storage_facility,
        wifi: draft.wifi,
        // Land/Plot infrastructure fields
        electricityConnection: draft.electricity_connection,
        sewageConnection: draft.sewage_connection,
        // PG/Hostel amenities
        common_tv: draft.common_tv,
        refrigerator: draft.refrigerator,
        mess: draft.mess,
        cooking_allowed: draft.cooking_allowed,
        // Keep existing amenities if any
        ...draft.amenities
      },
      additional_documents: draft.additional_documents,
      security_deposit: draft.expected_deposit,
      available_from: draft.available_from,
      parking: draft.parking,
      age_of_building: draft.property_age,
      floor_no: draft.floor_no,
      total_floors: draft.total_floors,
      // PG/Hostel services
      available_services: draft.available_services,
      // PG/Hostel preferences
      gender_preference: draft.gender_preference,
      preferred_guests: draft.preferred_guests,
      // Use the actual preferred_tenant value (not override with preferred_guests)
      preferred_tenant: draft.preferred_tenant,
      // PG/Hostel details
      food_included: draft.food_included,
      gate_closing_time: draft.gate_closing_time,
      // PG/Hostel amenities
      common_tv: draft.common_tv,
      refrigerator: draft.refrigerator,
      mess: draft.mess,
      cooking_allowed: draft.cooking_allowed,
      // PG/Hostel room amenities
      room_amenities: draft.room_amenities,
    };
    console.log('Converted property:', converted);
    return converted;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Marquee />
        <Header />
        <div className="pt-12 sm:pt-6 pb-6">
          <div className="mx-auto max-w-7xl px-2 sm:px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
                <div className="lg:col-span-2">
                  <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !propertyData) {
    return (
      <div className="min-h-screen bg-white">
        <Marquee />
        <Header />
        <div className="pt-12 sm:pt-6 pb-6">
          <div className="mx-auto max-w-7xl px-2 sm:px-4">
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
              <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
              <button 
                onClick={() => navigate('/post-property')} 
                className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-2 rounded-lg"
              >
                Back to Post Property
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const property = convertDraftToProperty(propertyData);
  
  // Debug logging for PG/Hostel services and room amenities
  console.log('PropertyPreviewPage - About to render OverviewCard with property:', {
    property_type: property.property_type,
    available_services: (property as any).available_services,
    room_cleaning_value: (property as any).available_services?.room_cleaning,
    laundry_value: (property as any).available_services?.laundry,
    warden_facility_value: (property as any).available_services?.warden_facility,
    debug_services: (property as any).debug_services,
    room_amenities: (property as any).room_amenities,
    gate_closing_time: (property as any).gate_closing_time,
    food_included: (property as any).food_included,
    preferred_guests: (property as any).preferred_guests,
    preferred_tenant: (property as any).preferred_tenant,
    is_pg_hostel: property.property_type === 'PG/Hostel' || property.property_type?.toLowerCase().includes('pg') || property.property_type?.toLowerCase().includes('hostel')
  });
  
  // Debug the final property object
  console.log('Final property object for PropertyImageGallery:', {
    id: property.id,
    title: property.title,
    images: property.images,
    imagesType: typeof property.images,
    imagesLength: Array.isArray(property.images) ? property.images.length : 'not array'
  });

  return (
    <div className="min-h-screen bg-white">
      {/* <Marquee /> - Removed duplicate Marquee as it's part of Header */}
      <Header />
      
      {/* Draft Preview Banner */}
      <div className="bg-blue-50 border-b border-blue-200 py-2">
        <div className="mx-auto max-w-7xl px-2 sm:px-4">
          <div className="flex items-center justify-center gap-2 text-blue-800">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Draft Preview - Step {propertyData.current_step || 1} of 7</span>
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              Real-time Updates
            </Badge>
          </div>
        </div>
      </div>

      <div className="pt-36 sm:pt-16">
        {/* Main Content - Same structure as PropertyDetails */}
        <section className="pb-6 overflow-x-hidden min-w-0">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 overflow-x-hidden">
            {/* Property Header - Desktop (Above Images) */}
            <div className="hidden sm:block mb-6 overflow-hidden">
              <PropertyHeader property={property as any} />
            </div>

            {/* Property Gallery and Info Grid */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-8 mb-8 min-w-0">
              {/* Left - Image Gallery */}
              <div className="lg:col-span-2 min-w-0">
                <div className="mt-3 sm:mt-0 overflow-hidden">
                  <PropertyWatermark status={propertyData?.status === 'draft' ? 'draft' : 'available' as any}>
                    <PropertyImageGallery property={property as any} />
                  </PropertyWatermark>
                </div>
                
                {/* Header Section - Mobile Only (Below Images) */}
                <div className="block sm:hidden mt-6 overflow-hidden">
                  <PropertyHeader 
                    property={property as any} 
                    onContact={() => setShowContactModal(true)}
                    onScheduleVisit={() => setShowScheduleVisitModal(true)}
                  />
                </div>
              </div>
              
              {/* Right - Property Info Cards */}
              <div className="space-y-6 min-w-0">
                <PropertyInfoCards property={property as any} />
                
                {/* Action Buttons - Desktop Only */}
                <div className="hidden sm:block">
                  <PropertyActions
                    onContact={() => setShowContactModal(true)}
                    onScheduleVisit={() => setShowScheduleVisitModal(true)}
                    property={property as any}
                    onPropertyStatusUpdate={() => {}}
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
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium w-full">
                    Apply Loan
                  </Button>
                </Link>
              </div>
              
              {/* Overview */}
              <OverviewCard property={property as any} />
              
              {/* Room Details - Only for PG/Hostel */}
              {(property.property_type === 'PG/Hostel' || property.property_type?.toLowerCase().includes('pg') || property.property_type?.toLowerCase().includes('hostel')) && (
                <>
                  {console.log('RoomDetailsCard render check:', {
                    property_type: property.property_type,
                    room_amenities: (property as any).room_amenities,
                    has_room_amenities: !!(property as any).room_amenities,
                    room_amenities_keys: (property as any).room_amenities ? Object.keys((property as any).room_amenities) : 'no room_amenities'
                  })}
                  <RoomDetailsCard room_amenities={(property as any).room_amenities} />
                </>
              )}
              
              {/* Description */}
              {property.description && (
                <DescriptionCard property={property as any} />
              )}
              
              {/* Amenities */}
              <AmenitiesCard amenities={property.amenities} />
              
              {/* Location */}
              <LocationCard property={property as any} />
              
              {/* Neighborhood */}
              <NeighborhoodCard property={property as any} />
              
              {/* Services */}
              <ServicesCard />
              
              {/* Related Properties */}
              <RelatedPropertiesCard property={property as any} />
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <ContactOwnerModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
          propertyId={property?.id || ''}
          propertyTitle={property?.title || ''}
          listingType={property?.listing_type || 'rent'}
      />
      
      <ScheduleVisitModal
        isOpen={showScheduleVisitModal}
        onClose={() => setShowScheduleVisitModal(false)}
        propertyId={property?.id || ''}
        propertyTitle={property?.title || ''}
      />
      
      <EMICalculatorModal
        isOpen={showEMICalculatorModal}
        onClose={() => setShowEMICalculatorModal(false)}
      />
      
      <LegalServicesForm
        isOpen={showLegalServicesModal}
        onClose={() => setShowLegalServicesModal(false)}
      />

      <Footer />
      <ChatBot />
    </div>
  );
};
