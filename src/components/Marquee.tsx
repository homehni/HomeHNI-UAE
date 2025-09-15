import { useState, useRef, useEffect } from 'react';
import { fetchRealEstateNews } from '../services/newsService';

const Marquee = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [headlines, setHeadlines] = useState([
    '🏠 Stay Safe with Home HNI - Your trusted partner for secure real estate transactions • Verify all documents before payment',
    '📈 Latest Trend: India\'s real estate market sees steady growth with home prices projected to rise by 6% in 2025',
    '✨ New Feature: Virtual Property Tours now available - Experience properties from the comfort of your home'
  ]);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Static headlines that don't change often
  const safetyHeadline = '🏠 Stay Safe with Home HNI - Your trusted partner for secure real estate transactions • Verify all documents before payment';
  const featureHeadline = '✨ New Feature: Virtual Property Tours now available - Experience properties from the comfort of your home';

  // Fetch real estate news from Gemini API
  useEffect(() => {
    const getNewsHeadlines = async () => {
      try {
        // Fetch real estate news headlines
        const newsHeadlines = await fetchRealEstateNews();
        
        // Combine with static headlines
        setHeadlines([
          safetyHeadline,
          ...newsHeadlines,
          featureHeadline
        ]);
      } catch (error) {
        console.error('Failed to fetch news headlines:', error);
        // Keep existing headlines if fetch fails
      }
    };

    // Fetch headlines immediately
    getNewsHeadlines();
    
    // Refresh headlines every 3 hours
    const intervalId = setInterval(getNewsHeadlines, 3 * 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div 
      className="hidden md:block fixed top-0 left-0 right-0 bg-[#0545a3] text-white py-2 overflow-hidden whitespace-nowrap z-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={marqueeRef}
        className={`inline-block min-w-full animate-marquee`}
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {/* Repeated Content for Continuous Scroll */}
        {headlines.map((headline, index) => (
          <span key={index} className="text-sm font-medium px-4 drop-shadow-lg">
            {headline}
          </span>
        ))}
        {headlines.map((headline, index) => (
          <span key={`repeat-${index}`} className="text-sm font-medium px-4 drop-shadow-lg">
            {headline}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
