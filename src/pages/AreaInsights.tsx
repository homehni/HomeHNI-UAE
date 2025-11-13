import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TrendingUp, TrendingDown, MapPin, Home, DollarSign, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AreaInsights = () => {
  const [selectedArea, setSelectedArea] = useState('downtown-dubai');

  const areas = [
    {
      id: 'downtown-dubai',
      name: 'Downtown Dubai',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop',
      avgPrice: 'AED 1,200/sqft',
      priceChange: '+12%',
      priceTrend: 'up',
      rentalYield: '6.5%',
      population: '45,000',
      properties: '2,500',
      description: 'The heart of Dubai with iconic landmarks and luxury living'
    },
    {
      id: 'dubai-marina',
      name: 'Dubai Marina',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      avgPrice: 'AED 1,100/sqft',
      priceChange: '+8%',
      priceTrend: 'up',
      rentalYield: '7.2%',
      population: '120,000',
      properties: '5,200',
      description: 'Waterfront lifestyle with stunning marina views'
    },
    {
      id: 'business-bay',
      name: 'Business Bay',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
      avgPrice: 'AED 950/sqft',
      priceChange: '+15%',
      priceTrend: 'up',
      rentalYield: '6.8%',
      population: '35,000',
      properties: '1,800',
      description: 'Commercial hub with modern residential towers'
    },
    {
      id: 'palm-jumeirah',
      name: 'Palm Jumeirah',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=400&fit=crop',
      avgPrice: 'AED 2,500/sqft',
      priceChange: '+5%',
      priceTrend: 'up',
      rentalYield: '5.2%',
      population: '15,000',
      properties: '800',
      description: 'Exclusive island community with beachfront properties'
    }
  ];

  const currentArea = areas.find(area => area.id === selectedArea) || areas[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[45vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundPosition: 'center center'
          }}
        ></div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide drop-shadow-2xl mb-3 sm:mb-4">
                Area Insights
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-lg px-2">
                Comprehensive market analysis and insights for key areas in UAE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Area Selector */}
      <div className="relative z-20 -mt-8 sm:-mt-10 md:-mt-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Tabs value={selectedArea} onValueChange={setSelectedArea} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 bg-white p-1 rounded-lg shadow-md">
            {areas.map((area) => (
              <TabsTrigger
                key={area.id}
                value={area.id}
                className="data-[state=active]:bg-[#800000] data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5"
              >
                <span className="truncate">{area.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {areas.map((area) => (
            <TabsContent key={area.id} value={area.id} className="mt-4 sm:mt-6">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
                {/* Hero Image */}
                <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
                  <img
                    src={area.image}
                    alt={area.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6 text-white">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{area.name}</h2>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90">{area.description}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-[#800000]" />
                        {area.priceTrend === 'up' ? (
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Avg. Price</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">{area.avgPrice}</p>
                      <p className={`text-xs mt-1 ${area.priceTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {area.priceChange} this year
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-[#800000]" />
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Rental Yield</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">{area.rentalYield}</p>
                      <p className="text-xs mt-1 text-gray-500">Annual return</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#800000]" />
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Population</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">{area.population}</p>
                      <p className="text-xs mt-1 text-gray-500">Residents</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <Home className="h-4 w-4 sm:h-5 sm:w-5 text-[#800000]" />
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Properties</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">{area.properties}</p>
                      <p className="text-xs mt-1 text-gray-500">Listings</p>
                    </div>
                  </div>

                  {/* Market Analysis */}
                  <div className="border-t border-gray-200 pt-4 sm:pt-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Market Analysis</h3>
                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700">
                      <p>
                        {area.name} continues to be one of the most sought-after locations in Dubai, 
                        with strong demand from both local and international investors. The area offers 
                        excellent connectivity, world-class amenities, and promising capital appreciation potential.
                      </p>
                      <p>
                        Recent developments and infrastructure improvements have further enhanced the 
                        appeal of this location, making it an attractive option for both end-users and 
                        investors looking for long-term value.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AreaInsights;

