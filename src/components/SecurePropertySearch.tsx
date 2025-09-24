import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyWatermark } from '@/components/property-details/PropertyWatermark';
import { SecurePropertyService, PublicProperty } from '@/services/securePropertyService';
import { RentalStatusService } from '@/services/rentalStatusService';
import { SecureContactForm } from './SecureContactForm';
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  Home, 
  Bath, 
  Maximize, 
  Shield,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Secure property search component that uses the protected public_properties view
 * No owner contact information is exposed in search results
 */
export const SecurePropertySearch: React.FC = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bhkType: ''
  });
  const [selectedProperty, setSelectedProperty] = useState<PublicProperty | null>(null);
  const [showContactForm, setShowContactForm] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await SecurePropertyService.getPublicProperties();
      
      if (error) {
        throw new Error(error.message);
      }
      
      const loadedProperties = data || [];
      console.log('SecurePropertySearch: Loaded properties:', loadedProperties.length);
      
      // Fetch rental statuses for all properties
      if (loadedProperties.length > 0) {
        console.log('SecurePropertySearch: Fetching rental statuses...');
        const propertyIds = loadedProperties.map(p => p.id);
        const rentalStatuses = await RentalStatusService.getMultiplePropertiesRentalStatus(propertyIds);
        console.log('SecurePropertySearch: Got rental statuses:', rentalStatuses);
        
        // Add rental statuses to properties
        const propertiesWithRentalStatus = loadedProperties.map(property => ({
          ...property,
          rental_status: rentalStatuses[property.id] || 'available'
        }));
        
        setProperties(propertiesWithRentalStatus);
      } else {
        setProperties(loadedProperties);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast({
        title: 'Error Loading Properties',
        description: 'Failed to load property listings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters = {
        city: searchFilters.city || undefined,
        propertyType: searchFilters.propertyType || undefined,
        listingType: searchFilters.listingType || undefined,
        minPrice: searchFilters.minPrice ? parseInt(searchFilters.minPrice) : undefined,
        maxPrice: searchFilters.maxPrice ? parseInt(searchFilters.maxPrice) : undefined,
        bhkType: searchFilters.bhkType || undefined
      };

      const { data, error } = await SecurePropertyService.searchPublicProperties(filters);
      
      if (error) {
        throw new Error(error.message);
      }
      
      const searchResults = data || [];
      console.log('SecurePropertySearch: Search results:', searchResults.length);
      
      // Fetch rental statuses for search results
      if (searchResults.length > 0) {
        console.log('SecurePropertySearch: Fetching rental statuses for search results...');
        const propertyIds = searchResults.map(p => p.id);
        const rentalStatuses = await RentalStatusService.getMultiplePropertiesRentalStatus(propertyIds);
        console.log('SecurePropertySearch: Got search rental statuses:', rentalStatuses);
        
        // Add rental statuses to search results
        const resultsWithRentalStatus = searchResults.map(property => ({
          ...property,
          rental_status: rentalStatuses[property.id] || 'available'
        }));
        
        setProperties(resultsWithRentalStatus);
      } else {
        setProperties(searchResults);
      }
      
      if (searchResults.length === 0) {
        toast({
          title: 'No Properties Found',
          description: 'Try adjusting your search filters to find more properties.'
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search properties. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactOwner = (propertyId: string) => {
    setShowContactForm(propertyId);
  };

  const resetFilters = () => {
    setSearchFilters({
      city: '',
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bhkType: ''
    });
    loadProperties();
  };

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Input
                placeholder="Enter city name"
                value={searchFilters.city}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <Select
                value={searchFilters.propertyType}
                onValueChange={(value) => setSearchFilters(prev => ({ ...prev, propertyType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Listing Type</label>
              <Select
                value={searchFilters.listingType}
                onValueChange={(value) => setSearchFilters(prev => ({ ...prev, listingType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="For Sale/Rent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="Sale">For Sale</SelectItem>
                  <SelectItem value="Rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Min Price (₹)</label>
              <Input
                type="number"
                placeholder="Minimum price"
                value={searchFilters.minPrice}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Max Price (₹)</label>
              <Input
                type="number"
                placeholder="Maximum price"
                value={searchFilters.maxPrice}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">BHK Type</label>
              <Select
                value={searchFilters.bhkType}
                onValueChange={(value) => setSearchFilters(prev => ({ ...prev, bhkType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select BHK" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="1 BHK">1 BHK</SelectItem>
                  <SelectItem value="2 BHK">2 BHK</SelectItem>
                  <SelectItem value="3 BHK">3 BHK</SelectItem>
                  <SelectItem value="4+ BHK">4+ BHK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={handleSearch} disabled={loading} className="flex-1 md:flex-none">
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search Properties'}
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50 border-2 border-primary">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Privacy Protected</h4>
              <p className="text-sm text-green-700">
                Owner contact information is protected. Use the secure contact form to inquire about properties.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading secure properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <Card className="border-2 border-primary">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Properties Found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria to find more properties.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden border-2 border-primary">
              <PropertyWatermark status={property.rental_status || 'available'}>
                <div className="aspect-video bg-muted">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </PropertyWatermark>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg truncate">{property.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{property.locality}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{property.bhk_type}</Badge>
                      <Badge variant={property.listing_type === 'Sale' ? 'default' : 'outline'}>
                        For {property.listing_type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" />
                      <span>{property.super_area} sqft</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-lg font-bold text-primary">
                      <IndianRupee className="h-5 w-5" />
                      <span>{property.expected_price.toLocaleString()}</span>
                    </div>
                  </div>

                  {property.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {property.description}
                    </p>
                  )}

                  <Button 
                    onClick={() => handleContactOwner(property.id)}
                    className="w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Contact Owner Securely
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Form Modal/Panel */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <SecureContactForm
              propertyId={showContactForm}
              propertyTitle={properties.find(p => p.id === showContactForm)?.title || 'Property'}
              listingType={properties.find(p => p.id === showContactForm)?.listing_type}
              onSuccess={() => {
                setShowContactForm(null);
                toast({
                  title: 'Inquiry Sent',
                  description: 'Your inquiry has been sent securely to the property owner.'
                });
              }}
            />
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowContactForm(null)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};