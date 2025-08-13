
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
        className={`font-medium px-3 py-2 text-base transition-all duration-500 flex items-center ${
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
            <div className="grid grid-cols-1 gap-4">
              <h3 className="font-semibold text-gray-600 text-xs uppercase tracking-wide">Residential Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "All Residential",
                  "Flat / Apartment",
                  "Independent Building/Floor",
                  "Farm House",
                  "Villa",
                  "Plots",
                  "Independent House",
                ].map((item) => (
                  <a key={item} href="#" className="block text-sm text-gray-700 hover:text-brand-red transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
