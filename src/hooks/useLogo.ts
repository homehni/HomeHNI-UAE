import { useState, useEffect } from 'react';

interface UseLogoOptions {
  preloadSizes?: string[];
  variant?: "default" | "scrolled";
}

export const useLogo = ({ preloadSizes = [], variant = "default" }: UseLogoOptions = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Logo sources based on variant
  const logoSources = {
    default: "/lovable-uploads/4ae8bc66-e5e0-4c61-88f6-cd00789ebc89.png",
    scrolled: "/lovable-uploads/773d41c7-0eec-400e-a369-eaae7c40f9ca.png"
  };

  // Preload critical logos
  useEffect(() => {
    const preloadLogo = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load logo: ${src}`));
        img.src = src;
      });
    };

    const loadLogos = async () => {
      try {
        // Always preload the main logo
        await preloadLogo(logoSources[variant]);
        
        // Preload additional sizes if specified
        for (const size of preloadSizes) {
          if (logoSources[size as keyof typeof logoSources]) {
            await preloadLogo(logoSources[size as keyof typeof logoSources]);
          }
        }
        
        setIsLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Logo loading failed');
      }
    };

    loadLogos();
  }, [variant, preloadSizes]);

  return {
    logoSrc: logoSources[variant],
    isLoaded,
    error,
    preloadLogo: (src: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    }
  };
};