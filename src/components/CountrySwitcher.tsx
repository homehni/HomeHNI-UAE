import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface CountryOption {
  code: string;
  name: string;
  domain: string;
  flag: string;
  displayCode: string;
}

interface RegionData {
  name: string;
  countries: CountryOption[];
}

const CountrySwitcher: React.FC = () => {
  const [currentCountry, setCurrentCountry] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Listen for scroll to match header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Organized countries by regions
  const regions: RegionData[] = [
    {
      name: 'NORTH AMERICA',
      countries: [
        { code: 'US', name: 'United States', domain: 'homehni.us', flag: '🇺🇸', displayCode: 'United States' },
        { code: 'CA', name: 'Canada', domain: 'homehni.ca', flag: '🇨🇦', displayCode: 'Canada' },
      ]
    },
    {
      name: 'APAC',
      countries: [
        { code: 'AU', name: 'Australia', domain: 'homehni.com.au', flag: '🇦🇺', displayCode: 'Australia' },
        { code: 'HK', name: 'Hong Kong', domain: 'homehni.hk', flag: '🇭🇰', displayCode: 'Hong Kong' },
        { code: 'IN', name: 'India', domain: 'homehni.in', flag: '🇮🇳', displayCode: 'India' },
        { code: 'JP', name: 'Japan', domain: 'homehni.jp', flag: '🇯🇵', displayCode: 'Japan' },
        { code: 'MY', name: 'Malaysia', domain: 'homehni.my', flag: '🇲🇾', displayCode: 'Malaysia' },
      ]
    },
    {
      name: 'EUROPE',
      countries: [
        { code: 'FR', name: 'France', domain: 'homehni.fr', flag: '🇫🇷', displayCode: 'France' },
        { code: 'DE', name: 'Germany', domain: 'homehni.de', flag: '🇩🇪', displayCode: 'Germany' },
        { code: 'IT', name: 'Italy', domain: 'homehni.it', flag: '🇮🇹', displayCode: 'Italy' },
        { code: 'NL', name: 'Netherlands', domain: 'homehni.nl', flag: '🇳🇱', displayCode: 'Netherlands' },
        { code: 'ES', name: 'Spain', domain: 'homehni.es', flag: '🇪🇸', displayCode: 'Spain' },
      ]
    },
    {
      name: 'LATAM',
      countries: [
        { code: 'AR', name: 'Argentina', domain: 'homehni.com.ar', flag: '🇦🇷', displayCode: 'Argentina' },
        { code: 'BR', name: 'Brazil', domain: 'homehni.com.br', flag: '🇧🇷', displayCode: 'Brazil' },
        { code: 'CL', name: 'Chile', domain: 'homehni.cl', flag: '🇨🇱', displayCode: 'Chile' },
        { code: 'CO', name: 'Colombia', domain: 'homehni.com.co', flag: '🇨🇴', displayCode: 'Colombia' },
        { code: 'MX', name: 'Mexico', domain: 'homehni.mx', flag: '🇲🇽', displayCode: 'Mexico' },
      ]
    }
  ];

  // Get all countries in a flat array for easy lookup
  const allCountries = regions.flatMap(region => region.countries);

  const PREF_KEY = 'homehni_country_pref_v1';

  useEffect(() => {
    // Detect current country based on hostname or saved preference
    const hostname = window.location.hostname;
    const savedCountry = localStorage.getItem(PREF_KEY);
    
    if (hostname === 'homehni.com') {
      setCurrentCountry(savedCountry || 'IN'); // Default to India
    } else {
      // Find country by domain
      const country = allCountries.find(c => c.domain === hostname);
      setCurrentCountry(country?.code || 'IN');
    }
  }, []);

  const handleCountryChange = (selectedCode: string) => {
    const selectedCountry = allCountries.find(c => c.code === selectedCode);
    
    if (!selectedCountry) return;

    setIsOpen(false);

    // Save preference and redirect to country domain
    localStorage.setItem(PREF_KEY, selectedCode);
    window.location.href = 'https://' + selectedCountry.domain + window.location.pathname + window.location.search + window.location.hash;
  };

  const getCurrentCountry = () => {
    return allCountries.find(c => c.code === currentCountry) || allCountries.find(c => c.code === 'IN');
  };

  const currentCountryData = getCurrentCountry();

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className={`flex items-center gap-2 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-500 cursor-pointer min-w-[100px] ${
          isScrolled 
            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300' 
            : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
        }`}
      >
        <span>Global</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
            isScrolled ? 'text-gray-600' : 'text-white'
          }`}
        />
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full left-0 mt-1 min-w-[800px] rounded-lg shadow-2xl z-50 border transition-all duration-200 ${
            isScrolled 
              ? 'bg-white border-gray-200' 
              : 'bg-gray-900 border-gray-700'
          }`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="grid grid-cols-4 gap-8 p-8">
            {regions.map((region) => (
              <div key={region.name} className="space-y-4">
                <div className={`border-b pb-2 ${isScrolled ? 'border-gray-200' : 'border-gray-700'}`}>
                  <h3 className={`text-sm font-bold tracking-wide uppercase ${
                    isScrolled ? 'text-brand-red' : 'text-red-400'
                  }`}>
                    {region.name}
                  </h3>
                </div>
                <div className="space-y-2">
                  {region.countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountryChange(country.code)}
                      className={`block w-full text-left text-sm transition-all duration-200 py-2 px-2 rounded hover:bg-opacity-10 ${
                        currentCountry === country.code
                          ? isScrolled 
                            ? 'text-red-600 font-medium bg-red-50' 
                            : 'text-red-400 font-medium bg-red-900/20'
                          : isScrolled
                            ? 'text-gray-700 hover:text-brand-red hover:bg-red-50'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span>{country.displayCode}</span>
                        {currentCountry === country.code && (
                          <span className={`w-2 h-2 rounded-full ${
                            isScrolled ? 'bg-red-600' : 'bg-red-400'
                          }`} />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySwitcher;