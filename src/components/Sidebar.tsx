
import { useState } from 'react';
import { X, ChevronDown, User, UserPlus, LogIn, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LegalServicesForm from './LegalServicesForm';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isLegalFormOpen, setIsLegalFormOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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

  const handleAuthClick = () => {
    navigate('/auth');
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePostPropertyClick = () => {
    if (user) {
      navigate('/post-property');
    } else {
      navigate('/auth?redirectTo=/post-property');
    }
    onClose();
  };

  const menuItems = [
    { id: 'post-property', label: 'Post Your Property', hasSubmenu: false, onClick: handlePostPropertyClick },
    // { id: 'rental-agreement', label: 'Rental Agreement', hasSubmenu: false, onClick: () => { navigate('/rental-agreement'); onClose(); } },
    { id: 'legal-services', label: 'Legal Services', hasSubmenu: false, onClick: () => { navigate('/legal-services'); onClose(); } },
    { id: 'handover-services', label: 'Handover Services', hasSubmenu: false, onClick: () => { navigate('/handover-services'); onClose(); } },
    { id: 'property-management', label: 'Property Management', hasSubmenu: false, onClick: () => { navigate('/property-management'); onClose(); } },
    { id: 'painting-cleaning', label: 'Painting & Cleaning', hasSubmenu: false, onClick: () => { navigate('/painting-cleaning'); onClose(); } },
    { id: 'packers-movers', label: 'Packers and Movers', hasSubmenu: false, onClick: () => { navigate('/packers-movers'); onClose(); } },
    // { id: 'refer-earn', label: 'Refer & Earn', hasSubmenu: false, onClick: () => { navigate('/refer-earn'); onClose(); } },
    // { id: 'rent-receipts', label: 'Rent Receipts', hasSubmenu: false, onClick: () => { navigate('/rent-receipts'); onClose(); } },
    { id: 'owner-plans', label: 'Owner Plans', hasSubmenu: false, onClick: () => { navigate('/owner-plans'); onClose(); } },
    { id: 'buyer-plans', label: 'Buyer Plans', hasSubmenu: false, onClick: () => { navigate('/buyer-plans'); onClose(); } },
    { id: 'seller-plans', label: 'Seller Plans', hasSubmenu: false, onClick: () => { navigate('/seller-plans'); onClose(); } },
    { id: 'about', label: 'About', hasSubmenu: false, onClick: () => { navigate('/about'); onClose(); } },
    {
  id: 'commercial-plans',
  label: 'Commercial Plans',
  hasSubmenu: true,
  submenu: [
    // {
    //   label: 'Commercial Tenant Plans',
    //   onClick: () => {
    //     navigate('/commercial-tenant-plans');
    //     onClose();
    //   }
    // },
    {
      label: 'Commercial Owner Plans',
      onClick: () => {
        navigate('/commercial-owner-plans');
        onClose();
      }
    },
    {
      label: 'Commercial Buyer Plans',
      onClick: () => {
        navigate('/commercial-buyer-plan');
        onClose();
      }
    },
    {
      label: 'Commercial Seller Plans',
      onClick: () => {
        navigate('/commercial-seller-plans');
        onClose();
      }
    }
  ]
}
,
    { id: 'careers', label: 'Careers', hasSubmenu: false, onClick: () => { navigate('/careers'); onClose(); } },
    { id: 'corporate-enquiry', label: 'Corporate Enquiry', hasSubmenu: false, onClick: () => { navigate('/corporate-enquiry'); onClose(); } },
    { id: 'grievance-redressal', label: 'Grievance Redressal', hasSubmenu: false, onClick: () => { navigate('/grievance-redressal'); onClose(); } },
    { id: 'report-problem', label: 'Report a Problem', hasSubmenu: false, onClick: () => { navigate('/report-problem'); onClose(); } },
    
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
          className="fixed inset-0 bg-transparent z-[60]"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-[70] transform transition-transform duration-300 ${
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

          {/* User Section */}
          <div className="p-4 border-b border-gray-200">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                    <AvatarFallback className="bg-brand-red text-white">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                    onClick={() => { navigate('/dashboard'); onClose(); }}
                  >
                    <Settings size={16} className="mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-600 hover:text-gray-800"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button 
                  className="w-full bg-brand-red hover:bg-brand-maroon-dark text-white"
                  onClick={handleAuthClick}
                >
                  <UserPlus size={16} className="mr-2" />
                  Sign Up
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                  onClick={handleAuthClick}
                >
                  <LogIn size={16} className="mr-2" />
                  Login
                </Button>
              </div>
            )}
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
