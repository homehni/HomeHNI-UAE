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
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Additional Services</h1>
                  
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-sm">
                      Home HNI offers a complete concierge-style service for all legal, financial, and documentation needs related to luxury property transactions. From due diligence to registration, we ensure that every step is handled with the highest level of care, confidentiality, and precision—so you can focus on the bigger picture.
                    </p>
                    
                    <p className="text-sm">
                      Our trusted network of real-estate and legal experts will personally assist you in completing a seamless, end-to-end transaction for a nominal service fee. This service is available for both buyers and sellers—simply drop us a note at <a href="mailto:contact@homehni.com" className="text-blue-600 hover:underline">contact@homehni.com</a> and we will take care of the rest.
                    </p>
                    
                    <p className="font-medium text-sm">We will handle the following on your behalf:</p>
                    
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <span className="text-gray-600 mr-3 mt-1">•</span>
                        <span>Conduct detailed legal due diligence on the property</span>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="text-gray-600 mr-3 mt-1">•</span>
                        <span>Draft and review the Sale Agreement or Lease Agreement as per legal requirements</span>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="text-gray-600 mr-3 mt-1">•</span>
                        <span>Arrange for proper stamping and registration of documents</span>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="text-gray-600 mr-3 mt-1">•</span>
                        <span>Coordinate with banks, legal advisors, and relevant authorities for approvals</span>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="text-gray-600 mr-3 mt-1">•</span>
                        <span>Schedule and manage appointments with the Sub-Registrar's office or equivalent authorities</span>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="text-gray-600 mr-3 mt-1">•</span>
                        <span>Provide full on-site assistance during the signing and registration process</span>
                      </li>
                    </ul>
                    
                    <p className="text-sm">
                      In short—we ensure that your property transaction is secure, compliant, and completely hassle-free.
                    </p>
                    
                    <p className="text-sm pb-8">
                      To initiate your property documentation process in just a few minutes, <a href="/legal-services" className="text-blue-600 hover:underline">click here</a>.
                    </p>
                  </div>
                </>
              )}

              {active === 'owners' && (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Why You Should List With Us?</h1>
                  
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-sm">
                      Home HNI gives you direct access to serious, verified luxury property buyers—without relying on traditional brokers. This means you stay in complete control of the process, save substantial brokerage fees, and ensure your property is presented to the right audience with the discretion it deserves.
                    </p>
                    
                    <p className="text-sm">
                      Unlike many traditional agents who may show your property to unqualified buyers or prioritize other listings for higher commissions, we ensure that every enquiry is from a verified HNI buyer who meets your criteria. You can speak directly to potential buyers before arranging a visit, ensuring your time and privacy are respected. For added convenience, we can coordinate viewings on your preferred schedule, so you're only engaging with genuinely interested prospects.
                    </p>
                    
                    <p className="text-sm">
                      By eliminating brokerage, both seller and buyer save significantly—allowing more flexibility in price negotiations. In fact, our data shows that sellers often achieve 2–4% higher sale values compared to conventional channels, as buyers are more willing to pay a fair price when there's no brokerage on either side. It's a true win-win.
                    </p>
                    
                    <p className="text-sm">
                      Listing your property with Home HNI is quick and intuitive—it takes less than five minutes. Every listing is personally verified to maintain the exclusivity and quality of our platform. We also use smart, secure technology (including WhatsApp integration) to make the process smooth and effortless. If you ever need assistance, our dedicated relationship managers are just a call away.
                    </p>
                    
                    <p className="text-sm">
                      Once listed, your property will be showcased to a select, invitation-only network of serious HNI buyers, ensuring you get genuine, high-value enquiries—never random or unsolicited calls.
                    </p>
                    
                    <p className="text-sm pb-8">
                      If you have a luxury property to list, click on the 'List Your Property' button in the top right corner of the page or email us at <a href="mailto:contact@homehni.com" className="text-blue-600 hover:underline">contact@homehni.com</a> and we'll handle the rest.
                    </p>
                  </div>
                </>
              )}

              {active === 'whatsapp' && (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">How to List Using WhatsApp?</h1>
                  
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-sm">
                      At Home HNI, we know that your time is valuable—and we've made listing your luxury property as simple as sending a message.
                    </p>
                    
                    <p className="text-sm">
                      No need to log in from a computer or navigate complicated forms. Just send us the property details on WhatsApp at <a href="https://wa.me/yourwhatsappnumber" className="text-blue-600 hover:underline">+91 XXXXX XXXXX</a>, and our dedicated Relationship Manager will take care of the rest.
                    </p>
                    
                    <p className="text-sm">
                      We will create your listing, verify your details, and ensure it's presented with the exclusivity and precision your property deserves. If we need additional information, our team will call you personally to complete the process.
                    </p>
                    
                    <p className="text-sm pb-8">
                      It's fast, effortless, and discreet—exactly the way luxury real estate should be.
                    </p>
                  </div>
                </>
              )}

              {active === 'tenants' && (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Home HNI</h1>
                  
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-sm">
                      Home HNI is the most effortless, secure, and discreet way to buy or sell luxury properties—without middlemen, inflated commissions, or wasted time.
                    </p>
                    
                    <p className="text-sm">
                      We help you in three powerful ways:
                    </p>
                    
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">1. Verified, Direct Listings</p>
                        <p>Every property on Home HNI is verified and listed directly by the owner or an authorized representative. This ensures complete transparency, authenticity, and zero hidden brokerage. For sellers, this means retaining the full value of your sale; for buyers, it means your budget goes entirely into your new property, not into agent fees.</p>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">2. Complete, Curated Information</p>
                        <p>Our listings go far beyond basic details. We provide high-quality images, in-depth property descriptions, and comprehensive insights into the location—such as nearby amenities, infrastructure, and lifestyle attractions. This allows you to shortlist properties without unnecessary site visits, saving you significant time and effort. Unlike traditional agents who might show you unsuitable options just to push a deal, Home HNI ensures every property you see matches your preferences.</p>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">3. Full Market Transparency</p>
                        <p>In traditional real estate, information is often withheld or selectively shared to control which properties sell first. At Home HNI, every verified listing is visible to you from the moment it's available—on a first-come, first-serve basis. There's no gatekeeping, no information asymmetry, and no manipulation of options—just a transparent, efficient marketplace.</p>
                      </div>
                    </div>
                    
                    <p className="text-sm pb-8">
                      So, skip the traditional broker and experience the smarter way to buy or sell luxury property with Home HNI. <a href="#" className="text-blue-600 hover:underline">Click here</a> to explore our exclusive listings.
                    </p>
                  </div>
                </>
              )}

              {active === 'team' && (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">The Home HNI Team</h1>
                  
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-sm">
                      Home HNI was founded by a team of seasoned professionals from top-tier institutions and industries—bringing together expertise in luxury real estate, technology, finance, and client relationship management.
                    </p>
                    
                    <p className="text-sm">
                      The idea for Home HNI was born out of our own experiences in high-value property transactions, where we faced unnecessary gatekeeping, lack of transparency, and middlemen charging disproportionate fees without adding real value. We saw how even in the luxury segment, deals could be slow, unorganized, and frustrating—especially when accurate information wasn't readily available.
                    </p>
                    
                    <p className="text-sm">
                      When we spoke to fellow high-net-worth individuals, we realized this wasn't just our problem—it was a recurring pain point for nearly everyone in the market. And while other real estate portals catered to the mass market or focused on helping brokers operate more efficiently, no one was truly addressing the specific needs of HNI buyers and sellers: privacy, trust, exclusivity, and efficiency.
                    </p>
                    
                    <p className="text-sm pb-8">
                      As the saying goes, necessity is the mother of invention. Home HNI is our answer—a premium, invitation-only platform that removes unnecessary intermediaries and brings absolute transparency to luxury real estate. Our vision is to create a fully efficient, information-rich marketplace where high-value property deals happen seamlessly, securely, and directly between the right people.
                    </p>
                  </div>
                </>
              )}

              {active === 'faq' && (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-800">General & Account Related</span>
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-800">Owners Related</span>
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-800">Tenant/Seekers Related</span>
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-800">NRI Related</span>
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
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