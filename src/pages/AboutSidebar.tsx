import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const sections = [
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Additional Services' },
  { id: 'owners', label: 'Owners' },
  { id: 'whatsapp', label: 'Listing Using WhatsApp' },
  { id: 'tenants', label: 'Tenants' },
  { id: 'team', label: 'Team' },
  { id: 'faq', label: 'FAQ' },
  { id: 'blog', label: 'Our Blog' },
  { id: 'contact', label: 'Contact Us' }
];

const AboutSidebar = () => {
  const [active, setActive] = useState<string>('about');
  const observers = useRef<Record<string, IntersectionObserver | null>>({});

  // SEO basics
  useEffect(() => {
    document.title = 'About HomeHNI – Company, Services, Team';

    const desc = 'Learn about HomeHNI: our mission, services, team, FAQs and contact – all in one page with quick sidebar navigation.';
    const existing = document.querySelector('meta[name="description"]');
    if (existing) existing.setAttribute('content', desc);
    else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = desc;
      document.head.appendChild(meta);
    }
    // canonical
    const linkRel = 'link[rel="canonical"]';
    const existingCanonical = document.querySelector(linkRel) as HTMLLinkElement | null;
    const href = `${window.location.origin}/about`;
    if (existingCanonical) existingCanonical.href = href;
    else {
      const l = document.createElement('link');
      l.rel = 'canonical';
      l.href = href;
      document.head.appendChild(l);
    }

    // Initialize active tab from query parameter (?tab=)
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && sections.some((s) => s.id === tab)) {
      setActive(tab);
    }
  }, []);

  useEffect(() => {
    // Smooth scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Show only the selected section; scroll to top when it changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [active]);

  const onNavClick = (id: string) => {
    setActive(id);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', id);
    url.hash = '';
    window.history.pushState(null, '', url.toString());
  };

  const NavItem = useMemo(
    () =>
      function NavItem({ id, label }: { id: string; label: string }) {
        const isActive = active === id;
        return (
          <button
            onClick={() => onNavClick(id)}
            className={`w-full text-left px-3 py-2 mb-1 rounded-md transition-colors text-sm ${
              isActive
                ? 'bg-gray-800 text-white font-medium'
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

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />

      <main className="pt-24">
        <div className="container mx-auto px-4 pt-12 pb-10">
          {/* Border container wrapper */}
          <div className="border border-gray-300 rounded-lg bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Sidebar */}
              <aside className="md:col-span-3 lg:col-span-2 border-r border-gray-300 bg-gray-50">
                <nav aria-label="About page sections" className="p-4">
                  {sections.map((s) => (
                    <NavItem key={s.id} id={s.id} label={s.label} />
                  ))}
                </nav>
              </aside>

              {/* Content */}
              <section className="md:col-span-9 lg:col-span-10 p-6">
              {active === 'about' && (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">About Us</h1>
                  
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="font-medium text-base">Welcome to Home HNI!</p>
                    
                    <p className="text-sm">
                      Home HNI is a premium real-estate platform designed exclusively for High Net-Worth Individuals (HNIs) to discover, buy, and sell luxury properties with complete privacy, trust, and transparency.
                    </p>
                    
                    <p className="text-sm">
                      We started Home HNI because we believe that buying or selling high-value real estate should be seamless, discreet, and free from the hassles of traditional property hunting. In today's market, most luxury transactions still depend heavily on scattered contacts, unverified leads, and middlemen who often add unnecessary delays and costs. We are here to change that by providing a secure, invitation-only platform where verified buyers and sellers can connect directly.
                    </p>
                    
                    <p className="font-medium text-sm">We have done 2 things to help you find that perfect home:</p>
                    
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <span className="text-gray-600 mr-3 mt-1">•</span>
                        <span><strong>Firstly,</strong> we have painstakingly verified each listing and made sure that these are direct owners or shared accommodation parties and there are no middlemen or brokers. We use lot of heuristics and techniques to ensure that you get a totally broker free list.</span>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="text-gray-600 mr-3 mt-1">•</span>
                        <span><strong>Secondly,</strong> we have also tried to ensure that maximum information is available to you in as easy to use format. This ensures that you get a very good idea of the property even before you visit it. Thus, you can shortlist flats sitting at the comfort of your home without actually traveling all the good and bad properties. This saves your time and effort and with a quick shortlist of 4-5 properties you can actually get a house in few hours!</span>
                      </li>
                    </ul>
                    
                    <p className="text-sm">
                      If you are a landlord interested in posting your apartments to Home HNI, please email us at <a href="mailto:contact@homehni.com" className="text-blue-600 hover:underline">contact@homehni.com</a> and we will get in touch to help you list the property.
                    </p>
                    
                    <p className="text-sm pb-8">
                      And tenants, happy hunting and get in touch with us to let us know how else we can help!
                    </p>
                  </div>
                </>
              )}

              {active === 'services' && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Additional Services</h1>
                  <hr className="my-4" />
                  <p className="text-gray-700 mb-4">
                    Explore handpicked services including Legal Assistance, Property Management, Handover
                    Services, Loans, Architecture and Interior Design. Each service is delivered by vetted
                    partners with clear pricing and SLAs.
                  </p>
                </>
              )}

              {active === 'owners' && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Owners</h1>
                  <hr className="my-4" />
                  <p className="text-gray-700 mb-4">
                    List your property with high-quality visibility, lead tracking, and smart marketing.
                    Our verified processes help you attract serious buyers and tenants faster.
                  </p>
                </>
              )}

              {active === 'whatsapp' && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Listing Using WhatsApp</h1>
                  <hr className="my-4" />
                  <p className="text-gray-700 mb-4">
                    Share property details and photos directly on WhatsApp; our team will structure and
                    publish the listing for you after verification.
                  </p>
                </>
              )}

              {active === 'tenants' && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Tenants</h1>
                  <hr className="my-4" />
                  <p className="text-gray-700 mb-4">
                    Get curated options based on budget and locality preferences. Virtual tours and
                    detailed property insights save you time and site visits.
                  </p>
                </>
              )}

              {active === 'team' && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Team</h1>
                  <hr className="my-4" />
                  <p className="text-gray-700 mb-4">
                    Our multidisciplinary team brings deep experience in real estate, legal, and technology –
                    all focused on improving your experience.
                  </p>
                </>
              )}

              {active === 'faq' && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">FAQ</h1>
                  <hr className="my-4" />
                  <p className="text-gray-700 mb-4">
                    Have questions? Visit our FAQ page for quick answers on listing, verification,
                    payments, and safety.
                  </p>
                </>
              )}

              {active === 'blog' && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Blog</h1>
                  <hr className="my-4" />
                  <p className="text-gray-700 mb-4">
                    Insights, market trends, and homeowner tips to help you make informed decisions.
                  </p>
                </>
              )}

              {active === 'contact' && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
                  <hr className="my-4" />
                  <p className="text-gray-700 mb-4">
                    Need help? Reach out via our Contact page – we typically respond within one business
                    day.
                  </p>
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

export default AboutSidebar;