import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import ChatBot from '@/components/ChatBot';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, ArrowRight, Menu, X } from 'lucide-react';
import LoansEmbedded from './services/LoansEmbedded';
import HomeSecurityEmbedded from './services/HomeSecurityEmbedded';
import PackersMoversEmbedded from './services/PackersMoversEmbedded';
import LegalServicesEmbedded from './services/LegalServicesEmbedded';
import HandoverServicesEmbedded from './services/HandoverServicesEmbedded';
import PropertyManagementEmbedded from './services/PropertyManagementEmbedded';
import ArchitectsEmbedded from './services/ArchitectsEmbedded';
import PaintingCleaningEmbedded from './services/PaintingCleaningEmbedded';
import InteriorDesignersEmbedded from './services/InteriorDesignersEmbedded';

const sections = [
  { id: 'loans', label: 'Loans' },
  { id: 'home-security', label: 'Home Security Services' },
  { id: 'packers-movers', label: 'Packers & Movers' },
  { id: 'legal-services', label: 'Legal Services' },
  { id: 'handover-services', label: 'Handover Services' },
  { id: 'property-management', label: 'Property Management' },
  { id: 'architects', label: 'Architects' },
  { id: 'painting-cleaning', label: 'Painting & Cleaning' },
  { id: 'interior-design', label: 'Interior Designers' },
];

