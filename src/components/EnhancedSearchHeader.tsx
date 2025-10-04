import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, X, ChevronRight } from 'lucide-react';

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState<string[]>([]);
  const [selectedPostedBy, setSelectedPostedBy] = useState<string[]>([]);

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
            <Button className="w-full lg:hidden bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>

          {/* Second Row: Collapsible Filter Dropdowns */}
          <div className="mt-4 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Residential Dropdown (Property Type) - Only for Buy/Rent */}
              {activeTab !== 'commercial' && (
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenDropdown(openDropdown === 'propertyType' ? null : 'propertyType')}
                    className={`flex items-center gap-1 ${openDropdown === 'propertyType' ? 'bg-blue-50 border-blue-400' : ''}`}
                  >
                    <span className="text-sm">Residential</span>
                    <ChevronRight size={14} className={`transition-transform ${openDropdown === 'propertyType' ? 'rotate-90' : ''}`} />
                  </Button>
                  
                  {/* Property Type Dropdown */}
                  {openDropdown === 'propertyType' && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[280px] md:min-w-[400px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {propertyTypes.filter(type => type !== 'ALL').map(type => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`pt-${type}`}
                              checked={selectedPropertyTypes.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPropertyTypes([...selectedPropertyTypes, type]);
                                  updateFilter('propertyType', [...selectedPropertyTypes, type]);
                                } else {
                                  const updated = selectedPropertyTypes.filter(t => t !== type);
                                  setSelectedPropertyTypes(updated);
                                  updateFilter('propertyType', updated);
                                }
                              }}
                            />
                            <label htmlFor={`pt-${type}`} className="text-sm cursor-pointer capitalize">
                              {type.toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ')}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bedroom Dropdown */}
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
                
                {/* Bedroom Dropdown */}
                {openDropdown === 'bedroom' && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[280px] md:min-w-[360px]">
                    <h4 className="text-sm font-semibold mb-3">Number of Bedrooms</h4>
                    <div className="flex flex-wrap gap-2">
                      {['1 RK/1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map(bhk => (
                        <Button
                          key={bhk}
                          variant={selectedBedrooms.includes(bhk) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (selectedBedrooms.includes(bhk)) {
                              const updated = selectedBedrooms.filter(b => b !== bhk);
                              setSelectedBedrooms(updated);
                              const filterValues = updated.flatMap(b => {
                                if (b === '1 RK/1 BHK') return ['1 RK', '1 BHK'];
                                if (b === '4+ BHK') return ['5+ BHK'];
                                return [b];
                              });
                              updateFilter('bhkType', filterValues);
                            } else {
                              const updated = [...selectedBedrooms, bhk];
                              setSelectedBedrooms(updated);
                              const filterValues = updated.flatMap(b => {
                                if (b === '1 RK/1 BHK') return ['1 RK', '1 BHK'];
                                if (b === '4+ BHK') return ['5+ BHK'];
                                return [b];
                              });
                              updateFilter('bhkType', filterValues);
                            }
                          }}
                          className="text-xs px-3"
                        >
                          + {bhk}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Construction Status Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenDropdown(openDropdown === 'construction' ? null : 'construction')}
                  className={`flex items-center gap-1 ${openDropdown === 'construction' ? 'bg-blue-50 border-blue-400' : ''}`}
                >
                  <span className="text-sm">Construction Status</span>
                  <ChevronRight size={14} className={`transition-transform ${openDropdown === 'construction' ? 'rotate-90' : ''}`} />
                </Button>
                
                {/* Construction Status Dropdown */}
                {openDropdown === 'construction' && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[280px] md:min-w-[360px]">
                    <h4 className="text-sm font-semibold mb-3">Construction Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {['New Launch', 'Under Construction', 'Ready to move'].map(status => (
                        <Button
                          key={status}
                          variant={selectedConstructionStatus.includes(status) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (selectedConstructionStatus.includes(status)) {
                              const updated = selectedConstructionStatus.filter(s => s !== status);
                              setSelectedConstructionStatus(updated);
                              const filterValues = updated.map(s => s === 'Ready to move' ? 'Ready to Move' : s);
                              updateFilter('availability', filterValues);
                            } else {
                              const updated = [...selectedConstructionStatus, status];
                              setSelectedConstructionStatus(updated);
                              const filterValues = updated.map(s => s === 'Ready to move' ? 'Ready to Move' : s);
                              updateFilter('availability', filterValues);
                            }
                          }}
                          className="text-xs px-3"
                        >
                          + {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Posted By Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenDropdown(openDropdown === 'postedBy' ? null : 'postedBy')}
                  className={`flex items-center gap-1 ${openDropdown === 'postedBy' ? 'bg-blue-50 border-blue-400' : ''}`}
                >
                  <span className="text-sm">Posted By</span>
                  <ChevronRight size={14} className={`transition-transform ${openDropdown === 'postedBy' ? 'rotate-90' : ''}`} />
                </Button>
                
                {/* Posted By Dropdown */}
                {openDropdown === 'postedBy' && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[240px]">
                    <h4 className="text-sm font-semibold mb-3">Posted By</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Owner', 'Builder', 'Dealer'].map(poster => (
                        <Button
                          key={poster}
                          variant={selectedPostedBy.includes(poster) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (selectedPostedBy.includes(poster)) {
                              const updated = selectedPostedBy.filter(p => p !== poster);
                              setSelectedPostedBy(updated);
                            } else {
                              setSelectedPostedBy([...selectedPostedBy, poster]);
                            }
                          }}
                          className="text-xs px-3"
                        >
                          + {poster}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Budget Dropdown */}
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
                
                {/* Budget Dropdown */}
                {openDropdown === 'budget' && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[320px] md:min-w-[400px]">
                    <h4 className="text-sm font-semibold mb-3">Select Price Range</h4>
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-2">
                        {(() => {
                          const validBudget = getValidBudgetValue(filters.budget, activeTab);
                          return `₹${validBudget[0] === 0 ? '0' : validBudget[0] >= 10000000 ? (validBudget[0] / 10000000).toFixed(validBudget[0] % 10000000 === 0 ? 0 : 1) + ' Cr' : (validBudget[0] / 100000).toFixed(validBudget[0] % 100000 === 0 ? 0 : 1) + ' L'} - ₹${validBudget[1] >= getBudgetSliderMax(activeTab) ? (activeTab === 'rent' ? '5L +' : '5Cr +') : validBudget[1] >= 10000000 ? (validBudget[1] / 10000000).toFixed(validBudget[1] % 10000000 === 0 ? 0 : 1) + ' Cr' : (validBudget[1] / 100000).toFixed(validBudget[1] % 100000 === 0 ? 0 : 1) + ' L'}`;
                        })()}
                      </div>
                      <Slider 
                        value={filters.budget} 
                        onValueChange={(value) => updateFilter('budget', value as [number, number])} 
                        max={getBudgetSliderMax(activeTab)} 
                        min={0} 
                        step={getBudgetSliderStep(activeTab)} 
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {(selectedPropertyTypes.length > 0 || selectedBedrooms.length > 0 || selectedConstructionStatus.length > 0 || selectedPostedBy.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPropertyTypes([]);
                    setSelectedBedrooms([]);
                    setSelectedConstructionStatus([]);
                    setSelectedPostedBy([]);
                    clearAllFilters();
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Clear
                </Button>
              )}

              {/* Search Button - Desktop */}
              <Button className="hidden lg:block ml-auto bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </>
  );
};
