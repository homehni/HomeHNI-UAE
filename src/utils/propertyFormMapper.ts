// @ts-nocheck
import { PropertyInfo, OwnerInfo, LocationDetails, RentalDetails, Amenities, PropertyGallery, AdditionalInfo, ScheduleInfo } from '@/types/property';
import { SalePropertyInfo, SaleDetails } from '@/types/saleProperty';
import { PGHostelFormData } from '@/types/property';
import { FlattmatesFormData } from '@/types/property';
import { CommercialFormData } from '@/types/property';
import { CommercialSaleFormData } from '@/types/commercialSaleProperty';
import { LandPlotFormData } from '@/types/landPlotProperty';

interface Property {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price: number;
  super_area?: number;
  carpet_area?: number;
  bathrooms?: number;
  balconies?: number;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  description?: string;
  images?: string[];
  videos?: string[];
  status: string;
  created_at: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_role?: string;
  // Additional fields
  furnishing_status?: string;
  building_type?: string;
  property_age?: string;
  floor_type?: string;
  total_floors?: number;
  floor_no?: number;
  parking_type?: string;
  on_main_road?: boolean;
  corner_property?: boolean;
  amenities?: string[];
  // Commercial specific fields
  commercial_type?: string;
  // Land/Plot specific fields
  land_type?: string;
  // PG/Hostel specific fields
  pg_type?: string;
  room_type?: string;
  // Flatmates specific fields
  flatmates_type?: string;
}

// Helper function to map property type from database to form
const mapPropertyTypeToForm = (dbType: string): string => {
  const typeMap: { [key: string]: string } = {
    'apartment': 'Apartment/Flat',
    'villa': 'Villa',
    'independent_house': 'Independent House/Villa',
    'builder_floor': 'Builder Floor',
    'studio_apartment': 'Studio Apartment',
    'penthouse': 'Penthouse',
    'duplex': 'Duplex',
    'plot': 'Plot/Land',
    'agriculture_lands': 'Agricultural Land',
    'farm_house': 'Farmhouse',
    'studio': 'Studio',
    'pg_hostel': 'PG/Hostel',
    'commercial': 'Commercial',
    'office': 'Office Space',
    'shop': 'Retail/Shop',
    'warehouse': 'Industrial/Warehouse',
    'showroom': 'Showroom',
    'coworking': 'Co-working',
    'hotel': 'Hospitality/Hotel'
  };
  return typeMap[dbType] || 'Apartment/Flat';
};

// Helper function to map listing type from database to form
const mapListingTypeToForm = (dbType: string): string => {
  const typeMap: { [key: string]: string } = {
    'rent': 'Rent',
    'sale': 'Resale',
    'flatmates': 'Flatmates',
    'pg_hostel': 'PG/Hostel'
  };
  return typeMap[dbType] || 'Rent';
};

// Helper function to map BHK type from database to form
const mapBhkTypeToForm = (dbType: string): string => {
  const typeMap: { [key: string]: string } = {
    '1rk': '1 RK',
    '1bhk': '1 BHK',
    '2bhk': '2 BHK',
    '3bhk': '3 BHK',
    '4bhk': '4 BHK',
    '5bhk': '5 BHK',
    '5bhk+': '5+ BHK',
    '6bhk': '6 BHK'
  };
  return typeMap[dbType] || dbType;
};

