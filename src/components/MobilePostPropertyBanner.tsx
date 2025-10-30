import { useNavigate } from 'react-router-dom';
import { Building2, Zap, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobilePostPropertyBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="sm:hidden px-4 py-6">
      <div className="bg-gradient-to-br from-[#8B4513] via-[#6B3410] to-[#4A2810] rounded-2xl p-6 shadow-lg relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
        
        <div className="relative z-10">
          <h3 className="text-white text-lg font-semibold mb-3">
            Looking for Tenants / Buyers ?
          </h3>
          
          <div className="space-y-2 mb-5">
            <div className="flex items-start gap-2 text-white/90 text-sm">
              <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-300" />
              <span>Faster & Verified Tenants/Buyers</span>
            </div>
            <div className="flex items-start gap-2 text-white/90 text-sm">
              <IndianRupee className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-300" />
              <span>Pay ZERO brokerage</span>
            </div>
          </div>

          <Button
            onClick={() => navigate('/post-property')}
            className="w-full bg-[#d21404] text-white hover:bg-[#b80f03] rounded-lg px-4 py-3 font-medium shadow-lg"
          >
            <Building2 className="w-5 h-5 mr-2" />
            Post FREE Property Ad
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobilePostPropertyBanner;
