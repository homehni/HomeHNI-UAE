// Types specifically for land/plot properties

import { OwnerInfo, PropertyGallery, AdditionalInfo, ScheduleInfo } from '@/types/property';

export interface LandPlotDetails {
  title: string;
  propertyType: 'Land/Plot';
  plotArea: number;
  plotAreaUnit: 'sq-ft' | 'sq-yard' | 'acre' | 'hectare' | 'bigha' | 'biswa';
  plotLength?: number;
  plotWidth?: number;
  boundaryWall: 'yes' | 'no' | 'partial';
  cornerPlot: boolean;
  roadFacing: 'east' | 'west' | 'north' | 'south' | 'north-east' | 'north-west' | 'south-east' | 'south-west';
  roadWidth: number;
  landType: 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'institutional';
  plotShape: 'regular' | 'irregular';
  gatedCommunity: boolean;
  gatedProject?: 'yes' | 'no';
  floorsAllowed?: number;
  surveyNumber?: string;
  subDivision?: string;
  villageName?: string;
}

export interface LandPlotLocationDetails {
  state: string;
  city: string;
  locality: string;
  societyName?: string;
  pincode: string;
  landmark?: string;
  address: string;
  nearbyPlaces?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface LandPlotSaleDetails {
  listingType: 'Sale';
  expectedPrice: number;
  pricePerUnit: number; // per sq ft/yard/acre
  priceNegotiable: boolean;
  possessionDate?: string;
  ownershipType: 'freehold' | 'leasehold' | 'cooperative_society' | 'power_of_attorney';
  approvedBy?: string[];
  clearTitles: boolean;
  registrationCharges?: number;
  stampDutyCharges?: number;
  otherCharges?: number;
  bookingAmount?: number;
  tokenAmount?: number;
}

export interface LandPlotAmenities {
  waterConnection: 'yes' | 'no' | 'borewell' | 'municipal';
  electricityConnection: 'yes' | 'no' | 'nearby';
  sewerageConnection: 'yes' | 'no' | 'septic_tank';
  gasConnection: 'yes' | 'no' | 'pipeline';
  internetConnectivity: 'yes' | 'no' | 'fiber' | 'broadband';
  roadConnectivity: 'excellent' | 'good' | 'average' | 'poor';
  publicTransport: 'yes' | 'no' | 'nearby';
  streetLights: boolean;
  drainage: 'good' | 'average' | 'poor' | 'none';
  soilType?: 'black_cotton' | 'red' | 'alluvial' | 'sandy' | 'clay' | 'loam';
  waterLevel?: 'high' | 'medium' | 'low';
  floodProne: boolean;
}

export interface LandPlotInfo {
  plotDetails: LandPlotDetails;
  locationDetails: LandPlotLocationDetails;
  saleDetails: LandPlotSaleDetails;
  amenities: LandPlotAmenities;
  gallery: PropertyGallery;
  additionalInfo: AdditionalInfo;
  scheduleInfo: ScheduleInfo;
}

export interface LandPlotFormData {
  ownerInfo: OwnerInfo;
  propertyInfo: LandPlotInfo;
}
