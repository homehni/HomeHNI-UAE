import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, HelpCircle, Settings, Menu, X, UserPlus, LogIn, LogOut, User, MessageCircle, Users, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import Logo from './Logo';
import Sidebar from './Sidebar';
import MegaMenu from './MegaMenu';
import LegalServicesForm from './LegalServicesForm';
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
  const rentalHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const servicesHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
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
  const handleLegalServicesClick = () => {
    setIsLegalFormOpen(true);
  };
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

  // Check if current page is loans, architects, interior, handover-services, property-management, painting-cleaning, or packers-movers page
  const isLoansPage = location.pathname === '/loans';
  const isArchitectsPage = location.pathname === '/architects';
  const isInteriorPage = location.pathname === '/interior';
  const isHandoverServicesPage = location.pathname === '/handover-services';
  const isPropertyManagementPage = location.pathname === '/property-management';
  const isPaintingCleaningPage = location.pathname === '/painting-cleaning';
  const isPackersMoversPage = location.pathname === '/packers-movers';
  return <>
      <header className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-gradient-to-r from-red-800 to-red-700'}`}>
        <div className="w-full px-4 lg:px-6 xl:px-8 pt-[6px]">
          <div className="flex justify-between items-center h-14">
            {/* Left section - Logo and Location (Mobile and Desktop) */}
            <div className="flex items-center space-x-4">
              {/* Home HNI Logo - Show different variant based on scroll state */}
              <div onClick={handleLogoClick} className="cursor-pointer">
                <Logo variant={isScrolled ? "scrolled" : "default"} />
              </div>

              {/* Location Selector - Hidden on Loans, Architects, Interior, Handover Services, Property Management, Painting Cleaning, and Packers Movers page */}
              {!isLoansPage && !isArchitectsPage && !isInteriorPage && !isHandoverServicesPage && !isPropertyManagementPage && !isPaintingCleaningPage && !isPackersMoversPage && (
                <Select>
                  <SelectTrigger className={`w-28 sm:w-32 transition-all duration-500 [&>svg]:text-current ${isScrolled ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300' : 'bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30'}`}>
                    <SelectValue placeholder="All India" defaultValue="all-india" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="all-india">All India</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Desktop Navigation Links - Hidden on Loans, Architects, Interior, Handover Services, Property Management, Painting Cleaning, and Packers Movers page */}
              {!isLoansPage && !isArchitectsPage && !isInteriorPage && !isHandoverServicesPage && !isPropertyManagementPage && !isPaintingCleaningPage && !isPackersMoversPage && <nav className="hidden lg:flex items-center space-x-5">
  <MegaMenu isScrolled={isScrolled} />
  
  <a href="#" onClick={e => {
                e.preventDefault();
                handlePostPropertyClick('Owner');
              }} className={`hover:opacity-80 transition-colors duration-500 text-base font-medium ${isScrolled ? 'text-gray-800' : 'text-white'} cursor-pointer`}>
    Sellers
  </a>
  
  <a href="#" onClick={e => {
                e.preventDefault();
                handlePostPropertyClick('Agent');
              }} className={`hover:opacity-80 transition-colors duration-500 text-base font-medium ${isScrolled ? 'text-gray-800' : 'text-white'} cursor-pointer`}>
    Agents
  </a>

               <a href="#" onClick={e => {
                e.preventDefault();
                handlePostPropertyClick('Builder');
              }} className={`hover:opacity-80 transition-colors duration-500 text-base font-medium ${isScrolled ? 'text-gray-800' : 'text-white'} cursor-pointer`}>
    Builders
  </a>
  



              <div className="relative" onMouseEnter={handleRentalHover} onMouseLeave={handleRentalLeave}>
    <button className={`flex items-center hover:opacity-80 transition-colors duration-500 text-base font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
      Rental
      <ChevronDown className="ml-1 h-3 w-3" />
    </button>
    
    {/* Custom Rental Dropdown */}
    {isRentalDropdownOpen && <div className="absolute top-full left-0 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2" onMouseEnter={handleRentalHover} onMouseLeave={handleRentalLeave}>
        <div className="py-2">
          <button onClick={handleLegalServicesClick} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
           Owners
          </button>
          <button onClick={() => navigate('/handover-services')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            Tenants
          </button>
          
        </div>
      </div>}
  </div>
  
  {/* Services Dropdown */}
  <div className="relative" onMouseEnter={handleServicesHover} onMouseLeave={handleServicesLeave}>
    <button className={`flex items-center hover:opacity-80 transition-colors duration-500 text-base font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
      Services
      <ChevronDown className="ml-1 h-3 w-3" />
    </button>
    
    {/* Custom Services Dropdown */}
    {isServicesDropdownOpen && <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2" onMouseEnter={handleServicesHover} onMouseLeave={handleServicesLeave}>
        <div className="py-2">
          <button onClick={handleLegalServicesClick} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            Legal Services
          </button>
          <button onClick={() => navigate('/handover-services')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            Handover Services
          </button>
          <button onClick={() => navigate('/property-management')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            Property Management
          </button>

      


          <button onClick={() => navigate('/architects')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            Architects
          </button>

          <button onClick={() => navigate('/interior')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            Interior Designers
          </button>
        </div>
      </div>}
  </div>

                <a href="/loans" onClick={e => {
                e.preventDefault();
                navigate('/loans');
              }} className={`hover:opacity-80 transition-colors duration-500 text-base font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  Loans
                </a>

              {<a href="/careers" className={`hover:opacity-80 transition-colors duration-500 text-base font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
     Jobs
  </a>}
             </nav>}

            </div>

            {/* Right section - Phone (Loans page only), Post Property, Profile, and Hamburger Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Phone Number - Only visible on Loans, Architects, Interior, Handover Services, Property Management, Painting Cleaning, and Packers Movers page */}
              {(isLoansPage || isArchitectsPage || isInteriorPage || isHandoverServicesPage || isPropertyManagementPage || isPaintingCleaningPage || isPackersMoversPage) && <a href="tel:+919036015272" className={`flex items-center px-3 py-2 rounded-lg border transition-all duration-500 ${isScrolled ? 'bg-white text-red-600 border-red-200 hover:bg-red-50' : 'bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20'}`}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="font-medium text-sm">+91 80740 17388</span>
                </a>}
              {/* Post Property Button - Hidden on Loans, Architects, Interior, Handover Services, Property Management, Painting Cleaning, and Packers Movers page */}
              {!isLoansPage && !isArchitectsPage && !isInteriorPage && !isHandoverServicesPage && !isPropertyManagementPage && !isPaintingCleaningPage && !isPackersMoversPage && <Button variant="outline" size="sm" onClick={() => handlePostPropertyClick()} className={`font-medium px-1.5 sm:px-3 py-1.5 text-xs sm:text-sm transition-all duration-500 ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white text-brand-red border-white/50 hover:bg-white/90'}`}>
                  <span className="hidden sm:inline">Post property</span>
                  <span className="sm:hidden">Post</span>
                  <span className="ml-1 bg-green-500 text-white text-[10px] px-1 py-0.5 rounded">Free</span>
                </Button>}


              {/* Profile Avatar - Only visible for authenticated users */}
              {user && <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={`p-2 transition-colors duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                        <AvatarFallback className="bg-brand-red text-white">
                          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=properties')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>My Properties</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=leads')}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Contact Leads</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=profile')}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=interests')}>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>My Interests</span>
                    </DropdownMenuItem>
                    {isAdmin && <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>}

              {/* Sidebar toggle button - Hidden on Loans, Architects, Interior, Handover Services, Property Management, Painting Cleaning, and Packers Movers page */}
              {!isLoansPage && !isArchitectsPage && !isInteriorPage && !isHandoverServicesPage && !isPropertyManagementPage && !isPaintingCleaningPage && !isPackersMoversPage && <Button variant="ghost" size="sm" className={`flex items-center space-x-2 p-2 transition-colors duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`} onClick={() => setIsSidebarOpen(true)}>
                  <Menu size={20} />
                  <span className={`text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>Menu</span>
                </Button>}
            </div>
          </div>
        </div>
      </header>
      
      {/* Sidebar Component - Hidden on Loans, Architects, Interior, Handover Services, Property Management, Painting Cleaning, and Packers Movers page */}
      {!isLoansPage && !isArchitectsPage && !isInteriorPage && !isHandoverServicesPage && !isPropertyManagementPage && !isPaintingCleaningPage && !isPackersMoversPage && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      
      {/* Legal Services Form */}
      <LegalServicesForm isOpen={isLegalFormOpen} onClose={() => setIsLegalFormOpen(false)} />
    </>;
};
export default Header;