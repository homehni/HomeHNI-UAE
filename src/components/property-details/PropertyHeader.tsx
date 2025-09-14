import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyHeaderProps {
  property: {
    id: string;
    title: string;
    locality: string;
    expected_price?: number;
    expected_rent?: number;
    super_area?: number;
    carpet_area?: number;
    property_type?: string;
    listing_type?: string;
    security_deposit?: number;
  };
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  const isPG = property.property_type?.toLowerCase().includes('pg') ||
               property.property_type?.toLowerCase().includes('hostel') ||
               property.property_type?.toLowerCase().includes('coliving');
  
  const price = isPG ? property.expected_rent : property.expected_price;
  const deposit = property.security_deposit || 2000;
  const area = property.super_area || property.carpet_area || 1600;

  return (
    <div className="bg-white border-b pt-24">
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4 flex items-center">
          <Link to="/" className="hover:text-primary flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/property-search?location=${property.locality}`} className="hover:text-primary">
            Flats for Rent in {property.locality}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Property Details</span>
        </nav>

        {/* Header Content */}
        <div className="flex items-center justify-between gap-4">
          {/* Left Side - Property Info */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-red-50 p-3 rounded-lg mb-2">
                <Building className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Rent</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {property.title}
              </h1>
              <p className="text-gray-600">
                Standalone building, {property.locality}
              </p>
            </div>
          </div>

          {/* Right Side - Price Sections and Button */}
          <div className="flex items-center gap-4">
            {/* Rent Section */}
            <div className="text-center px-4">
              <div className="text-xl font-bold text-gray-900">
                ₹{price?.toLocaleString() || '33,000'}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  + {deposit.toLocaleString()} ₹
                </span>
              </div>
              <div className="text-sm text-gray-600">Rent</div>
            </div>
            
            {/* Area Section */}
            <div className="text-center px-4">
              <div className="text-xl font-bold text-gray-900">
                {area.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Sq.Ft</div>
            </div>
            
            {/* Deposit Section */}
            <div className="text-center px-4">
              <div className="text-xl font-bold text-gray-900">
                ₹{((price || 33000) * 2).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Deposit</div>
            </div>

            {/* Apply Loan Button */}
            <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium ml-4">
              Apply Loan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};