import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Search, Mic, MapPinIcon, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const SearchSection = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedProperties, setSelectedProperties] = useState(['flat-apartment', 'residential-land', 'serviced-apartments', 'independent-builder-floor', 'rk-studio-apartment', 'farm-house', 'independent-house-villa', 'other']);
  const propertyTypes = [{
    id: 'flat-apartment',
    label: 'Flat/Apartment'
  }, {
    id: 'residential-land',
    label: 'Residential Land'
  }, {
    id: 'serviced-apartments',
    label: 'Serviced Apartments'
  }, {
    id: 'independent-builder-floor',
    label: 'Independent/Builder Floor'
  }, {
    id: 'rk-studio-apartment',
    label: '1 RK/Studio Apartment'
  }, {
    id: 'farm-house',
    label: 'Farm House'
  }, {
    id: 'independent-house-villa',
    label: 'Independent House/Villa'
  }, {
    id: 'other',
    label: 'Other'
  }];
  const handlePropertyToggle = (propertyId: string) => {
    setSelectedProperties(prev => prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]);
  };
  const clearAll = () => {
    setSelectedProperties([]);
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
  return <section className="relative">
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
                <input type="text" placeholder="Search 'Sector 150 Noida'" className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
                        {tab.id === 'new-launch' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                      </TabsTrigger>)}
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-0 p-6 bg-white rounded-b-lg">
                    {/* Property Type Dropdown and Search Bar - Now inline */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-40 h-12 border-gray-300 text-gray-700 font-medium text-sm justify-between hover:bg-gray-50 bg-white px-3">
                            <span>All Residential</span>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-6 bg-white border border-gray-200 shadow-lg z-50" align="start">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Property Types</span>
                              <Button variant="ghost" onClick={clearAll} className="text-[#DC143C] hover:text-[#DC143C] hover:bg-[#DC143C]/5 text-sm px-2 py-1 h-auto font-medium">
                                Clear
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              {propertyTypes.map(property => <div key={property.id} className="flex items-center space-x-2">
                                  <Checkbox id={property.id} checked={selectedProperties.includes(property.id)} onCheckedChange={() => handlePropertyToggle(property.id)} className="border-2 border-[#DC143C] data-[state=checked]:bg-[#DC143C] data-[state=checked]:text-white data-[state=checked]:border-[#DC143C] w-5 h-5" />
                                  <label htmlFor={property.id} className="text-sm text-gray-700 cursor-pointer select-none leading-tight">
                                    {property.label}
                                  </label>
                                </div>)}
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-600">
                                Looking for commercial properties? <span className="text-[#DC143C] cursor-pointer hover:underline font-medium">Click here</span>
                              </p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <div className="flex-1 relative">
                        <MapPin className="absolute left-3 top-3 text-brand-red" size={20} />
                        <Input placeholder="Search 'Noida'" className="pl-10 h-12 border-brand-red text-brand-red placeholder-brand-red/60" defaultValue="Noida" />
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
      <div className="bg-white pt-4 sm:pt-16 pb-16 mx-0 px-0 py-[40px] mb-[2%]">
        <div className="container mx-auto px-4">
          {/* This space allows the search section to overlap properly */}
        </div>
      </div>
    </section>;
};
export default SearchSection;