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
    plot_area_unit?: string;
  };
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  const isPG = property.property_type?.toLowerCase().includes('pg') ||
               property.property_type?.toLowerCase().includes('hostel') ||
               property.property_type?.toLowerCase().includes('coliving');
  
  const isPlot = property.property_type?.toLowerCase().includes('plot') || 
                 property.property_type?.toLowerCase().includes('land');
  
  const price = isPG ? (property.expected_rent || property.expected_price) : property.expected_price;
  const deposit = property.security_deposit;
  const area = property.super_area || property.carpet_area;
  
  const getAreaUnit = () => {
    if (isPlot && property.plot_area_unit) {
      console.log('PropertyHeader: Plot area unit detected:', {
        propertyType: property.property_type,
        plotAreaUnit: property.plot_area_unit,
        isPlot,
        area
      });
      const unitMap: Record<string, string> = {
        'sq-ft': 'Sq.Ft',
        'sq-yard': 'Sq.Yard',
        'acre': 'Acre',
        'hectare': 'Hectare',
        'bigha': 'Bigha',
        'biswa': 'Biswa',
        'gunta': 'Gunta',
        'cents': 'Cents',
        'marla': 'Marla',
        'kanal': 'Kanal',
        'kottah': 'Kottah'
      };
      return unitMap[property.plot_area_unit] || property.plot_area_unit;
    }
    console.log('PropertyHeader: Using default Sq.Ft unit:', {
      propertyType: property.property_type,
      plotAreaUnit: property.plot_area_unit,
      isPlot,
      area
    });
    return 'Sq.Ft';
  };

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
            {property.property_type?.replace('_', ' ')} for {property.listing_type} in {property.locality}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Property Details</span>
        </nav>

        {/* Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-center border border-gray-200 rounded-lg bg-white overflow-hidden min-w-0">
          {/* Mobile Layout */}
          <div className="block lg:hidden min-w-0">
            {/* Property Info Section - Mobile */}
            <div className="px-3 sm:px-4 py-3 border-b border-gray-200 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words">
                {property.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 break-words">
                {property.locality}
              </p>
            </div>
            
            {/* Price Info Grid - Mobile */}
            <div className={`grid gap-0 ${isPG ? 'grid-cols-2' : (isPlot ? 'grid-cols-2' : 'grid-cols-3')}`}>
              {/* Rent Section */}
              <div className="text-center px-2 sm:px-3 py-3 border-r border-gray-200">
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  {price ? `₹${price.toLocaleString()}` : 'Not specified'}
                </div>
                <div className="text-xs text-gray-600">{property.listing_type === 'sale' ? 'Price' : 'Rent'}</div>
              </div>
              
              {/* Area Section - Hidden for PG/Hostel */}
              {!isPG && (
                <div className="text-center px-2 sm:px-3 py-3 border-r border-gray-200">
                  <div className="text-base sm:text-lg font-bold text-gray-900">
                    {area ? area.toLocaleString() : 'Not specified'}
                  </div>
                  <div className="text-xs text-gray-600">{getAreaUnit()}</div>
                </div>
              )}
              
              {/* Deposit Section - hidden for Plot/Land */}
              {!isPlot && (
                <div className="text-center px-2 sm:px-3 py-3">
                  <div className="text-base sm:text-lg font-bold text-gray-900">
                    {deposit ? `₹${deposit.toLocaleString()}` : (price ? `₹${(price * 2).toLocaleString()}` : 'Not specified')}
                  </div>
                  <div className="text-xs text-gray-600">Deposit</div>
                </div>
              )}
            </div>

            {/* Apply Loan Button - Mobile */}
            <div className="px-3 sm:px-4 py-3 border-t border-gray-200">
              <Link to="/loans" className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm sm:text-base">
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
              <span className="text-sm text-gray-600">{property.listing_type === 'sale' ? 'Sale' : 'Rent'}</span>
            </div>
            
            {/* Property Info Section */}
            <div className="flex-1 px-6 py-4 border-r border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {property.title}
              </h1>
              <p className="text-gray-600 truncate max-w-xs">
                {property.locality}
              </p>
            </div>

            {/* Price Section */}
            <div className="text-center px-6 py-4 border-r border-gray-200">
              <div className="text-xl font-bold text-gray-900">
                {price ? `₹${price.toLocaleString()}` : 'Not specified'}
                {deposit && (
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    + {deposit.toLocaleString()} ₹
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">{property.listing_type === 'sale' ? 'Price' : 'Rent'}</div>
            </div>
            
            {/* Area Section - Hidden for PG/Hostel */}
            {!isPG && (
              <div className="text-center px-6 py-4 border-r border-gray-200">
                <div className="text-xl font-bold text-gray-900">
                  {area ? area.toLocaleString() : 'Not specified'}
                </div>
                <div className="text-sm text-gray-600">{getAreaUnit()}</div>
              </div>
            )}
            
            {/* Deposit Section - hidden for Plot/Land */}
            {!isPlot && (
              <div className="text-center px-6 py-4 border-r border-gray-200">
                <div className="text-xl font-bold text-gray-900">
                  {deposit ? `₹${deposit.toLocaleString()}` : (price ? `₹${(price * 2).toLocaleString()}` : 'Not specified')}
                </div>
                <div className="text-sm text-gray-600">Deposit</div>
              </div>
            )}

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