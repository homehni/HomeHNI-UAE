import { useState, useEffect, useRef } from 'react';
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
import { MapPin, Filter, Grid3X3, List, Bookmark, Share2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import PropertyTools from '@/components/PropertyTools';
import { useSimplifiedSearch } from '@/hooks/useSimplifiedSearch';
const PropertySearch = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 12 properties per page
  const locationInputRef = useRef<HTMLInputElement>(null);
  const {
    filters,
    activeTab,
    setActiveTab,
    filteredProperties,
    updateFilter,
    clearAllFilters,
    availableLocalities,
    isLoading
  } = useSimplifiedSearch();

  // Get max value for budget slider based on active tab
  const getBudgetSliderMax = (tab: string): number => {
    switch (tab) {
      case 'rent':
        return 500000; // 5 Lakh for rent
      case 'buy':
        return 50000000; // 5 Crore for buy
      case 'commercial':
        return 50000000; // 5 Crore for commercial
      default:
        return 50000000; // Default to buy range
    }
  };

  // Get step size for budget slider based on active tab
  const getBudgetSliderStep = (tab: string): number => {
    switch (tab) {
      case 'rent':
        return 10000; // 10K steps for rent (more granular)
      case 'buy':
        return 500000; // 5L steps for buy
      case 'commercial':
        return 500000; // 5L steps for commercial
      default:
        return 500000; // Default to buy range
    }
  };

  // Ensure budget values are within valid range for current tab
  const getValidBudgetValue = (budget: [number, number], tab: string): [number, number] => {
    const maxValue = getBudgetSliderMax(tab);
    return [
      Math.min(Math.max(budget[0], 0), maxValue),
      Math.min(Math.max(budget[1], 0), maxValue)
    ];
  };

  // Calculate pagination
  const totalProperties = filteredProperties.length;
  const totalPages = Math.ceil(totalProperties / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProperties]);

  // Keep input focused after adding locations
  useEffect(() => {
    if (filters.locations.length < 3 && locationInputRef.current) {
      // Small delay to ensure state has updated
      setTimeout(() => {
        if (locationInputRef.current) {
          locationInputRef.current.focus();
        }
      }, 100);
    }
  }, [filters.locations.length]);

  // Property types that match the database schema and FeaturedProperties component
  const getPropertyTypes = (tab: string): string[] => {
    switch (tab) {
      case 'rent':
        return ['ALL', 'APARTMENT', 'VILLA', 'INDEPENDENT HOUSE', 'PENTHOUSE', 'DUPLEX', 'GATED COMMUNITY VILLA'];
      case 'buy':
        return ['ALL', 'APARTMENT', 'CO-LIVING', 'VILLA', 'INDEPENDENT HOUSE', 'BUILDER FLOOR', 'STUDIO APARTMENT', 'CO-WORKING', 'PENTHOUSE', 'DUPLEX'];
      case 'commercial':
        return ['ALL', 'OFFICE', 'RETAIL', 'WAREHOUSE', 'SHOWROOM', 'RESTAURANT', 'CO-WORKING', 'INDUSTRIAL'];
      default:
        return ['ALL', 'APARTMENT', 'VILLA', 'INDEPENDENT HOUSE', 'PENTHOUSE', 'DUPLEX'];
    }
  };

  const propertyTypes = getPropertyTypes(activeTab);
  const bhkTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
  const furnishedOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const availabilityOptions = ['Ready to Move', 'Under Construction'];
  const constructionOptions = ['New Project', '1-5 Years Old', '5-10 Years Old', '10+ Years Old'];

  // Function to normalize location for better search matching
  const normalizeLocation = (location: string) => {
    if (!location) return '';

    // Common location name mappings for better matching
    const locationMappings: {
      [key: string]: string;
    } = {
      'bangalore': 'Bangalore',
      'bengaluru': 'Bangalore',
      'mumbai': 'Mumbai',
      'delhi': 'Delhi',
      'new delhi': 'Delhi',
      'gurgaon': 'Gurgaon',
      'gurugram': 'Gurgaon',
      'noida': 'Noida',
      'pune': 'Pune',
      'hyderabad': 'Hyderabad',
      'chennai': 'Chennai',
      'kolkata': 'Kolkata',
      'ahmedabad': 'Ahmedabad',
      'jaipur': 'Jaipur',
      'lucknow': 'Lucknow',
      'kanpur': 'Kanpur',
      'nagpur': 'Nagpur',
      'indore': 'Indore',
      'thane': 'Thane',
      'bhopal': 'Bhopal',
      'visakhapatnam': 'Visakhapatnam',
      'pimpri': 'Pimpri',
      'patna': 'Patna',
      'vadodara': 'Vadodara',
      'ludhiana': 'Ludhiana',
      'agra': 'Agra',
      'nashik': 'Nashik',
      'faridabad': 'Faridabad',
      'meerut': 'Meerut',
      'rajkot': 'Rajkot',
      'kalyan': 'Kalyan',
      'vasai': 'Vasai',
      'varanasi': 'Varanasi',
      'srinagar': 'Srinagar',
      'aurangabad': 'Aurangabad',
      'solapur': 'Solapur',
      'vijayawada': 'Vijayawada',
      'kolhapur': 'Kolhapur',
      'amravati': 'Amravati',
      'nanded': 'Nanded',
      'sangli': 'Sangli',
      'malegaon': 'Malegaon',
      'ulhasnagar': 'Ulhasnagar',
      'jalgaon': 'Jalgaon',
      'latur': 'Latur',
      'dhule': 'Dhule',
      'ahmednagar': 'Ahmednagar',
      'chandrapur': 'Chandrapur',
      'parbhani': 'Parbhani',
      'ichalkaranji': 'Ichalkaranji',
      'jalna': 'Jalna',
      'bhusawal': 'Bhusawal',
      'panvel': 'Panvel',
      'satara': 'Satara',
      'beed': 'Beed',
      'yavatmal': 'Yavatmal',
      'kamptee': 'Kamptee',
      'gondia': 'Gondia',
      'barshi': 'Barshi',
      'achalpur': 'Achalpur',
      'osmanabad': 'Osmanabad',
      'nandurbar': 'Nandurbar',
      'wardha': 'Wardha',
      'udgir': 'Udgir',
      'amalner': 'Amalner',
      'akola': 'Akola',
      'pulgaon': 'Pulgaon'
    };
    const normalized = location.toLowerCase().trim();
    return locationMappings[normalized] || location;
  };

  // Initialize Google Maps Places Autocomplete
  useEffect(() => {
    const apiKey = 'AIzaSyD2rlXeHN4cm0CQD-y4YGTsob9a_27YcwY';
    const loadGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        if ((window as any).google?.maps?.places) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
      });
    };
    const initAutocomplete = () => {
      if (!(window as any).google?.maps?.places || !locationInputRef.current) return;
      const options = {
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        types: ['geocode'],
        componentRestrictions: {
          country: 'in' as const
        }
      };
      const autocomplete = new (window as any).google.maps.places.Autocomplete(locationInputRef.current, options);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        let locationValue = place?.formatted_address || place?.name || '';

        // Extract only locality name from formatted address since city is already selected
        if (place?.address_components) {
          const addressComponents = place.address_components;

          // Look for locality, sublocality, or neighborhood components (most specific first)
          const localityComponent = addressComponents.find((comp: any) => 
            comp.types.includes('sublocality_level_1') || 
            comp.types.includes('sublocality') || 
            comp.types.includes('neighborhood') ||
            comp.types.includes('locality')
          );

          // Use the most specific locality name available
          if (localityComponent) {
            locationValue = localityComponent.long_name;
          } else {
            // Fallback: extract the first part of the formatted address before the first comma
            const firstPart = locationValue.split(',')[0].trim();
            if (firstPart) {
              locationValue = firstPart;
            }
          }
        }
        
        if (locationValue && filters.selectedCity) {
          // Validate that the selected location is within the selected city
          const isValidLocation = place?.address_components && place.address_components.some((comp: any) => 
            comp.types.includes('administrative_area_level_2') && 
            comp.long_name.toLowerCase().includes(filters.selectedCity.toLowerCase())
          );
          
          if (isValidLocation || !place?.address_components) {
            // Normalize the location for better search matching
            const normalizedLocation = normalizeLocation(locationValue);
            
            // Auto-add location if under limit
            if (filters.locations.length < 3 && !filters.locations.includes(normalizedLocation)) {
              updateFilter('locations', [...filters.locations, normalizedLocation]);
              updateFilter('location', '');
              // Clear the input field after Google Maps updates it
              setTimeout(() => {
                if (locationInputRef.current) {
                  locationInputRef.current.value = '';
                  updateFilter('location', '');
                }
              }, 100);
            } else {
              updateFilter('location', normalizedLocation);
            }
          } else {
            // Clear invalid location and show error
            updateFilter('location', '');
            if (locationInputRef.current) {
              locationInputRef.current.value = '';
            }
          }
        } else if (!filters.selectedCity) {
          // Clear location if no city selected
          updateFilter('location', '');
          if (locationInputRef.current) {
            locationInputRef.current.value = '';
          }
        }
      });
    };
    
    loadGoogleMaps().then(initAutocomplete).catch(console.error);
  }, [updateFilter, filters.selectedCity]); // Re-initialize when selectedCity changes
  return <div className="min-h-screen bg-background">
      {/* Marquee at the very top */}
      <Marquee />
      <Header />
      
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center pt-4">
            {/* Search Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="grid w-full lg:w-auto grid-cols-3 bg-gray-100">
                <TabsTrigger value="buy" className="text-xs lg:text-sm">Buy</TabsTrigger>
                <TabsTrigger value="rent" className="text-xs lg:text-sm">Rent</TabsTrigger>
                <TabsTrigger value="commercial" className="text-xs lg:text-sm">Commercial</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Main Search Bar with City Selector and Multi-Location Support */}
            <div className="flex-1 flex gap-2">
              {/* City Selector */}
              <div className="w-36">
                <Select value={filters.selectedCity} onValueChange={value => updateFilter('selectedCity', value)}>
                  <SelectTrigger className="h-12 border border-brand-red rounded-lg focus:ring-2 focus:ring-brand-red/20 bg-white text-sm font-medium">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <SelectItem value="bangalore" className="text-sm">Bangalore</SelectItem>
                    <SelectItem value="mumbai" className="text-sm">Mumbai</SelectItem>
                    <SelectItem value="delhi" className="text-sm">Delhi</SelectItem>
                    <SelectItem value="pune" className="text-sm">Pune</SelectItem>
                    <SelectItem value="hyderabad" className="text-sm">Hyderabad</SelectItem>
                    <SelectItem value="chennai" className="text-sm">Chennai</SelectItem>
                    <SelectItem value="kolkata" className="text-sm">Kolkata</SelectItem>
                    <SelectItem value="ahmedabad" className="text-sm">Ahmedabad</SelectItem>
                    <SelectItem value="jaipur" className="text-sm">Jaipur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 text-brand-red" size={20} />
                
                {/* Multi-Location Search Bar */}
                <div 
                  className="flex flex-wrap items-center gap-2 p-3 pl-10 pr-4 min-h-12 border border-brand-red rounded-lg focus-within:ring-2 focus-within:ring-brand-red/20 bg-white cursor-text"
                  onClick={() => {
                    // Focus input when clicking anywhere in the search bar
                    if (locationInputRef.current && filters.locations.length < 3) {
                      locationInputRef.current.focus();
                    }
                  }}
                >
                  {/* Location Chips */}
                  {filters.locations.map((location, index) => (
                    <div key={index} className="flex items-center gap-1 bg-brand-red text-white px-3 py-1.5 rounded-full text-sm font-medium">
                      <span className="truncate max-w-32">{location}</span>
                      <button
                        onClick={() => {
                          const newLocations = filters.locations.filter((_, i) => i !== index);
                          updateFilter('locations', newLocations);
                        }}
                        className="ml-1 hover:bg-brand-red-dark rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Input Field */}
                  <input
                    ref={locationInputRef}
                    value={filters.location}
                    onChange={e => {
                      const normalizedLocation = normalizeLocation(e.target.value);
                      updateFilter('location', normalizedLocation);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && filters.location.trim()) {
                        e.preventDefault();
                        if (filters.selectedCity && filters.locations.length < 3 && !filters.locations.includes(filters.location.trim())) {
                          updateFilter('locations', [...filters.locations, filters.location.trim()]);
                          updateFilter('location', '');
                          // Keep focus on input after adding location
                          setTimeout(() => {
                            if (locationInputRef.current) {
                              locationInputRef.current.focus();
                            }
                          }, 0);
                        }
                      }
                      if (e.key === 'Backspace' && filters.location === '' && filters.locations.length > 0) {
                        const newLocations = filters.locations.slice(0, -1);
                        updateFilter('locations', newLocations);
                      }
                    }}
                    onFocus={e => {
                      // Ensure input is always focused and ready for typing
                      e.target.select();
                    }}
                    placeholder={!filters.selectedCity ? "Select a city first..." : filters.locations.length === 0 ? "Enter locality or area name..." : filters.locations.length >= 3 ? "Max 3 locations selected" : "Add more..."}
                    className="flex-1 min-w-32 outline-none bg-transparent text-sm"
                    disabled={filters.locations.length >= 3 || !filters.selectedCity}
                    autoFocus={filters.locations.length < 3 && !!filters.selectedCity}
                  />
                  
                  {/* Location Counter */}
                  {filters.locations.length >= 3 && (
                    <span className="text-gray-500 text-sm">Max 3 locations</span>
                  )}
                </div>
                
                {/* Clear All Locations Button */}
                {filters.locations.length > 0 && (
                  <div className="absolute right-3 top-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        updateFilter('locations', []);
                        updateFilter('location', '');
                      }} 
                      className="h-6 w-6 p-0 hover:bg-brand-red/10"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* View Controls */}
            <div className="flex gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                <Grid3X3 size={16} />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                <List size={16} />
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
                        onValueChange={value => updateFilter('budget', value)} 
                        max={getBudgetSliderMax(activeTab)} 
                        min={0} 
                        step={getBudgetSliderStep(activeTab)} 
                        className="w-full" 
                      />
                    </div>
                    <div className="flex justify-between text-sm font-medium text-foreground">
                      <span>₹{(() => {
                        const validBudget = getValidBudgetValue(filters.budget, activeTab);
                        return validBudget[0] === 0 ? '0' : validBudget[0] >= 10000000 ? (validBudget[0] / 10000000).toFixed(validBudget[0] % 10000000 === 0 ? 0 : 1) + ' Cr' : (validBudget[0] / 100000).toFixed(validBudget[0] % 100000 === 0 ? 0 : 1) + ' L';
                      })()}</span>
                      <span>₹{(() => {
                        const validBudget = getValidBudgetValue(filters.budget, activeTab);
                        return validBudget[1] >= getBudgetSliderMax(activeTab) ? (activeTab === 'rent' ? '5L +' : '5Cr +') : validBudget[1] >= 10000000 ? (validBudget[1] / 10000000).toFixed(validBudget[1] % 10000000 === 0 ? 0 : 1) + ' Cr' : (validBudget[1] / 100000).toFixed(validBudget[1] % 100000 === 0 ? 0 : 1) + ' L';
                      })()}</span>
                    </div>
                    
                    {/* Manual Budget Input Fields */}
                    <div className="space-y-2 mb-3">
                      <div className="text-sm font-medium text-gray-700">Enter Budget Range</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Min Budget</label>
                          <Input type="number" placeholder="Enter min budget" value={filters.budget[0].toString()} onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          if (value <= filters.budget[1]) {
                            updateFilter('budget', [value, filters.budget[1]]);
                          }
                        }} className="h-8 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Max Budget</label>
                          <Input type="number" placeholder="Enter max budget" value={filters.budget[1].toString()} onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          if (value >= filters.budget[0]) {
                            updateFilter('budget', [filters.budget[0], Math.min(value, 100000000)]);
                          }
                        }} className="h-8 text-sm" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <Button variant={filters.budget[0] === 0 && filters.budget[1] === 50000 ? "default" : "outline"} size="sm" onClick={() => updateFilter('budget', [0, 50000])} className="text-xs h-8">
                        Under 50K
                      </Button>
                      <Button variant={filters.budget[0] === 0 && filters.budget[1] === 100000 ? "default" : "outline"} size="sm" onClick={() => updateFilter('budget', [0, 100000])} className="text-xs h-8">
                        Under 1L
                      </Button>
                      <Button variant={filters.budget[0] === 0 && filters.budget[1] === 5000000 ? "default" : "outline"} size="sm" onClick={() => updateFilter('budget', [0, 5000000])} className="text-xs h-8">
                        Under 50L
                      </Button>
                      <Button variant={filters.budget[0] === 5000000 && filters.budget[1] === 10000000 ? "default" : "outline"} size="sm" onClick={() => updateFilter('budget', [5000000, 10000000])} className="text-xs h-8">
                        50L-1Cr
                      </Button>
                      <Button variant={filters.budget[0] === 10000000 && filters.budget[1] === 20000000 ? "default" : "outline"} size="sm" onClick={() => updateFilter('budget', [10000000, 20000000])} className="text-xs h-8">
                        1-2Cr
                      </Button>
                      <Button variant={filters.budget[0] === 20000000 && filters.budget[1] === 50000000 ? "default" : "outline"} size="sm" onClick={() => updateFilter('budget', [20000000, 50000000])} className="text-xs h-8">
                        2-5Cr
                      </Button>
                      <Button variant={filters.budget[0] === 50000000 && filters.budget[1] === 100000000 ? "default" : "outline"} size="sm" onClick={() => updateFilter('budget', [50000000, 100000000])} className="text-xs h-8">
                        5Cr+
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Property Type Filter - List layout with tab styling */}
                <div>
                  <h4 className="font-semibold mb-3">Property Type</h4>
                  <div className="space-y-2">
                    {propertyTypes.map(type => <div key={type} className="flex items-center space-x-2">
                        <button onClick={() => {
                      if (type === 'ALL') {
                        updateFilter('propertyType', []);
                      } else {
                        updateFilter('propertyType', [type]);
                      }
                    }} className={`w-full text-left px-3 py-2 rounded-full text-sm font-medium transition-colors ${filters.propertyType.length === 0 && type === 'ALL' || filters.propertyType.length > 0 && filters.propertyType[0] === type ? 'bg-primary text-primary-foreground shadow' : 'bg-muted/60 hover:bg-muted/80 text-foreground'}`}>
                          {type}
                        </button>
                      </div>)}
                  </div>
                </div>

                <Separator />

                {/* BHK Filter */}
                <div>
                  <h4 className="font-semibold mb-3">BHK Type</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {bhkTypes.map(bhk => <Button key={bhk} variant={filters.bhkType.includes(bhk) ? 'default' : 'outline'} size="sm" onClick={() => {
                    if (filters.bhkType.includes(bhk)) {
                      updateFilter('bhkType', filters.bhkType.filter(b => b !== bhk));
                    } else {
                      updateFilter('bhkType', [...filters.bhkType, bhk]);
                    }
                  }} className="text-xs">
                        {bhk}
                      </Button>)}
                  </div>
                </div>

                <Separator />

                {/* Furnished Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Furnished Status</h4>
                  <div className="space-y-2">
                    {furnishedOptions.map(option => <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={option} checked={filters.furnished.includes(option)} onCheckedChange={checked => {
                      if (checked) {
                        updateFilter('furnished', [...filters.furnished, option]);
                      } else {
                        updateFilter('furnished', filters.furnished.filter(f => f !== option));
                      }
                    }} />
                        <label htmlFor={option} className="text-sm text-gray-700 cursor-pointer">
                          {option}
                        </label>
                      </div>)}
                  </div>
                </div>

                <Separator />

                {/* Construction Status */}
                <div>
                  <h4 className="font-semibold mb-3">Construction Status</h4>
                  <div className="space-y-2">
                    {availabilityOptions.map(option => <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={option} checked={filters.availability.includes(option)} onCheckedChange={checked => {
                      if (checked) {
                        updateFilter('availability', [...filters.availability, option]);
                      } else {
                        updateFilter('availability', filters.availability.filter(a => a !== option));
                      }
                    }} />
                        <label htmlFor={option} className="text-sm text-gray-700 cursor-pointer">
                          {option}
                        </label>
                      </div>)}
                  </div>
                </div>


                <Separator />

                {/* Age of Property Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Age of Property</h4>
                  <div className="space-y-2">
                    {constructionOptions.map(option => <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={option} checked={filters.construction.includes(option)} onCheckedChange={checked => {
                      if (checked) {
                        updateFilter('construction', [...filters.construction, option]);
                      } else {
                        updateFilter('construction', filters.construction.filter(c => c !== option));
                      }
                    }} />
                        <label htmlFor={option} className="text-sm text-gray-700 cursor-pointer">
                          {option}
                        </label>
                      </div>)}
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
                  const propertyTypeText = hasPropertyTypeFilter ? filters.propertyType.length === 1 ? filters.propertyType[0].toLowerCase()
                    .replace('plot', 'plots')
                    .replace('apartment', 'apartments')
                    .replace('villa', 'villas')
                    .replace('commercial', 'commercial properties')
                    .replace('house', 'houses')
                    .replace('penthouse', 'penthouses')
                    .replace('independent house', 'independent houses')
                    .replace('pg hostel', 'pg hostels')
                    .replace('duplex', 'duplexes')
                    .replace('co-living', 'co-living spaces')
                    .replace('builder floor', 'builder floors')
                    .replace('studio apartment', 'studio apartments')
                    .replace('co-working', 'co-working spaces')
                    .replace('gated community villa', 'gated community villas')
                    .replace('office', 'offices')
                    .replace('retail', 'retail spaces')
                    .replace('warehouse', 'warehouses')
                    .replace('showroom', 'showrooms')
                    .replace('restaurant', 'restaurants')
                    .replace('industrial', 'industrial properties') : 'properties' : 'properties';

                  // Get location context
                  const locationText = filters.locations.length > 0 
                    ? ` in ${filters.locations.join(', ')}` 
                    : filters.location 
                    ? ` in ${filters.location}` 
                    : '';
                  switch (activeTab) {
                    case 'buy':
                      return hasPropertyTypeFilter ? `${propertyTypeText.charAt(0).toUpperCase() + propertyTypeText.slice(1)} for Sale${locationText}` : `Properties for Sale${locationText || ' in All Locations'}`;
                    case 'rent':
                      return hasPropertyTypeFilter ? `${propertyTypeText.charAt(0).toUpperCase() + propertyTypeText.slice(1)} for Rent${locationText}` : `Properties for Rent${locationText || ' in All Locations'}`;
                    case 'commercial':
                      return hasPropertyTypeFilter ? `${propertyTypeText.charAt(0).toUpperCase() + propertyTypeText.slice(1)} Commercial${locationText}` : `Commercial Properties${locationText || ' in All Locations'}`;
                    default:
                      return `Properties for Sale${locationText || ' in All Locations'}`;
                  }
                })()}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isLoading ? 'Searching...' : `${filteredProperties.length} results found`}
                  {(filters.locations.length > 0 || filters.location) && <span className="ml-2 text-brand-red">
                      • Real-time results for "{filters.locations.length > 0 ? filters.locations.join(', ') : filters.location}"
                    </span>}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={filters.sortBy} onValueChange={value => updateFilter('sortBy', value)}>
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
            {(filters.propertyType.length > 0 && !filters.propertyType.includes('ALL') || filters.bhkType.length > 0 || filters.furnished.length > 0 || filters.availability.length > 0 || filters.locality.length > 0 || filters.construction.length > 0 || filters.budget[0] > 0 || filters.budget[1] < 50000000 || filters.locations.length > 0) && <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center text-sm text-gray-600 mr-2">
                  <Filter size={14} className="mr-1" />
                  Active filters:
                </div>
                
                {/* Budget filter badge */}
                {(filters.budget[0] > 0 || filters.budget[1] < 50000000) && <Badge variant="secondary" className="flex items-center gap-1">
                    ₹{filters.budget[0] === 0 ? '0' : (filters.budget[0] / 100000).toFixed(0) + 'L'} - 
                    ₹{filters.budget[1] >= 10000000 ? (filters.budget[1] / 10000000).toFixed(1) + 'Cr' : (filters.budget[1] / 100000).toFixed(0) + 'L'}
                    <button onClick={() => updateFilter('budget', [0, 50000000])} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>}
                
                {/* Location badges */}
                {filters.locations.map(location => <Badge key={location} variant="secondary" className="flex items-center gap-1">
                    {location}
                    <button onClick={() => {
                      const newLocations = filters.locations.filter(l => l !== location);
                      updateFilter('locations', newLocations);
                    }} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>)}
                
                {filters.propertyType.filter(type => type !== 'ALL').map(type => <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type}
                    <button onClick={() => updateFilter('propertyType', [])} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>)}
                {filters.bhkType.map(bhk => <Badge key={bhk} variant="secondary" className="flex items-center gap-1">
                    {bhk}
                    <button onClick={() => updateFilter('bhkType', filters.bhkType.filter(b => b !== bhk))} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>)}
                {filters.furnished.map(furnished => <Badge key={furnished} variant="secondary" className="flex items-center gap-1">
                    {furnished}
                    <button onClick={() => updateFilter('furnished', filters.furnished.filter(f => f !== furnished))} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>)}
                {filters.locality.map(locality => <Badge key={locality} variant="secondary" className="flex items-center gap-1">
                    {locality}
                    <button onClick={() => updateFilter('locality', filters.locality.filter(l => l !== locality))} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>)}
                
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-brand-red hover:bg-brand-red/10">
                  Clear All
                </Button>
              </div>}

            {/* Properties Grid/List - Real-time results */}
            {isLoading ? <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-80"></div>)}
              </div> : filteredProperties.length > 0 ? <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {currentProperties.map(property => <PropertyCard key={property.id} id={property.id} title={property.title} location={property.location} price={property.price} area={property.area} bedrooms={property.bedrooms} bathrooms={property.bathrooms} image={property.image} propertyType={property.propertyType} listingType={property.listingType} size={viewMode === 'list' ? 'large' : 'default'} rental_status={property.rental_status} />)}
              </div> : <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search criteria or location
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>}

            {/* Pagination - Only show if there are multiple pages */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  {/* Previous button - only show if not on first page */}
                  {currentPage > 1 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                  )}
                  
                  {/* Page numbers - show up to 5 pages around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(pageNum => {
                      // Show current page and 2 pages on each side
                      return pageNum >= Math.max(1, currentPage - 2) && 
                             pageNum <= Math.min(totalPages, currentPage + 2);
                    })
                    .map(pageNum => (
                      <Button 
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"} 
                        size="sm" 
                        className={pageNum === currentPage ? "bg-red-800 hover:bg-red-900 text-white" : ""}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ))}
                  
                  {/* Next button - only show if there are more pages */}
                  {currentPage < totalPages && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Tools Section */}
      <PropertyTools />

      <Footer />
    </div>;
};
export default PropertySearch;