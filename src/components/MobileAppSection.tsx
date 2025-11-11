import { Download } from 'lucide-react';
import { useCMSContent } from '@/hooks/useCMSContent';
import { useToast } from '@/hooks/use-toast';
const MobileAppSection = () => {
  const {
    content: cmsContent
  } = useCMSContent('mobile_app_section');
  const {
    toast
  } = useToast();
  const handleDownloadClick = () => {
    toast({
      title: "🚀 Mobile Apps Coming Soon!",
      description: "Download our apps for the ultimate property experience. Stay tuned!"
    });
  };

  // Get the heading from multiple possible field names
  const getHeading = () => {
    return cmsContent?.content?.heading || cmsContent?.content?.headline || cmsContent?.content?.title || 'Homes, Wherever You Are!';
  };

  // Get the description from multiple possible field names
  const getDescription = () => {
    return cmsContent?.content?.description || cmsContent?.content?.subtitle || 'Download our app and discover properties anytime, anywhere. Get instant notifications for new listings that match your preferences.';
  };

  // Get the button text
  const getButtonText = () => {
    return cmsContent?.content?.buttonText || 'Download App';
  };

  // Get the coming soon message
  const getComingSoon = () => {
    return cmsContent?.content?.comingSoon || 'Coming Soon! Get ready for the ultimate property experience!';
  };
  return <section className="py-1 bg-gradient-to-br from-rose-50 to-white">
      <div className="container px-2 mx-0 my-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center max-w-6xl mx-auto px-6 py-8">
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Optional badge */}
            {/* <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium
                            bg-white text-[#d21404] border border-rose-200 mb-4">
              New features going live every week
             </div> */}

            <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">
              {getHeading()}
            </h2>

            <p className="text-gray-600 text-base md:text-lg mb-12 leading-relaxed">
              {getDescription()}
            </p>

            {/* Buttons — cherry red */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={handleDownloadClick} aria-label="Download on Google Play" className="min-w-[200px] inline-flex items-center justify-center gap-3 rounded-lg px-6 py-3
                           bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ef4444]
                           shadow-md">
                <Download className="w-5 h-5" />
                <span className="text-left">
                  <span className="block text-xs opacity-90">Download on</span>
                  <span className="block text-sm font-semibold">Google Play</span>
                </span>
              </button>

              <button onClick={handleDownloadClick} aria-label="Download on the App Store" className="min-w-[200px] inline-flex items-center justify-center gap-3 rounded-lg px-6 py-3
                           bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ef4444]
                           shadow-md">
                <Download className="w-5 h-5" />
                <span className="text-left">
                  <span className="block text-xs opacity-90">Download on</span>
                  <span className="block text-sm font-semibold">App Store</span>
                </span>
              </button>
            </div>

            {/* Coming Soon indicator */}
            <div className="mt-8 text-center lg:text-left">
              <p className="text-sm font-bold text-[#ef4444]">🚀 Coming Soon!</p>
              <p className="text-xs text-gray-600">{getComingSoon()}</p>
            </div>

            {/* Small trust row (optional) */}
            {/* <div className="mt-6 text-xs text-gray-500">
              Free to download · Instant updates · Secure login
             </div> */}
          </div>

          {/* Image */}
          <div className="hidden lg:flex justify-end items-center order-1 lg:order-2 pl-8">
            <div className="relative ml-8">
              <img src="/images/home-hni-mobile-app.png" alt="Home HNI mobile app preview" loading="lazy" className="w-full max-w-md h-[400px]" />
              {/* Decorative cherry-red glow */}
              <div className="pointer-events-none absolute -inset-6 -z-10 blur-2xl
                              bg-[radial-gradient(ellipse_at_top_left,rgba(210,20,4,0.18),transparent_60%)]" />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default MobileAppSection;
