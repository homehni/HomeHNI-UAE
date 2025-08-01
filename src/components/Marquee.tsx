import { useState, useRef } from 'react';

const Marquee = () => {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-[#0545a3] text-white py-2 overflow-hidden whitespace-nowrap z-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={marqueeRef}
        className={`inline-block min-w-full animate-marquee`}
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {/* Repeated Content for Continuous Scroll */}
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
