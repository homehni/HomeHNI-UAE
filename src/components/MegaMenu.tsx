
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface MegaMenuProps {
  isScrolled: boolean;
}

const MegaMenu = ({ isScrolled }: MegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
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
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-64 z-[60]"
          align="start"
          sideOffset={8}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
    
          {/* <DropdownMenuSeparator /> */}
          {[
            { label: 'All Residential', href: '/property' },
            { label: 'Flat / Apartment', href: '/property/apartment' },
            { label: 'Independent Building/Floor', href: '/property/independent-building' },
            { label: 'Farm House', href: '/property/farm-house' },
            { label: 'Villa', href: '/property/villa' },
            { label: 'Plots', href: '/property/plots' },
            { label: 'Independent House', href: '/property/independent-house' },
          ].map((item) => (
            <DropdownMenuItem key={item.label} asChild>
              <a href={item.href} className="w-full">
                {item.label}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MegaMenu;
