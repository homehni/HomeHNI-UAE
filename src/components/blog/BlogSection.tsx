import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Article {
  id: number;
  title: string;
  excerpt?: string;
  date: string;
  author: string;
  image: string;
}

interface SideArticle {
  title: string;
  date: string;
  author: string;
}

interface BlogSectionData {
  featured: Article[];
  sideArticles: SideArticle[];
}

interface Tag {
  name: string;
  active: boolean;
}

interface BlogSectionProps {
  title: string;
  data: BlogSectionData;
  tags: Tag[];
  viewMoreText: string;
  backgroundColor?: string;
}

const BlogSection = ({ title, data, tags, viewMoreText, backgroundColor = "bg-white" }: BlogSectionProps) => {
  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        
        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tags.map((tag, index) => (
            <Badge 
              key={index}
              className={tag.active 
                ? "bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors cursor-pointer" 
                : "px-4 py-2 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              }
              variant={tag.active ? "default" : "outline"}
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Featured Articles Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First featured article - larger */}
              <div className="md:col-span-1">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => window.location.href = `/blog/${data.featured[0].title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}`}
                >
                  <img 
                    src={data.featured[0].image} 
                    alt={`${data.featured[0].title} - featured blog image`}
                    className="w-full h-80 object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-lg mb-3 line-clamp-2">
                      {data.featured[0].title}
                    </h3>
                    {data.featured[0].excerpt && (
                      <p className="text-white/90 text-sm mb-2 line-clamp-2">
                        {data.featured[0].excerpt}
                      </p>
                    )}
                    <p className="text-white/80 text-sm">
                      {data.featured[0].date} by <span className="text-red-300">{data.featured[0].author}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Second and Third featured articles */}
              <div className="space-y-6">
                {data.featured.slice(1, 3).map((article, index) => (
                  <div 
                    key={article.id} 
                    className="relative group cursor-pointer"
                    onClick={() => window.location.href = `/blog/${article.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}`}
                  >
                    <img 
                      src={article.image} 
                      alt={`${article.title} - blog image`}
                      className="w-full h-36 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {article.date} by <span className="text-red-300">{article.author}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Article List */}
          <div className="space-y-6">
            {data.sideArticles.map((article, index) => (
              <div 
                key={index} 
                className="group cursor-pointer"
                onClick={() => window.location.href = `/blog/${article.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}`}
              >
                <h4 className="font-bold text-gray-900 mb-2 hover:text-red-600 transition-colors line-clamp-2 text-sm">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {article.date} by <span className="text-red-500 font-medium">{article.author}</span>
                </p>
                {index < data.sideArticles.length - 1 && (
                  <hr className="mt-4 border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 px-8 py-3 rounded-full">
            {viewMoreText}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;