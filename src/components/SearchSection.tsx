import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, X, ChevronRight, Search as SearchIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCMSContent } from '@/hooks/useCMSContent';
import { useTheme } from '@/contexts/ThemeContext';
import { normalizeLocation } from '@/services/locationService';
import { getCurrentCountryConfig } from '@/services/domainCountryService';
import mortgeaseLogo from '@/assets/mortgease-logo.jpg';
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

// Hero image carousel images
const HERO_IMAGES = [
  'https://smyojibmvrhfbwodvobw.supabase.co/storage/v1/object/public/hero-images/burj2.jpg',
  'https://smyojibmvrhfbwodvobw.supabase.co/storage/v1/object/public/hero-images/hero1.jpg',
  'https://smyojibmvrhfbwodvobw.supabase.co/storage/v1/object/public/hero-images/hero2.jpg',
  'https://smyojibmvrhfbwodvobw.supabase.co/storage/v1/object/public/hero-images/hero3.jpg',
];

const SearchSection = forwardRef<SearchSectionRef>((_, ref) => {
  // Feature flags for merging Commercial & Land/Plot into Buy/Rent tabs
  const MERGE_COMM_LAND_IN_BUY_RENT = true; // Keep true for new behavior
  const SHOW_LEGACY_COMMERCIAL_LAND_TABS = false; // Set to false to hide old tabs
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cityBounds, setCityBounds] = useState<LatLngBounds | null>(null);
  // Dropdown filter UI state (UI-only for homepage)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>([]);
  // Top category tabs like Properties / New Projects / Agents (visual only for now)
  const [topCategory, setTopCategory] = useState<'properties' | 'new-projects' | 'agents'>('properties');
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState<string[]>([]);
  // New Projects specific filters
  const [newProjectsResidential, setNewProjectsResidential] = useState<string>('Residential');
  const [newProjectsHandoverBy, setNewProjectsHandoverBy] = useState<string>(''); // Empty means show title
  const [newProjectsPaymentPlan, setNewProjectsPaymentPlan] = useState<number>(100); // Percentage slider 0-100
  const [newProjectsCompletion, setNewProjectsCompletion] = useState<string>(''); // Empty means show title
  // Rent-specific availability selections
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  // Rent payment frequency (Yearly/Monthly/Weekly/Daily/Any)
  const rentFrequencyOptions = ['Yearly', 'Monthly', 'Weekly', 'Daily', 'Any'] as const;
  const [rentFrequency, setRentFrequency] = useState<string>('Yearly');
  const [selectedFurnishing, setSelectedFurnishing] = useState<string[]>([]);
  // Budget defaults to full range based on the active tab (5Cr for buy/commercial/land, 5L for rent)
  const [budget, setBudget] = useState<[number, number]>([0, getBudgetSliderMaxHome('buy')]);
  
  // Validation state for locality
  const [isValidLocality, setIsValidLocality] = useState(false);
  const [locationError, setLocationError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileAcInitRef = useRef(false);
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { content: cmsContent } = useCMSContent('hero-search');
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  // Hero image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate hero images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
    
    // Validate that locality is from Google Places autocomplete
    if (!isValidLocality) {
      setLocationError('Please select a valid locality');
      return;
    }
    
    // Clear error and add location
    setLocationError('');
    // Only allow one location - replace any existing one
    setSelectedLocations([trimmed]);
    setSearchQuery('');
    setIsValidLocality(false); // Reset validation after adding
  };

  const removeLocation = (location: string) => {
    const updated = selectedLocations.filter(loc => loc !== location);
    setSelectedLocations(updated);
    setLocationError(''); // Clear error when removing location
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
    
    // If there's text in searchQuery but no selected locations, validate it
    if (searchQuery.trim() && selectedLocations.length === 0) {
      if (!isValidLocality) {
        setLocationError('Please select a valid locality');
        return;
      }
    }
    
    // Clear any error
    setLocationError('');
    
    if (searchQuery.trim()) {
      // Normalize location before navigating (e.g., "bengaluru" -> "Bangalore")
      const normalizedLocation = normalizeLocation(searchQuery.trim());
      navigateToSearch([normalizedLocation]);
      return;
    }
    // Normalize all selected locations
    const normalizedLocations = selectedLocations.map(loc => normalizeLocation(loc));
    navigateToSearch(normalizedLocations);
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
    // Bathrooms
    if ((activeTab === 'buy' || activeTab === 'rent') && selectedBathrooms.length > 0) {
      const baths = selectedBathrooms
        .map(b => (b === '6+' ? '6' : b.replace(/\D/g, '')))
        .filter(Boolean)
        .join(',');
      if (baths) params.set('bathrooms', baths);
    }

    // Availability/Construction handling per tab (not for land)
    if (activeTab !== 'land') {
      if (activeTab === 'rent') {
        // For RENT, use dedicated Availability values and do NOT set construction
        if (selectedAvailability.length > 0) {
          params.set('availability', selectedAvailability.join(','));
        }
        // Rent frequency - include when chosen (ignore 'Any')
        if (rentFrequency && rentFrequency !== 'Any') {
          params.set('frequency', rentFrequency.toLowerCase());
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
      // Only add location on Enter, do NOT trigger search
      if (searchQuery.trim() && selectedLocations.length === 0) {
        addLocation(searchQuery);
      }
      // Search only happens via search button click
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
      const countryConfig = getCurrentCountryConfig();
      const region = countryConfig.code || 'AE';
      const language = countryConfig.language ? `${countryConfig.language}-${region}` : 'en';
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&region=${region}&language=${language}`;
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
      
      const getOptions = () => {
        const countryConfig = getCurrentCountryConfig();
        const countryCode = countryConfig.code.toLowerCase();
        console.log('🌍 Autocomplete country restriction:', countryCode, 'for domain:', window.location.hostname);
        return {
          fields: ['formatted_address', 'geometry', 'name', 'address_components'],
          types: ['geocode'],
          componentRestrictions: {
            country: countryCode
          },
          ...(cityBounds && selectedCity && { 
            bounds: cityBounds, 
            strictBounds: true,
            // Add city restriction hint
          })
        };
      };
      const inputs = [inputRef.current].filter(Boolean) as HTMLInputElement[];
      inputs.forEach(el => {
        const ac = new w.google!.maps!.places!.Autocomplete(el, getOptions());
        autocompleteInstance = ac;
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
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
              console.log('🌍 Country validation:', {
                selected: selectedCountryCode,
                expected: expectedCountryCode,
                isValid: isValidCountry
              });
              
              if (!isValidCountry) {
                console.warn('⛔ Country mismatch! Selected:', selectedCountryCode, 'Expected:', expectedCountryCode);
                setLocationError(`Please select a location in ${countryConfig.name}`);
                setIsValidLocality(false);
                if (el) el.value = '';
                setSearchQuery('');
                return;
              }
            }
          }
          
          // Mark as valid selection from Google Places
          setIsValidLocality(true);
          setLocationError('');
          
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
                const countryConfig = getCurrentCountryConfig();
                geocoder.geocode(
                  { 
                    address: `${cityName}, ${countryConfig.name}`,
                    componentRestrictions: { country: countryConfig.code.toLowerCase() }
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
    const countryConfig = getCurrentCountryConfig();
    const countryCode = countryConfig.code.toLowerCase();
    console.log('🌍 Bounded autocomplete country restriction:', countryCode);
    const options = {
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      types: ['geocode'],
      componentRestrictions: {
        country: countryCode
      },
      bounds: cityBounds,
      strictBounds: true
    };
    
    const ac = new w.google!.maps!.places!.Autocomplete(inputRef.current, options);
    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      console.log('🔍 Google Places (Bounded) - Place selected:', place);
      
      // Validate country code from address components
      const expectedCountryCode = countryCode;
      let isValidCountry = false;
      
      if (place?.address_components) {
        const countryComponent = place.address_components.find((comp: GPlaceComponent) =>
          comp.types.includes('country')
        );
        
        if (countryComponent) {
          const selectedCountryCode = countryComponent.short_name.toLowerCase();
          isValidCountry = selectedCountryCode === expectedCountryCode;
          console.log('🌍 Bounded - Country validation:', {
            selected: selectedCountryCode,
            expected: expectedCountryCode,
            isValid: isValidCountry
          });
          
          if (!isValidCountry) {
            console.warn('⛔ Bounded - Country mismatch! Selected:', selectedCountryCode, 'Expected:', expectedCountryCode);
            setLocationError(`Please select a location in ${countryConfig.name}`);
            setIsValidLocality(false);
            if (inputRef.current) inputRef.current.value = '';
            setSearchQuery('');
            return;
          }
        }
      }
      
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

    const countryConfig = getCurrentCountryConfig();
    const options = {
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      types: ['geocode'],
      componentRestrictions: { country: countryConfig.code.toLowerCase() },
      ...(cityBounds && selectedCity && { 
        bounds: cityBounds, 
        strictBounds: true 
      })
    };
    
    console.log('🔄 Mobile autocomplete initializing with options:', shouldReinit ? 'STRICT BOUNDS' : 'INITIAL');
    
    const ac = new w.google!.maps!.places!.Autocomplete(mobileInputRef.current, options);
    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      
      // Validate country code from address components
      const expectedCountryCode = countryConfig.code.toLowerCase();
      let isValidCountry = false;
      
      if (place?.address_components) {
        const countryComponent = place.address_components.find((comp: GPlaceComponent) =>
          comp.types.includes('country')
        );
        
        if (countryComponent) {
          const selectedCountryCode = countryComponent.short_name.toLowerCase();
          isValidCountry = selectedCountryCode === expectedCountryCode;
          console.log('🌍 Mobile - Country validation:', {
            selected: selectedCountryCode,
            expected: expectedCountryCode,
            isValid: isValidCountry
          });
          
          if (!isValidCountry) {
            console.warn('⛔ Mobile - Country mismatch! Selected:', selectedCountryCode, 'Expected:', expectedCountryCode);
            setLocationError(`Please select a location in ${countryConfig.name}`);
            setIsValidLocality(false);
            if (mobileInputRef.current) mobileInputRef.current.value = '';
            setSearchQuery('');
            return;
          }
        }
      }
      
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
            const countryConfig = getCurrentCountryConfig();
            geocoder.geocode(
              { 
                address: `${cityName}, ${countryConfig.name}`,
                componentRestrictions: { country: countryConfig.code }
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
    if (tab === 'rent') return 5000; // 5K steps for rent
    return 500000; // 5L steps for buy/commercial/land
  }

  function snapBudget(tab: string, [min, max]: [number, number]): [number, number] {
    const step = getBudgetSliderStepHome(tab);
    return [Math.floor(min / step) * step, Math.ceil(max / step) * step];
  }

  function formatBudget(amount: number): string {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
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

  return (
    <section id="hero-search" className="relative w-full">
      {/* Click outside to close open dropdowns */}
      {openDropdown && (
        <div className="fixed inset-0 z-40" onMouseDown={() => setOpenDropdown(null)} />
      )}
      {/* Hero Image Background - mobile responsive with UAE theme - Carousel - Extended to cover whitespace */}
      <div className="relative min-h-[50vh] sm:min-h-[55vh] md:min-h-[65vh] bg-cover bg-no-repeat md:-mt-[70px] md:pt-[40px] overflow-visible w-full" style={{ paddingBottom: '2rem' }}>
        {/* Carousel container with all images - extended to cover whitespace below */}
        <div className="absolute inset-0" style={{ bottom: '-2rem' }}>
          {HERO_IMAGES.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                bottom: '-2rem',
              }}
            />
          ))}
        </div>
        {/* Dark overlay layer for text visibility - covers full hero section */}
        <div className="absolute inset-0 bg-black/30 z-[7]" style={{ bottom: '-2rem', left: 0, right: 0, width: '100%' }} />
        {/* Background Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[8]" style={{ bottom: '-2rem' }}>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white/80 select-none whitespace-nowrap">
            HomeHNI A Premium Listing Partner
          </h1>
        </div>
        {/* Subtle leaf green overlay for UAE theme - very light */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/10 to-[#dc2626]/10 z-10" style={{ bottom: '-2rem' }} />
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
                      ? 'text-[#800000]'
                      : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#800000]" />
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
                      className="inline-flex items-center gap-1 bg-[#800000] text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {location}
                      <button
                        onClick={() => removeLocation(location)}
                        className="ml-1 hover:bg-[#700000] rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

                        {/* Quick chips: All / Ready / Off-Plan (Buy only) */}
                        {activeTab === 'buy' && (
                          <div className="hidden md:flex items-center gap-1.5 mr-0">
                            <Button
                              type="button"
                              className={`flex items-center justify-center whitespace-nowrap px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${selectedConstructionStatus.length === 0 ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                              onClick={() => setSelectedConstructionStatus([])}
                            >
                              All
                            </Button>
                            <Button
                              type="button"
                              className={`flex items-center justify-center whitespace-nowrap px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${selectedConstructionStatus.includes('Ready') && selectedConstructionStatus.length === 1 ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                              onClick={() => setSelectedConstructionStatus(['Ready'])}
                            >
                              Ready
                            </Button>
                            <Button
                              type="button"
                              className={`flex items-center justify-center whitespace-nowrap px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${selectedConstructionStatus.includes('Under Construction') && selectedConstructionStatus.length === 1 ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                              onClick={() => setSelectedConstructionStatus(['Under Construction'])}
                            >
                              Off-Plan
                            </Button>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#800000]">
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
                    className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id ? 'bg-white text-[#800000]' : 'text-gray-600'}`}
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
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]" size={16} />
                <input
                  ref={mobileInputRef}
                  type="search"
                  role="combobox"
                  placeholder={selectedCity ? `Add locality in ${selectedCity}` : 'Add Locality/Project/Landmark'}
                  value={selectedLocations.length > 0 ? selectedLocations[0] : searchQuery}
                  onChange={(e) => {
                    if (!selectedLocations.length) {
                      setSearchQuery(e.target.value);
                      setIsValidLocality(false); // Reset validation when user types manually
                      setLocationError('');
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && selectedLocations.length > 0) {
                      e.preventDefault();
                      removeLocation(selectedLocations[0]);
                    }
                  }}
                  className={`w-full pl-9 pr-12 py-3 bg-white border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 text-base hide-clear-button ${locationError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300 focus:ring-[#800000]/20 focus:border-[#800000]'}`}
                  autoComplete="off"
                  aria-autocomplete="both"
                />
                {/* Error message */}
                {locationError && (
                  <div className="absolute left-0 -bottom-6 text-red-600 text-xs font-medium">
                    {locationError}
                  </div>
                )}
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
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full text-white bg-[#800000] hover:bg-[#700000] focus:outline-none focus:ring-2 focus:ring-[#800000]/40"
                      aria-label="Search"
                      disabled={selectedLocations.length === 0}
                      onClick={() => { handleSearch(); setIsMobileOverlayOpen(false); setOpenDropdown(null); }}
                    >
                      <SearchIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-9 w-9 rounded-full text-white bg-[#800000] hover:bg-[#700000] focus:outline-none focus:ring-2 focus:ring-[#800000]/40"
                    aria-label="Search"
                    disabled={selectedLocations.length === 0}
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

                    {/* Beds & Baths (only for Buy/Rent) */}
                    {(activeTab === 'buy' || activeTab === 'rent') && (
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'bedbath' ? null : 'bedbath')}
                          className={`h-9 text-xs flex items-center gap-1 ${openDropdown === 'bedroom' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          Beds & Baths <ChevronRight size={14} className={`transition-transform ${openDropdown === 'bedbath' ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    )}

                    {/* Availability removed on mobile for RENT */}

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

                    {/* Frequency (Rent only) */}
                    {activeTab === 'rent' && (
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'frequency' ? null : 'frequency')}
                          className={`h-9 text-xs flex items-center gap-1 ${openDropdown === 'frequency' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          {rentFrequency} <ChevronRight size={14} className={`transition-transform ${openDropdown === 'frequency' ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    )}

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
                  {openDropdown === 'bedbath' && (activeTab === 'buy' || activeTab === 'rent') && (
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-1">Bedrooms</div>
                        <div className="flex flex-wrap gap-2">
                          {['Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map(bhk => (
                            <Button
                              key={bhk}
                              variant={selectedBedrooms.includes(bhk) ? 'default' : 'outline'}
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => {
                                setSelectedBedrooms(prev => prev.includes(bhk) ? prev.filter(b => b !== bhk) : [...prev, bhk]);
                              }}
                            >
                              {bhk}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Bathrooms</div>
                        <div className="flex flex-wrap gap-2">
                          {['1', '2', '3', '4', '5', '6+'].map(b => (
                            <Button
                              key={b}
                              variant={selectedBathrooms.includes(b) ? 'default' : 'outline'}
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => {
                                setSelectedBathrooms(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
                              }}
                            >
                              {b}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Construction (Property Status) removed from mobile inline panel */}
                  {false && (
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
                  {openDropdown === 'frequency' && activeTab === 'rent' && (
                    <div className="grid grid-cols-1 gap-2">
                      {rentFrequencyOptions.map(opt => (
                        <Button
                          key={opt}
                          variant={rentFrequency === opt ? 'default' : 'outline'}
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => { setRentFrequency(opt); setOpenDropdown(null); }}
                        >
                          {opt}
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
                        AED {formatBudget(budget[0])} - AED {activeTab === 'rent' && budget[1] >= 500000 ? '5L +' : formatBudget(budget[1])}
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
                          <div className="text-[11px] text-gray-400 mt-0.5">AED (UAE Dirham)</div>
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
                          <div className="text-[11px] text-gray-400 mt-0.5">AED (UAE Dirham)</div>
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
                disabled={selectedLocations.length === 0}
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
  <div className="hidden sm:block absolute left-0 right-0 z-30 transform-gpu will-change-transform" style={{ bottom: '-6rem' }}>
          <div className="max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-4xl mx-auto px-4 sm:px-6">
            {/* Top Category Bar - outside the search box */}
            <div className="hidden md:flex items-center justify-center gap-2 mb-2">
              {[
                { id: 'properties', label: 'Properties' },
                { id: 'new-projects', label: 'New Projects' },
                { id: 'agents', label: 'Agents' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTopCategory(tab.id as 'properties' | 'new-projects' | 'agents')}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    topCategory === tab.id
                      ? 'bg-white/95 text-gray-900 border-gray-400 shadow-md backdrop-blur-md'
                      : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-white/90 backdrop-blur-sm'
                  }`}
                  aria-pressed={topCategory === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-xl p-6 sm:p-7 shadow-lg">
              {/* Navigation Tabs */}
              <div className="bg-transparent rounded-xl overflow-visible">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsContent value={activeTab} className="mt-0 px-0 py-0 bg-transparent rounded-b-xl">
                    {/* Unified Search Box with inline filters */}
                    <div ref={desktopSearchRef} className="relative mb-3 overflow-visible">
                      <div className="relative w-full overflow-visible">
                        {/* Search row with BUY, RENT, search field, and search button in one line */}
                        <div className="flex items-center gap-2">
                          {/* BUY and RENT buttons - smaller and inline (hidden for New Projects) */}
                          {topCategory !== 'new-projects' && (
                            <TabsList className="grid grid-cols-2 bg-transparent p-0 h-10 gap-2 flex-shrink-0">
                              {navigationTabs.map((tab) => (
                                <TabsTrigger 
                                  key={tab.id} 
                                  value={tab.id} 
                                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 h-10 ${
                                    theme === 'opaque'
                                      ? (tab.id === activeTab
                                          ? 'bg-gray-300/70 text-gray-900 border border-gray-500 ring-1 ring-gray-400 backdrop-blur-md shadow-sm'
                                          : 'bg-transparent text-gray-900 border border-gray-300 hover:bg-gray-100')
                                      : theme === 'green-white'
                                        ? (tab.id === activeTab
                                            ? 'bg-white text-green-700 border border-green-600 shadow-sm'
                                            : 'bg-white/80 text-gray-600 border border-green-600/50 hover:text-gray-800 hover:bg-white/90')
                                        : (tab.id === activeTab
                                            ? 'bg-white text-[#800000] border border-[#800000] shadow-sm'
                                            : 'bg-white/80 text-gray-600 border border-[#800000]/50 hover:text-gray-800 hover:bg-white/90')
                                  }`}
                                >
                                  {tab.label}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                          )}
                          
                          {/* Search field */}
                          <div className={`relative px-3 py-2 pl-8 pr-3 flex-1 rounded-lg focus-within:ring-2 transition-all duration-200 overflow-visible ${
                            theme === 'opaque'
                              ? 'border border-gray-300 bg-gray-200/75 backdrop-blur-md focus-within:ring-gray-400/30 focus-within:border-gray-400 hover:bg-gray-300/85'
                              : 'border border-[#800000]/50 bg-white/80 backdrop-blur-md focus-within:ring-[#800000]/30 focus-within:border-[#800000] focus-within:bg-white/95 hover:bg-white/90 hover:border-[#800000]/70'
                          }`} onClick={() => inputRef.current?.focus()}>
                        {/* Location Row */}
                        <div className="relative flex items-center">
                          <MapPin className={`absolute left-0 -ml-5 pointer-events-none flex-shrink-0 ${theme === 'opaque' ? 'text-gray-700' : 'text-[#800000]'}`} size={14} />
                          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0 relative">
                            <input
                              ref={inputRef}
                              value={selectedLocations.length > 0 ? selectedLocations[0] : searchQuery}
                              onChange={(e) => {
                                if (!selectedLocations.length) {
                                  setSearchQuery(e.target.value);
                                  setIsValidLocality(false); // Reset validation when user types manually
                                  setLocationError('');
                                }
                              }}
                              onKeyPress={handleKeyPress}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && selectedLocations.length > 0) {
                                  e.preventDefault();
                                  removeLocation(selectedLocations[0]);
                                }
                              }}
                              placeholder={selectedCity ? `Add locality in ${selectedCity}` : 'Search locality...'}
                              className={`flex-1 min-w-[8rem] outline-none bg-transparent text-sm font-medium ${theme === 'opaque' ? 'placeholder:text-gray-600 text-gray-900' : 'placeholder:text-gray-700 text-gray-900'}`}
                              style={{ appearance: "none" }}
                            />
                            {/* Error message for desktop */}
                            {locationError && (
                              <div className="absolute left-0 -bottom-5 text-red-600 text-xs font-medium">
                                {locationError}
                              </div>
                            )}
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
                         className={`inline-flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 focus:outline-none focus:ring-2 ${
                           theme === 'opaque'
                             ? 'bg-gray-200/75 text-gray-800 hover:bg-gray-300/85 border border-gray-300 backdrop-blur-md focus:ring-gray-400/30'
                             : theme === 'green-white'
                               ? 'text-white bg-green-600 hover:bg-green-700 border border-green-600 focus:ring-green-600/30'
                               : 'text-white bg-[#800000] hover:bg-[#700000] border border-[#800000] focus:ring-[#800000]/30'
                         }`}
                        aria-label="Search"
                        onClick={handleSearch}
                        disabled={selectedLocations.length === 0}
                      >
                        <SearchIcon className="h-4 w-4" />
                      </button>
                    </div>

                        {/* Filter row outside red border - hidden for Agents */}
                        {topCategory !== 'agents' && (
                          <div className="mt-2">
                            {/* Scrollable container for tablet with visible scrollbar, grid for desktop */}
                            <div className="overflow-x-auto sm:overflow-x-auto lg:overflow-visible filter-scroll-container">
                              {topCategory === 'new-projects' ? (
                              <div className="flex sm:flex lg:grid lg:grid-cols-4 gap-1.5 sm:gap-2 lg:gap-3 w-full min-w-max lg:min-w-0">
                                {/* Residential */}
                                <Popover open={!isMobile && openDropdown === 'newProjectsResidential'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('newProjectsResidential'); }}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'newProjectsResidential' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                    >
                                      <span className="text-sm font-medium">{newProjectsResidential}</span>
                                      <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'newProjectsResidential' ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent 
                                    side="bottom" 
                                    align="start" 
                                    avoidCollisions={false} 
                                    className="w-[220px] sm:w-[260px] p-4"
                                    onInteractOutside={(e) => {
                                      const target = (e.target as Node) || null;
                                      if (desktopSearchRef.current?.contains(target)) {
                                        e.preventDefault();
                                        return;
                                      }
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <h4 className="text-base font-semibold mb-3 text-foreground">Residential</h4>
                                    <div className="flex flex-col gap-1.5">
                                      {['Residential', 'Commercial'].map(opt => (
                                        <Button
                                          key={opt}
                                          variant={newProjectsResidential === opt ? 'default' : 'outline'}
                                          size="sm"
                                          className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm text-left justify-start"
                                          onClick={() => { setNewProjectsResidential(opt); setOpenDropdown(null); }}
                                        >
                                          {opt}
                                        </Button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>

                                {/* Handover By */}
                                <Popover open={!isMobile && openDropdown === 'newProjectsHandoverBy'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('newProjectsHandoverBy'); }}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'newProjectsHandoverBy' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                    >
                                      <span className="text-sm font-medium">{newProjectsHandoverBy || 'Handover By'}</span>
                                      <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'newProjectsHandoverBy' ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent 
                                    side="bottom" 
                                    align="start" 
                                    avoidCollisions={false} 
                                    className="w-[220px] sm:w-[260px] p-4"
                                    onInteractOutside={(e) => {
                                      const target = (e.target as Node) || null;
                                      if (desktopSearchRef.current?.contains(target)) {
                                        e.preventDefault();
                                        return;
                                      }
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <h4 className="text-base font-semibold mb-3 text-foreground">Handover By</h4>
                                    <div className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto">
                                      {['Any', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027'].map(opt => (
                                        <Button
                                          key={opt}
                                          variant={(opt === 'Any' ? newProjectsHandoverBy === '' : newProjectsHandoverBy === opt) ? 'default' : 'outline'}
                                          size="sm"
                                          className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm text-left justify-start"
                                          onClick={() => { setNewProjectsHandoverBy(opt === 'Any' ? '' : opt); setOpenDropdown(null); }}
                                        >
                                          {opt}
                                        </Button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>

                                {/* Payment Plan - Slider */}
                                <Popover open={!isMobile && openDropdown === 'newProjectsPaymentPlan'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('newProjectsPaymentPlan'); }}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'newProjectsPaymentPlan' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                    >
                                      <span className="text-sm font-medium truncate">
                                        {newProjectsPaymentPlan === 100 ? 'Pre-handover Payment' : `Up to ${newProjectsPaymentPlan}% Pre-handover`}
                                      </span>
                                      <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'newProjectsPaymentPlan' ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent 
                                    side="bottom" 
                                    align="start" 
                                    avoidCollisions={false} 
                                    className="w-[300px] sm:w-[350px] p-4"
                                    onInteractOutside={(e) => {
                                      const target = (e.target as Node) || null;
                                      if (desktopSearchRef.current?.contains(target)) {
                                        e.preventDefault();
                                        return;
                                      }
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <h4 className="text-base font-semibold mb-4 text-foreground">Pre-handover Payment</h4>
                                    <div className="mb-6">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500">0%</span>
                                        <span className="text-sm text-gray-500">100%</span>
                                      </div>
                                      <div className="relative w-full">
                                        <Slider
                                          value={[newProjectsPaymentPlan]}
                                          onValueChange={(value) => setNewProjectsPaymentPlan(value[0])}
                                          min={0}
                                          max={100}
                                          step={1}
                                          className="w-full"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className={`px-4 py-2 text-sm font-medium ${
                                          theme === 'opaque'
                                            ? 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100'
                                            : theme === 'green-white'
                                              ? 'bg-white border border-green-600 text-gray-800 hover:bg-gray-50'
                                              : 'bg-white border border-[#800000] text-gray-800 hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                          setNewProjectsPaymentPlan(100);
                                        }}
                                      >
                                        Reset
                                      </Button>
                                      <Button
                                        size="sm"
                                        className={`px-4 py-2 text-sm font-medium ${
                                          theme === 'opaque'
                                            ? 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100'
                                            : theme === 'green-white'
                                              ? 'bg-green-600 hover:bg-green-700 text-white'
                                              : 'bg-[#800000] hover:bg-[#700000] text-white'
                                        }`}
                                        onClick={() => {
                                          setOpenDropdown(null);
                                        }}
                                      >
                                        Done
                                      </Button>
                                    </div>
                                  </PopoverContent>
                                </Popover>

                                {/* % Completion */}
                                <Popover open={!isMobile && openDropdown === 'newProjectsCompletion'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('newProjectsCompletion'); }}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'newProjectsCompletion' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                    >
                                      <span className="text-sm font-medium">{newProjectsCompletion || '% Completion'}</span>
                                      <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'newProjectsCompletion' ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent 
                                    side="bottom" 
                                    align="start" 
                                    avoidCollisions={false} 
                                    className="w-[220px] sm:w-[260px] p-4"
                                    onInteractOutside={(e) => {
                                      const target = (e.target as Node) || null;
                                      if (desktopSearchRef.current?.contains(target)) {
                                        e.preventDefault();
                                        return;
                                      }
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <h4 className="text-base font-semibold mb-3 text-foreground">% Completion</h4>
                                    <div className="flex flex-col gap-1.5">
                                      {['Any', '0-25%', '25-50%', '50-75%', '75-100%'].map(opt => (
                                        <Button
                                          key={opt}
                                          variant={(opt === 'Any' ? newProjectsCompletion === '' : newProjectsCompletion === opt) ? 'default' : 'outline'}
                                          size="sm"
                                          className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm text-left justify-start"
                                          onClick={() => { setNewProjectsCompletion(opt === 'Any' ? '' : opt); setOpenDropdown(null); }}
                                        >
                                          {opt}
                                        </Button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            ) : (
                              <div className="flex sm:flex lg:grid lg:grid-cols-6 gap-1.5 sm:gap-2 lg:gap-3 w-full min-w-max lg:min-w-0">
                              {/* Status dropdown: All / Ready / Off-Plan (only for Buy) */}
                              {activeTab === 'buy' && (
                                <Popover open={!isMobile && openDropdown === 'status'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('status'); }}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'status' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                    >
                                      <span className="text-sm font-medium">
                                        {selectedConstructionStatus.length === 0 
                                          ? 'All' 
                                          : selectedConstructionStatus.includes('Ready') 
                                            ? 'Ready' 
                                            : selectedConstructionStatus.includes('Under Construction')
                                              ? 'Off-Plan'
                                              : 'All'}
                                      </span>
                                      <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'status' ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent 
                                    side="bottom" 
                                    align="start" 
                                    avoidCollisions={false} 
                                    className="w-[220px] sm:w-[260px] p-4"
                                    onInteractOutside={(e) => {
                                      const target = (e.target as Node) || null;
                                      if (desktopSearchRef.current?.contains(target)) {
                                        e.preventDefault();
                                        return;
                                      }
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <h4 className="text-base font-semibold mb-3 text-foreground">Status</h4>
                                    <div className="flex flex-col gap-1.5">
                                      <Button
                                        variant={selectedConstructionStatus.length === 0 ? 'default' : 'outline'}
                                        size="sm"
                                        className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm text-left justify-start"
                                        onClick={() => { setSelectedConstructionStatus([]); setOpenDropdown(null); }}
                                      >
                                        All
                                      </Button>
                                      <Button
                                        variant={selectedConstructionStatus.includes('Ready') && selectedConstructionStatus.length === 1 ? 'default' : 'outline'}
                                        size="sm"
                                        className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm text-left justify-start"
                                        onClick={() => { setSelectedConstructionStatus(['Ready']); setOpenDropdown(null); }}
                                      >
                                        Ready
                                      </Button>
                                      <Button
                                        variant={selectedConstructionStatus.includes('Under Construction') && selectedConstructionStatus.length === 1 ? 'default' : 'outline'}
                                        size="sm"
                                        className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm text-left justify-start"
                                        onClick={() => { setSelectedConstructionStatus(['Under Construction']); setOpenDropdown(null); }}
                                      >
                                        Off-Plan
                                      </Button>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                              {/* Rent Frequency - only for rent */}
                              {activeTab === 'rent' && (
                                <Popover open={!isMobile && openDropdown === 'frequency'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('frequency'); }}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'frequency' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                    >
                                      <span className="text-sm font-medium">{rentFrequency}</span>
                                      <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'frequency' ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent 
                                    side="bottom" 
                                    align="start" 
                                    avoidCollisions={false} 
                                    className="w-[220px] sm:w-[260px] p-4"
                                    onInteractOutside={(e) => {
                                      const target = (e.target as Node) || null;
                                      if (desktopSearchRef.current?.contains(target)) {
                                        e.preventDefault();
                                        return;
                                      }
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <h4 className="text-base font-semibold mb-3 text-foreground">Payment Frequency</h4>
                                    <div className="flex flex-col gap-1.5">
                                      {rentFrequencyOptions.map(opt => (
                                        <Button
                                          key={opt}
                                          variant={rentFrequency === opt ? 'default' : 'outline'}
                                          size="sm"
                                          className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-sm text-left justify-start"
                                          onClick={() => { setRentFrequency(opt); setOpenDropdown(null); }}
                                        >
                                          {opt}
                                        </Button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            {/* Property type: Property Type or Land/Space Type */}
                            <Popover open={!isMobile && openDropdown === 'propertyType'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('propertyType'); }}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'propertyType' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                >
                                  <span className="text-sm font-medium">{activeTab === 'land' ? 'Land Type' : activeTab === 'commercial' ? 'Space Type' : 'Property Type'}</span>
                                  <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'propertyType' ? 'rotate-90' : ''}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent 
                                side="bottom" 
                                align="start" 
                                avoidCollisions={false} 
                                className="w-[300px] sm:w-[350px] p-4"
                                onInteractOutside={(e) => {
                                  const target = (e.target as Node) || null;
                                  if (desktopSearchRef.current?.contains(target)) {
                                    e.preventDefault();
                                    return;
                                  }
                                  setOpenDropdown(null);
                                }}
                              >
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
                            <Popover open={!isMobile && openDropdown === 'bedroom'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('bedroom'); }}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'bedroom' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                >
                                  <span className="text-sm font-medium">Bedroom</span>
                                  <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'bedroom' ? 'rotate-90' : ''}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent 
                                side="bottom" 
                                align="start" 
                                avoidCollisions={false} 
                                className="w-[280px] sm:w-[320px] p-4"
                                onInteractOutside={(e) => {
                                  const target = (e.target as Node) || null;
                                  if (desktopSearchRef.current?.contains(target)) {
                                    e.preventDefault();
                                    return;
                                  }
                                  setOpenDropdown(null);
                                }}
                              >
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

                            {/* Availability removed for RENT */}
                            {false && (
                                <Popover open={!isMobile && openDropdown === 'availability'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('availability'); }}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'availability' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                    >
                                      <span className="text-sm font-medium">Availability</span>
                                      <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'availability' ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent 
                                    side="bottom" 
                                    align="start" 
                                    avoidCollisions={false} 
                                    className="w-[280px] sm:w-[320px] p-4"
                                    onInteractOutside={(e) => {
                                      const target = (e.target as Node) || null;
                                      if (desktopSearchRef.current?.contains(target)) {
                                        e.preventDefault();
                                        return;
                                      }
                                      setOpenDropdown(null);
                                    }}
                                  >
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
                            )}

                            {/* Furnishing */}
                            <Popover open={!isMobile && openDropdown === 'furnishing'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('furnishing'); }}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'furnishing' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                >
                                  <span className="text-sm font-medium">Furnishing</span>
                                  <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'furnishing' ? 'rotate-90' : ''}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent 
                                side="bottom" 
                                align="start" 
                                avoidCollisions={false} 
                                className="w-[220px] sm:w-[260px] p-4"
                                onInteractOutside={(e) => {
                                  const target = (e.target as Node) || null;
                                  if (desktopSearchRef.current?.contains(target)) {
                                    e.preventDefault();
                                    return;
                                  }
                                  setOpenDropdown(null);
                                }}
                              >
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
                            <Popover open={!isMobile && openDropdown === 'budget'} onOpenChange={(open) => { if (!isMobile && open) setOpenDropdown('budget'); }}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`flex-shrink-0 lg:w-full flex items-center justify-between whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm bg-white/80 backdrop-blur-md ${openDropdown === 'budget' ? 'bg-white/95 border-[#800000] shadow-sm' : 'border-[#800000]/50 hover:border-[#800000]/70 hover:bg-white/90'}`}
                                >
                                  <span className="text-sm font-medium">Budget</span>
                                  <ChevronRight size={14} className={`transition-transform duration-200 ${openDropdown === 'budget' ? 'rotate-90' : ''}`} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent 
                                side="bottom" 
                                align="start" 
                                avoidCollisions={false} 
                                className="w-[280px] sm:w-[320px] p-4"
                                onInteractOutside={(e) => {
                                  const target = (e.target as Node) || null;
                                  if (desktopSearchRef.current?.contains(target)) {
                                    e.preventDefault();
                                    return;
                                  }
                                  setOpenDropdown(null);
                                }}
                              >
                                <h4 className="text-base font-semibold mb-3 text-foreground">Budget Range</h4>
                                
                                {/* Min and Max Budget Dropdowns - Side by Side */}
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  {/* Min Budget Dropdown */}
                                  <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Minimum</label>
                                    {/* Selected Minimum display */}
                                    <div className="mb-1">
                                      <input
                                        readOnly
                                        value={`AED ${budget[0].toLocaleString()}`}
                                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white/70 backdrop-blur-sm"
                                      />
                                    </div>
                                    <div className="border border-[#800000]/50 rounded-lg overflow-hidden max-h-[150px] overflow-y-auto">
                                    {activeTab === 'rent' ? (
                                      <>
                                        {(() => {
                                          // Rent: 20,000 to 910,000 in increments
                                          const rentMinOptions = [];
                                          for (let i = 20000; i <= 910000; i += i < 100000 ? 10000 : (i < 500000 ? 25000 : 50000)) {
                                            rentMinOptions.push(i);
                                          }
                                          return rentMinOptions.map((val) => (
                                            <button
                                              key={val}
                                              type="button"
                                              onClick={() => {
                                                const newMin = val;
                                                // Ensure max is greater than new min
                                                const maxOptions = [50000, 75000, 100000, 125000, 150000, 175000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1010000];
                                                const validMax = maxOptions.find(m => m > newMin) || 1010000;
                                                const newMax = budget[1] <= newMin ? validMax : budget[1];
                                                setBudget([newMin, newMax]);
                                              // Close dropdown after selection
                                              setOpenDropdown(null);
                                              }}
                                              className={`w-full text-left px-3 py-2 text-sm hover:bg-[#800000]/10 transition-colors border-b border-gray-100 last:border-b-0 truncate ${
                                                budget[0] === val ? 'bg-[#800000]/20 text-[#800000] font-medium' : 'text-gray-700'
                                              }`}
                                            >
                                              {`AED ${val.toLocaleString()}`}
                                            </button>
                                          ));
                                        })()}
                                      </>
                                    ) : (
                                      <>
                                        {(() => {
                                          // Buy: 200,000 to 9,000,000 in increments
                                          const buyMinOptions = [];
                                          for (let i = 200000; i <= 9000000; i += i < 2000000 ? 100000 : (i < 5000000 ? 250000 : 500000)) {
                                            buyMinOptions.push(i);
                                          }
                                          return buyMinOptions.map((val) => (
                                            <button
                                              key={val}
                                              type="button"
                                              onClick={() => {
                                                const newMin = val;
                                                // Ensure max is greater than new min
                                                const maxOptions = [400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 9500000, 10000000];
                                                const validMax = maxOptions.find(m => m > newMin) || 10000000;
                                                const newMax = budget[1] <= newMin ? validMax : budget[1];
                                                setBudget([newMin, newMax]);
                                              setOpenDropdown(null);
                                              }}
                                              className={`w-full text-left px-3 py-2 text-sm hover:bg-[#800000]/10 transition-colors border-b border-gray-100 last:border-b-0 truncate ${
                                                budget[0] === val ? 'bg-[#800000]/20 text-[#800000] font-medium' : 'text-gray-700'
                                              }`}
                                            >
                                              {`AED ${val.toLocaleString()}`}
                                            </button>
                                          ));
                                        })()}
                                      </>
                                    )}
                                  </div>
                                  </div>

                                  {/* Max Budget Dropdown */}
                                  <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Maximum</label>
                                    {/* Selected Maximum display */}
                                    <div className="mb-1">
                                      <input
                                        readOnly
                                        value={`AED ${budget[1].toLocaleString()}`}
                                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white/70 backdrop-blur-sm"
                                      />
                                    </div>
                                    <div className="border border-[#800000]/50 rounded-lg overflow-hidden max-h-[150px] overflow-y-auto">
                                    {activeTab === 'rent' ? (
                                      <>
                                        {(() => {
                                          // Rent: 50,000 to 1,010,000, but only show values greater than selected min
                                          const rentMaxOptions = [50000, 75000, 100000, 125000, 150000, 175000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1010000];
                                          // Filter to only show options greater than selected minimum
                                          const validMaxOptions = rentMaxOptions.filter(val => val > budget[0]);
                                          return (
                                            <>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setBudget([budget[0], 1010000]);
                                                setOpenDropdown(null);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#800000]/10 transition-colors border-b border-gray-100 truncate ${
                                                  budget[1] >= 1010000 ? 'bg-[#800000]/20 text-[#800000] font-medium' : 'text-gray-700'
                                                }`}
                                              >
                                                Any
                                              </button>
                                              {validMaxOptions.map((val) => (
                                                <button
                                                  key={val}
                                                  type="button"
                                                  onClick={() => {
                                                    setBudget([budget[0], val]);
                                                    setOpenDropdown(null);
                                                  }}
                                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[#800000]/10 transition-colors border-b border-gray-100 last:border-b-0 truncate ${
                                                    budget[1] === val ? 'bg-[#800000]/20 text-[#800000] font-medium' : 'text-gray-700'
                                                  }`}
                                                >
                                                  {`AED ${val.toLocaleString()}`}
                                                </button>
                                              ))}
                                            </>
                                          );
                                        })()}
                                      </>
                                    ) : (
                                      <>
                                        {(() => {
                                          // Buy: 400,000 to 10,000,000, but only show values greater than selected min
                                          const buyMaxOptions = [400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 9500000, 10000000];
                                          // Filter to only show options greater than selected minimum
                                          const validMaxOptions = buyMaxOptions.filter(val => val > budget[0]);
                                          return (
                                            <>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setBudget([budget[0], 10000000]);
                                                setOpenDropdown(null);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#800000]/10 transition-colors border-b border-gray-100 truncate ${
                                                  budget[1] >= 10000000 ? 'bg-[#800000]/20 text-[#800000] font-medium' : 'text-gray-700'
                                                }`}
                                              >
                                                Any
                                              </button>
                                              {validMaxOptions.map((val) => (
                                                <button
                                                  key={val}
                                                  type="button"
                                                  onClick={() => {
                                                    setBudget([budget[0], val]);
                                                    setOpenDropdown(null);
                                                  }}
                                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[#800000]/10 transition-colors border-b border-gray-100 last:border-b-0 truncate ${
                                                    budget[1] === val ? 'bg-[#800000]/20 text-[#800000] font-medium' : 'text-gray-700'
                                                  }`}
                                                >
                                                  {`AED ${val.toLocaleString()}`}
                                                </button>
                                              ))}
                                            </>
                                          );
                                        })()}
                                      </>
                                    )}
                                  </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            </div>
                            )}
                          </div>
                        </div>
                        )}
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

                    {/* (Removed) External filter row now integrated inside the search box */}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacing section - now with transparent background to show hero image */}
      <div className="relative -mt-8 sm:-mt-10 md:-mt-12 pt-2 sm:pt-4 md:pt-10 pb-4 sm:pb-8 mx-0 px-0 mb-8 sm:mb-12 md:mb-16 py-[6px] z-0">
        <div className="container mx-auto px-2 sm:px-4">
          {/* This space allows the search section to overlap properly */}
        </div>
      </div>

      {/* Mortgease Partnership Badge - UAE Only */}
      {(window.location.hostname === 'homehni.ae' || window.location.hostname === 'www.homehni.ae') && (
        <div className="py-6 md:py-4 mt-20 sm:mt-0">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center">
                <img src={mortgeaseLogo} alt="Mortgease" className="h-20 md:h-24 lg:h-28 object-contain" />
              </div>
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">
                  Official Channel Partner for Home Finance
                </h3>
                <a 
                  href="https://www.mortgease.ae" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors text-base md:text-lg"
                >
                  <span>Explore Mortgease Services</span>
                  <ChevronRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});
SearchSection.displayName = 'SearchSection';
export default SearchSection;
