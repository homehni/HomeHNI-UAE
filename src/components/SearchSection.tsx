import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { MapPin, X, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCMSContent } from '@/hooks/useCMSContent';
export interface SearchSectionRef {
  focusSearchInput: () => void;
}
// Minimal Google Places typings to avoid 'any'
type GPlaceComponent = { long_name: string; short_name: string; types: string[] };
type PlaceResultMinimal = {
  formatted_address?: string;
  name?: string;
  address_components?: GPlaceComponent[];
};
type GAutocomplete = {
  getPlace: () => PlaceResultMinimal | undefined;
  addListener: (eventName: string, handler: () => void) => void;
};
type PlacesNamespace = { Autocomplete: new (input: HTMLInputElement, opts: unknown) => GAutocomplete };
type GoogleMaps = { places?: PlacesNamespace };
type GoogleNS = { maps?: GoogleMaps };
type WindowWithGoogle = Window & { google?: GoogleNS };
const SearchSection = forwardRef<SearchSectionRef>((_, ref) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  // Dropdown filter UI state (UI-only for homepage)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState<string[]>([]);
  const [selectedFurnishing, setSelectedFurnishing] = useState<string[]>([]);
  const [budget, setBudget] = useState<[number, number]>([0, 500000]);
  const [area, setArea] = useState<[number, number]>([0, 10000]);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileAcInitRef = useRef(false);
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false);
  const { content: cmsContent } = useCMSContent('hero-search');

  const addLocation = (location: string) => {
    if (location.trim() && selectedLocations.length < 3 && !selectedLocations.includes(location.trim())) {
      setSelectedLocations([...selectedLocations, location.trim()]);
      setSearchQuery('');
    }
  };

  const removeLocation = (location: string) => {
    const updated = selectedLocations.filter(loc => loc !== location);
    setSelectedLocations(updated);
    if (updated.length === 0) {
      setSelectedCity('');
    }
  };

  const handleSearch = () => {
    // If there's text in the input and we haven't reached the limit, add it as a location
    if (searchQuery.trim() && selectedLocations.length < 3 && !selectedLocations.includes(searchQuery.trim())) {
      const locationsToSearch = [...selectedLocations, searchQuery.trim()];
      navigateToSearch(locationsToSearch);
    } else {
      // Navigate even if there are no locations; filters still apply on results page
      navigateToSearch(selectedLocations);
    }
    // Do nothing if no locations - button will be disabled
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

    // Bedrooms (not for land)
    if (activeTab !== 'land' && selectedBedrooms.length > 0) {
      const bhkValues = mapBhkSelectionsToFilters(selectedBedrooms);
      params.set('bhk', bhkValues.join(','));
    }

    // Availability and Construction (not for land)
    if (activeTab !== 'land') {
      const availabilityVals = selectedConstructionStatus
        .map(mapStatusToAvailability)
        .filter(Boolean) as string[];
      if (availabilityVals.length > 0) params.set('availability', availabilityVals.join(','));
      const constructionVals = selectedConstructionStatus
        .map(mapStatusToConstruction)
        .filter(Boolean) as string[];
      if (constructionVals.length > 0) params.set('construction', constructionVals.join(','));
    }

    // Budget
    if (budget[0] > 0) params.set('budgetMin', String(budget[0]));
    if (budget[1] < getBudgetSliderMaxHome(activeTab)) params.set('budgetMax', String(budget[1]));

    // Area
    if (area[0] > 0) params.set('areaMin', String(area[0]));
    if (area[1] < 10000) params.set('areaMax', String(area[1]));

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
      if (searchQuery.trim() && selectedLocations.length < 3) {
        addLocation(searchQuery);
      } else {
        handleSearch();
      }
    }
  };
  const navigationTabs = [{
    id: 'buy',
    label: 'BUY'
  }, {
    id: 'rent',
    label: 'RENT'
  }, {
    id: 'commercial',
    label: 'COMMERCIAL'
  }, {
    id: 'land',
    label: 'LAND/PLOT'
  }];
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
      const options = {
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        types: ['geocode'],
        componentRestrictions: {
          country: 'in' as const
        }
      };
      const inputs = [inputRef.current].filter(Boolean) as HTMLInputElement[];
      inputs.forEach(el => {
        const ac = new w.google!.maps!.places!.Autocomplete(el, options);
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
            const cityComponent = addressComponents.find((comp: GPlaceComponent) =>
              comp.types.includes('locality') ||
              comp.types.includes('administrative_area_level_2') ||
              comp.types.includes('administrative_area_level_1')
            );
            if (cityComponent) {
              cityName = cityComponent.long_name;
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
            // Enforce same-city rule: once first city is selected, next selections must be from same city
            const canAddInCity = () => {
              if (!selectedCity) return true;
              if (!cityName) return true; // if API didn't provide city, don't block
              return cityName.toLowerCase() === selectedCity.toLowerCase();
            };

            // Auto-add location if under limit and city matches (if selectedCity set)
            if (selectedLocations.length < 3 && !selectedLocations.includes(value) && canAddInCity()) {
              console.log('✅ Google Places - Adding location:', value);
              setSelectedLocations(prev => {
                const newList = [...prev, value];
                console.log('✅ Google Places - New locations list:', newList);
                return newList;
              });
              // Set selected city from first selection
              if (!selectedCity && cityName) {
                setSelectedCity(cityName);
              }
              el.value = '';
              setSearchQuery('');
            } else if (!canAddInCity()) {
              console.warn('⚠️ Location must be within selected city:', selectedCity);
              // Provide subtle UX hint by clearing and setting placeholder
              el.value = '';
              setSearchQuery('');
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
  }, []); // Intentionally empty dependency array to avoid reinitializing autocomplete

  // Initialize Google Places for mobile overlay input when overlay opens
  useEffect(() => {
    if (!isMobileOverlayOpen) return;
    const w = window as WindowWithGoogle;
    if (!mobileInputRef.current) return;
    if (!w.google?.maps?.places) return;
    if (mobileAcInitRef.current) return;

    const options = {
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      types: ['geocode'],
      componentRestrictions: { country: 'in' as const },
    };
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
          comp.types.includes('locality') ||
          comp.types.includes('administrative_area_level_2') ||
          comp.types.includes('administrative_area_level_1')
        );
        if (cityComponent) cityName = cityComponent.long_name;
        if (localityComponent) {
          value = localityComponent.long_name;
        } else {
          const firstPart = value.split(',')[0].trim();
          if (firstPart) value = firstPart;
        }
      }

      if (value) {
        const canAddInCity = () => {
          if (!selectedCity) return true;
          if (!cityName) return true;
          return cityName.toLowerCase() === selectedCity.toLowerCase();
        };
        if (selectedLocations.length < 3 && !selectedLocations.includes(value) && canAddInCity()) {
          setSelectedLocations(prev => [...prev, value]);
          if (!selectedCity && cityName) setSelectedCity(cityName);
          if (mobileInputRef.current) mobileInputRef.current.value = '';
          setSearchQuery('');
        } else if (!canAddInCity()) {
          if (mobileInputRef.current) mobileInputRef.current.value = '';
          setSearchQuery('');
        } else {
          if (mobileInputRef.current) mobileInputRef.current.value = value;
          setSearchQuery(value);
        }
      }
    });
    mobileAcInitRef.current = true;
    // Focus after a tick to ensure keyboard opens
    setTimeout(() => mobileInputRef.current?.focus(), 50);
  }, [isMobileOverlayOpen, selectedCity, selectedLocations]);

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
      backgroundPosition: 'center calc(50% - 2%)'
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
                  {selectedLocations.length >= 3 ? 'Max 3 locations' : selectedCity ? `Add locality in ${selectedCity}` : 'Add Locality/Project/Landmark'}
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

                  {/* Bedroom (not for land) */}
                  {activeTab !== 'land' && (
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

                  {/* Property Status (not for land) */}
                  {activeTab !== 'land' && (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setOpenDropdown('construction'); setIsMobileOverlayOpen(true); }}
                      className={`h-9 text-xs flex items-center gap-1`}
                    >
                      Property Status <ChevronRight size={14} />
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

                  {/* Area */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setOpenDropdown('area'); setIsMobileOverlayOpen(true); }}
                      className={`h-9 text-xs flex items-center gap-1`}
                    >
                      Area <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Full-screen Search Overlay */}
        {isMobileOverlayOpen && (
          <div className="sm:hidden fixed inset-0 z-[60] bg-white flex flex-col">
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
              {/* Chips */}
              {selectedLocations.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedLocations.map((location, index) => (
                    <div key={index} className="inline-flex items-center gap-1 bg-brand-red text-white px-3 py-1.5 rounded-full text-sm font-medium">
                      {location}
                      <button onClick={() => removeLocation(location)} className="ml-1 hover:bg-brand-red-dark rounded-full p-0.5">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Input */}
              <div className="relative">
                <input
                  ref={mobileInputRef}
                  type="text"
                  placeholder={selectedLocations.length >= 3 ? 'Max 3 locations' : selectedCity ? `Add locality in ${selectedCity}` : 'Add Locality/Project/Landmark'}
                  defaultValue={searchQuery}
                  onKeyPress={handleKeyPress}
                  disabled={selectedLocations.length >= 3}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-base disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>

              {/* Filters row inside overlay (mobile) */}
              <div className="mt-4">
                <div className="overflow-x-auto -mx-1 px-1">
                  <div className="flex gap-2 min-w-max">
                    {/* Property Type - only for non-commercial */}
                    {activeTab !== 'commercial' && (
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'propertyType' ? null : 'propertyType')}
                          className={`h-9 text-xs flex items-center gap-1 ${openDropdown === 'propertyType' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          {activeTab === 'land' ? 'Land Type' : 'Property Type'} <ChevronRight size={14} className={`transition-transform ${openDropdown === 'propertyType' ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    )}

                    {/* Bedroom */}
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

                    {/* Property Status */}
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

                    {/* Area */}
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOpenDropdown(openDropdown === 'area' ? null : 'area')}
                        className={`h-9 text-xs flex items-center gap-1 ${openDropdown === 'area' ? 'bg-blue-50 border-blue-400' : ''}`}
                      >
                        Area <ChevronRight size={14} className={`transition-transform ${openDropdown === 'area' ? 'rotate-90' : ''}`} />
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
                  {openDropdown === 'bedroom' && activeTab !== 'land' && (
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
                  {openDropdown === 'construction' && activeTab !== 'land' && (
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
                  {openDropdown === 'area' && (
                    <div>
                      <div className="text-xs text-gray-500 mb-2">{area[0]} - {area[1] >= 10000 ? '10,000+': area[1].toLocaleString()} sq ft</div>
                      <Slider value={area} onValueChange={(v) => setArea(v as [number, number])} min={0} max={10000} step={100} />
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
                  if (mobileInputRef.current) mobileInputRef.current.value = '';
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
  <div className="hidden sm:block absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-50">
          <div className="max-w-4xl mx-auto px-2 sm:px-4">
            <div className="max-w-6xl mx-auto">
              {/* Navigation Tabs */}
              <div className="bg-white rounded-t-lg shadow-xl border border-gray-100">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-transparent p-0 h-auto rounded-none border-b border-gray-200">
                    {navigationTabs.map(tab => <TabsTrigger key={tab.id} value={tab.id} className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all rounded-none border-b-2 border-transparent data-[state=active]:border-brand-red data-[state=active]:text-brand-red data-[state=active]:bg-brand-red/5 data-[state=active]:font-bold hover:bg-brand-red/5">
                        {tab.label}
                      </TabsTrigger>)}
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-0 px-3 sm:px-6 py-2 bg-white rounded-b-lg">
                    {/* Selected Location Tags */}
                    {selectedLocations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedLocations.map((location, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center gap-1 bg-brand-red text-white px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            {location}
                            <button
                              onClick={() => removeLocation(location)}
                              className="ml-1 hover:bg-brand-red-dark rounded-full p-0.5"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Search Bar */}
                    <div className="flex gap-3 sm:gap-4 items-stretch">
                      {/* Search Input */}
                      <div className="flex-1 relative">
                         <MapPin className="absolute left-3 top-3 text-brand-red" size={16} />
                         <Input 
                           ref={inputRef} 
                           placeholder={selectedLocations.length >= 3 ? "Max 3 locations selected" : selectedCity ? `Add locality in ${selectedCity}` : selectedLocations.length > 0 ? `Add location ${selectedLocations.length + 1}/3` : "Search locality..."} 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onKeyPress={handleKeyPress}
                           disabled={selectedLocations.length >= 3}
                           className="pl-9 h-10 sm:h-12 border-brand-red text-brand-red placeholder-brand-red/60 text-sm disabled:opacity-50" 
                         />
                      </div>
                      
                      {/* Search Button */}
                      <Button 
                        onClick={handleSearch}
                        className="h-10 sm:h-12 px-4 sm:px-8 bg-brand-red hover:bg-brand-red-dark text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Search
                      </Button>
                    </div>

                    {/* Desktop: Collapsible Filter Dropdowns */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {/* Property type: Property Type or Land Type */}
                      {activeTab !== 'commercial' && (
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpenDropdown(openDropdown === 'propertyType' ? null : 'propertyType')}
                            className={`flex items-center gap-1 ${openDropdown === 'propertyType' ? 'bg-blue-50 border-blue-400' : ''}`}
                          >
                            <span className="text-sm">{activeTab === 'land' ? 'Land Type' : 'Property Type'}</span>
                            <ChevronRight size={14} className={`transition-transform ${openDropdown === 'propertyType' ? 'rotate-90' : ''}`} />
                          </Button>
                          {openDropdown === 'propertyType' && (
                            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[280px] md:min-w-[400px]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bedroom (not for land) */}
                      {activeTab !== 'land' && (
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'bedroom' ? null : 'bedroom')}
                          className={`flex items-center gap-1 ${openDropdown === 'bedroom' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          <span className="text-sm">Bedroom</span>
                          <ChevronRight size={14} className={`transition-transform ${openDropdown === 'bedroom' ? 'rotate-90' : ''}`} />
                        </Button>
                        {openDropdown === 'bedroom' && (
                          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[280px] md:min-w-[360px]">
                            <h4 className="text-sm font-semibold mb-3">Number of Bedrooms</h4>
                            <div className="flex flex-wrap gap-2">
                              {['1 RK/1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map(bhk => (
                                <Button
                                  key={bhk}
                                  variant={selectedBedrooms.includes(bhk) ? 'default' : 'outline'}
                                  size="sm"
                                  className="text-xs px-3"
                                  onClick={() => {
                                    setSelectedBedrooms(prev => prev.includes(bhk) ? prev.filter(b => b !== bhk) : [...prev, bhk]);
                                  }}
                                >
                                  + {bhk}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      )}

                      {/* Property Status (not for land) */}
                      {activeTab !== 'land' && (
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'construction' ? null : 'construction')}
                          className={`flex items-center gap-1 ${openDropdown === 'construction' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          <span className="text-sm">Property Status</span>
                          <ChevronRight size={14} className={`transition-transform ${openDropdown === 'construction' ? 'rotate-90' : ''}`} />
                        </Button>
                        {openDropdown === 'construction' && (
                          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[280px] md:min-w-[360px]">
                            <h4 className="text-sm font-semibold mb-3">Property Status</h4>
                            <div className="flex flex-wrap gap-2">
                              {['Under Construction', 'Ready'].map(status => (
                                <Button
                                  key={status}
                                  variant={selectedConstructionStatus.includes(status) ? 'default' : 'outline'}
                                  size="sm"
                                  className="text-xs px-3"
                                  onClick={() => {
                                    setSelectedConstructionStatus(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
                                  }}
                                >
                                  + {status}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      )}

                      {/* Furnishing */}
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'furnishing' ? null : 'furnishing')}
                          className={`flex items-center gap-1 ${openDropdown === 'furnishing' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          <span className="text-sm">Furnishing</span>
                          <ChevronRight size={14} className={`transition-transform ${openDropdown === 'furnishing' ? 'rotate-90' : ''}`} />
                        </Button>
                        {openDropdown === 'furnishing' && (
                          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[240px]">
                            <h4 className="text-sm font-semibold mb-3">Furnishing</h4>
                            <div className="flex flex-wrap gap-2">
                              {['Full', 'Semi', 'None'].map(level => (
                                <Button
                                  key={level}
                                  variant={selectedFurnishing.includes(level) ? 'default' : 'outline'}
                                  size="sm"
                                  className="text-xs px-3"
                                  onClick={() => {
                                    setSelectedFurnishing(prev => prev.includes(level) ? prev.filter(p => p !== level) : [...prev, level]);
                                  }}
                                >
                                  + {level}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Budget */}
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
                          className={`flex items-center gap-1 ${openDropdown === 'budget' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          <span className="text-sm">Budget</span>
                          <ChevronRight size={14} className={`transition-transform ${openDropdown === 'budget' ? 'rotate-90' : ''}`} />
                        </Button>
                        {openDropdown === 'budget' && (
                          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[320px] md:min-w-[400px]">
                            <h4 className="text-sm font-semibold mb-3">Select Price Range</h4>
                            <div className="text-xs text-gray-500 mb-2">
                              ₹{formatBudget(budget[0])} - ₹{activeTab === 'rent' && budget[1] >= 500000 ? '5L +' : formatBudget(budget[1])}
                            </div>
                            <Slider value={budget} onValueChange={(v) => setBudget(v as [number, number])} min={0} max={getBudgetSliderMaxHome(activeTab)} step={getBudgetSliderStepHome(activeTab)} />
                          </div>
                        )}
                      </div>

                      {/* Area */}
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenDropdown(openDropdown === 'area' ? null : 'area')}
                          className={`flex items-center gap-1 ${openDropdown === 'area' ? 'bg-blue-50 border-blue-400' : ''}`}
                        >
                          <span className="text-sm">Area</span>
                          <ChevronRight size={14} className={`transition-transform ${openDropdown === 'area' ? 'rotate-90' : ''}`} />
                        </Button>
                        {openDropdown === 'area' && (
                          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[320px] md:min-w-[400px]">
                            <h4 className="text-sm font-semibold mb-3">Select Area (Sq. Ft.)</h4>
                            <div className="text-xs text-gray-500 mb-2">{area[0]} - {area[1] >= 10000 ? '10,000+': area[1].toLocaleString()} sq ft</div>
                            <Slider value={area} onValueChange={(v) => setArea(v as [number, number])} min={0} max={10000} step={100} />
                          </div>
                        )}
                      </div>

                      {/* Clear (UI only) */}
                      {(selectedPropertyTypes.length || selectedBedrooms.length || selectedConstructionStatus.length || selectedFurnishing.length) > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => {
                            setSelectedPropertyTypes([]);
                            setSelectedBedrooms([]);
                            setSelectedConstructionStatus([]);
                            setSelectedFurnishing([]);
                            setBudget([0, getBudgetSliderMaxHome(activeTab)]);
                            setArea([0, 10000]);
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
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
        return ['Flat/Apartment', 'Independent House', 'Villa', 'Penthouse', 'Duplex'];
      case 'buy':
        return ['Apartment', 'Villa', 'Independent House', 'Penthouse', 'Duplex', 'Gated Community Villa'];
      case 'commercial':
        return ['Office', 'Retail', 'Warehouse', 'Showroom', 'Restaurant', 'Co-Working', 'Industrial'];
      case 'land':
        return ['Residential Plot', 'Commercial Land', 'Industrial Land', 'Agricultural Land'];
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
      'Residential Plot': 'RESIDENTIAL PLOT',
      'Commercial Land': 'COMMERCIAL LAND',
      'Industrial Land': 'INDUSTRIAL LAND',
      'Agricultural Land': 'AGRICULTURAL LAND',
      'Office': 'OFFICE',
      'Retail': 'RETAIL',
      'Warehouse': 'WAREHOUSE',
      'Showroom': 'SHOWROOM',
      'Restaurant': 'RESTAURANT',
      'Industrial': 'INDUSTRIAL',
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