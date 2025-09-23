import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCMSContent } from '@/hooks/useCMSContent';
export interface SearchSectionRef {
  focusSearchInput: () => void;
}
const SearchSection = forwardRef<SearchSectionRef>((_, ref) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const { content: cmsContent } = useCMSContent('hero-search');

  const addLocation = (location: string) => {
    if (location.trim() && selectedLocations.length < 3 && !selectedLocations.includes(location.trim())) {
      setSelectedLocations([...selectedLocations, location.trim()]);
      setSearchQuery('');
    }
  };

  const removeLocation = (location: string) => {
    setSelectedLocations(selectedLocations.filter(loc => loc !== location));
  };

  const handleSearch = () => {
    // If there's text in the input and we haven't reached the limit, add it as a location
    if (searchQuery.trim() && selectedLocations.length < 3 && !selectedLocations.includes(searchQuery.trim())) {
      const locationsToSearch = [...selectedLocations, searchQuery.trim()];
      navigateToSearch(locationsToSearch);
    } else if (selectedLocations.length > 0) {
      navigateToSearch(selectedLocations);
    }
  };

  const navigateToSearch = (locations: string[]) => {
    const params = new URLSearchParams({
      type: activeTab,
      locations: locations.join(',')
    });
    
    // For commercial search, show all property types regardless of sale/rent
    if (activeTab === 'commercial') {
      // Don't set a specific property type - let it show all property types
      // Don't set a specific listing type - let it show both sale and rent
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
  }];
  useEffect(() => {
    const apiKey = 'AIzaSyD2rlXeHN4cm0CQD-y4YGTsob9a_27YcwY';
    const loadGoogleMaps = () => new Promise<void>((resolve, reject) => {
      if ((window as any).google?.maps?.places) {
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
      if (!(window as any).google?.maps?.places) return;
      const options = {
        fields: ['formatted_address', 'geometry', 'name'],
        types: ['geocode'],
        componentRestrictions: {
          country: 'in' as const
        }
      };
      const inputs = [inputRef.current, mobileInputRef.current].filter(Boolean) as HTMLInputElement[];
      inputs.forEach(el => {
        const ac = new (window as any).google.maps.places.Autocomplete(el, options);
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          let value = place?.formatted_address || place?.name || '';
          
          // Extract city name from formatted address for better matching
          if (value && place?.formatted_address) {
            // Extract city name from Google Places result
            const addressComponents = place.address_components || [];
            const cityComponent = addressComponents.find((comp: any) => 
              comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
            );
            if (cityComponent) {
              value = cityComponent.long_name;
            }
          }
          
          if (el && value) {
            // Auto-add location if under limit
            if (selectedLocations.length < 3 && !selectedLocations.includes(value)) {
              setSelectedLocations(prev => [...prev, value]);
              el.value = '';
              setSearchQuery('');
            } else {
              el.value = value;
              setSearchQuery(value);
            }
          }
        });
      });
    };
    loadGoogleMaps().then(initAutocomplete).catch(console.error);
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
      {/* Hero Image Background - mobile responsive */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] bg-cover bg-no-repeat md:-mt-[70px] md:pt-[40px]" style={{
      backgroundImage: `url(${cmsContent?.content?.heroImage || '/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png'})`,
      backgroundPosition: 'center calc(50% - 2%)'
    }}>
        {/* Mobile Search Section - overlapping 50% at bottom of hero */}
        <div className="sm:hidden absolute bottom-4 left-2 right-2 transform translate-y-1/2">
          <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-3">
            {/* Selected Location Tags */}
            {selectedLocations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedLocations.map((location, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {location}
                    <button
                      onClick={() => removeLocation(location)}
                      className="ml-1 hover:bg-teal-600 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search Input and Button */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-red" />
                <input 
                  ref={mobileInputRef} 
                  type="text" 
                  placeholder={selectedLocations.length >= 3 ? "Max 3 locations selected" : selectedLocations.length > 0 ? `Add location ${selectedLocations.length + 1}/3` : "Search 'Sector 150 Noida'"} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={selectedLocations.length >= 3}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-brand-red rounded-lg text-brand-red placeholder-brand-red/60 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-sm disabled:opacity-50" 
                />
              </div>
              
              <Button 
                onClick={handleSearch}
                disabled={selectedLocations.length === 0 && !searchQuery.trim()}
                className="h-10 px-4 bg-brand-red hover:bg-brand-red-dark text-white font-medium whitespace-nowrap text-sm disabled:opacity-50"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Search Section */}
        <div className="hidden sm:block absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="max-w-4xl mx-auto px-2 sm:px-4">
            <div className="max-w-6xl mx-auto">
              {/* Navigation Tabs */}
              <div className="bg-white rounded-t-lg shadow-xl border border-gray-100 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto rounded-none border-b border-gray-200">
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
                            className="inline-flex items-center gap-1 bg-teal-500 text-white px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            {location}
                            <button
                              onClick={() => removeLocation(location)}
                              className="ml-1 hover:bg-teal-600 rounded-full p-0.5"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="flex-1 relative">
                         <MapPin className="absolute left-3 top-3 text-brand-red" size={16} />
                         <Input 
                           ref={inputRef} 
                           placeholder={selectedLocations.length >= 3 ? "Max 3 locations selected" : selectedLocations.length > 0 ? `Add location ${selectedLocations.length + 1}/3` : "Search 'Anything'"} 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onKeyPress={handleKeyPress}
                           disabled={selectedLocations.length >= 3}
                           className="pl-9 h-10 sm:h-12 border-brand-red text-brand-red placeholder-brand-red/60 text-sm disabled:opacity-50" 
                         />
                      </div>
                      
                      <Button 
                        onClick={handleSearch}
                        disabled={selectedLocations.length === 0 && !searchQuery.trim()}
                        className="h-10 sm:h-12 px-4 sm:px-8 bg-brand-red hover:bg-brand-red-dark text-white font-medium text-sm disabled:opacity-50"
                      >
                        Search
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* White background section - mobile responsive */}
      <div className="bg-white pt-2 sm:pt-4 md:pt-16 pb-4 sm:pb-8 mx-0 px-0 mb-2 sm:mb-4 py-[6px]">
        <div className="container mx-auto px-2 sm:px-4">
          {/* This space allows the search section to overlap properly */}
        </div>
      </div>
    </section>;
});
SearchSection.displayName = 'SearchSection';
export default SearchSection;