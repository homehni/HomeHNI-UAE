import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { MapPin, Filter, Grid3X3, List, Map, Bookmark, Share2, Mic, X } from 'lucide-react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import PropertyTools from '@/components/PropertyTools';
import { useRealTimeSearch } from '@/hooks/useRealTimeSearch';

const PropertySearch = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(false);
  
  const {
    filters,
    activeTab,
    setActiveTab,
    filteredProperties,
    updateFilter,
    clearAllFilters,
    availableLocalities,
    isLoading
  } = useRealTimeSearch();

  const propertyTypes = [
    'ALL',
    'PLOT',
    'VILLA', 
    'APARTMENT',
    'COMMERCIAL',
    'HOUSE',
    'PENTHOUSE',
    'INDEPENDENT HOUSE',
    'AGRICULTURE LANDS',
    'FARM HOUSE'
  ];

  const bhkTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
  const furnishedOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const availabilityOptions = ['Ready to Move', 'Under Construction'];
  const constructionOptions = ['New Project', '1-5 Years Old', '5-10 Years Old', '10+ Years Old'];


  return (
    <div className="min-h-screen bg-background">
      {/* Marquee at the very top */}
      <Marquee />
      <Header />
      
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center pt-4">
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

            {/* Location Search with real-time functionality */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 text-brand-red" size={20} />
                <Input 
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  placeholder="Search 'Noida, Gurgaon, Mumbai'..." 
                  className="pl-10 pr-20 h-12 border-brand-red"
                />
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  {filters.location && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilter('location', '')}
                      className="h-6 w-6 p-0 hover:bg-brand-red/10"
                    >
                      <X size={14} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-brand-red/10">
                    <Mic size={14} className="text-brand-red" />
                  </Button>
                </div>
              </div>
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
                    <div className="relative">
                      <Slider
                        value={filters.budget}
                        onValueChange={(value) => updateFilter('budget', value)}
                        max={100000000}
                        min={0}
                        step={500000}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm font-medium text-foreground">
                      <span>₹{filters.budget[0] === 0 ? '0' : filters.budget[0] >= 10000000 ? (filters.budget[0] / 10000000).toFixed(filters.budget[0] % 10000000 === 0 ? 0 : 1) + ' Cr' : (filters.budget[0] / 100000).toFixed(filters.budget[0] % 100000 === 0 ? 0 : 1) + ' L'}</span>
                      <span>₹{filters.budget[1] >= 100000000 ? '10Cr +' : filters.budget[1] >= 10000000 ? (filters.budget[1] / 10000000).toFixed(filters.budget[1] % 10000000 === 0 ? 0 : 1) + ' Cr' : (filters.budget[1] / 100000).toFixed(filters.budget[1] % 100000 === 0 ? 0 : 1) + ' L'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <Button
                        variant={filters.budget[0] === 0 && filters.budget[1] === 5000000 ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter('budget', [0, 5000000])}
                        className="text-xs h-8"
                      >
                        Under 50L
                      </Button>
                      <Button
                        variant={filters.budget[0] === 5000000 && filters.budget[1] === 10000000 ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter('budget', [5000000, 10000000])}
                        className="text-xs h-8"
                      >
                        50L-1Cr
                      </Button>
                      <Button
                        variant={filters.budget[0] === 10000000 && filters.budget[1] === 20000000 ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter('budget', [10000000, 20000000])}
                        className="text-xs h-8"
                      >
                        1-2Cr
                      </Button>
                      <Button
                        variant={filters.budget[0] === 20000000 && filters.budget[1] === 50000000 ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter('budget', [20000000, 50000000])}
                        className="text-xs h-8"
                      >
                        2-5Cr
                      </Button>
                      <Button
                        variant={filters.budget[0] === 50000000 && filters.budget[1] === 100000000 ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter('budget', [50000000, 100000000])}
                        className="text-xs h-8"
                      >
                        5Cr+
                      </Button>
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
                              updateFilter('propertyType', [...filters.propertyType, type]);
                            } else {
                              updateFilter('propertyType', filters.propertyType.filter(t => t !== type));
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
                            updateFilter('bhkType', filters.bhkType.filter(b => b !== bhk));
                          } else {
                            updateFilter('bhkType', [...filters.bhkType, bhk]);
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
                              updateFilter('furnished', [...filters.furnished, option]);
                            } else {
                              updateFilter('furnished', filters.furnished.filter(f => f !== option));
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
                              updateFilter('availability', [...filters.availability, option]);
                            } else {
                              updateFilter('availability', filters.availability.filter(a => a !== option));
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

                {/* Locality Filter - Dynamic based on available properties */}
                <div>
                  <h4 className="font-semibold mb-3">Locality</h4>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {availableLocalities.slice(0, 8).map((locality) => (
                      <div key={locality} className="flex items-center space-x-2">
                        <Checkbox
                          id={locality}
                          checked={filters.locality.includes(locality)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilter('locality', [...filters.locality, locality]);
                            } else {
                              updateFilter('locality', filters.locality.filter(l => l !== locality));
                            }
                          }}
                        />
                        <label htmlFor={locality} className="text-sm text-gray-700 cursor-pointer">
                          {locality}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Age of Property Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Age of Property</h4>
                  <div className="space-y-2">
                    {constructionOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={filters.construction.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilter('construction', [...filters.construction, option]);
                            } else {
                              updateFilter('construction', filters.construction.filter(c => c !== option));
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
                  {(() => {
                    // Get property type context
                    const hasPropertyTypeFilter = filters.propertyType.length > 0 && !filters.propertyType.includes('ALL');
                    const propertyTypeText = hasPropertyTypeFilter ? 
                      filters.propertyType.length === 1 ? 
                        filters.propertyType[0].toLowerCase().replace('plot', 'plots').replace('apartment', 'apartments').replace('villa', 'villas').replace('commercial', 'commercial properties').replace('house', 'houses').replace('penthouse', 'penthouses').replace('independent house', 'independent houses').replace('agriculture lands', 'agriculture lands').replace('farm house', 'farm houses') 
                        : 'properties'
                      : 'properties';
                    
                    // Get location context
                    const locationText = filters.location ? ` in ${filters.location}` : '';
                    
                    switch (activeTab) {
                      case 'buy':
                        return hasPropertyTypeFilter ? 
                          `${propertyTypeText.charAt(0).toUpperCase() + propertyTypeText.slice(1)} for Sale${locationText}` :
                          `Properties for Sale${locationText || ' in All Locations'}`;
                      case 'rent':
                        return hasPropertyTypeFilter ? 
                          `${propertyTypeText.charAt(0).toUpperCase() + propertyTypeText.slice(1)} for Rent${locationText}` :
                          `Properties for Rent${locationText || ' in All Locations'}`;
                      case 'new-launch':
                        return hasPropertyTypeFilter ? 
                          `Newly launched ${propertyTypeText}${locationText}` :
                          `Newly Launched Properties${locationText || ' in All Locations'}`;
                      case 'commercial':
                        return hasPropertyTypeFilter ? 
                          `${propertyTypeText.charAt(0).toUpperCase() + propertyTypeText.slice(1)}${locationText}` :
                          `Commercial Spaces${locationText || ' in All Locations'}`;
                      case 'plots':
                        return `Plots/Land for Sale${locationText || ' in All Locations'}`;
                      case 'pg':
                        return `PG's${locationText || ' in All Locations'}`;
                      case 'projects':
                        return `Other Projects${locationText || ' in All Locations'}`;
                      default:
                        return `Properties for Sale${locationText || ' in All Locations'}`;
                    }
                  })()}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isLoading ? 'Searching...' : `${filteredProperties.length} results found`}
                  {filters.location && (
                    <span className="ml-2 text-brand-red">
                      • Real-time results for "{filters.location}"
                    </span>
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="area">Area: Large to Small</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="ghost" size="sm">
                  <Bookmark size={16} className="mr-1" />
                  Save Search
                </Button>
              </div>
            </div>

            {/* Active Filters - Show all active filters */}
            {(filters.propertyType.length > 0 || 
              filters.bhkType.length > 0 || 
              filters.furnished.length > 0 || 
              filters.availability.length > 0 ||
              filters.locality.length > 0 ||
              filters.construction.length > 0 ||
              filters.budget[0] > 0 || 
              filters.budget[1] < 50000000) && (
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center text-sm text-gray-600 mr-2">
                  <Filter size={14} className="mr-1" />
                  Active filters:
                </div>
                
                {/* Budget filter badge */}
                {(filters.budget[0] > 0 || filters.budget[1] < 50000000) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    ₹{filters.budget[0] === 0 ? '0' : (filters.budget[0] / 100000).toFixed(0) + 'L'} - 
                    ₹{filters.budget[1] >= 10000000 ? (filters.budget[1] / 10000000).toFixed(1) + 'Cr' : (filters.budget[1] / 100000).toFixed(0) + 'L'}
                    <button 
                      onClick={() => updateFilter('budget', [0, 50000000])}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                
                {filters.propertyType.map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type}
                    <button 
                      onClick={() => updateFilter('propertyType', filters.propertyType.filter(t => t !== type))}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {filters.bhkType.map((bhk) => (
                  <Badge key={bhk} variant="secondary" className="flex items-center gap-1">
                    {bhk}
                    <button 
                      onClick={() => updateFilter('bhkType', filters.bhkType.filter(b => b !== bhk))}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {filters.furnished.map((furnished) => (
                  <Badge key={furnished} variant="secondary" className="flex items-center gap-1">
                    {furnished}
                    <button 
                      onClick={() => updateFilter('furnished', filters.furnished.filter(f => f !== furnished))}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {filters.locality.map((locality) => (
                  <Badge key={locality} variant="secondary" className="flex items-center gap-1">
                    {locality}
                    <button 
                      onClick={() => updateFilter('locality', filters.locality.filter(l => l !== locality))}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-brand-red hover:bg-brand-red/10"
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* Properties Grid/List - Real-time results */}
            {isLoading ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-80"></div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProperties.map((property) => (
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
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search criteria or location
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}

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