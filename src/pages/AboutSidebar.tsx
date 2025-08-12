import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    if (id === 'blog') {
      // Open blog in a new tab for better UX
      window.open('/blog', '_blank', 'noopener,noreferrer');
      return;
    }
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

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />

      <main className="pt-24">
        <div className="container mx-auto px-4 pt-12 pb-10">
          {/* Border container wrapper */}
          <div className="border border-border rounded-lg bg-background shadow-sm">
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-12 gap-0">
              {/* Sidebar */}
              <aside className="border-r border-border bg-muted/30 md:col-span-3 lg:col-span-2">
                <nav aria-label="About page sections" className="p-4">
                  {sections.map((s) => (
                    <NavItem key={s.id} id={s.id} label={s.label} />
                  ))}
                </nav>
              </aside>

              {/* Content */}

              {/* Content */}
              <section className="md:col-span-9 lg:col-span-10 p-6">
              {active === 'about' && (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground border-b border-border pb-3 mb-6">About Us</h1>
                  
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
                  
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="general" className="bg-gray-50 rounded-lg border border-gray-200 px-6">
                      <AccordionTrigger className="text-left font-medium text-gray-800 hover:no-underline">
                        General & Account Related
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-700 pb-4">
                        <div className="space-y-4">
                          <div>
                            <p className="font-medium mb-2">Why do I need a verified account to use Home HNI services?</p>
                            <p>At Home HNI, our core mission is to create a trusted, invitation-only marketplace for luxury real estate. To maintain exclusivity and ensure complete authenticity, we verify each buyer and seller before granting access to our platform. This protects the privacy of our members and ensures that every interaction is with a genuine, qualified party.</p>
                          </div>
                          
                          <div>
                            <p className="font-medium mb-2">How long does it take for email verification?</p>
                            <p>Email verification is quick and seamless. Once you register, you will receive an email with a secure verification link. The process takes less than two minutes.</p>
                          </div>
                          
                          <div>
                            <p className="font-medium mb-2">How long does it take for mobile number verification?</p>
                            <p>Our dedicated Relationship Managers prioritize account activations. In most cases, mobile verification is completed within 4 business hours.</p>
                          </div>
                          
                          <div>
                            <p className="font-medium mb-2">How will I know if my account is verified?</p>
                            <p>You will receive a confirmation via both email and WhatsApp/SMS as soon as your account is verified.</p>
                          </div>
                          
                          <div>
                            <p className="font-medium mb-2">Is it safe to log in via Google, Apple ID, or LinkedIn?</p>
                            <p className="mb-2">Absolutely. At Home HNI, your privacy and data security are non-negotiable.</p>
                            
                            <ul className="space-y-2 text-sm ml-4">
                              <li className="flex items-start">
                                <span className="text-gray-600 mr-3 mt-1">•</span>
                                <span>We never post anything on your social accounts.</span>
                              </li>
                              
                              <li className="flex items-start">
                                <span className="text-gray-600 mr-3 mt-1">•</span>
                                <span>We only request essential details for verification.</span>
                              </li>
                              
                              <li className="flex items-start">
                                <span className="text-gray-600 mr-3 mt-1">•</span>
                                <span>Using your social login means you don't have to remember another password.</span>
                              </li>
                              
                              <li className="flex items-start">
                                <span className="text-gray-600 mr-3 mt-1">•</span>
                                <span>Your email will be automatically verified when you log in with a social account.</span>
                              </li>
                            </ul>
                            
                            <p className="mt-3">If you register using a social account, please ensure that you add your mobile number in your profile after login to complete your verification.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="owners" className="bg-gray-50 rounded-lg border border-gray-200 px-6">
                      <AccordionTrigger className="text-left font-medium text-gray-800 hover:no-underline">
                        Owners Related
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-700 pb-4">
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium mb-1">How do I list my property?</p>
                            <p>You can list your property by clicking "List Your Property" or sending us details via WhatsApp. Our team will verify and create your listing within 24 hours.</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">What documents do I need to provide?</p>
                            <p>Basic ownership documents, property photos, and contact details. Our team will guide you through the verification process.</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Do you charge any commission?</p>
                            <p>No, Home HNI does not charge any brokerage or commission. You deal directly with buyers and retain 100% of your sale value.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tenants" className="bg-gray-50 rounded-lg border border-gray-200 px-6">
                      <AccordionTrigger className="text-left font-medium text-gray-800 hover:no-underline">
                        Tenant/Seekers Related
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-700 pb-4">
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium mb-1">How do I find properties in my budget?</p>
                            <p>Use our advanced filters to search by location, budget, property type, and amenities. All listings show verified pricing with no hidden costs.</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Can I schedule property visits?</p>
                            <p>Yes, you can contact owners directly through our platform or request our team to coordinate visits at your convenience.</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Are all properties verified?</p>
                            <p>Yes, every property undergoes our rigorous verification process to ensure authenticity and direct owner contact.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="nri" className="bg-gray-50 rounded-lg border border-gray-200 px-6">
                      <AccordionTrigger className="text-left font-medium text-gray-800 hover:no-underline">
                        NRI Related
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-700 pb-4">
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium mb-1">Can NRIs buy properties through Home HNI?</p>
                            <p>Yes, we have extensive experience with NRI property transactions and can guide you through all legal and regulatory requirements.</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">What about FEMA compliance?</p>
                            <p>Our legal team ensures full FEMA compliance for all NRI transactions, handling all documentation and approvals required.</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Do you provide remote transaction support?</p>
                            <p>Yes, we offer complete remote transaction support including virtual property tours, digital documentation, and power of attorney services.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h1>
                  <hr className="border-gray-300 mb-6" />
                  
                  <div className="space-y-6">
                    <p className="text-gray-700 text-sm">
                      In case you have any questions, suggestions or if you just want to have a general talk with us. You can reach out to us by any of the below means:
                    </p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Traditional Way Column */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Traditional Way</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 text-sm">Write to us</span>
                            <a href="mailto:contact@homehni.com" className="text-blue-600 hover:underline text-sm">
                              contact@homehni.com
                            </a>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 text-sm">Media Query</span>
                            <a href="mailto:media@homehni.com" className="text-blue-600 hover:underline text-sm">
                              media@homehni.com
                            </a>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 text-sm">Contact</span>
                            <a href="tel:+918035263382" className="text-blue-600 hover:underline text-sm">
                              +918035263382
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      {/* Social Network Column */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Reach us on social network</h3>
                        <div className="flex gap-3">
                          <a href="https://www.facebook.com/profile.php?id=61578319572154" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </a>
                          <a href="https://x.com/homehni8" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                          <a href="https://www.instagram.com/homehni" className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600 transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                          <a href="https://www.linkedin.com/in/home-hni-622605376/" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
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