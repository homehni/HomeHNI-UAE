import { useState } from 'react';
import { Star, CheckCircle, Phone, Users, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const LifetimePlans = () => {
  const [selectedCategory, setSelectedCategory] = useState<'agents' | 'builders'>('agents');
  const [selectedPlan, setSelectedPlan] = useState(0);

  const categories = {
    agents: {
      label: 'Agents',
      icon: Users,
      plans: [
        { name: 'Lifetime Standard', price: '₹79,999 – ₹1,49,999', badge: 'Popular', badgeColor: 'bg-blue-500' },
        { name: 'Lifetime Platinum', price: '₹1,49,999 – ₹2,49,999', badge: 'Best Value', badgeColor: 'bg-green-500' },
        { name: 'Lifetime VIP', price: '₹2,49,999', badge: 'Premium', badgeColor: 'bg-purple-500' }
      ]
    },
    builders: {
      label: 'Builders',
      icon: Building2,
      plans: [
        { name: 'Lifetime Standard', price: '₹1,49,999 – ₹2,49,999', badge: 'Popular', badgeColor: 'bg-blue-500' },
        { name: 'Lifetime Platinum', price: '₹2,49,999 – ₹3,99,999', badge: 'Best Value', badgeColor: 'bg-green-500' },
        { name: 'Lifetime VIP', price: '₹3,99,999', badge: 'Premium', badgeColor: 'bg-purple-500' }
      ]
    }
  };

  const planDetails = [
    [
      { icon: CheckCircle, text: 'Property alerts for new listings' },
      { icon: CheckCircle, text: 'Limited listings per month' },
      { icon: CheckCircle, text: 'Basic customer support' },
      { icon: CheckCircle, text: 'Standard visibility' }
    ],
    [
      { icon: CheckCircle, text: 'Property alerts for new listings' },
      { icon: CheckCircle, text: 'Limited listings per month' },
      { icon: CheckCircle, text: 'Basic customer support' },
      { icon: CheckCircle, text: 'Standard visibility' },
      { icon: CheckCircle, text: 'Unlimited listings' },
      { icon: CheckCircle, text: 'Priority support' },
      { icon: CheckCircle, text: 'Virtual tours' },
      { icon: CheckCircle, text: 'Marketing resources' }
    ],
    [
      { icon: CheckCircle, text: 'Property alerts for new listings' },
      { icon: CheckCircle, text: 'Limited listings per month' },
      { icon: CheckCircle, text: 'Basic customer support' },
      { icon: CheckCircle, text: 'Standard visibility' },
      { icon: CheckCircle, text: 'Unlimited listings' },
      { icon: CheckCircle, text: 'Priority support' },
      { icon: CheckCircle, text: 'Virtual tours' },
      { icon: CheckCircle, text: 'Marketing resources' },
      { icon: CheckCircle, text: 'VIP concierge service' },
      { icon: CheckCircle, text: 'Advanced marketing tools' },
      { icon: CheckCircle, text: 'Exclusive listings access' },
      { icon: CheckCircle, text: '24/7 dedicated support' },
      { icon: CheckCircle, text: 'Advanced analytics dashboard' }
    ]
  ];

  const workSteps = [
    { title: 'Choose Your Plan', description: 'Select the lifetime plan that best fits your business needs.' },
    { title: 'Complete Payment', description: 'Make a one-time payment and enjoy lifetime benefits.' },
    { title: 'Account Activation', description: 'Your account will be activated with all premium features.' },
    { title: 'Start Growing', description: 'Begin using all the advanced tools to grow your business.' }
  ];

  const faqs = [
    { question: 'What does lifetime access include?', answer: 'Lifetime access includes all features in your chosen plan for as long as our platform operates, with no recurring fees.' },
    { question: 'Can I upgrade my lifetime plan later?', answer: 'Yes, you can upgrade to a higher tier by paying the difference between your current plan and the new plan.' },
    { question: 'Is there a refund policy?', answer: 'We offer a 30-day money-back guarantee if you\'re not satisfied with your lifetime plan.' },
    { question: 'Do lifetime plans include future features?', answer: 'Yes, lifetime plans include access to new features and updates within your plan tier.' },
    { question: 'What happens if I switch from Agent to Builder?', answer: 'You can switch categories by upgrading to the equivalent builder plan and paying the difference.' }
  ];

  const bestForDescriptions = [
    'New agents or builders starting out with moderate exposure needs',
    'Established professionals looking for unlimited listings, enhanced visibility, and support',
    'Top-tier agents or builders handling luxury listings, requiring exclusive services and promotions'
  ];

  const currentCategory = categories[selectedCategory];
  const CategoryIcon = currentCategory.icon;

  return (
    <>
      <Header />
      <Marquee />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <CategoryIcon className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Lifetime Plans for {currentCategory.label}</h1>
            </div>
            <p className="text-xl mb-6">One-time payment, lifetime benefits. Choose your category and plan.</p>
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-lg">Trusted by 10,000+ professionals</span>
              </div>
            </div>
            
            {/* Category Selector */}
            <div className="max-w-xs mx-auto">
              <Select value={selectedCategory} onValueChange={(value) => {
                setSelectedCategory(value as 'agents' | 'builders');
                setSelectedPlan(0);
              }}>
                <SelectTrigger className="w-full bg-white text-gray-900">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agents">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Agents
                    </div>
                  </SelectItem>
                  <SelectItem value="builders">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Builders
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Lifetime Plan</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {currentCategory.plans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-lg p-8 border-2 cursor-pointer transition-all hover:shadow-xl ${
                    selectedPlan === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedPlan(index)}
                >
                  <div className="text-center mb-6">
                    {plan.badge && (
                      <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold mb-4 ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-4">{plan.price}</div>
                    <p className="text-gray-600">{bestForDescriptions[index]}</p>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Choose Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Plan Features */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {currentCategory.plans[selectedPlan].name} Features
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {planDetails[selectedPlan].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <feature.icon className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How Lifetime Plans Work</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {workSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-blue-600 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8">Join thousands of professionals who have chosen lifetime plans.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Choose Your Plan
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center">
                <Phone className="h-5 w-5 mr-2" />
                Call Us: +91-XXXXXXXXXX
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};