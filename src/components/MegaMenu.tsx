
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
            'All Residential',
            'Flat / Apartment',
            'Independent Building/Floor',
            'Farm House',
            'Villa',
            'Plots',
            'Independent House',
          ].map((label) => (
            <DropdownMenuItem key={label} asChild>
              <a href="#" className="w-full">
                {label}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MegaMenu;
