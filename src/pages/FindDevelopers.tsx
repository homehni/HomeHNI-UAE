import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Building2, MapPin, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FindDevelopers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy developer data
  const developers = [
    {
      id: 1,
      name: 'Emaar Properties',
      location: 'Dubai, UAE',
      rating: 4.8,
      projects: 45,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
      description: 'Leading developer with iconic projects across Dubai'
    },
    {
      id: 2,
      name: 'Nakheel Developers',
      location: 'Dubai, UAE',
      rating: 4.7,
      projects: 38,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      description: 'Pioneering waterfront developments and master communities'
    },
    {
      id: 3,
      name: 'Damac Properties',
      location: 'Dubai, UAE',
      rating: 4.6,
      projects: 52,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      description: 'Luxury real estate developer with premium residential projects'
    },
    {
      id: 4,
      name: 'Sobha Realty',
      location: 'Dubai, UAE',
      rating: 4.9,
      projects: 28,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      description: 'Quality-focused developer known for craftsmanship and design'
    },
    {
      id: 5,
      name: 'Aldar Properties',
      location: 'Abu Dhabi, UAE',
      rating: 4.7,
      projects: 42,
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=300&fit=crop',
      description: 'Abu Dhabi\'s leading real estate developer'
    },
    {
      id: 6,
      name: 'MAG Properties',
      location: 'Dubai, UAE',
      rating: 4.5,
      projects: 35,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
      description: 'Innovative developer creating sustainable communities'
    }
  ];

  const filteredDevelopers = developers.filter(dev =>
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundPosition: 'center center'
          }}
        ></div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide drop-shadow-2xl mb-4">
                Find Developers
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-lg">
                Discover trusted real estate developers in UAE and explore their premium projects
              </p>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search developers by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white text-gray-900 rounded-lg border-0 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developers Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((developer) => (
            <div
              key={developer.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{developer.rating}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{developer.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {developer.location}
                    </div>
                  </div>
                  <Building2 className="h-6 w-6 text-[#800000] flex-shrink-0" />
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{developer.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{developer.projects}</span> Projects
                  </div>
                  <Button className="bg-[#800000] hover:bg-[#700000] text-white">
                    View Projects
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDevelopers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No developers found matching your search.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FindDevelopers;

