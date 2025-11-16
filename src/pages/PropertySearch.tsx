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
import { MapPin, Filter, Grid3X3, List, Bookmark, X, Loader2, Search as SearchIcon, Lock, Unlock, Info, Map, Bell, Home, TrendingUp } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import { useSimplifiedSearch } from '@/hooks/useSimplifiedSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchTrigger } from '@/hooks/useSearchTrigger';
import { AreaUnit } from '@/utils/areaConverter';
import { LandAreaFilter } from '@/components/LandAreaFilter';
import { getCurrentCountryConfig } from '@/services/domainCountryService';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
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
  // Property type category for Residential/Commercial tabs
  const [propertyTypeCategory, setPropertyTypeCategory] = useState<'residential' | 'commercial'>('residential');
  const [isPropertyTypePopoverOpen, setIsPropertyTypePopoverOpen] = useState(false);
  const [isMoreFiltersPopoverOpen, setIsMoreFiltersPopoverOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('Dubai');
  const [showMapView, setShowMapView] = useState<boolean>(false);
  const [showTruCheckFirst, setShowTruCheckFirst] = useState<boolean>(false);
  const [showFloorPlans, setShowFloorPlans] = useState<boolean>(false);
  const [rentFrequency, setRentFrequency] = useState<string>('Yearly');
  const rentFrequencyOptions = ['Yearly', 'Monthly', 'Weekly', 'Daily', 'Any'] as const;
  const [isRentFrequencyPopoverOpen, setIsRentFrequencyPopoverOpen] = useState(false);
  
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

  // Helper: categorize property types into Residential and Commercial
  const getResidentialPropertyTypes = (): string[] => {
    return [
      'APARTMENT',
      'TOWNHOUSE',
      'VILLA COMPOUND',
      'LAND',
      'BUILDING',
      'VILLA',
      'PENTHOUSE',
      'HOTEL APARTMENT',
      'FLOOR'
    ];
  };

  const getCommercialPropertyTypes = (): string[] => {
    return [
      'OFFICE',
      'WAREHOUSE',
      'VILLA',
      'LAND',
      'BUILDING',
      'INDUSTRIAL LAND',
      'SHOWROOM',
      'SHOP',
      'LABOUR CAMP',
      'BULK UNIT',
      'FLOOR',
      'FACTORY',
      'MIXED USE LAND',
      'OTHER COMMERCIAL'
    ];
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
  // Budget dropdown visibility for min/max (search page filter)
  const [showMinMenu, setShowMinMenu] = useState<boolean>(false);
  const [showMaxMenu, setShowMaxMenu] = useState<boolean>(false);
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
            <span>{(() => {
              const countryConfig = getCurrentCountryConfig();
              const currencySymbol = countryConfig.currency === 'AED' ? 'AED' : '₹';
              const validBudget = getValidBudgetValue(uiBudget, activeTab);
              const value = validBudget[0] === 0 ? '0' : validBudget[0] >= 10000000 ? (validBudget[0] / 10000000).toFixed(validBudget[0] % 10000000 === 0 ? 0 : 1) + ' Cr' : (validBudget[0] / 100000).toFixed(validBudget[0] % 100000 === 0 ? 0 : 1) + ' L';
              return `${currencySymbol} ${value}`;
            })()}</span>
            <span>{(() => {
              const countryConfig = getCurrentCountryConfig();
              const currencySymbol = countryConfig.currency === 'AED' ? 'AED' : '₹';
              const validBudget = getValidBudgetValue(uiBudget, activeTab);
              const value = validBudget[1] >= getBudgetSliderMax(activeTab) ? (activeTab === 'rent' ? '5L +' : '5Cr +') : validBudget[1] >= 10000000 ? (validBudget[1] / 10000000).toFixed(validBudget[1] % 10000000 === 0 ? 0 : 1) + ' Cr' : (validBudget[1] / 100000).toFixed(validBudget[1] % 100000 === 0 ? 0 : 1) + ' L';
              return `${currencySymbol} ${value}`;
            })()}</span>
          </div>
          {/* Budget inputs with dropdowns (click to open, close on select) */}
          <div className="space-y-2 mb-3">
            <div className="text-sm font-medium text-gray-700">Enter Budget Range</div>
            <div className="grid grid-cols-2 gap-2 relative">
              {/* Min input + dropdown */}
              <div className="relative">
                <label className="text-xs text-gray-500 mb-1 block">Min Budget</label>
                <input
                  readOnly
                  onClick={() => { setShowMinMenu(prev => !prev); setShowMaxMenu(false); }}
                  value={`AED ${uiBudget[0].toLocaleString()}`}
                  className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 bg-white/70 backdrop-blur-sm cursor-pointer"
                />
                {showMinMenu && (
                  <div className="absolute z-30 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-[#800000]/50 bg-white shadow-lg">
                    {(activeTab === 'rent' ? (() => {
                      const arr: number[] = [];
                      for (let i = 20000; i <= 910000; i += i < 100000 ? 10000 : (i < 500000 ? 25000 : 50000)) arr.push(i);
                      return arr;
                    })() : (() => {
                      const arr: number[] = [];
                      for (let i = 200000; i <= 9000000; i += i < 2000000 ? 100000 : (i < 5000000 ? 250000 : 500000)) arr.push(i);
                      return arr;
                    })()).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          const newMin = val;
                          const maxOptions = activeTab === 'rent'
                            ? [50000, 75000, 100000, 125000, 150000, 175000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1010000]
                            : [400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 9500000, 10000000];
                          const validMax = maxOptions.find(m => m > newMin) || (activeTab === 'rent' ? 1010000 : 10000000);
                          const newMax = uiBudget[1] <= newMin ? validMax : uiBudget[1];
                          setUiBudget([newMin, newMax]);
                          commitBudget([newMin, newMax]);
                          setShowMinMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#800000]/10 transition-colors border-b border-gray-100 last:border-b-0 whitespace-nowrap ${uiBudget[0] === val ? 'bg-[#800000]/20 text-[#800000] font-medium' : 'text-gray-700'}`}
                      >
                        {`AED ${val.toLocaleString()}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Max input + dropdown */}
              <div className="relative">
                <label className="text-xs text-gray-500 mb-1 block">Max Budget</label>
                <input
                  readOnly
                  onClick={() => { setShowMaxMenu(prev => !prev); setShowMinMenu(false); }}
                  value={`AED ${uiBudget[1].toLocaleString()}`}
                  className="w-full h-9 px-3 text-sm rounded-md border border-gray-300 bg-white/70 backdrop-blur-sm cursor-pointer"
                />
                {showMaxMenu && (
                  <div className="absolute z-30 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-[#800000]/50 bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={() => { setUiBudget([uiBudget[0], activeTab === 'rent' ? 1010000 : 10000000]); commitBudget([uiBudget[0], activeTab === 'rent' ? 1010000 : 10000000]); setShowMaxMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-[#800000]/10 transition-colors border-b border-gray-100 whitespace-nowrap ${uiBudget[1] >= (activeTab === 'rent' ? 1010000 : 10000000) ? 'bg-[#800000]/20 text-[#800000] font-medium' : 'text-gray-700'}`}
                    >
                      Any
                    </button>
                    {(activeTab === 'rent'
                      ? [50000, 75000, 100000, 125000, 150000, 175000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1010000]
                      : [400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 9500000, 10000000]
                    ).filter(v => v > uiBudget[0]).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => { setUiBudget([uiBudget[0], val]); commitBudget([uiBudget[0], val]); setShowMaxMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#800000]/10 transition-colors border-b border-gray-100 last:border-b-0 whitespace-nowrap ${uiBudget[1] === val ? 'bg-[#800000]/20 text-[#800000] font-medium' : 'text-gray-700'}`}
                      >
                        {`AED ${val.toLocaleString()}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
        
        {/* Residential/Commercial Tabs */}
        <div className="flex gap-4 mb-4 border-b">
          <button
            type="button"
            onClick={() => setPropertyTypeCategory('residential')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              propertyTypeCategory === 'residential'
                ? theme === 'opaque'
                  ? 'text-gray-900 border-b-2 border-gray-500'
                  : theme === 'green-white'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-[#800000] border-b-2 border-[#800000]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Residential
          </button>
          <button
            type="button"
            onClick={() => setPropertyTypeCategory('commercial')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              propertyTypeCategory === 'commercial'
                ? theme === 'opaque'
                  ? 'text-gray-900 border-b-2 border-gray-500'
                  : theme === 'green-white'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-[#800000] border-b-2 border-[#800000]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Commercial
          </button>
        </div>

        {/* Property Types List */}
        <RadioGroup
          value={filters.propertyType[0] || ''}
          onValueChange={(value) => {
            preserveScroll(() => {
              if (value) {
                updateFilter('propertyType', [value]);
              } else {
                updateFilter('propertyType', []);
              }
            });
          }}
          className="max-h-[50vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-2">
            {(propertyTypeCategory === 'residential' 
              ? getResidentialPropertyTypes()
              : getCommercialPropertyTypes()
            ).map(type => (
              <label
                key={type}
                className="flex items-center gap-2.5 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
              >
                <RadioGroupItem value={type} id={`property-type-${type}`} />
                <span className="capitalize font-medium">{type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </label>
            ))}
          </div>
        </RadioGroup>
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
        const countryConfig = getCurrentCountryConfig();
        const region = countryConfig.code || 'AE';
        const language = countryConfig.language ? `${countryConfig.language}-${region}` : 'en';
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&region=${region}&language=${language}`;
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
      
      const getOptions = () => {
        const countryConfig = getCurrentCountryConfig();
        const countryCode = countryConfig.code.toLowerCase();
        console.log('🌍 Search Results - Autocomplete country restriction:', countryCode, 'for domain:', window.location.hostname);
        return {
          fields: ['formatted_address', 'geometry', 'name', 'address_components'],
          types: ['geocode'],
          componentRestrictions: {
            country: countryCode
          }
        };
      };
      
      const autocomplete = new w.google!.maps!.places!.Autocomplete(locationInputRef.current, getOptions());
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('🔍 Google Places - Place selected:', place);
        
        // Validate country code from address components
        const countryConfig = getCurrentCountryConfig();
        const expectedCountryCode = countryConfig.code.toLowerCase();
        let isValidCountry = false;
        
        if (place?.address_components) {
          const countryComponent = place.address_components.find((comp: GPlaceComponent) =>
            comp.types.includes('country')
          );
          
          if (countryComponent) {
            const selectedCountryCode = countryComponent.short_name.toLowerCase();
            isValidCountry = selectedCountryCode === expectedCountryCode;
            console.log('🌍 Search Results - Country validation:', {
              selected: selectedCountryCode,
              expected: expectedCountryCode,
              isValid: isValidCountry
            });
            
            if (!isValidCountry) {
              console.warn('⛔ Search Results - Country mismatch! Selected:', selectedCountryCode, 'Expected:', expectedCountryCode);
              // Clear the input and show error
              if (locationInputRef.current) locationInputRef.current.value = '';
              updateFilter('location', '');
              setTempLocationText('');
              return;
            }
          }
        }
        
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#800000] focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-white"
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
                  className={`${theme === 'opaque' 
                    ? 'rounded-full text-base font-medium h-full text-gray-900 border border-gray-300 data-[state=active]:bg-gray-300/70 data-[state=active]:border-gray-500 data-[state=active]:ring-1 data-[state=active]:ring-gray-400 data-[state=active]:backdrop-blur-md' 
                    : theme === 'green-white' 
                      ? 'rounded-full text-base font-medium h-full data-[state=active]:bg-green-600 data-[state=active]:text-white' 
                      : 'data-[state=active]:bg-[#800000] data-[state=active]:text-white rounded-full text-base font-medium h-full'}`} 
                  role="tab" 
                  aria-selected={activeTab === 'buy'}
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger 
                  value="rent" 
                  className={`${theme === 'opaque' 
                    ? 'rounded-full text-base font-medium h-full text-gray-900 border border-gray-300 data-[state=active]:bg-gray-300/70 data-[state=active]:border-gray-500 data-[state=active]:ring-1 data-[state=active]:ring-gray-400 data-[state=active]:backdrop-blur-md' 
                    : theme === 'green-white' 
                      ? 'rounded-full text-base font-medium h-full data-[state=active]:bg-green-600 data-[state=active]:text-white' 
                      : 'data-[state=active]:bg-[#800000] data-[state=active]:text-white rounded-full text-base font-medium h-full'}`} 
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

            {/* Main Search Bar - Matching Homepage Style */}
            <div className="flex-1 w-full flex items-center gap-2">
              {/* Search field container - matching homepage */}
              <div 
                className={`relative px-3 py-2 pl-8 pr-3 flex-1 rounded-lg focus-within:ring-2 transition-all duration-200 overflow-visible ${
                  theme === 'opaque'
                    ? 'border-none bg-white backdrop-blur-md focus-within:ring-gray-400/30 hover:bg-gray-50'
                    : 'border border-[#800000]/50 bg-white/80 backdrop-blur-md focus-within:ring-[#800000]/30 focus-within:border-[#800000] focus-within:bg-white/95 hover:bg-white/90 hover:border-[#800000]/70'
                }`} 
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
                {/* Location Row */}
                <div className="relative flex items-center">
                  <MapPin className={`absolute left-0 -ml-5 pointer-events-none flex-shrink-0 ${theme === 'opaque' ? 'text-gray-700' : 'text-[#800000]'}`} size={14} />
                  <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0 relative">
                    {/* Location Chips */}
                    {filters.locations.map((location: string, index: number) => (
                      <div key={index} className="flex items-center gap-1.5 bg-[#800000] text-white px-3 py-1 rounded-full text-sm font-medium shrink-0">
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
                      placeholder="Search locality..."
                      className={`flex-1 min-w-[8rem] outline-none border-none bg-transparent text-sm font-medium ${theme === 'opaque' ? 'placeholder:text-gray-600 text-gray-900' : 'placeholder:text-gray-700 text-gray-900'}`}
                      style={{ appearance: "none" }}
                    />
                    
                    {/* Clear button for location */}
                    {filters.location && filters.locations.length === 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFilter('location', '');
                          setTempLocationText('');
                        }}
                        className="absolute right-0 hover:bg-gray-100 rounded-full p-1 transition-colors"
                      >
                        <X size={14} className="text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Search Button - matching homepage */}
              <button
                type="button"
                className={`inline-flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 focus:outline-none focus:ring-2 ${
                  theme === 'opaque'
                    ? 'bg-gray-200/75 text-gray-800 hover:bg-gray-300/85 border border-gray-300 backdrop-blur-md focus:ring-gray-400/30'
                    : theme === 'green-white'
                      ? 'text-white bg-green-600 hover:bg-green-700 border border-green-600 focus:ring-green-600/30'
                      : 'text-white bg-[#800000] hover:bg-[#700000] border border-[#800000] focus:ring-[#800000]/30'
                }`}
                aria-label="Search"
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
                disabled={filters.locations.length === 0 && !filters.location}
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Actions: Filters + Search (sticky) - HIDDEN: Using top filter bar instead */}
            <div className="hidden w-full lg:hidden flex gap-2 sticky top-[64px] z-30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 py-2">
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
                        <Button className="flex-1 bg-[#800000] hover:bg-[#700000]">Apply</Button>
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

      {/* Top Filter Bar - Quick Filters */}
      {activeTab === 'buy' && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
              {/* All / Ready / Off-Plan buttons */}
              <Button
                variant={filters.construction.length === 0 ? 'default' : 'outline'}
                size="sm"
                className={`text-xs sm:text-sm font-medium flex-shrink-0 ${
                  filters.construction.length === 0
                    ? theme === 'opaque'
                      ? 'bg-gray-300/70 text-gray-900 border-gray-500'
                      : theme === 'green-white'
                        ? 'bg-green-600 text-white'
                        : 'bg-[#800000] text-white'
                    : theme === 'opaque'
                      ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                      : theme === 'green-white'
                        ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                        : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                }`}
                onClick={() => updateFilter('construction', [])}
              >
                All
              </Button>
              <Button
                variant={filters.construction.includes('Ready') && filters.construction.length === 1 ? 'default' : 'outline'}
                size="sm"
                className={`text-xs sm:text-sm font-medium flex-shrink-0 ${
                  filters.construction.includes('Ready') && filters.construction.length === 1
                    ? theme === 'opaque'
                      ? 'bg-gray-300/70 text-gray-900 border-gray-500'
                      : theme === 'green-white'
                        ? 'bg-green-600 text-white'
                        : 'bg-[#800000] text-white'
                    : theme === 'opaque'
                      ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                      : theme === 'green-white'
                        ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                        : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                }`}
                onClick={() => updateFilter('construction', ['Ready'])}
              >
                Ready
              </Button>
              <Button
                variant={filters.construction.includes('Under Construction') && filters.construction.length === 1 ? 'default' : 'outline'}
                size="sm"
                className={`text-xs sm:text-sm font-medium flex-shrink-0 ${
                  filters.construction.includes('Under Construction') && filters.construction.length === 1
                    ? theme === 'opaque'
                      ? 'bg-gray-300/70 text-gray-900 border-gray-500'
                      : theme === 'green-white'
                        ? 'bg-green-600 text-white'
                        : 'bg-[#800000] text-white'
                    : theme === 'opaque'
                      ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                      : theme === 'green-white'
                        ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                        : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                }`}
                onClick={() => updateFilter('construction', ['Under Construction'])}
              >
                Off-Plan
              </Button>

              {/* Property Type Dropdown */}
              <Popover open={isPropertyTypePopoverOpen} onOpenChange={setIsPropertyTypePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-sm font-medium ${
                      theme === 'opaque'
                        ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                        : theme === 'green-white'
                          ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                          : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                    }`}
                  >
                    {filters.propertyType.length > 0 
                      ? filters.propertyType[0].toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                      : 'Property Type'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] sm:w-[550px] p-4">
                  <h4 className="text-base font-semibold mb-4 text-foreground">Select Property Type</h4>
                  
                  {/* Residential/Commercial Tabs */}
                  <div className="flex gap-4 mb-4 border-b">
                    <button
                      type="button"
                      onClick={() => setPropertyTypeCategory('residential')}
                      className={`pb-2 px-1 text-sm font-medium transition-colors ${
                        propertyTypeCategory === 'residential'
                          ? theme === 'opaque'
                            ? 'text-gray-900 border-b-2 border-gray-500'
                            : theme === 'green-white'
                              ? 'text-green-600 border-b-2 border-green-600'
                              : 'text-[#800000] border-b-2 border-[#800000]'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Residential
                    </button>
                    <button
                      type="button"
                      onClick={() => setPropertyTypeCategory('commercial')}
                      className={`pb-2 px-1 text-sm font-medium transition-colors ${
                        propertyTypeCategory === 'commercial'
                          ? theme === 'opaque'
                            ? 'text-gray-900 border-b-2 border-gray-500'
                            : theme === 'green-white'
                              ? 'text-green-600 border-b-2 border-green-600'
                              : 'text-[#800000] border-b-2 border-[#800000]'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Commercial
                    </button>
                  </div>

                  {/* Property Types List */}
                  <RadioGroup
                    value={filters.propertyType[0] || ''}
                    onValueChange={(value) => {
                      if (value) {
                        updateFilter('propertyType', [value]);
                      } else {
                        updateFilter('propertyType', []);
                      }
                    }}
                    className="max-h-[50vh] overflow-y-auto"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {(propertyTypeCategory === 'residential' 
                        ? getResidentialPropertyTypes()
                        : getCommercialPropertyTypes()
                      ).map(type => (
                        <label
                          key={type}
                          className="flex items-center gap-2.5 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                        >
                          <RadioGroupItem value={type} id={`top-property-type-${type}`} />
                          <span className="capitalize font-medium">{type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>

                  {/* Reset and Done Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${
                        theme === 'opaque'
                          ? 'bg-transparent border-gray-300 text-gray-800 hover:bg-gray-100'
                          : theme === 'green-white'
                            ? 'bg-white border-green-600 text-gray-800 hover:bg-gray-50'
                            : 'bg-white border-[#800000] text-gray-800 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        updateFilter('propertyType', []);
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      className={`flex-1 ${
                        theme === 'opaque'
                          ? 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100'
                          : theme === 'green-white'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-[#800000] hover:bg-[#700000] text-white'
                      }`}
                      onClick={() => {
                        setIsPropertyTypePopoverOpen(false);
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Beds & Baths Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-sm font-medium ${
                      theme === 'opaque'
                        ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                        : theme === 'green-white'
                          ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                          : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                    }`}
                  >
                    Beds & Baths
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Bedrooms</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map(bhk => (
                          <Button
                            key={bhk}
                            variant={filters.bhkType.includes(bhk) ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              if (filters.bhkType.includes(bhk)) {
                                updateFilter('bhkType', filters.bhkType.filter(b => b !== bhk));
                              } else {
                                updateFilter('bhkType', [...filters.bhkType, bhk]);
                              }
                            }}
                          >
                            {bhk}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Bathrooms</h4>
                      <div className="flex flex-wrap gap-2">
                        {['1', '2', '3', '4', '5', '6+'].map(bath => (
                          <Button
                            key={bath}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              // Handle bathroom filter - would need to add to filter system
                            }}
                          >
                            {bath}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* More Filters Button */}
              <Popover open={isMoreFiltersPopoverOpen} onOpenChange={setIsMoreFiltersPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-sm font-medium ml-auto ${
                      theme === 'opaque'
                        ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                        : theme === 'green-white'
                          ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                          : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                    }`}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    More Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] sm:w-[550px] p-4" align="end">
                  <div className="space-y-4">
                    {/* Price (AED) Filter */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Price (AED)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={filters.budget[0] || ''}
                            onChange={(e) => {
                              const min = Number(e.target.value) || 0;
                              updateFilter('budget', [min, filters.budget[1]]);
                            }}
                            className="w-full h-9 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                          <Input
                            type="number"
                            placeholder="Any"
                            value={filters.budget[1] === getBudgetSliderMax(activeTab) ? '' : filters.budget[1] || ''}
                            onChange={(e) => {
                              const max = e.target.value === '' ? getBudgetSliderMax(activeTab) : Number(e.target.value) || getBudgetSliderMax(activeTab);
                              updateFilter('budget', [filters.budget[0], max]);
                            }}
                            className="w-full h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Area (sqft) Filter */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Area (sqft)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={filters.landArea[0] || ''}
                            onChange={(e) => {
                              const min = Number(e.target.value) || 0;
                              updateFilter('landArea', [min, filters.landArea[1]]);
                            }}
                            className="w-full h-9 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                          <Input
                            type="number"
                            placeholder="Any"
                            value={filters.landArea[1] === 100000 ? '' : filters.landArea[1] || ''}
                            onChange={(e) => {
                              const max = e.target.value === '' ? 100000 : Number(e.target.value) || 100000;
                              updateFilter('landArea', [filters.landArea[0], max]);
                            }}
                            className="w-full h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Keywords Filter */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Keywords</h4>
                      <Input
                        type="text"
                        placeholder="Add relevant keywords"
                        className="w-full h-9 text-sm"
                        // Would need to add keywords to filter system
                      />
                    </div>

                    {/* Agent or Agency Filter */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Agent or Agency</h4>
                      <Input
                        type="text"
                        placeholder="Select an agent or agency"
                        className="w-full h-9 text-sm"
                        // Would need to add agent/agency to filter system
                      />
                    </div>

                    {/* Developer Filter */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Developer</h4>
                      <Input
                        type="text"
                        placeholder="Select a developer"
                        className="w-full h-9 text-sm"
                        // Would need to add developer to filter system
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-2 border-t">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-sm"
                          onClick={() => {
                            updateFilter('budget', [0, getBudgetSliderMax(activeTab)]);
                            updateFilter('landArea', [0, 100000]);
                            // Reset other filters
                          }}
                        >
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          className={`flex-1 text-sm ${
                            theme === 'opaque'
                              ? 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100'
                              : theme === 'green-white'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-[#800000] hover:bg-[#700000] text-white'
                          }`}
                          onClick={() => setIsMoreFiltersPopoverOpen(false)}
                        >
                          Done
                        </Button>
                      </div>
                      <a
                        href="#"
                        className={`text-xs text-center hover:underline ${
                          theme === 'opaque'
                            ? 'text-gray-700'
                            : theme === 'green-white'
                              ? 'text-green-600'
                              : 'text-[#800000]'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle alert me functionality
                        }}
                      >
                        ALERT ME OF NEW PROPERTIES
                      </a>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      {/* Top Filter Bar - Rent Filters */}
      {activeTab === 'rent' && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
              {/* Yearly Rent Dropdown */}
              <Popover open={isRentFrequencyPopoverOpen} onOpenChange={setIsRentFrequencyPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className={`text-xs sm:text-sm font-medium flex-shrink-0 ${
                      theme === 'opaque'
                        ? 'bg-gray-300/70 text-gray-900 border-gray-500'
                        : theme === 'green-white'
                          ? 'bg-green-600 text-white'
                          : 'bg-[#800000] text-white'
                    }`}
                  >
                    {rentFrequency} Rent
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] sm:w-[260px] p-4">
                  <h4 className="text-base font-semibold mb-3 text-foreground">Payment Frequency</h4>
                  <div className="flex flex-col gap-1.5">
                    {rentFrequencyOptions.map(opt => (
                      <Button
                        key={opt}
                        variant={rentFrequency === opt ? 'default' : 'outline'}
                        size="sm"
                        className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm text-left justify-start"
                        onClick={() => {
                          setRentFrequency(opt);
                          setIsRentFrequencyPopoverOpen(false);
                        }}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Property Type Dropdown */}
              <Popover open={isPropertyTypePopoverOpen} onOpenChange={setIsPropertyTypePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-sm font-medium ${
                      theme === 'opaque'
                        ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                        : theme === 'green-white'
                          ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                          : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                    }`}
                  >
                    {filters.propertyType.length > 0 
                      ? filters.propertyType[0].toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                      : 'Property Type'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] sm:w-[550px] p-4">
                  <h4 className="text-base font-semibold mb-4 text-foreground">Select Property Type</h4>
                  
                  {/* Residential/Commercial Tabs */}
                  <div className="flex gap-4 mb-4 border-b">
                    <button
                      type="button"
                      onClick={() => setPropertyTypeCategory('residential')}
                      className={`pb-2 px-1 text-sm font-medium transition-colors ${
                        propertyTypeCategory === 'residential'
                          ? theme === 'opaque'
                            ? 'text-gray-900 border-b-2 border-gray-500'
                            : theme === 'green-white'
                              ? 'text-green-600 border-b-2 border-green-600'
                              : 'text-[#800000] border-b-2 border-[#800000]'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Residential
                    </button>
                    <button
                      type="button"
                      onClick={() => setPropertyTypeCategory('commercial')}
                      className={`pb-2 px-1 text-sm font-medium transition-colors ${
                        propertyTypeCategory === 'commercial'
                          ? theme === 'opaque'
                            ? 'text-gray-900 border-b-2 border-gray-500'
                            : theme === 'green-white'
                              ? 'text-green-600 border-b-2 border-green-600'
                              : 'text-[#800000] border-b-2 border-[#800000]'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Commercial
                    </button>
                  </div>

                  {/* Property Types List */}
                  <RadioGroup
                    value={filters.propertyType[0] || ''}
                    onValueChange={(value) => {
                      if (value) {
                        updateFilter('propertyType', [value]);
                      } else {
                        updateFilter('propertyType', []);
                      }
                    }}
                    className="max-h-[50vh] overflow-y-auto"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {(propertyTypeCategory === 'residential' 
                        ? getResidentialPropertyTypes()
                        : getCommercialPropertyTypes()
                      ).map(type => (
                        <label
                          key={type}
                          className="flex items-center gap-2.5 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                        >
                          <RadioGroupItem value={type} id={`rent-property-type-${type}`} />
                          <span className="capitalize font-medium">{type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>

                  {/* Reset and Done Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${
                        theme === 'opaque'
                          ? 'bg-transparent border-gray-300 text-gray-800 hover:bg-gray-100'
                          : theme === 'green-white'
                            ? 'bg-white border-green-600 text-gray-800 hover:bg-gray-50'
                            : 'bg-white border-[#800000] text-gray-800 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        updateFilter('propertyType', []);
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      className={`flex-1 ${
                        theme === 'opaque'
                          ? 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100'
                          : theme === 'green-white'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-[#800000] hover:bg-[#700000] text-white'
                      }`}
                      onClick={() => {
                        setIsPropertyTypePopoverOpen(false);
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Beds & Baths Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-sm font-medium ${
                      theme === 'opaque'
                        ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                        : theme === 'green-white'
                          ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                          : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                    }`}
                  >
                    Beds & Baths
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Bedrooms</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map(bhk => (
                          <Button
                            key={bhk}
                            variant={filters.bhkType.includes(bhk) ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              if (filters.bhkType.includes(bhk)) {
                                updateFilter('bhkType', filters.bhkType.filter(b => b !== bhk));
                              } else {
                                updateFilter('bhkType', [...filters.bhkType, bhk]);
                              }
                            }}
                          >
                            {bhk}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Bathrooms</h4>
                      <div className="flex flex-wrap gap-2">
                        {['1', '2', '3', '4', '5', '6+'].map(bath => (
                          <Button
                            key={bath}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              // Handle bathroom filter - would need to add to filter system
                            }}
                          >
                            {bath}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* TruCheck™ listings first */}
              <Button
                variant={showTruCheckFirst ? 'default' : 'outline'}
                size="sm"
                className={`text-sm font-medium ${
                  showTruCheckFirst
                    ? theme === 'opaque'
                      ? 'bg-gray-300/70 text-gray-900 border-gray-500'
                      : theme === 'green-white'
                        ? 'bg-green-600 text-white'
                        : 'bg-[#800000] text-white'
                    : theme === 'opaque'
                      ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                      : theme === 'green-white'
                        ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                        : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                }`}
                onClick={() => setShowTruCheckFirst(!showTruCheckFirst)}
              >
                TruCheck™ listings first
                <Info className="ml-1 h-3 w-3" />
              </Button>

              {/* Properties with floor plans */}
              <Button
                variant={showFloorPlans ? 'default' : 'outline'}
                size="sm"
                className={`text-sm font-medium ${
                  showFloorPlans
                    ? theme === 'opaque'
                      ? 'bg-gray-300/70 text-gray-900 border-gray-500'
                      : theme === 'green-white'
                        ? 'bg-green-600 text-white'
                        : 'bg-[#800000] text-white'
                    : theme === 'opaque'
                      ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                      : theme === 'green-white'
                        ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                        : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                }`}
                onClick={() => setShowFloorPlans(!showFloorPlans)}
              >
                Properties with floor plans
                <Info className="ml-1 h-3 w-3" />
              </Button>

              {/* More Filters Button */}
              <Popover open={isMoreFiltersPopoverOpen} onOpenChange={setIsMoreFiltersPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-sm font-medium ml-auto ${
                      theme === 'opaque'
                        ? 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100'
                        : theme === 'green-white'
                          ? 'bg-white text-gray-600 border-green-600/50 hover:bg-white/90'
                          : 'bg-white text-gray-600 border-[#800000]/50 hover:bg-white/90'
                    }`}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    More Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] sm:w-[550px] p-4" align="end">
                  <div className="space-y-4">
                    {/* Price (AED) Filter */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Price (AED)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={filters.budget[0] || ''}
                            onChange={(e) => {
                              const min = Number(e.target.value) || 0;
                              updateFilter('budget', [min, filters.budget[1]]);
                            }}
                            className="w-full h-9 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                          <Input
                            type="number"
                            placeholder="Any"
                            value={filters.budget[1] === getBudgetSliderMax(activeTab) ? '' : filters.budget[1] || ''}
                            onChange={(e) => {
                              const max = e.target.value === '' ? getBudgetSliderMax(activeTab) : Number(e.target.value) || getBudgetSliderMax(activeTab);
                              updateFilter('budget', [filters.budget[0], max]);
                            }}
                            className="w-full h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Area (sqft) Filter */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Area (sqft)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={filters.landArea[0] || ''}
                            onChange={(e) => {
                              const min = Number(e.target.value) || 0;
                              updateFilter('landArea', [min, filters.landArea[1]]);
                            }}
                            className="w-full h-9 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                          <Input
                            type="number"
                            placeholder="Any"
                            value={filters.landArea[1] === 100000 ? '' : filters.landArea[1] || ''}
                            onChange={(e) => {
                              const max = e.target.value === '' ? 100000 : Number(e.target.value) || 100000;
                              updateFilter('landArea', [filters.landArea[0], max]);
                            }}
                            className="w-full h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Keywords Filter */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Keywords</h4>
                      <Input
                        type="text"
                        placeholder="Add relevant keywords"
                        className="w-full h-9 text-sm"
                        // Would need to add keywords to filter system
                      />
                    </div>

                    {/* Agent or Agency Filter */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Agent or Agency</h4>
                      <Input
                        type="text"
                        placeholder="Select an agent or agency"
                        className="w-full h-9 text-sm"
                        // Would need to add agent/agency to filter system
                      />
                    </div>

                    {/* Developer Filter */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Developer</h4>
                      <Input
                        type="text"
                        placeholder="Select a developer"
                        className="w-full h-9 text-sm"
                        // Would need to add developer to filter system
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-2 border-t">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-sm"
                          onClick={() => {
                            updateFilter('budget', [0, getBudgetSliderMax(activeTab)]);
                            updateFilter('landArea', [0, 100000]);
                            // Reset other filters
                          }}
                        >
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          className={`flex-1 text-sm ${
                            theme === 'opaque'
                              ? 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100'
                              : theme === 'green-white'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-[#800000] hover:bg-[#700000] text-white'
                          }`}
                          onClick={() => setIsMoreFiltersPopoverOpen(false)}
                        >
                          Done
                        </Button>
                      </div>
                      <a
                        href="#"
                        className={`text-xs text-center hover:underline ${
                          theme === 'opaque'
                            ? 'text-gray-700'
                            : theme === 'green-white'
                              ? 'text-green-600'
                              : 'text-[#800000]'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle alert me functionality
                        }}
                      >
                        ALERT ME OF NEW PROPERTIES
                      </a>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      {/* Header dropdowns removed: relying on left sidebar filters */}

      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-2 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Button
                variant={showTruCheckFirst ? 'default' : 'outline'}
                size="sm"
                className={`text-[10px] sm:text-xs flex-shrink-0 ${
                  showTruCheckFirst
                    ? theme === 'opaque'
                      ? 'bg-gray-300/70 text-gray-900 border-gray-500'
                      : theme === 'green-white'
                        ? 'bg-green-600 text-white'
                        : 'bg-[#800000] text-white'
                    : ''
                }`}
                onClick={() => setShowTruCheckFirst(!showTruCheckFirst)}
              >
                <span className="hidden sm:inline">TruCheck™ listings first</span>
                <span className="sm:hidden">TruCheck™</span>
                <Info className="ml-0.5 sm:ml-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
              <Button
                variant={showFloorPlans ? 'default' : 'outline'}
                size="sm"
                className={`text-[10px] sm:text-xs flex-shrink-0 ${
                  showFloorPlans
                    ? theme === 'opaque'
                      ? 'bg-gray-300/70 text-gray-900 border-gray-500'
                      : theme === 'green-white'
                        ? 'bg-green-600 text-white'
                        : 'bg-[#800000] text-white'
                    : ''
                }`}
                onClick={() => setShowFloorPlans(!showFloorPlans)}
              >
                Properties with floor plans
                <Info className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main id="main-content" className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar (sticky on desktop) - HIDDEN: Using top filter bar instead */}
          <div className="hidden w-80">
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
                  {(filters.locations.length > 0 || debouncedLocation) && <span className="ml-2 text-[#800000]">
                      • Real-time results for "{filters.locations.length > 0 ? filters.locations.join(', ') : debouncedLocation}"
                    </span>}
                </p>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <Select value={filters.sortBy} onValueChange={value => updateFilter('sortBy', value)}>
                  <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm" aria-label="Sort properties by">
                    <SelectValue placeholder="Popular" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="area">Area: Large to Small</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* View mode toggles */}
                <div className="flex items-center gap-0.5 sm:gap-1 border rounded-md" role="group" aria-label="View mode">
                  <Button
                    variant={viewMode === 'list' && !showMapView ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm ${
                      viewMode === 'list' && !showMapView
                        ? theme === 'opaque'
                          ? 'bg-gray-300/70 text-gray-900'
                          : theme === 'green-white'
                            ? 'bg-green-600 text-white'
                            : 'bg-[#800000] text-white'
                        : ''
                    }`}
                    aria-pressed={viewMode === 'list' && !showMapView}
                    aria-label="List view"
                    onClick={() => {
                      setViewMode('list');
                      setShowMapView(false);
                    }}
                  >
                    <List className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">List</span>
                  </Button>
                  <Button
                    variant={showMapView ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm ${
                      showMapView
                        ? theme === 'opaque'
                          ? 'bg-gray-300/70 text-gray-900'
                          : theme === 'green-white'
                            ? 'bg-green-600 text-white'
                            : 'bg-[#800000] text-white'
                        : ''
                    }`}
                    aria-pressed={showMapView}
                    aria-label="Map view"
                    onClick={() => {
                      setShowMapView(true);
                      setViewMode('list');
                    }}
                  >
                    <Map className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Map</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Location Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b mt-3 sm:mt-4 -mx-2 sm:mx-0 px-2 sm:px-0">
              {['Dubai', 'Ajman', 'Sharjah'].map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    selectedLocation === location
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="hidden sm:inline">{location} </span>
                  <span className="sm:hidden">{location}</span>
                  <span className="hidden sm:inline">({location === 'Dubai' ? '128,621' : location === 'Ajman' ? '71,729' : '62,417'})</span>
                </button>
              ))}
              <button
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap ml-auto flex-shrink-0"
              >
                <span className="hidden sm:inline">VIEW ALL LOCATIONS</span>
                <span className="sm:hidden">ALL</span>
              </button>
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
                    {(() => {
                      const countryConfig = getCurrentCountryConfig();
                      const currencySymbol = countryConfig.currency === 'AED' ? 'AED' : '₹';
                      const minValue = filters.budget[0] === 0 ? '0' : (filters.budget[0] / 100000).toFixed(0) + 'L';
                      const maxValue = filters.budget[1] >= 10000000 ? (filters.budget[1] / 10000000).toFixed(1) + 'Cr' : (filters.budget[1] / 100000).toFixed(0) + 'L';
                      return `${currencySymbol} ${minValue} - ${currencySymbol} ${maxValue}`;
                    })()}
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
                  
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-[#800000] hover:bg-[#800000]/10">
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
                  className="bg-[#800000] hover:bg-[#700000]"
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
                <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
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

          {/* Right Sidebar */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-[96px] space-y-4">
              {/* Map Widget */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                    <div className="text-center">
                      <Map className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Map View</p>
                    </div>
                    {/* Placeholder map pins */}
                    <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-gray-300 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                  <div className="p-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Find Homes by Drive Time
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sell or Rent Your Property */}
              <Card className={`${
                theme === 'opaque'
                  ? 'bg-gray-200/75 border-gray-300'
                  : theme === 'green-white'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-[#800000]/5 border-[#800000]/20'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${
                      theme === 'opaque'
                        ? 'bg-gray-400 text-gray-900'
                        : theme === 'green-white'
                          ? 'bg-green-600 text-white'
                          : 'bg-[#800000] text-white'
                    }`}>
                      NEW
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Sell or Rent Your Property</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect with a trusted agent to secure the best deal, faster.
                  </p>
                  <Button
                    className={`w-full ${
                      theme === 'opaque'
                        ? 'bg-gray-300/70 text-gray-900 hover:bg-gray-400/80'
                        : theme === 'green-white'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-[#800000] hover:bg-[#700000] text-white'
                    }`}
                    size="sm"
                  >
                    Get Started &gt;
                  </Button>
                </CardContent>
              </Card>

              {/* Alert Me of New Properties */}
              <Button
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Bell className="mr-2 h-4 w-4" />
                ALERT ME OF NEW PROPERTIES
              </Button>

              {/* Recommended Searches */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recommended searches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom'].map((bedroom) => (
                    <a
                      key={bedroom}
                      href="#"
                      className="block text-sm text-gray-600 hover:text-gray-900 py-1"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle search
                      }}
                    >
                      {bedroom} Properties for sale in UAE
                    </a>
                  ))}
                  <a
                    href="#"
                    className="block text-sm text-blue-600 hover:underline py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle view more
                    }}
                  >
                    View More
                  </a>
                </CardContent>
              </Card>

              {/* Invest in Off Plan */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Invest in Off Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a
                    href="#"
                    className="block text-sm text-gray-600 hover:text-gray-900 py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle search
                    }}
                  >
                    Off Plan Properties in UAE
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-gray-600 hover:text-gray-900 py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle search
                    }}
                  >
                    New Projects in UAE
                  </a>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default PropertySearch;
