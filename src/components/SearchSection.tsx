import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Search, Mic, MapPinIcon, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export interface SearchSectionRef {
  focusSearchInput: () => void;
}
const SearchSection = forwardRef<SearchSectionRef>((_, ref) => {
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedCity, setSelectedCity] = useState('All Residential');
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const cities = ['All Residential', 'Flat/Apartment', 'Independent Building/ Floor', 'Farm House', 'Villa', 'Plots', 'Independent House'];
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };
  const navigationTabs = [{
    id: 'buy',
    label: 'Buy'
  }, {
    id: 'rent',
    label: 'Rent'
  }, {
    id: 'new-launch',
    label: 'New Launch'
  }, {
    id: 'pg',
    label: 'PG / Co-living'
  }, {
    id: 'commercial',
    label: 'Commercial'
  }, {
    id: 'plots',
    label: 'Plots/Land'
  }, {
    id: 'projects',
    label: 'Projects'
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
          const value = place?.formatted_address || place?.name || '';
          if (el && value) el.value = value;
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
      {/* Hero Image Background - extends to cover marquee area */}
      <div className="relative h-[50vh] sm:h-[60vh] bg-cover bg-no-repeat -mt-[70px] pt-[40px]" style={{
      backgroundImage: `url(/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png)`,
      backgroundPosition: 'center calc(50% - 2%)'
    }}>
        {/* Mobile Search Section - overlapping 50% at bottom of hero */}
        <div className="sm:hidden absolute bottom-0 left-4 right-4 transform translate-y-1/2">
          <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-4">
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input ref={mobileInputRef} type="text" placeholder="Search 'Sector 150 Noida'" className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Mic className="w-5 h-5 text-blue-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Search Section positioned to overlap image and white background */}
        <div className="hidden sm:block absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="max-w-4xl mx-auto px-4">
            {/* Updated to match screenshot design exactly */}
            <div className="max-w-6xl mx-auto">
              {/* Navigation Tabs with exact screenshot styling */}
              <div className="bg-white rounded-t-lg shadow-xl border border-gray-100 overflow-hidden">
                {/* Tab Navigation - matching screenshot design exactly */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-7 bg-transparent p-0 h-auto rounded-none border-b border-gray-200">
                    {navigationTabs.map(tab => <TabsTrigger key={tab.id} value={tab.id} className={`px-6 py-4 text-sm font-medium transition-all rounded-none border-b-2 border-transparent data-[state=active]:border-brand-red data-[state=active]:text-brand-red data-[state=active]:bg-brand-red/5 data-[state=active]:font-bold hover:bg-brand-red/5 ${tab.id === 'new-launch' ? 'relative' : ''}`}>
                        {tab.label}
                        {tab.id === 'new-launch'}
                      </TabsTrigger>)}
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-0 p-6 bg-white rounded-b-lg">
                    {/* Property Type Dropdown and Search Bar - Now inline */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-40 h-12 border-gray-300 text-gray-700 font-medium text-sm justify-between hover:bg-gray-50 bg-white px-3">
                            <span>{selectedCity}</span>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
                          <div className="py-2">
                            {cities.map(city => <button key={city} onClick={() => handleCitySelect(city)} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                {city}
                              </button>)}
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <div className="flex-1 relative">
                         <MapPin className="absolute left-3 top-3 text-brand-red" size={20} />
                         <Input ref={inputRef} placeholder="Search 'Noida'" className="pl-10 h-12 border-brand-red text-brand-red placeholder-brand-red/60" />
                         <div className="absolute right-3 top-3 flex gap-2">
                          <button className="p-1 hover:bg-brand-red/10 rounded">
                            
                          </button>
                          <button className="p-1 hover:bg-brand-red/10 rounded">
                            <Mic className="w-5 h-5 text-brand-red" />
                          </button>
                        </div>
                      </div>
                      
                      <Button className="h-12 px-8 bg-brand-red hover:bg-brand-red-dark text-white font-medium">
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
      
      {/* White background section to accommodate the overlapping search */}
      <div className="bg-white pt-4 sm:pt-16 pb-16 mx-0 px-0 mb-[2%] py-[20px]">
        <div className="container mx-auto px-4">
          {/* This space allows the search section to overlap properly */}
        </div>
      </div>
    </section>;
});
SearchSection.displayName = 'SearchSection';
export default SearchSection;