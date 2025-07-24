
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const Careers = () => {
  useEffect(() => {
    // Smooth scroll to top when component mounts
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
    // Small delay to ensure page is fully loaded
    setTimeout(scrollToTop, 100);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Marquee at the very top */}
      <Marquee />
      
      {/* Header overlapping with content */}
      <Header />
      
      {/* Hero Section with banner image merged with header/marquee */}
      <div className="pt-8">
        <div className="relative h-[50vh] overflow-hidden">
          {/* Banner Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/lovable-uploads/b97275ad-b157-4783-8b5b-198d7c905011.png')`,
              backgroundPosition: 'center center'
            }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Header Section */}
            <section className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Careers at HomeHNI</h1>
              <p className="text-xl text-gray-600 mb-6">Shape the Future of High-Value Real Estate with Us</p>
              <p className="text-gray-700 leading-relaxed">
                At HomeHNI, we are redefining how High-Net-Worth Individuals (HNIs) experience real estate. With technology, transparency, and trust at our core, we're building India's most intelligent platform for premium property discovery and transactions.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                If you're passionate about innovation, problem-solving, and creating real impact in the luxury property space — we want you on our team.
              </p>
            </section>

            {/* Why Work with HomeHNI */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🔍 Why Work with HomeHNI?</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">✅ Innovation-Driven Culture</h3>
                  <p className="text-blue-700 leading-relaxed">
                    We don't just follow trends—we set them. You'll work on cutting-edge real estate tech tools, customer experience automation, and intelligent listing algorithms.
                  </p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">✅ Real Impact, Real Growth</h3>
                  <p className="text-green-700 leading-relaxed">
                    Your work directly influences how clients make high-value property decisions. From day one, you'll have ownership and autonomy.
                  </p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-3">✅ Work with the Best Minds</h3>
                  <p className="text-purple-700 leading-relaxed">
                    Collaborate with experienced professionals from top startups, proptech companies, and the real estate industry.
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-3">✅ Flexible and Hybrid Opportunities</h3>
                  <p className="text-yellow-700 leading-relaxed">
                    We believe in productivity over presence. Enjoy flexible working hours, remote options, and a performance-focused environment.
                  </p>
                </div>
              </div>
            </section>

            {/* Current Openings */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🌟 Current Openings</h2>
              </div>
              
              <div className="space-y-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Real Estate Sales Consultant – HNI Segment</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Location:</strong> Mumbai / Bangalore / Delhi NCR</p>
                    <p><strong>Experience:</strong> 3+ years in luxury real estate sales</p>
                    <p><strong>Role:</strong> Build relationships with HNI clients, conduct virtual/onsite property tours, and drive premium property transactions.</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Digital Marketing Executive</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Location:</strong> Remote</p>
                    <p><strong>Experience:</strong> 2–4 years (Real Estate or PropTech preferred)</p>
                    <p><strong>Role:</strong> Plan, execute, and optimize paid ad campaigns, SEO, content marketing, and email automation for lead generation.</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Full Stack Developer (React + Node.js)</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Location:</strong> Hybrid (Bangalore Preferred)</p>
                    <p><strong>Experience:</strong> 2–5 years</p>
                    <p><strong>Role:</strong> Build scalable, high-performance web platforms and tools for real estate discovery, agent dashboards, and user engagement.</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Legal Documentation Executive</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Location:</strong> Remote / Onsite</p>
                    <p><strong>Experience:</strong> 1–3 years in property law or legal drafting</p>
                    <p><strong>Role:</strong> Assist clients with sale agreements, title checks, and document review services for property transactions.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Life at HomeHNI */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🚀 Life at HomeHNI</h2>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Startup agility meets domain expertise</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Transparent feedback culture</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Monthly knowledge-sharing sessions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Annual offsites, performance rewards, and wellness benefits</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mt-6">
                <p className="text-blue-800 font-medium italic">
                  💬 "At HomeHNI, you're not just another employee—you're an owner of your work, your ideas, and your journey."<br />
                  <span className="text-sm">– Team HomeHNI</span>
                </p>
              </div>
            </section>

            {/* Don't See Your Role Listed */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">💼 Don't See Your Role Listed?</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We're always looking for passionate thinkers and doers!
              </p>
              <p className="text-gray-700 leading-relaxed">
                📧 Email us your CV at <strong>careers@homehni.com</strong> with a brief note on why you'd be a great fit.
              </p>
            </section>

            {/* Join the HomeHNI Journey */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">✨ Join the HomeHNI Journey</h2>
              </div>
              <div className="bg-gradient-to-r from-brand-red to-red-600 text-white p-8 rounded-lg text-center">
                <p className="text-lg leading-relaxed">
                  Whether you're a tech innovator, a real estate enthusiast, or a service professional—this is your chance to shape the premium property experience for tomorrow's India.
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Careers;
