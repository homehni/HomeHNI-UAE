import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCMSContent } from '@/hooks/useCMSContent';
export interface SearchSectionRef {
  focusSearchInput: () => void;
}
const SearchSection = forwardRef<SearchSectionRef>((_, ref) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const { content: cmsContent } = useCMSContent('hero-search');
  const handleSearch = () => {
    const params = new URLSearchParams({
      type: activeTab,
      location: searchQuery.trim()
    });
    
    // For commercial search, we need to determine if user wants to buy or rent
    // Since commercial can be both, we'll default to 'buy' for now
    // The user can then switch tabs on the search page
    if (activeTab === 'commercial') {
      params.set('type', 'buy'); // Default to buy for commercial
      params.set('propertyType', 'COMMERCIAL');
    }
    
    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
            el.value = value;
            setSearchQuery(value);
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
      {/* Hero Image Background - extends to cover marquee area */}
      <div className="relative h-[50vh] sm:h-[60vh] bg-cover bg-no-repeat -mt-[70px] pt-[40px]" style={{
      backgroundImage: `url(${cmsContent?.content?.heroImage || '/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png'})`,
      backgroundPosition: 'center calc(50% - 2%)'
    }}>
        {/* Mobile Search Section - overlapping 50% at bottom of hero */}
        <div className="sm:hidden absolute bottom-8 left-4 right-4 transform translate-y-1/2">
          <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-4">
            {/* Search Input and Button */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-red" />
                <input 
                  ref={mobileInputRef} 
                  type="text" 
                  placeholder="Search 'Sector 150 Noida'" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-brand-red rounded-lg text-brand-red placeholder-brand-red/60 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent" 
                />
              </div>
              
              <Button 
                onClick={handleSearch}
                className="h-12 px-6 bg-brand-red hover:bg-brand-red-dark text-white font-medium whitespace-nowrap"
              >
                Search
              </Button>
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
                  <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto rounded-none border-b border-gray-200">
                    {navigationTabs.map(tab => <TabsTrigger key={tab.id} value={tab.id} className="px-6 py-4 text-sm font-medium transition-all rounded-none border-b-2 border-transparent data-[state=active]:border-brand-red data-[state=active]:text-brand-red data-[state=active]:bg-brand-red/5 data-[state=active]:font-bold hover:bg-brand-red/5">
                        {tab.label}
                      </TabsTrigger>)}
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-0 px-6 py-2 bg-white rounded-b-lg">
                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                         <MapPin className="absolute left-3 top-3 text-brand-red" size={20} />
                         <Input 
                           ref={inputRef} 
                           placeholder="Search 'Noida'" 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onKeyPress={handleKeyPress}
                           className="pl-10 h-12 border-brand-red text-brand-red placeholder-brand-red/60" 
                         />
                      </div>
                      
                      <Button 
                        onClick={handleSearch}
                        className="h-12 px-8 bg-brand-red hover:bg-brand-red-dark text-white font-medium"
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
      
      {/* White background section to accommodate the overlapping search */}
      <div className="bg-white pt-4 sm:pt-16 pb-8 mx-0 px-0 mb-4 py-[6px]">
        <div className="container mx-auto px-4">
          {/* This space allows the search section to overlap properly */}
        </div>
      </div>
    </section>;
});
SearchSection.displayName = 'SearchSection';
export default SearchSection;