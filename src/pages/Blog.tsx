import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Calendar, Clock, User } from 'lucide-react';

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Tips for First-Time Home Buyers",
    excerpt: "Buying your first home can be overwhelming. Here are essential tips to make the process smoother and help you find your dream home.",
    category: "Home Buying",
    author: "Priya Sharma",
    date: "2024-01-15",
    readTime: "5 min read",
    image: "/public/lovable-uploads/68165188-72aa-4757-a0fa-fc2b785a86ca.png"
  },
  {
    id: 2,
    title: "Understanding Rental Agreements in India",
    excerpt: "A comprehensive guide to rental agreements, key clauses to look for, and how to protect your interests as a tenant or landlord.",
    category: "Legal",
    author: "Rajesh Kumar",
    date: "2024-01-12",
    readTime: "7 min read",
    image: "/public/lovable-uploads/76edf36e-5a4c-4707-b169-fb70fe75880c.png"
  },
  {
    id: 3,
    title: "Best Areas to Invest in Real Estate in 2024",
    excerpt: "Discover the most promising real estate investment opportunities across major Indian cities with detailed market analysis.",
    category: "Investment",
    author: "Anjali Mehta",
    date: "2024-01-10",
    readTime: "8 min read",
    image: "/public/lovable-uploads/94c2146b-79a1-4541-a959-f1f0c70611e0.png"
  },
  {
    id: 4,
    title: "Home Loan Interest Rates: Complete Guide",
    excerpt: "Everything you need to know about home loan interest rates, how to get the best deals, and factors that affect your loan approval.",
    category: "Finance",
    author: "Vikram Singh",
    date: "2024-01-08",
    readTime: "6 min read",
    image: "/public/lovable-uploads/831fcaf0-10e4-4ba4-b3da-c403bbe972bc.png"
  },
  {
    id: 5,
    title: "Property Documentation: A Complete Checklist",
    excerpt: "Essential documents you need when buying or selling property. Don't miss any important paperwork with this comprehensive checklist.",
    category: "Legal",
    author: "Sneha Patel",
    date: "2024-01-05",
    readTime: "4 min read",
    image: "/public/lovable-uploads/beee2872-8a8a-4331-9d4f-3d88ac1c9948.png"
  },
  {
    id: 6,
    title: "Vastu Tips for Your New Home",
    excerpt: "Traditional Vastu Shastra principles to bring positive energy and prosperity to your new home. Simple tips for better living.",
    category: "Lifestyle",
    author: "Dr. Ramesh Joshi",
    date: "2024-01-03",
    readTime: "5 min read",
    image: "/public/lovable-uploads/7f59114d-cafc-4e27-8180-d70d5cba530f.png"
  },
  {
    id: 7,
    title: "Smart Home Technology Trends",
    excerpt: "Explore the latest smart home technologies that are transforming modern living. From security to energy efficiency.",
    category: "Technology",
    author: "Amit Verma",
    date: "2024-01-01",
    readTime: "6 min read",
    image: "/public/lovable-uploads/8b28a8cb-02f0-4e86-9ba6-1845c4372e1a.png"
  },
  {
    id: 8,
    title: "Maintenance Tips for Your Property",
    excerpt: "Keep your property in top condition with these essential maintenance tips. Prevent costly repairs with regular upkeep.",
    category: "Maintenance",
    author: "Pooja Gupta",
    date: "2023-12-28",
    readTime: "7 min read",
    image: "/public/lovable-uploads/ddda335f-1bbc-402a-befb-f6d3f4d631e6.png"
  },
  {
    id: 9,
    title: "Commercial Real Estate Investment Guide",
    excerpt: "A beginner's guide to commercial real estate investment. Learn about different types and potential returns.",
    category: "Investment",
    author: "Suresh Reddy",
    date: "2023-12-25",
    readTime: "9 min read",
    image: "/public/lovable-uploads/e491693e-a750-42b7-bdf6-cdff47be335b.png"
  },
  {
    id: 10,
    title: "Moving Home: Essential Packing Tips",
    excerpt: "Make your house move stress-free with these professional packing tips. Ensure your belongings arrive safely.",
    category: "Moving",
    author: "Kavita Shah",
    date: "2023-12-22",
    readTime: "5 min read",
    image: "/public/lovable-uploads/f5f1d518-d734-4fa1-abd3-f45e772294cd.png"
  }
];

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = blogPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Marquee />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Real Estate Insights & Tips
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Stay updated with the latest trends, tips, and insights from the real estate world. 
              Expert advice to help you make informed property decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <Pagination className="justify-center">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;