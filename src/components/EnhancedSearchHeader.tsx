import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, X } from 'lucide-react';

interface EnhancedSearchHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filters: {
    locations: string[];
    location: string;
    selectedCity: string;
    budget: [number, number];
  };
  updateFilter: (key: string, value: string | string[] | [number, number]) => void;
  clearAllFilters: () => void;
  locationInputRef: React.RefObject<HTMLInputElement>;
  normalizeLocation: (location: string) => string;
  propertyTypes: string[];
  getBudgetSliderMax: (tab: string) => number;
  getBudgetSliderStep: (tab: string) => number;
  getValidBudgetValue: (budget: [number, number], tab: string) => [number, number];
}

export const EnhancedSearchHeader = ({
  activeTab,
  setActiveTab,
  filters,
  updateFilter,
  clearAllFilters,
  locationInputRef,
  normalizeLocation,
  propertyTypes,
  getBudgetSliderMax,
  getBudgetSliderStep,
  getValidBudgetValue,
}: EnhancedSearchHeaderProps) => {
  const canSearch = (filters.locations && filters.locations.length > 0) ||
    (typeof filters.location === 'string' && filters.location.trim().length > 0);
  return (
    <>
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="container mx-auto px-4 py-4">
          {/* Top Row: Tabs and Location Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center pt-4">
            {/* Search Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="grid w-full lg:w-auto grid-cols-3 bg-gray-100" role="tablist" aria-label="Property listing type">
                <TabsTrigger value="buy" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'buy'}>Buy</TabsTrigger>
                <TabsTrigger value="rent" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'rent'}>Rent</TabsTrigger>
                <TabsTrigger value="commercial" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'commercial'}>Commercial</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Main Search Bar with Multi-Location Support */}
            <div className="flex-1 w-full">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-brand-red z-10" size={20} />
                
                {/* Multi-Location Search Bar */}
                <div 
                  className="flex flex-wrap items-center gap-2 p-3 pl-10 pr-4 min-h-12 border border-brand-red rounded-lg focus-within:ring-2 focus-within:ring-brand-red/20 bg-white cursor-text"
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
                          const newLocations = filters.locations.filter((_, i: number) => i !== index);
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
                    className="flex-1 min-w-32 outline-none bg-transparent text-sm"
                    disabled={filters.locations.length >= 3}
                  />
                  
                  {/* Location Counter */}
                  {filters.locations.length >= 3 && (
                    <span className="text-gray-500 text-sm whitespace-nowrap">Max 3</span>
                  )}
                </div>
                
                {/* Clear All Locations Button */}
                {filters.locations.length > 0 && (
                  <div className="absolute right-3 top-3 z-10">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
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

            {/* Search Button - Mobile */}
            <Button
              className="w-full lg:hidden bg-brand-red hover:bg-brand-red-dark disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canSearch}
              onClick={() => { if (!canSearch) return; updateFilter('trigger', 'search'); }}
              title={!canSearch ? 'Enter a city or locality to search' : undefined}
            >
              Search
            </Button>
                    {/* Search Button - Desktop (inline with locality field) */}
                    <Button
                      className="hidden lg:inline-flex bg-brand-red hover:bg-brand-red-dark ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!canSearch}
                      onClick={() => { if (!canSearch) return; updateFilter('trigger', 'search'); }}
                      title={!canSearch ? 'Enter a city or locality to search' : undefined}
                    >
                      Search
                    </Button>
          </div>
        </div>
      </div>
    </>
  );
};
