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
            className={`font-medium px-3 py-2 text-base uppercase transition-all duration-500 flex items-center ${
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
            { label: 'Residential', href: '/search?type=buy' },
            // Route commercial and land searches under BUY using propertyTypes tokens
            { label: 'Commercial', href: '/search?type=buy&propertyTypes=OFFICE,RETAIL,WAREHOUSE,SHOWROOM,RESTAURANT,CO-WORKING,INDUSTRIAL' },
            { label: 'Industrial', href: '/search?type=buy&propertyTypes=INDUSTRIAL' },
            { label: 'Agricultural lands', href: '/search?type=buy&propertyTypes=AGRICULTURAL%20LAND' },
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