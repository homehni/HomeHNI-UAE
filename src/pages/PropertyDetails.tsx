import React from 'react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Home, MapPin, IndianRupee, Calendar, Mail, Phone, User, Images, Paintbrush, Calculator, FileText, ShieldCheck, Bus, Train, Car, TrendingUp } from 'lucide-react';
import { ContactOwnerModal } from '@/components/ContactOwnerModal';
import { PropertyImageGallery } from '@/components/PropertyImageGallery';
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
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const property = location.state as Property | undefined || null;
  const [showContactModal, setShowContactModal] = React.useState(false);
  
  React.useEffect(() => {
    document.title = property ? `${property.title} | Property Details` : 'Property Details';
  }, [property]);
  const [descExpanded, setDescExpanded] = React.useState(false);
  const fallbackDescription = `This beautifully maintained ${property?.bhk_type ?? ''} ${property?.property_type?.replace('_', ' ') ?? 'apartment'} offers a spacious layout with abundant natural light and excellent connectivity to local conveniences. Situated in a prime locality, it features well-ventilated rooms, ample storage and proximity to schools, hospitals and public transport. A perfect choice for families looking for comfort and convenience.`;
  const overview = [{
    label: 'Age of Building',
    value: '10+ years'
  }, {
    label: 'Ownership Type',
    value: 'Self Owned'
  }, {
    label: 'Maintenance',
    value: '₹ 2.8 / Sq.Ft/M'
  }, {
    label: 'Flooring',
    value: 'Vitrified Tiles'
  }, {
    label: 'Builtup Area',
    value: `${property?.super_area ?? property?.carpet_area ?? 960} Sq.Ft`
  }, {
    label: 'Furnishing',
    value: 'Semi'
  }, {
    label: 'Facing',
    value: 'West'
  }, {
    label: 'Floor',
    value: '0/3'
  }, {
    label: 'Parking',
    value: 'Bike and Car'
  }, {
    label: 'Gated Security',
    value: 'Yes'
  }];
  const amenities = ['Lift', 'Internet provider', 'Security', 'Park', 'Sewage treatment', 'Visitor parking'];
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
        <section className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-6">
            <nav className="text-sm text-gray-500 mb-3">
              Home / Properties / <span className="text-gray-700 font-medium">{property.title}</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-600 mx-[12px] my-0 py-[7px]">
              <span className="inline-flex items-center"><MapPin className="h-4 w-4 mr-1" />{property.locality}, {property.city}</span>
              <Badge variant={property.listing_type === 'sale' ? 'default' : 'secondary'}>For {property.listing_type}</Badge>
              <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>{property.status}</Badge>
            </div>
          </div>
        </section>

        <section className="container mx-auto py-8 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto border-2 border-brand-red shadow-lg">
            {/* Image Gallery */}
            {property.images && property.images.length > 0 && (
              <div className="mb-8">
                <PropertyImageGallery 
                  images={property.images} 
                  propertyTitle={property.title}
                />
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Left: Main Details */}
              <div className="xl:col-span-3 space-y-6">
                {/* Property Details Card */}
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Home className="h-6 w-6 mr-3 text-brand-red" />
                    Property Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-semibold capitalize">{property.property_type.replace('_', ' ')}</span>
                      </div>
                      {property.bhk_type && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted-foreground">BHK</span>
                          <span className="font-semibold">{property.bhk_type}</span>
                        </div>
                      )}
                      {property.super_area && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted-foreground">Super Area</span>
                          <span className="font-semibold">{property.super_area} sqft</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {property.carpet_area && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted-foreground">Carpet Area</span>
                          <span className="font-semibold">{property.carpet_area} sqft</span>
                        </div>
                      )}
                      {property.bathrooms !== undefined && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted-foreground">Bathrooms</span>
                          <span className="font-semibold">{property.bathrooms}</span>
                        </div>
                      )}
                      {property.balconies !== undefined && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted-foreground">Balconies</span>
                          <span className="font-semibold">{property.balconies}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <MapPin className="h-6 w-6 mr-3 text-brand-red" />
                    Location
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">City</span>
                        <span className="font-semibold">{property.city}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">Locality</span>
                        <span className="font-semibold">{property.locality}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">State</span>
                        <span className="font-semibold">{property.state}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">Pincode</span>
                        <span className="font-semibold">{property.pincode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overview Card */}
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6">Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {overview.map((o, idx) => (
                      <div key={idx} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="text-muted-foreground text-sm mb-1">{o.label}</div>
                        <div className="font-semibold">{o.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services Card */}
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6">Services</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center gap-3 bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <Paintbrush className="h-8 w-8 text-brand-red" />
                      <span className="text-sm font-medium">Painting</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <Calculator className="h-8 w-8 text-brand-red" />
                      <span className="text-sm font-medium">Estimate Cost</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <FileText className="h-8 w-8 text-brand-red" />
                      <span className="text-sm font-medium">Legal Services</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <ShieldCheck className="h-8 w-8 text-brand-red" />
                      <span className="text-sm font-medium">Create Agreement</span>
                    </div>
                  </div>
                </div>

                {/* Description Card */}
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {descExpanded ? property.description || fallbackDescription : (property.description || fallbackDescription).slice(0, 320)}
                    {(property.description || fallbackDescription).length > 320 && !descExpanded && '...'}
                  </p>
                  {(property.description || fallbackDescription).length > 320 && (
                    <Button variant="outline" size="sm" onClick={() => setDescExpanded(v => !v)}>
                      {descExpanded ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </div>

                {/* Amenities Card */}
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {amenities.map(a => (
                      <div key={a} className="bg-muted/30 rounded-lg p-3 text-center text-sm font-medium hover:bg-muted/50 transition-colors">
                        {a}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neighborhood Card */}
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6">Neighborhood</h2>
                  <div className="w-full h-80 rounded-xl overflow-hidden border mb-6">
                    <iframe 
                      title="map" 
                      width="100%" 
                      height="100%" 
                      loading="lazy" 
                      src={`https://www.google.com/maps?q=${encodeURIComponent(`${property.locality}, ${property.city}`)}&output=embed`} 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="font-bold text-lg">Transit</div>
                      <div className="space-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Bus className="h-4 w-4" />
                          <span>Bus Stations nearby</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Train className="h-4 w-4" />
                          <span>Metro Stations nearby</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          <span>Parking available</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="font-bold text-lg">Essentials</div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>Schools, Hospitals, ATMs</div>
                        <div>Parks and Markets</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="font-bold text-lg">Utilities</div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>24x7 Water supply</div>
                        <div>Power backup</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listed on */}
                <div className="pt-6 border-t border-border">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Listed on {new Date(property.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Right: Sticky Sidebar */}
              <aside className="xl:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Price Card */}
                  <div className="bg-card rounded-xl border shadow-lg p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-red mb-2">
                        ₹{property.expected_price.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {property.listing_type === 'sale' ? 'Total Price' : 'Monthly Rent'}
                      </div>
                    </div>
                  </div>

                  {/* Contact Card */}
                  <div className="bg-card rounded-xl border shadow-lg p-6 space-y-4">
                    <h3 className="text-xl font-bold flex items-center">
                      <User className="h-5 w-5 mr-2 text-brand-red" />
                      Contact Owner
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Interested in this property? Contact the owner through our secure platform.
                    </p>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => setShowContactModal(true)}
                    >
                      Get Owner Details
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-card rounded-xl border shadow-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Schedule Visit
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Calculator className="h-4 w-4 mr-2" />
                        EMI Calculator
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Legal Check
                      </Button>
                    </div>
                  </div>

                  {/* Back Button */}
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate(-1)}
                  >
                    ← Back to Search
                  </Button>
                </div>
              </aside>
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
      
      <Footer />
    </div>;
};
export default PropertyDetails;