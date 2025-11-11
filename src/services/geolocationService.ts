interface CountryMapping {
  [countryCode: string]: string;
}

const COUNTRY_DOMAIN_MAP: CountryMapping = {
  'US': 'homehni.us',
  'GB': 'homehni.co.uk', 
  'DE': 'homehni.de',
  'AE': 'homehni.ae',
  'ZA': 'homehni.co.za',
  'IN': 'homehni.in',
  'IT': 'homehni.it',
  'FR': 'homehni.fr',
  'CA': 'homehni.ca',
  'AU': 'homehni.com.au'
};

export const detectUserCountry = async (): Promise<string | null> => {
  try {
    // Try multiple geolocation services for better reliability
    const services = [
      'https://ipapi.co/country/',
      'https://api.country.is/',
      'https://ipinfo.io/country'
    ];

    for (const service of services) {
      try {
        const response = await fetch(service);
        if (response.ok) {
          const data = await response.text();
          // Handle different response formats
          const countryCode = service.includes('country.is') 
            ? JSON.parse(data).country 
            : data.trim();
          
          if (countryCode && countryCode.length === 2) {
            return countryCode.toUpperCase();
          }
        }
      } catch (error) {
        console.warn(`Failed to get country from ${service}:`, error);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting user country:', error);
    return null;
  }
};

export const getCountryDomain = (countryCode: string): string | null => {
  return COUNTRY_DOMAIN_MAP[countryCode] || null;
};

export const shouldRedirect = (): boolean => {
  const hostname = window.location.hostname;
  // Only redirect from the main domain
  return hostname === 'homehni.com' || hostname === 'www.homehni.com';
};

export const performRedirect = (targetDomain: string): void => {
  const currentUrl = window.location.href;
  const newUrl = currentUrl.replace(window.location.hostname, targetDomain);
  window.location.replace(newUrl);
};
