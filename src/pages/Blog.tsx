import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';

// Featured articles for carousel
const featuredArticles = [
  {
    id: 1,
    title: "What is an Affiant? Definition, Duties, Responsibilities and Legal Importance in 2025",
    date: "September 22, 2025",
    author: "Anda Warner",
    image: "/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png",
    category: "Legal Guide & Formats"
  },
  {
    id: 2,
    title: "House Number 1 Numerology: Meaning, Benefits, Energy and Calculation 2025",
    date: "September 21, 2025", 
    author: "Vivek Mishra",
    image: "/lovable-uploads/68165188-72aa-4757-a0fa-fc2b785a86ca.png",
    category: "Vastu Tips & Guides"
  },
  {
    id: 3,
    title: "Top Investment Areas in Mumbai for Real Estate in 2025",
    date: "September 20, 2025",
    author: "Investment Team",
    image: "/lovable-uploads/76edf36e-5a4c-4707-b169-fb70fe75880c.png",
    category: "Real Estate Investment"
  }
];

// Category tiles data
const categoryTiles = [
  {
    title: "Interior Design Tips & Ideas",
    count: "651+ Articles",
    image: "/lovable-uploads/94c2146b-79a1-4541-a959-f1f0c70611e0.png",
    color: "bg-blue-900"
  },
  {
    title: "Real Estate Legal Guide & Laws", 
    count: "366+ Articles",
    image: "/lovable-uploads/831fcaf0-10e4-4ba4-b3da-c403bbe972bc.png",
    color: "bg-gray-900"
  },
  {
    title: "Home Buying Tips & Guide",
    count: "255+ Articles", 
    image: "/lovable-uploads/beee2872-8a8a-4331-9d4f-3d88ac1c9948.png",
    color: "bg-orange-900"
  },
  {
    title: "Home Loan Tips",
    count: "229+ Articles",
    image: "/lovable-uploads/7f59114d-cafc-4e27-8180-d70d5cba530f.png",
    color: "bg-yellow-800"
  },
  {
    title: "Vastu Tips & Guides",
    count: "189+ Articles",
    image: "/lovable-uploads/8b28a8cb-02f0-4e86-9ba6-1845c4372e1a.png",
    color: "bg-gray-700"
  },
  {
    title: "Real Estate News & Updates",
    count: "147+ Articles",
    image: "/lovable-uploads/ddda335f-1bbc-402a-befb-f6d3f4d631e6.png",
    color: "bg-gray-800"
  },
  {
    title: "NoBroker Hindi Blogs",
    count: "136+ Articles",
    image: "/lovable-uploads/e491693e-a750-42b7-bdf6-cdff47be335b.png",
    color: "bg-gray-600"
  },
  {
    title: "NoBroker Bengali Blogs",
    count: "98+ Articles",
    image: "/lovable-uploads/f5f1d518-d734-4fa1-abd3-f45e772294cd.png",
    color: "bg-teal-700"
  }
];

// Real Estate articles
const realEstateArticles = {
  featured: [
    {
      id: 1,
      title: "Top 8 Smart Cities In Maharashtra for Connectivity and Real Estate Trends in 2025",
      excerpt: "The Smart Cities Mission in Maharashtra is transforming major cities into sustainable, efficient, and livable urban hubs. By leveraging technology and...",
      date: "September 8, 2025",
      author: "Vivek Mishra",
      image: "/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png"
    },
    {
      id: 2,
      title: "Top 11 Smart Cities in Tamil Nadu: Connectivity, Growth Opportunities and Property Trends in 2025",
      date: "September 7, 2025",
      author: "Tamil Nadu Team",
      image: "/lovable-uploads/68165188-72aa-4757-a0fa-fc2b785a86ca.png"
    },
    {
      id: 3,
      title: "Best 7 Smart Cities in Karnataka: Connectivity, Growth, and Real Estate Trends in 2025",
      date: "September 6, 2025",
      author: "Karnataka Team", 
      image: "/lovable-uploads/76edf36e-5a4c-4707-b169-fb70fe75880c.png"
    }
  ],
  sideArticles: [
    {
      title: "Top 6 Richest Cities of Karnataka: Connectivity, Rental Yield and Growth in 2025",
      date: "September 5, 2025",
      author: "Kruthi"
    },
    {
      title: "Top 10 Real Estate Websites in Chennai for Hassle-Free Property Buying and Renting in 2025",
      date: "September 5, 2025", 
      author: "Krishnanunni H M"
    },
    {
      title: "Top 10 Real Estate Websites in Mumbai for Renting and Buying Property in 2025",
      date: "September 5, 2025",
      author: "Krishnanunni H M"
    },
    {
      title: "Top 10 Real Estate Websites in Bangalore for Buying, Selling, and Renting Homes in 2025",
      date: "September 4, 2025",
      author: "Krishnanunni H M"
    }
  ]
};

