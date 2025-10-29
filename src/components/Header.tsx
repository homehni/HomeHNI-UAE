import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, Menu, UserPlus, LogIn, LogOut, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { useCMSContent } from '@/hooks/useCMSContent';
import Logo from './Logo';
import Sidebar from './Sidebar';
import LegalServicesForm from './LegalServicesForm';
import CountrySwitcher from './CountrySwitcher';
import Marquee from './Marquee';

const Header = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLegalFormOpen, setIsLegalFormOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const servicesHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
        description: "You have been logged out of your account.",
        className: "bg-white border border-red-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "12px solid hsl(var(--brand-red))",
        },
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
      <Marquee />
      <header className={`fixed md:top-8 top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-gradient-to-r from-red-800 to-red-700'}`}>
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 pt-[6px]">
          <div className="flex items-center h-14">
            
            {/* Mobile Layout: Logo - Center Button - Right Actions */}
            <div className="lg:hidden flex items-center justify-between w-full">
              {/* Left: Logo */}
              <div onClick={handleLogoClick} className="cursor-pointer flex-shrink-0">
                <Logo variant={isScrolled ? "scrolled" : "default"} />
              </div>
              
              {/* Center: Post Property Button */}
              {location.pathname !== '/post-property' && (
                <div className="flex-1 flex justify-center">
                  <Button variant="outline" size="sm" onClick={() => handlePostPropertyClick()} className={`font-medium px-2 py-1 text-xs transition-all duration-500 ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white text-brand-red border-white/50 hover:bg-white/90'}`}>
                    <span>Post property</span>
                    <span className="ml-0.5 bg-green-500 text-white text-[8px] px-1 py-0.5 rounded-full font-medium">Free</span>
                  </Button>
                </div>
              )}
              
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
                      
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard?tab=properties')}>
                        <span>Your Properties</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard?tab=interest')}>
                        <span>Your shortlists</span>
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

                <button onClick={e => {
                  e.preventDefault();
                  handlePostPropertyClick();
                }} className={`hover:opacity-80 transition-colors duration-500 text-sm xl:text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  SELL
                </button>

                {/* Services Dropdown */}
                {/* Dropdown content uses z-[100]; ensure other overlapping elements (e.g., homepage search) have lower z-index. */}
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

                <a href="/service-suite" onClick={e => {
                  e.preventDefault();
                  navigate('/service-suite');
                }} className={`hover:opacity-80 transition-colors duration-500 text-sm xl:text-base font-medium uppercase whitespace-nowrap ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  SERVICE PROVIDER
                </a>

              </div>
            </div>

            {/* Desktop Right section - Buttons and Menu */}
            <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-2 flex-1 justify-end">
              {/* Desktop: Post Requirement Button */}
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/post-service')}
                  className={`font-medium px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-sm transition-all duration-500 whitespace-nowrap min-w-[110px] xl:min-w-[140px] ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white text-brand-red border-white/50 hover:bg-white/90'}`}
                >
                  Post Requirement
                </Button>
              </div>

              {/* Desktop: Post Property Button */}
              {location.pathname !== '/post-property' && (
                <div>
                  <Button variant="outline" size="sm" onClick={() => handlePostPropertyClick()} className={`font-medium px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-sm transition-all duration-500 whitespace-nowrap min-w-[75px] xl:min-w-[130px] ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white text-brand-red border-white/50 hover:bg-white/90'}`}>
                    <span className="hidden xl:inline">Post property</span>
                    <span className="xl:hidden">Post</span>
                    <span className="ml-1 bg-green-500 text-white text-[8px] xl:text-[10px] px-1 xl:px-1.5 py-0.5 rounded-full font-medium">Free</span>
                  </Button>
                </div>
              )}

              {/* Desktop: Post Requirement Button - Hidden */}

              {/* Login/Sign Up button for unauthenticated users - Desktop only */}
              {!user && (
                <div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/auth')}
                    className={`font-medium px-1.5 xl:px-3 py-1.5 text-[10px] xl:text-sm transition-all duration-500 whitespace-nowrap ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30'}`}
                  >
                    <LogIn className="mr-0.5 xl:mr-1 h-3 w-3 xl:h-4 xl:w-4" />
                    <span className="hidden xl:inline">Login/Sign Up</span>
                    <span className="xl:hidden">Login</span>
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
                    
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=chats')}>
                      <span>My Chats</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=properties')}>
                      <span>Your Properties</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=interest')}>
                      <span>Your shortlists</span>
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