import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, X, ChevronRight, Search as SearchIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCMSContent } from '@/hooks/useCMSContent';
import './search-input.css';
export interface SearchSectionRef {
  focusSearchInput: () => void;
}
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
const SearchSection = forwardRef<SearchSectionRef>((_, ref) => {
  // Feature flags for merging Commercial & Land/Plot into Buy/Rent tabs
  const MERGE_COMM_LAND_IN_BUY_RENT = true; // Keep true for new behavior
  const SHOW_LEGACY_COMMERCIAL_LAND_TABS = false; // Set to false to hide old tabs
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cityBounds, setCityBounds] = useState<LatLngBounds | null>(null);
  // Dropdown filter UI state (UI-only for homepage)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState<string[]>([]);
  // Rent-specific availability selections
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedFurnishing, setSelectedFurnishing] = useState<string[]>([]);
  // Budget defaults to full range based on the active tab (5Cr for buy/commercial/land, 5L for rent)
  const [budget, setBudget] = useState<[number, number]>([0, getBudgetSliderMaxHome('buy')]);

  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileAcInitRef = useRef(false);
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { content: cmsContent } = useCMSContent('hero-search');

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside (mobile overlay only) or pressing Escape
  useEffect(() => {
    if (!isMobileOverlayOpen) return;
    
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const insideMobile = mobileSearchContainerRef.current?.contains(target);
      if (!insideMobile) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
  document.addEventListener('touchstart', handlePointerDown as EventListener, { passive: true } as AddEventListenerOptions);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
  document.removeEventListener('touchstart', handlePointerDown as EventListener);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOverlayOpen]);

  const addLocation = (location: string) => {
    const trimmed = location.trim();
    if (!trimmed) return;
    // Allow any location to be added
    // Only allow one location - replace any existing one
    setSelectedLocations([trimmed]);
    setSearchQuery('');
  };

  const removeLocation = (location: string) => {
    const updated = selectedLocations.filter(loc => loc !== location);
    setSelectedLocations(updated);
    if (updated.length === 0) {
      setSelectedCity('');
      setCityBounds(null);
    }
  };

  const handleSearch = () => {
    const hasLocality = searchQuery.trim().length > 0 || selectedLocations.length > 0;
    if (!hasLocality) {
      return; // Block search until a city/locality is provided
    }
    // Allow search with any location
    if (searchQuery.trim()) {
      // Only one location allowed - use the text input directly
      navigateToSearch([searchQuery.trim()]);
      return;
    }
    navigateToSearch(selectedLocations);
  };

  const navigateToSearch = (locations: string[]) => {
    const params = new URLSearchParams();
    params.set('type', activeTab);
    params.set('locations', locations.join(','));
  if (selectedCity) params.set('city', selectedCity);

    // Property types (map homepage labels to tokens used by search)
    if (selectedPropertyTypes.length > 0) {
      const tokens = selectedPropertyTypes.map(mapPropertyTypeLabelToToken);
      params.set('propertyTypes', tokens.join(','));
    }

    // Bedrooms only for Buy/Rent (not for land or commercial)
    if ((activeTab === 'buy' || activeTab === 'rent') && selectedBedrooms.length > 0) {
      const bhkValues = mapBhkSelectionsToFilters(selectedBedrooms);
      params.set('bhk', bhkValues.join(','));
    }

    // Availability/Construction handling per tab (not for land)
    if (activeTab !== 'land') {
      if (activeTab === 'rent') {
        // For RENT, use dedicated Availability values and do NOT set construction
        if (selectedAvailability.length > 0) {
          params.set('availability', selectedAvailability.join(','));
        }
      } else {
        // For BUY/COMMERCIAL, map Property Status selections
        const availabilityVals = selectedConstructionStatus
          .map(mapStatusToAvailability)
          .filter(Boolean) as string[];
        if (availabilityVals.length > 0) params.set('availability', availabilityVals.join(','));
        const constructionVals = selectedConstructionStatus
          .map(mapStatusToConstruction)
          .filter(Boolean) as string[];
        if (constructionVals.length > 0) params.set('construction', constructionVals.join(','));
      }
    }

    // Budget
    if (budget[0] > 0) params.set('budgetMin', String(budget[0]));
    if (budget[1] < getBudgetSliderMaxHome(activeTab)) params.set('budgetMax', String(budget[1]));

    // Furnishing -> furnished filter
    if (selectedFurnishing.length > 0) {
      const furnishedTokens = selectedFurnishing.map(mapFurnishingLabelToFilter);
      params.set('furnished', furnishedTokens.join(','));
    }

    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Allow any location to be added with Enter key
      if (searchQuery.trim() && selectedLocations.length === 0) {
        addLocation(searchQuery);
      } else {
        handleSearch();
      }
    }
  };
  const navigationTabs = [
    { id: 'buy', label: 'BUY' },
    { id: 'rent', label: 'RENT' },
    // Keep legacy tabs visible until approved to remove
    ...(SHOW_LEGACY_COMMERCIAL_LAND_TABS
      ? [
          { id: 'commercial', label: 'COMMERCIAL' },
          { id: 'land', label: 'LAND/PLOT' },
        ]
      : []),
  ];

  // When switching tabs, reset budget to the full default range for that tab
  useEffect(() => {
    setBudget([0, getBudgetSliderMaxHome(activeTab)]);
  }, [activeTab]);
  useEffect(() => {
    const apiKey = 'AIzaSyD2rlXeHN4cm0CQD-y4YGTsob9a_27YcwY';
    const loadGoogleMaps = () => new Promise<void>((resolve, reject) => {
      const w = window as WindowWithGoogle;
      if (w.google?.maps?.places) {
        resolve();
        return;
      }
      const existing = document.querySelector('script[data-gmaps]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&region=IN&language=en-IN`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-gmaps', 'true');
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps failed to load'));
      document.head.appendChild(script);
    });
    const initAutocomplete = () => {
      const w = window as WindowWithGoogle;
      if (!w.google?.maps?.places) return;
      
      let autocompleteInstance: GAutocomplete | null = null;
      
      const getOptions = () => ({
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        types: ['geocode'],
        componentRestrictions: {
          country: 'in' as const
        },
        ...(cityBounds && selectedCity && { 
          bounds: cityBounds, 
          strictBounds: true,
          // Add city restriction hint
        })
      });
      const inputs = [inputRef.current].filter(Boolean) as HTMLInputElement[];
      inputs.forEach(el => {
        const ac = new w.google!.maps!.places!.Autocomplete(el, getOptions());
        autocompleteInstance = ac;
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          console.log('🔍 Google Places - Place selected:', place);
          
          let value = place?.formatted_address || place?.name || '';
          console.log('🔍 Google Places - Initial value:', value);
          
          // Try to extract city from address components
          let cityName = '';
          // Extract only locality name from formatted address since city is already selected
          if (value && place?.address_components) {
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
            if (selectedCity && addressComponents) {
              const hasMatchingCity = addressComponents.some((comp: GPlaceComponent) =>
                comp.long_name.toLowerCase() === selectedCity.toLowerCase() ||
                comp.short_name.toLowerCase() === selectedCity.toLowerCase()
              );
              
              if (!hasMatchingCity) {
                console.warn('⛔ City mismatch detected in address components');
                console.log('Selected city:', selectedCity);
                console.log('Address components:', addressComponents.map((c: GPlaceComponent) => c.long_name));
                // Override cityName to force rejection
                cityName = addressComponents.find((comp: GPlaceComponent) =>
                  comp.types.includes('locality')
                )?.long_name || 'Unknown';
              }
            }
            
            // Use the most specific locality name available
            if (localityComponent) {
              value = localityComponent.long_name;
              console.log('🔍 Google Places - Using locality component:', value);
            } else {
              // Fallback: extract the first part of the formatted address before the first comma
              const firstPart = value.split(',')[0].trim();
              if (firstPart) {
                value = firstPart;
                console.log('🔍 Google Places - Using first part:', value);
              }
            }
          }
          
          if (el && value) {
            console.log('🔍 Google Places - Current selectedLocations:', selectedLocations.length);
            console.log('🔍 Google Places - Selected city:', selectedCity);
            console.log('🔍 Google Places - Detected city:', cityName);
            console.log('🔍 Google Places - Full formatted_address:', place?.formatted_address);
            
            // Enforce same-city rule: once first city is selected, next selections must be from same city
            // Always allow any city
            const canAddInCity = () => true;

            // Replace existing location with new one if city matches
            if (canAddInCity()) {
              console.log('✅ Google Places - Setting location:', value);
              setSelectedLocations([value]);
              // Set selected city and bounds from first selection
              if (!selectedCity && cityName) {
                setSelectedCity(cityName);
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
              el.value = '';
              setSearchQuery('');
            // All locations are now allowed
            } else {
              console.log('⚠️ Google Places - Location exists or limit reached');
              el.value = value;
              setSearchQuery(value);
            }
          }
        });
      });
    };
    loadGoogleMaps().then(initAutocomplete).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty dependency array for initial load only

  // Reinitialize autocomplete when city bounds change to apply strict bounds
  useEffect(() => {
    if (!cityBounds || !selectedCity) return;
    
    const w = window as WindowWithGoogle;
    if (!w.google?.maps?.places || !inputRef.current) return;
    
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
    
    const ac = new w.google!.maps!.places!.Autocomplete(inputRef.current, options);
    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      console.log('🔍 Google Places (Bounded) - Place selected:', place);
      
      let value = place?.formatted_address || place?.name || '';
      let cityName = '';
      
      if (value && place?.address_components) {
        const addressComponents = place.address_components;
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
        }
        
        if (localityComponent) {
          value = localityComponent.long_name;
        } else {
          const firstPart = value.split(',')[0].trim();
          if (firstPart) value = firstPart;
        }
      }
      
      if (value) {
        // Always allow any city
        const canAddInCity = () => true;
        
        if (canAddInCity()) {
          setSelectedLocations([value]);
          if (inputRef.current) inputRef.current.value = '';
          setSearchQuery('');
        // All locations are now allowed
        } else {
          if (inputRef.current) inputRef.current.value = value;
          setSearchQuery(value);
        }
      }
    });
    
    console.log('🔄 Autocomplete reinitialized with strict bounds for:', selectedCity);
  }, [cityBounds, selectedCity, selectedLocations]);

  // Initialize Google Places for mobile overlay input when overlay opens
  useEffect(() => {
    if (!isMobileOverlayOpen) return;
    const w = window as WindowWithGoogle;
    if (!mobileInputRef.current) return;
    if (!w.google?.maps?.places) return;

    // Allow reinit only if cityBounds changed (not on first init)
    const shouldReinit = cityBounds && selectedCity;
    if (mobileAcInitRef.current && !shouldReinit) return;

    const options = {
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      types: ['geocode'],
      componentRestrictions: { country: 'in' as const },
      ...(cityBounds && selectedCity && { 
        bounds: cityBounds, 
        strictBounds: true 
      })
    };
    
    console.log('🔄 Mobile autocomplete initializing with options:', shouldReinit ? 'STRICT BOUNDS' : 'INITIAL');
    
    const ac = new w.google!.maps!.places!.Autocomplete(mobileInputRef.current, options);
    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      let value = place?.formatted_address || place?.name || '';
      let cityName = '';
      if (value && place?.address_components) {
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
        if (cityComponent) cityName = cityComponent.long_name;
        
        // Additional validation: check if any address component matches selected city
        if (selectedCity && addressComponents) {
          const hasMatchingCity = addressComponents.some((comp: GPlaceComponent) =>
            comp.long_name.toLowerCase() === selectedCity.toLowerCase() ||
            comp.short_name.toLowerCase() === selectedCity.toLowerCase()
          );
          
          if (!hasMatchingCity) {
            cityName = addressComponents.find((comp: GPlaceComponent) =>
              comp.types.includes('locality')
            )?.long_name || 'Unknown';
          }
        }
        
        if (localityComponent) {
          value = localityComponent.long_name;
        } else {
          const firstPart = value.split(',')[0].trim();
          if (firstPart) value = firstPart;
        }
      }

      if (value) {
        // Always allow any city
        const canAddInCity = () => true;
        if (canAddInCity()) {
          setSelectedLocations([value]);
          if (!selectedCity && cityName) {
            setSelectedCity(cityName);
            // Geocode the city to get proper city-level bounds
            const geocoder = new (window as WindowWithGoogle).google!.maps!.Geocoder();
            geocoder.geocode(
              { 
                address: `${cityName}, India`,
                componentRestrictions: { country: 'IN' }
              },
              (results, status) => {
                if (status === 'OK' && results && results[0]?.geometry?.viewport) {
                  console.log('🗺️ Mobile - Geocoded city bounds for:', cityName, results[0].geometry.viewport);
                  setCityBounds(results[0].geometry.viewport);
                } else {
                  // Fallback to place geometry if geocoding fails
                  if (place?.geometry?.viewport) {
                    setCityBounds(place.geometry.viewport);
                  } else if (place?.geometry?.location) {
                    const loc = place.geometry.location;
                    const bounds = new (window as WindowWithGoogle).google!.maps!.LatLngBounds();
                    const offset = 0.2; // ~22km for city-level coverage
                    bounds.extend(new (window as WindowWithGoogle).google!.maps!.LatLng(loc.lat() - offset, loc.lng() - offset));
                    bounds.extend(new (window as WindowWithGoogle).google!.maps!.LatLng(loc.lat() + offset, loc.lng() + offset));
                    setCityBounds(bounds);
                  }
                }
              }
            );
          }
          setSearchQuery('');
        } else {
          setSearchQuery(value);
        }
      }
    });
    mobileAcInitRef.current = true;
    // Focus after a tick to ensure keyboard opens
    setTimeout(() => mobileInputRef.current?.focus(), 50);
  }, [isMobileOverlayOpen, selectedCity, selectedLocations, cityBounds]);

  // Handle click outside to hide mobile city selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(event.target as Node)) {
        // Mobile search container click handling
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    focusSearchInput: () => {
      // Detect if mobile view (screen width < 768px)
      const isMobile = window.innerWidth < 768;
      const targetInput = isMobile ? mobileInputRef.current : inputRef.current;
      if (targetInput) {
        setTimeout(() => {
          targetInput.focus();
          // If there's already a selected location, position cursor at the end
          if (selectedLocations.length > 0) {
            targetInput.setSelectionRange(selectedLocations[0].length, selectedLocations[0].length);
          }
        }, 300); // Small delay to ensure scroll completes
      }
    }
  }));
  return <section id="hero-search" className="relative">
      {/* Click outside to close open dropdowns */}
      {openDropdown && (
        <div className="fixed inset-0 z-40" onMouseDown={() => setOpenDropdown(null)} />
      )}
      {/* Hero Image Background - mobile responsive */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] bg-cover bg-no-repeat md:-mt-[70px] md:pt-[40px]" style={{
      backgroundImage: `url(${cmsContent?.content?.heroImage || '/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png'})`,
      backgroundPosition: 'center calc(50% + 10%)'
    }}>
    {/* Mobile Search Section - opens full-screen overlay */}
  <div className="sm:hidden absolute bottom-4 left-2 right-2 transform translate-y-1/2 z-50" ref={mobileSearchContainerRef}>
          <div className="bg-white rounded-lg shadow-xl border border-gray-100">
            {/* Tabs - Mobile */}
            <div className="flex border-b border-gray-200">
              {navigationTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'text-brand-red'
                      : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
                  )}
                </button>
              ))}
            </div>

            {/* Search Content */}
            <div className="p-3">
              {/* Selected Location Tags */}
              {selectedLocations.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedLocations.map((location, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1 bg-brand-red text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {location}
                      <button
                        onClick={() => removeLocation(location)}
                        className="ml-1 hover:bg-brand-red-dark rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tap-to-open full-screen search */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileOverlayOpen(true);
                  setTimeout(() => mobileInputRef.current?.focus(), 100);
                }}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-500"
              >
                <span className="text-sm truncate">
                  {selectedLocations.length > 0 ? 'Location already selected' : selectedCity ? `Add locality in ${selectedCity}` : 'Add Locality/Project/Landmark'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-brand-red">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              {/* Mobile: Collapsible Filter Buttons */}
              <div className="mt-3 overflow-x-auto -mx-1 px-1">
                <div className="flex gap-2 min-w-max">
                  {/* Property type: Property Type or Land Type */}
                  {activeTab !== 'commercial' && (
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setOpenDropdown('propertyType'); setIsMobileOverlayOpen(true); }}
                        className={`h-9 text-xs flex items-center gap-1`}
                      >
                        {activeTab === 'land' ? 'Land Type' : 'Property Type'} <ChevronRight size={14} />
                      </Button>
                    </div>
                  )}

                  {/* Bedroom (only for Buy/Rent) */}
                  {(activeTab === 'buy' || activeTab === 'rent') && (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setOpenDropdown('bedroom'); setIsMobileOverlayOpen(true); }}
                      className={`h-9 text-xs flex items-center gap-1`}
                    >
                      Bedroom <ChevronRight size={14} />
                    </Button>
                  </div>
                  )}

                  {/* Availability for RENT, Property Status otherwise (not for land) */}
                  {activeTab !== 'land' && (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setOpenDropdown(activeTab === 'rent' ? 'availability' : 'construction'); setIsMobileOverlayOpen(true); }}
                      className={`h-9 text-xs flex items-center gap-1`}
                    >
                      {activeTab === 'rent' ? 'Availability' : 'Property Status'} <ChevronRight size={14} />
                    </Button>
                  </div>
                  )}

                  {/* Furnishing */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setOpenDropdown('furnishing'); setIsMobileOverlayOpen(true); }}
                      className={`h-9 text-xs flex items-center gap-1`}
                    >
                      Furnishing <ChevronRight size={14} />
                    </Button>
                  </div>

                  {/* Budget */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setOpenDropdown('budget'); setIsMobileOverlayOpen(true); }}
                      className={`h-9 text-xs flex items-center gap-1`}
                    >
                      Budget <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Full-screen Search Overlay */}
        {isMobileOverlayOpen && (
          <div ref={mobileSearchContainerRef} className="sm:hidden fixed inset-0 z-[60] bg-white flex flex-col">
            {/* Header with tabs and close */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
              <div className="flex bg-gray-100 rounded-full overflow-hidden">
                {navigationTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id ? 'bg-white text-brand-red' : 'text-gray-600'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                aria-label="Close"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100"
                onClick={() => { setIsMobileOverlayOpen(false); setOpenDropdown(null); }}
              >
                <X size={16} />
              </button>
            </div>
            {/* Body */}
            <div className="px-4 pt-3 pb-24 overflow-y-auto">
              {/* Input (with in-field search icon for parity) */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-red" size={16} />
                <input
                  ref={mobileInputRef}
                  type="search"
                  role="combobox"
                  placeholder={selectedCity ? `Add locality in ${selectedCity}` : 'Add Locality/Project/Landmark'}
                  value={selectedLocations.length > 0 ? selectedLocations[0] : searchQuery}
                  onChange={(e) => !selectedLocations.length && setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-9 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-base hide-clear-button"
                  autoComplete="off"
                  aria-autocomplete="both"
                />
                {selectedLocations.length > 0 ? (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                      aria-label="Clear location"
                      onClick={() => removeLocation(selectedLocations[0])}
                    >
                      <X size={16} />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-brand-red/40"
                      aria-label="Search"
                      onClick={() => { handleSearch(); setIsMobileOverlayOpen(false); setOpenDropdown(null); }}
                    >
                      <SearchIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-9 w-9 rounded-full text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-brand-red/40"
                    aria-label="Search"
                    onClick={() => { handleSearch(); setIsMobileOverlayOpen(false); setOpenDropdown(null); }}
                  >
                    <SearchIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filters row inside overlay (mobile) */}
              <div className="mt-4">
                <div className="overflow-x-auto -mx-1 px-1">
                  <div className="flex gap-2 min-w-max">
                    {/* Property Type / Space Type - show for all tabs (Commercial uses space types) */}
                    {(
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'propertyType' ? null : 'propertyType')}
                          className={`h-9 text-xs flex items-center gap-1 ${openDropdown === 'propertyType' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          {activeTab === 'land' ? 'Land Type' : activeTab === 'commercial' ? 'Space Type' : 'Property Type'} <ChevronRight size={14} className={`transition-transform ${openDropdown === 'propertyType' ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    )}

                    {/* Bedroom (only for Buy/Rent) */}
                    {(activeTab === 'buy' || activeTab === 'rent') && (
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'bedroom' ? null : 'bedroom')}
                          className={`h-9 text-xs flex items-center gap-1 ${openDropdown === 'bedroom' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          Bedroom <ChevronRight size={14} className={`transition-transform ${openDropdown === 'bedroom' ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    )}

                    {/* Availability for RENT; Property Status for others */}
                    {activeTab === 'rent' ? (
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'availability' ? null : 'availability')}
                          className={`h-9 text-xs flex items-center gap-1 ${openDropdown === 'availability' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          Availability <ChevronRight size={14} className={`transition-transform ${openDropdown === 'availability' ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'construction' ? null : 'construction')}
                          className={`h-9 text-xs flex items-center gap-1 ${openDropdown === 'construction' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          Property Status <ChevronRight size={14} className={`transition-transform ${openDropdown === 'construction' ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    )}

                    {/* Furnishing */}
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOpenDropdown(openDropdown === 'furnishing' ? null : 'furnishing')}
                        className={`h-9 text-xs flex items-center gap-1 ${openDropdown === 'furnishing' ? 'bg-blue-50 border-blue-400' : ''}`}
                      >
                        Furnishing <ChevronRight size={14} className={`transition-transform ${openDropdown === 'furnishing' ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>

                    {/* Budget */}
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
                        className={`h-9 text-xs flex items-center gap-1 ${openDropdown === 'budget' ? 'bg-blue-50 border-blue-400' : ''}`}
                      >
                        Budget <ChevronRight size={14} className={`transition-transform ${openDropdown === 'budget' ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Inline dropdown panel for mobile overlay */}
              {openDropdown && (
                <div className="mt-3 border border-gray-200 rounded-lg bg-white shadow p-3">
                  {openDropdown === 'propertyType' && (
                    <div className="grid grid-cols-1 gap-2">
                      {getPropertyTypesForHomepage(activeTab).map(type => (
                        <label key={type} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={selectedPropertyTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) setSelectedPropertyTypes(prev => [...prev, type]);
                              else setSelectedPropertyTypes(prev => prev.filter(t => t !== type));
                            }}
                          />
                          <span className="capitalize">{type.toLowerCase()}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {openDropdown === 'bedroom' && (activeTab === 'buy' || activeTab === 'rent') && (
                    <div className="flex flex-wrap gap-2">
                      {['1 RK/1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map(bhk => (
                        <Button
                          key={bhk}
                          variant={selectedBedrooms.includes(bhk) ? 'default' : 'outline'}
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            setSelectedBedrooms(prev => prev.includes(bhk) ? prev.filter(b => b !== bhk) : [...prev, bhk]);
                          }}
                        >
                          + {bhk}
                        </Button>
                      ))}
                    </div>
                  )}
                  {openDropdown === 'construction' && activeTab !== 'land' && activeTab !== 'rent' && (
                    <div className="flex flex-wrap gap-2">
                      {['Under Construction', 'Ready'].map(status => (
                        <Button
                          key={status}
                          variant={selectedConstructionStatus.includes(status) ? 'default' : 'outline'}
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            setSelectedConstructionStatus(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
                          }}
                        >
                          + {status}
                        </Button>
                      ))}
                    </div>
                  )}
                  {openDropdown === 'availability' && activeTab === 'rent' && (
                    <div className="grid grid-cols-2 gap-2">
                      {['Immediate', 'Within 15 Days', 'Within 30 Days', 'After 30 Days'].map(option => (
                        <Button
                          key={option}
                          variant={selectedAvailability.includes(option) ? 'default' : 'outline'}
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            setSelectedAvailability(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                  {openDropdown === 'furnishing' && (
                    <div className="flex flex-wrap gap-2">
                      {['Full', 'Semi', 'None'].map(level => (
                        <Button
                          key={level}
                          variant={selectedFurnishing.includes(level) ? 'default' : 'outline'}
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            setSelectedFurnishing(prev => prev.includes(level) ? prev.filter(p => p !== level) : [...prev, level]);
                          }}
                        >
                          + {level}
                        </Button>
                      ))}
                    </div>
                  )}
                  {openDropdown === 'budget' && (
                    <div>
                      <div className="text-xs text-gray-600 mb-3">
                        ₹{formatBudget(budget[0])} - ₹{activeTab === 'rent' && budget[1] >= 500000 ? '5L +' : formatBudget(budget[1])}
                      </div>
                      <Slider
                        value={budget}
                        onValueChange={(v) => {
                          const next = snapBudget(activeTab, v as [number, number]);
                          setBudget(next);
                        }}
                        min={0}
                        max={getBudgetSliderMaxHome(activeTab)}
                        step={getBudgetSliderStepHome(activeTab)}
                      />
                      {/* Precise inputs */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1">Min</label>
                          <input
                            type="number"
                            inputMode="numeric"
                            className="w-full border rounded px-2 py-1 text-sm"
                            value={budget[0]}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value) || 0);
                              const next: [number, number] = [val, budget[1]];
                              setBudget(snapBudget(activeTab, next));
                            }}
                          />
                          <div className="text-[11px] text-gray-400 mt-0.5">₹ in Rupees</div>
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1">Max</label>
                          <input
                            type="number"
                            inputMode="numeric"
                            className="w-full border rounded px-2 py-1 text-sm"
                            value={budget[1]}
                            onChange={(e) => {
                              const maxAllowed = getBudgetSliderMaxHome(activeTab);
                              const val = Math.min(maxAllowed, Math.max(0, Number(e.target.value) || 0));
                              const next: [number, number] = [budget[0], val];
                              setBudget(snapBudget(activeTab, next));
                            }}
                          />
                          <div className="text-[11px] text-gray-400 mt-0.5">₹ in Rupees</div>
                        </div>
                      </div>
                      {/* Quick presets */}
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {activeTab === 'rent' ? (
                          <>
                            <Button size="sm" variant={budget[0]===0&&budget[1]===50000? 'default':'outline'} className="h-8 text-xs" onClick={() => setBudget([0, 50000])}>Under 50K</Button>
                            <Button size="sm" variant={budget[0]===0&&budget[1]===100000? 'default':'outline'} className="h-8 text-xs" onClick={() => setBudget([0, 100000])}>Under 1L</Button>
                            <Button size="sm" variant={budget[0]===100000&&budget[1]===200000? 'default':'outline'} className="h-8 text-xs" onClick={() => setBudget([100000, 200000])}>1L-2L</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant={budget[0]===0&&budget[1]===5000000? 'default':'outline'} className="h-8 text-xs" onClick={() => setBudget([0, 5000000])}>Under 50L</Button>
                            <Button size="sm" variant={budget[0]===5000000&&budget[1]===10000000? 'default':'outline'} className="h-8 text-xs" onClick={() => setBudget([5000000, 10000000])}>50L-1Cr</Button>
                            <Button size="sm" variant={budget[0]===10000000&&budget[1]===20000000? 'default':'outline'} className="h-8 text-xs" onClick={() => setBudget([10000000, 20000000])}>1-2Cr</Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-between">
              <button
                className="text-blue-600 text-sm font-medium"
                onClick={() => {
                  setSelectedLocations([]);
                  setSelectedCity('');
                  setSearchQuery('');
                  setSelectedAvailability([]);
                }}
              >
                Clear All
              </button>
              <Button
                onClick={() => {
                  handleSearch();
                  setIsMobileOverlayOpen(false);
                  setOpenDropdown(null);
                }}
                className="px-6"
              >
                Next
              </Button>
            </div>
          </div>
        )}
    {/* Desktop Search Section */}
    {/* Note: Keep desktop search below header dropdowns to avoid overlap.
       The header is rendered earlier with z-50; previously both had z-50,
       causing the search (later in DOM) to overlay dropdown menus.
       Lowering to z-30 resolves stacking without changing layout. */}
  <div className="hidden sm:block absolute left-0 right-0 bottom-0 translate-y-3 md:translate-y-8 lg:translate-y-8 xl:translate-y-6 2xl:translate-y-3 z-30 transform-gpu will-change-transform">
          <div className="max-w-4xl md:max-w-3xl lg:max-w-4xl xl:max-w-4xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl md:max-w-2xl lg:max-w-3xl mx-auto">
              {/* Navigation Tabs */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-visible">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto rounded-none border-b border-gray-200">
                    {navigationTabs.map(tab => <TabsTrigger key={tab.id} value={tab.id} className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all rounded-none border-b-2 border-transparent data-[state=active]:border-brand-red data-[state=active]:text-brand-red data-[state=active]:bg-brand-red/5 data-[state=active]:font-bold hover:bg-brand-red/5 hover:text-brand-red">
                        {tab.label}
                      </TabsTrigger>)}
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-0 px-4 sm:px-6 py-4 bg-white rounded-b-xl">
                    {/* Unified Search Box with inline filters */}
                    <div className="relative mb-4 overflow-visible">
                      <div
                        className="relative w-full overflow-visible"
                        onClick={() => {
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }}
                      >
                      {/* Search row with red border and button */}
                        <div className="flex items-center gap-2">
                        <div className="relative px-4 pt-3 pb-2 pl-12 pr-4 flex-1 border-2 border-brand-red/40 rounded-xl bg-white shadow-md focus-within:ring-2 focus-within:ring-brand-red/20 focus-within:border-brand-red transition-all duration-200 hover:shadow-lg hover:border-brand-red/60 overflow-visible">
                        {/* Location Row */}
                        <div className="relative flex items-center">
                          <MapPin className="absolute left-0 -ml-8 text-brand-red pointer-events-none flex-shrink-0" size={18} />
                          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0 relative">
                            <input
                              ref={inputRef}
                              value={selectedLocations.length > 0 ? selectedLocations[0] : searchQuery}
                              onChange={(e) => !selectedLocations.length && setSearchQuery(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder={selectedCity ? `Add locality in ${selectedCity}` : 'Search locality...'}
                              className="flex-1 min-w-[8rem] outline-none bg-transparent text-sm placeholder:text-gray-500 font-medium"
                              style={{ appearance: "none" }}
                            />
                            {selectedLocations.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeLocation(selectedLocations[0]);
                                }}
                                className="absolute right-0 hover:bg-gray-100 rounded-full p-1 transition-colors"
                              >
                                <X size={14} className="text-gray-500" />
                              </button>
                            )}
                          </div>
                        </div>
                        </div>

                        {/* Compact Search Button */}
                        <button
                          type="button"
                          className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-brand-red/30 transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
                          aria-label="Search"
                          onClick={handleSearch}
                          disabled={!(searchQuery.trim().length > 0 || selectedLocations.length > 0)}
                        >
                          <SearchIcon className="h-4 w-4" />
                        </button>
                        </div>

                        {/* Filter row outside red border */}
                        <div className="mt-3 overflow-visible">
                          <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full px-2 max-w-full">
                            {/* Property type: Property Type or Land/Space Type */}
                            <Popover open={!isMobile && openDropdown === 'propertyType'} onOpenChange={(open) => !isMobile && setOpenDropdown(open ? 'propertyType' : null)}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-sm ${openDropdown === 'propertyType' ? 'bg-blue-50 border-blue-400 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                  <span className="text-sm font-medium">{activeTab === 'land' ? 'Land Type' : activeTab === 'commercial' ? 'Space Type' : 'Property Type'}</span>
                                  <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'propertyType' ? 'rotate-90' : ''}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent side="bottom" align="start" avoidCollisions={false} className="w-[300px] sm:w-[350px] p-4">
                                <h4 className="text-base font-semibold mb-3 text-foreground">Select Property Type</h4>
                                <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
                                  {getPropertyTypesForHomepage(activeTab).map(type => (
                                    <label key={type} className="flex items-center gap-2.5 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                                      <Checkbox
                                        checked={selectedPropertyTypes.includes(type)}
                                        onCheckedChange={(checked) => {
                                          if (checked) setSelectedPropertyTypes(prev => [...prev, type]);
                                          else setSelectedPropertyTypes(prev => prev.filter(t => t !== type));
                                        }}
                                        className="rounded-md"
                                      />
                                      <span className="capitalize font-medium">{type.toLowerCase()}</span>
                                    </label>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>

                            {/* Bedroom (only for Buy/Rent) */}
                            {(activeTab === 'buy' || activeTab === 'rent') && (
                            <Popover open={!isMobile && openDropdown === 'bedroom'} onOpenChange={(open) => !isMobile && setOpenDropdown(open ? 'bedroom' : null)}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-sm ${openDropdown === 'bedroom' ? 'bg-blue-50 border-blue-400 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                  <span className="text-sm font-medium">Bedroom</span>
                                  <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'bedroom' ? 'rotate-90' : ''}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent side="bottom" align="start" avoidCollisions={false} className="w-[280px] sm:w-[320px] p-4">
                                <h4 className="text-base font-semibold mb-3 text-foreground">Number of Bedrooms</h4>
                                <div className="flex flex-wrap gap-2">
                                  {['1 RK/1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map(bhk => (
                                    <Button
                                      key={bhk}
                                      variant={selectedBedrooms.includes(bhk) ? 'default' : 'outline'}
                                      size="sm"
                                      className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
                                      onClick={() => {
                                        setSelectedBedrooms(prev => prev.includes(bhk) ? prev.filter(b => b !== bhk) : [...prev, bhk]);
                                      }}
                                    >
                                      {bhk}
                                    </Button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                            )}

                            {/* Availability for RENT; Property Status for others (not for land) */}
                            {activeTab !== 'land' && (
                              activeTab === 'rent' ? (
                                <Popover open={!isMobile && openDropdown === 'availability'} onOpenChange={(open) => !isMobile && setOpenDropdown(open ? 'availability' : null)}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-sm ${openDropdown === 'availability' ? 'bg-blue-50 border-blue-400 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
                                    >
                                      <span className="text-sm font-medium">Availability</span>
                                      <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'availability' ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent side="bottom" align="start" avoidCollisions={false} className="w-[280px] sm:w-[320px] p-4">
                                    <h4 className="text-base font-semibold mb-3 text-foreground">Availability</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {['Immediate', 'Within 15 Days', 'Within 30 Days', 'After 30 Days'].map(option => (
                                        <Button
                                          key={option}
                                          variant={selectedAvailability.includes(option) ? 'default' : 'outline'}
                                          size="sm"
                                          className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
                                          onClick={() => {
                                            setSelectedAvailability(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
                                          }}
                                        >
                                          {option}
                                        </Button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <Popover open={!isMobile && openDropdown === 'construction'} onOpenChange={(open) => !isMobile && setOpenDropdown(open ? 'construction' : null)}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`gap-2 px-5 py-2 rounded-lg border overflow-hidden transition-all duration-200 hover:shadow-sm whitespace-nowrap ${openDropdown === 'construction' ? 'bg-blue-50 border-blue-400 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
                                    >
                                      <span className="text-sm font-medium">Property Status</span>
                                      <ChevronRight size={14} className={`flex-shrink-0 transition-transform duration-200 ${openDropdown === 'construction' ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent side="bottom" align="start" avoidCollisions={false} className="w-[250px] sm:w-[280px] p-4">
                                    <h4 className="text-base font-semibold mb-3 text-foreground">Property Status</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {['Under Construction', 'Ready'].map(status => (
                                        <Button
                                          key={status}
                                          variant={selectedConstructionStatus.includes(status) ? 'default' : 'outline'}
                                          size="sm"
                                          className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
                                          onClick={() => {
                                            setSelectedConstructionStatus(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
                                          }}
                                        >
                                          {status}
                                        </Button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )
                            )}

                            {/* Furnishing */}
                            <Popover open={!isMobile && openDropdown === 'furnishing'} onOpenChange={(open) => !isMobile && setOpenDropdown(open ? 'furnishing' : null)}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-sm ${openDropdown === 'furnishing' ? 'bg-blue-50 border-blue-400 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                  <span className="text-sm font-medium">Furnishing</span>
                                  <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'furnishing' ? 'rotate-90' : ''}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent side="bottom" align="start" avoidCollisions={false} className="w-[220px] sm:w-[260px] p-4">
                                <h4 className="text-base font-semibold mb-3 text-foreground">Furnishing</h4>
                                <div className="flex flex-wrap gap-2">
                                  {['Full', 'Semi', 'None'].map(level => (
                                    <Button
                                      key={level}
                                      variant={selectedFurnishing.includes(level) ? 'default' : 'outline'}
                                      size="sm"
                                      className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
                                      onClick={() => {
                                        setSelectedFurnishing(prev => prev.includes(level) ? prev.filter(p => p !== level) : [...prev, level]);
                                      }}
                                    >
                                      {level}
                                    </Button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>

                            {/* Budget */}
                            <Popover open={!isMobile && openDropdown === 'budget'} onOpenChange={(open) => !isMobile && setOpenDropdown(open ? 'budget' : null)}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-sm ${openDropdown === 'budget' ? 'bg-blue-50 border-blue-400 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                  <span className="text-sm font-medium">Budget</span>
                                  <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'budget' ? 'rotate-90' : ''}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent side="bottom" align="start" avoidCollisions={false} className="w-[360px] sm:w-[480px] p-4">
                                <h4 className="text-base font-semibold mb-3 text-foreground">Budget Range</h4>
                                <div className="text-sm font-medium mb-3 text-foreground">
                                  ₹{formatBudget(budget[0])} - ₹{activeTab === 'rent' && budget[1] >= 500000 ? '5L +' : formatBudget(budget[1])}
                                </div>
                                <Slider
                                  value={budget}
                                  onValueChange={(v) => {
                                    const next = snapBudget(activeTab, v as [number, number]);
                                    setBudget(next);
                                  }}
                                  min={0}
                                  max={getBudgetSliderMaxHome(activeTab)}
                                  step={getBudgetSliderStepHome(activeTab)}
                                  className="mb-4"
                                />
                                {/* Precise inputs */}
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Min Budget</label>
                                    <input
                                      type="number"
                                      inputMode="numeric"
                                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                                      value={budget[0]}
                                      onChange={(e) => {
                                        const val = Math.max(0, Number(e.target.value) || 0);
                                        const next: [number, number] = [val, budget[1]];
                                        setBudget(snapBudget(activeTab, next));
                                      }}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">₹ in Rupees</div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Max Budget</label>
                                    <input
                                      type="number"
                                      inputMode="numeric"
                                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                                      value={budget[1]}
                                      onChange={(e) => {
                                        const maxAllowed = getBudgetSliderMaxHome(activeTab);
                                        const val = Math.min(maxAllowed, Math.max(0, Number(e.target.value) || 0));
                                        const next: [number, number] = [budget[0], val];
                                        setBudget(snapBudget(activeTab, next));
                                      }}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">₹ in Rupees</div>
                                  </div>
                                </div>
                                {/* Quick presets */}
                                <div className="grid grid-cols-3 gap-2">
                                  {activeTab === 'rent' ? (
                                    <>
                                      <Button size="sm" variant={budget[0]===0&&budget[1]===50000? 'default':'outline'} className="h-9 text-xs font-medium" onClick={() => setBudget([0, 50000])}>Under 50K</Button>
                                      <Button size="sm" variant={budget[0]===0&&budget[1]===100000? 'default':'outline'} className="h-9 text-xs font-medium" onClick={() => setBudget([0, 100000])}>Under 1L</Button>
                                      <Button size="sm" variant={budget[0]===100000&&budget[1]===200000? 'default':'outline'} className="h-9 text-xs font-medium" onClick={() => setBudget([100000, 200000])}>1L-2L</Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button size="sm" variant={budget[0]===0&&budget[1]===5000000? 'default':'outline'} className="h-9 text-xs font-medium" onClick={() => setBudget([0, 5000000])}>Under 50L</Button>
                                      <Button size="sm" variant={budget[0]===5000000&&budget[1]===10000000? 'default':'outline'} className="h-9 text-xs font-medium" onClick={() => setBudget([5000000, 10000000])}>50L-1Cr</Button>
                                      <Button size="sm" variant={budget[0]===10000000&&budget[1]===20000000? 'default':'outline'} className="h-9 text-xs font-medium" onClick={() => setBudget([10000000, 20000000])}>1-2Cr</Button>
                                    </>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>

                          </div>
                          {/* Clear button below, right-aligned */}
                          <div className="hidden mt-2 flex justify-end px-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${((selectedPropertyTypes.length || selectedBedrooms.length || selectedConstructionStatus.length || selectedFurnishing.length || selectedAvailability.length) > 0) ? '' : 'invisible pointer-events-none'}`}
                              onClick={() => {
                                setSelectedPropertyTypes([]);
                                setSelectedBedrooms([]);
                                setSelectedConstructionStatus([]);
                                setSelectedFurnishing([]);
                                setSelectedAvailability([]);
                                setBudget([0, getBudgetSliderMaxHome(activeTab)]);
                              }}
                            >
                              Clear Filters
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* (Removed) External filter row now integrated inside the search box */}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* White background section - mobile responsive */}
      <div className="bg-white pt-2 sm:pt-4 md:pt-10 pb-4 sm:pb-8 mx-0 px-0 mb-2 sm:mb-4 py-[6px]">
        <div className="container mx-auto px-2 sm:px-4">
          {/* This space allows the search section to overlap properly */}
        </div>
      </div>
    </section>;

  // Helper: property types per tab for homepage UI (UI only)
  function getPropertyTypesForHomepage(tab: string): string[] {
    switch (tab) {
      case 'rent':
        // Rent now combines residential + commercial rentals (PG/Hostel included)
        return MERGE_COMM_LAND_IN_BUY_RENT
          ? [
              // Residential rentals
              'Flat/Apartment', 'Independent House', 'Villa', 'PG/Hostel',
              // Commercial rentals
              'Office', 'Retail', 'Warehouse', 'Showroom', 'Restaurant', 'Co-Working', 'Industrial',
              // Optional: land rentals (rare)
              'Commercial Land', 'Industrial Land'
            ]
          : ['Flat/Apartment', 'Independent House', 'Villa', 'PG/Hostel'];
      case 'buy':
        // Buy now combines residential + commercial sale + land/plot
        return MERGE_COMM_LAND_IN_BUY_RENT
          ? [
              // Residential sale
              'Flat/Apartment', 'Independent House', 'Villa', 'Penthouse', 'Duplex', 'Builder Floor', 'Studio Apartment', 'Gated Community Villa',
              // Commercial sale
              'Office', 'Retail', 'Warehouse', 'Showroom', 'Restaurant', 'Co-Working', 'Industrial',
              // Land/Plot
              'Commercial Land', 'Industrial Land', 'Agricultural Land'
            ]
          : ['Flat/Apartment', 'Independent House', 'Villa'];
      case 'commercial':
        return ['Office', 'Retail', 'Warehouse', 'Showroom', 'Restaurant', 'Co-Working', 'Industrial'];
      case 'land':
        // Remove 'Residential Plot' from Land/Plot
        return ['Commercial Land', 'Industrial Land', 'Agricultural Land'];
      default:
        return ['Flat/Apartment', 'Villa', 'Independent House'];
    }
  }

  function getBudgetSliderMaxHome(tab: string): number {
    if (tab === 'rent') return 500000; // 5L
    return 50000000; // 5 Cr (align with results page)
  }

  function getBudgetSliderStepHome(tab: string): number {
    if (tab === 'rent') return 10000; // 10K
    return 100000; // 1L for finer control on mobile
  }

  function formatBudget(value: number): string {
    if (value >= 10000000) return `${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 1)} Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)} L`;
    return value.toString();
  }

  // Snap budget values to intuitive steps based on range
  function snapBudget(tab: string, range: [number, number]): [number, number] {
    const roundTo = (val: number, step: number) => Math.round(val / step) * step;
    const snapOne = (val: number) => {
      if (tab === 'rent') {
        if (val <= 50000) return roundTo(val, 5000); // 5K up to 50K
        if (val <= 200000) return roundTo(val, 10000); // 10K up to 2L
        return roundTo(val, 50000); // 50K above
      }
      // buy/commercial
      if (val <= 2000000) return roundTo(val, 100000); // 1L up to 20L
      if (val <= 10000000) return roundTo(val, 500000); // 5L up to 1Cr
      return roundTo(val, 1000000); // 10L above
    };
  const [min, max] = range;
  const snapped: [number, number] = [snapOne(min), snapOne(max)];
    // Ensure bounds and order
    const maxAllowed = getBudgetSliderMaxHome(tab);
    snapped[0] = Math.max(0, Math.min(snapped[0], maxAllowed));
    snapped[1] = Math.max(0, Math.min(snapped[1], maxAllowed));
    if (snapped[0] > snapped[1]) snapped[0] = snapped[1];
    return snapped;
  }

  // Map homepage labels to canonical property type tokens used in search filters
  function mapPropertyTypeLabelToToken(label: string): string {
    const map: Record<string, string> = {
      'Apartment': 'APARTMENT',
      'Flat/Apartment': 'APARTMENT',
      'Independent House': 'INDEPENDENT HOUSE',
      'Villa': 'VILLA',
      'Penthouse': 'PENTHOUSE',
      'Duplex': 'DUPLEX',
      'Gated Community Villa': 'GATED COMMUNITY VILLA',
      'Builder Floor': 'BUILDER FLOOR',
      'Studio Apartment': 'STUDIO APARTMENT',
      'Co-Living': 'CO-LIVING',
      'Co-Working': 'CO-WORKING',
      'Coworking': 'CO-WORKING', // Map both variants to the same token
      'Commercial Land': 'COMMERCIAL LAND',
      'Industrial Land': 'INDUSTRIAL LAND',
      'Agricultural Land': 'AGRICULTURAL LAND',
      'Office': 'OFFICE',
      'Retail': 'RETAIL',
      'Warehouse': 'WAREHOUSE',
      'Showroom': 'SHOWROOM',
      'Restaurant': 'RESTAURANT',
      'Industrial': 'INDUSTRIAL',
      'PG/Hostel': 'PG/HOSTEL',
    };
    return map[label] || label.toUpperCase();
  }

  function mapBhkSelectionsToFilters(selections: string[]): string[] {
    const out: string[] = [];
    selections.forEach(s => {
      if (s === '1 RK/1 BHK') out.push('1 RK', '1 BHK');
      else if (s === '4+ BHK') out.push('5+ BHK');
      else out.push(s);
    });
    return out;
  }

  function mapStatusToAvailability(status: string): string | null {
    if (status === 'Ready to move' || status === 'Ready') return 'Ready to Move';
    if (status === 'Under Construction') return 'Under Construction';
    return null;
  }

  function mapStatusToConstruction(status: string): string | null {
    if (status === 'New Launch') return 'New Project';
    return null;
  }

  // Map furnishing labels to filter tokens expected by results filter
  function mapFurnishingLabelToFilter(label: string): string {
    const map: Record<string, string> = {
      'Full': 'Furnished',
      'Semi': 'Semi-Furnished',
      'None': 'Unfurnished',
    };
    return map[label] || label;
  }
});
SearchSection.displayName = 'SearchSection';
export default SearchSection;