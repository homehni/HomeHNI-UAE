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

  // Sync active section with URL hash
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sections.some((s) => s.id === hash)) {
        setActive(hash);
      }
    };

    // Apply on load
    applyHash();

    // Listen to back/forward navigation
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
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
            className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm ${
              isActive
                ? 'bg-gray-200 text-gray-900'
                : 'hover:bg-gray-100 text-gray-700'
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

      <main className="pt-8">
        <div className="container mx-auto px-4 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            {/* Sidebar */}
            <aside className="md:col-span-3 lg:col-span-3 border rounded-md p-3 sticky top-28 h-fit bg-white">
              <nav aria-label="About page sections" className="space-y-1">
                {sections.map((s) => (
                  <NavItem key={s.id} id={s.id} label={s.label} />
                ))}
              </nav>
            </aside>

            {/* Content */}
            <section className="md:col-span-9 lg:col-span-9 border rounded-md p-6">
              {active === 'about' && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">About Us</h1>
                  <hr className="my-4" />
                  <p className="text-gray-700 leading-relaxed mb-6">
                   Welcome to Home HNI!

Home HNI is a premium real-estate platform designed exclusively for High Net-Worth Individuals (HNIs) to discover, buy, and sell luxury properties with complete privacy, trust, and transparency.

We started Home HNI because we believe that buying or selling high-value real estate should be seamless, discreet, and free from the hassles of traditional property hunting. In today’s market, most luxury transactions still depend heavily on scattered contacts, unverified leads, and middlemen who often add unnecessary delays and costs. We are here to change that by providing a secure, invitation-only platform where verified buyers and sellers can connect directly.

We have done two things to help you find or sell your perfect luxury home:

Firstly, we verify every single property and member on our platform to ensure that listings are genuine, exclusive, and relevant. Our multi-step verification process ensures you’re connecting with serious, qualified parties only—no fake listings, no cold leads.

Secondly, we present each property with rich, in-depth details, high-quality visuals, and precise location insights so you can evaluate it thoroughly before making a visit. Whether it’s a sea-facing penthouse in Mumbai, a heritage estate in Goa, or a designer villa in Delhi, you’ll have all the information you need to shortlist the right properties from the comfort of your home.

If you’re an HNI property owner looking to list your luxury home on Home HNI, please email us at [your email] and our team will personally assist you in creating an exclusive listing.

And to our buyers—happy exploring, and let us know how we can make your luxury home search even smoother!
                  </p>
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
      </main>

      <Footer />
    </div>
  );
};

export default AboutSidebar;
