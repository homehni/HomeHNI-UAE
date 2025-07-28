import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, HelpCircle, Settings, Menu, X, UserPlus, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import Sidebar from './Sidebar';
import MegaMenu from './MegaMenu';
import LegalServicesForm from './LegalServicesForm';
const Header = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLegalFormOpen, setIsLegalFormOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

  const handlePostPropertyClick = () => {
    if (user) {
      navigate('/post-property');
    } else {
      navigate('/auth');
    }
  };
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

              {/* Location Selector - Always visible */}
              <Select>
                <SelectTrigger className={`w-28 sm:w-32 transition-all duration-500 [&>svg]:text-current ${isScrolled ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300' : 'bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30'}`}>
                  <SelectValue placeholder="All India" defaultValue="all-india" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all-india">All India</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                </SelectContent>
              </Select>

              {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-5">
  <MegaMenu isScrolled={isScrolled} />
  
  
  
  <a href="#" className={`hover:opacity-80 transition-colors duration-500 text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
    For Owners
  </a>
  
  <a href="#" className={`hover:opacity-80 transition-colors duration-500 text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
    For Dealers / Builders
  </a>
  
  <button onClick={handleLegalServicesClick} className={`hover:opacity-80 transition-colors duration-500 text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
    Legal Services
  </button>

  <a href="/handover-services" className={`hover:opacity-80 transition-colors duration-500 text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
    Handover Services
  </a>

  <a href="/property-management" className={`hover:opacity-80 transition-colors duration-500 text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
    Property Management
  </a>
            </nav>

            </div>

            {/* Right section - Auth, Post Property and Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Auth Buttons - Desktop only */}
              <div className="hidden lg:flex items-center space-x-2">
                
              </div>

              {/* Post Property Button - Responsive sizing */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePostPropertyClick}
                className={`font-medium px-2 sm:px-4 py-2 text-xs sm:text-sm transition-all duration-500 ${isScrolled ? 'bg-white text-brand-red border-gray-300 hover:bg-gray-50' : 'bg-white text-brand-red border-white/50 hover:bg-white/90'}`}
              >
                <span className="hidden sm:inline">Post property</span>
                <span className="sm:hidden">Post</span>
                <span className="ml-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">Free</span>
              </Button>

              {/* Help and Settings Icons - Desktop only */}
              <div className="hidden lg:flex items-center space-x-2">
                <Button variant="ghost" size="sm" className={`p-2 transition-colors duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:text-white/80 hover:bg-white/10'}`}>
                  <HelpCircle size={18} />
                </Button>
                
              </div>

              {/* Sidebar toggle button - Always visible */}
              <Button variant="ghost" size="sm" className={`p-2 transition-colors duration-500 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`} onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Legal Services Form */}
      <LegalServicesForm isOpen={isLegalFormOpen} onClose={() => setIsLegalFormOpen(false)} />
    </>;
};
export default Header;