const Services = () => {
  const [active, setActive] = useState<string>('loans');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    console.log('Services URL tab parameter:', tab); // Debug log
    if (tab && sections.some((s) => s.id === tab)) {
      console.log('Setting active service tab to:', tab); // Debug log
      setActive(tab);
    } else {
      console.log('No valid tab found, defaulting to loans'); // Debug log
      setActive('loans');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.search]);

  const handleTabClick = (id: string) => {
    setActive(id);
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
    // Update URL when user manually clicks a tab
    const url = new URL(window.location.href);
    url.searchParams.set('tab', id);
    window.history.pushState(null, '', url.toString());
  };

  const NavItem = useMemo(
    () =>
      function NavItem({ id, label }: { id: string; label: string }) {
        const isActive = active === id;
        return (
          <button
            onClick={() => handleTabClick(id)}
            className={`w-full text-left px-3 py-3 md:py-2 mb-1 rounded-md transition-colors text-sm md:text-sm ${
              isActive
                ? 'bg-secondary text-secondary-foreground font-medium shadow-sm'
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="block truncate">{label}</span>
          </button>
        );
      },
    [active]
  );

  const ServiceLink = ({ label, desc, to }: { label: string; desc: string; to: string }) => (
    <div className="group p-3 md:p-4 border rounded-lg bg-card hover:shadow-md hover:border-brand-red/20 transition-all duration-200 cursor-pointer">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold text-sm md:text-base text-foreground group-hover:text-brand-red transition-colors duration-200">{label}</p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
        </div>
        <Link 
          to={to} 
          className="flex items-center justify-center gap-2 px-3 py-2 bg-brand-red text-white text-xs md:text-sm font-medium rounded-lg hover:bg-brand-red-dark transition-colors duration-200 w-full sm:w-auto" 
          onClick={(e) => {
            e.preventDefault();
            window.location.href = to;
          }}
        >
          <span>Open</span>
          <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
        </Link>
      </div>
    </div>
  );

  const getMetaTags = () => {
    const metaTags: Record<string, { title: string; description: string; keywords: string }> = {
      loans: {
        title: 'Home Loans & Property Financing Services in India | HomeHNI',
        description: 'Get best home loan rates, instant approval & expert guidance for property financing. Compare loans from top banks. Quick processing & minimal documentation.',
        keywords: 'home loans, property loans, home loan rates, mortgage loans, property financing, loan approval, home loan interest rates'
      },
      'home-security': {
        title: 'Home Security Systems & Services in India | HomeHNI',
        description: 'Professional home security solutions including CCTV, smart locks, alarm systems & 24/7 monitoring. Protect your property with trusted security services.',
        keywords: 'home security, CCTV cameras, security systems, alarm systems, smart locks, home surveillance, security monitoring'
      },
      'packers-movers': {
        title: 'Packers & Movers Services - Reliable Home Shifting | HomeHNI',
        description: 'Professional packers & movers for hassle-free home shifting. Safe packing, timely delivery & affordable rates. Trusted relocation services across India.',
        keywords: 'packers movers, home shifting, relocation services, moving services, household shifting, packing services'
      },
      'legal-services': {
        title: 'Property Legal Services - Agreements, Verification & Documentation | HomeHNI',
        description: 'Expert legal services for property including rental agreements, tenant verification, property registration & legal documentation. Hassle-free legal solutions.',
        keywords: 'property legal services, rental agreement, tenant verification, property registration, legal documentation, property lawyers'
      },
      'handover-services': {
        title: 'Property Handover Services - Inspection & Verification | HomeHNI',
        description: 'Professional property handover services including inspection, documentation & verification. Ensure smooth property possession with expert assistance.',
        keywords: 'property handover, property inspection, handover services, property verification, possession services'
      },
      'property-management': {
        title: 'Property Management Services - Rent Collection & Maintenance | HomeHNI',
        description: 'Complete property management solutions including rent collection, tenant management, maintenance & legal compliance. Hassle-free property ownership.',
        keywords: 'property management, rent collection, tenant management, property maintenance, property services'
      },
      architects: {
        title: 'Professional Architects & Architectural Design Services | HomeHNI',
        description: 'Expert architects for residential & commercial projects. Custom architectural design, planning & consultation services. Transform your property vision.',
        keywords: 'architects, architectural design, building design, home design, architectural services, property design'
      },
      'painting-cleaning': {
        title: 'Painting & Cleaning Services for Homes & Properties | HomeHNI',
        description: 'Professional painting & deep cleaning services for residential & commercial properties. Expert painters, quality materials & affordable rates.',
        keywords: 'painting services, cleaning services, home painting, deep cleaning, property cleaning, professional painters'
      },
      'interior-design': {
        title: 'Interior Designers & Home Interior Design Services | HomeHNI',
        description: 'Expert interior designers for residential & commercial spaces. Custom interior design, modular kitchens, furniture & complete home makeovers.',
        keywords: 'interior designers, interior design, home interiors, modular kitchen, furniture design, home decoration'
      }
    };
    return metaTags[active] || metaTags.loans;
  };

  const currentMeta = getMetaTags();

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{currentMeta.title}</title>
        <meta name="description" content={currentMeta.description} />
        <meta name="keywords" content={currentMeta.keywords} />
        <meta property="og:title" content={currentMeta.title} />
        <meta property="og:description" content={currentMeta.description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/services?tab=${active}`} />
      </Helmet>
      
      <Marquee />
      <Header />

      <main className="pt-24">
        <div className="container mx-auto px-4 pt-6 md:pt-12 pb-10">
          <div className="card-border-red relative bg-background shadow-sm">
            {/* Mobile Header with Menu Button */}
            <div className="md:hidden p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-foreground">Services</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Toggle services menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-b border-border bg-muted/30">
                <nav aria-label="Services sections" className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    {sections.map((s) => (
                      <NavItem key={s.id} id={s.id} label={s.label} />
                    ))}
                  </div>
                </nav>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] gap-0">
              {/* Desktop Sidebar */}
              <aside className="hidden md:block border-r border-border bg-muted/30">
                <nav aria-label="Services sections" className="p-4">
                  <h2 className="text-lg font-semibold text-foreground mb-4 px-3">Services</h2>
                  <div className="space-y-1">
                    {sections.map((s) => (
                      <NavItem key={s.id} id={s.id} label={s.label} />
                    ))}
                  </div>
                </nav>
              </aside>

              <section className="min-h-[600px] p-0">
                {active === 'loans' && <LoansEmbedded />}

                {active === 'home-security' && <HomeSecurityEmbedded />}

                {active === 'packers-movers' && <PackersMoversEmbedded />}

                {active === 'legal-services' && <LegalServicesEmbedded />}

                {active === 'handover-services' && <HandoverServicesEmbedded />}

                {active === 'property-management' && <PropertyManagementEmbedded />}

                {active === 'architects' && <ArchitectsEmbedded />}

                {active === 'painting-cleaning' && <PaintingCleaningEmbedded />}

                {active === 'interior-design' && <InteriorDesignersEmbedded />}
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Floating ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Services;
