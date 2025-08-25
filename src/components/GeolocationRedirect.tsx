import React, { useEffect, useState } from 'react';
import { detectUserCountry, getCountryDomain, shouldRedirect, performRedirect } from '@/services/geolocationService';

interface GeolocationRedirectProps {
  children: React.ReactNode;
}

const GeolocationRedirect: React.FC<GeolocationRedirectProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const handleRedirection = async () => {
      try {
        // Only check for redirection if we're on the main domain
        if (!shouldRedirect()) {
          setShouldShow(true);
          setIsChecking(false);
          return;
        }

        // Check if user has already been redirected (prevent infinite loops)
        const hasBeenRedirected = sessionStorage.getItem('geo_redirect_attempted');
        if (hasBeenRedirected) {
          setShouldShow(true);
          setIsChecking(false);
          return;
        }

        // Mark that we've attempted redirection
        sessionStorage.setItem('geo_redirect_attempted', 'true');

        // Detect user's country
        const countryCode = await detectUserCountry();
        
        if (countryCode) {
          const targetDomain = getCountryDomain(countryCode);
          
          if (targetDomain) {
            // Small delay to ensure smooth user experience
            setTimeout(() => {
              performRedirect(targetDomain);
            }, 100);
            return;
          }
        }

        // If no redirection needed, show the content
        setShouldShow(true);
        setIsChecking(false);
      } catch (error) {
        console.error('Error in geolocation redirect:', error);
        // Show content if there's an error
        setShouldShow(true);
        setIsChecking(false);
      }
    };

    handleRedirection();
  }, []);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to your local site...</p>
        </div>
      </div>
    );
  }

  // Show content if we should display it
  return shouldShow ? <>{children}</> : null;
};

export default GeolocationRedirect;