export const mapPropertyToFormData = (property: Property): {
  ownerInfo: OwnerInfo;
  propertyInfo: PropertyInfo | SalePropertyInfo | PGHostelFormData | FlattmatesFormData | CommercialFormData | CommercialSaleFormData | LandPlotFormData;
} => {
  const ownerInfo: OwnerInfo = {
    name: property.owner_name || '',
    email: property.owner_email || '',
    phone: property.owner_phone || '',
    role: property.owner_role as 'Owner' | 'Agent' | 'Builder' | 'Developer' || 'Owner',
    whatsappUpdates: false,
    propertyType: property.property_type === 'commercial' || property.property_type === 'office' || property.property_type === 'shop' || property.property_type === 'warehouse' ? 'Commercial' : 
                  property.property_type === 'plot' || property.property_type === 'agriculture_lands' ? 'Land/Plot' : 'Residential',
    listingType: mapListingTypeToForm(property.listing_type)
  };

  // Determine the form type and create appropriate property info
  if (property.property_type === 'pg_hostel') {
    const pgFormData: PGHostelFormData = {
      ownerInfo,
      propertyInfo: {
        title: property.title,
        propertyType: mapPropertyTypeToForm(property.property_type),
        roomTypes: {
          selectedType: property.room_type as 'single' | 'double' | 'three' | 'four' || 'single'
        },
        roomDetails: {
          expectedRent: property.expected_price,
          expectedDeposit: Math.round(property.expected_price * 2), // Assuming 2 months deposit
          cupboard: false,
          geyser: false,
          tv: false,
          ac: false,
          bedding: false,
          attachedBathroom: false
        },
        localityDetails: {
          state: property.state,
          city: property.city,
          locality: property.locality,
          pincode: property.pincode,
          societyName: '',
          landmark: ''
        },
        pgDetails: {
          genderPreference: 'anyone' as const,
          preferredGuests: 'any' as const,
          availableFrom: new Date().toISOString().split('T')[0],
          foodIncluded: 'no' as const,
          rules: {
            noSmoking: false,
            noGuardiansStay: false,
            noGirlsEntry: false,
            noDrinking: false,
            noNonVeg: false
          },
          gateClosingTime: '10:00 PM',
          description: property.description || ''
        },
        amenities: {
          powerBackup: 'no',
          lift: 'no',
          parking: 'no',
          waterStorageFacility: 'no',
          security: 'no',
          wifi: 'no',
          currentPropertyCondition: 'good',
          directionsTip: ''
        },
        gallery: {
          images: property.images || [],
          video: property.videos?.[0] || undefined
        },
        pgAdditionalInfo: {
          description: property.description || '',
          previousOccupancy: '',
          paintingRequired: 'no',
          cleaningRequired: 'no'
        },
        scheduleInfo: {
          availability: 'everyday',
          paintingService: 'decline',
          cleaningService: 'decline',
          startTime: '9:00 AM',
          endTime: '6:00 PM',
          availableAllDay: true
        }
      }
    };
    return { ownerInfo, propertyInfo: pgFormData };
  }

  if (property.property_type === 'apartment' && property.listing_type === 'rent' && property.flatmates_type) {
    const flatmatesFormData: FlattmatesFormData = {
      ownerInfo,
      propertyInfo: {
        title: property.title,
        propertyType: mapPropertyTypeToForm(property.property_type),
        apartmentType: property.flatmates_type || 'apartment',
        bhkType: mapBhkTypeToForm(property.bhk_type || ''),
        floorNo: property.floor_no || 0,
        totalFloors: property.total_floors || 0,
        roomType: property.room_type || 'single',
        tenantType: 'anyone',
        propertyAge: property.property_age || 'new',
        facing: 'east',
        builtUpArea: property.super_area || 0,
        localityDetails: {
          state: property.state,
          city: property.city,
          locality: property.locality,
          pincode: property.pincode,
          societyName: '',
          landmark: ''
        },
        flattmatesDetails: {
          expectedRent: property.expected_price,
          expectedDeposit: Math.round(property.expected_price * 2),
          rentNegotiable: false,
          monthlyMaintenance: '0',
          availableFrom: new Date().toISOString().split('T')[0],
          description: property.description || ''
        },
        amenities: {
          powerBackup: 'no',
          lift: 'no',
          parking: 'no',
          waterStorageFacility: 'no',
          security: 'no',
          wifi: 'no',
          currentPropertyCondition: 'good',
          directionsTip: ''
        },
        gallery: {
          images: property.images || [],
          video: property.videos?.[0] || undefined
        },
        additionalInfo: {
          description: property.description || '',
          previousOccupancy: '',
          paintingRequired: 'no',
          cleaningRequired: 'no'
        },
        scheduleInfo: {
          availability: 'everyday',
          paintingService: 'decline',
          cleaningService: 'decline',
          startTime: '9:00 AM',
          endTime: '6:00 PM',
          availableAllDay: true
        }
      }
    };
    return { ownerInfo, propertyInfo: flatmatesFormData };
  }

  if (property.property_type === 'commercial' || property.property_type === 'office' || property.property_type === 'shop' || property.property_type === 'warehouse') {
    if (property.listing_type === 'rent') {
      const commercialFormData: CommercialFormData = {
        ownerInfo,
        propertyInfo: {
          title: property.title,
          propertyType: mapPropertyTypeToForm(property.property_type),
          commercialType: property.commercial_type || 'office',
          superBuiltUpArea: property.super_area || 0,
          carpetArea: property.carpet_area || 0,
          bathrooms: property.bathrooms || 0,
          balconies: property.balconies || 0,
          floorNo: property.floor_no || 0,
          totalFloors: property.total_floors || 0,
          propertyAge: property.property_age || 'new',
          furnishingStatus: property.furnishing_status || 'unfurnished',
          parkingType: property.parking_type || 'none',
          onMainRoad: property.on_main_road || false,
          cornerProperty: property.corner_property || false,
          locationDetails: {
            state: property.state,
            city: property.city,
            locality: property.locality,
            pincode: property.pincode,
            societyName: '',
            landmark: ''
          },
          commercialRentalDetails: {
            expectedRent: property.expected_price,
            expectedDeposit: Math.round(property.expected_price * 2),
            rentNegotiable: false,
            monthlyMaintenance: '0',
            availableFrom: new Date().toISOString().split('T')[0],
            description: property.description || ''
          },
          amenities: {
            powerBackup: 'no',
            lift: 'no',
            parking: 'no',
            waterStorageFacility: 'no',
            security: 'no',
            wifi: 'no',
            currentPropertyCondition: 'good',
            directionsTip: ''
          },
          gallery: {
            images: property.images || [],
            video: property.videos?.[0] || undefined
          },
          additionalInfo: {
            description: property.description || '',
            previousOccupancy: '',
            paintingRequired: 'no',
            cleaningRequired: 'no'
          },
          scheduleInfo: {
            availability: 'everyday',
            paintingService: 'decline',
            cleaningService: 'decline',
            startTime: '9:00 AM',
            endTime: '6:00 PM',
            availableAllDay: true
          }
        }
      };
      return { ownerInfo, propertyInfo: commercialFormData };
    } else {
      const commercialSaleFormData: CommercialSaleFormData = {
        ownerInfo,
        propertyInfo: {
          title: property.title,
          propertyType: mapPropertyTypeToForm(property.property_type),
          commercialType: property.commercial_type || 'office',
          superBuiltUpArea: property.super_area || 0,
          carpetArea: property.carpet_area || 0,
          bathrooms: property.bathrooms || 0,
          balconies: property.balconies || 0,
          floorNo: property.floor_no || 0,
          totalFloors: property.total_floors || 0,
          propertyAge: property.property_age || 'new',
          furnishingStatus: property.furnishing_status || 'unfurnished',
          parkingType: property.parking_type || 'none',
          onMainRoad: property.on_main_road || false,
          cornerProperty: property.corner_property || false,
          locationDetails: {
            state: property.state,
            city: property.city,
            locality: property.locality,
            pincode: property.pincode,
            societyName: '',
            landmark: ''
          },
          commercialSaleDetails: {
            expectedPrice: property.expected_price,
            priceNegotiable: false,
            monthlyMaintenance: '0',
            availableFrom: new Date().toISOString().split('T')[0],
            description: property.description || ''
          },
          amenities: {
            powerBackup: 'no',
            lift: 'no',
            parking: 'no',
            waterStorageFacility: 'no',
            security: 'no',
            wifi: 'no',
            currentPropertyCondition: 'good',
            directionsTip: ''
          },
          gallery: {
            images: property.images || [],
            video: property.videos?.[0] || undefined
          },
          additionalInfo: {
            description: property.description || '',
            previousOccupancy: '',
            paintingRequired: 'no',
            cleaningRequired: 'no'
          },
          scheduleInfo: {
            availability: 'everyday',
            paintingService: 'decline',
            cleaningService: 'decline',
            startTime: '9:00 AM',
            endTime: '6:00 PM',
            availableAllDay: true
          }
        }
      };
      return { ownerInfo, propertyInfo: commercialSaleFormData };
    }
  }

  if (property.property_type === 'plot' || property.property_type === 'agriculture_lands') {
    const landPlotFormData: LandPlotFormData = {
      ownerInfo,
      propertyInfo: {
        title: property.title,
        propertyType: mapPropertyTypeToForm(property.property_type),
        landType: property.land_type as 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'institutional' || 'residential',
        area: property.super_area || 0,
        length: 0,
        breadth: 0,
        plotDetails: {
          propertyType: mapPropertyTypeToForm(property.property_type),
          landType: property.land_type as 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'institutional' || 'residential',
          area: property.super_area || 0,
          length: 0,
          breadth: 0,
          villageName: '',
          surveyNumber: '',
          plotNumber: '',
          facing: 'east',
          plotType: 'corner',
          roadWidth: 0,
          approachRoad: 'yes',
          electricityConnection: 'yes',
          waterConnection: 'yes',
          sewageConnection: 'yes',
          gasConnection: 'yes',
          internetConnection: 'yes'
        },
        locationDetails: {
          state: property.state,
          city: property.city,
          locality: property.locality,
          pincode: property.pincode,
          societyName: '',
          landmark: ''
        },
        plotSaleDetails: {
          expectedPrice: property.expected_price,
          priceNegotiable: false,
          availableFrom: new Date().toISOString().split('T')[0],
          description: property.description || ''
        },
        amenities: {
          powerBackup: 'no',
          lift: 'no',
          parking: 'no',
          waterStorageFacility: 'no',
          security: 'no',
          wifi: 'no',
          currentPropertyCondition: 'good',
          directionsTip: ''
        },
        gallery: {
          images: property.images || [],
          video: property.videos?.[0] || undefined
        },
        plotAdditionalInfo: {
          description: property.description || '',
          previousOccupancy: '',
          paintingRequired: 'no',
          cleaningRequired: 'no'
        },
        scheduleInfo: {
          availability: 'everyday',
          paintingService: 'decline',
          cleaningService: 'decline',
          startTime: '9:00 AM',
          endTime: '6:00 PM',
          availableAllDay: true
        }
      }
    };
    return { ownerInfo, propertyInfo: landPlotFormData };
  }

  // Default to rental or resale form based on listing type
  if (property.listing_type === 'sale') {
    const salePropertyInfo: SalePropertyInfo = {
      propertyDetails: {
        title: property.title,
        propertyType: mapPropertyTypeToForm(property.property_type),
        bhkType: mapBhkTypeToForm(property.bhk_type || ''),
        buildingType: property.building_type || 'apartment',
        propertyAge: property.property_age || 'new',
        floorType: property.floor_type || 'marble',
        totalFloors: property.total_floors || 1,
        floorNo: property.floor_no || 0,
        furnishingStatus: property.furnishing_status || 'unfurnished',
        bathrooms: property.bathrooms || 0,
        balconies: property.balconies || 0,
        parkingType: property.parking_type || 'none',
        superBuiltUpArea: property.super_area || 0,
        carpetArea: property.carpet_area || 0,
        onMainRoad: property.on_main_road || false,
        cornerProperty: property.corner_property || false
      },
      locationDetails: {
        state: property.state,
        city: property.city,
        locality: property.locality,
        pincode: property.pincode,
        societyName: '',
        landmark: ''
      },
      saleDetails: {
        expectedPrice: property.expected_price,
        priceNegotiable: false,
        monthlyMaintenance: '0',
        availableFrom: new Date().toISOString().split('T')[0],
        description: property.description || ''
      },
      amenities: {
        powerBackup: 'no',
        lift: 'no',
        parking: 'no',
        waterStorageFacility: 'no',
        security: 'no',
        wifi: 'no',
        currentPropertyCondition: 'good',
        directionsTip: ''
      },
      gallery: {
        images: property.images || [],
        video: property.videos?.[0] || undefined
      },
      additionalInfo: {
        description: property.description || '',
        previousOccupancy: '',
        paintingRequired: 'no',
        cleaningRequired: 'no'
      },
      scheduleInfo: {
        availability: 'everyday',
        paintingService: 'decline',
        cleaningService: 'decline',
        startTime: '9:00 AM',
        endTime: '6:00 PM',
        availableAllDay: true
      }
    };
    return { ownerInfo, propertyInfo: salePropertyInfo };
  }

  // Default rental form
  const propertyInfo: PropertyInfo = {
    propertyDetails: {
      title: property.title,
      propertyType: mapPropertyTypeToForm(property.property_type),
      bhkType: mapBhkTypeToForm(property.bhk_type || ''),
      buildingType: property.building_type || 'apartment',
      propertyAge: property.property_age || 'new',
      floorType: property.floor_type || 'marble',
      totalFloors: property.total_floors || 1,
      floorNo: property.floor_no || 0,
      furnishingStatus: property.furnishing_status || 'unfurnished',
      bathrooms: property.bathrooms || 0,
      balconies: property.balconies || 0,
      parkingType: property.parking_type || 'none',
      superBuiltUpArea: property.super_area || 0,
      carpetArea: property.carpet_area || 0,
      onMainRoad: property.on_main_road || false,
      cornerProperty: property.corner_property || false
    },
    locationDetails: {
      state: property.state,
      city: property.city,
      locality: property.locality,
      pincode: property.pincode,
      societyName: '',
      landmark: ''
    },
    rentalDetails: {
      expectedRent: property.expected_price,
      expectedDeposit: Math.round(property.expected_price * 2),
      rentNegotiable: false,
      monthlyMaintenance: '0',
      availableFrom: new Date().toISOString().split('T')[0],
      description: property.description || ''
    },
    amenities: {
      powerBackup: 'no',
      lift: 'no',
      parking: 'no',
      waterStorageFacility: 'no',
      security: 'no',
      wifi: 'no',
      currentPropertyCondition: 'good',
      directionsTip: ''
    },
    gallery: {
      images: property.images || [],
      video: property.videos?.[0] || undefined
    },
    additionalInfo: {
      description: property.description || '',
      previousOccupancy: '',
      paintingRequired: 'no',
      cleaningRequired: 'no'
    },
    scheduleInfo: {
      availability: 'everyday',
      paintingService: 'decline',
      cleaningService: 'decline',
      startTime: '9:00 AM',
      endTime: '6:00 PM',
      availableAllDay: true
    }
  };

  return { ownerInfo, propertyInfo };
};
