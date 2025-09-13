import React from 'react';

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
    <div className="bg-white py-16">
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

        {/* FAQ List */}
        <div className="space-y-8">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-medium text-red-600 mb-4">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyFAQSection;