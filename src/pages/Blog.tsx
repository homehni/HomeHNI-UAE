import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import BlogSection from '@/components/blog/BlogSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredArticles, categoryTiles, blogSections } from '@/data/blogData';

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

      <Footer />
    </div>
  );
};

export default Blog;