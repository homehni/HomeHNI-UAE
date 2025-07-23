
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import MegaMenu from './MegaMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAboutUsClick = () => {
    if (location.pathname === '/about-us') {
      // If already on About Us page, scroll to top
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Navigate to About Us page
      navigate('/about-us');
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-10 left-0 right-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-brand-red transition-colors"
              >
                <span>Property</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isMegaMenuOpen && (
                <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />
              )}
            </div>
            <button
              onClick={handleAboutUsClick}
              className="text-gray-700 hover:text-brand-red transition-colors"
            >
              About Us
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-4">
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="flex items-center justify-between w-full text-gray-700 hover:text-brand-red transition-colors"
              >
                <span>Property</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isMegaMenuOpen && (
                <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />
              )}
              <button
                onClick={handleAboutUsClick}
                className="block w-full text-left text-gray-700 hover:text-brand-red transition-colors"
              >
                About Us
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
