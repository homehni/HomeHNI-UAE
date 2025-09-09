import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Link } from 'react-router-dom';
import BuyerPlans from './BuyerPlans';
import SellerPlans from './SellerPlans';
import OwnerPlans from './OwnerPlans';
import CommercialBuyerPlan from './CommercialBuyerPlan';
import CommercialSellerPlans from './CommercialSellerPlans';
import CommercialOwnerPlans from './CommercialOwnerPlans';
import BuilderLifetimePlans from './BuilderLifetimePlans';
import AgentPlans from './AgentPlans';

const sections = [
  { id: 'overview', label: 'All Plans' },
  { id: 'buyer', label: 'Buyer Plans' },
  { id: 'seller', label: 'Seller Plans' },
  { id: 'owner', label: 'Owner Plans' },
  { id: 'commercial-buyer', label: 'Commercial Buyer Plans' },
  { id: 'commercial-seller', label: 'Commercial Seller Plans' },
  { id: 'commercial-owner', label: 'Commercial Owner Plans' },
  { id: 'builder-lifetime', label: 'Builder Lifetime Plans' },
  { id: 'agent', label: 'Agent Plans' },
];

const Plans = () => {
  const [active, setActive] = useState<string>('overview');

  useEffect(() => {
    document.title = 'Plans – Buyer, Seller, Owner and Commercial Plans';
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && sections.some((s) => s.id === tab)) setActive(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const url = new URL(window.location.href);
    url.searchParams.set('tab', active);
    window.history.pushState(null, '', url.toString());
  }, [active]);

  const NavItem = useMemo(
    () =>
      function NavItem({ id, label }: { id: string; label: string }) {
        const isActive = active === id;
        return (
          <button
            onClick={() => setActive(id)}
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

  const PlanLink = ({ to, label, desc }: { to: string; label: string; desc: string }) => (
    <div className="p-4 border rounded-md bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">{desc}</p>
        </div>
        <Link to={to} className="text-brand-red underline text-sm" onClick={(e) => {
          e.preventDefault();
          window.location.href = to;
        }}>Open</Link>
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
                <nav aria-label="Plans sections" className="p-4">
                  {sections.map((s) => (
                    <NavItem key={s.id} id={s.id} label={s.label} />
                  ))}
                </nav>
              </aside>

              <section className="md:col-span-9 lg:col-span-10 p-6">
                {active === 'overview' && (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground border-b border-border pb-3 mb-6">All Plans</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <PlanLink to="/buyer-plans" label="Buyer Plans" desc="Residential, Commercial, Industrial, Agricultural" />
                      <PlanLink to="/seller-plans" label="Seller Plans" desc="Residential, Commercial, Industrial, Agricultural" />
                      <PlanLink to="/owner-plans" label="Owner Plans" desc="Residential, Commercial, Industrial, Agricultural" />
                      <PlanLink to="/commercial-buyer-plan" label="Commercial Buyer Plans" desc="For business/office buyers" />
                      <PlanLink to="/commercial-seller-plans" label="Commercial Seller Plans" desc="For commercial sellers" />
                      <PlanLink to="/commercial-owner-plans" label="Commercial Owner Plans" desc="Find tenants for your commercial property" />
                      <PlanLink to="/builder-lifetime-plans" label="Builder Lifetime Plans" desc="Lifetime value plans for builders" />
                      <PlanLink to="/agent-plans" label="Agent Plans" desc="Plans for channel partners/agents" />
                    </div>
                  </>
                )}

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

                {active === 'owner' && (
                  <>
                    
                    <OwnerPlans embedded />
                  </>
                )}

                {active === 'commercial-buyer' && (
                  <>
                    
                    <CommercialBuyerPlan />
                  </>
                )}

                {active === 'commercial-seller' && (
                  <>
                    
                    <CommercialSellerPlans />
                  </>
                )}

                {active === 'commercial-owner' && (
                  <>
                    
                    <CommercialOwnerPlans />
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
    </div>
  );
};

export default Plans;


