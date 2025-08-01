
import { useState, useRef } from 'react';

const Marquee = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [pausePosition, setPausePosition] = useState(0);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (marqueeRef.current) {
      const rect = marqueeRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const containerWidth = rect.width;
      const percentage = (relativeX / containerWidth) * 100;
      
      setPausePosition(percentage);
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-[#0545a3] text-white py-2 overflow-hidden whitespace-nowrap z-50 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={marqueeRef}
        className={`${isPaused ? '' : 'animate-[marquee_150s_linear_infinite]'} inline-block min-w-full`}
        style={isPaused ? { 
          transform: `translateX(-${pausePosition}%)`,
          animationPlayState: 'paused'
        } : {}}
      >
        <span className="text-sm font-medium px-4 drop-shadow-lg">
          🏠 Stay Safe with Home Hni - Your trusted partner for secure real estate transactions • Verify all documents before payment • Use escrow services for large transactions • Report suspicious activities immediately
        </span>
        <span className="text-sm font-medium px-4 drop-shadow-lg">
          🏠 Stay Safe with Home Hni - Your trusted partner for secure real estate transactions • Verify all documents before payment • Use escrow services for large transactions • Report suspicious activities immediately
        </span>
        <span className="text-sm font-medium px-4 drop-shadow-lg">
          🏠 Stay Safe with Home Hni - Your trusted partner for secure real estate transactions • Verify all documents before payment • Use escrow services for large transactions • Report suspicious activities immediately
        </span>
        <span className="text-sm font-medium px-4 drop-shadow-lg">
          🏠 Stay Safe with Home Hni - Your trusted partner for secure real estate transactions • Verify all documents before payment • Use escrow services for large transactions • Report suspicious activities immediately
        </span>
        <span className="text-sm font-medium px-4 drop-shadow-lg">
          🏠 Stay Safe with Home Hni - Your trusted partner for secure real estate transactions • Verify all documents before payment • Use escrow services for large transactions • Report suspicious activities immediately
        </span>
        <span className="text-sm font-medium px-4 drop-shadow-lg">
          🏠 Stay Safe with Home Hni - Your trusted partner for secure real estate transactions • Verify all documents before payment • Use escrow services for large transactions • Report suspicious activities immediately
        </span>
        <span className="text-sm font-medium px-4 drop-shadow-lg">
          🏠 Stay Safe with Home Hni - Your trusted partner for secure real estate transactions • Verify all documents before payment • Use escrow services for large transactions • Report suspicious activities immediately
        </span>
        <span className="text-sm font-medium px-4 drop-shadow-lg">
          🏠 Stay Safe with Home Hni - Your trusted partner for secure real estate transactions • Verify all documents before payment • Use escrow services for large transactions • Report suspicious activities immediately
        </span>
        <span className="text-sm font-medium px-4 drop-shadow-lg">
          🏠 Stay Safe with Home Hni - Your trusted partner for secure real estate transactions • Verify all documents before payment • Use escrow services for large transactions • Report suspicious activities immediately
        </span>
      </div>
    </div>
  );
};

export default Marquee;
