import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, Mail, ArrowRight, TrendingUp, Home, Wrench, PaintBucket, DollarSign, Star } from 'lucide-react';

// Enhanced blog data organized by categories
const featuredPosts = [
  {
    id: 1,
    title: "Zero Brokerage Revolution: How We're Changing Real Estate",
    excerpt: "Discover how our platform is eliminating brokerage fees and making property transactions more transparent and affordable for everyone.",
    category: "Featured",
    author: "Team Home HNI",
    date: "2024-01-20",
    readTime: "5 min read",
    image: "/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png",
    featured: true
  },
  {
    id: 2,
    title: "Complete Guide to Property Investment in 2024",
    excerpt: "Expert insights on the best areas to invest, market trends, and how to maximize your returns in today's real estate market.",
    category: "Featured", 
    author: "Investment Team",
    date: "2024-01-18",
    readTime: "8 min read",
    image: "/lovable-uploads/68165188-72aa-4757-a0fa-fc2b785a86ca.png",
    featured: true
  }
];

const realEstateNews = [
  {
    id: 3,
    title: "Top 10 Tips for First-Time Home Buyers",
    excerpt: "Essential advice for navigating your first property purchase successfully.",
    category: "Real Estate",
    author: "Priya Sharma",
    date: "2024-01-15",
    readTime: "5 min read",
    image: "/lovable-uploads/76edf36e-5a4c-4707-b169-fb70fe75880c.png"
  },
  {
    id: 4,
    title: "Understanding Rental Agreements in India",
    excerpt: "A comprehensive guide to rental agreements and tenant rights.",
    category: "Real Estate",
    author: "Rajesh Kumar", 
    date: "2024-01-12",
    readTime: "7 min read",
    image: "/lovable-uploads/94c2146b-79a1-4541-a959-f1f0c70611e0.png"
  },
  {
    id: 5,
    title: "Best Areas to Invest in Real Estate in 2024",
    excerpt: "Market analysis of the most promising investment locations.",
    category: "Real Estate",
    author: "Anjali Mehta",
    date: "2024-01-10", 
    readTime: "8 min read",
    image: "/lovable-uploads/831fcaf0-10e4-4ba4-b3da-c403bbe972bc.png"
  }
];

const homeServices = [
  {
    id: 6,
    title: "Complete Home Maintenance Checklist", 
    excerpt: "Keep your property in perfect condition with our comprehensive maintenance guide.",
    category: "Home Services",
    author: "Maintenance Team",
    date: "2024-01-14",
    readTime: "6 min read",
    image: "/lovable-uploads/beee2872-8a8a-4331-9d4f-3d88ac1c9948.png"
  },
  {
    id: 7,
    title: "Smart Security Solutions for Modern Homes",
    excerpt: "Latest technology trends in home security and automation.",
    category: "Home Services", 
    author: "Tech Team",
    date: "2024-01-11",
    readTime: "5 min read",
    image: "/lovable-uploads/7f59114d-cafc-4e27-8180-d70d5cba530f.png"
  }
];

const homeInteriors = [
  {
    id: 8,
    title: "Interior Design Trends That Add Value",
    excerpt: "Design choices that not only look great but increase your property value.",
    category: "Home Interiors",
    author: "Design Team",
    date: "2024-01-13",
    readTime: "6 min read", 
    image: "/lovable-uploads/8b28a8cb-02f0-4e86-9ba6-1845c4372e1a.png"
  },
  {
    id: 9,
    title: "Vastu Tips for Positive Energy",
    excerpt: "Traditional principles for creating harmony in your living space.",
    category: "Home Interiors",
    author: "Dr. Ramesh Joshi",
    date: "2024-01-09",
    readTime: "5 min read",
    image: "/lovable-uploads/ddda335f-1bbc-402a-befb-f6d3f4d631e6.png"
  }
];

const financeNews = [
  {
    id: 10,
    title: "Home Loan Interest Rates: Complete Guide",
    excerpt: "Everything about getting the best home loan deals in 2024.",
    category: "Finance",
    author: "Finance Team",
    date: "2024-01-16",
    readTime: "7 min read",
    image: "/lovable-uploads/e491693e-a750-42b7-bdf6-cdff47be335b.png"
  },
  {
    id: 11,
    title: "Tax Benefits on Home Loans You Should Know",
    excerpt: "Maximize your savings with these essential tax deductions.",
    category: "Finance",
    author: "Tax Advisor",
    date: "2024-01-08",
    readTime: "6 min read",
    image: "/lovable-uploads/f5f1d518-d734-4fa1-abd3-f45e772294cd.png"
  }
];

