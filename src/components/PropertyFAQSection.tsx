import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus } from 'lucide-react';

const PropertyFAQSection: React.FC = () => {
  const faqData = [
    {
      question: "Is it free to Post home for rent on HomeHNI's List Your Property page?",
      answer: "Yes, it's completely free to list your property on HomeHNI. We don't charge any fees for posting your rental property, making it accessible for all property owners to reach potential tenants."
    },
    {
      question: "Why should I use HomeHNI to advertise my home rental?",
      answer: "HomeHNI offers verified buyers/tenants, zero brokerage, free listing, easy and quick process, increased property visibility, dedicated support, and buyer/tenant background verification. You can reach genuine prospects without dealing with brokers."
    },
    {
      question: "Can I advertise both residential and commercial properties on HomeHNI's List Your Property page?",
      answer: "Yes, HomeHNI supports listing of residential properties (apartments, houses), commercial properties (offices, shops, warehouses), and land/plots. You can choose the appropriate category during the listing process."
    },
    {
      question: "How does HomeHNI ensure the security of my property listings and interactions with potential tenants or buyers?",
      answer: "HomeHNI implements strict verification processes for all users, maintains privacy of your contact information until you choose to share it, and provides secure communication channels. All interactions are monitored for safety and quality."
    },
    {
      question: "Can I receive extra support from HomeHNI for Renting or selling my flat online?",
      answer: "Yes, HomeHNI provides dedicated customer support throughout your listing journey. Our team assists with creating effective listings, handling inquiries, scheduling visits, and even provides services like rental agreement creation and doorstep delivery."
    }
  ];

  return (
    <div className="bg-white pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              If you are looking to rent or sell your individual house, flat, or commercial property the first thing you need to do is decide how to find a buyer or tenant. Now, you can't always depend on your immediate contacts to help you get the job done, you need to cast a wider net, to get more options and to get better offers.
            </p>
            <p>
              Here are a few frequently asked questions and answers about house rent, house selling, commercial property rent and commercial property selling. This should give you an idea as to how simple the process is, and what you need to be aware of.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="border-t border-gray-200">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left py-6 hover:no-underline group [&>svg]:hidden">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-medium text-red-600 pr-4 group-hover:text-red-700 transition-colors">
                      {faq.question}
                    </span>
                    <Plus className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-all duration-200 group-data-[state=open]:rotate-45" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default PropertyFAQSection;