import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface CountryOption {
  code: string;
  name: string;
  domain: string;
  flag: string;
  displayCode: string;
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

  // Country options with flags and domains
  const countries: CountryOption[] = [
    { code: 'GLOBAL', name: 'Global', domain: 'homehni.com', flag: '🌍', displayCode: 'Global' },
    { code: 'IN', name: 'India', domain: 'homehni.in', flag: '🇮🇳', displayCode: 'IN' },
    { code: 'US', name: 'United States', domain: 'homehni.us', flag: '🇺🇸', displayCode: 'US' },
    { code: 'GB', name: 'United Kingdom', domain: 'homehni.co.uk', flag: '🇬🇧', displayCode: 'UK' },
    { code: 'AE', name: 'United Arab Emirates', domain: 'homehni.ae', flag: '🇦🇪', displayCode: 'UAE' },
    { code: 'DE', name: 'Germany', domain: 'homehni.de', flag: '🇩🇪', displayCode: 'DE' },
    { code: 'ZA', name: 'South Africa', domain: 'homehni.co.za', flag: '🇿🇦', displayCode: 'ZA' }
  ];

  const PREF_KEY = 'homehni_country_pref_v1';

  useEffect(() => {
    // Detect current country based on hostname or saved preference
    const hostname = window.location.hostname;
    const savedCountry = localStorage.getItem(PREF_KEY);
    
    if (hostname === 'homehni.com') {
      setCurrentCountry(savedCountry || 'GLOBAL');
    } else {
      // Find country by domain
      const country = countries.find(c => c.domain === hostname);
      setCurrentCountry(country?.code || 'GLOBAL');
    }
  }, []);

  const handleCountryChange = (selectedCode: string) => {
    const selectedCountry = countries.find(c => c.code === selectedCode);
    
    if (!selectedCountry) return;

    setIsOpen(false);

    if (selectedCode === 'GLOBAL') {
      // Remove preference and go to global domain
      localStorage.removeItem(PREF_KEY);
      window.location.href = 'https://homehni.com' + window.location.pathname + window.location.search + window.location.hash;
    } else {
      // Save preference and redirect to country domain
      localStorage.setItem(PREF_KEY, selectedCode);
      window.location.href = 'https://' + selectedCountry.domain + window.location.pathname + window.location.search + window.location.hash;
    }
  };

  const getCurrentCountry = () => {
    return countries.find(c => c.code === currentCountry) || countries[0];
  };

  const currentCountryData = getCurrentCountry();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-500 cursor-pointer min-w-[100px] ${
          isScrolled 
            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300' 
            : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
        }`}
      >
        <span>{currentCountryData.flag} {currentCountryData.displayCode}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
            isScrolled ? 'text-gray-600' : 'text-white'
          }`}
        />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 min-w-full rounded-md shadow-lg z-50 border transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-sm border-gray-200' 
            : 'bg-red-800/95 backdrop-blur-sm border-white/20'
        }`}>
          <div className="py-1">
            {countries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountryChange(country.code)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 flex items-center gap-2 ${
                  currentCountry === country.code
                    ? isScrolled 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-white/20 text-white'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      : 'text-white hover:bg-white/20'
                }`}
              >
                <span>{country.flag} {country.displayCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySwitcher;