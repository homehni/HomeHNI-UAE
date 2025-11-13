import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Building2, MapPin, Star, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FindDevelopers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

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

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredDevelopers = developers.filter(dev =>
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        {/* Background Image with smooth transition */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundPosition: 'center center',
            transform: 'scale(1.05)'
          }}
        ></div>
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>
        
        {/* Content with fade-in animation */}
        <div className={`relative z-10 h-full flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide drop-shadow-2xl mb-3 sm:mb-4 animate-fade-in">
                Find Developers
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 drop-shadow-lg animate-fade-in-delay px-2">
                Discover trusted real estate developers in UAE and explore their premium projects
              </p>
              
              {/* Enhanced Search Bar */}
              <div className="relative animate-fade-in-delay-2 px-2">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl blur-xl"></div>
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={18} />
                  <Input
                    type="text"
                    placeholder="Search developers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 sm:pl-12 md:pl-14 pr-4 sm:pr-5 md:pr-6 py-4 sm:py-5 md:py-7 text-sm sm:text-base md:text-lg bg-white/95 backdrop-blur-sm text-gray-900 rounded-xl sm:rounded-2xl border-2 border-white/30 shadow-2xl focus:border-white/60 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developers Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Featured Developers
          </h2>
          <p className="text-gray-600 text-base sm:text-lg px-2">
            Explore our curated selection of trusted real estate developers
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredDevelopers.map((developer, index) => (
            <div
              key={developer.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 border border-gray-100"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                opacity: isLoaded ? 1 : 0
              }}
            >
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/95 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-lg z-20">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{developer.rating}</span>
                </div>
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-20">
                  <div className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-900">{developer.projects} Active Projects</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-[#800000] transition-colors duration-300 truncate">
                      {developer.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-[#800000] flex-shrink-0" />
                      <span className="truncate">{developer.location}</span>
                    </div>
                  </div>
                  <div className="ml-2 sm:ml-4 p-1.5 sm:p-2 bg-gray-50 rounded-lg group-hover:bg-[#800000]/10 transition-colors duration-300 flex-shrink-0">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#800000] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6 line-clamp-2 leading-relaxed">
                  {developer.description}
                </p>
                
                <Button 
                  className="w-full bg-[#800000] hover:bg-[#700000] text-white rounded-lg sm:rounded-xl py-3 sm:py-4 md:py-5 text-xs sm:text-sm md:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 group/btn"
                >
                  <span className="flex items-center justify-center gap-2">
                    View Projects
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredDevelopers.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-600 text-xl font-medium mb-2">No developers found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FindDevelopers;

// Add custom animations via style tag or global CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    .animate-fade-in {
      animation: fadeIn 1s ease-out forwards;
    }
    
    .animate-fade-in-delay {
      animation: fadeIn 1s ease-out 0.2s forwards;
      opacity: 0;
    }
    
    .animate-fade-in-delay-2 {
      animation: fadeIn 1s ease-out 0.4s forwards;
      opacity: 0;
    }
  `;
  if (!document.head.querySelector('style[data-find-developers]')) {
    style.setAttribute('data-find-developers', 'true');
    document.head.appendChild(style);
  }
}


