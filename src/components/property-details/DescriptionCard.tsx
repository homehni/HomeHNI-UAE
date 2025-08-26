import React, { useState } from 'react';

interface DescriptionCardProps {
  description?: string;
  fallbackDescription: string;
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({ 
  description, 
  fallbackDescription 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = description || fallbackDescription;
  const shouldTruncate = content.length > 320;
  const displayContent = shouldTruncate && !isExpanded 
    ? content.slice(0, 320) + '...' 
    : content;

  return (
    <div className="rounded-2xl border-2 border-red-500 bg-white shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Description</h2>
      </div>
      
      <div className="p-5 pt-4">
        <p className="text-gray-700 leading-relaxed mb-4" style={{ fontSize: '16px' }}>
          {displayContent}
        </p>
        
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#d21404] hover:underline text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d21404] rounded"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
};