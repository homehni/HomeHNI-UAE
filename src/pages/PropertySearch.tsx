import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import { MapPin, Filter, Grid3X3, List, Bookmark, X, Loader2, Search as SearchIcon } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import PropertyTools from '@/components/PropertyTools';
import ChatBot from '@/components/ChatBot';
import { useSimplifiedSearch } from '@/hooks/useSimplifiedSearch';
import { useDebounce } from '@/hooks/useDebounce';
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
const PropertySearch = () => {
  // Results view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // Remove client-side pagination; rely on Load More for dataset growth
  const locationInputRef = useRef<HTMLInputElement>(null);
  const [cityBounds, setCityBounds] = useState<LatLngBounds | null>(null);
  
  // Header dropdowns removed; rely on left sidebar filters only

  const {
    filters,
    activeTab,
    setActiveTab,
    filteredProperties,
    updateFilter,
    clearAllFilters,
    availableLocalities,
    isLoading,
    loadMoreProperties,
    hasMore,
    propertyCount
  } = useSimplifiedSearch();

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
        // Restrict Rent -> Property Type to only these
        return ['ALL', 'APARTMENT', 'INDEPENDENT HOUSE', 'VILLA'];
      case 'buy':
        // Restrict Buy -> Property Type to only these three (label change handled in homepage UI)
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
  const [uiArea, setUiArea] = useState<[number, number]>(filters.area);
  const budgetKey = `${filters.budget[0]}-${filters.budget[1]}`;
  const areaKey = `${filters.area[0]}-${filters.area[1]}`;
  useEffect(() => { setUiBudget(filters.budget); }, [budgetKey]);
  useEffect(() => { setUiArea(filters.area); }, [areaKey]);
    
    const commitBudget = (value: [number, number]) => {
      preserveScroll(() => updateFilter('budget', snapBudget(activeTab, value)));
    };
    const commitArea = (value: [number, number]) => {
      preserveScroll(() => updateFilter('area', value));
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

      {/* Area (Sq. Ft.) Filter */}
      <div>
        <h4 className="font-semibold mb-3" id="area-label">Area (Sq. Ft.)</h4>
        <div className="space-y-3">
          <div className="relative">
            <Slider 
              value={uiArea}
              onValueChange={(value) => setUiArea(value as [number, number])}
              onValueCommit={(value) => commitArea(value as [number, number])}
              max={10000} 
              min={0} 
              step={100} 
              className="w-full"
              aria-labelledby="area-label"
              aria-valuemin={0}
              aria-valuemax={10000}
              aria-valuenow={uiArea[1]}
            />
          </div>
          <div className="flex justify-between text-sm font-medium text-foreground">
            <span>{uiArea[0] === 0 ? '0' : uiArea[0].toLocaleString()} sq ft</span>
            <span>{uiArea[1] >= 10000 ? '10,000+ sq ft' : uiArea[1].toLocaleString() + ' sq ft'}</span>
          </div>
          {/* Manual Area Input Fields */}
          <div className="space-y-2 mb-3">
            <div className="text-sm font-medium text-gray-700">Enter Area Range</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="min-area" className="text-xs text-gray-500 mb-1 block">Min Area (sq ft)</label>
                <Input 
                  id="min-area"
                  type="number" 
                  placeholder="Min area" 
                  value={uiArea[0].toString()} 
                  onChange={e => {
                    const value = parseInt(e.target.value) || 0;
                    if (value <= uiArea[1]) setUiArea([value, uiArea[1]]);
                  }} 
                  onBlur={() => commitArea(uiArea)}
                  onKeyDown={e => { if (e.key === 'Enter') commitArea(uiArea); }}
                  className="h-8 text-sm"
                  aria-label="Minimum area in square feet"
                />
              </div>
              <div>
                <label htmlFor="max-area" className="text-xs text-gray-500 mb-1 block">Max Area (sq ft)</label>
                <Input 
                  id="max-area"
                  type="number" 
                  placeholder="Max area" 
                  value={uiArea[1].toString()} 
                  onChange={e => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= uiArea[0]) setUiArea([uiArea[0], Math.min(value, 20000)]);
                  }} 
                  onBlur={() => commitArea(uiArea)}
                  onKeyDown={e => { if (e.key === 'Enter') commitArea(uiArea); }}
                  className="h-8 text-sm"
                  aria-label="Maximum area in square feet"
                />
              </div>
            </div>
          </div>
          {/* Quick Area Range Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <Button variant={uiArea[0] === 0 && uiArea[1] === 500 ? "default" : "outline"} size="sm" onClick={() => { setUiArea([0, 500]); commitArea([0, 500]); }} className="text-xs h-8">
              Under 500
            </Button>
            <Button variant={uiArea[0] === 0 && uiArea[1] === 1000 ? "default" : "outline"} size="sm" onClick={() => { setUiArea([0, 1000]); commitArea([0, 1000]); }} className="text-xs h-8">
              Under 1K
            </Button>
            <Button variant={uiArea[0] === 0 && uiArea[1] === 2000 ? "default" : "outline"} size="sm" onClick={() => { setUiArea([0, 2000]); commitArea([0, 2000]); }} className="text-xs h-8">
              Under 2K
            </Button>
            <Button variant={uiArea[0] === 1000 && uiArea[1] === 2000 ? "default" : "outline"} size="sm" onClick={() => { setUiArea([1000, 2000]); commitArea([1000, 2000]); }} className="text-xs h-8">
              1K-2K
            </Button>
            <Button variant={uiArea[0] === 2000 && uiArea[1] === 3000 ? "default" : "outline"} size="sm" onClick={() => { setUiArea([2000, 3000]); commitArea([2000, 3000]); }} className="text-xs h-8">
              2K-3K
            </Button>
            <Button variant={uiArea[0] === 3000 && uiArea[1] === 5000 ? "default" : "outline"} size="sm" onClick={() => { setUiArea([3000, 5000]); commitArea([3000, 5000]); }} className="text-xs h-8">
              3K-5K
            </Button>
            <Button variant={uiArea[0] === 5000 && uiArea[1] === 10000 ? "default" : "outline"} size="sm" onClick={() => { setUiArea([5000, 10000]); commitArea([5000, 10000]); }} className="text-xs h-8">
              5K-10K
            </Button>
            <Button variant={uiArea[0] === 10000 && uiArea[1] === 20000 ? "default" : "outline"} size="sm" onClick={() => { setUiArea([10000, 20000]); commitArea([10000, 20000]); }} className="text-xs h-8">
              10K+
            </Button>
          </div>
        </div>
      </div>

      <Separator />

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
              <button
                onClick={() => {
                  preserveScroll(() => {
                    if (type === 'ALL') {
                      updateFilter('propertyType', []);
                    } else {
                      updateFilter('propertyType', [type]);
                    }
                  });
                }}
                className={`w-full text-left px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  (filters.propertyType.length === 0 && type === 'ALL') ||
                  (filters.propertyType.length > 0 && filters.propertyType[0] === type)
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-muted/60 hover:bg-muted/80 text-foreground'
                }`}
              >
                {type}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Commercial-only: Floor filter (moved up for visibility) */}
      {activeTab === 'commercial' && (
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
      )}

      {/* Commercial-only: Parking filter (moved up for visibility) */}
      {activeTab === 'commercial' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Parking</h4>
            {filters.parking && filters.parking.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => updateFilter('parking', [])} className="h-6 text-xs">Clear</Button>
            )}
          </div>
          <div className="space-y-2">
            {parkingOptions.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`parking-${option}`}
                  checked={(filters.parking || []).includes(option)}
                  onCheckedChange={checked => {
                    preserveScroll(() => {
                      const current = filters.parking || [];
                      if (checked) {
                        updateFilter('parking', [...current, option]);
                      } else {
                        updateFilter('parking', current.filter((p: string) => p !== option));
                      }
                    });
                  }}
                />
                <label htmlFor={`parking-${option}`} className="text-sm text-gray-700 cursor-pointer">{option}</label>
              </div>
            ))}
          </div>
        </div>
      )}

  {/* BHK Filter (hide for land and commercial) */}
  {activeTab !== 'land' && activeTab !== 'commercial' && (<div>
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
      </div>)}

      <Separator />

  {/* Property Status (hide for land and commercial) */}
  {activeTab !== 'land' && activeTab !== 'commercial' && (<div>
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
      </div>)}

      <Separator />

  {/* Furnishing (not relevant for land; also show for commercial) */}
  {activeTab !== 'land' && (<div>
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
      </div>)}

      <Separator />

  {/* Age of Property (hide for land and commercial) */}
  {activeTab !== 'land' && activeTab !== 'commercial' && (<div>
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
      if (!w.google?.maps?.places || !locationInputRef.current) return;
      
      const getOptions = () => ({
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        types: ['geocode'],
        componentRestrictions: {
          country: 'in' as const
        },
        ...(cityBounds && filters.selectedCity && { 
          bounds: cityBounds, 
          strictBounds: true
        })
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
          
          // Enforce same-city rule: once first city is selected, next selections must be from same city
          const canAddInCity = () => {
            if (!filters.selectedCity) {
              console.log('✅ No city selected yet, allowing');
              return true;
            }
            if (!cityName) {
              console.warn('⚠️ No city detected in selection');
              return false; // Block if we can't detect city after first selection
            }
            const matches = cityName.toLowerCase() === filters.selectedCity.toLowerCase();
            console.log(`🔍 City match check: "${cityName}" === "${filters.selectedCity}" = ${matches}`);
            return matches;
          };

          // Normalize the location for better search matching
          const normalizedLocation = normalizeLocation(locationValue);
          
          // Auto-add location if under limit and city matches (if selectedCity set)
          if (filters.locations.length < 3 && !filters.locations.includes(normalizedLocation) && canAddInCity()) {
            console.log('✅ Google Places - Adding location:', normalizedLocation);
            updateFilter('locations', [...filters.locations, normalizedLocation]);
            
            // Set selected city and bounds from first selection
            if (!filters.selectedCity && cityName) {
              updateFilter('selectedCity', cityName);
              // Geocode the city to get proper city-level bounds
              const geocoder = new w.google!.maps!.Geocoder();
              geocoder.geocode(
                { 
                  address: `${cityName}, India`,
                  componentRestrictions: { country: 'IN' }
                },
                (results, status) => {
                  if (status === 'OK' && results && results[0]?.geometry?.viewport) {
                    console.log('🗺️ Geocoded city bounds for:', cityName, results[0].geometry.viewport);
                    setCityBounds(results[0].geometry.viewport);
                  } else {
                    // Fallback to place geometry if geocoding fails
                    if (place?.geometry?.viewport) {
                      setCityBounds(place.geometry.viewport);
                    } else if (place?.geometry?.location) {
                      const loc = place.geometry.location;
                      const bounds = new w.google!.maps!.LatLngBounds();
                      const offset = 0.2; // ~22km for city-level coverage
                      bounds.extend(new w.google!.maps!.LatLng(loc.lat() - offset, loc.lng() - offset));
                      bounds.extend(new w.google!.maps!.LatLng(loc.lat() + offset, loc.lng() + offset));
                      setCityBounds(bounds);
                    }
                  }
                }
              );
            }
            
            updateFilter('location', '');
            // Clear the input field after Google Maps updates it
            setTimeout(() => {
              if (locationInputRef.current) {
                locationInputRef.current.value = '';
                updateFilter('location', '');
              }
            }, 100);
          } else if (!canAddInCity()) {
            console.warn('⚠️ Location must be within selected city:', filters.selectedCity);
            alert(`Please select a locality within ${filters.selectedCity} only. Other cities are not allowed.`);
            updateFilter('location', '');
            if (locationInputRef.current) {
              locationInputRef.current.value = '';
            }
          } else {
            console.log('⚠️ Google Places - Location exists or limit reached');
            updateFilter('location', normalizedLocation);
          }
        }
      });
    };
    
    loadGoogleMaps().then(initAutocomplete).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty dependency array for initial load only

  // Reinitialize autocomplete when city bounds change to apply strict bounds
  useEffect(() => {
    if (!cityBounds || !filters.selectedCity) return;
    
    const w = window as WindowWithGoogle;
    if (!w.google?.maps?.places || !locationInputRef.current) return;
    
    console.log('🔄 Reinitializing autocomplete with city bounds for:', filters.selectedCity);
    
    // Recreate autocomplete with strict bounds
    const options = {
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      types: ['geocode'],
      componentRestrictions: {
        country: 'in' as const
      },
      bounds: cityBounds,
      strictBounds: true
    };
    
    const ac = new w.google!.maps!.places!.Autocomplete(locationInputRef.current, options);
    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      console.log('🔍 Google Places (Bounded) - Place selected:', place);
      
      let locationValue = place?.formatted_address || place?.name || '';
      let cityName = '';
      
      if (locationValue && place?.address_components) {
        const addressComponents = place.address_components;
        const localityComponent = addressComponents.find((comp: GPlaceComponent) =>
          comp.types.includes('sublocality_level_1') ||
          comp.types.includes('sublocality') ||
          comp.types.includes('locality') ||
          comp.types.includes('neighborhood')
        );
        
        const cityComponent = addressComponents.find((comp: GPlaceComponent) =>
          comp.types.includes('locality')
        ) || addressComponents.find((comp: GPlaceComponent) =>
          comp.types.includes('administrative_area_level_2')
        );
        
        if (cityComponent) {
          cityName = cityComponent.long_name;
        }
        
        if (localityComponent) {
          locationValue = localityComponent.long_name;
        } else {
          const firstPart = locationValue.split(',')[0].trim();
          if (firstPart) {
            locationValue = firstPart;
          }
        }
      }
      
      if (locationValue) {
        const canAddInCity = () => {
          if (!filters.selectedCity) return true;
          if (!cityName) return false;
          return cityName.toLowerCase() === filters.selectedCity.toLowerCase();
        };

        const normalizedLocation = normalizeLocation(locationValue);
        
        if (filters.locations.length < 3 && !filters.locations.includes(normalizedLocation) && canAddInCity()) {
          updateFilter('locations', [...filters.locations, normalizedLocation]);
          updateFilter('location', '');
          setTimeout(() => {
            if (locationInputRef.current) {
              locationInputRef.current.value = '';
              updateFilter('location', '');
            }
          }, 100);
        } else if (!canAddInCity()) {
          alert(`Please select a locality within ${filters.selectedCity} only. Other cities are not allowed.`);
          updateFilter('location', '');
          if (locationInputRef.current) {
            locationInputRef.current.value = '';
          }
        } else {
          updateFilter('location', normalizedLocation);
        }
      }
    });
  }, [cityBounds, filters.selectedCity, filters.locations, normalizeLocation, updateFilter]);
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
            {/* Search Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="grid w-full lg:w-auto grid-cols-4 bg-gray-100" role="tablist" aria-label="Property listing type">
                <TabsTrigger value="buy" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'buy'}>Buy</TabsTrigger>
                <TabsTrigger value="rent" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'rent'}>Rent</TabsTrigger>
                <TabsTrigger value="commercial" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'commercial'}>Commercial</TabsTrigger>
                <TabsTrigger value="land" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'land'}>Land/Plot</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Main Search Bar with Multi-Location Support */}
            <div className="flex-1 w-full">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-red z-10 pointer-events-none" size={18} />
                
                {/* Multi-Location Search Bar */}
                <div 
                  className="relative flex flex-wrap items-center gap-2 px-4 py-2 pl-12 pr-14 min-h-12 border border-brand-red/40 rounded-full bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand-red/30 focus-within:border-brand-red/60 transition"
                  onClick={() => {
                    if (locationInputRef.current && filters.locations.length < 3) {
                      locationInputRef.current.focus();
                    }
                  }}
                >
                  {/* Location Chips */}
                  {filters.locations.map((location: string, index: number) => (
                    <div key={index} className="flex items-center gap-1 bg-brand-red text-white px-3 py-1.5 rounded-full text-sm font-medium">
                      <span className="truncate max-w-32">{location}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newLocations = filters.locations.filter((_: string, i: number) => i !== index);
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
                    onFocus={e => e.target.select()}
                    placeholder={filters.locations.length === 0 ? "Search locality..." : filters.locations.length >= 3 ? "Max 3 locations" : "Add more..."}
                    className="flex-1 min-w-32 outline-none bg-transparent text-sm placeholder:text-gray-400"
                    disabled={filters.locations.length >= 3}
                  />
                  {/* Search Icon Button inside field (all breakpoints) */}
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-full text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-brand-red/40 absolute right-2 top-1/2 -translate-y-1/2"
                    aria-label="Add location"
                    onClick={() => {
                      const typed = (filters.location || '').trim();
                      if (typed && filters.selectedCity && filters.locations.length < 3 && !filters.locations.includes(typed)) {
                        updateFilter('locations', [...filters.locations, typed]);
                        updateFilter('location', '');
                        setTimeout(() => {
                          locationInputRef.current?.focus();
                        }, 0);
                      }
                    }}
                  >
                    <SearchIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Location Counter */}
                  {filters.locations.length >= 3 && (
                    <span className="text-gray-500 text-sm whitespace-nowrap">Max 3</span>
                  )}
                </div>
                
                {/* Clear All Locations Button (placed below the field to avoid overlap) */}
                {filters.locations.length > 0 && (
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        updateFilter('locations', []);
                        updateFilter('location', '');
                        updateFilter('selectedCity', '');
                      }} 
                      className="h-6 w-6 p-0 hover:bg-brand-red/10"
                    >
                      <X size={14} />
                    </Button>
                  </div>
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
                    <div id="filters-scroll-mobile" className="h-[60vh] pr-2 overflow-y-auto">
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
              <CardContent className="pr-2">
                <div id="filters-scroll-desktop" className="space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
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
                
                <Button variant="ghost" size="sm" aria-label="Save current search criteria" className="hidden sm:inline-flex">
                  <Bookmark size={16} className="mr-1" aria-hidden="true" />
                  Save Search
                </Button>

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

                {/* Area filter badge */}
                {filters.areaDirty && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.area[0]} - {filters.area[1] >= 10000 ? '10000+' : filters.area[1]} sq ft
                    <button onClick={() => updateFilter('area', [0, 10000])} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
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

            {/* Properties Grid/List - Real-time results */}
            {isLoading && filteredProperties.length === 0 ? <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-80"></div>)}
              </div> : filteredProperties.length > 0 ? <>
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
                        size={viewMode === 'list' ? 'large' : 'default'}
                        rental_status="available"
                      />
                    ))}
                  </div>
                
                {/* Load More Button - Better performance than pagination for large datasets */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button 
                      onClick={loadMoreProperties}
                      disabled={isLoading}
                      size="lg"
                      className="min-w-48"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>Load More Properties ({Math.max(propertyCount - filteredProperties.length, 0)} remaining)</>
                      )}
                    </Button>
                  </div>
                )}
              </> : <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search criteria or location
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>}

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