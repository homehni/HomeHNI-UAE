import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentCountryConfig } from '@/services/domainCountryService';

interface PropertyHeaderProps {
  property: {
    id: string;
    title: string;
    locality: string;
    expected_price?: number;
    expected_rent?: number;
    expected_deposit?: number;
    super_area?: number;
    carpet_area?: number;
    plot_area?: number;
    property_type?: string;
    listing_type?: string;
    security_deposit?: number;
    plot_area_unit?: string;
    is_premium?: boolean;
    payload?: {
      plot_area?: number;
      super_area?: number;
      carpet_area?: number;
      plot_area_unit?: string;
      originalFormData?: {
        propertyInfo?: {
          plotArea?: number;
          superArea?: number;
          carpetArea?: number;
          plotAreaUnit?: string;
        };
      };
    };
  };
  onContact?: () => void;
  onScheduleVisit?: () => void;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ 
  property, 
  onContact, 
  onScheduleVisit 
}) => {
  const countryConfig = getCurrentCountryConfig();
  const currencySymbol = countryConfig.currency === 'AED' ? 'AED' : '₹';
  
  const isPG = property.property_type?.toLowerCase().includes('pg') ||
               property.property_type?.toLowerCase().includes('hostel') ||
               property.property_type?.toLowerCase().includes('coliving');
  
  const isPlot = property.property_type?.toLowerCase().includes('plot') || 
                 property.property_type?.toLowerCase().includes('land');
  const listingType = property.listing_type?.toLowerCase();
  const isRent = listingType === 'rent' || listingType === 'lease';
  // Show deposit only for Rentals/Lease and PG properties; hide for Sale and Plots
  const showDeposit = !isPlot && (isPG || isRent);
  
  const price = isPG ? (property.expected_rent || property.expected_price) : property.expected_price;
  const deposit = isPG
    ? (property.expected_deposit ?? property.security_deposit)
    : property.security_deposit;
  // Enhanced area extraction with additional path checks
  const extractArea = () => {
    console.log('PropertyHeader extractArea debug:', {
      superArea: property.super_area,
      carpetArea: property.carpet_area,
      plotArea: property.plot_area,
      payloadPlotArea: property.payload?.plot_area,
      nestedPlotArea: property.payload?.originalFormData?.propertyInfo?.plotArea,
      isPlot: isPlot,
      propertyType: property.property_type
    });
    
    // For plots and land, try plot area first
    if (isPlot) {
      return property.plot_area || 
             property.payload?.plot_area || 
             property.payload?.originalFormData?.propertyInfo?.plotArea || 
             property.super_area || 
             property.carpet_area;
    }
    
    // For other property types
    return property.super_area || 
           property.carpet_area || 
           property.payload?.super_area || 
           property.payload?.carpet_area || 
           property.payload?.originalFormData?.propertyInfo?.superArea || 
           property.payload?.originalFormData?.propertyInfo?.carpetArea;
  };
  
  const area = extractArea();
  
  const getAreaUnit = () => {
    // Get plot area unit from multiple possible locations
    const plotAreaUnit = property.plot_area_unit || 
                         property.payload?.plot_area_unit ||
                         property.payload?.originalFormData?.propertyInfo?.plotAreaUnit;
                         
    if (isPlot && plotAreaUnit) {
      console.log('PropertyHeader: Plot area unit detected:', {
        propertyType: property.property_type,
        plotAreaUnit: plotAreaUnit,
        originalUnit: property.plot_area_unit,
        payloadUnit: property.payload?.plot_area_unit,
        nestedUnit: property.payload?.originalFormData?.propertyInfo?.plotAreaUnit,
        isPlot,
        area
      });
      
      const unitMap: Record<string, string> = {
        'sq-ft': 'Sq.Ft',
        'sq-yard': 'Sq.Yard',
        'sq-m': 'Sq.M',
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
      
      return unitMap[plotAreaUnit] || plotAreaUnit;
    }
    
    console.log('PropertyHeader: Using default Sq.Ft unit:', {
      propertyType: property.property_type,
      plotAreaUnit: plotAreaUnit,
      isPlot,
      area
    });
    
    return 'Sq.Ft';
  };

  return (
    <div className="bg-white border-b pt-0 sm:pt-6">
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
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 break-words flex-1">
                  {property.title}
                </h1>
                {property.is_premium && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/95 text-amber-950 shadow px-2 py-0.5 text-[10px] sm:text-xs flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.77 7.22 16.7l.91-5.32L4.27 7.62l5.34-.78L12 2z" />
                    </svg>
                    Premium
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-gray-600 break-words">
                {property.locality}
              </p>
            </div>
            
            {/* Price Info Grid - Mobile */}
            <div className={`grid gap-0 ${isPG ? 'grid-cols-2' : (isPlot ? 'grid-cols-2' : (showDeposit ? 'grid-cols-3' : 'grid-cols-2'))}`}>
              {/* Rent Section */}
              <div className="text-center px-2 sm:px-3 py-3 border-r border-gray-200">
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  {price ? `${currencySymbol} ${price.toLocaleString('en-IN')}` : 'Not specified'}
                </div>
                <div className="text-xs text-gray-600">{property.listing_type === 'sale' ? 'Price' : 'Rent'}</div>
              </div>
              
              {/* Area Section - Hidden for PG/Hostel */}
              {!isPG && (
                <div className="text-center px-2 sm:px-3 py-3 border-r border-gray-200">
                  <div className="text-base sm:text-lg font-bold text-gray-900">
                    {area ? area.toLocaleString('en-IN') : 'Not specified'}
                  </div>
                  <div className="text-xs text-gray-600">{getAreaUnit()}</div>
                </div>
              )}
              
              {/* Deposit Section - only for Rent/PG; hidden for Plot/Land and Sale */}
              {showDeposit && (
                <div className="text-center px-2 sm:px-3 py-3">
                  <div className="text-base sm:text-lg font-bold text-gray-900">
                    {typeof deposit === 'number' ? `${currencySymbol} ${deposit.toLocaleString('en-IN')}` : 'Not specified'}
                  </div>
                  <div className="text-xs text-gray-600">Deposit</div>
                </div>
              )}
            </div>

            {/* Contact & Schedule Visit Buttons - Mobile Only (Right after price) */}
            {onContact && onScheduleVisit && (
              <div className="px-3 sm:px-4 py-3 border-t border-gray-200">
                <div className="space-y-3">
                  <Button 
                    onClick={onContact}
                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium"
                  >
                    Contact
                  </Button>
                  <Button 
                    onClick={onScheduleVisit}
                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium"
                  >
                    Schedule Visit
                  </Button>
                </div>
              </div>
            )}
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
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {property.title}
                </h1>
                {property.is_premium && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/95 text-amber-950">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium
                  </span>
                )}
              </div>
              <p className="text-gray-600 truncate max-w-xs">
                {property.locality}
              </p>
            </div>

            {/* Price Section */}
            <div className="text-center px-6 py-4 border-r border-gray-200">
              <div className="text-xl font-bold text-gray-900 whitespace-nowrap">
                {price ? `${currencySymbol} ${price.toLocaleString('en-IN')}` : 'Not specified'}
              </div>
              {showDeposit && typeof deposit === 'number' && deposit > 0 && (
                <div className="text-sm font-normal text-gray-500 mt-1">
                  Deposit: {currencySymbol} {deposit.toLocaleString('en-IN')}
                </div>
              )}
            </div>
            
            {/* Area Section - Hidden for PG/Hostel */}
            {!isPG && (
              <div className="text-center px-6 py-4 border-r border-gray-200">
                <div className="text-xl font-bold text-gray-900">
                  {area ? area.toLocaleString('en-IN') : 'Not specified'}
                </div>
                <div className="text-sm text-gray-600">{getAreaUnit()}</div>
              </div>
            )}
            
            {/* Deposit Section - only for Rent/PG; hidden for Plot/Land and Sale */}
            {showDeposit && (
              <div className="text-center px-6 py-4 border-r border-gray-200">
                <div className="text-xl font-bold text-gray-900">
                  {typeof deposit === 'number' ? `${currencySymbol} ${deposit.toLocaleString('en-IN')}` : 'Not specified'}
                </div>
                <div className="text-sm text-gray-600">Deposit</div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};