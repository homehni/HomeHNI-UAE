import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Home, X, Send, MapPin, Calendar, Phone, Mail, User, Bed, Bath, Square, Building2, UserCircle, Search, History, HelpCircle, Globe, Wind, ShoppingBag, Hammer, FileCheck, Zap, Sofa, Sparkles, PaintBucket, Wrench, Scale, BadgeDollarSign, Shield, TruckIcon, Brush, Droplet, FileText, CreditCard, GraduationCap, UserCheck, Ban, UserPlus, Receipt, MoreHorizontal, ArrowLeft, MessageSquare, Check } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  propertyCard?: PropertyData;
  options?: string[];
}

interface PropertyData {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  type: string;
}

interface UserPreferences {
  budget?: string;
  location?: string;
  propertyType?: string;
  bedrooms?: string;
  language?: string;
  role?: string;
}

const sampleProperties: PropertyData[] = [
  {
    id: '101',
    title: 'Luxury Apartment in Downtown',
    price: '$1,200,000',
    location: '123 Main St, Anytown',
    bedrooms: 3,
    bathrooms: 2,
    area: '1500 sqft',
    image: '/lovable-uploads/property1.jpg',
    type: 'apartment'
  },
  {
    id: '102',
    title: 'Spacious Villa with Garden',
    price: '$2,500,000',
    location: '456 Oak Ave, Hillside',
    bedrooms: 5,
    bathrooms: 4,
    area: '3000 sqft',
    image: '/lovable-uploads/property2.jpg',
    type: 'villa'
  },
  {
    id: '103',
    title: 'Modern Loft in Arts District',
    price: '$850,000',
    location: '789 Pine Ln, Creative City',
    bedrooms: 2,
    bathrooms: 2,
    area: '1200 sqft',
    image: '/lovable-uploads/property3.jpg',
    type: 'loft'
  }
];

