import React from 'react';

interface PropertyWatermarkProps {
  status: 'available' | 'inactive' | 'rented' | 'sold' | 'rejected';
  children: React.ReactNode;
}

export const PropertyWatermark: React.FC<PropertyWatermarkProps> = ({ 
  status, 
  children 
}) => {
  if (status === 'available' || status === 'inactive') {
    return <>{children}</>;
  }

  const getWatermarkConfig = () => {
    switch (status) {
      case 'rented':
        return {
          text: 'RENTED',
          textColor: 'text-red-600',
          overlayColor: 'bg-red-600/20',
          borderColor: 'border-red-600'
        };
      case 'sold':
        return {
          text: 'SOLD',
          textColor: 'text-green-600',
          overlayColor: 'bg-green-600/20',
          borderColor: 'border-green-600'
        };
      case 'rejected':
        return {
          text: 'REJECTED',
          textColor: 'text-orange-600',
          overlayColor: 'bg-orange-600/20',
          borderColor: 'border-orange-600'
        };
      default:
        return {
          text: 'UNAVAILABLE',
          textColor: 'text-gray-600',
          overlayColor: 'bg-gray-600/20',
          borderColor: 'border-gray-600'
        };
    }
  };

  const config = getWatermarkConfig();

  return (
    <div className="relative">
      {children}
      
      {/* Watermark Overlay */}
      <div className={`absolute inset-0 ${config.overlayColor} flex items-center justify-center z-10`}>
        <div className="transform rotate-[-20deg]">
          <div className={`
            ${config.borderColor} 
            border-4 px-8 py-4 rounded-lg bg-white/90 backdrop-blur-sm
          `}>
            <span className={`
              text-4xl md:text-6xl font-black tracking-wider 
              ${config.textColor} drop-shadow-lg
            `}>
              {config.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
