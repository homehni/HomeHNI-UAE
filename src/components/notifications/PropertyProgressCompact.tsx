import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyProgressCompactProps {
  propertyId: string;
  completionPercentage: number;
  missingFields: string[];
  propertyType?: string;
}

export const PropertyProgressCompact: React.FC<PropertyProgressCompactProps> = ({
  propertyId,
  completionPercentage,
  missingFields,
  propertyType = 'residential'
}) => {
  const navigate = useNavigate();

  // Only show if completion is less than 80%
  if (completionPercentage >= 80) {
    return null;
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTopSuggestion = (missingFields: string[], propertyType: string) => {
    const isCommercial = propertyType === 'commercial' || propertyType === 'office' || 
                        propertyType === 'shop' || propertyType === 'warehouse' || propertyType === 'showroom';
    
    const priorityOrder = isCommercial 
      ? ['images', 'amenities', 'locality', 'super_area', 'description', 'expected_price']
      : ['images', 'amenities', 'locality', 'super_area', 'bhk_type', 'expected_price'];
    
    const topField = priorityOrder.find(field => missingFields.includes(field));
    
    switch (topField) {
      case 'images': return 'Upload photos';
      case 'amenities': return 'Add amenities';
      case 'locality': return 'Complete location';
      case 'super_area': return 'Add property area';
      case 'bhk_type': return 'Specify BHK type';
      case 'description': return 'Add description';
      case 'expected_price': return 'Set price details';
      default: return 'Add more details';
    }
  };

  const getTargetTab = (missingFields: string[], propertyType: string) => {
    const isCommercial = propertyType === 'commercial' || propertyType === 'office' || 
                        propertyType === 'shop' || propertyType === 'warehouse' || propertyType === 'showroom';
    
    const priorityOrder = isCommercial 
      ? ['images', 'amenities', 'locality', 'super_area', 'description', 'expected_price']
      : ['images', 'amenities', 'locality', 'super_area', 'bhk_type', 'expected_price'];
    
    const topField = priorityOrder.find(field => missingFields.includes(field));
    
    switch (topField) {
      case 'images': return 'images';
      case 'amenities': return 'details';
      case 'locality': return 'location';
      case 'super_area': return 'details';
      case 'bhk_type': return 'basic';
      case 'description': return 'basic';
      case 'expected_price': return 'basic';
      default: return 'basic';
    }
  };

  const handleImproveListing = () => {
    const targetTab = getTargetTab(missingFields, propertyType);
    navigate(`/edit-property/${propertyId}?tab=${targetTab}`);
  };

  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Listing Progress
          </span>
        </div>
        <span className="text-sm font-bold text-blue-600">
          {completionPercentage}%
        </span>
      </div>
      
      <Progress 
        value={completionPercentage} 
        className="h-1.5 mb-2"
      />
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-blue-700">
          {getTopSuggestion(missingFields, propertyType)} to improve
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={handleImproveListing}
          className="h-6 px-2 text-xs border-blue-300 text-blue-600 hover:bg-blue-100"
        >
          <Upload className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>
    </div>
  );
};
