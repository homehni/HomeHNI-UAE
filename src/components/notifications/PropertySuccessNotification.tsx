import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertySuccessNotificationProps {
  propertyId: string;
  propertyTitle: string;
  onDismiss?: () => void;
}

export const PropertySuccessNotification: React.FC<PropertySuccessNotificationProps> = ({
  propertyId,
  propertyTitle,
  onDismiss
}) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Success Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Congratulations!
            </h3>
            <p className="text-gray-700 mb-4">
              You have successfully posted your property "{propertyTitle}". It will be live within 12 hours.
            </p>
            
            {/* Action Button */}
            <Button
              size="sm"
              onClick={() => navigate(`/property/${propertyId}?refresh=true`)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Property
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
