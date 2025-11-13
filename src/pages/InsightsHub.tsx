import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TrendingUp, BarChart3, PieChart, FileText, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InsightsHub = () => {
  const insights = [
    {
      id: 1,
      title: 'Q4 2024 Market Report',
      category: 'Market Analysis',
      date: 'December 2024',
      description: 'Comprehensive analysis of UAE real estate market trends, price movements, and investment opportunities.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop',
      icon: BarChart3
    },
    {
      id: 2,
      title: 'Dubai Property Price Index',
      category: 'Price Trends',
      date: 'November 2024',
      description: 'Detailed breakdown of property prices across different areas in Dubai with year-over-year comparisons.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=300&fit=crop',
      icon: TrendingUp
    },
    {
      id: 3,
      title: 'Rental Market Insights',
      category: 'Rental Analysis',
      date: 'November 2024',
      description: 'Analysis of rental yields, occupancy rates, and rental trends across key residential areas.',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=300&fit=crop',
      icon: PieChart
    },
    {
      id: 4,
      title: 'Investment Hotspots 2025',
      category: 'Investment Guide',
      date: 'December 2024',
      description: 'Identify the most promising investment locations for 2025 with projected ROI and growth potential.',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=300&fit=crop',
      icon: FileText
    },
    {
      id: 5,
      title: 'Commercial Real Estate Outlook',
      category: 'Commercial',
      date: 'October 2024',
      description: 'Market insights for commercial properties including offices, retail spaces, and warehouses.',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=300&fit=crop',
      icon: BarChart3
    },
    {
      id: 6,
      title: 'Luxury Property Market Trends',
      category: 'Luxury Market',
      date: 'December 2024',
      description: 'Exclusive insights into the luxury property segment with focus on high-end developments.',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=300&fit=crop',
      icon: TrendingUp
    }
  ];

  const categories = ['All', 'Market Analysis', 'Price Trends', 'Rental Analysis', 'Investment Guide', 'Commercial', 'Luxury Market'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredInsights = selectedCategory === 'All' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[45vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
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
                Insights Hub
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-lg px-2">
                Data-driven insights, market reports, and expert analysis for informed real estate decisions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs sm:text-sm ${selectedCategory === category ? 'bg-[#800000] hover:bg-[#700000]' : ''}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card key={insight.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                  <img
                    src={insight.image}
                    alt={insight.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <div className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5 sm:gap-2">
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-[#800000]" />
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-900">{insight.category}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Calendar className="h-3 w-3" />
                    {insight.date}
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{insight.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm sm:text-base">
                    {insight.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 pt-0">
                  <Button variant="ghost" className="w-full group-hover:text-[#800000] text-sm sm:text-base">
                    Read More
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredInsights.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No insights found in this category.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default InsightsHub;

