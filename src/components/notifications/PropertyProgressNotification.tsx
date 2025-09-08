import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Upload, Star, MapPin, Home, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyProgressNotificationProps {
  propertyId: string;
  propertyTitle: string;
  completionPercentage: number;
  missingFields: string[];
  propertyType?: string;
  onDismiss?: () => void;
}

export const PropertyProgressNotification: React.FC<PropertyProgressNotificationProps> = ({
  propertyId,
  propertyTitle,
  completionPercentage,
  missingFields,
  propertyType = 'residential',
  onDismiss
}) => {
  const navigate = useNavigate();

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressMessage = (percentage: number) => {
    if (percentage >= 80) return "Your property is almost complete! Just a few more details to make it shine ✨";
    if (percentage >= 60) return "Great progress! Add more details to attract better tenants/buyers 🎯";
    if (percentage >= 40) return "Good start! Complete your listing to get more visibility 📈";
    return "Your property needs more details to stand out. Let's complete it! 🚀";
  };

  const getSuggestions = (missingFields: string[], propertyType: string) => {
    const isCommercial = propertyType === 'commercial' || propertyType === 'office' || 
                        propertyType === 'shop' || propertyType === 'warehouse' || propertyType === 'showroom';
    
    const suggestions = [];
    
    if (missingFields.includes('images')) {
      suggestions.push({ icon: Camera, text: 'Upload photos', action: 'gallery' });
    }
    if (missingFields.includes('amenities')) {
      suggestions.push({ icon: Star, text: 'Add amenities', action: 'amenities' });
    }
    if (missingFields.includes('locality')) {
      suggestions.push({ icon: MapPin, text: 'Complete location', action: 'location' });
    }
    if (missingFields.includes('super_area')) {
      suggestions.push({ icon: Home, text: 'Add property area', action: 'details' });
    }
    if (missingFields.includes('bhk_type') && !isCommercial) {
      suggestions.push({ icon: Home, text: 'Specify BHK type', action: 'details' });
    }
    if (missingFields.includes('description')) {
      suggestions.push({ icon: Home, text: 'Add description', action: 'basic' });
    }
    if (missingFields.includes('expected_price')) {
      suggestions.push({ icon: TrendingUp, text: 'Set price details', action: 'pricing' });
    }

    return suggestions.slice(0, 3); // Show max 3 suggestions
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

  const suggestions = getSuggestions(missingFields, propertyType);

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500 bg-blue-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Progress Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Complete Your Property Listing
            </h3>
            <p className="text-gray-700 mb-3">
              {getProgressMessage(completionPercentage)}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Listing Completion
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {completionPercentage}%
                </span>
              </div>
              <Progress 
                value={completionPercentage} 
                className="h-2"
              />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Quick improvements:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 bg-white px-2 py-1 rounded-md text-xs text-gray-600 border"
                    >
                      <suggestion.icon className="w-3 h-3" />
                      <span>{suggestion.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              size="sm"
              onClick={handleImproveListing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Improve Listing
            </Button>
          </div>

          {/* Dismiss Button */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
