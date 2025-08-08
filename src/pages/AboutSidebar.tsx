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
  }, []);

  useEffect(() => {
    // Smooth scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Observe section visibility to highlight current item
  useEffect(() => {
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: [0.2, 0.5, 0.8] }
      );
      obs.observe(el);
      observers.current[id] = obs;
    });
    return () => {
      Object.values(observers.current).forEach((o) => o?.disconnect());
      observers.current = {};
    };
  }, []);

  const onNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
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
              <h1 id="about" className="text-3xl font-bold text-gray-900 mb-4">
                About Us
              </h1>
              <p className="text-gray-700 leading-relaxed mb-6">
                Welcome to HomeHNI – a trusted real estate platform focused on transparency, verified
                listings, and a zero-brokerage approach for many of our services. Our goal is to remove
                information asymmetry and empower owners, buyers, and tenants with smart tools.
              </p>

              <hr className="my-8" />

              <article id="services" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Additional Services</h2>
                <p className="text-gray-700 mb-4">
                  Explore handpicked services including Legal Assistance, Property Management, Handover
                  Services, Loans, Architecture and Interior Design. Each service is delivered by vetted
                  partners with clear pricing and SLAs.
                </p>
              </article>

              <article id="owners" className="scroll-mt-24 mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Owners</h2>
                <p className="text-gray-700 mb-4">
                  List your property with high-quality visibility, lead tracking, and smart marketing.
                  Our verified processes help you attract serious buyers and tenants faster.
                </p>
              </article>

              <article id="whatsapp" className="scroll-mt-24 mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Listing Using WhatsApp</h2>
                <p className="text-gray-700 mb-4">
                  Share property details and photos directly on WhatsApp; our team will structure and
                  publish the listing for you after verification.
                </p>
              </article>

              <article id="tenants" className="scroll-mt-24 mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Tenants</h2>
                <p className="text-gray-700 mb-4">
                  Get curated options based on budget and locality preferences. Virtual tours and
                  detailed property insights save you time and site visits.
                </p>
              </article>

              <article id="team" className="scroll-mt-24 mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Team</h2>
                <p className="text-gray-700 mb-4">
                  Our multidisciplinary team brings deep experience in real estate, legal, and technology –
                  all focused on improving your experience.
                </p>
              </article>

              <article id="faq" className="scroll-mt-24 mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">FAQ</h2>
                <p className="text-gray-700 mb-4">
                  Have questions? Visit our FAQ page for quick answers on listing, verification,
                  payments, and safety.
                </p>
              </article>

              <article id="blog" className="scroll-mt-24 mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Blog</h2>
                <p className="text-gray-700 mb-4">
                  Insights, market trends, and homeowner tips to help you make informed decisions.
                </p>
              </article>

              <article id="contact" className="scroll-mt-24 mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  Need help? Reach out via our Contact page – we typically respond within one business
                  day.
                </p>
              </article>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutSidebar;
