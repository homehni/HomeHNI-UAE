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
    <div className="bg-white border-b pt-0 sm:pt-24">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4 hidden sm:flex items-center">
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
        <div className="flex flex-col lg:flex-row lg:items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            {/* Property Info Section - Mobile */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {property.title}
              </h1>
              <p className="text-gray-600 truncate">
                Standalone building, {property.locality}
              </p>
            </div>
            
            {/* Price Info Grid - Mobile */}
            <div className="grid grid-cols-3 gap-0">
              {/* Rent Section */}
              <div className="text-center px-2 sm:px-3 py-3 border-r border-gray-200">
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  ₹{price?.toLocaleString() || '33,000'}
                </div>
                <div className="text-xs text-gray-600">Rent</div>
              </div>
              
              {/* Area Section */}
              <div className="text-center px-2 sm:px-3 py-3 border-r border-gray-200">
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  {area.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Sq.Ft</div>
              </div>
              
              {/* Deposit Section */}
              <div className="text-center px-2 sm:px-3 py-3">
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  ₹{((price || 33000) * 2).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Deposit</div>
              </div>
            </div>

            {/* Apply Loan Button - Mobile */}
            <div className="px-4 py-3 border-t border-gray-200">
              <Link to="/loans" className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium">
                  Apply Loan
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center w-full">
            {/* Icon Section */}
            <div className="flex flex-col items-center px-6 py-4 border-r border-gray-200">
              <div className="bg-red-50 p-3 rounded-lg mb-2">
                <Building className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Rent</span>
            </div>
            
            {/* Property Info Section */}
            <div className="flex-1 px-6 py-4 border-r border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {property.title}
              </h1>
              <p className="text-gray-600 truncate max-w-xs">
                Standalone building, {property.locality}
              </p>
            </div>

            {/* Rent Section */}
            <div className="text-center px-6 py-4 border-r border-gray-200">
              <div className="text-xl font-bold text-gray-900">
                ₹{price?.toLocaleString() || '33,000'}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  + {deposit.toLocaleString()} ₹
                </span>
              </div>
              <div className="text-sm text-gray-600">Rent</div>
            </div>
            
            {/* Area Section */}
            <div className="text-center px-6 py-4 border-r border-gray-200">
              <div className="text-xl font-bold text-gray-900">
                {area.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Sq.Ft</div>
            </div>
            
            {/* Deposit Section */}
            <div className="text-center px-6 py-4 border-r border-gray-200">
              <div className="text-xl font-bold text-gray-900">
                ₹{((price || 33000) * 2).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Deposit</div>
            </div>

            {/* Apply Loan Button Section */}
            <div className="px-6 py-4">
              <Link to="/loans">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium">
                  Apply Loan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};