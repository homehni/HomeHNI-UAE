import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center',
      title: 'Home Painting',
      badge: 'FLAT 25% OFF',
      badgeColor: 'bg-amber-400',
      onClick: () => navigate('/painting-cleaning')
    },
    {
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=center',
      title: 'Home Cleaning',
      badge: 'STARTS @ ₹399',
      badgeColor: 'bg-amber-400',
      onClick: () => navigate('/painting-cleaning')
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      title: 'Packers & Movers',
      onClick: () => navigate('/packers-movers')
    },
    {
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center',
      title: 'Rental Agreement',
      onClick: () => navigate('/rental-agreement')
    },
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center',
      title: 'Rent Payment',
      onClick: () => navigate('/rent-receipts')
    },
    {
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center',
      title: 'Plumbing & Carpentry',
      onClick: () => navigate('/handover-services')
    }
  ];


  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Home Services</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={service.onClick}
              className="relative group cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                {/* Service Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {service.badge && (
                    <div className={`absolute top-4 left-4 ${service.badgeColor} text-gray-800 px-3 py-1 rounded-full text-sm font-bold shadow-md`}>
                      {service.badge}
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Service Title */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 text-center">
                    {service.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServices;