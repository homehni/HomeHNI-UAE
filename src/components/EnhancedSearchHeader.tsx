import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, X, Search as SearchIcon } from 'lucide-react';
import '@/components/search-input.css';

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
  const canSearch = typeof filters.location === 'string' && filters.location.trim().length > 0;
  return (
    <>
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="container mx-auto px-4 py-4">
          {/* Top Row: Tabs and Location Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center pt-4">
            {/* Search Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="grid w-full lg:w-auto grid-cols-4 bg-gray-100" role="tablist" aria-label="Property listing type">
                <TabsTrigger value="buy" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'buy'}>BUY</TabsTrigger>
                <TabsTrigger value="rent" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'rent'}>RENT</TabsTrigger>
                <TabsTrigger value="commercial" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'commercial'}>COMMERCIAL</TabsTrigger>
                <TabsTrigger value="land" className="text-xs lg:text-sm" role="tab" aria-selected={activeTab === 'land'}>LAND/PLOT</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Main Search Bar - Single Location Style */}
            <div className="flex-1 w-full">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-red z-10" size={16} />
                
                {/* Search Input */}
                <input
                  ref={locationInputRef}
                  type="search"
                  role="combobox"
                  value={filters.location}
                  onChange={e => {
                    const normalizedLocation = normalizeLocation(e.target.value);
                    // Always update with direct text input value
                    updateFilter('location', normalizedLocation);
                    // If input is cleared, trigger search immediately
                    if (normalizedLocation === '') {
                      setTimeout(() => updateFilter('trigger', 'search'), 0);
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && filters.location.trim()) {
                      e.preventDefault();
                      updateFilter('trigger', 'search');
                    }
                  }}
                  placeholder='Add Locality/Project/Landmark'
                  className="w-full pl-9 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-base hide-clear-button"
                  autoComplete="off"
                  aria-autocomplete="both"
                />
                
                {/* Clear and Search Buttons */}
                {filters.location ? (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                      aria-label="Clear location"
                      onClick={() => {
                        updateFilter('locations', []);
                        updateFilter('location', '');
                        if (locationInputRef.current) {
                          locationInputRef.current.focus();
                        }
                        // Trigger search immediately on clear to update results
                        setTimeout(() => updateFilter('trigger', 'search'), 0);
                      }}
                    >
                      <X size={16} />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-brand-red/40"
                      aria-label="Search"
                      onClick={() => { 
                        if (canSearch) {
                          // Trigger search with current location value
                          updateFilter('trigger', 'search');
                        }
                      }}
                    >
                      <SearchIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-9 w-9 rounded-full text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-brand-red/40"
                    aria-label="Search"
                    onClick={() => { 
                      if (canSearch) {
                        // Trigger search with current location value
                        updateFilter('trigger', 'search');
                      }
                    }}
                  >
                    <SearchIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* No separate mobile or desktop search button needed */}
          </div>
        </div>
      </div>
    </>
  );
};
