import PropertyCard from './PropertyCard';

const FeaturedProperties = () => {
  const properties = [
    {
      id: '1',
      title: 'Modern Apartment with Delhi',
      location: 'Sector 18, KK Road',
      price: '₹1.2 Cr',
      area: '1,200 sq ft',
      bedrooms: 3,
      bathrooms: 2,
      image: 'photo-1560518883-ce09059eeffa',
      propertyType: 'Apartment',
      isNew: true
    },
    {
      id: '2',
      title: 'Modern Villa with Garden',
      location: 'DLF Phase 3, Gurgaon',
      price: '₹2.5 Cr',
      area: '2,400 sq ft',
      bedrooms: 4,
      bathrooms: 3,
      image: 'photo-1613490493576-7fde63acd811',
      propertyType: 'Villa'
    },
    {
      id: '3',
      title: 'Affordable 2BHK in IT Hub',
      location: 'Electronic City, Bangalore',
      price: '₹75 L',
      area: '950 sq ft',
      bedrooms: 2,
      bathrooms: 2,
      image: 'photo-1512917774080-9991f1c4c750',
      propertyType: 'Apartment'
    },
    {
      id: '4',
      title: 'Premium Office Space',
      location: 'Cyber City, Gurgaon',
      price: '₹45 L',
      area: '800 sq ft',
      bedrooms: 0,
      bathrooms: 1,
      image: 'photo-1497366216548-37526070297c',
      propertyType: 'Commercial',
      isNew: true
    },
    {
      id: '5',
      title: 'Spacious 3BHK with Balcony',
      location: 'Whitefield, Bangalore',
      price: '₹95 L',
      area: '1,350 sq ft',
      bedrooms: 3,
      bathrooms: 2,
      image: 'photo-1522708323590-d24dbb6b0267',
      propertyType: 'Apartment'
    },
    {
      id: '6',
      title: 'Independent House with Parking',
      location: 'Sector 15, Noida',
      price: '₹1.8 Cr',
      area: '1,800 sq ft',
      bedrooms: 4,
      bathrooms: 3,
      image: 'photo-1568605114967-8130f3a36994',
      propertyType: 'House'
    },
    {
      id: '7',
      title: 'Modern 2BHK with City View',
      location: 'Bandra West, Mumbai',
      price: '₹1.5 Cr',
      area: '1,100 sq ft',
      bedrooms: 2,
      bathrooms: 2,
      image: 'photo-1512917774080-9991f1c4c750',
      propertyType: 'Apartment',
      isNew: true
    },
    {
      id: '8',
      title: 'Luxury Penthouse with Terrace',
      location: 'Koramangala, Bangalore',
      price: '₹3.2 Cr',
      area: '2,800 sq ft',
      bedrooms: 4,
      bathrooms: 4,
      image: 'photo-1613490493576-7fde63acd811',
      propertyType: 'Penthouse'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties across India's top cities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
