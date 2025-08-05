
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MegaMenuProps {
  isScrolled: boolean;
}

const MegaMenu = ({ isScrolled }: MegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuSections = [
    {
      title: "RENT A HOME",
      items: []
    },
    {
      title: "PROPERTIES IN HYDERABAD", 
      items: [
        "Flats",
        "Builder Floors",
        "Independent House",
        "Serviced Apartments",
        "Studio Apartments/1 RK Flats",
        "Farm Houses"
      ]
    },
    {
      title: "POPULAR SEARCHES",
      items: [
        "Property for rent in Hyderabad",
        "Verified Property in Hyderabad"
      ]
    }
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={`font-medium px-3 py-2 text-sm transition-all duration-500 flex items-center ${
          isScrolled 
            ? 'text-gray-800 hover:bg-gray-100' 
            : 'text-white hover:bg-white/10'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        Buyers
        <ChevronDown size={16} className="ml-1" />
      </Button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 w-[800px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-6">
            <div className="grid grid-cols-4 gap-8">
              {/* Left Column - Categories */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-sm">RENT A HOME</h3>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-sm">PG/CO-LIVING</h3>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-sm">COMMERCIAL</h3>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-sm">POPULAR AREAS</h3>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center">
                    INSIGHTS 
                    <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">NEW</span>
                  </h3>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-sm">ARTICLES & NEWS</h3>
                </div>
              </div>

              {/* Middle Column - Properties */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-600 text-xs uppercase tracking-wide">PROPERTIES IN HYDERABAD</h3>
                <div className="space-y-2">
                  {[
                    "Flats",
                    "Builder Floors", 
                    "Independent House",
                    "Serviced Apartments",
                    "Studio Apartments/1 RK Flats",
                    "Farm Houses"
                  ].map((item) => (
                    <a key={item} href="#" className="block text-sm text-gray-700 hover:text-brand-red transition-colors">
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Column - Popular Searches */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-600 text-xs uppercase tracking-wide">POPULAR SEARCHES</h3>
                <div className="space-y-2">
                  {[
                    "Property for rent in Hyderabad",
                    "Verified Property in Hyderabad"
                  ].map((item) => (
                    <a key={item} href="#" className="block text-sm text-gray-700 hover:text-brand-red transition-colors">
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Insights Column */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
                    <span className="text-white font-bold text-sm">i</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">INTRODUCING</h4>
                    <h3 className="font-bold text-blue-900 text-lg mb-2">Insights</h3>
                    <div className="space-y-1 text-xs text-blue-700">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Understand localities
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Read Resident Reviews
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Check Price Trends
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Tools, Utilities & more
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Contact Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  contact us toll free on <strong>1800 41 99099</strong> <span className="text-gray-400">(9AM-11PM IST)</span>
                </div>
                <div className="text-sm text-gray-600">
                  Email us at <a href="mailto:services@homehni.com" className="text-brand-red">services@homehni.com</a>, or call us at <strong>1800 41 99099</strong> <span className="text-gray-400">(IND Toll-Free)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
