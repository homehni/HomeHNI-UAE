import { Download } from 'lucide-react';
import { useCMSContent } from '@/hooks/useCMSContent';

const MobileAppSection = () => {
  const { content: cmsContent } = useCMSContent('mobile-app');

  return (
    <section className="py-8 bg-gradient-to-br from-rose-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Optional badge */}
            {/* <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium
                            bg-white text-[#d21404] border border-rose-200 mb-4">
              New features going live every week
            </div> */}

            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              {cmsContent?.content?.title || 'Homes, Wherever You Are'}
            </h2>

            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              {cmsContent?.content?.description ||
                'Download our app and discover properties anytime, anywhere. Get instant notifications for new listings that match your preferences.'}
            </p>

            {/* Buttons — cherry red */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#"
                aria-label="Download on Google Play"
                className="min-w-[200px] inline-flex items-center justify-center gap-3 rounded-lg px-6 py-3
                           bg-[#d21404] text-white hover:bg-[#b80f03] transition-colors
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d21404]
                           shadow-md"
                rel="noopener noreferrer"
              >
                <Download className="w-5 h-5" />
                <span className="text-left">
                  <span className="block text-xs opacity-90">Download on</span>
                  <span className="block text-sm font-semibold">Google Play</span>
                </span>
              </a>

              <a
                href="#"
                aria-label="Download on the App Store"
                className="min-w-[200px] inline-flex items-center justify-center gap-3 rounded-lg px-6 py-3
                           bg-[#d21404] text-white hover:bg-[#b80f03] transition-colors
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d21404]
                           shadow-md"
                rel="noopener noreferrer"
              >
                <Download className="w-5 h-5" />
                <span className="text-left">
                  <span className="block text-xs opacity-90">Download on</span>
                  <span className="block text-sm font-semibold">App Store</span>
                </span>
              </a>
            </div>

            {/* Small trust row (optional) */}
            {/* <div className="mt-6 text-xs text-gray-500">
              Free to download · Instant updates · Secure login
            </div> */}
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative">
              <img
                src={cmsContent?.content?.appImage || '/lovable-uploads/ee843ec7-81c8-4575-aff3-09a145035577.png'}
                alt="Home HNI mobile app preview"
                loading="lazy"
                className="w-full max-w-md h-auto"
              />
              {/* Decorative cherry-red glow */}
              <div className="pointer-events-none absolute -inset-6 -z-10 blur-2xl
                              bg-[radial-gradient(ellipse_at_top_left,rgba(210,20,4,0.18),transparent_60%)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
