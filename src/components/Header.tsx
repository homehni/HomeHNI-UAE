import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, HelpCircle, Settings, Menu, X, UserPlus, LogIn, LogOut, User, MessageCircle, Users, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { useCMSContent } from '@/hooks/useCMSContent';
import Logo from './Logo';
import Sidebar from './Sidebar';
import MegaMenu from './MegaMenu';
import LegalServicesForm from './LegalServicesForm';
import CountrySwitcher from './CountrySwitcher';
const Header = () => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    isAdmin
  } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLegalFormOpen, setIsLegalFormOpen] = useState(false);
  const [isRentalDropdownOpen, setIsRentalDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isSellersDropdownOpen, setIsSellersDropdownOpen] = useState(false);
  const [isLifetimePlansDropdownOpen, setIsLifetimePlansDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isResidentialPlanOpen, setIsResidentialPlanOpen] = useState(false);
  const [isCommercialPlanOpen, setIsCommercialPlanOpen] = useState(false);
  const [statesData, setStatesData] = useState<Record<string, string[]>>({});
  const rentalHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const servicesHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sellersHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lifetimePlansHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();

  // Fetch CMS content for header navigation
  const { content: headerNavContent, refreshContent } = useCMSContent('header_nav');

  // Debug: Log CMS content when it changes
  useEffect(() => {
    console.log('Header CMS content updated:', headerNavContent);
  }, [headerNavContent]);

  // Manual refresh function for testing
  const handleRefreshHeader = () => {
    console.log('Manually refreshing header content...');
    refreshContent();
  };

  const handleLegalServicesClick = () => {
    setIsLegalFormOpen(true);
  };

  const handleRentalHover = () => {
    if (rentalHoverTimeoutRef.current) {
      clearTimeout(rentalHoverTimeoutRef.current);
    }
    setIsRentalDropdownOpen(true);
  };
  const handleRentalLeave = () => {
    rentalHoverTimeoutRef.current = setTimeout(() => {
      setIsRentalDropdownOpen(false);
    }, 150);
  };
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
  const handleSellersHover = () => {
    if (sellersHoverTimeoutRef.current) {
      clearTimeout(sellersHoverTimeoutRef.current);
    }
    setIsSellersDropdownOpen(true);
  };
  const handleSellersLeave = () => {
    sellersHoverTimeoutRef.current = setTimeout(() => {
      setIsSellersDropdownOpen(false);
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
      // Account for marquee height (approximately 40px) - reduced threshold for better visibility
      setIsScrolled(scrollTop > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load states data
  useEffect(() => {
    const fetchStatesData = async () => {
      try {
        const response = await fetch('/data/india_states_cities.json');
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error('Error fetching states data:', error);
      }
    };
    fetchStatesData();
  }, []);
  const handleAboutUsClick = () => {
    if (location.pathname === '/about-us') {
      // If already on About Us page, scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Navigate to About Us page
      navigate('/about-us');
    }
  };
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
  const handleAuthClick = () => {
    navigate('/auth');
  };

  // Check if current page is architects, interior, handover-services, property-management, painting-cleaning, packers-movers, or careers page
  const isArchitectsPage = location.pathname === '/architects';
  const isInteriorPage = location.pathname === '/interior';
  const isHandoverServicesPage = location.pathname === '/handover-services';
  const isPropertyManagementPage = location.pathname === '/property-management';
  const isPaintingCleaningPage = location.pathname === '/painting-cleaning';
  const isPackersMoversPage = location.pathname === '/packers-movers';
  const isCareersPage = location.pathname === '/careers';
  return <>
      <header className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-gradient-to-r from-red-800 to-red-700'}`}>
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 pt-[6px]">
          <div className="flex justify-between items-center h-14">
            {/* Left section - Logo and Location (Mobile and Desktop) */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
              {/* Home HNI Logo - Show different variant based on scroll state */}
              <div onClick={handleLogoClick} className="cursor-pointer flex-shrink-0">
                <Logo variant={isScrolled ? "scrolled" : "default"} />
              </div>

              {/* Location Selector - Commented out */}
              {false && (
                <Select>
                  <SelectTrigger className={`w-28 sm:w-32 transition-all duration-500 [&>svg]:text-current hidden sm:flex ${isScrolled ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300' : 'bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30'}`}>
                    <SelectValue placeholder="All India" defaultValue="all-india" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="all-india">All India</SelectItem>
                    {Object.keys(statesData).sort().map((state) => (
                      <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Country Switcher - Show for testing */}
              <CountrySwitcher />

              {/* Desktop Navigation Links - Show everywhere */}
              {<nav className="hidden lg:flex items-center space-x-5">
                {/* Dynamic CMS-based navigation */}
                {headerNavContent?.content?.nav_items?.map((item: any, index: number) => (
                  <div key={index}>
                    {item.submenu ? (
                      // Dropdown menu item
                      <div className="relative" onMouseEnter={() => {
                        if (item.label === 'Services') {
                          handleServicesHover();
                        } else if (item.label === 'Plans') {
                          handleLifetimePlansHover();
                        }
                      }} onMouseLeave={() => {
                        if (item.label === 'Services') {
                          handleServicesLeave();
                        } else if (item.label === 'Plans') {
                          handleLifetimePlansLeave();
                        }
                      }}>
                        <button className={`flex items-center hover:opacity-80 transition-colors duration-500 text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                          {item.label}
                        </button>
                        
                         {/* Dynamic dropdown content based on CMS */}
                         {item.label === 'Services' && isServicesDropdownOpen && (
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
                        
                        {item.label === 'Plans' && isLifetimePlansDropdownOpen && (
                          <div className="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] mt-2" onMouseEnter={handleLifetimePlansHover} onMouseLeave={handleLifetimePlansLeave}>
                            <div className="py-2">
                              <button onClick={() => window.location.href = '/plans?tab=agent'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                Agent Plans
                              </button>
                              <button onClick={() => window.location.href = '/plans?tab=builder-lifetime'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                Builder Lifetime Plans
                              </button>
                              <button onClick={() => window.location.href = '/plans?tab=buyer'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                Buyer Plans
                              </button>
                              <button onClick={() => window.location.href = '/plans?tab=seller'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                Seller Plans
                              </button>
                              <button onClick={() => window.location.href = '/plans?tab=owner'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                Owner Plans
                              </button>
                              <button onClick={() => window.location.href = '/plans?tab=commercial-buyer'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                Commercial Buyer Plans
                              </button>
                              <button onClick={() => window.location.href = '/plans?tab=commercial-seller'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                Commercial Seller Plans
                              </button>
                              <button onClick={() => window.location.href = '/plans?tab=commercial-owner'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                Commercial Owner Plans
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular link item
                      <a 
                        href={item.link} 
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.link);
                        }}
                        className={`hover:opacity-80 transition-colors duration-500 text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}
                      >
                        {item.label}
                      </a>
                    )}
                  </div>
                )) || (
                  // Fallback to hardcoded navigation if CMS content is not available
                  <>
                    {/* Services Dropdown */}
                    <div className="relative" onMouseEnter={handleServicesHover} onMouseLeave={handleServicesLeave}>
                      <button className={`flex items-center hover:opacity-80 transition-colors duration-500 text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                        Services
                      </button>
                      
                      {/* Custom Services Dropdown */}
                      {isServicesDropdownOpen && <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] mt-2" onMouseEnter={handleServicesHover} onMouseLeave={handleServicesLeave}>
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
                         </div>}
                    </div>
                    
                    {/* Plans Dropdown */}
                    <div className="relative" onMouseEnter={handleLifetimePlansHover} onMouseLeave={handleLifetimePlansLeave}>
                      <button className={`flex items-center hover:opacity-80 transition-colors duration-500 text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                        Plans
                      </button>
                      
                      {/* Plans Dropdown */}
                      {isLifetimePlansDropdownOpen && <div className="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] mt-2" onMouseEnter={handleLifetimePlansHover} onMouseLeave={handleLifetimePlansLeave}>
                        <div className="py-2">
                          <button onClick={() => window.location.href = '/plans?tab=agent'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            Agent Plans
                          </button>
                          <button onClick={() => window.location.href = '/plans?tab=builder-lifetime'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            Builder Lifetime Plans
                          </button>
                          <button onClick={() => window.location.href = '/plans?tab=buyer'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            Buyer Plans
                          </button>
                          <button onClick={() => window.location.href = '/plans?tab=seller'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            Seller Plans
                          </button>
                          <button onClick={() => window.location.href = '/plans?tab=owner'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            Owner Plans
                          </button>
                          <button onClick={() => window.location.href = '/plans?tab=commercial-buyer'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            Commercial Buyer Plans
                          </button>
                          <button onClick={() => window.location.href = '/plans?tab=commercial-seller'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            Commercial Seller Plans
                          </button>
                          <button onClick={() => window.location.href = '/plans?tab=commercial-owner'} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            Commercial Owner Plans
                          </button>
                        </div>
                      </div>}
                    </div>
                    
                    <a href="/services" onClick={e => {
                      e.preventDefault();
                      navigate('/services');
                    }} className={`hover:opacity-80 transition-colors duration-500 text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                      Services
                    </a>

                    <a href="/service-suite" onClick={e => {
                      e.preventDefault();
                      navigate('/service-suite');
                    }} className={`hover:opacity-80 transition-colors duration-500 text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                      Service Provider
                    </a>

                    <a href="/careers" className={`hover:opacity-80 transition-colors duration-500 text-base font-medium uppercase ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                      Jobs
                    </a>
                  </>
                )}
              </nav>}

            </div>

            {/* Center section - Empty for now */}
            <div className="flex-shrink-0 mx-4">
            </div>

            {/* Right section - Other buttons, Profile, and Hamburger Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 justify-end">
               {/* Phone Number - No longer visible on any page */}
               {false && <a href="tel:+919036015272" className={`flex items-center px-3 py-2 rounded-lg border transition-all duration-500 ${isScrolled ? 'bg-white text-red-600 border-red-200 hover:bg-red-50' : 'bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20'}`}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="font-medium text-sm">+91 80740 17388</span>
                </a>}

               {/* Post Property Button */}
               {<Button variant="outline" size="sm" onClick={() => handlePostPropertyClick()} className={`font-medium px-2 sm:px-3 py-1.5 text-xs sm:text-sm transition-all duration-500 ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white text-brand-red border-white/50 hover:bg-white/90'}`}>
                 <span className="hidden sm:inline">Post property</span>
                 <span className="sm:hidden">Post Property</span>
                 <span className="ml-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">Free</span>
               </Button>}

               {/* Post Requirement Button - Hide on tablet and mobile */}
               {<Button variant="outline" size="sm" onClick={() => navigate('/post-service')} className={`hidden lg:flex font-medium px-2 sm:px-3 py-1.5 text-xs sm:text-sm transition-all duration-500 ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white text-brand-red border-white/50 hover:bg-white/90'}`}>
                  <span className="hidden sm:inline">Post Requirement</span>
                  <span className="sm:hidden">Post Requirement</span>
                </Button>}


               {/* Sign Up / Login buttons for unauthenticated users - Hide on tablet and mobile */}
               {!user && <div className="hidden lg:flex items-center space-x-2">
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
               </div>}

               {/* Profile Avatar - Only visible for authenticated users */}
              {user && <DropdownMenu onOpenChange={setIsUserDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={`flex items-center space-x-2 p-2 transition-colors duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                        <AvatarFallback className="bg-brand-red text-white">
                          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-gray-800' : 'text-white'} hidden sm:block`} />
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
                </DropdownMenu>}

               {/* Sidebar toggle button - Show everywhere */}
               {<Button variant="ghost" size="sm" className={`flex items-center space-x-2 p-2 transition-colors duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`} onClick={() => setIsSidebarOpen(true)}>
                   <Menu size={20} />
                   <span className={`text-sm font-medium hidden sm:inline ${isScrolled ? 'text-gray-800' : 'text-white'}`}>Menu</span>
                 </Button>}
            </div>
          </div>
        </div>
      </header>
      
        {/* Sidebar Component - Show everywhere */}
        {<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      
      {/* Legal Services Form */}
      <LegalServicesForm isOpen={isLegalFormOpen} onClose={() => setIsLegalFormOpen(false)} />
    </>;
};
export default Header;