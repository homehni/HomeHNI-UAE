import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/components/search-input-lock.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyCard from '@/components/PropertyCard';
import { MapPin, Filter, Grid3X3, List, Bookmark, X, Loader2, Search as SearchIcon, Lock, Unlock } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import PropertyTools from '@/components/PropertyTools';
import ChatBot from '@/components/ChatBot';
import { useSimplifiedSearch } from '@/hooks/useSimplifiedSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchTrigger } from '@/hooks/useSearchTrigger';
import { AreaUnit } from '@/utils/areaConverter';
import { LandAreaFilter } from '@/components/LandAreaFilter';

// Import feature flags with the same values as in SearchSection
const MERGE_COMM_LAND_IN_BUY_RENT = true; // Keep true for new behavior
const SHOW_LEGACY_COMMERCIAL_LAND_TABS = false; // Set to false to hide old tabs
// Minimal Google Places typings to avoid 'any'
type GPlaceComponent = { long_name: string; short_name: string; types: string[] };
type LatLng = {
  lat: () => number;
  lng: () => number;
};
type LatLngBounds = {
  extend: (latLng: LatLng) => void;
};
type Geometry = {
  location?: LatLng;
  viewport?: LatLngBounds;
};
type PlaceResultMinimal = {
  formatted_address?: string;
  name?: string;
  address_components?: GPlaceComponent[];
  geometry?: Geometry;
};
type GeocoderResult = {
  geometry?: Geometry;
  formatted_address?: string;
  address_components?: GPlaceComponent[];
};
type GeocoderRequest = {
  address?: string;
  componentRestrictions?: { country: string };
};
type Geocoder = {
  geocode: (
    request: GeocoderRequest, 
    callback: (results: GeocoderResult[] | null, status: string) => void
  ) => void;
};
type GeocoderConstructor = new () => Geocoder;
type GAutocomplete = {
  getPlace: () => PlaceResultMinimal | undefined;
  addListener: (eventName: string, handler: () => void) => void;
};
type LatLngBoundsConstructor = new () => LatLngBounds;
type LatLngConstructor = new (lat: number, lng: number) => LatLng;
type PlacesNamespace = { Autocomplete: new (input: HTMLInputElement, opts: unknown) => GAutocomplete };
type GoogleMaps = { 
  places?: PlacesNamespace;
  LatLngBounds?: LatLngBoundsConstructor;
  LatLng?: LatLngConstructor;
  Geocoder?: GeocoderConstructor;
};
type GoogleNS = { maps?: GoogleMaps };
type WindowWithGoogle = Window & { google?: GoogleNS };
// Function to normalize location text for better searching and display
const normalizeLocation = (location: string): string => {
  if (!location) return '';
  
  // Trim whitespace and capitalize each word
  return location.trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const PropertySearch = () => {
  const navigate = useNavigate();
  // Results view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // Remove client-side pagination; rely on Load More for dataset growth
  const locationInputRef = useRef<HTMLInputElement>(null);
  const [cityBounds, setCityBounds] = useState<LatLngBounds | null>(null);
  // Track whether the search field is locked (prevents manual typing)
  const [isSearchLocked, setIsSearchLocked] = useState<boolean>(true);
  // Track the temporary location text input (before search submission)
  const [tempLocationText, setTempLocationText] = useState<string>('');
  // Track search trigger state
  const { searchTriggered, triggerSearch, resetTrigger } = useSearchTrigger();
  
  // Header dropdowns removed; rely on left sidebar filters only

  const {
    filters,
    activeTab,
    setActiveTab,
    filteredProperties: allFilteredProperties,
    updateFilter,
    clearAllFilters,
    availableLocalities,
    isLoading,
    loadMoreProperties,
    hasMore,
    propertyCount
  } = useSimplifiedSearch();
  
  // Only show filteredProperties when search has been triggered
  const filteredProperties = useMemo(() => {
    return searchTriggered ? allFilteredProperties : [];
  }, [searchTriggered, allFilteredProperties]);

  // Debounce the location input for better performance
  const debouncedLocation = useDebounce(filters.location, 300);
  const [showMobileChips, setShowMobileChips] = useState(false);

  // Get max value for budget slider based on active tab
  const getBudgetSliderMax = (tab: string): number => {
    switch (tab) {
      case 'rent':
        return 500000; // 5 Lakh for rent
      case 'buy':
        return 50000000; // 5 Crore for buy
      case 'commercial':
        return 50000000; // 5 Crore for commercial
      case 'land':
        return 50000000; // Align land with buy range
      default:
        return 50000000; // Default to buy range
    }
  };

  // Get step size for budget slider based on active tab
  const getBudgetSliderStep = (tab: string): number => {
    switch (tab) {
      case 'rent':
        return 1000; // 1K steps for rent for smoother feel
      case 'buy':
        return 100000; // 1L steps for buy for smoother adjustments
      case 'commercial':
        return 100000; // 1L steps for commercial
      case 'land':
        return 100000; // 1L steps for land
      default:
        return 100000; // Default to buy range
    }
  };

  // Snap budget to friendly steps for smoother control
  const snapBudget = (tab: string, range: [number, number]): [number, number] => {
    const roundTo = (val: number, step: number) => Math.round(val / step) * step;
    const snapOne = (val: number) => {
      if (tab === 'rent') {
        if (val <= 50000) return roundTo(val, 5000);
        if (val <= 200000) return roundTo(val, 10000);
        return roundTo(val, 50000);
      }
      if (val <= 2000000) return roundTo(val, 100000);
      if (val <= 10000000) return roundTo(val, 500000);
      return roundTo(val, 1000000);
    };
    const [min, max] = range;
    const snapped: [number, number] = [snapOne(min), snapOne(max)];
    const maxAllowed = getBudgetSliderMax(activeTab);
    snapped[0] = Math.max(0, Math.min(snapped[0], maxAllowed));
    snapped[1] = Math.max(0, Math.min(snapped[1], maxAllowed));
    if (snapped[0] > snapped[1]) snapped[0] = snapped[1];
    return snapped;
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

  // No client-side page reset needed

  // Lock search input on initial load and when locations are updated
  useEffect(() => {
    // Lock the search field whenever we have locations or a query has been performed
    if (filters.locations.length > 0 || window.location.search.includes('loc=')) {
      setIsSearchLocked(true);
    }
    
    // Initialize tempLocationText with current location value
    setTempLocationText(filters.location);
  }, [filters.locations, filters.location]);
  
  // Check if we should show results on initial load
  useEffect(() => {
    // If we have search params in the URL, we should trigger search on initial load
    if (window.location.search.length > 0) {
      triggerSearch();
    }
  }, [triggerSearch]);
  
  // Lock the search field after a search is performed
  useEffect(() => {
    if (filters.trigger === 'search') {
      setIsSearchLocked(true);
    }
  }, [filters.trigger]);

  // Keep input focused after adding locations
  // Redirect from legacy tabs when they're hidden
  useEffect(() => {
    // Redirect legacy tabs to the proper merged tab when feature flag is on
    if (MERGE_COMM_LAND_IN_BUY_RENT && !SHOW_LEGACY_COMMERCIAL_LAND_TABS) {
      if (activeTab === 'commercial' || activeTab === 'land') {
        // Redirect to BUY tab but preserve all other search parameters
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('type', 'buy');
        navigate(`/search?${currentParams.toString()}`, { replace: true });
        setActiveTab('buy');
      }
    }
  }, [activeTab, navigate, setActiveTab]);
  
  // Focus location input when appropriate
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

  // Clear city bounds when all locations are removed
  useEffect(() => {
    if (filters.locations.length === 0) {
      setCityBounds(null);
    }
  }, [filters.locations.length]);

  // Property types that match the database schema and FeaturedProperties component
  const getPropertyTypes = (tab: string): string[] => {
    switch (tab) {
      case 'rent':
        // For Rent tab, include commercial property types when the merge flag is on
        if (MERGE_COMM_LAND_IN_BUY_RENT) {
          return [
            'ALL', 
            // Residential types
            'APARTMENT', 'INDEPENDENT HOUSE', 'VILLA', 'PG/HOSTEL',
            // Commercial types
            'OFFICE', 'RETAIL', 'WAREHOUSE', 'SHOWROOM', 'RESTAURANT', 'CO-WORKING'
          ];
        }
        return ['ALL', 'APARTMENT', 'INDEPENDENT HOUSE', 'VILLA', 'PG/HOSTEL'];
      case 'buy':
        // For Buy tab, include commercial and land property types when the merge flag is on
        if (MERGE_COMM_LAND_IN_BUY_RENT) {
          return [
            'ALL', 
            // Residential types
            'APARTMENT', 'INDEPENDENT HOUSE', 'VILLA',
            // Commercial types
            'OFFICE', 'RETAIL', 'WAREHOUSE', 'SHOWROOM', 'RESTAURANT', 'CO-WORKING',
            // Land types
            'AGRICULTURAL LAND', 'COMMERCIAL LAND', 'INDUSTRIAL LAND'
          ];
        }
        return ['ALL', 'APARTMENT', 'INDEPENDENT HOUSE', 'VILLA'];
      case 'commercial':
        // Removed 'INDUSTRIAL' from filter options as requested
        return ['ALL', 'OFFICE', 'RETAIL', 'WAREHOUSE', 'SHOWROOM', 'RESTAURANT', 'CO-WORKING'];
      case 'land':
        // Land/Plot: no Residential Plot
        return ['ALL', 'AGRICULTURAL LAND', 'COMMERCIAL LAND', 'INDUSTRIAL LAND'];
      default:
        return ['ALL', 'APARTMENT', 'VILLA', 'INDEPENDENT HOUSE', 'PENTHOUSE', 'DUPLEX'];
    }
  };

  const propertyTypes = getPropertyTypes(activeTab);
  const bhkTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
  const furnishedOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const availabilityOptions = ['Ready to Move', 'Under Construction'];
  const constructionOptions = ['New Project', '1-5 Years Old', '5-10 Years Old', '10+ Years Old'];
  const areaUnits = ['sq.ft', 'sq.yards', 'sq.m', 'acres', 'bigha', 'marla', 'cents', 'guntha'];
  // Commercial specific options
  const floorOptions = ['Basement', 'Ground', '1', '2', '3+'];
  const parkingOptions = ['Parking Available', 'No Parking'];

  // Reusable filters panel used in desktop sidebar and mobile drawer
  const FiltersPanel = () => {
  // Preserve sidebar scroll to avoid jump-to-top when clicking options
  const preserveScroll = (fn: () => void) => {
    const el = (typeof document !== 'undefined' && (document.getElementById('filters-scroll-desktop') || document.getElementById('filters-scroll-mobile'))) as HTMLElement | null;
    const y = el?.scrollTop ?? 0;
    fn();
    // Restore on next tick so DOM has applied changes
    setTimeout(() => {
      if (el) el.scrollTop = y;
    }, 0);
  };
  const [uiBudget, setUiBudget] = useState<[number, number]>(filters.budget);
  const [uiLandArea, setUiLandArea] = useState<[number, number]>(filters.landArea);
  const [landAreaUnit, setLandAreaUnit] = useState<string>(filters.landAreaUnit);
  const budgetKey = `${filters.budget[0]}-${filters.budget[1]}`;
  const landAreaKey = `${filters.landArea[0]}-${filters.landArea[1]}-${filters.landAreaUnit}`;
  useEffect(() => { setUiBudget(filters.budget); }, [budgetKey]);
  useEffect(() => { 
    setUiLandArea(filters.landArea); 
    setLandAreaUnit(filters.landAreaUnit);
  }, [landAreaKey]);
    
    const commitBudget = (value: [number, number]) => {
      preserveScroll(() => updateFilter('budget', snapBudget(activeTab, value)));
    };
    
    const commitLandArea = (value: [number, number]) => {
      preserveScroll(() => updateFilter('landArea', value));
    };
    
    const commitLandAreaUnit = (unit: string) => {
      preserveScroll(() => updateFilter('landAreaUnit', unit));
    };

    return (<>
      {/* Budget Filter */}
      <div>
        <h4 className="font-semibold mb-3" id="budget-label">Budget Range</h4>
        <div className="space-y-3">
          <div className="relative">
            <Slider 
              value={uiBudget}
              onValueChange={(value) => setUiBudget(value as [number, number])}
              onValueCommit={(value) => commitBudget(value as [number, number])}
              max={getBudgetSliderMax(activeTab)} 
              min={0} 
              step={getBudgetSliderStep(activeTab)} 
              className="w-full"
              aria-labelledby="budget-label"
              aria-valuemin={0}
              aria-valuemax={getBudgetSliderMax(activeTab)}
              aria-valuenow={uiBudget[1]}
            />
          </div>
          <div className="flex justify-between text-sm font-medium text-foreground">
            <span>₹{(() => {
              const validBudget = getValidBudgetValue(uiBudget, activeTab);
              return validBudget[0] === 0 ? '0' : validBudget[0] >= 10000000 ? (validBudget[0] / 10000000).toFixed(validBudget[0] % 10000000 === 0 ? 0 : 1) + ' Cr' : (validBudget[0] / 100000).toFixed(validBudget[0] % 100000 === 0 ? 0 : 1) + ' L';
            })()}</span>
            <span>₹{(() => {
              const validBudget = getValidBudgetValue(uiBudget, activeTab);
              return validBudget[1] >= getBudgetSliderMax(activeTab) ? (activeTab === 'rent' ? '5L +' : '5Cr +') : validBudget[1] >= 10000000 ? (validBudget[1] / 10000000).toFixed(validBudget[1] % 10000000 === 0 ? 0 : 1) + ' Cr' : (validBudget[1] / 100000).toFixed(validBudget[1] % 100000 === 0 ? 0 : 1) + ' L';
            })()}</span>
          </div>
          {/* Manual Budget Input Fields */}
          <div className="space-y-2 mb-3">
            <div className="text-sm font-medium text-gray-700">Enter Budget Range</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="min-budget" className="text-xs text-gray-500 mb-1 block">Min Budget</label>
                <Input 
                  id="min-budget"
                  type="number" 
                  placeholder="Enter min budget" 
                  value={uiBudget[0].toString()} 
                  onChange={e => {
                    const value = parseInt(e.target.value) || 0;
                    if (value <= uiBudget[1]) setUiBudget([value, uiBudget[1]]);
                  }} 
                  onBlur={() => commitBudget(uiBudget)}
                  onKeyDown={e => { if (e.key === 'Enter') commitBudget(uiBudget); }}
                  className="h-8 text-sm"
                  aria-label="Minimum budget amount"
                />
              </div>
              <div>
                <label htmlFor="max-budget" className="text-xs text-gray-500 mb-1 block">Max Budget</label>
                <Input 
                  id="max-budget"
                  type="number" 
                  placeholder="Enter max budget" 
                  value={uiBudget[1].toString()} 
                  onChange={e => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= uiBudget[0]) setUiBudget([uiBudget[0], Math.min(value, 50000000)]);
                  }} 
                  onBlur={() => commitBudget(uiBudget)}
                  onKeyDown={e => { if (e.key === 'Enter') commitBudget(uiBudget); }}
                  className="h-8 text-sm"
                  aria-label="Maximum budget amount"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <Button variant={uiBudget[0] === 0 && uiBudget[1] === 50000 ? "default" : "outline"} size="sm" onClick={() => { setUiBudget([0, 50000]); commitBudget([0, 50000]); }} className="text-xs h-8">
              Under 50K
            </Button>
            <Button variant={uiBudget[0] === 0 && uiBudget[1] === 100000 ? "default" : "outline"} size="sm" onClick={() => { setUiBudget([0, 100000]); commitBudget([0, 100000]); }} className="text-xs h-8">
              Under 1L
            </Button>
            <Button variant={uiBudget[0] === 0 && uiBudget[1] === 5000000 ? "default" : "outline"} size="sm" onClick={() => { setUiBudget([0, 5000000]); commitBudget([0, 5000000]); }} className="text-xs h-8">
              Under 50L
            </Button>
            <Button variant={uiBudget[0] === 5000000 && uiBudget[1] === 10000000 ? "default" : "outline"} size="sm" onClick={() => { setUiBudget([5000000, 10000000]); commitBudget([5000000, 10000000]); }} className="text-xs h-8">
              50L-1Cr
            </Button>
            <Button variant={uiBudget[0] === 10000000 && uiBudget[1] === 20000000 ? "default" : "outline"} size="sm" onClick={() => { setUiBudget([10000000, 20000000]); commitBudget([10000000, 20000000]); }} className="text-xs h-8">
              1-2Cr
            </Button>
            <Button variant={uiBudget[0] === 20000000 && uiBudget[1] === 50000000 ? "default" : "outline"} size="sm" onClick={() => { setUiBudget([20000000, 50000000]); commitBudget([20000000, 50000000]); }} className="text-xs h-8">
              2-5Cr
            </Button>
            <Button variant={uiBudget[0] === 50000000 && uiBudget[1] === 50000000 ? "default" : "outline"} size="sm" onClick={() => { setUiBudget([50000000, 50000000]); commitBudget([50000000, 50000000]); }} className="text-xs h-8">
              5Cr+
            </Button>
          </div>
        </div>
      </div>

      <Separator />
      
      {/* Land Area Filter - show for land tab or when land property types are selected */}
      {(activeTab === 'land' || 
        (filters.propertyType.length > 0 && 
         ['AGRICULTURAL LAND', 'COMMERCIAL LAND', 'INDUSTRIAL LAND'].includes(filters.propertyType[0]))) && (
        <>
          <div>
            <LandAreaFilter
              value={uiLandArea}
              unit={landAreaUnit}
              onChange={setUiLandArea}
              onCommit={commitLandArea}
              onUnitChange={commitLandAreaUnit}
            />
          </div>
          <Separator />
        </>
      )}

      {/* Property Type Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Property Type</h4>
          {filters.propertyType.length > 0 && filters.propertyType[0] !== 'ALL' && (
            <Button variant="ghost" size="sm" onClick={() => updateFilter('propertyType', [])} className="h-6 text-xs">
              Clear
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          {propertyTypes.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`property-type-${type}`}
                checked={
                  (filters.propertyType.length === 0 && type === 'ALL') ||
                  (filters.propertyType.length > 0 && filters.propertyType[0] === type)
                }
                onCheckedChange={(checked) => {
                  preserveScroll(() => {
                    if (type === 'ALL') {
                      updateFilter('propertyType', []);
                    } else if (checked) {
                      updateFilter('propertyType', [type]);
                    } else {
                      updateFilter('propertyType', []);
                    }
                  });
                }}
              />
              <label
                htmlFor={`property-type-${type}`}
                className="text-sm cursor-pointer flex-1"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Show separator only if there's content after Property Type */}
      {(activeTab === 'commercial' || activeTab === 'buy' || activeTab === 'rent') && <Separator />}

      {/* Determine if we should show commercial-specific filters */}
      {/* Commercial-only: Floor filter (show for commercial properties in any tab) */}
      {(activeTab === 'commercial' || 
        (MERGE_COMM_LAND_IN_BUY_RENT && 
         ((activeTab === 'buy' || activeTab === 'rent') && 
          filters.propertyType.length > 0 && 
          ['OFFICE', 'RETAIL', 'WAREHOUSE', 'SHOWROOM', 'RESTAURANT', 'CO-WORKING'].includes(filters.propertyType[0])))) && (
        <>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Floor</h4>
            {filters.floor && filters.floor.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => updateFilter('floor', [])} className="h-6 text-xs">Clear</Button>
            )}
          </div>
          <div className="space-y-2">
            {floorOptions.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`floor-${option}`}
                  checked={(filters.floor || []).includes(option)}
                  onCheckedChange={checked => {
                    preserveScroll(() => {
                      const current = filters.floor || [];
                      if (checked) {
                        updateFilter('floor', [...current, option]);
                      } else {
                        updateFilter('floor', current.filter((f: string) => f !== option));
                      }
                    });
                  }}
                />
                <label htmlFor={`floor-${option}`} className="text-sm text-gray-700 cursor-pointer">{option}</label>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        </>
      )}


  {/* BHK Filter (hide for land and commercial property types) */}
  {activeTab !== 'land' && 
   !(filters.propertyType.length > 0 && 
     ['AGRICULTURAL LAND', 'COMMERCIAL LAND', 'INDUSTRIAL LAND', 
      'OFFICE', 'RETAIL', 'WAREHOUSE', 'SHOWROOM', 'RESTAURANT', 'CO-WORKING'].includes(filters.propertyType[0])) && 
   activeTab !== 'commercial' && (
    <>
    <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">BHK Type</h4>
          {filters.bhkType.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => updateFilter('bhkType', [])} className="h-6 text-xs">
              Clear
            </Button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {bhkTypes.map(bhk => (
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
      </>
  )}

  {/* Property Status (hide for land and commercial property types) */}
  {activeTab !== 'land' && 
   activeTab !== 'commercial' && 
   !(filters.propertyType.length > 0 && 
     ['AGRICULTURAL LAND', 'COMMERCIAL LAND', 'INDUSTRIAL LAND',
      'OFFICE', 'RETAIL', 'WAREHOUSE', 'SHOWROOM', 'RESTAURANT', 'CO-WORKING'].includes(filters.propertyType[0])) && (
    <>
    <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Property Status</h4>
          {filters.availability.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => updateFilter('availability', [])} className="h-6 text-xs">
              Clear
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {availabilityOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`availability-${option}`}
                checked={filters.availability.includes(option)}
                onCheckedChange={checked => {
                  preserveScroll(() => {
                    if (checked) {
                      updateFilter('availability', [...filters.availability, option]);
                    } else {
                      updateFilter('availability', filters.availability.filter(a => a !== option));
                    }
                  });
                }}
              />
              <label htmlFor={`availability-${option}`} className="text-sm text-gray-700 cursor-pointer">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      </>
  )}

  {/* Furnishing (not relevant for land property types; show for residential and commercial) */}
  {activeTab !== 'land' && 
   !(filters.propertyType.length > 0 && 
     ['AGRICULTURAL LAND', 'COMMERCIAL LAND', 'INDUSTRIAL LAND'].includes(filters.propertyType[0])) && (
    <>
    <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Furnishing</h4>
          {filters.furnished.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => updateFilter('furnished', [])} className="h-6 text-xs">
              Clear
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {furnishedOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`furnished-${option}`}
                checked={filters.furnished.includes(option)}
                onCheckedChange={checked => {
                  preserveScroll(() => {
                    if (checked) {
                      updateFilter('furnished', [...filters.furnished, option]);
                    } else {
                      updateFilter('furnished', filters.furnished.filter(a => a !== option));
                    }
                  });
                }}
              />
              <label htmlFor={`furnished-${option}`} className="text-sm text-gray-700 cursor-pointer">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      </>
  )}

  {/* Age of Property (hide for land and commercial property types) */}
  {activeTab !== 'land' && 
   activeTab !== 'commercial' && 
   !(filters.propertyType.length > 0 && 
     ['AGRICULTURAL LAND', 'COMMERCIAL LAND', 'INDUSTRIAL LAND',
      'OFFICE', 'RETAIL', 'WAREHOUSE', 'SHOWROOM', 'RESTAURANT', 'CO-WORKING'].includes(filters.propertyType[0])) && (<div>
      {/* end commercial-only filters (moved earlier) */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Age of Property</h4>
          {filters.construction.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => updateFilter('construction', [])} className="h-6 text-xs">
              Clear
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {constructionOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`construction-${option}`}
                checked={filters.construction.includes(option)}
                onCheckedChange={checked => {
                  preserveScroll(() => {
                    if (checked) {
                      updateFilter('construction', [...filters.construction, option]);
                    } else {
                      updateFilter('construction', filters.construction.filter(c => c !== option));
                    }
                  });
                }}
              />
              <label htmlFor={`construction-${option}`} className="text-sm text-gray-700 cursor-pointer">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>)}
    </>);
  };

  // Function to normalize location for better search matching
  const normalizeLocation = useCallback((location: string) => {
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
  }, []);

  // Initialize Google Maps Places Autocomplete - but only when the search is actually unlocked
  useEffect(() => {
    const apiKey = 'AIzaSyD2rlXeHN4cm0CQD-y4YGTsob9a_27YcwY';
    const loadGoogleMaps = () => {
      return new Promise((resolve, reject) => {
  const w = window as WindowWithGoogle;
  if (w.google?.maps?.places) {
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
      const w = window as WindowWithGoogle;
      if (isSearchLocked) return; // Don't initialize if search is locked
      if (!w.google?.maps?.places || !locationInputRef.current) return;
      
      const getOptions = () => ({
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        types: ['geocode'],
        componentRestrictions: {
          country: 'in' as const
        }
      });
      
      const autocomplete = new w.google!.maps!.places!.Autocomplete(locationInputRef.current, getOptions());
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('🔍 Google Places - Place selected:', place);
        
        let locationValue = place?.formatted_address || place?.name || '';
        console.log('🔍 Google Places - Initial value:', locationValue);
        
        // Try to extract city from address components
        let cityName = '';
        
        // Extract only locality name from formatted address
        if (locationValue && place?.address_components) {
          const addressComponents = place.address_components;
          
          // Look for locality, sublocality, or neighborhood components
          const localityComponent = addressComponents.find((comp: GPlaceComponent) => 
            comp.types.includes('sublocality_level_1') || 
            comp.types.includes('sublocality') || 
            comp.types.includes('locality') ||
            comp.types.includes('neighborhood')
          );
          
          // Extract city - prioritize locality over administrative areas
          const cityComponent = addressComponents.find((comp: GPlaceComponent) =>
            comp.types.includes('locality')
          ) || addressComponents.find((comp: GPlaceComponent) =>
            comp.types.includes('administrative_area_level_2')
          );
          
          if (cityComponent) {
            cityName = cityComponent.long_name;
            console.log('🏙️ Detected city from selection:', cityName);
          }
          
          // Additional validation: check if any address component matches selected city
          if (filters.selectedCity && addressComponents) {
            const hasMatchingCity = addressComponents.some((comp: GPlaceComponent) =>
              comp.long_name.toLowerCase() === filters.selectedCity.toLowerCase() ||
              comp.short_name.toLowerCase() === filters.selectedCity.toLowerCase()
            );
            
            if (!hasMatchingCity) {
              console.warn('⛔ City mismatch detected in address components');
              console.log('Selected city:', filters.selectedCity);
              console.log('Address components:', addressComponents.map((c: GPlaceComponent) => c.long_name));
              // Override cityName to force rejection
              cityName = addressComponents.find((comp: GPlaceComponent) =>
                comp.types.includes('locality')
              )?.long_name || 'Unknown';
            }
          }
          
          // Use the most specific locality name available
          if (localityComponent) {
            locationValue = localityComponent.long_name;
            console.log('🔍 Google Places - Using locality component:', locationValue);
          } else {
            // Fallback: extract the first part of the formatted address before the first comma
            const firstPart = locationValue.split(',')[0].trim();
            if (firstPart) {
              locationValue = firstPart;
              console.log('🔍 Google Places - Using first part:', locationValue);
            }
          }
        }
        
        if (locationValue) {
          console.log('🔍 Google Places - Current selectedLocations:', filters.locations.length);
          console.log('🔍 Google Places - Selected city:', filters.selectedCity);
          console.log('🔍 Google Places - Detected city:', cityName);
          console.log('🔍 Google Places - Full formatted_address:', place?.formatted_address);
          
          // Normalize the location for better search matching
          const normalizedLocation = normalizeLocation(locationValue);
          
          // Update the location directly but DO NOT trigger search yet
          console.log('✅ Google Places - Setting location:', normalizedLocation);
          updateFilter('location', normalizedLocation);
          
          // Update tempLocationText to match the selected location
          setTempLocationText(normalizedLocation);
          
          // Lock the search field to indicate selection is complete
          setIsSearchLocked(true);
          
          // Reset search triggered flag to hide results until search button is clicked
          resetTrigger();
          
          // DO NOT trigger search automatically - wait for explicit search button click
        }
      });
    };
    
    // Only load Google Maps API and initialize autocomplete when search is unlocked
    if (!isSearchLocked) {
      loadGoogleMaps().then(initAutocomplete).catch(console.error);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchLocked]); // Re-initialize when search lock state changes

  // City restriction logic removed - allowing search across all cities
  return <div className="min-h-screen bg-background">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-red focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      
      {/* Marquee at the very top */}
      <Marquee />
      <Header />
      
      {/* Chat Bot - Context-aware for search page */}
      <ChatBot searchContext={{ activeTab: activeTab as 'buy' | 'rent' | 'commercial' | 'land' }} />
      
      {/* Enhanced Search Header */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="container mx-auto px-4 py-4">
          {/* Top Row: Tabs and Location Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center pt-4">
            {/* Search Tabs - Styled to match screenshot */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-64">
              <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 rounded-full overflow-hidden h-12 p-0.5" role="tablist" aria-label="Property listing type">
                <TabsTrigger 
                  value="buy" 
                  className="data-[state=active]:bg-brand-red data-[state=active]:text-white rounded-full text-base font-medium h-full" 
                  role="tab" 
                  aria-selected={activeTab === 'buy'}
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger 
                  value="rent" 
                  className="data-[state=active]:bg-brand-red data-[state=active]:text-white rounded-full text-base font-medium h-full" 
                  role="tab" 
                  aria-selected={activeTab === 'rent'}
                >
                  Rent
                </TabsTrigger>
                {SHOW_LEGACY_COMMERCIAL_LAND_TABS && (
                  <>
                    <TabsTrigger value="commercial" className="hidden" role="tab" aria-selected={activeTab === 'commercial'}>Commercial</TabsTrigger>
                    <TabsTrigger value="land" className="hidden" role="tab" aria-selected={activeTab === 'land'}>Land/Plot</TabsTrigger>
                  </>
                )}
              </TabsList>
            </Tabs>

            {/* Main Search Bar with Multi-Location Support */}
            <div className="flex-1 w-full">
              {/* Multi-Location Search Bar */}
              <div 
                className={`flex items-center gap-2 px-4 py-2.5 min-h-[48px] border border-gray-200 rounded-full bg-white shadow-sm transition relative
                  ${isSearchLocked 
                    ? 'search-container-locked cursor-pointer' 
                    : 'search-container-unlocked search-unlock-animation focus-within:ring-2 focus-within:ring-brand-red/30'}`}
                onClick={() => {
                  // Unlock the search field when clicked
                  setIsSearchLocked(false);
                  // Initialize tempLocationText with current location
                  setTempLocationText(filters.location);
                  if (locationInputRef.current && filters.locations.length < 3) {
                    locationInputRef.current.focus();
                  }
                }}
              >
                {/* Map Pin Icon */}
                <MapPin className="text-brand-red shrink-0" size={18} />
                
                {/* Location Chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  {filters.locations.map((location: string, index: number) => (
                    <div key={index} className="flex items-center gap-1.5 bg-brand-red text-white px-3 py-1 rounded-full text-sm font-medium shrink-0">
                      <span className="truncate max-w-32">{location}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newLocations = filters.locations.filter((_: string, i: number) => i !== index);
                          updateFilter('locations', newLocations);
                        }}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${location}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Lock/Unlock indicator removed */}
                
                {/* Input Field */}
                <input
                  ref={locationInputRef}
                  value={isSearchLocked ? filters.location : tempLocationText}
                  onChange={e => {
                    // Only allow typing when search is unlocked
                    if (!isSearchLocked) {
                      // Update the temporary text without triggering search
                      setTempLocationText(e.target.value);
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && tempLocationText.trim()) {
                      e.preventDefault();
                      // Only update filter but DON'T trigger search yet - wait for explicit search button click
                      const normalizedLocation = normalizeLocation(tempLocationText);
                      updateFilter('location', normalizedLocation);
                      // Lock the search field after text is confirmed
                      setIsSearchLocked(true);
                      // Reset search triggered flag to hide results until search button is clicked
                      resetTrigger();
                    }
                  }}
                  onFocus={e => {
                    if (!isSearchLocked) {
                      e.target.select();
                    }
                  }}
                  readOnly={isSearchLocked}
                  placeholder={isSearchLocked ? "Search locality..." : "Search locality..."}
                  className={`flex-1 min-w-[120px] outline-none text-sm placeholder:text-gray-500
                    ${isSearchLocked ? 'cursor-pointer search-input-locked' : 
                     (tempLocationText !== filters.location ? 'bg-rose-50 text-rose-800 font-medium' : 'bg-transparent')}`}
                />
                
                {/* Search Icon Button */}
                <button
                  type="button"
                  className={`flex items-center justify-center h-10 transition-all ${!isSearchLocked && tempLocationText !== filters.location 
                    ? "w-auto px-3 rounded-full text-white bg-rose-600 hover:bg-rose-700 search-button-expanded" 
                    : "w-auto px-5 rounded-full text-white bg-brand-red hover:bg-brand-red-dark"} 
                    focus:outline-none focus:ring-2 focus:ring-brand-red/40 shrink-0`}
                  aria-label={isSearchLocked ? "Search" : "Add location"}
                  onClick={(e) => {
                    e.stopPropagation();
                    
                    // Always trigger search when the search button is clicked
                    if (isSearchLocked) {
                      // If locked, just trigger search with existing parameters
                      updateFilter('trigger', 'search');
                      // Set search as triggered to show results
                      triggerSearch();
                    } else {
                      // Otherwise add the location if valid
                      const typed = tempLocationText.trim();
                      if (typed && filters.selectedCity && filters.locations.length < 3 && !filters.locations.includes(typed)) {
                        // First update the real location with our temporary text
                        const normalizedLocation = normalizeLocation(typed);
                        updateFilter('location', normalizedLocation);
                        updateFilter('locations', [...filters.locations, normalizedLocation]);
                        setTempLocationText('');
                        // Lock the search field after adding location
                        setIsSearchLocked(true);
                        
                        // Now trigger search explicitly
                        updateFilter('trigger', 'search');
                        // Set search as triggered to show results
                        triggerSearch();
                        
                        setTimeout(() => {
                          locationInputRef.current?.focus();
                        }, 0);
                      } else if (typed) {
                        // If there's a typed location, update the real location and perform search
                        const normalizedLocation = normalizeLocation(typed);
                        updateFilter('location', normalizedLocation);
                        
                        // Now trigger search explicitly
                        updateFilter('trigger', 'search');
                        // Set search as triggered to show results
                        triggerSearch();
                        
                        // Lock the search field after search
                        setIsSearchLocked(true);
                      }
                    }
                  }}
                >
                  <SearchIcon className="h-4 w-4" />
                  {!isSearchLocked && tempLocationText !== filters.location && (
                    <span className="ml-1 text-sm font-medium">Search</span>
                  )}
                </button>
                
                {/* Clear All Locations Button */}
                {filters.locations.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFilter('locations', []);
                      updateFilter('location', '');
                      updateFilter('selectedCity', '');
                      setTempLocationText('');
                      // Unlock the search field when clearing all locations
                      setIsSearchLocked(false);
                      // Trigger search with empty location
                      updateFilter('trigger', 'search');
                      // Set search as triggered to show results
                      triggerSearch();
                    }}
                    className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                    aria-label="Clear all locations"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Actions: Filters + Search (sticky) */}
            <div className="w-full lg:hidden flex gap-2 sticky top-[64px] z-30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 py-2">
              {/* Filters Drawer Trigger */}
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Filter className="mr-2 h-4 w-4" /> Filters
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh]">
                  <DrawerHeader className="flex items-center justify-between">
                    <DrawerTitle>Filters</DrawerTitle>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="icon" aria-label="Close filters">
                        <X className="h-5 w-5" />
                      </Button>
                    </DrawerClose>
                  </DrawerHeader>
                  <div className="px-4 pb-2">
                    <div id="filters-scroll-mobile" className="h-[70vh] pr-2 overflow-y-auto">
                      <div className="space-y-6">
                        <FiltersPanel />
                      </div>
                    </div>
                  </div>
                  <DrawerFooter className="pb-[max(env(safe-area-inset-bottom),16px)]">
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={clearAllFilters}>Clear All</Button>
                      <DrawerClose asChild>
                        <Button className="flex-1 bg-brand-red hover:bg-brand-red-dark">Apply</Button>
                      </DrawerClose>
                    </div>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
            {/* Desktop Search Button removed; icon is inside the field */}
          </div>
          
        </div>
      </div>

      {/* Header dropdowns removed: relying on left sidebar filters */}

      <main id="main-content" className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar (sticky on desktop) */}
          <div className="hidden lg:block w-80">
            <div className="sticky top-[96px] pb-4">
            <Card className="max-h-[calc(100vh-120px)] overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg" id="filters-heading">Filters</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllFilters}
                    aria-label="Clear all filters"
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pr-2 pb-0">
                <div id="filters-scroll-desktop" className="space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] pb-4">
                  <FiltersPanel />
                </div>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                {/* Screen reader announcement for search results */}
                <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                  {isLoading 
                    ? 'Searching for properties...' 
                    : `Found ${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'}`}
                </div>
                
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
                    case 'land':
                      return hasPropertyTypeFilter ? `${propertyTypeText.charAt(0).toUpperCase() + propertyTypeText.slice(1)}${locationText}` : `Land & Plots${locationText || ' in All Locations'}`;
                    default:
                      return `Properties for Sale${locationText || ' in All Locations'}`;
                  }
                })()}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isLoading ? 'Searching...' : `${filteredProperties.length} results found`}
                  {(filters.locations.length > 0 || debouncedLocation) && <span className="ml-2 text-brand-red">
                      • Real-time results for "{filters.locations.length > 0 ? filters.locations.join(', ') : debouncedLocation}"
                    </span>}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={filters.sortBy} onValueChange={value => updateFilter('sortBy', value)}>
                  <SelectTrigger className="w-48" aria-label="Sort properties by">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="area">Area: Large to Small</SelectItem>
                    {activeTab === 'commercial' && (
                      <>
                        <div className="px-2 pt-2 pb-1 text-xs text-muted-foreground">Commercial types</div>
                        <SelectItem value="type-office">Office first</SelectItem>
                        <SelectItem value="type-retail">Retail/Shop first</SelectItem>
                        <SelectItem value="type-warehouse">Warehouse first</SelectItem>
                        <SelectItem value="type-showroom">Showroom first</SelectItem>
                        <SelectItem value="type-restaurant">Restaurant first</SelectItem>
                        <SelectItem value="type-coworking">Co-working first</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                
                {/* Save Search button - commented out until further required
                <Button variant="ghost" size="sm" aria-label="Save current search criteria" className="hidden sm:inline-flex">
                  <Bookmark size={16} className="mr-1" aria-hidden="true" />
                  Save Search
                </Button>
                */}

                {/* View mode toggles */}
                <div className="hidden sm:flex items-center gap-1" role="group" aria-label="View mode">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    aria-pressed={viewMode === 'grid'}
                    aria-label="Grid view"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    aria-pressed={viewMode === 'list'}
                    aria-label="List view"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters - Show all active filters */}
            {(filters.propertyType.length > 0 && !filters.propertyType.includes('ALL')
              || filters.bhkType.length > 0
              || filters.furnished.length > 0
              || filters.availability.length > 0
              || filters.locality.length > 0
              || filters.construction.length > 0
              || filters.budgetDirty
              || filters.areaDirty
              || filters.locations.length > 0) && <>
              {/* Mobile summary pill */}
              <div className="sm:hidden mb-2">
                <Button variant="outline" size="sm" onClick={() => setShowMobileChips(v => !v)} className="w-full justify-between">
                  <span className="flex items-center"><Filter size={14} className="mr-1" /> Active filters</span>
                  <Badge variant="secondary">{[
                    ...filters.propertyType.filter(t => t !== 'ALL'),
                    ...filters.bhkType,
                    ...filters.furnished,
                    ...filters.availability,
                    ...filters.construction,
                    ...filters.locality,
                  ].length
                    + (filters.budgetDirty ? 1 : 0)
                    + (filters.areaDirty ? 1 : 0)
                    + (filters.locations.length > 0 ? filters.locations.length : 0)}</Badge>
                </Button>
              </div>

              <div className={`mb-6 ${showMobileChips ? 'block' : 'hidden'} sm:block`}>
                <div className="flex flex-wrap sm:flex-wrap gap-2 overflow-x-auto sm:overflow-visible pb-1">
                <div className="flex items-center text-sm text-gray-600 mr-2">
                  <Filter size={14} className="mr-1" />
                  Active filters:
                </div>
                
                {/* Budget filter badge */}
                {filters.budgetDirty && <Badge variant="secondary" className="flex items-center gap-1">
                    ₹{filters.budget[0] === 0 ? '0' : (filters.budget[0] / 100000).toFixed(0) + 'L'} - 
                    ₹{filters.budget[1] >= 10000000 ? (filters.budget[1] / 10000000).toFixed(1) + 'Cr' : (filters.budget[1] / 100000).toFixed(0) + 'L'}
                    <button onClick={() => updateFilter('budget', [0, getBudgetSliderMax(activeTab)])} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>}
                
                {/* Land Area filter badge - for land tab or land property types */}
                {filters.landAreaDirty && 
                 (activeTab === 'land' || 
                  (filters.propertyType.length > 0 && 
                   ['AGRICULTURAL LAND', 'COMMERCIAL LAND', 'INDUSTRIAL LAND'].includes(filters.propertyType[0]))) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.landArea[0]} - {filters.landArea[1]} {filters.landAreaUnit}
                    <button onClick={() => {
                      updateFilter('landArea', [0, 10]);
                      updateFilter('landAreaDirty', false);
                    }} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                
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
                {filters.availability.map(option => (
                  <Badge key={`avail-${option}`} variant="secondary" className="flex items-center gap-1">
                    {option}
                    <button onClick={() => updateFilter('availability', filters.availability.filter(a => a !== option))} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {filters.construction.map(option => (
                  <Badge key={`cons-${option}`} variant="secondary" className="flex items-center gap-1">
                    {option}
                    <button onClick={() => updateFilter('construction', filters.construction.filter(c => c !== option))} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {filters.locality.map(locality => <Badge key={locality} variant="secondary" className="flex items-center gap-1">
                    {locality}
                    <button onClick={() => updateFilter('locality', filters.locality.filter(l => l !== locality))} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>)}
                {/* Commercial chips */}
                {(filters.floor || []).map(f => (
                  <Badge key={`floor-${f}`} variant="secondary" className="flex items-center gap-1">
                    Floor: {f}
                    <button onClick={() => updateFilter('floor', (filters.floor || []).filter((x: string) => x !== f))} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {(filters.parking || []).map(p => (
                  <Badge key={`parking-${p}`} variant="secondary" className="flex items-center gap-1">
                    {p}
                    <button onClick={() => updateFilter('parking', (filters.parking || []).filter((x: string) => x !== p))} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                  
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-brand-red hover:bg-brand-red/10">
                    Clear All
                  </Button>
                </div>
              </div>
            </>}

            {/* Properties Grid/List - Results only shown after search is triggered */}
            {!searchTriggered ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to find properties?</h3>
                <p className="text-gray-500 mb-4">
                  Select your search criteria and click the search button to see results
                </p>
                <Button 
                  onClick={() => {
                    updateFilter('trigger', 'search');
                    triggerSearch();
                  }}
                  className="bg-brand-red hover:bg-brand-red-dark"
                >
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search Now
                </Button>
              </div>
            ) : isLoading && filteredProperties.length === 0 ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-80"></div>)}
              </div>
            ) : filteredProperties.length > 0 ? (
              <>
                <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredProperties.map(property => (
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
                        listingType={property.listingType}
                        is_premium={property.is_premium}
                        size={viewMode === 'list' ? 'large' : 'default'}
                        rental_status="available"
                        ownerId={property.ownerId}
                        showOwnerActions={true}
                      />
                    ))}
                  </div>
                
                {/* Load More button removed intentionally pending server-side filtered pagination */}
              </>
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

            {/* Removed client-side pagination */}
          </div>
        </div>
      </main>

      {/* Property Tools Section */}
      <PropertyTools />

      <Footer />
    </div>;
};
export default PropertySearch;