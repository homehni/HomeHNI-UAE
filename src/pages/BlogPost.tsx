import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { featuredArticles, realEstateArticles, homeServicesArticles, homeInteriorsArticles, financeArticles } from '@/data/blogData';

interface BlogArticle {
  id: number;
  title: string;
  excerpt?: string;
  date: string;
  author: string;
  image: string;
  category?: string;
  content?: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  // Combine all articles from different sections
  const allArticles = [
    ...featuredArticles,
    ...realEstateArticles.featured,
    ...homeServicesArticles.featured,
    ...homeInteriorsArticles.featured,
    ...financeArticles.featured
  ];

  useEffect(() => {
    if (slug) {
      // Find article by converting title to slug format
      const foundArticle = allArticles.find(article => 
        article.title.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-') === slug
      );
      
      if (foundArticle) {
        setArticle({
          ...foundArticle,
          content: generateArticleContent(foundArticle.title, (foundArticle as any).excerpt || '')
        });
        
        // Get related articles (same category or random)
        const related = allArticles
          .filter(a => a.id !== foundArticle.id)
          .slice(0, 3);
        setRelatedArticles(related);
      }
    }
  }, [slug]);

  const generateArticleContent = (title: string, excerpt: string) => {
    return `
      <div class="prose prose-lg max-w-none">
        <p class="lead text-gray-600 text-xl mb-8">${excerpt}</p>
        
        <h2>Introduction</h2>
        <p>Welcome to this comprehensive guide on ${title.toLowerCase()}. In today's dynamic real estate market, understanding the key aspects of property investment, home services, and market trends is crucial for making informed decisions.</p>
        
        <h2>Key Points to Consider</h2>
        <ul>
          <li>Market research and analysis</li>
          <li>Financial planning and budgeting</li>
          <li>Legal compliance and documentation</li>
          <li>Professional consultation and guidance</li>
        </ul>
        
        <h2>Expert Insights</h2>
        <p>Our team of experts has analyzed current market trends and compiled this information to help you navigate the complexities of real estate decisions. Whether you're a first-time buyer, seasoned investor, or looking for home services, this guide provides valuable insights.</p>
        
        <blockquote class="border-l-4 border-red-500 pl-4 italic text-gray-700">
          "Making informed decisions in real estate requires thorough research, professional guidance, and understanding of market dynamics."
        </blockquote>
        
        <h2>Conclusion</h2>
        <p>We hope this article has provided valuable insights into ${title.toLowerCase()}. For personalized advice and more detailed information, feel free to contact our expert team.</p>
        
        <div class="bg-red-50 p-6 rounded-lg mt-8">
          <h3 class="text-red-600 font-semibold mb-2">Need Expert Help?</h3>
          <p class="text-gray-700">Get personalized consultation from our real estate experts. Contact us today for professional guidance tailored to your needs.</p>
        </div>
      </div>
    `;
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed Successfully!",
      description: "You'll receive our latest blog updates via email.",
      style: { borderLeft: "8px solid hsl(120, 100%, 25%)" }
    });
    setEmail('');
  };

  const shareArticle = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Article link has been copied to clipboard",
        style: { borderLeft: "8px solid hsl(120, 100%, 25%)" }
      });
    }
  };

  const createSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Marquee />
        <div className="container mx-auto px-4 py-32">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Marquee />
      
      {/* Article Header */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-red-500 hover:text-red-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl mx-auto">
            {article.category && (
              <Badge className="bg-red-500 text-white mb-4">
                {article.category}
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {article.date}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {article.author}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={shareArticle}
                className="flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Stay Updated with Our Latest Articles
              </h3>
              <p className="text-gray-600 mb-6">
                Get the latest real estate insights and home service tips delivered to your inbox
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle) => (
                  <Link 
                    key={relatedArticle.id}
                    to={`/blog/${createSlug(relatedArticle.title)}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <img 
                        src={relatedArticle.image} 
                        alt={relatedArticle.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {relatedArticle.date} by {relatedArticle.author}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;
