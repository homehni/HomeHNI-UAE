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
import { ServicesStrip } from '@/components/property-details/ServicesStrip';

import { AmenitiesCard } from '@/components/property-details/AmenitiesCard';
import { NeighborhoodCard } from '@/components/property-details/NeighborhoodCard';
import { MobileStickyCTA } from '@/components/property-details/MobileStickyCTA';
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
  const property = location.state as Property | undefined || null;
  const [showContactModal, setShowContactModal] = React.useState(false);
  const [showScheduleVisitModal, setShowScheduleVisitModal] = React.useState(false);
  const [showEMICalculatorModal, setShowEMICalculatorModal] = React.useState(false);
  const [showLegalServicesModal, setShowLegalServicesModal] = React.useState(false);
  const [dbAmenities, setDbAmenities] = React.useState<any | null>(null);
  const [dbAdditionalDocs, setDbAdditionalDocs] = React.useState<Record<string, boolean> | null>(null);
  
  React.useEffect(() => {
    document.title = property ? `${property.title} | Property Details` : 'Property Details';
  }, [property]);
  
  // Fetch full amenities and PG/Hostel data from DB if they weren't passed via navigation state
  React.useEffect(() => {
    const loadPropertyData = async () => {
      if (!id) return;
      try {
        // Check if it's a PG/Hostel property first
        const isPGHostel = property?.property_type?.toLowerCase() === 'pg_hostel' || 
                          property?.property_type?.toLowerCase() === 'pg/hostel';
        
        if (isPGHostel) {
          // Fetch from pg_hostel_properties table
          const { data, error } = await supabase
            .from('pg_hostel_properties')
            .select('*')
            .eq('id', id)
            .maybeSingle();
          
          if (!error && data) {
            // Transform PG/Hostel data to match PropertyDetailsCard interface
            const transformedData = {
              ...property,
              expected_rent: data.expected_rent,
              expected_deposit: data.expected_deposit,
              place_available_for: data.place_available_for,
              preferred_guests: data.preferred_guests,
              available_from: data.available_from,
              food_included: data.food_included,
              gate_closing_time: data.gate_closing_time,
              description: data.description,
              amenities: data.amenities,
              available_services: data.available_services,
              parking: data.parking,
              landmark: data.landmark,
              state: data.state,
              city: data.city,
              locality: data.locality,
            };
            setDbAmenities(data.amenities ?? null);
            // Store the PG/Hostel specific data for PropertyDetailsCard
            (window as any).__pgHostelData = transformedData;
          }
        } else {
          // Regular property - fetch amenities and additional_documents
          const { data, error } = await supabase
            .from('properties')
            .select('amenities, additional_documents')
            .eq('id', id)
            .maybeSingle();
          if (!error && data) {
            setDbAmenities((data as any).amenities ?? null);
            setDbAdditionalDocs((data as any).additional_documents ?? null);
          }
        }
      } catch (err) {
        console.error('Failed to load property data', err);
      }
    };
    if (!(property as any)?.amenities || !(property as any)?.additional_documents || 
        (property?.property_type?.toLowerCase() === 'pg_hostel' || property?.property_type?.toLowerCase() === 'pg/hostel')) {
      loadPropertyData();
    }
  }, [id, property]);
  
  const fallbackDescription = `This beautifully maintained ${property?.bhk_type ?? ''} ${property?.property_type?.replace('_', ' ') ?? 'apartment'} offers a spacious layout with abundant natural light and excellent connectivity to local conveniences. Situated in a prime locality, it features well-ventilated rooms, ample storage and proximity to schools, hospitals and public transport. A perfect choice for families looking for comfort and convenience.`;
  const amenitiesData = (property as any)?.amenities ?? dbAmenities ?? undefined;
  
  // Check if it's a PG/Hostel property and use the correct data
  const isPGHostel = property?.property_type?.toLowerCase() === 'pg_hostel' || 
                    property?.property_type?.toLowerCase() === 'pg/hostel';
  
  const mergedProperty = property ? {
    ...(property as any),
    amenities: amenitiesData,
    additional_documents: (property as any)?.additional_documents ?? dbAdditionalDocs ?? undefined,
    // Include PG/Hostel specific data if available
    ...((window as any).__pgHostelData || {})
  } : property;
  
  if (!property) {
    return <div className="min-h-screen flex flex-col">
        <Marquee />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Property not found</h1>
          <p className="text-gray-600 mb-6">We couldn't load this property. Please go back and try again.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </main>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen flex flex-col bg-background">
      <Marquee />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-50 border-b py-6">
          <PropertyHero
            property={property}
            onContactOwner={() => setShowContactModal(true)}
            onScheduleVisit={() => setShowScheduleVisitModal(true)}
            onEMICalculator={() => setShowEMICalculatorModal(true)}
            onLegalCheck={() => setShowLegalServicesModal(true)}
          />
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 space-y-6">
            {/* Services Strip */}
            <ServicesStrip onLegalServices={() => setShowLegalServicesModal(true)} />
            
            {/* Property Details */}
            <PropertyDetailsCard property={mergedProperty as any} />
            
            {/* Location */}
            <LocationCard property={property} />
            
            {/* Overview */}
            <OverviewCard property={property} />
            
            
            {/* Amenities */}
            <AmenitiesCard amenities={amenitiesData} />
            
            {/* Neighborhood */}
            <NeighborhoodCard property={property} />

          </div>
        </section>

        {/* Mobile Sticky CTA */}
        <MobileStickyCTA onContactOwner={() => setShowContactModal(true)} />
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
          expectedPrice={property.expected_price}
        />
      )}
      
      {/* EMI Calculator Modal */}
      {property && (
        <EMICalculatorModal
          isOpen={showEMICalculatorModal}
          onClose={() => setShowEMICalculatorModal(false)}
          propertyPrice={property.expected_price}
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