import React from 'react';

interface PropertyWatermarkProps {
  status: 'available' | 'inactive' | 'rented' | 'sold';
  children: React.ReactNode;
}

export const PropertyWatermark: React.FC<PropertyWatermarkProps> = ({ 
  status, 
  children 
}) => {
  if (status === 'available') {
    return <>{children}</>;
  }

  const watermarkText = status === 'rented' ? 'RENTED' : 'SOLD';
  const watermarkColor = status === 'rented' ? 'text-red-600' : 'text-green-600';
  const overlayColor = status === 'rented' ? 'bg-red-600/20' : 'bg-green-600/20';

  return (
    <div className="relative">
      {children}
      
      {/* Watermark Overlay */}
      <div className={`absolute inset-0 ${overlayColor} flex items-center justify-center z-10`}>
        <div className="transform rotate-[-20deg]">
          <div className={`
            ${watermarkText === 'RENTED' ? 'border-red-600' : 'border-green-600'} 
            border-4 px-8 py-4 rounded-lg bg-white/90 backdrop-blur-sm
          `}>
            <span className={`
              text-4xl md:text-6xl font-black tracking-wider 
              ${watermarkColor} drop-shadow-lg
            `}>
              {watermarkText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
