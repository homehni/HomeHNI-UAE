// @ts-nocheck
import React from 'react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { ServicesCard } from '@/components/property-details/ServicesCard';
import { DescriptionCard } from '@/components/property-details/DescriptionCard';
import { supabase } from '@/integrations/supabase/client';
interface Property {
  id: string;
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
  created_at: string;
  amenities?: any; // May come as JSONB object
  additional_documents?: Record<string, boolean>;
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
  
  // Function to fetch latest property data from database
  const fetchLatestPropertyData = async () => {
    if (!id) return;
    
    console.log('Fetching property data for ID:', id);
    setLoading(true);
    try {
      // First, use secure public function (works for anonymous users)
      const { data: pubData, error: pubError } = await supabase
        .rpc('get_public_property_by_id', { property_id: id });

      if (!pubError && pubData && pubData.length > 0) {
        const raw = pubData[0] as any;
        // Normalize image paths to public URLs
        const normalize = (s: string): string | null => {
          if (!s) return null;
          const rawStr = String(s).trim();
          if (/^https?:\/\//i.test(rawStr) || /^data:/i.test(rawStr) || rawStr.startsWith('/')) return rawStr;
          // Strip common prefixes
          let cleaned = rawStr
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
        setProperty({ ...(raw as Property), images: normalizedImages as string[] } as Property);
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
        const normalizedImages = Array.isArray(raw.images) ? raw.images : [];
        setProperty({ ...(raw as Property), images: normalizedImages } as Property);
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
          const propertyFromSubmission = {
            id: submissionData.id,
            title: submissionData.title || payload.title || 'Untitled Property',
            property_type: payload.property_type || 'apartment',
            listing_type: payload.listing_type || 'rent',
            bhk_type: payload.bhk_type,
            expected_price: payload.expected_price || 0,
            super_area: payload.super_area,
            carpet_area: payload.carpet_area,
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
            status: submissionData.status || 'pending',
            created_at: submissionData.created_at
          };
          
          console.log('Converted submission to property format:', propertyFromSubmission);
          console.log('Images array from submission:', payload.images);
          console.log('Images array length:', payload.images?.length);
          setProperty(propertyFromSubmission as Property);
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
        <section className="pt-24 sm:pt-6 pb-6 overflow-x-hidden min-w-0">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 overflow-x-hidden">
            {/* Property Gallery and Info Grid */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-8 mb-8 min-w-0">
              {/* Left - Image Gallery */}
              <div className="lg:col-span-2 min-w-0">
                <div className="mt-6 sm:mt-0 overflow-hidden">
                  <PropertyImageGallery property={mergedProperty as any} />
                </div>
                
                {/* Header Section - Mobile Only (Below Images) */}
                <div className="block sm:hidden mt-6 overflow-hidden">
                  <PropertyHeader property={mergedProperty as any} />
                </div>
              </div>
              
              {/* Right - Property Info Cards */}
              <div className="space-y-6 min-w-0">
                <PropertyInfoCards property={mergedProperty as any} />
                
                {/* Action Buttons */}
                <PropertyActions
                  onContact={() => setShowContactModal(true)}
                  onScheduleVisit={() => setShowScheduleVisitModal(true)}
                />
              </div>
            </div>

            {/* Additional Details Sections */}
            <div className="space-y-6 overflow-x-hidden">
              {/* Overview */}
              <OverviewCard property={mergedProperty as any} />
              
              {/* Services Card */}
              <ServicesCard />
              
              {/* Description Section */}
              <DescriptionCard property={mergedProperty as any} />
              
              {/* Amenities */}
              <AmenitiesCard amenities={mergedAmenities} />
              
              
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
          propertyArea={property.super_area ? `${property.super_area} sq.ft` : property.carpet_area ? `${property.carpet_area} sq.ft` : undefined}
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
    </div>;
};
export default PropertyDetails;