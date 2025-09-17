import React from 'react';
import { useNavigate } from 'react-router-dom';

interface RelatedPropertiesCardProps {
  property: {
    locality: string;
    city: string;
    bhk_type?: string;
    property_type: string;
    listing_type: string;
  };
}

export const RelatedPropertiesCard: React.FC<RelatedPropertiesCardProps> = ({ property }) => {
  const navigate = useNavigate();

  const handleTagClick = (searchParams: Record<string, string>) => {
    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`/search?${queryString}`);
  };

  // Generate city-specific localities
  const getCityLocalities = (city: string) => {
    const cityLocalitiesMap: { [key: string]: string[] } = {
      'Bengaluru': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Marathahalli', 'HSR Layout', 'BTM Layout', 'Jayanagar', 'Banashankari', 'Hebbal'],
      'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Marathahalli', 'HSR Layout', 'BTM Layout', 'Jayanagar', 'Banashankari', 'Hebbal'],
      'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'Madhapur', 'Gachibowli', 'Kondapur', 'Kukatpally', 'HITEC City', 'Miyapur', 'Manikonda', 'Tellapur'],
      'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Goregaon', 'Malad', 'Borivali', 'Thane', 'Navi Mumbai', 'Worli', 'Lower Parel'],
      'Delhi': ['Dwarka', 'Rohini', 'Pitampura', 'Janakpuri', 'Laxmi Nagar', 'Karol Bagh', 'Connaught Place', 'Vasant Kunj', 'Saket', 'Greater Kailash'],
      'Pune': ['Koregaon Park', 'Hinjewadi', 'Wakad', 'Baner', 'Aundh', 'Kothrud', 'Hadapsar', 'Magarpatta', 'Viman Nagar', 'Pimpri'],
      'Chennai': ['T Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'Porur', 'Tambaram', 'Chrompet', 'Guduvanchery', 'Pallikaranai']
    };
    
    return cityLocalitiesMap[city] || cityLocalitiesMap['Bengaluru']; // Default to Bengaluru if city not found
  };

  const nearbyLocalities = getCityLocalities(property.city)
    .filter(loc => loc !== property.locality)
    .slice(0, 8);

  // Generate different BHK options for same locality
  const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio'];
  const peopleAlsoSearched = bhkOptions
    .filter(bhk => bhk !== property.bhk_type)
    .slice(0, 6);

  // Generate top localities for same city
  const topLocalities = getCityLocalities(property.city).slice(0, 8);

  // Generate property type variations
  const propertyTypes = ['Apartment', 'Villa', 'Independent House', 'Builder Floor'];
  const relatedTypes = propertyTypes
    .filter(type => type.toLowerCase() !== property.property_type?.toLowerCase())
    .slice(0, 4);

  const TagButton: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className="inline-block px-3 py-2 text-sm bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer border border-border hover:border-border/80"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Related Properties</h2>
      </div>
      
      <div className="p-5 space-y-6">
        {/* Nearby Localities */}
        <div>
          <h3 className="text-base font-medium text-foreground mb-3">Nearby Localities</h3>
          <div className="flex flex-wrap gap-2">
            {nearbyLocalities.map((locality) => (
              <TagButton
                key={locality}
                onClick={() => handleTagClick({
                  bhk_type: property.bhk_type || '',
                  property_type: property.property_type,
                  listing_type: property.listing_type,
                  location: `${locality}, ${property.city}`
                })}
              >
                {property.bhk_type} for {property.listing_type} in {locality}
              </TagButton>
            ))}
          </div>
        </div>

        {/* People Also Searched For */}
        <div>
          <h3 className="text-base font-medium text-foreground mb-3">People Also Searched For</h3>
          <div className="flex flex-wrap gap-2">
            {peopleAlsoSearched.map((bhk) => (
              <TagButton
                key={bhk}
                onClick={() => handleTagClick({
                  bhk_type: bhk,
                  property_type: property.property_type,
                  listing_type: property.listing_type,
                  location: `${property.locality}, ${property.city}`
                })}
              >
                {bhk} for {property.listing_type} in {property.locality}
              </TagButton>
            ))}
            <TagButton
              onClick={() => handleTagClick({
                bhk_type: property.bhk_type || '',
                property_type: property.property_type,
                listing_type: property.listing_type,
                location: property.city,
                furnished: 'Fully Furnished'
              })}
            >
              Fully Furnished {property.bhk_type} in {property.locality}
            </TagButton>
          </div>
        </div>

        {/* Top Localities */}
        <div>
          <h3 className="text-base font-medium text-foreground mb-3">Top Localities</h3>
          <div className="flex flex-wrap gap-2">
            {topLocalities.map((locality) => (
              <TagButton
                key={locality}
                onClick={() => handleTagClick({
                  bhk_type: property.bhk_type || '',
                  property_type: property.property_type,
                  listing_type: property.listing_type,
                  location: `${locality}, ${property.city}`
                })}
              >
                {property.bhk_type} for {property.listing_type} in {locality}
              </TagButton>
            ))}
          </div>
        </div>

        {/* Property Types */}
        <div>
          <h3 className="text-base font-medium text-foreground mb-3">Other Property Types</h3>
          <div className="flex flex-wrap gap-2">
            {relatedTypes.map((type) => (
              <TagButton
                key={type}
                onClick={() => handleTagClick({
                  bhk_type: property.bhk_type || '',
                  property_type: type,
                  listing_type: property.listing_type,
                  location: `${property.locality}, ${property.city}`
                })}
              >
                {property.bhk_type} {type} for {property.listing_type} in {property.locality}
              </TagButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};