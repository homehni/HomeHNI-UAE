import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, Menu, UserPlus, LogIn, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { useCMSContent } from '@/hooks/useCMSContent';
import Logo from './Logo';
import Sidebar from './Sidebar';
import LegalServicesForm from './LegalServicesForm';
import CountrySwitcher from './CountrySwitcher';

const Header = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLegalFormOpen, setIsLegalFormOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isLifetimePlansDropdownOpen, setIsLifetimePlansDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isResidentialPlanOpen, setIsResidentialPlanOpen] = useState(false);
  const [isCommercialPlanOpen, setIsCommercialPlanOpen] = useState(false);
  
  const servicesHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lifetimePlansHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Fetch CMS content for header navigation
  const { content: headerNavContent } = useCMSContent('header_nav');

  const handleServicesHover = () => {
    if (servicesHoverTimeoutRef.current) {
      clearTimeout(servicesHoverTimeoutRef.current);
    }
    setIsServicesDropdownOpen(true);
  };

  const handleServicesLeave = () => {
    servicesHoverTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 150);
  };

  const handleLifetimePlansHover = () => {
    if (lifetimePlansHoverTimeoutRef.current) {
      clearTimeout(lifetimePlansHoverTimeoutRef.current);
    }
    setIsLifetimePlansDropdownOpen(true);
  };

  const handleLifetimePlansLeave = () => {
    lifetimePlansHoverTimeoutRef.current = setTimeout(() => {
      setIsLifetimePlansDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handlePostPropertyClick = (role?: string) => {
    const path = role ? `/post-property?role=${role}` : '/post-property';
    if (user) {
      navigate(path);
    } else {
      navigate(`/auth?redirectTo=${encodeURIComponent(path)}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <header className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-gradient-to-r from-red-800 to-red-700'}`}>
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 pt-[6px]">
          <div className="flex items-center h-14">
            
            {/* Mobile Layout: Logo - Center Button - Right Actions */}
            <div className="lg:hidden flex items-center justify-between w-full">
              {/* Left: Logo */}
              <div onClick={handleLogoClick} className="cursor-pointer flex-shrink-0">
                <Logo variant={isScrolled ? "scrolled" : "default"} />
              </div>
              
              {/* Center: Post Property Button */}
              <div className="flex-1 flex justify-center">
                <Button variant="outline" size="sm" onClick={() => handlePostPropertyClick()} className={`font-medium px-2 py-1 text-xs transition-all duration-500 ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white text-brand-red border-white/50 hover:bg-white/90'}`}>
                  <span>Post property</span>
                  <span className="ml-0.5 bg-green-500 text-white text-[8px] px-1 py-0.5 rounded-full font-medium">Free</span>
                </Button>
              </div>
              
              {/* Right: Profile and Menu */}
              <div className="flex items-center space-x-2">
                {/* Profile Avatar - Mobile */}
                {user && (
                  <DropdownMenu onOpenChange={setIsUserDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={`flex items-center space-x-1 p-1 transition-colors duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                          <AvatarFallback className="bg-brand-red text-white text-sm">
                            {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                      <DropdownMenuItem onClick={() => navigate('/dashboard?tab=profile')}>
                        <span>Profile</span>
                      </DropdownMenuItem>
                      
                      {/* Residential Plan with custom dropdown */}
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsResidentialPlanOpen(!isResidentialPlanOpen);
                        }}
                        onSelect={(e) => e.preventDefault()}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>Residential Plan</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isResidentialPlanOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </DropdownMenuItem>
                      
                      {isResidentialPlanOpen && (
                        <div className="pl-4 space-y-0">
                          <DropdownMenuItem onClick={() => navigate('/plans?tab=buyer')}>
                            <span>Buyer Plan</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/plans?tab=seller')}>
                            <span>Seller Plan</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/plans?tab=owner')}>
                            <span>Owner Plan</span>
                          </DropdownMenuItem>
                        </div>
                      )}

                      {/* Commercial Plan with custom dropdown */}
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsCommercialPlanOpen(!isCommercialPlanOpen);
                        }}
                        onSelect={(e) => e.preventDefault()}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>Commercial Plan</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCommercialPlanOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </DropdownMenuItem>
                      
                      {isCommercialPlanOpen && (
                        <div className="pl-4 space-y-0">
                          <DropdownMenuItem onClick={() => navigate('/plans?tab=commercial-buyer')}>
                            <span>Commercial Buyer Plan</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/plans?tab=commercial-seller')}>
                            <span>Commercial Seller Plan</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/plans?tab=commercial-owner')}>
                            <span>Commercial Owner Plan</span>
                          </DropdownMenuItem>
                        </div>
                      )}
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/my-listings')}>
                        <span>My Listings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/my-interests')}>
                        <span>My Interest</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Menu button */}
                <Button variant="ghost" size="sm" className={`flex items-center space-x-2 p-2 transition-colors duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`} onClick={() => setIsSidebarOpen(true)}>
                  <Menu size={20} />
                </Button>
              </div>
            </div>
            
            {/* Desktop Layout: Logo and Navigation - Left section */}
            <div className="hidden lg:flex items-center space-x-2 sm:space-x-4 flex-1">
              {/* Home HNI Logo */}
              <div onClick={handleLogoClick} className="cursor-pointer flex-shrink-0">
                <Logo variant={isScrolled ? "scrolled" : "default"} />
              </div>

              {/* Desktop Navigation */}
              <div className="flex items-center space-x-3 xl:space-x-5">
                {/* Country Switcher - Global dropdown */}
                <CountrySwitcher />

                {/* Navigation Links */}
                <a href="/search?type=buy" onClick={e => {
                  e.preventDefault();
                  navigate('/search?type=buy');
                }} className={`hover:opacity-80 transition-colors duration-500 text-sm xl:text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  BUY
                </a>

                <a href="/search?type=rent" onClick={e => {
                  e.preventDefault();
                  navigate('/search?type=rent');
                }} className={`hover:opacity-80 transition-colors duration-500 text-sm xl:text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  RENT
                </a>

                <a href="/post-property" onClick={e => {
                  e.preventDefault();
                  navigate('/post-property');
                }} className={`hover:opacity-80 transition-colors duration-500 text-sm xl:text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  SELL
                </a>

                {/* Services Dropdown */}
                <div className="relative" onMouseEnter={handleServicesHover} onMouseLeave={handleServicesLeave}>
                  <button className={`flex items-center hover:opacity-80 transition-colors duration-500 text-sm xl:text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                    SERVICES
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {isServicesDropdownOpen && (
                    <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] mt-2" onMouseEnter={handleServicesHover} onMouseLeave={handleServicesLeave}>
                      <div className="py-2">
                        <button onClick={() => navigate('/services?tab=loans')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Loans
                        </button>
                        <button onClick={() => navigate('/services?tab=home-security')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Home Security Services
                        </button>
                        <button onClick={() => navigate('/services?tab=packers-movers')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Packers & Movers
                        </button>
                        <button onClick={() => navigate('/services?tab=legal-services')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Legal Services
                        </button>
                        <button onClick={() => navigate('/services?tab=handover-services')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Handover Services
                        </button>
                        <button onClick={() => navigate('/services?tab=property-management')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Property Management
                        </button>
                        <button onClick={() => navigate('/services?tab=architects')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Architects
                        </button>
                        <button onClick={() => navigate('/services?tab=painting-cleaning')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Painting & Cleaning
                        </button>
                        <button onClick={() => navigate('/services?tab=interior-design')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Interior Designers
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Plans Dropdown */}
                <div className="relative" onMouseEnter={handleLifetimePlansHover} onMouseLeave={handleLifetimePlansLeave}>
                  <button className={`flex items-center hover:opacity-80 transition-colors duration-500 text-sm xl:text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                    PLANS
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {isLifetimePlansDropdownOpen && (
                    <div className="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] mt-2" onMouseEnter={handleLifetimePlansHover} onMouseLeave={handleLifetimePlansLeave}>
                      <div className="py-2">
                        <button onClick={() => navigate('/plans?tab=agent')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Agent Plans
                        </button>
                        <button onClick={() => navigate('/plans?tab=builder-lifetime')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Builder Lifetime Plans
                        </button>
                        <button onClick={() => navigate('/plans?tab=buyer')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Buyer Plans
                        </button>
                        <button onClick={() => navigate('/plans?tab=seller')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Seller Plans
                        </button>
                        <button onClick={() => navigate('/plans?tab=owner')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Owner Plans
                        </button>
                        <button onClick={() => navigate('/plans?tab=commercial-buyer')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Commercial Buyer Plans
                        </button>
                        <button onClick={() => navigate('/plans?tab=commercial-seller')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Commercial Seller Plans
                        </button>
                        <button onClick={() => navigate('/plans?tab=commercial-owner')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Commercial Owner Plans
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <a href="/service-provider" onClick={e => {
                  e.preventDefault();
                  navigate('/service-provider');
                }} className={`hover:opacity-80 transition-colors duration-500 text-sm xl:text-base font-medium uppercase whitespace-nowrap ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  SERVICE PROVIDER
                </a>

                <a href="/jobs" onClick={e => {
                  e.preventDefault();
                  navigate('/jobs');
                }} className={`hover:opacity-80 transition-colors duration-500 text-sm xl:text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  JOBS
                </a>
              </div>
            </div>

            {/* Desktop Right section - Buttons and Menu */}
            <div className="hidden lg:flex items-center space-x-2 flex-1 justify-end">
              {/* Desktop: Post Property Button */}
              <div>
                <Button variant="outline" size="sm" onClick={() => handlePostPropertyClick()} className={`font-medium px-3 py-1.5 text-sm transition-all duration-500 ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white text-brand-red border-white/50 hover:bg-white/90'}`}>
                  <span>Post property</span>
                  <span className="ml-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">Free</span>
                </Button>
              </div>

              {/* Desktop: Post Requirement Button */}
              <div>
                <Button variant="outline" size="sm" onClick={() => navigate('/post-service')} className={`font-medium px-3 py-1.5 text-sm transition-all duration-500 ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white text-brand-red border-white/50 hover:bg-white/90'}`}>
                  <span>Post Requirement</span>
                </Button>
              </div>

              {/* Sign Up / Login buttons for unauthenticated users - Desktop only */}
              {!user && (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/auth')}
                    className={`font-medium px-3 py-1.5 text-sm transition-all duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                  >
                    <LogIn className="mr-1 h-4 w-4" />
                    Login
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/auth?mode=signup')}
                    className={`font-medium px-3 py-1.5 text-sm transition-all duration-500 ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30'}`}
                  >
                    <UserPlus className="mr-1 h-4 w-4" />
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Profile Avatar - Desktop */}
              {user && (
                <DropdownMenu onOpenChange={setIsUserDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={`flex items-center space-x-1 p-2 transition-colors duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                        <AvatarFallback className="bg-brand-red text-white text-base">
                          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=profile')}>
                      <span>Profile</span>
                    </DropdownMenuItem>
                    
                    {/* Residential Plan with custom dropdown */}
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsResidentialPlanOpen(!isResidentialPlanOpen);
                      }}
                      onSelect={(e) => e.preventDefault()}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>Residential Plan</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isResidentialPlanOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </DropdownMenuItem>
                    
                    {isResidentialPlanOpen && (
                      <div className="pl-4 space-y-0">
                        <DropdownMenuItem onClick={() => navigate('/plans?tab=buyer')}>
                          <span>Buyer Plan</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/plans?tab=seller')}>
                          <span>Seller Plan</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/plans?tab=owner')}>
                          <span>Owner Plan</span>
                        </DropdownMenuItem>
                      </div>
                    )}

                    {/* Commercial Plan with custom dropdown */}
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCommercialPlanOpen(!isCommercialPlanOpen);
                      }}
                      onSelect={(e) => e.preventDefault()}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>Commercial Plan</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCommercialPlanOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </DropdownMenuItem>
                    
                    {isCommercialPlanOpen && (
                      <div className="pl-4 space-y-0">
                        <DropdownMenuItem onClick={() => navigate('/plans?tab=commercial-buyer')}>
                          <span>Commercial Buyer Plan</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/plans?tab=commercial-seller')}>
                          <span>Commercial Seller Plan</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/plans?tab=commercial-owner')}>
                          <span>Commercial Owner Plan</span>
                        </DropdownMenuItem>
                      </div>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-listings')}>
                      <span>My Listings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-interests')}>
                      <span>My Interest</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Menu button - Desktop */}
              <Button variant="ghost" size="sm" className={`flex items-center space-x-2 p-2 transition-colors duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`} onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} />
                <span className={`text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>Menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Legal Services Form */}
      <LegalServicesForm isOpen={isLegalFormOpen} onClose={() => setIsLegalFormOpen(false)} />
    </>
  );
};

export default Header;