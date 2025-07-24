
import { useState } from 'react';
import { X, ChevronDown, User, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import LegalServicesForm from './LegalServicesForm';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isLegalFormOpen, setIsLegalFormOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleLegalServicesClick = () => {
    setIsLegalFormOpen(true);
    onClose(); // Close sidebar when opening form
  };

  const handleContactUsClick = () => {
    navigate('/contact-us');
    onClose(); // Close sidebar when navigating
  };

  const menuItems = [
    { id: 'post-property', label: 'Post Your Property', hasSubmenu: false },
    { id: 'rental-agreement', label: 'Rental Agreement', hasSubmenu: false },
    { id: 'legal-services', label: 'Legal Services', hasSubmenu: false, onClick: handleLegalServicesClick },
    { id: 'painting-cleaning', label: 'Painting & Cleaning', hasSubmenu: false },
    { id: 'packers-movers', label: 'Packers and Movers', hasSubmenu: false },
    { id: 'refer-earn', label: 'Refer & Earn', hasSubmenu: false },
    { id: 'rent-receipts', label: 'Rent Receipts', hasSubmenu: false },
    { id: 'tenant-plans', label: 'Tenant Plans', hasSubmenu: false },
    { id: 'owner-plans', label: 'Owner Plans', hasSubmenu: false },
    { id: 'buyer-plans', label: 'Buyer Plans', hasSubmenu: false },
    { id: 'seller-plans', label: 'Seller Plans', hasSubmenu: false },
    { 
      id: 'commercial-plans', 
      label: 'Commercial Plans', 
      hasSubmenu: true,
      submenu: ['Office Space', 'Retail Space', 'Warehouse']
    },
    { id: 'careers', label: 'Careers', hasSubmenu: false },
    { id: 'corporate-enquiry', label: 'Corporate Enquiry', hasSubmenu: false },
    { id: 'blog', label: 'Blog', hasSubmenu: false },
    { id: 'testimonials', label: 'Testimonials', hasSubmenu: false, onClick: () => { navigate('/testimonials'); onClose(); } },
    { id: 'grievance-redressal', label: 'Grievance Redressal', hasSubmenu: false, onClick: () => { navigate('/grievance-redressal'); onClose(); } },
    { id: 'nobroker-support', label: 'NoBroker Support', hasSubmenu: false },
    { 
      id: 'contact-us', 
      label: 'Contact Us', 
      hasSubmenu: true,
      submenu: [
        { label: 'Customer Support', onClick: handleContactUsClick },
        { label: 'Sales Enquiry', onClick: handleContactUsClick },
        { label: 'Partnership', onClick: handleContactUsClick }
      ]
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/76edf36e-5a4c-4707-b169-fb70fe75880c.png" 
                alt="Home HNI Logo" 
                className="h-8 w-auto"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          {/* Auth Buttons */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col space-y-2">
              <Button className="w-full bg-brand-red hover:bg-brand-maroon-dark text-white">
                <UserPlus size={16} className="mr-2" />
                Sign Up
              </Button>
              <Button variant="outline" className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white">
                <LogIn size={16} className="mr-2" />
                Login
              </Button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto border-t border-gray-200">
            <nav className="p-2">
              {menuItems.map((item) => (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={item.onClick || (item.hasSubmenu ? () => toggleSection(item.id) : undefined)}
                    className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronDown 
                        size={16} 
                        className={`transform transition-transform ${
                          expandedSections.includes(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  
                  {item.hasSubmenu && item.submenu && expandedSections.includes(item.id) && (
                    <div className="ml-4 mt-1">
                      {item.submenu.map((subItem) => (
                        <button
                          key={typeof subItem === 'string' ? subItem : subItem.label}
                          onClick={typeof subItem === 'string' ? undefined : subItem.onClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors"
                        >
                          {typeof subItem === 'string' ? subItem : subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Legal Services Form */}
      <LegalServicesForm 
        isOpen={isLegalFormOpen} 
        onClose={() => setIsLegalFormOpen(false)} 
      />
    </>
  );
};

export default Sidebar;
