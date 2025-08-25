import React, { useState, useEffect } from 'react';

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

  // Listen for scroll to match header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Country options with flags and domains
  const countries: CountryOption[] = [
    { code: 'GLOBAL', name: 'Global', domain: 'homehni.com', flag: '🌍', displayCode: 'Global' },
    { code: 'US', name: 'United States', domain: 'homehni.us', flag: '🇺🇸', displayCode: 'US' },
    { code: 'IN', name: 'India', domain: 'homehni.in', flag: '🇮🇳', displayCode: 'IN' },
    { code: 'GB', name: 'United Kingdom', domain: 'homehni.co.uk', flag: '🇬🇧', displayCode: 'UK' },
    { code: 'DE', name: 'Germany', domain: 'homehni.de', flag: '🇩🇪', displayCode: 'DE' },
    { code: 'AE', name: 'United Arab Emirates', domain: 'homehni.ae', flag: '🇦🇪', displayCode: 'UAE' },
    { code: 'ZA', name: 'South Africa', domain: 'homehni.co.za', flag: '🇿🇦', displayCode: 'ZA' },
    { code: 'IT', name: 'Italy', domain: 'homehni.it', flag: '🇮🇹', displayCode: 'IT' },
    { code: 'FR', name: 'France', domain: 'homehni.fr', flag: '🇫🇷', displayCode: 'FR' },
    { code: 'CA', name: 'Canada', domain: 'homehni.ca', flag: '🇨🇦', displayCode: 'CA' },
    { code: 'AU', name: 'Australia', domain: 'homehni.com.au', flag: '🇦🇺', displayCode: 'AU' }
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

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = event.target.value;
    const selectedCountry = countries.find(c => c.code === selectedCode);
    
    if (!selectedCountry) return;

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

  return (
    <div className="relative">
      <label 
        htmlFor="country-switcher" 
        className="text-sm font-medium text-foreground sr-only"
      >
        Country
      </label>
      <select
        id="country-switcher"
        value={currentCountry}
        onChange={handleCountryChange}
        className={`appearance-none text-sm rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-500 cursor-pointer z-50 min-w-[100px] ${
          isScrolled 
            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300' 
            : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
        }`}
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${isScrolled ? '%236b7280' : '%23ffffff'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em'
        }}
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.displayCode}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySwitcher;