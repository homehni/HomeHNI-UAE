
import { Download } from 'lucide-react';
import { useCMSContent } from '@/hooks/useCMSContent';

const MobileAppSection = () => {
  const { content: cmsContent } = useCMSContent('mobile-app');
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Mobile Phones Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <img 
                src={cmsContent?.content?.appImage || "/lovable-uploads/homeAppPromotion.png"}
                alt="5 Acres Mobile App Screenshots"
                loading="lazy"
                className="w-full max-w-lg h-auto"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              {cmsContent?.content?.title || 'Find A New Home On The Go'}
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {cmsContent?.content?.description || 'Download our app and discover properties anytime, anywhere. Get instant notifications for new listings that match your preferences.'}
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Google Play Button */}
              <a 
                href="#" 
                className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors min-w-[180px]"
              >
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>

              {/* App Store Button */}
              <a 
                href="#" 
                className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors min-w-[180px]"
              >
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
