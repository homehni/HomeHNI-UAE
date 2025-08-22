import React from 'react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Home, MapPin, IndianRupee, Calendar, Mail, Phone, User, Images, Paintbrush, Calculator, FileText, ShieldCheck, Bus, Train, Car, TrendingUp, Building2 } from 'lucide-react';
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

        {/* Similar Properties Section */}
        <section className="bg-gray-50 py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Similar Properties in {property.city}</h2>
              <Button variant="outline" size="sm" className="text-primary">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="aspect-video bg-gray-200 rounded mb-2"></div>
                  <h3 className="font-medium text-sm mb-1">2 BHK in {property.locality}</h3>
                  <p className="text-xs text-gray-600">₹{(property.expected_price * 0.9).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{property.super_area || 1200} sqft</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Property Details */}
        <section className="bg-black text-white">
          <div className="container mx-auto px-4 py-8">
            {/* Property Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
                <p className="text-gray-300">{property.locality}, {property.city}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">₹{property.expected_price.toLocaleString()}</div>
                <div className="text-sm text-gray-300">
                  {property.listing_type === 'rent' ? 'Rent' : 'Price'}
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Image Gallery */}
              <div className="lg:col-span-2">
                {property.images && property.images.length > 0 && (
                  <PropertyImageGallery 
                    images={property.images} 
                    propertyTitle={property.title}
                  />
                )}
              </div>

              {/* Right: Property Details Sidebar */}
              <div className="bg-white text-black rounded-lg p-6">
                {/* Key Specs */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">₹{property.expected_price.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Rent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">₹{Math.round(property.expected_price * 0.1).toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Deposit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{property.super_area || property.carpet_area || 1200}</div>
                    <div className="text-xs text-gray-600">Sq.Ft</div>
                  </div>
                </div>

                {/* Property Features with Icons */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{property.bhk_type || '2 BHK'}</span>
                    <span className="ml-auto text-gray-600 capitalize">{property.property_type?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Preferred Tenant</span>
                    <span className="ml-auto text-gray-600">Family</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Availability</span>
                    <span className="ml-auto text-gray-600">Immediately</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Parking</span>
                    <span className="ml-auto text-gray-600">Bike and Car</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Building Age</span>
                    <span className="ml-auto text-gray-600">5-10 Years</span>
                  </div>
                </div>

                {/* Contact Button */}
                <Button 
                  className="w-full mb-4 bg-primary hover:bg-primary/90" 
                  size="lg"
                  onClick={() => setShowContactModal(true)}
                >
                  Get Owner Details
                </Button>

                {/* Additional Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Share
                  </Button>
                </div>

                {/* Report Issues */}
                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-xs text-gray-500 mb-2">Report what was not correct in this property</p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="ghost" size="sm" className="text-xs">Listed by Broker</Button>
                    <Button variant="ghost" size="sm" className="text-xs">Rented Out</Button>
                    <Button variant="ghost" size="sm" className="text-xs">Wrong Info</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Details Sections */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Detailed Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Details */}
              <article className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center"><Home className="h-5 w-5 mr-2 text-brand-red" />Property Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Type</span><span className="font-medium capitalize">{property.property_type.replace('_', ' ')}</span></div>
                  {property.bhk_type && <div className="flex justify-between border-b pb-2"><span className="text-gray-600">BHK</span><span className="font-medium">{property.bhk_type}</span></div>}
                  {property.super_area && <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Super Area</span><span className="font-medium">{property.super_area} sqft</span></div>}
                  {property.carpet_area && <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Carpet Area</span><span className="font-medium">{property.carpet_area} sqft</span></div>}
                  {property.bathrooms !== undefined && <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Bathrooms</span><span className="font-medium">{property.bathrooms}</span></div>}
                  {property.balconies !== undefined && <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Balconies</span><span className="font-medium">{property.balconies}</span></div>}
                </div>
              </article>

              {/* Location */}
              <article className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center"><MapPin className="h-5 w-5 mr-2 text-brand-red" />Location</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between border-b pb-2"><span className="text-gray-600">City</span><span className="font-medium">{property.city}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Locality</span><span className="font-medium">{property.locality}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-gray-600">State</span><span className="font-medium">{property.state}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Pincode</span><span className="font-medium">{property.pincode}</span></div>
                </div>
              </article>

              {/* Overview */}
              <article className="space-y-4">
                <h2 className="text-xl font-semibold">Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {overview.map((o, idx) => <div key={idx} className="rounded-lg border p-3">
                      <div className="text-gray-600 text-sm">{o.label}</div>
                      <div className="font-medium">{o.value}</div>
                    </div>)}
                </div>
              </article>

              {/* Services */}
              <article className="space-y-4">
                <h2 className="text-xl font-semibold">Services</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-2 rounded-lg border p-4"><Paintbrush className="h-5 w-5 text-brand-red" /><span>Painting</span></div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border p-4"><Calculator className="h-5 w-5 text-brand-red" /><span>Estimate Cost</span></div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border p-4"><FileText className="h-5 w-5 text-brand-red" /><span>Legal Services</span></div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border p-4"><ShieldCheck className="h-5 w-5 text-brand-red" /><span>Create Agreement</span></div>
                </div>
              </article>

              {/* Description */}
              <article className="space-y-3">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {descExpanded ? property.description || fallbackDescription : (property.description || fallbackDescription).slice(0, 320)}
                  {(property.description || fallbackDescription).length > 320 && !descExpanded && '...'}
                </p>
                {(property.description || fallbackDescription).length > 320 && <Button variant="outline" size="sm" onClick={() => setDescExpanded(v => !v)}>
                    {descExpanded ? 'Show Less' : 'Show More'}
                  </Button>}
              </article>

              {/* Amenities */}
              <article className="space-y-4">
                <h2 className="text-xl font-semibold">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {amenities.map(a => <div key={a} className="rounded-lg border p-3 text-center text-sm">{a}</div>)}
                </div>
              </article>

              {/* Neighborhood */}
              <article className="space-y-4">
                <h2 className="text-xl font-semibold">Neighborhood</h2>
                <div className="w-full h-72 rounded-lg overflow-hidden border">
                  <iframe title="map" width="100%" height="100%" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(`${property.locality}, ${property.city}`)}&output=embed`} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div className="space-y-2">
                    <div className="font-medium">Transit</div>
                    <div className="flex items-center"><Bus className="h-4 w-4 mr-2" /> Bus Stations nearby</div>
                    <div className="flex items-center"><Train className="h-4 w-4 mr-2" /> Metro Stations nearby</div>
                    <div className="flex items-center"><Car className="h-4 w-4 mr-2" /> Parking available</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Essentials</div>
                    <div>Schools, Hospitals, ATMs</div>
                    <div>Parks and Markets</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Utilities</div>
                    <div>24x7 Water supply</div>
                    <div>Power backup</div>
                  </div>
                </div>
              </article>

              {/* Listed on */}
              <div className="pt-4 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" /> Listed on {new Date(property.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Right: Additional Info */}
            <aside className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Property Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium capitalize">{property.property_type?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Furnishing</span>
                    <span className="font-medium">Semi Furnished</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flooring</span>
                    <span className="font-medium">Vitrified Tiles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Water Supply</span>
                    <span className="font-medium">24x7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gym</span>
                    <span className="font-medium">Available</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Locality Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">2 Bus stops nearby</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Train className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Metro station 1.5 km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">3 Schools nearby</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                  Back to Search
                </Button>
              </div>
            </aside>
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