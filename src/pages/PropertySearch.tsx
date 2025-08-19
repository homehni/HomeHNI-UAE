import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PropertyCard from '@/components/PropertyCard';
import { MapPin, Filter, Grid3X3, List, Map, SortAsc, SortDesc, Bookmark, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyTools from '@/components/PropertyTools';

interface SearchFilters {
  propertyType: string[];
  bhkType: string[];
  budget: [number, number];
  locality: string[];
  furnished: string[];
  availability: string[];
  construction: string[];
}

const PropertySearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get initial values from URL params
  const initialLocation = searchParams.get('location') || '';
  const initialType = searchParams.get('type') || 'buy';
  const initialPropertyType = searchParams.get('propertyType') || 'All Residential';
  
  const [activeTab, setActiveTab] = useState(initialType);
  const [location, setLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    propertyType: initialPropertyType === 'All Residential' ? [] : [initialPropertyType],
    bhkType: [],
    budget: [0, 10000000],
    locality: [],
    furnished: [],
    availability: [],
    construction: []
  });
  
  // Mock property data - In real app, this would come from API
  const mockProperties = [
    {
      id: '1',
      title: '3 BHK Apartment in Sector 150, Noida',
      location: 'Sector 150, Noida',
      price: '₹85 Lakh',
      area: '1200 sq ft',
      bedrooms: 3,
      bathrooms: 2,
      image: 'photo-1512917774080-9991f1c4c750',
      propertyType: 'Flat/Apartment'
    },
    {
      id: '2', 
      title: '2 BHK Independent House in Gurgaon',
      location: 'Sector 45, Gurgaon',
      price: '₹1.2 Crore',
      area: '1000 sq ft',
      bedrooms: 2,
      bathrooms: 2,
      image: 'photo-1568605114967-8130f3a36994',
      propertyType: 'Independent House'
    },
    {
      id: '3',
      title: '4 BHK Villa in Whitefield, Bangalore',
      location: 'Whitefield, Bangalore',
      price: '₹2.5 Crore',
      area: '2500 sq ft',
      bedrooms: 4,
      bathrooms: 3,
      image: 'photo-1522708323590-d24dbb6b0267',
      propertyType: 'Villa'
    },
    {
      id: '4',
      title: '1 BHK Flat in Andheri, Mumbai',
      location: 'Andheri West, Mumbai',
      price: '₹75 Lakh',
      area: '650 sq ft',
      bedrooms: 1,
      bathrooms: 1,
      image: 'photo-1613490493576-7fde63acd811',
      propertyType: 'Flat/Apartment'
    },
    {
      id: '5',
      title: '3 BHK Independent Floor in Sector 62, Noida',
      location: 'Sector 62, Noida',
      price: '₹95 Lakh',
      area: '1400 sq ft',
      bedrooms: 3,
      bathrooms: 2,
      image: 'photo-1512917774080-9991f1c4c750',
      propertyType: 'Independent Building/Floor'
    },
    {
      id: '6',
      title: '2 BHK Apartment in Koramangala, Bangalore',
      location: 'Koramangala, Bangalore',
      price: '₹1.1 Crore',
      area: '1100 sq ft',
      bedrooms: 2,
      bathrooms: 2,
      image: 'photo-1568605114967-8130f3a36994',
      propertyType: 'Flat/Apartment'
    }
  ];

  const propertyTypes = [
    'All Residential',
    'Flat/Apartment', 
    'Independent Building/Floor',
    'Independent House',
    'Villa',
    'Plots',
    'Farm House'
  ];

  const bhkTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
  const furnishedOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const availabilityOptions = ['Ready to Move', 'Under Construction'];
  const constructionOptions = ['New Project', '1-5 Years Old', '5-10 Years Old', '10+ Years Old'];

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      propertyType: [],
      bhkType: [],
      budget: [0, 10000000],
      locality: [],
      furnished: [],
      availability: [],
      construction: []
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="grid w-full lg:w-auto grid-cols-4 lg:grid-cols-7 bg-gray-100">
                <TabsTrigger value="buy" className="text-xs lg:text-sm">Buy</TabsTrigger>
                <TabsTrigger value="rent" className="text-xs lg:text-sm">Rent</TabsTrigger>
                <TabsTrigger value="new-launch" className="text-xs lg:text-sm">New Launch</TabsTrigger>
                <TabsTrigger value="commercial" className="text-xs lg:text-sm">Commercial</TabsTrigger>
                <TabsTrigger value="plots" className="hidden lg:block text-xs lg:text-sm">Plots/Land</TabsTrigger>
                <TabsTrigger value="pg" className="hidden lg:block text-xs lg:text-sm">PG</TabsTrigger>
                <TabsTrigger value="projects" className="hidden lg:block text-xs lg:text-sm">Projects</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Location Search */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 text-brand-red" size={20} />
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Search location..." 
                  className="pl-10 h-12 border-brand-red"
                />
              </div>
              <Button className="h-12 px-6 bg-brand-red hover:bg-brand-red-dark">
                Search
              </Button>
            </div>

            {/* View Controls */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
              <Button
                variant={showMap ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowMap(!showMap)}
              >
                <Map size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-80 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Budget Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Budget</h4>
                  <div className="space-y-3">
                    <Slider
                      value={filters.budget}
                      onValueChange={(value) => handleFilterChange('budget', value)}
                      max={20000000}
                      min={0}
                      step={100000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{(filters.budget[0] / 100000).toFixed(1)}L</span>
                      <span>₹{(filters.budget[1] / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Property Type Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Property Type</h4>
                  <div className="space-y-2">
                    {propertyTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={filters.propertyType.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('propertyType', [...filters.propertyType, type]);
                            } else {
                              handleFilterChange('propertyType', filters.propertyType.filter(t => t !== type));
                            }
                          }}
                        />
                        <label htmlFor={type} className="text-sm text-gray-700 cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* BHK Filter */}
                <div>
                  <h4 className="font-semibold mb-3">BHK Type</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {bhkTypes.map((bhk) => (
                      <Button
                        key={bhk}
                        variant={filters.bhkType.includes(bhk) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          if (filters.bhkType.includes(bhk)) {
                            handleFilterChange('bhkType', filters.bhkType.filter(b => b !== bhk));
                          } else {
                            handleFilterChange('bhkType', [...filters.bhkType, bhk]);
                          }
                        }}
                        className="text-xs"
                      >
                        {bhk}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Furnished Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Furnished Status</h4>
                  <div className="space-y-2">
                    {furnishedOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={filters.furnished.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('furnished', [...filters.furnished, option]);
                            } else {
                              handleFilterChange('furnished', filters.furnished.filter(f => f !== option));
                            }
                          }}
                        />
                        <label htmlFor={option} className="text-sm text-gray-700 cursor-pointer">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Construction Status */}
                <div>
                  <h4 className="font-semibold mb-3">Construction Status</h4>
                  <div className="space-y-2">
                    {availabilityOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={filters.availability.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('availability', [...filters.availability, option]);
                            } else {
                              handleFilterChange('availability', filters.availability.filter(a => a !== option));
                            }
                          }}
                        />
                        <label htmlFor={option} className="text-sm text-gray-700 cursor-pointer">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Properties {activeTab === 'buy' ? 'for Sale' : 'for Rent'} in {location || 'All Locations'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {mockProperties.length} results found
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="area">Area</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="ghost" size="sm">
                  <Bookmark size={16} className="mr-1" />
                  Save Search
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.propertyType.length > 0 || filters.bhkType.length > 0 || filters.furnished.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.propertyType.map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type}
                    <button 
                      onClick={() => handleFilterChange('propertyType', filters.propertyType.filter(t => t !== type))}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {filters.bhkType.map((bhk) => (
                  <Badge key={bhk} variant="secondary" className="flex items-center gap-1">
                    {bhk}
                    <button 
                      onClick={() => handleFilterChange('bhkType', filters.bhkType.filter(b => b !== bhk))}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Properties Grid/List */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {mockProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  area={property.area}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  image={property.image}
                  propertyType={property.propertyType}
                  size={viewMode === 'list' ? 'large' : 'default'}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Tools Section */}
      <PropertyTools />

      <Footer />
    </div>
  );
};

export default PropertySearch;