import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDeveloperPages } from '@/hooks/useDeveloperPages';
import prestigeGroupLogo from '@/assets/prestige-group-logo.jpg';
import godrejPropertiesLogo from '@/assets/godrej-properties-logo.jpg';
import ramkyGroupLogo from '@/assets/ramky-group-logo.jpg';
import brigadeGroupLogo from '@/assets/brigade-group-logo.jpg';
import aparnaConstructionsLogo from '@/assets/aparna-constructions-logo.jpg';
import aliensGroupLogo from '@/assets/aliens-group-logo.jpg';
import cannyForestEdgeLogo from '@/assets/canny-forest-edge-logo.jpg';
import alpineInfratechLogo from '@/assets/alpine-infratech-logo.png';
const RealEstateSlider = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const { data: developerPages } = useDeveloperPages();

  const staticCompanies = [
    {
      id: 'prestige-group',
      name: 'Prestige Group',
      logo: prestigeGroupLogo,
      rank: 1,
      highlights: 'Large-scale mixed-use projects, strong presence across South India'
    },
    {
      id: 'godrej-properties',
      name: 'Godrej Properties',
      logo: godrejPropertiesLogo,
      rank: 2,
      highlights: 'National developer newly active in Hyderabad, high-magnitude projects'
    },
    {
      id: 'ramky-group',
      name: 'Ramky Group',
      logo: ramkyGroupLogo,
      rank: 3,
      highlights: 'Hyderabad-based, focus on sustainable and innovative infrastructure'
    },
    {
      id: 'brigade-group',
      name: 'Brigade Group',
      logo: brigadeGroupLogo,
      rank: 4,
      highlights: 'Award-winning developer, active in residential, commercial, hospitality'
    },
    {
      id: 'aparna-constructions',
      name: 'Aparna Constructions',
      logo: aparnaConstructionsLogo,
      rank: 5,
      highlights: 'High-quality housing, tech-enabled, eco-conscious building practices'
    },
    {
      id: 'aliens-group',
      name: 'Aliens Group',
      logo: aliensGroupLogo,
      rank: 6,
      highlights: 'Hyderabad-founded, iconic skyscraper projects, design awards'
    },
    {
      id: 'canny-forest-edge',
      name: "Canny's Forest Edge",
      logo: cannyForestEdgeLogo,
      rank: 7,
      highlights: 'A sensorial lifestyle, nature-inspired living spaces'
    },
    {
      id: 'alpine-infratech',
      name: 'Alpine Infratech',
      logo: alpineInfratechLogo,
      rank: 8,
      highlights: 'Innovative infrastructure solutions, modern construction excellence'
    }
  ];

  const apiCompanies = (developerPages ?? []).map((d) => ({
    id: d.slug,
    name: d.company_name,
    logo: (d.logo_url as string) || '',
    rank: d.display_order ?? 0,
    highlights: d.tagline || ''
  }));

  const companies = apiCompanies.length ? apiCompanies : staticCompanies;

  // Create infinite loop by duplicating companies
  const infiniteCompanies = [...companies, ...companies];
  
  const handleCompanyClick = (companyId: string) => {
    navigate(`/developer/${companyId}`);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll functionality for seamless loop
  useEffect(() => {
    if (isPaused) return;
    const autoScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const slideWidth = 264; // 240px width + 24px gap
        const totalOriginalWidth = companies.length * slideWidth;

        // Smooth continuous scroll
        container.scrollBy({
          left: 1,
          behavior: 'auto'
        });

        // Reset position seamlessly when we've scrolled past the first set
        if (container.scrollLeft >= totalOriginalWidth) {
          container.scrollLeft = 0;
        }
      }
    };
    const interval = setInterval(autoScroll, 20); // Much faster interval for smooth movement
    return () => clearInterval(interval);
  }, [isPaused, companies.length]);
  return <section className="py-8 md:py-12 bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Navigation Buttons - Hidden on mobile */}
          <button onClick={() => scroll('left')} className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg transition-colors" aria-label="Scroll left">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button onClick={() => scroll('right')} className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg transition-colors" aria-label="Scroll right">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slides Container */}
          <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-2" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            {infiniteCompanies.map((company, index) => 
              <div 
                key={index} 
                className="flex-none w-60 bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 h-48"
                onClick={() => handleCompanyClick(company.id)}
              >
                <div className="h-32 overflow-hidden bg-white flex items-center justify-center p-4 mt-2 md:mt-0">
                  <img src={company.logo} alt={`${company.name} logo`} loading="lazy" className="w-full h-full object-contain" />
                </div>
                <div className="px-4 pt-2 pb-4 h-16 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-foreground text-center">
                    {company.name}
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>;
};
export { RealEstateSlider };
export default RealEstateSlider;