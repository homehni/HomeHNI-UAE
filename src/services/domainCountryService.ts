interface CountryConfig {
  code: string;        // ISO country code: 'AE', 'IN', etc.
  name: string;        // Display name
  language: string;    // Language code for Google Maps: 'en', 'ar', etc.
  currency: string;    // Currency code: 'AED', 'INR', etc.
}

const DOMAIN_COUNTRY_MAP: { [domain: string]: CountryConfig } = {
  'localhost': {
    code: 'AE',
    name: 'United Arab Emirates',
    language: 'en',
    currency: 'AED'
  },
  '127.0.0.1': {
    code: 'AE',
    name: 'United Arab Emirates',
    language: 'en',
    currency: 'AED'
  },
  'homehni.ae': {
    code: 'AE',
    name: 'United Arab Emirates',
    language: 'en',
    currency: 'AED'
  },
  'www.homehni.ae': {
    code: 'AE',
    name: 'United Arab Emirates',
    language: 'en',
    currency: 'AED'
  },
  'homehni.in': {
    code: 'IN',
    name: 'India',
    language: 'en',
    currency: 'INR'
  },
  'www.homehni.in': {
    code: 'IN',
    name: 'India',
    language: 'en',
    currency: 'INR'
  },
  'homehni.com': {
    code: 'AE',
    name: 'United Arab Emirates',
    language: 'en',
    currency: 'AED'
  },
  'www.homehni.com': {
    code: 'AE',
    name: 'United Arab Emirates',
    language: 'en',
    currency: 'AED'
  }
};

export const getCurrentCountryConfig = (): CountryConfig => {
  const hostname = window.location.hostname;
  return DOMAIN_COUNTRY_MAP[hostname] || DOMAIN_COUNTRY_MAP['homehni.ae'];
};

export const getCurrentCountryCode = (): string => {
  return getCurrentCountryConfig().code;
};