const trendingNews = [
  {
    id: 12,
    title: "PropTech Revolution: Future of Real Estate",
    excerpt: "How technology is transforming property buying and selling.",
    category: "Trending",
    author: "Tech Analyst",
    date: "2024-01-17",
    readTime: "8 min read",
    image: "/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png"
  },
  {
    id: 13,
    title: "Sustainable Living: Green Homes Are the Future", 
    excerpt: "Eco-friendly features that buyers are looking for in 2024.",
    category: "Trending",
    author: "Sustainability Expert",
    date: "2024-01-19",
    readTime: "6 min read",
    image: "/lovable-uploads/68165188-72aa-4757-a0fa-fc2b785a86ca.png"
  },
  {
    id: 14,
    title: "Co-working Spaces Driving Commercial Real Estate",
    excerpt: "The impact of flexible workspace trends on commercial property.",
    category: "Trending", 
    author: "Commercial Expert",
    date: "2024-01-21",
    readTime: "7 min read",
    image: "/lovable-uploads/76edf36e-5a4c-4707-b169-fb70fe75880c.png"
  }
];

const Blog = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const BlogCard = ({ post, variant = 'default' }: { post: any, variant?: 'default' | 'featured' | 'large' }) => {
    if (variant === 'featured') {
      return (
        <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="relative">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Badge className="absolute top-4 left-4 bg-brand-red text-white">
              {post.category}
            </Badge>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (variant === 'large') {
      return (
        <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <Badge className="mb-3 bg-brand-red/10 text-brand-red">
                {post.category}
              </Badge>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-red transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{post.author}</span>
                <span>{new Date(post.date).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
        <div className="relative">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 left-3 text-xs bg-brand-red text-white">
            {post.category}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 group-hover:text-brand-red transition-colors line-clamp-2 text-sm">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{post.author}</span>
            <span>{post.readTime}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-brand-red rounded-lg text-white">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Marquee />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-red to-brand-maroon-dark text-white py-16 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              The Property Times
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Real Estate, Services & Inspiration Unbounded
            </p>
            <p className="text-lg opacity-80 mb-8">
              Stay updated with the latest trends, expert insights, and valuable tips in the world of real estate
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="lg" className="bg-white text-brand-red hover:bg-gray-100">
                Browse Articles
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-red">
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Stories</h2>
            <p className="text-muted-foreground">Our most popular and impactful articles</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-12 bg-brand-red text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="mb-6 opacity-90">Get the latest real estate insights delivered to your inbox</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-black"
                required
              />
              <Button type="submit" variant="secondary" className="bg-white text-brand-red hover:bg-gray-100">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Real Estate Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title="Real Estate" icon={<Home className="h-6 w-6" />} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realEstateNews.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Home Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader title="Home Services" icon={<Wrench className="h-6 w-6" />} />
          <div className="grid md:grid-cols-2 gap-6">
            {homeServices.map((post, index) => (
              <BlogCard key={post.id} post={post} variant={index === 0 ? "large" : "default"} />
            ))}
          </div>
        </div>
      </section>

      {/* Home Interiors Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title="Home Interiors" icon={<PaintBucket className="h-6 w-6" />} />
          <div className="grid md:grid-cols-2 gap-6">
            {homeInteriors.map((post) => (
              <BlogCard key={post.id} post={post} variant="large" />
            ))}
          </div>
        </div>
      </section>

      {/* Finance Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader title="Finance" icon={<DollarSign className="h-6 w-6" />} />
          <div className="grid md:grid-cols-2 gap-6">
            {financeNews.map((post) => (
              <BlogCard key={post.id} post={post} variant="large" />
            ))}
          </div>
        </div>
      </section>

      {/* Trending News Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title="Trending News in Real Estate" icon={<TrendingUp className="h-6 w-6" />} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingNews.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse All Articles CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-red to-brand-maroon-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Explore More Articles</h3>
          <p className="text-xl mb-8 opacity-90">Discover hundreds of expert insights and guides</p>
          <Button variant="secondary" size="lg" className="bg-white text-brand-red hover:bg-gray-100">
            Browse All Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;