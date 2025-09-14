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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Side - Property Info */}
          <div className="flex items-start gap-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <Building className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {property.title}
              </h1>
              <p className="text-gray-600 mb-2">
                Standalone building, {property.locality}
              </p>
            </div>
          </div>

          {/* Right Side - Price Table */}
          <div className="flex items-center gap-6">
            {/* Price Table Layout */}
            <div className="flex bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              {/* Rent Column */}
              <div className="px-6 py-4 border-r border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ₹{price?.toLocaleString() || '60,000'}
                  <span className="text-lg font-normal text-gray-500 ml-1">
                    + {deposit.toLocaleString()} ₹
                  </span>
                </div>
                <div className="text-sm text-gray-600">Rent</div>
              </div>
              
              {/* Area Column */}
              <div className="px-6 py-4 border-r border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {area.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Sq.Ft</div>
              </div>
              
              {/* Deposit Column */}
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ₹{((price || 60000) * 2).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Deposit</div>
              </div>
            </div>

            {/* Apply Loan Button */}
            <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium">
              Apply Loan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};