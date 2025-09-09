import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
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
  { id: 'overview', label: 'All Services' },
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
  const [active, setActive] = useState<string>('overview');

  useEffect(() => {
    document.title = 'Services – Loans, Security, Legal, Property Management & More';
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    console.log('Services URL tab parameter:', tab); // Debug log
    if (tab && sections.some((s) => s.id === tab)) {
      console.log('Setting active service tab to:', tab); // Debug log
      setActive(tab);
    } else {
      console.log('No valid tab found, staying with:', active); // Debug log
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTabClick = (id: string) => {
    setActive(id);
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
            className={`w-full text-left px-3 py-2 mb-1 rounded-md transition-colors text-sm ${
              isActive
                ? 'bg-secondary text-secondary-foreground font-medium shadow-sm'
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {label}
          </button>
        );
      },
    [active]
  );

  const ServiceLink = ({ label, desc, to }: { label: string; desc: string; to: string }) => (
    <div className="group p-4 border rounded-lg bg-card hover:shadow-lg hover:border-brand-red/20 transition-all duration-300 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-semibold text-base text-foreground group-hover:text-brand-red transition-colors duration-300">{label}</p>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
        </div>
        <Link 
          to={to} 
          className="ml-3 flex items-center gap-2 px-3 py-1.5 bg-brand-red text-white text-sm font-medium rounded-lg hover:bg-brand-red-dark hover:shadow-md transition-all duration-300 group-hover:scale-105" 
          onClick={(e) => {
            e.preventDefault();
            window.location.href = to;
          }}
        >
          <span>Open</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />

      <main className="pt-24">
        <div className="container mx-auto px-4 pt-12 pb-10">
          <div className="card-border-red hover-lift bg-background shadow-sm">
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-12 gap-0">
              <aside className="border-r border-border bg-muted/30 md:col-span-3 lg:col-span-2">
                <nav aria-label="Services sections" className="p-4">
                  {sections.map((s) => (
                    <NavItem key={s.id} id={s.id} label={s.label} />
                  ))}
                </nav>
              </aside>

              <section className="md:col-span-9 lg:col-span-10 p-0">
                {active === 'overview' && (
                  <div className="p-6">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
                      <p className="text-gray-600 mb-6">
                        Comprehensive real estate services to meet all your property needs. From loans and security to legal services and property management.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <ServiceLink 
                        label="Loans" 
                        desc="Home loans, personal loans, and financial assistance" 
                        to="/loans" 
                      />
                      <ServiceLink 
                        label="Home Security Services" 
                        desc="Professional security solutions for your property" 
                        to="/home-security-services" 
                      />
                      <ServiceLink 
                        label="Packers & Movers" 
                        desc="Reliable moving and packing services" 
                        to="/packers-movers" 
                      />
                      <ServiceLink 
                        label="Legal Services" 
                        desc="Property legal documentation and consultation" 
                        to="/legal-services" 
                      />
                      <ServiceLink 
                        label="Handover Services" 
                        desc="Smooth property handover and possession services" 
                        to="/handover-services" 
                      />
                      <ServiceLink 
                        label="Property Management" 
                        desc="Complete property management solutions" 
                        to="/property-management" 
                      />
                      <ServiceLink 
                        label="Architects" 
                        desc="Professional architectural design services" 
                        to="/architects" 
                      />
                      <ServiceLink 
                        label="Painting & Cleaning" 
                        desc="Interior and exterior painting and cleaning" 
                        to="/painting-cleaning" 
                      />
                      <ServiceLink 
                        label="Interior Designers" 
                        desc="Creative interior design and decoration" 
                        to="/interior" 
                      />
                    </div>
                  </div>
                )}

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
        image.png      </main>

      <Footer />
    </div>
  );
};

export default Services;
