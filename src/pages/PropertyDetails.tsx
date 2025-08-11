import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Home, MapPin, IndianRupee, Building, Calendar, Mail, Phone, User } from 'lucide-react';

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
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_role?: string;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const property = (location.state as Property | undefined) || null;

  React.useEffect(() => {
    document.title = property ? `${property.title} | Property Details` : 'Property Details';
  }, [property]);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Property not found</h1>
          <p className="text-gray-600 mb-6">We couldn't load this property. Please go back and try again.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-6">
            <nav className="text-sm text-gray-500 mb-3">
              Home / Properties / <span className="text-gray-700 font-medium">{property.title}</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-600">
              <span className="inline-flex items-center"><MapPin className="h-4 w-4 mr-1" />{property.locality}, {property.city}</span>
              <Badge variant={property.listing_type === 'sale' ? 'default' : 'secondary'}>For {property.listing_type}</Badge>
              <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>{property.status}</Badge>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          {/* Gallery */}
          {property.images && property.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {property.images.slice(0, 6).map((image, i) => (
                <div key={i} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img src={image} alt={`Property image ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Details */}
              <article className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center"><Home className="h-5 w-5 mr-2 text-brand-red" />Property Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Type</span><span className="font-medium capitalize">{property.property_type.replace('_',' ')}</span></div>
                  {property.bhk_type && (
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-600">BHK</span><span className="font-medium">{property.bhk_type}</span></div>
                  )}
                  {property.super_area && (
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Super Area</span><span className="font-medium">{property.super_area} sqft</span></div>
                  )}
                  {property.carpet_area && (
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Carpet Area</span><span className="font-medium">{property.carpet_area} sqft</span></div>
                  )}
                  {property.bathrooms !== undefined && (
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Bathrooms</span><span className="font-medium">{property.bathrooms}</span></div>
                  )}
                  {property.balconies !== undefined && (
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-600">Balconies</span><span className="font-medium">{property.balconies}</span></div>
                  )}
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

              {/* Description */}
              {property.description && (
                <article className="space-y-3">
                  <h2 className="text-xl font-semibold">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </article>
              )}

              {/* Listed on */}
              <div className="pt-4 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" /> Listed on {new Date(property.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Right: price and owner */}
            <aside className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center"><IndianRupee className="h-5 w-5 mr-2 text-brand-red" /> Price</h3>
                <div className="text-2xl font-bold text-brand-red">₹{property.expected_price.toLocaleString()}</div>
              </div>

              {(property.owner_name || property.owner_email || property.owner_phone) && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="text-lg font-semibold flex items-center"><User className="h-5 w-5 mr-2 text-brand-red" /> Owner</h3>
                  {property.owner_name && <div className="flex items-center"><span className="font-medium">{property.owner_name}</span></div>}
                  {property.owner_email && <div className="flex items-center text-gray-700"><Mail className="h-4 w-4 mr-2" />{property.owner_email}</div>}
                  {property.owner_phone && <div className="flex items-center text-gray-700"><Phone className="h-4 w-4 mr-2" />{property.owner_phone}</div>}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>Back</Button>
                <Button className="flex-1">Contact Owner</Button>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetails;
