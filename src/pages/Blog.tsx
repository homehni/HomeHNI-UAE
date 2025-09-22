import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import BlogSection from '@/components/blog/BlogSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { featuredArticles, categoryTiles, blogSections } from '@/data/blogData';

const Blog = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    'Real Estate', 'Home Services', 'Finance', 'Interiors', 'Legal',
    'Packers & Movers', 'NRI', 'Payments', 'News'
  ];

  // Auto-scroll functionality for hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalEmail(email);
    setShowSubscriptionModal(true);
    setEmail('');
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length < 3) {
      alert('Please select at least 3 categories');
      return;
    }
    console.log('Modal subscription:', { email: modalEmail, categories: selectedCategories });
    setModalEmail('');
    setSelectedCategories([]);
    setShowSubscriptionModal(false);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
                The Home HNI Times
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Real Estate, Services & Inspiration Unbounded
              </p>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg"
                onClick={() => setShowSubscriptionModal(true)}
              >
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
                            <div className="mb-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm inline-block">
                              {article.category}
                            </div>
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
          <div className="relative">
            {/* Left Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('category-scroll');
                if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Right Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('category-scroll');
                if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>

            <div 
              id="category-scroll"
              className="overflow-x-auto scrollbar-hide mx-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex space-x-3 pb-4" style={{ minWidth: 'max-content' }}>
                {categoryTiles.map((category, index) => (
                  <Card key={index} className="flex-shrink-0 w-44 group hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute inset-0 ${category.color} bg-opacity-70 flex flex-col justify-end p-3`}>
                        <h3 className="text-white font-bold text-xs mb-1 line-clamp-2">
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
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to our newsletter</h3>
                  <p className="text-gray-600">Get latest news delivered straight to you inbox</p>
                </div>
                <div className="md:col-span-2">
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                    <Input 
                      type="email" 
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      required
                    />
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 h-12 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Subscribe Now
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Sections */}
      {blogSections.map((section, index) => (
        <BlogSection
          key={section.title}
          title={section.title}
          data={section.data}
          tags={section.tags}
          viewMoreText={section.viewMoreText}
          backgroundColor={index % 2 === 1 ? "bg-gray-50" : "bg-white"}
        />
      ))}

      {/* Subscription Modal */}
      <Dialog open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal}>
        <DialogContent className="sm:max-w-[600px] bg-white p-0">
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg">
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            
            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                Subscribe to our newsletter
              </DialogTitle>
              <p className="text-gray-600">Get latest news delivered straight to you inbox</p>
            </DialogHeader>

            <form onSubmit={handleModalSubmit} className="space-y-6">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={modalEmail}
                onChange={(e) => setModalEmail(e.target.value)}
                className="w-full h-12 bg-white border-gray-200"
                required
              />

              <div>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Select at least 3 categories
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
                        selectedCategories.includes(category)
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold"
                >
                  Subscribe Now
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Blog;