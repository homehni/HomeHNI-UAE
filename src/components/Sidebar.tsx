import { useState, useRef } from 'react';
import { X, ChevronDown, User, UserPlus, LogIn, LogOut, Settings, Shield, Mail, Phone, MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import LegalServicesForm from './LegalServicesForm';
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
const Sidebar = ({
  isOpen,
  onClose
}: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isLegalFormOpen, setIsLegalFormOpen] = useState(false);
  const contactUsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  const {
    isAdmin,
    loading: adminLoading
  } = useAdminAuth();
  const {
    toast
  } = useToast();
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const isExpanding = !prev.includes(section);
      const newSections = isExpanding ? [...prev, section] : prev.filter(s => s !== section);
      
      // Scroll to contact us section after state update
      if (isExpanding && section === 'contact-us') {
        setTimeout(() => {
          contactUsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
      
      return newSections;
    });
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
  const handleAdminLoginClick = () => {
    navigate('/admin/auth');
    onClose();
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
      onClose();
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Please try again.",
        variant: "destructive"
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
  const menuItems = [{
    id: 'post-property',
    label: 'Post Your Property',
    hasSubmenu: false,
    onClick: handlePostPropertyClick
  }, {
    id: 'find-your-plan',
    label: 'Find Your Plan',
    hasSubmenu: false,
    onClick: () => {
      navigate('/plans');
      onClose();
    }
  },
  // { id: 'rental-agreement', label: 'Rental Agreement', hasSubmenu: false, onClick: () => { navigate('/rental-agreement'); onClose(); } },
  {
    id: 'legal-services',
    label: 'Legal Services',
    hasSubmenu: false,
    onClick: () => {
      navigate('/services?tab=legal-services');
      onClose();
    }
  }, {
    id: 'handover-services',
    label: 'Handover Services',
    hasSubmenu: false,
    onClick: () => {
      navigate('/services?tab=handover-services');
      onClose();
    }
  }, {
    id: 'property-management',
    label: 'Property Management',
    hasSubmenu: false,
    onClick: () => {
      navigate('/services?tab=property-management');
      onClose();
    }
  }, {
    id: 'painting-cleaning',
    label: 'Painting & Cleaning',
    hasSubmenu: false,
    onClick: () => {
      navigate('/services?tab=painting-cleaning');
      onClose();
    }
  }, {
    id: 'packers-movers',
    label: 'Packers and Movers',
    hasSubmenu: false,
    onClick: () => {
      navigate('/services?tab=packers-movers');
      onClose();
    }
  },
  // { id: 'refer-earn', label: 'Refer & Earn', hasSubmenu: false, onClick: () => { navigate('/refer-earn'); onClose(); } },
  // { id: 'rent-receipts', label: 'Rent Receipts', hasSubmenu: false, onClick: () => { navigate('/rent-receipts'); onClose(); } },
  // {
  //   id: 'owner-plans',
  //   label: 'Property Renting Owner Plans',
  //   hasSubmenu: false,
  //   onClick: () => {
  //     navigate('/plans?tab=owner');
  //     onClose();
  //   }
  // },
  // {
  //   id: 'buyer-plans',
  //   label: 'Property Buyer Plans',
  //   hasSubmenu: false,
  //   onClick: () => {
  //     navigate('/plans?tab=buyer');
  //     onClose();
  //   }
  // },
  // {
  //   id: 'seller-plans',
  //   label: 'Property Seller Plans',
  //   hasSubmenu: false,
  //   onClick: () => {
  //     navigate('/plans?tab=seller');
  //     onClose();
  //   }
  // },
  {
    id: 'builder-dealer-plans',
    label: 'Builder Dealer Plans',
    hasSubmenu: false,
    onClick: () => {
      navigate('/builder-dealer-plans');
      onClose();
    }
  }, {
    id: 'students',
    label: 'Students',
    hasSubmenu: false,
    onClick: () => {
      navigate('/students');
      onClose();
    }
  }, {
    id: 'about',
    label: 'About',
    hasSubmenu: false,
    onClick: () => {
      navigate('/about');
      onClose();
    }
  },
  // {
  //   id: 'commercial-plans',
  //   label: 'Commercial Plans',
  //   hasSubmenu: true,
  //   submenu: [
  //   // {
  //   //   label: 'Commercial Tenant Plans',
  //   //   onClick: () => {
  //   //     navigate('/commercial-tenant-plans');
  //   //     onClose();
  //   //   }
  //   // },
  //   {
  //     label: 'Corpoarate Commercial Owner Plans',
  //     onClick: () => {
  //       navigate('/plans?tab=commercial-owner');
  //       onClose();
  //     }
  //   }, {
  //     label: 'Corpoarate Commercial Buyer Plans',
  //     onClick: () => {
  //       navigate('/plans?tab=commercial-buyer');
  //       onClose();
  //     }
  //   }, {
  //     label: 'Corpoarate Commercial Seller Plans',
  //     onClick: () => {
  //       navigate('/plans?tab=seller&category=commercial');
  //       onClose();
  //     }
  //   }]
  // },
  {
    id: 'blog',
    label: 'Blog',
    hasSubmenu: false,
    onClick: () => {
      navigate('/blog');
      onClose();
    }
  }, {
    id: 'corporate-enquiry',
    label: 'Corporate Enquiry',
    hasSubmenu: false,
    onClick: () => {
      navigate('/corporate-enquiry');
      onClose();
    }
  }, {
    id: 'grievance-redressal',
    label: 'Grievance Redressal',
    hasSubmenu: false,
    onClick: () => {
      navigate('/grievance-redressal');
      onClose();
    }
  }, {
    id: 'report-problem',
    label: 'Report a Problem',
    hasSubmenu: false,
    onClick: () => {
      navigate('/report-problem');
      onClose();
    }
  }, {
    id: 'contact-us',
    label: 'Contact Us',
    hasSubmenu: true,
    isContactUs: true
  }];
  return <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-transparent z-[60]" onClick={onClose} />}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-[70] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/main-logo-final.png" alt="Home HNI Logo" className="h-8 w-auto" />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

        {/* User Section */}
          <div className="p-4 border-b border-gray-200">
            {user ? <div className="space-y-3">
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
                    {!adminLoading && isAdmin && <p className="text-xs font-medium text-green-600 truncate">
                        Logged in as Admin
                      </p>}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="w-full justify-start border-brand-red text-brand-red hover:bg-brand-red hover:text-white" onClick={() => {
                navigate('/dashboard');
                onClose();
              }}>
                    <Settings size={16} className="mr-2" />
                    Dashboard
                  </Button>
                  {!adminLoading && isAdmin && <Button variant="outline" className="w-full justify-start border-green-600 text-green-600 hover:bg-green-600 hover:text-white" onClick={() => {
                navigate('/admin');
                onClose();
              }}>
                      <Shield size={16} className="mr-2" />
                      Admin Dashboard
                    </Button>}
                  <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-800" onClick={handleSignOut}>
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div> : <div className="flex flex-col space-y-2">
                <Button className="w-full bg-brand-red hover:bg-brand-maroon-dark text-white" onClick={handleAuthClick}>
                  <UserPlus size={16} className="mr-2" />
                  Sign Up
                </Button>
                <Button variant="outline" className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white" onClick={handleAuthClick}>
                  <LogIn size={16} className="mr-2" />
                  Login
                </Button>
                {/* <Button 
                  variant="outline" 
                  className="w-full border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                  onClick={handleAdminLoginClick}
                 >
                  <Shield size={16} className="mr-2" />
                  Admin Login
                 </Button> */}
              </div>}
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto border-t border-gray-200">
            <nav className="p-2">
            {menuItems.map(item => <div key={item.id} className="mb-1" ref={item.id === 'contact-us' ? contactUsRef : null}>
                  <button onClick={item.onClick || (item.hasSubmenu ? () => toggleSection(item.id) : undefined)} className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg flex items-center justify-between transition-colors">
                    <div className="flex items-center">
                      {item.id === 'find-your-plan' && <Search size={16} className="mr-2 text-brand-red" />}
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.hasSubmenu && <ChevronDown size={16} className={`transform transition-transform ${expandedSections.includes(item.id) ? 'rotate-180' : ''}`} />}
                  </button>
                  
                  {item.hasSubmenu && expandedSections.includes(item.id) && <div className="ml-4 mt-1">
                      {item.isContactUs ? <div className="flex flex-col space-y-2 p-3">
                          {/* Email Section */}
                          <div className="text-left">
                            <div className="text-xs font-medium text-gray-600 mb-0.5">Email</div>
                            <a href="mailto:homehni8@gmail.com" className="text-xs text-gray-800 hover:text-brand-red transition-colors" title="Send Email">
                              homehni8@gmail.com
                            </a>
                          </div>
                          
                          {/* Phone Section */}
                          <div className="text-left">
                            <div className="text-xs font-medium text-gray-600 mb-0.5">Phone</div>
                            <a href="tel:+918074017388" className="text-xs text-gray-800 hover:text-brand-red transition-colors" title="Call Us">+91 80740 17388</a>
                          </div>
                          
                          {/* WhatsApp Section */}
                          <div className="text-left">
                            <div className="text-xs font-medium text-gray-600 mb-1">WhatsApp</div>
                            <a href="https://wa.me/8074017388?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20services" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-green-500 transition-all" title="WhatsApp">
                              <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.512z" />
                              </svg>
                            </a>
                          </div>
                        </div> : (item as any).submenu?.map((subItem: any) => <button key={typeof subItem === 'string' ? subItem : subItem.label} onClick={typeof subItem === 'string' ? undefined : subItem.onClick} className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors">
                            {typeof subItem === 'string' ? subItem : subItem.label}
                          </button>)}
                    </div>}
                </div>)}
            </nav>
          </div>
        </div>
      </div>

      {/* Legal Services Form */}
      <LegalServicesForm isOpen={isLegalFormOpen} onClose={() => setIsLegalFormOpen(false)} />
    </>;
};
export default Sidebar;