// Home Services articles
const homeServicesArticles = {
  featured: [
    {
      id: 1,
      title: "Birla Opus vs Asian Paints: Comparison, Prices Coverage, Durability & Shades in 2025",
      excerpt: "Birla Opus vs Asian Paints is a common comparison for homeowners looking for the best wall finish. Birla Opus is known for its premium wall putty, smooth...",
      date: "September 15, 2025",
      author: "Krishnanunni H M",
      image: "/lovable-uploads/94c2146b-79a1-4541-a959-f1f0c70611e0.png"
    },
    {
      id: 2,
      title: "Royale Luxury Emulsion 20 Litre Price in India: Benefits Coverage and Durability in 2025",
      date: "September 12, 2025",
      author: "Paint Expert",
      image: "/lovable-uploads/831fcaf0-10e4-4ba4-b3da-c403bbe972bc.png"
    },
    {
      id: 3,
      title: "Best Budget-Friendly Wallpaper Prices: Cost per Square Foot in India 2025",
      date: "September 10, 2025",
      author: "Interior Team",
      image: "/lovable-uploads/beee2872-8a8a-4331-9d4f-3d88ac1c9948.png"
    }
  ],
  sideArticles: [
    {
      title: "Asian Paints Ultima 20 Litre Price: Variants, Finish and Coverage Per Sq Ft in 2025",
      date: "September 5, 2025",
      author: "NoBroker.com"
    },
    {
      title: "Ace Paint Price Per Litre 2025",
      date: "September 5, 2025",
      author: "NoBroker.com"
    },
    {
      title: "Nerolac Primer 20 Litre Price 2025", 
      date: "September 5, 2025",
      author: "NoBroker.com"
    },
    {
      title: "Dulux Exterior Paint Colour",
      date: "September 5, 2025",
      author: "NoBroker.com"
    },
    {
      title: "Birla Opus Oil Paint Price List in India: Variants, Finishes and Coverage Per Sq/Ft",
      date: "September 4, 2025", 
      author: "Krishnanunni H M"
    }
  ]
};

const Blog = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Marquee />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-100 to-blue-50 py-16 pt-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                The NoBroker Times
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Real Estate, Services & Inspiration Unbounded
              </p>
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg">
                Subscribe to our blogs
              </Button>
            </div>

            {/* Right Content - Featured Articles Carousel */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="relative overflow-hidden rounded-lg">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {featuredArticles.map((article, index) => (
                      <div key={article.id} className="w-full flex-shrink-0">
                        <div className="relative">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
                            <Badge className="mb-2 bg-red-500 text-white">
                              {article.category}
                            </Badge>
                            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {article.date} by <span className="text-red-300">{article.author}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Carousel Navigation */}
                <div className="flex justify-between items-center mt-4">
                  <button 
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex space-x-2">
                    {featuredArticles.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentSlide === index ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
              {categoryTiles.map((category, index) => (
                <Card key={index} className="flex-shrink-0 w-64 group hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 ${category.color} bg-opacity-70 flex flex-col justify-end p-4`}>
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                        {category.title}
                      </h3>
                      <p className="text-white/90 text-xs">
                        {category.count}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to our newsletter</h3>
            <p className="text-gray-600 mb-6">Get latest news delivered straight to you inbox</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-2xl">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12"
                required
              />
              <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-8 h-12">
                Subscribe Now
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Real Estate Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Real Estate</h2>
          
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge className="bg-green-500 text-white px-4 py-2">Home Buying Tips & Guide</Badge>
            <Badge variant="outline" className="px-4 py-2">Property Selling Tips & Guides</Badge>
            <Badge variant="outline" className="px-4 py-2">Rental Guide for Renters, Tenant & Landlord</Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Featured Articles */}
            <div className="lg:col-span-2 space-y-6">
              {realEstateArticles.featured.map((article, index) => (
                <Card key={article.id} className="group hover:shadow-lg transition-shadow">
                  {index === 0 ? (
                    <div className="p-6">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-64 object-cover rounded-lg mb-4 group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      <p className="text-sm text-gray-500">
                        {article.date} by <span className="text-red-500">{article.author}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {article.date} by <span className="text-red-500">{article.author}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Right - Article List */}
            <div className="space-y-4">
              {realEstateArticles.sideArticles.map((article, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {article.date} by <span className="text-red-500">{article.author}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* View More Button */}
          <div className="text-center mt-8">
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 px-8 py-3">
              View More in Home Buying Tips & Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Home Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Home Services</h2>
          
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge className="bg-green-500 text-white px-4 py-2">Painting Tips & Color Ideas</Badge>
            <Badge variant="outline" className="px-4 py-2">Easy Cleaning Tips</Badge>
            <Badge variant="outline" className="px-4 py-2">Electrician Tips & Guides</Badge>
            <Badge variant="outline" className="px-4 py-2">Home Garden Ideas & Tips</Badge>
            <Badge variant="outline" className="px-4 py-2">Pest Control Tips & Guides for a Pest-Free Home</Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Featured Articles */}
            <div className="lg:col-span-2 space-y-6">
              {homeServicesArticles.featured.map((article, index) => (
                <Card key={article.id} className="group hover:shadow-lg transition-shadow">
                  {index === 0 ? (
                    <div className="p-6">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-64 object-cover rounded-lg mb-4 group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      <p className="text-sm text-gray-500">
                        {article.date} by <span className="text-red-500">{article.author}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {article.date} by <span className="text-red-500">{article.author}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Right - Article List */}
            <div className="space-y-4">
              {homeServicesArticles.sideArticles.map((article, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {article.date} by <span className="text-red-500">{article.author}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* View More Button */}
          <div className="text-center mt-8">
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 px-8 py-3">
              View More in Painting Tips & Color Ideas
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;