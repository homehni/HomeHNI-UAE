import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import ChatBot from '@/components/ChatBot';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import BuyerPlans from './BuyerPlans';
import SellerPlans from './SellerPlans';
import CommercialBuyerPlan from './CommercialBuyerPlan';
import BuilderLifetimePlans from './BuilderLifetimePlans';
import AgentPlans from './AgentPlans';
import RentalPlans from './RentalPlans';
import PlanWizard from '@/components/PlanWizard';

const sections = [
  { id: 'buyer', label: 'Buyer Plans' },
  { id: 'seller', label: 'Seller Plans' },
  { id: 'rental', label: 'Rental Plans' },
  { id: 'commercial-buyer', label: 'Commercial Buyer Plans' },
  { id: 'builder-lifetime', label: 'Builder Lifetime Plans' },
  { id: 'agent', label: 'Agent Plans' },
];

const Plans = () => {
  const [active, setActive] = useState<string>('buyer');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Initialize showWizard based on URL parameter
  const [showWizard, setShowWizard] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const skipWizard = params.get('skipWizard');
    return skipWizard !== 'true'; // Only show wizard if skipWizard is NOT true
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const skipWizard = params.get('skipWizard');

    // Only show wizard if explicitly navigated from "Find Your Plan" button
    setShowWizard(skipWizard !== 'true' && tab === null);

    if (tab && sections.some((s) => s.id === tab)) {
      setActive(tab);
    } else {
      setActive('buyer');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.search]); // Listen to search parameter changes

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

  const PlanLink = ({ to, label, desc }: { to: string; label: string; desc: string }) => (
    <div className="group p-3 md:p-4 border rounded-lg bg-card hover:shadow-lg hover:border-brand-red/20 transition-all duration-300 cursor-pointer">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold text-sm md:text-base text-foreground group-hover:text-brand-red transition-colors duration-300">{label}</p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
        </div>
        <Link 
          to={to} 
          className="flex items-center justify-center gap-2 px-3 py-2 bg-brand-red text-white text-xs md:text-sm font-medium rounded-lg hover:bg-brand-red-dark hover:shadow-md transition-all duration-300 group-hover:scale-105 w-full sm:w-auto" 
          onClick={(e) => {
            e.preventDefault();
            window.location.href = to;
          }}
        >
          <span>Open</span>
          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Property Plans - Buyer, Seller, Rental & Commercial Plans | HomeHNI</title>
        <meta name="description" content="Choose from buyer plans, seller plans, rental plans, commercial plans, builder plans & agent plans. Zero brokerage property solutions for all your real estate needs in India." />
        <meta name="keywords" content="property plans, buyer plans, seller plans, rental plans, commercial property plans, builder plans, agent plans, zero brokerage, property subscription plans" />
        <meta property="og:title" content="Property Plans - Buyer, Seller, Rental & Commercial Plans | HomeHNI" />
        <meta property="og:description" content="Choose from buyer plans, seller plans, rental plans, commercial plans, builder plans & agent plans. Zero brokerage property solutions." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/plans`} />
      </Helmet>
      
      {/* Plan Recommendation Wizard - overlaid, non-disruptive */}
      {/* Only render the wizard if showWizard is true */}
      {showWizard && <PlanWizard open={showWizard} onOpenChange={setShowWizard} />}
      <Marquee />
      <Header />

      <main className="pt-24">
        <div className="container mx-auto px-4 pt-6 md:pt-12 pb-10">
          <div className="card-border-red hover-lift bg-background shadow-sm">
            {/* Mobile Header with Menu Button */}
            <div className="md:hidden p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-foreground">Plans</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Toggle plans menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-b border-border bg-muted/30">
                <nav aria-label="Plans sections" className="p-4">
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
                <nav aria-label="Plans sections" className="p-4">
                  <h2 className="text-lg font-semibold text-foreground mb-4 px-3">Plans</h2>
                  <div className="space-y-1">
                    {sections.map((s) => (
                      <NavItem key={s.id} id={s.id} label={s.label} />
                    ))}
                  </div>
                </nav>
              </aside>

              <section className="min-h-[600px] p-0">
                {active === 'buyer' && (
                  <>
                    
                    <BuyerPlans embedded />
                  </>
                )}

                {active === 'seller' && (
                  <>
                    
                    <SellerPlans embedded />
                  </>
                )}

                {active === 'rental' && (
                  <>
                    
                    <RentalPlans embedded />
                  </>
                )}

                {active === 'commercial-buyer' && (
                  <>
                    
                    <CommercialBuyerPlan />
                  </>
                )}

                {active === 'builder-lifetime' && (
                  <>
                    
                    <BuilderLifetimePlans />
                  </>
                )}

                {active === 'agent' && (
                  <>
                    
                    <AgentPlans />
                  </>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Plans;


