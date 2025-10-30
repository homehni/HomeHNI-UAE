import { useNavigate } from 'react-router-dom';
import { FileText, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobilePostPropertyBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="sm:hidden px-4 py-8">
      <div className="bg-gradient-to-br from-brand-maroon-dark via-brand-maroon to-brand-maroon-dark rounded-2xl p-6 shadow-xl relative overflow-hidden border border-white/10">
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10">
          <h3 className="text-white text-lg font-semibold mb-3">
            Your property type not listed?
          </h3>
          
          <div className="space-y-2 mb-5">
            <div className="flex items-start gap-2 text-white/90 text-sm">
              <Search className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-300" />
              <span>Looking for something specific</span>
            </div>
            <div className="flex items-start gap-2 text-white/90 text-sm">
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" />
              <span>Get personalized property matches</span>
            </div>
          </div>

          <Button
            onClick={() => navigate('/post-service')}
            className="w-full bg-white text-brand-maroon-dark hover:bg-white/90 rounded-lg px-4 py-3 font-semibold shadow-lg transition-all"
          >
            <FileText className="w-5 h-5 mr-2" />
            Post Your Requirement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobilePostPropertyBanner;
