import React, { useState, useEffect } from 'react';

interface CountryOption {
  code: string;
  name: string;
  domain: string;
}

const CountrySwitcher: React.FC = () => {
  const [currentCountry, setCurrentCountry] = useState<string>('');
  
  // Country options with domains
  const countries: CountryOption[] = [
    { code: 'GLOBAL', name: 'Global', domain: 'homehni.com' },
    { code: 'US', name: 'United States', domain: 'homehni.us' },
    { code: 'IN', name: 'India', domain: 'homehni.in' },
    { code: 'GB', name: 'United Kingdom', domain: 'homehni.co.uk' },
    { code: 'DE', name: 'Germany', domain: 'homehni.de' },
    { code: 'AE', name: 'United Arab Emirates', domain: 'homehni.ae' },
    { code: 'ZA', name: 'South Africa', domain: 'homehni.co.za' },
    { code: 'IT', name: 'Italy', domain: 'homehni.it' },
    { code: 'FR', name: 'France', domain: 'homehni.fr' },
    { code: 'CA', name: 'Canada', domain: 'homehni.ca' },
    { code: 'AU', name: 'Australia', domain: 'homehni.com.au' }
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
    <div className="flex items-center gap-2">
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
        className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        style={{ minWidth: '120px' }}
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySwitcher;