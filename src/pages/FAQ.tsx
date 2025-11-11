import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Marquee from '../components/Marquee';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqData = [
    {
      category: "About Home Hni & How It Works",
      questions: [
        {
          q: "What is Home Hni?",
          a: "Home Hni is a premium real estate platform offering curated luxury properties with zero brokerage. It connects genuine buyers and sellers directly, backed by personalized concierge support."
        },
        {
          q: "How is it different from platforms like NoBroker or 99acres?",
          a: "Unlike generic portals, Home Hni is curated only for verified high-end listings, supports direct owner-to-buyer transactions, and offers end-to-end support—without any brokerage charges."
        },
        {
          q: "Is there a mobile app or is it only web-based?",
          a: "Currently, Home Hni is web-based. An app version is under development for enhanced convenience."
        }
      ]
    },
    {
      category: "Listing & Selling a Property",
      questions: [
        {
          q: "How do I list my property?",
          a: "Create an account, upload details and documents, and our team will verify the listing before it goes live—usually within 48 hours."
        },
        {
          q: "What types of properties can I list?",
          a: "Only premium, high-value properties such as luxury apartments, villas, penthouses, and upscale plots are accepted."
        },
        {
          q: "Are there any charges to list?",
          a: "A one-time flat listing fee applies. There are no hidden charges or post-sale brokerage fees."
        },
        {
          q: "Can I list through an agent?",
          a: "No. Only owner-verified listings are accepted to maintain platform transparency and trust."
        }
      ]
    },
    {
      category: "Buying, Searching & Scheduling Visits",
      questions: [
        {
          q: "How can I find the right property?",
          a: "Use our advanced filters—location, budget, size, amenities—to browse only verified listings. Each listing shows owner details and verified property tags."
        },
        {
          q: "Can I speak directly with the owner?",
          a: "Yes. You can use the \"Contact Owner\" or \"Request Callback\" options on the listing page."
        },
        {
          q: "How do I schedule a visit?",
          a: "Click \"Schedule Viewing\" and our concierge team will coordinate a visit at your convenience."
        },
        {
          q: "Are listings verified?",
          a: "Yes. We verify ownership documents, title status, and actual site photos before publishing listings."
        }
      ]
    },
    {
      category: "Payments, Documentation & Legal Support",
      questions: [
        {
          q: "Is legal assistance available?",
          a: "Yes. Our concierge team helps with property inspection, title checks, sale agreements, and more."
        },
        {
          q: "Can I get a home loan for properties on Home Hni?",
          a: "Absolutely. We partner with top banks/NBFCs and assist in processing loan applications."
        },
        {
          q: "What is the typical payment process?",
          a: "Most transactions follow standard milestones—booking advance, agreement signing, final payment. Secure payment and escrow options are available."
        },
        {
          q: "What happens if a deal doesn't go through?",
          a: "Our support team helps resolve issues, but listing fees are non-refundable. You may relist the property within 12 months without extra charge."
        }
      ]
    },
    {
      category: "Account, Support & Safety",
      questions: [
        {
          q: "Is my data secure on Home Hni?",
          a: "Yes. We use bank-grade encryption and never share your data without consent."
        },
        {
          q: "Who do I contact for help or technical issues?",
          a: "📧 Email: support@homehni.com\n📞 Phone/WhatsApp: +91-[your number]\n💬 Live Chat: Available daily from 9 AM – 8 PM IST"
        },
        {
          q: "What cities does Home Hni operate in?",
          a: "We're currently focused on major Tier 1 & Tier 2 cities like Mumbai, Delhi NCR, Bengaluru, and Hyderabad—with more coming soon."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Marquee />
      <Header />
      
      <main>
        {/* Hero Section - Extended to cover header area */}
        <section className="relative h-[500px] bg-cover bg-center bg-no-repeat text-white -mt-[120px] pt-[120px]" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}>
          <div className="absolute inset-0 bg-black/40"></div>
          
        </section>

        {/* FAQ Content */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">🏡 Home Hni – Frequently Asked Questions</h1>
              
              {faqData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-brand-red">
                    {categoryIndex + 1}. {category.category}
                  </h2>
                  
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((faq, questionIndex) => (
                      <AccordionItem 
                        key={questionIndex} 
                        value={`${categoryIndex}-${questionIndex}`}
                        className="bg-white rounded-lg shadow-sm border"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-900 hover:text-brand-red">
                          Q: {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-gray-700 whitespace-pre-line">
                          A: {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our support team is here to help you with any queries about Home Hni
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@homehni.com"
                  className="bg-brand-red text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Email Support
                </a>
                <a 
                  href="tel:+91"
                  className="border-2 border-brand-red text-brand-red px-8 py-3 rounded-lg font-medium hover:bg-brand-red hover:text-white transition-colors"
                >
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;