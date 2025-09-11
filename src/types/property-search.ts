// Extended property interface for search results
export interface PropertyWithFilters extends Property {
  furnished?: string;
  availability?: string;
  ageOfProperty?: string;
  property_type?: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  priceNumber: number;
  area: string;
  areaNumber: number;
  bedrooms: number;
  bathrooms: number;
  image: string | string[];
  propertyType: string;
  locality: string;
  city: string;
  bhkType: string;
  isNew?: boolean;
}