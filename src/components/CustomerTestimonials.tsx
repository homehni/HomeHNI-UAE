
import { Play, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCMSContent } from '@/hooks/useCMSContent';

const CustomerTestimonials = () => {
  const { content: cmsContent } = useCMSContent('testimonials');
  const defaultTestimonials = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      text: "Home HNI is the best property site. I bought my house through them without paying any brokerage. The service was excellent and the team was very helpful."
    },
    {
      name: "Priya Sharma", 
      rating: 5,
      text: "I sold my apartment within a month through Home HNI. The platform made it very easy to list my property and connect with genuine buyers."
    },
    {
      name: "Amit Patel",
      rating: 5,
      text: "Great experience with Home HNI. The legal assistance they provided was very helpful. I would recommend this platform to everyone."
    }
  ];

  const testimonials = cmsContent?.content?.testimonials || defaultTestimonials;

  return (
    <section className="py-16 bg-white text-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {cmsContent?.content?.title || 'Our Customers Loves us'}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Video Section */}
          <div className="flex justify-center lg:justify-start">
            <Card className="bg-gray-50 border-2 border-primary w-full max-w-md">
              <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-brand-red-light transition-colors">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
                <p className="text-center text-gray-600">
                  Watch our customer stories
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials Section */}
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 border-2 border-primary">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-700 font-medium">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-black">
                          {testimonial.name}
                        </h4>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
