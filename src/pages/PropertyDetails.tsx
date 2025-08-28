import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { ContactOwnerModal } from '@/components/ContactOwnerModal';
import { ScheduleVisitModal } from '@/components/ScheduleVisitModal';
import EMICalculatorModal from '@/components/EMICalculatorModal';
import LegalServicesForm from '@/components/LegalServicesForm';
import { PropertyHero } from '@/components/property-details/PropertyHero';
import { PropertyDetailsCard } from '@/components/property-details/PropertyDetailsCard';
import { LocationCard } from '@/components/property-details/LocationCard';
import { OverviewCard } from '@/components/property-details/OverviewCard';
import { ServicesStrip } from '@/components/property-details/ServicesStrip';
import { DescriptionCard } from '@/components/property-details/DescriptionCard';
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
  // Note: Owner contact info removed for security
}
const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState<Property | null>(location.state as Property | null);
  const [loading, setLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showScheduleVisitModal, setShowScheduleVisitModal] = useState(false);
  const [showEMICalculatorModal, setShowEMICalculatorModal] = useState(false);
  const [showLegalServicesModal, setShowLegalServicesModal] = useState(false);
  
  // Fetch property data from database if not available in state
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      // If we don't have property data or if we need to refresh it
      if (!property || !property.images || property.images.length === 0) {
        setLoading(true);
        try {
          // First try to fetch from the main properties table
          const { data: propertyData, error: propertyError } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .eq('status', 'approved')
            .single();
            
          if (propertyError) {
            console.error('Error fetching property:', propertyError);
            // Try fetching from public_properties view as fallback
            const { data: publicPropertyData, error: publicError } = await supabase
              .from('public_properties')
              .select('*')
              .eq('id', id)
              .single();
              
            if (publicError) {
              console.error('Error fetching public property:', publicError);
              return;
            }
            
            setProperty(publicPropertyData as Property);
          } else {
            setProperty(propertyData as Property);
          }
        } catch (error) {
          console.error('Error fetching property:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProperty();
  }, [id, property]);
  
  useEffect(() => {
    document.title = property ? `${property.title} | Property Details` : 'Property Details';
  }, [property]);
  const fallbackDescription = `This beautifully maintained ${property?.bhk_type ?? ''} ${property?.property_type?.replace('_', ' ') ?? 'apartment'} offers a spacious layout with abundant natural light and excellent connectivity to local conveniences. Situated in a prime locality, it features well-ventilated rooms, ample storage and proximity to schools, hospitals and public transport. A perfect choice for families looking for comfort and convenience.`;
  const amenities = ['Lift', 'Internet provider', 'Security', 'Park', 'Sewage treatment', 'Visitor parking'];
  if (loading) {
    return <div className="min-h-screen flex flex-col">
        <Marquee />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold mb-4">Loading Property...</h1>
          <p className="text-gray-600">Please wait while we fetch the property details.</p>
        </main>
        <Footer />
      </div>;
  }
  
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
            <PropertyDetailsCard property={property} />
            
            {/* Location */}
            <LocationCard property={property} />
            
            {/* Overview */}
            <OverviewCard property={property} />
            
            {/* Description */}
            <DescriptionCard 
              description={property.description}
              fallbackDescription={fallbackDescription}
            />
            
            {/* Amenities */}
            <AmenitiesCard amenities={amenities} />
            
            {/* Neighborhood */}
            <NeighborhoodCard property={property} />

            {/* Listed on */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                Listed on {new Date(property.created_at).toLocaleDateString()}
              </div>
            </div>
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