const ChatBot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI real estate assistant. I can help you with all your property needs. Let me know your role to get started:',
      isBot: true,
      timestamp: new Date(),
      options: ['Seller', 'Agent', 'Builder', 'Want to buy a property']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState('role_selection');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [userName, setUserName] = useState('');
  const [currentView, setCurrentView] = useState<'initial' | 'service-faq' | 'faq-detail' | 'plan-support' | 'property-support'>('initial');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedFAQ, setSelectedFAQ] = useState<{question: string, answer: string} | null>(null);
  const [planChatMessages, setPlanChatMessages] = useState<Message[]>([]);
  const [planChatStep, setPlanChatStep] = useState<'budget' | 'details-form' | 'follow-up' | 'complete'>('budget');
  const [planChatInput, setPlanChatInput] = useState('');
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '', phone: '', budget: '' });
  
  // Property-specific chat states
  const [propertyChatMessages, setPropertyChatMessages] = useState<Message[]>([]);
  const [propertyChatStep, setPropertyChatStep] = useState<'budget' | 'details-form' | 'requirements' | 'complete'>('budget');
  const [propertyChatInput, setPropertyChatInput] = useState('');
  const [showPropertyDetailsForm, setShowPropertyDetailsForm] = useState(false);
  const [propertyUserDetails, setPropertyUserDetails] = useState({ name: '', email: '', phone: '', budget: '' });

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newMessage: Message = {
      id: String(Date.now()),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response after a short delay
    await simulateBotResponse(inputValue);
  };

  const propertyTypes = [
    'Flat/Apartment', 
    'Independent House',
    'Villa',
    'Commercial Space',
    'Plot/Land'
  ];

  const budgetRanges = [
    { label: 'Under 50L', value: [0, 5000000] },
    { label: '50L-1Cr', value: [5000000, 10000000] },
    { label: '1-2Cr', value: [10000000, 20000000] },
    { label: '2-5Cr', value: [20000000, 50000000] },
    { label: '5Cr+', value: [50000000, 100000000] }
  ];

  // Dynamic location filtering based on property type and available properties
  const getAvailableLocations = (propertyType: string) => {
    const locationMap: Record<string, string[]> = {
      'Flat/Apartment': ['Noida', 'Mumbai', 'Bangalore', 'Gurgaon'],
      'Independent House': ['Gurgaon'],
      'Villa': ['Bangalore', 'Hyderabad'],
      'Commercial Space': ['Gurgaon', 'Delhi'],
      'Plot/Land': ['Gurgaon']
    };
    
    return locationMap[propertyType] || [];
  };

  const simulateBotResponse = async (userMessage: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let botResponse: Message = {
          id: String(Date.now() + 1),
          isBot: true,
          timestamp: new Date(),
          text: 'I\'m processing your request, please wait...',
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);

        // Simulate typing
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
          let finalResponse: Message;

          if (conversationStep === 'role_selection') {
            setUserPreferences(prev => ({ ...prev, role: userMessage }));
            
            if (['Seller', 'Agent', 'Builder'].includes(userMessage)) {
              setConversationStep('post_property');
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: `Great! As a ${userMessage.toLowerCase()}, you can easily list your property with us. Click the button below to get started:`,
                options: ['Post Your Property']
              };
            } else if (userMessage === 'Want to buy a property') {
              setConversationStep('property_type_selection');
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'Perfect! Let me help you find the right property. What type of property are you looking for?',
                options: propertyTypes
              };
            } else {
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'Please select one of the available options to proceed.',
                options: ['Seller', 'Agent', 'Builder', 'Want to buy a property']
              };
            }
          } else if (conversationStep === 'post_property') {
            if (userMessage === 'Post Your Property') {
              navigate('/post-property');
              setIsOpen(false);
              return resolve(undefined);
            }
          } else if (conversationStep === 'property_type_selection') {
            if (propertyTypes.includes(userMessage)) {
              setUserPreferences(prev => ({ ...prev, propertyType: userMessage }));
              setConversationStep('budget_selection');
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: `Excellent choice! Now, what's your budget range for a ${userMessage.toLowerCase()}?`,
                options: budgetRanges.map(range => range.label)
              };
            } else {
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'Please select a valid property type from the options:',
                options: propertyTypes
              };
            }
          } else if (conversationStep === 'budget_selection') {
            const selectedBudget = budgetRanges.find(range => range.label === userMessage);
            if (selectedBudget) {
              setUserPreferences(prev => ({ ...prev, budget: userMessage }));
              setConversationStep('location_selection');
              
              const availableLocations = getAvailableLocations(userPreferences.propertyType || '');
              
              if (availableLocations.length === 0) {
                finalResponse = {
                  id: String(Date.now() + 2),
                  isBot: true,
                  timestamp: new Date(),
                  text: `Sorry, we don't have any ${userPreferences.propertyType?.toLowerCase()} properties available in our current locations. Please try selecting a different property type.`,
                  options: ['Go Back to Property Types']
                };
              } else {
                finalResponse = {
                  id: String(Date.now() + 2),
                  isBot: true,
                  timestamp: new Date(),
                  text: `Great! With a budget of ${userMessage}, which location are you interested in? Here are the available locations for ${userPreferences.propertyType?.toLowerCase()}:`,
                  options: availableLocations
                };
              }
            } else {
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'Please select a valid budget range:',
                options: budgetRanges.map(range => range.label)
              };
            }
          } else if (conversationStep === 'location_selection') {
            if (userMessage === 'Go Back to Property Types') {
              setConversationStep('property_type_selection');
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'No problem! Let\'s choose a different property type. What type of property are you looking for?',
                options: propertyTypes
              };
            } else if (getAvailableLocations(userPreferences.propertyType || '').includes(userMessage)) {
              setUserPreferences(prev => ({ ...prev, location: userMessage }));
              
              // Navigate to search page with filters
              const propertyTypeMap: Record<string, string> = {
                'Flat/Apartment': 'Flat/Apartment',
                'Independent House': 'Independent House',
                'Villa': 'Villa',
                'Commercial Space': 'Commercial Space/Building',
                'Plot/Land': 'Plots'
              };

              const budgetRange = budgetRanges.find(range => range.label === userPreferences.budget);
              
              const params = new URLSearchParams({
                type: userPreferences.propertyType === 'Commercial Space' ? 'commercial' : 'buy',
                location: userMessage,
                propertyType: propertyTypeMap[userPreferences.propertyType!] || userPreferences.propertyType!
              });

              navigate(`/search?${params.toString()}`);
              setIsOpen(false);
              return resolve(undefined);
            } else {
              const availableLocations = getAvailableLocations(userPreferences.propertyType || '');
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'Please select a location from the available options:',
                options: availableLocations
              };
            }
          } else {
            finalResponse = {
              id: String(Date.now() + 2),
              isBot: true,
              timestamp: new Date(),
              text: 'I am here to assist you with your real estate needs!',
            };
          }

          setMessages(prevMessages => [...prevMessages, finalResponse]);
          resolve(undefined);
        }, 1500);
      });
    });
  };

  const handleOptionClick = (option: string) => {
    // Check if it's one of the 4 original functionalities
    const originalActions = ['Want to buy a property', 'Seller', 'Agent', 'Builder'];
    
    if (originalActions.includes(option)) {
      const newMessage: Message = {
        id: String(Date.now()),
        text: option,
        isBot: false,
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      simulateBotResponse(option);
    } else {
      // For other services, show FAQ view
      setSelectedService(option);
      setCurrentView('service-faq');
    }
  };

  const serviceFAQs: Record<string, {question: string, answer: string}[]> = {
    'nri_services': [
      {
        question: 'What NRI services do you offer?',
        answer: 'We offer comprehensive NRI services including property management, tenant verification, rent collection, and property maintenance for NRIs living abroad.'
      },
      {
        question: 'How can I manage my property from abroad?',
        answer: 'Our dedicated team handles all aspects of property management including finding tenants, collecting rent, and ensuring regular maintenance while you stay updated through our portal.'
      },
      {
        question: 'What are the charges for NRI services?',
        answer: 'Our charges vary based on the services selected. Contact us for a detailed pricing structure tailored to your requirements.'
      },
      {
        question: 'Do you handle legal documentation for NRIs?',
        answer: 'Yes, we assist with all legal documentation including rental agreements, power of attorney, and property-related paperwork.'
      }
    ],
    'ac_service': [
      {
        question: 'What AC services do you provide?',
        answer: 'We provide AC installation, repair, maintenance, gas filling, deep cleaning, and annual maintenance contracts for all AC brands.'
      },
      {
        question: 'How often should I service my AC?',
        answer: 'We recommend servicing your AC at least twice a year - before summer and after monsoon for optimal performance.'
      },
      {
        question: 'Do you provide same-day service?',
        answer: 'Yes, we offer same-day service for urgent AC repairs subject to technician availability in your area.'
      },
      {
        question: 'What is the warranty on AC repairs?',
        answer: 'All our AC repair services come with a 30-day service warranty on parts and labor.'
      }
    ],
    'buyer_plans': [
      {
        question: 'What buyer plans are available?',
        answer: 'We offer Basic, Premium, and Elite buyer plans with varying levels of property search assistance, site visits, and negotiation support.'
      },
      {
        question: 'How do buyer plans help me?',
        answer: 'Our buyer plans provide dedicated relationship managers, curated property listings, legal assistance, and end-to-end support in your home buying journey.'
      },
      {
        question: 'Can I cancel my buyer plan?',
        answer: 'Yes, buyer plans can be cancelled within 7 days of purchase with a full refund as per our cancellation policy.'
      }
    ],
    'carpentry': [
      {
        question: 'What carpentry services do you offer?',
        answer: 'We provide custom furniture making, repairs, wardrobe installation, door and window fitting, and all types of woodwork services.'
      },
      {
        question: 'Do you provide free estimates?',
        answer: 'Yes, our carpenters visit your location to provide free, no-obligation estimates for all carpentry work.'
      },
      {
        question: 'What materials do you use?',
        answer: 'We use high-quality wood and materials as per your preference including plywood, MDF, solid wood, and engineered wood.'
      }
    ],
    'cpms': [
      {
        question: 'What is CPMS?',
        answer: 'CPMS (Comprehensive Property Management System) is our end-to-end property management solution for landlords and property owners.'
      },
      {
        question: 'What services are included in CPMS?',
        answer: 'CPMS includes tenant finding, rent collection, maintenance coordination, legal documentation, and property inspections.'
      },
      {
        question: 'How much does CPMS cost?',
        answer: 'CPMS pricing is based on property value and services selected. Contact us for a customized quote.'
      }
    ],
    'electrician': [
      {
        question: 'What electrical services do you provide?',
        answer: 'We provide electrical repairs, new installations, wiring, MCB replacement, fan installation, light fitting, and electrical safety audits.'
      },
      {
        question: 'Are your electricians certified?',
        answer: 'Yes, all our electricians are licensed, certified professionals with extensive experience in residential and commercial work.'
      },
      {
        question: 'Do you handle emergency electrical issues?',
        answer: 'Yes, we provide 24/7 emergency electrical services for urgent issues like power outages and short circuits.'
      }
    ],
    'furniture': [
      {
        question: 'What furniture services do you offer?',
        answer: 'We offer furniture assembly, installation, repair, restoration, and custom furniture design and manufacturing.'
      },
      {
        question: 'Do you provide furniture on rent?',
        answer: 'Yes, we offer furniture rental packages for residential and commercial properties with flexible terms.'
      },
      {
        question: 'Can you repair antique furniture?',
        answer: 'Yes, our skilled craftsmen specialize in antique furniture restoration and repair.'
      }
    ],
    'home_cleaning': [
      {
        question: 'What cleaning services do you provide?',
        answer: 'We offer deep cleaning, regular cleaning, move-in/move-out cleaning, bathroom cleaning, kitchen cleaning, and carpet cleaning services.'
      },
      {
        question: 'Are cleaning products eco-friendly?',
        answer: 'Yes, we use eco-friendly, non-toxic cleaning products that are safe for your family and pets.'
      },
      {
        question: 'How long does a deep cleaning session take?',
        answer: 'A typical deep cleaning session takes 4-6 hours depending on the size of your home.'
      }
    ],
    'home_interiors': [
      {
        question: 'What interior design services do you offer?',
        answer: 'We provide complete interior design solutions including space planning, 3D visualization, modular kitchens, wardrobes, and home décor.'
      },
      {
        question: 'Do you provide design consultations?',
        answer: 'Yes, we offer free initial design consultations to understand your requirements and style preferences.'
      },
      {
        question: 'What is the timeline for interior projects?',
        answer: 'Project timelines vary from 4-12 weeks depending on scope, with detailed schedules provided during planning.'
      }
    ],
    'home_renovation': [
      {
        question: 'What renovation services do you provide?',
        answer: 'We handle complete home renovations including structural changes, bathroom and kitchen remodeling, flooring, painting, and electrical work.'
      },
      {
        question: 'Do you handle permits and approvals?',
        answer: 'Yes, we assist with obtaining necessary permits and approvals from local authorities for renovation work.'
      },
      {
        question: 'Can I stay in my home during renovation?',
        answer: 'It depends on the scope of work. For minor renovations, yes. For major structural work, temporary relocation is recommended.'
      }
    ],
    'legal_services': [
      {
        question: 'What legal services do you offer for property?',
        answer: 'We provide title verification, agreement drafting, property registration, legal consultation, and dispute resolution services.'
      },
      {
        question: 'How long does property verification take?',
        answer: 'Property title verification typically takes 7-10 working days depending on document availability.'
      },
      {
        question: 'Do you help with property disputes?',
        answer: 'Yes, our legal team provides consultation and representation for property-related disputes and litigation.'
      }
    ],
    'loan_services': [
      {
        question: 'What types of home loans do you assist with?',
        answer: 'We assist with home loans, home improvement loans, balance transfer, and loan against property from multiple banks.'
      },
      {
        question: 'What documents are required for a home loan?',
        answer: 'Typically required documents include ID proof, address proof, income proof, property documents, and bank statements.'
      },
      {
        question: 'How long does loan approval take?',
        answer: 'Loan approval typically takes 7-15 days after document submission, depending on the bank and verification process.'
      }
    ],
    'owner_plans': [
      {
        question: 'What are owner plans?',
        answer: 'Owner plans are subscription packages that help property owners with tenant finding, legal documentation, and property management services.'
      },
      {
        question: 'What benefits do owner plans offer?',
        answer: 'Benefits include tenant verification, rental agreement drafting, rent collection support, and priority customer service.'
      },
      {
        question: 'Can I upgrade my owner plan?',
        answer: 'Yes, you can upgrade your plan anytime with the price difference being adjusted proportionally.'
      }
    ],
    'packers_movers': [
      {
        question: 'What packing and moving services do you provide?',
        answer: 'We provide local and intercity moving, packing services, loading/unloading, vehicle transportation, and storage solutions.'
      },
      {
        question: 'Is insurance included in moving services?',
        answer: 'Basic transit insurance is included. Comprehensive insurance can be purchased for high-value items.'
      },
      {
        question: 'How is the cost calculated?',
        answer: 'Moving costs are based on distance, volume of goods, packing materials required, and additional services selected.'
      }
    ],
    'painting': [
      {
        question: 'What painting services do you offer?',
        answer: 'We offer interior and exterior painting, texture painting, waterproofing, wall putty, and wall repair services.'
      },
      {
        question: 'Which paint brands do you use?',
        answer: 'We work with premium brands like Asian Paints, Berger, Dulux, and Nerolac, or as per your preference.'
      },
      {
        question: 'How long does painting take?',
        answer: 'A typical 2BHK painting project takes 4-7 days depending on the scope and weather conditions.'
      }
    ],
    'plumbing': [
      {
        question: 'What plumbing services do you provide?',
        answer: 'We provide leak repairs, pipe installation, bathroom fitting, water tank cleaning, drain cleaning, and emergency plumbing services.'
      },
      {
        question: 'Do you provide 24/7 plumbing services?',
        answer: 'Yes, we offer 24/7 emergency plumbing services for urgent issues like pipe bursts and major leaks.'
      },
      {
        question: 'What is the warranty on plumbing work?',
        answer: 'All plumbing work comes with a 30-day service warranty on parts and labor.'
      }
    ],
    'post_property': [
      {
        question: 'How do I post my property?',
        answer: 'You can post your property through our platform by filling in property details, uploading photos, and selecting visibility options.'
      },
      {
        question: 'Is posting a property free?',
        answer: 'Basic listing is free. Premium listings with better visibility and features require a subscription.'
      },
      {
        question: 'Can I edit my property listing?',
        answer: 'Yes, you can edit your property listing anytime through your account dashboard.'
      }
    ],
    'rental_agreement': [
      {
        question: 'How do I create a rental agreement?',
        answer: 'We provide online rental agreement creation with legal templates. Simply fill in details, and we handle printing and registration.'
      },
      {
        question: 'Is e-stamping included?',
        answer: 'Yes, we provide e-stamping services as per state regulations included in the package.'
      },
      {
        question: 'How long does agreement registration take?',
        answer: 'Agreement registration typically takes 3-5 working days after document submission.'
      }
    ],
    'rent_pay': [
      {
        question: 'What are fees/charges for using NoBrokerPay?',
        answer: 'The fee levied depends on the amount being transferred, more details will be available on the payment page. Click here to know more'
      },
      {
        question: 'Why should I use NoBroker Pay?',
        answer: 'NoBroker Pay offers secure, convenient rent payments with cashback rewards and instant payment confirmation.'
      },
      {
        question: 'How do I make my house rent payment on NoBrokerPay?',
        answer: 'Simply register on NoBroker, add your landlord details, and make payments through multiple payment options available.'
      },
      {
        question: 'How can I know my payment status?',
        answer: 'You can check your payment status in the History section or receive instant notifications on your registered mobile number.'
      },
      {
        question: 'How do I earn cashback/rewards with NoBrokerPay?',
        answer: 'Cashback is automatically credited to your account after successful payment. Check our rewards program for more details.'
      },
      {
        question: 'How will my rent payment reflect in my landlord\'s bank account?',
        answer: 'Payments are processed within 1-2 business days and directly credited to the landlord\'s registered bank account.'
      }
    ],
    'school_fee': [
      {
        question: 'How do I pay school fees online?',
        answer: 'You can pay school fees through our platform by selecting your school, entering student details, and making secure online payment.'
      },
      {
        question: 'Which schools are supported?',
        answer: 'We support major schools across cities. Search for your school on our platform to check availability.'
      },
      {
        question: 'Are there any transaction charges?',
        answer: 'Transaction charges vary by payment method. Details are displayed before payment confirmation.'
      },
      {
        question: 'Will I get a payment receipt?',
        answer: 'Yes, payment receipts are sent via email and SMS immediately after successful payment.'
      }
    ],
    'seller_plans': [
      {
        question: 'What seller plans are available?',
        answer: 'We offer Basic, Premium, and Elite seller plans with varying levels of property promotion, photography, and sales assistance.'
      },
      {
        question: 'How do seller plans help me sell faster?',
        answer: 'Seller plans provide professional photography, premium listing placement, dedicated sales support, and wider visibility to potential buyers.'
      },
      {
        question: 'What is included in the Elite plan?',
        answer: 'Elite plan includes premium photography, virtual tours, social media promotion, legal assistance, and priority customer support.'
      }
    ],
    'tenant_plans': [
      {
        question: 'What are tenant plans?',
        answer: 'Tenant plans are subscription packages that help tenants find verified properties, get rental agreements, and access move-in services.'
      },
      {
        question: 'Do tenant plans include property visits?',
        answer: 'Yes, tenant plans include scheduled property visits with our relationship managers.'
      },
      {
        question: 'Can I get a refund if I don\'t find a property?',
        answer: 'Refund policy varies by plan. Check terms and conditions or contact support for details.'
      }
    ],
    'unsubscribe': [
      {
        question: 'How do I unsubscribe from services?',
        answer: 'You can unsubscribe from any service through your account settings or by contacting customer support.'
      },
      {
        question: 'Will I get a refund on unsubscribing?',
        answer: 'Refunds are processed as per our refund policy based on service usage and cancellation timeline.'
      },
      {
        question: 'Can I pause my subscription instead?',
        answer: 'Yes, some services allow subscription pause. Check with customer support for availability.'
      }
    ],
    'user_registration': [
      {
        question: 'How do I register on the platform?',
        answer: 'Click on Sign Up, enter your mobile number, verify OTP, and complete your profile to start using our services.'
      },
      {
        question: 'Is registration free?',
        answer: 'Yes, registration on our platform is completely free for all users.'
      },
      {
        question: 'What information do I need to provide?',
        answer: 'Basic information required includes name, mobile number, email, and city. Additional details can be added for better service.'
      }
    ],
    'utility_payments': [
      {
        question: 'What utility payments can I make?',
        answer: 'You can pay electricity bills, water bills, gas bills, property tax, and maintenance charges through our platform.'
      },
      {
        question: 'Are there any charges for utility payments?',
        answer: 'Most utility payments are free. Some service providers may charge a convenience fee.'
      },
      {
        question: 'How long does payment processing take?',
        answer: 'Payments are processed instantly and reflected in your account within 24-48 hours.'
      }
    ],
    'others': [
      {
        question: 'What other services do you offer?',
        answer: 'We offer various additional services including pest control, security services, solar installation, and more. Contact us for specific requirements.'
      },
      {
        question: 'How can I request a custom service?',
        answer: 'You can submit custom service requests through our platform or contact customer support with your requirements.'
      },
      {
        question: 'Do you provide commercial services?',
        answer: 'Yes, we provide services for both residential and commercial properties. Contact us for commercial service details.'
      }
    ]
  };

  const getCurrentFAQs = () => {
    return serviceFAQs[selectedService] || serviceFAQs['default'];
  };

  const handleFAQClick = (faq: {question: string, answer: string}) => {
    setSelectedFAQ(faq);
    setCurrentView('faq-detail');
  };

  const handleBackToFAQs = () => {
    setCurrentView('service-faq');
    setSelectedFAQ(null);
  };

  const handleBackToServices = () => {
    setCurrentView('initial');
    setSelectedService('');
    setSelectedFAQ(null);
  };

  const services = [
    {
      id: 'nri',
      icon: Globe,
      label: 'NRI Services',
      description: 'Services for NRIs',
      action: 'nri_services'
    },
    {
      id: 'ac',
      icon: Wind,
      label: 'Ac Service & Repair',
      description: 'AC maintenance',
      action: 'ac_service'
    },
    {
      id: 'buyer',
      icon: Search,
      label: 'Want to Buy',
      description: 'Find property',
      action: 'Want to buy a property'
    },
    {
      id: 'buyer-plans',
      icon: ShoppingBag,
      label: 'Buyer Plans',
      description: 'Buyer packages',
      action: 'buyer_plans'
    },
    {
      id: 'agent',
      icon: UserCircle,
      label: 'Agent',
      description: 'Manage listings',
      action: 'Agent'
    },
    {
      id: 'builder',
      icon: Building2,
      label: 'Builder',
      description: 'Showcase projects',
      action: 'Builder'
    },
    {
      id: 'carpentry',
      icon: Hammer,
      label: 'Carpentry',
      description: 'Wood work services',
      action: 'carpentry'
    },
    {
      id: 'cpms',
      icon: FileCheck,
      label: 'CPMS',
      description: 'Property management',
      action: 'cpms'
    },
    {
      id: 'electrician',
      icon: Zap,
      label: 'Electrician',
      description: 'Electrical services',
      action: 'electrician'
    },
    {
      id: 'furniture',
      icon: Sofa,
      label: 'Furniture',
      description: 'Furniture services',
      action: 'furniture'
    },
    {
      id: 'cleaning',
      icon: Sparkles,
      label: 'Home Cleaning',
      description: 'Cleaning services',
      action: 'home_cleaning'
    },
    {
      id: 'interiors',
      icon: PaintBucket,
      label: 'Home Interiors',
      description: 'Interior design',
      action: 'home_interiors'
    },
    {
      id: 'renovation',
      icon: Wrench,
      label: 'Home Renovation',
      description: 'Renovation services',
      action: 'home_renovation'
    },
    {
      id: 'legal',
      icon: Scale,
      label: 'Legal Services',
      description: 'Legal assistance',
      action: 'legal_services'
    },
    {
      id: 'loan',
      icon: BadgeDollarSign,
      label: 'Loan Services',
      description: 'Home loans',
      action: 'loan_services'
    },
    {
      id: 'owner',
      icon: Shield,
      label: 'Owner Plans',
      description: 'Property owner',
      action: 'owner_plans'
    },
    {
      id: 'movers',
      icon: TruckIcon,
      label: 'Packers & Movers',
      description: 'Moving services',
      action: 'packers_movers'
    },
    {
      id: 'painting',
      icon: Brush,
      label: 'Painting',
      description: 'Painting services',
      action: 'painting'
    },
    {
      id: 'plumbing',
      icon: Droplet,
      label: 'Plumbing',
      description: 'Plumbing services',
      action: 'plumbing'
    },
    {
      id: 'post',
      icon: Home,
      label: 'Post / Remove Property',
      description: 'Manage listings',
      action: 'post_property'
    },
    {
      id: 'rental',
      icon: FileText,
      label: 'Rental Agreement',
      description: 'Rental contracts',
      action: 'rental_agreement'
    },
    {
      id: 'rentpay',
      icon: CreditCard,
      label: 'Rent Pay',
      description: 'Pay rent online',
      action: 'rent_pay'
    },
    {
      id: 'school',
      icon: GraduationCap,
      label: 'School Fee Payments',
      description: 'Pay school fees',
      action: 'school_fee'
    },
    {
      id: 'seller',
      icon: User,
      label: 'Seller',
      description: 'Sell property',
      action: 'Seller'
    },
    {
      id: 'seller-plans',
      icon: Shield,
      label: 'Seller Plans',
      description: 'Seller packages',
      action: 'seller_plans'
    },
    {
      id: 'tenant',
      icon: UserCheck,
      label: 'Tenant Plans',
      description: 'Rental services',
      action: 'tenant_plans'
    },
    {
      id: 'unsubscribe',
      icon: Ban,
      label: 'Unsubscribe',
      description: 'Manage subscription',
      action: 'unsubscribe'
    },
    {
      id: 'registration',
      icon: UserPlus,
      label: 'User Registration',
      description: 'Create account',
      action: 'user_registration'
    },
    {
      id: 'utility',
      icon: Receipt,
      label: 'Utility Payments',
      description: 'Pay bills',
      action: 'utility_payments'
    },
    {
      id: 'others',
      icon: MoreHorizontal,
      label: 'Others',
      description: 'Other services',
      action: 'others'
    }
  ];

  const renderServiceFAQView = () => {
    const service = services.find(s => s.action === selectedService);
    const faqs = getCurrentFAQs();
    
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-white via-red-50/30 to-white">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 bg-gradient-to-br from-red-50 to-white border-b border-red-100/50 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={handleBackToServices}
              className="text-gray-700 hover:text-brand-red hover:bg-red-50 p-1.5 sm:p-2 -ml-1 sm:-ml-2 mr-2 rounded-lg transition-all duration-200"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-800">
              {service?.label || selectedService.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* FAQ List */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 scrollbar-hide">
          <div className="space-y-2 sm:space-y-3">
            {faqs.map((faq, index) => (
              <button
                key={index}
                onClick={() => handleFAQClick(faq)}
                className="w-full p-3 sm:p-4 bg-white hover:bg-gradient-to-br hover:from-red-50 hover:to-white rounded-xl border border-gray-200 hover:border-brand-red transition-all duration-300 text-left group hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-800 flex-1 pr-2 sm:pr-3 font-medium">
                    {faq.question}
                  </span>
                  <span className="text-gray-400 group-hover:text-brand-red text-lg sm:text-xl transition-colors">›</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex border-t border-gray-200 bg-white shadow-lg">
          <button 
            onClick={handleBackToServices}
            className="flex-1 flex flex-col items-center py-3 sm:py-3.5 text-brand-red border-r border-gray-200 hover:bg-red-50/50 transition-colors"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
            <span className="text-[10px] sm:text-xs font-semibold">Help Center</span>
          </button>
          <button 
            onClick={handleHistoryClick}
            className="flex-1 flex flex-col items-center py-3 sm:py-3.5 text-gray-500 hover:text-brand-red hover:bg-red-50/50 transition-colors"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
            <span className="text-[10px] sm:text-xs font-semibold">History</span>
          </button>
        </div>
      </div>
    );
  };

  const renderFAQDetailView = () => {
    const service = services.find(s => s.action === selectedService);
    
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-white via-red-50/30 to-white">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 bg-gradient-to-br from-red-50 to-white border-b border-red-100/50 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={handleBackToFAQs}
              className="text-gray-700 hover:text-brand-red hover:bg-red-50 p-1.5 sm:p-2 -ml-1 sm:-ml-2 mr-2 rounded-lg transition-all duration-200"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-800">
              {service?.label || selectedService.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* FAQ Detail */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 scrollbar-hide">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3 leading-snug">
              {selectedFAQ?.question}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {selectedFAQ?.answer}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-red-100/50">
            <p className="text-xs sm:text-sm text-gray-700 font-semibold mb-3 sm:mb-4">Still have an issue? Chat with us</p>
            <a 
              href="mailto:homehni8@gmail.com?subject=Support Query - Need Assistance"
              className="w-full p-3 sm:p-4 bg-white hover:bg-gradient-to-br hover:from-red-50 hover:to-white rounded-xl border border-gray-200 hover:border-brand-red transition-all duration-300 flex items-center justify-between group hover:shadow-md"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-50 to-white rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 group-hover:shadow-sm transition-shadow border border-red-100/50">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-brand-red" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">Message us</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Let us know about your query</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-brand-red text-lg sm:text-xl transition-colors">›</span>
            </a>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex border-t border-gray-200 bg-white shadow-lg">
          <button 
            onClick={handleBackToServices}
            className="flex-1 flex flex-col items-center py-3 sm:py-3.5 text-brand-red border-r border-gray-200 hover:bg-red-50/50 transition-colors"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
            <span className="text-[10px] sm:text-xs font-semibold">Help Center</span>
          </button>
          <button 
            onClick={handleHistoryClick}
            className="flex-1 flex flex-col items-center py-3 sm:py-3.5 text-gray-500 hover:text-brand-red hover:bg-red-50/50 transition-colors"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
            <span className="text-[10px] sm:text-xs font-semibold">History</span>
          </button>
        </div>
      </div>
    );
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (currentView === 'plan-support' || currentView === 'property-support') {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [planChatMessages, showDetailsForm, propertyChatMessages, showPropertyDetailsForm, currentView]);

  const handleHistoryClick = () => {
    if (location.pathname === '/plans') {
      setCurrentView('plan-support');
      setPlanChatStep('budget');
      setShowDetailsForm(false);
      setPlanChatMessages([
        {
          id: '1',
          text: 'Hi, I can help you with selection of right plan. What is your rent budget?',
          isBot: true,
          timestamp: new Date()
        }
      ]);
    } else if (location.pathname.startsWith('/property/')) {
      setCurrentView('property-support');
      setPropertyChatStep('budget');
      setShowPropertyDetailsForm(false);
      setPropertyChatMessages([
        {
          id: '1',
          text: 'Hi, I can help you with this property. What is your rent budget?',
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  };

  const handlePlanChatSend = () => {
    if (planChatInput.trim() === '') return;

    const userMessage: Message = {
      id: String(Date.now()),
      text: planChatInput,
      isBot: false,
      timestamp: new Date()
    };

    setPlanChatMessages(prev => [...prev, userMessage]);
    const budgetValue = planChatInput;
    setPlanChatInput('');

    // Bot response based on step
    setTimeout(() => {
      let botResponse: Message;
      
      if (planChatStep === 'budget') {
        botResponse = {
          id: String(Date.now() + 1),
          text: 'Before moving forward, kindly provide your details below',
          isBot: true,
          timestamp: new Date()
        };
        setPlanChatMessages(prev => [...prev, botResponse]);
        setPlanChatStep('details-form');
        setUserDetails(prev => ({ ...prev, budget: budgetValue }));
      } else if (planChatStep === 'follow-up') {
        botResponse = {
          id: String(Date.now() + 1),
          text: 'Thank you for the information! Our executive will make a call or contact you shortly.',
          isBot: true,
          timestamp: new Date()
        };
        setPlanChatMessages(prev => [...prev, botResponse]);
        setPlanChatStep('complete');
      }
    }, 1000);
  };

  const handleFillDetailsClick = () => {
    setShowDetailsForm(true);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      return;
    }

    setShowDetailsForm(false);

    setTimeout(() => {
      const thankYouMessage: Message = {
        id: String(Date.now()),
        text: 'Thank you for providing your details!',
        isBot: true,
        timestamp: new Date()
      };
      setPlanChatMessages(prev => [...prev, thankYouMessage]);

      setTimeout(() => {
        const followUpMessage: Message = {
          id: String(Date.now() + 1),
          text: `Got it, your budget is ${userDetails.budget || 'your specified amount'}. Could you also let me know your preferred location and the BHK type you are looking for?`,
          isBot: true,
          timestamp: new Date()
        };
        setPlanChatMessages(prev => [...prev, followUpMessage]);
        setPlanChatStep('follow-up');
      }, 1000);
    }, 500);
  };

  // Property chat handlers
  const handlePropertyChatSend = () => {
    if (propertyChatInput.trim() === '') return;

    const userMessage: Message = {
      id: String(Date.now()),
      text: propertyChatInput,
      isBot: false,
      timestamp: new Date()
    };

    setPropertyChatMessages(prev => [...prev, userMessage]);
    const inputValue = propertyChatInput;
    setPropertyChatInput('');

    setTimeout(() => {
      let botResponse: Message;
      
      if (propertyChatStep === 'budget') {
        botResponse = {
          id: String(Date.now() + 1),
          text: 'Before moving forward, kindly provide your details below',
          isBot: true,
          timestamp: new Date()
        };
        setPropertyChatMessages(prev => [...prev, botResponse]);
        setPropertyChatStep('details-form');
        setPropertyUserDetails(prev => ({ ...prev, budget: inputValue }));
      } else if (propertyChatStep === 'requirements') {
        botResponse = {
          id: String(Date.now() + 1),
          text: 'Thanks for sharing! Our executive will get in touch with you soon to assist further. Typically within the next 15 to 20 minutes. If you have any urgent requirements, please call us on +918690003500.',
          isBot: true,
          timestamp: new Date()
        };
        setPropertyChatMessages(prev => [...prev, botResponse]);
        setPropertyChatStep('complete');
      }
    }, 1000);
  };

  const handlePropertyFillDetailsClick = () => {
    setShowPropertyDetailsForm(true);
  };

  const handlePropertyDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyUserDetails.name || !propertyUserDetails.email || !propertyUserDetails.phone) {
      return;
    }

    setShowPropertyDetailsForm(false);

    setTimeout(() => {
      const thankYouMessage: Message = {
        id: String(Date.now()),
        text: 'Thank you for providing your details!',
        isBot: true,
        timestamp: new Date()
      };
      setPropertyChatMessages(prev => [...prev, thankYouMessage]);

      setTimeout(() => {
        const followUpMessage: Message = {
          id: String(Date.now() + 1),
          text: 'Got it! Can you tell me your preferred location(s) and any specific requirements you may have, like pet-friendly or furnished?',
          isBot: true,
          timestamp: new Date()
        };
        setPropertyChatMessages(prev => [...prev, followUpMessage]);
        setPropertyChatStep('requirements');
      }, 1000);
    }, 500);
  };

  const renderPlanSupportView = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
            <Home size={16} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900">Home HNI Support</span>
        </div>
        <button 
          onClick={() => {
            setIsOpen(false);
            setCurrentView('initial');
            setPlanChatMessages([]);
            setShowDetailsForm(false);
            setUserDetails({ name: '', email: '', phone: '', budget: '' });
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {/* Today Label */}
        <div className="flex justify-center">
          <span className="text-xs text-gray-400 uppercase tracking-wider">TODAY</span>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-gray-700">
            Call only Home HNI-registered numbers for better connectivity and avoid unnecessary risks.
          </p>
        </div>

        {/* Support Joined Message */}
        <div className="flex justify-center">
          <span className="text-xs text-gray-400">Home HNI Support joined the chat</span>
        </div>

        {/* Dynamic Messages */}
        {planChatMessages.map((msg, index) => (
          <div key={msg.id} className="flex items-start space-x-2">
            {msg.isBot && (
              <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                <Home size={14} className="text-white" />
              </div>
            )}
            <div className={`flex-1 ${!msg.isBot ? 'flex justify-end' : ''}`}>
              {msg.isBot && (
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-sm font-semibold text-brand-red">Home HNI</span>
                </div>
              )}
              <div className={`rounded-lg p-3 shadow-sm ${
                msg.isBot 
                  ? 'bg-white rounded-tl-none' 
                  : 'bg-brand-red text-white rounded-tr-none max-w-[80%]'
              }`}>
                <p className="text-sm">{msg.text}</p>
                
                {/* Show Fill Details button in the same message */}
                {msg.isBot && planChatStep === 'details-form' && 
                 index === planChatMessages.length - 1 && !showDetailsForm && (
                  <button 
                    onClick={handleFillDetailsClick}
                    className="w-full mt-3 bg-brand-red text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-brand-maroon-dark transition-colors"
                  >
                    Fill details
                  </button>
                )}
              </div>
              {msg.isBot && (
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Details Form */}
        {showDetailsForm && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
              <Home size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm">
                <p className="text-sm text-gray-800 mb-3 font-medium">Fill Details</p>
                <form onSubmit={handleDetailsSubmit} className="space-y-3">
                  <Input
                    placeholder="Name"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="text-sm"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="text-sm"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="text-sm"
                  />
                  <Button 
                    type="submit"
                    className="w-full bg-brand-red hover:bg-brand-maroon-dark text-white"
                  >
                    Submit
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible element at the end for auto-scroll */}
        <div ref={chatMessagesEndRef} />
      </div>

      {/* Input Area */}
      {planChatStep !== 'complete' && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type your message here"
              value={planChatInput}
              onChange={(e) => setPlanChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePlanChatSend()}
              className="flex-1 text-sm"
            />
            <Button
              onClick={handlePlanChatSend}
              className="bg-brand-red hover:bg-brand-maroon-dark px-4"
              disabled={planChatInput.trim() === ''}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderPropertySupportView = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
            <Home size={16} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900">Home HNI Support</span>
        </div>
        <button 
          onClick={() => {
            setIsOpen(false);
            setCurrentView('initial');
            setPropertyChatMessages([]);
            setShowPropertyDetailsForm(false);
            setPropertyUserDetails({ name: '', email: '', phone: '', budget: '' });
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {/* Today Label */}
        <div className="flex justify-center">
          <span className="text-xs text-gray-400 uppercase tracking-wider">TODAY</span>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-gray-700">
            Call only Home HNI-registered numbers for better connectivity and avoid unnecessary risks.
          </p>
        </div>

        {/* Support Joined Message */}
        <div className="flex justify-center">
          <span className="text-xs text-gray-400">Home HNI Support joined the chat</span>
        </div>

        {/* Dynamic Messages */}
        {propertyChatMessages.map((msg, index) => (
          <div key={msg.id} className="flex items-start space-x-2">
            {msg.isBot && (
              <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                <Home size={14} className="text-white" />
              </div>
            )}
            <div className={`flex-1 ${!msg.isBot ? 'flex justify-end' : ''}`}>
              {msg.isBot && (
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-sm font-semibold text-brand-red">Home HNI</span>
                </div>
              )}
              <div className={`rounded-lg p-3 shadow-sm ${
                msg.isBot 
                  ? 'bg-white rounded-tl-none' 
                  : 'bg-brand-red text-white rounded-tr-none max-w-[80%]'
              }`}>
                <p className="text-sm">{msg.text}</p>
                
                {/* Show Fill Details button in the same message */}
                {msg.isBot && propertyChatStep === 'details-form' && 
                 index === propertyChatMessages.length - 1 && !showPropertyDetailsForm && (
                  <button 
                    onClick={handlePropertyFillDetailsClick}
                    className="w-full mt-3 bg-brand-red text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-brand-maroon-dark transition-colors"
                  >
                    Fill details
                  </button>
                )}
              </div>
              {msg.isBot && (
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Details Form */}
        {showPropertyDetailsForm && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
              <Home size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm">
                <p className="text-sm text-gray-800 mb-3 font-medium">Fill Details</p>
                <form onSubmit={handlePropertyDetailsSubmit} className="space-y-3">
                  <Input
                    placeholder="Name"
                    value={propertyUserDetails.name}
                    onChange={(e) => setPropertyUserDetails(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="text-sm"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={propertyUserDetails.email}
                    onChange={(e) => setPropertyUserDetails(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="text-sm"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone"
                    value={propertyUserDetails.phone}
                    onChange={(e) => setPropertyUserDetails(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="text-sm"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-brand-red hover:bg-brand-maroon-dark text-sm"
                  >
                    Submit
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}

        <div ref={chatMessagesEndRef} />
      </div>

      {/* Input Section */}
      {propertyChatStep !== 'details-form' && propertyChatStep !== 'complete' && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={propertyChatInput}
              onChange={(e) => setPropertyChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePropertyChatSend()}
              className="flex-1 text-sm"
            />
            <Button
              onClick={handlePropertyChatSend}
              className="bg-brand-red hover:bg-brand-maroon-dark px-4"
              disabled={propertyChatInput.trim() === ''}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderInitialView = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-white via-red-50/30 to-white">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 bg-gradient-to-br from-red-50 to-white border-b border-red-100/50 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-brand-red p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <X size={20} className="sm:w-5 sm:h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 pr-8">Help Center</h1>
        <p className="text-xs sm:text-sm text-gray-600 flex items-center">
          <Check className="text-brand-red mr-1 w-4 h-4 sm:w-5 sm:h-5" />
          One-Stop Solution for all Real Estate Services
        </p>
      </div>

      {/* Services Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Section Header */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <h2 className="text-[10px] sm:text-xs font-bold text-brand-red uppercase tracking-widest">
            CHOOSE A SERVICE
          </h2>
        </div>
        
        {/* Scrollable Services Grid - Hidden Scrollbar */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 scrollbar-hide">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 pb-4">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => handleOptionClick(service.action)}
                  className="flex flex-col items-center p-2 sm:p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-brand-red group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-lg flex items-center justify-center mb-1 sm:mb-1.5 group-hover:shadow-md transition-shadow">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-brand-red" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-800 text-center leading-tight">
                    {service.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex border-t border-gray-200 bg-white shadow-lg">
        <button className="flex-1 flex flex-col items-center py-3 sm:py-3.5 text-brand-red border-r border-gray-200 hover:bg-red-50/50 transition-colors">
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
          <span className="text-[10px] sm:text-xs font-semibold">Help Center</span>
        </button>
        <button 
          onClick={handleHistoryClick}
          className="flex-1 flex flex-col items-center py-3 sm:py-3.5 text-gray-500 hover:text-brand-red hover:bg-red-50/50 transition-colors"
        >
          <History className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
          <span className="text-[10px] sm:text-xs font-semibold">History</span>
        </button>
      </div>
    </div>
  );

  const renderChatView = () => (
    <CardContent className="p-0 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 max-h-80">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg text-sm break-words ${
                message.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-brand-red text-white'
              }`}
            >
              <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
              
              {message.propertyCard && (
                <div className="mt-2 sm:mt-3 bg-white rounded-lg p-2 sm:p-3 border">
                  <img
                    src={message.propertyCard.image}
                    alt={message.propertyCard.title}
                    className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-semibold text-gray-800 text-xs sm:text-sm leading-tight">{message.propertyCard.title}</h4>
                  <p className="text-brand-red font-bold text-sm sm:text-lg">{message.propertyCard.price}</p>
                  <p className="text-gray-600 text-xs flex items-center mt-1">
                    <MapPin size={10} className="mr-1 sm:w-3 sm:h-3" />
                    <span className="truncate">{message.propertyCard.location}</span>
                  </p>
                  <div className="flex items-center space-x-2 sm:space-x-4 mt-2 text-xs text-gray-600">
                    <span className="flex items-center">
                      <Bed size={10} className="mr-1 sm:w-3 sm:h-3" />
                      {message.propertyCard.bedrooms} BHK
                    </span>
                    <span className="flex items-center">
                      <Bath size={10} className="mr-1 sm:w-3 sm:h-3" />
                      {message.propertyCard.bathrooms} Bath
                    </span>
                    <span className="flex items-center">
                      <Square size={10} className="mr-1 sm:w-3 sm:h-3" />
                      {message.propertyCard.area}
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-3">
                    <Button size="sm" className="flex-1 h-7 sm:h-8 text-xs bg-brand-red hover:bg-brand-maroon-dark">
                      <Phone size={10} className="mr-1 sm:w-3 sm:h-3" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-7 sm:h-8 text-xs">
                      <Calendar size={10} className="mr-1 sm:w-3 sm:h-3" />
                      Visit
                    </Button>
                  </div>
                </div>
              )}

              {message.options && (
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                  {message.options.map((option) => (
                    <Badge
                      key={option}
                      variant="outline"
                      className="cursor-pointer hover:bg-brand-red hover:text-white transition-colors text-xs px-2 py-1"
                      onClick={() => handleOptionClick(option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 text-xs sm:text-sm"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-brand-red hover:bg-brand-maroon-dark px-3 sm:px-4"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </CardContent>
  );

  const showInitialView = messages.length === 1 && conversationStep === 'role_selection' && currentView === 'initial';

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {!isOpen && (
        <Button
          onClick={() => {
            setIsOpen(true);
            // If on plans page, open directly to plan support chat
            if (location.pathname === '/plans') {
              setCurrentView('plan-support');
              setPlanChatStep('budget');
              setShowDetailsForm(false);
              setPlanChatMessages([
                {
                  id: '1',
                  text: 'Hi, I can help you with selection of right plan. What is your rent budget?',
                  isBot: true,
                  timestamp: new Date()
                }
              ]);
            } 
            // If on property details page, open directly to property support chat
            else if (location.pathname.startsWith('/property/')) {
              setCurrentView('property-support');
              setPropertyChatStep('budget');
              setShowPropertyDetailsForm(false);
              setPropertyChatMessages([
                {
                  id: '1',
                  text: 'Hi, I can help you with this property. What is your rent budget?',
                  isBot: true,
                  timestamp: new Date()
                }
              ]);
            }
          }}
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-brand-red hover:bg-brand-maroon-dark shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Home size={24} className="text-white sm:w-7 sm:h-7" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-0 right-0 left-0 h-[85vh] w-full shadow-2xl bg-white rounded-t-3xl border-0 overflow-hidden sm:relative sm:w-96 sm:h-[600px] sm:rounded-3xl">
          {!showInitialView && currentView === 'initial' && (
            <CardHeader className="bg-brand-red text-white p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
                    <Home size={16} className="text-brand-red sm:w-5 sm:h-5" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold">Real Estate Assistant</CardTitle>
                </div>
              </div>
            </CardHeader>
          )}

          {currentView === 'plan-support' ? (
            <div className="h-full flex flex-col">
              {renderPlanSupportView()}
            </div>
          ) : currentView === 'property-support' ? (
            <div className="h-full flex flex-col">
              {renderPropertySupportView()}
            </div>
          ) : currentView === 'service-faq' ? (
            <div className="h-full flex flex-col">
              {renderServiceFAQView()}
            </div>
          ) : currentView === 'faq-detail' ? (
            <div className="h-full flex flex-col">
              {renderFAQDetailView()}
            </div>
          ) : showInitialView ? (
            <div className="h-full flex flex-col">
              {renderInitialView()}
            </div>
          ) : (
            renderChatView()
          )}
        </Card>
      )}
    </div>
  );
};

export default ChatBot;