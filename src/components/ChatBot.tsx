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

interface ChatBotProps {
  searchContext?: {
    activeTab: 'buy' | 'rent' | 'commercial' | 'land';
  };
  serviceContext?: {
    service: 'loans' | 'home-security' | 'packers-movers' | 'legal-services' | 'handover-services' | 'property-management' | 'architects' | 'painting-cleaning' | 'interior-design';
  };
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

const ChatBot = ({ searchContext, serviceContext }: ChatBotProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get context-aware initial message
  const getInitialMessage = () => {
    if (searchContext) {
      const { activeTab } = searchContext;
      const tabMessages = {
        buy: 'Hi! I can help you with selection of the right property. What is your budget for buying?',
        rent: 'Hi! I can help you with selection of the right property. What is your rent budget?',
        commercial: 'Hi! I can help you with selection of the right commercial space. What is your budget?',
        land: 'Hi! I can help you with selection of the right land/plot. What is your budget?'
      };
      
      const budgetOptions = {
        buy: ['Under 50L', '50L-1Cr', '1-2Cr', '2-5Cr', '5Cr+'],
        rent: ['Under 10K', '10K-25K', '25K-50K', '50K-1L', '1L+'],
        commercial: ['Under 50L', '50L-1Cr', '1-2Cr', '2-5Cr', '5Cr+'],
        land: ['Under 50L', '50L-1Cr', '1-2Cr', '2-5Cr', '5Cr+']
      };
      
      return {
        id: '1',
        text: tabMessages[activeTab],
        isBot: true,
        timestamp: new Date(),
        options: budgetOptions[activeTab]
      };
    }
    
    return {
      id: '1',
      text: 'Hello! I\'m your AI real estate assistant. I can help you with all your property needs. Let me know your role to get started:',
      isBot: true,
      timestamp: new Date(),
      options: ['Seller', 'Agent', 'Builder', 'Want to buy a property']
    };
  };
  
  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState(searchContext ? 'budget_selection' : 'role_selection');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [userName, setUserName] = useState('');
  const [currentView, setCurrentView] = useState<'initial' | 'chat' | 'service-faq' | 'faq-detail' | 'plan-support' | 'property-support' | 'service-support'>('initial');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedFAQ, setSelectedFAQ] = useState<{question: string, answer: string} | null>(null);
  const [planChatMessages, setPlanChatMessages] = useState<Message[]>([]);
  const [planChatStep, setPlanChatStep] = useState<'budget' | 'details-form' | 'follow-up' | 'complete'>('budget');
  const [planChatInput, setPlanChatInput] = useState('');
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '', phone: '', budget: '' });
  
  // Service-specific chat states
  const [serviceChatMessages, setServiceChatMessages] = useState<Message[]>([]);
  const [serviceChatStep, setServiceChatStep] = useState<'intro' | 'details-form' | 'follow-up' | 'complete'>('intro');
  const [serviceChatInput, setServiceChatInput] = useState('');
  const [showServiceDetailsForm, setShowServiceDetailsForm] = useState(false);
  const [serviceUserDetails, setServiceUserDetails] = useState({ name: '', email: '', phone: '', service: '' });
  
  // Property-specific chat states
  const [propertyChatMessages, setPropertyChatMessages] = useState<Message[]>([]);
  const [propertyChatStep, setPropertyChatStep] = useState<'budget' | 'details-form' | 'requirements' | 'complete'>('budget');
  const [propertyChatInput, setPropertyChatInput] = useState('');
  const [showPropertyDetailsForm, setShowPropertyDetailsForm] = useState(false);
  const [propertyUserDetails, setPropertyUserDetails] = useState({ name: '', email: '', phone: '', budget: '' });
  
  // Search context specific states
  const [searchDetailsForm, setSearchDetailsForm] = useState({ name: '', email: '', phone: '' });
  const [showSearchDetailsForm, setShowSearchDetailsForm] = useState(false);
  
  // Ref for auto-scrolling chat
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  
  // Auto-scroll to bottom when messages change (skip first render)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Reset chat when activeTab changes in search context
  useEffect(() => {
    if (searchContext) {
      const initialMsg = getInitialMessage();
      setMessages([initialMsg]);
      setConversationStep('budget_selection');
      setUserPreferences({});
      setSearchDetailsForm({ name: '', email: '', phone: '' });
      setShowSearchDetailsForm(false);
      setInputValue('');
    }
  }, [searchContext?.activeTab]);

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
            } else {
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'Please select "Post Your Property" to continue.',
                options: ['Post Your Property']
              };
            }
          } else if (conversationStep === 'user_details_collection') {
            if (userMessage === 'Fill details') {
              // User clicked the button, show form inline
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'Please fill in your details:',
              };
            } else if (userMessage === 'Details submitted') {
              // After form submission
              setConversationStep('location_requirements');
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: `Thank you for providing your details! Can you tell me your preferred location(s) and any specific requirements you may have, like pet-friendly, furnished, or parking?`,
              };
            } else {
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'Please fill in your details to continue.',
              };
            }
          } else if (conversationStep === 'location_requirements') {
            setUserPreferences(prev => ({ ...prev, location: userMessage }));
            setConversationStep('complete');
            finalResponse = {
              id: String(Date.now() + 2),
              isBot: true,
              timestamp: new Date(),
              text: `Thanks for sharing! Our executive will get in touch with you soon to assist further. Typically within the next 15 to 20 minutes. If you have any urgent requirements, please call us on +918690003500.`,
            };
          } else if (conversationStep === 'property_type_selection') {
            if (searchContext) {
              // In search context, ask for BHK/size after property type
              setUserPreferences(prev => ({ ...prev, propertyType: userMessage }));
              
              if (['Flat/Apartment', 'Independent House', 'Villa'].includes(userMessage)) {
                setConversationStep('bhk_selection');
                finalResponse = {
                  id: String(Date.now() + 2),
                  isBot: true,
                  timestamp: new Date(),
                  text: `Perfect! How many bedrooms are you looking for in your ${userMessage.toLowerCase()}?`,
                  options: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK', 'Any']
                };
              } else {
                // For other property types, ask for location
                setConversationStep('location_preference');
                finalResponse = {
                  id: String(Date.now() + 2),
                  isBot: true,
                  timestamp: new Date(),
                  text: `Great choice! Which areas are you interested in? (Type a city or locality)`,
                };
              }
            } else if (propertyTypes.includes(userMessage)) {
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
            // Handle budget selection in search context
            if (searchContext) {
              setUserPreferences(prev => ({ ...prev, budget: userMessage }));
              setConversationStep('user_details_collection');
              setShowSearchDetailsForm(true);
              
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: `Got it! Before moving forward, kindly provide your details below:`,
                options: ['Fill details']
              };
            } else {
              const selectedBudget = budgetRanges.find(range => range.label === userMessage);
              if (selectedBudget) {
                setUserPreferences(prev => ({ ...prev, budget: userMessage }));
                setConversationStep('location_input');
                
                finalResponse = {
                  id: String(Date.now() + 2),
                  isBot: true,
                  timestamp: new Date(),
                  text: `Great! Now, which location are you interested in? (Type a city or locality)`,
                };
              } else {
                finalResponse = {
                  id: String(Date.now() + 2),
                  isBot: true,
                  timestamp: new Date(),
                  text: 'Please select a valid budget range:',
                  options: budgetRanges.map(range => range.label)
                };
              }
            }
          } else if (conversationStep === 'location_input') {
            // User entered location, now show properties based on their role
            setUserPreferences(prev => ({ ...prev, location: userMessage }));
            
            // Navigate to search page with the location filter
            const params = new URLSearchParams({
              type: 'buy',
              location: userMessage
            });
            
            navigate(`/search?${params.toString()}`);
            setIsOpen(false);
            return resolve(undefined);
          } else if (conversationStep === 'bhk_selection') {
            setUserPreferences(prev => ({ ...prev, bedrooms: userMessage }));
            setConversationStep('location_preference');
            finalResponse = {
              id: String(Date.now() + 2),
              isBot: true,
              timestamp: new Date(),
              text: `Perfect! Which areas are you interested in? (Type a city or locality)`,
            };
          } else if (conversationStep === 'location_preference') {
            setUserPreferences(prev => ({ ...prev, location: userMessage }));
            setConversationStep('complete');
            finalResponse = {
              id: String(Date.now() + 2),
              isBot: true,
              timestamp: new Date(),
              text: `Excellent! I'm searching for ${userPreferences.propertyType} properties${userPreferences.bedrooms && userPreferences.bedrooms !== 'Any' ? ` with ${userPreferences.bedrooms}` : ''} in ${userMessage} within your budget. Would you like me to show you the results?`,
              options: ['Show Properties', 'Refine Search', 'Contact Support']
            };
          } else if (conversationStep === 'complete') {
            if (userMessage === 'Show Properties') {
              // Apply filters and close chatbot
              setIsOpen(false);
              return resolve(undefined);
            } else if (userMessage === 'Refine Search') {
              // Reset to budget selection
              setConversationStep('budget_selection');
              const budgetOptions = {
                buy: ['Under 50L', '50L-1Cr', '1-2Cr', '2-5Cr', '5Cr+'],
                rent: ['Under 10K', '10K-25K', '25K-50K', '50K-1L', '1L+'],
                commercial: ['Under 50L', '50L-1Cr', '1-2Cr', '2-5Cr', '5Cr+'],
                land: ['Under 50L', '50L-1Cr', '1-2Cr', '2-5Cr', '5Cr+']
              };
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'No problem! Let\'s refine your search. What\'s your budget range?',
                options: searchContext ? budgetOptions[searchContext.activeTab] : budgetRanges.map(range => range.label)
              };
            } else if (userMessage === 'Contact Support') {
              navigate('/contact');
              setIsOpen(false);
              return resolve(undefined);
            } else {
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: `Would you like to see the properties or refine your search?`,
                options: ['Show Properties', 'Refine Search', 'Contact Support']
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

          // Only add finalResponse if it was set
          if (finalResponse) {
            setMessages(prevMessages => [...prevMessages, finalResponse]);
          }
          resolve(undefined);
        }, 1500);
      });
    });
  };

  const handleOptionClick = (option: string) => {
    // Handle "Post Your Property" button directly
    if (option === 'Post Your Property') {
      navigate('/post-property');
      setIsOpen(false);
      return;
    }

    // If in search context, handle all options as messages through bot response
    if (searchContext) {
      const newMessage: Message = {
        id: String(Date.now()),
        text: option,
        isBot: false,
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      simulateBotResponse(option);
      return;
    }

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
      setCurrentView('chat');

      // For "Want to buy a property", ask for budget first
      if (option === 'Want to buy a property') {
        setUserPreferences(prev => ({ ...prev, role: option }));
        setConversationStep('budget_selection');

        const botMsg: Message = {
          id: String(Date.now() + 1),
          isBot: true,
          timestamp: new Date(),
          text: 'Perfect! Let\'s get started. What\'s your budget range?',
          options: budgetRanges.map(range => range.label)
        };
        setMessages((prev) => [...prev, botMsg]);
        return;
      }

      // Handle Seller/Agent/Builder - show Post Property button
      setUserPreferences(prev => ({ ...prev, role: option }));
      setConversationStep('post_property');
      const botMsgDirect: Message = {
        id: String(Date.now() + 1),
        isBot: true,
        timestamp: new Date(),
        text: `Great! As a ${option.toLowerCase()}, you can easily list your property with us. Click the button below to get started:`,
        options: ['Post Your Property']
      };
      setMessages((prev) => [...prev, botMsgDirect]);
      return;
    }

    // If we're in a conversation flow (budget selection, location, etc.), handle as message
    const conversationSteps = ['budget_selection', 'location_input', 'bhk_selection', 'location_preference', 'complete', 'location_selection', 'property_type_selection'];
    if (conversationSteps.includes(conversationStep)) {
      const newMessage: Message = {
        id: String(Date.now()),
        text: option,
        isBot: false,
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      simulateBotResponse(option);
      return;
    }

    // For all other services, open the FAQ view
    setSelectedService(option);
    setSelectedFAQ(null);
    console.log('ChatBot: service option clicked', option);
    setCurrentView('service-faq');
  };
const serviceFAQs: Record<string, {question: string, answer: string}[]> = {
  default: [
    {
      question: 'How can you help?',
      answer: 'Ask me about buying, selling, or property services. I\'ll guide you step-by-step.'
    }
  ],
  'nri_services': [
    { question: 'What NRI services do you offer?', answer: 'We offer comprehensive NRI services including property management, tenant verification, rent collection, and property maintenance for NRIs living abroad.' },
    { question: 'How can I manage my property from abroad?', answer: 'Our team handles everything from tenant finding, verification, rent collection, to property upkeep. You can monitor everything remotely through our platform.' },
    { question: 'What are the charges for NRI services?', answer: 'Our charges vary based on the service package you choose. Contact us at +918690003500 for detailed pricing tailored to your needs.' },
    { question: 'Do you handle legal documentation for NRIs?', answer: 'Yes, we assist with legal documentation including rental agreements, property registrations, and power of attorney services for NRIs.' }
  ],
  'ac_service': [
    { question: 'What AC services do you provide?', answer: 'We offer AC installation, repair, servicing, and maintenance for all major brands including split, window, and central AC systems.' },
    { question: 'How quickly can you service my AC?', answer: 'Our technicians typically arrive within 2-4 hours of booking. For urgent requests, we offer same-day service.' },
    { question: 'What brands do you service?', answer: 'We service all major AC brands including Voltas, Daikin, LG, Samsung, Hitachi, Blue Star, Carrier, and more.' },
    { question: 'Do you provide AMC packages?', answer: 'Yes, we offer Annual Maintenance Contracts (AMC) for regular AC servicing and preventive maintenance.' }
  ],
  'buyer_plans': [
    { question: 'What buyer plans do you offer?', answer: 'We offer customized buyer assistance plans including property search, site visits, documentation support, and loan facilitation.' },
    { question: 'How much do buyer plans cost?', answer: 'Our buyer plans start from affordable packages. Contact us for detailed pricing based on your requirements.' },
    { question: 'What is included in the buyer plan?', answer: 'Plans include dedicated relationship manager, priority property alerts, assisted site visits, documentation help, and negotiation support.' },
    { question: 'Can I cancel my buyer plan?', answer: 'Yes, our plans come with flexible cancellation policies. Contact our support team for details.' }
  ],
  'carpentry': [
    { question: 'What carpentry services do you provide?', answer: 'We offer custom furniture making, repairs, installation of modular furniture, door/window fixes, and wood polishing services.' },
    { question: 'Do you make custom furniture?', answer: 'Yes, we create custom furniture designs including wardrobes, beds, kitchen cabinets, study tables, and storage solutions.' },
    { question: 'What is the typical delivery time?', answer: 'Custom furniture typically takes 2-4 weeks depending on the complexity. Repairs and installations are done within 2-3 days.' },
    { question: 'Do you provide warranty?', answer: 'Yes, we provide warranty on all our carpentry work and materials used. Terms vary based on the service.' }
  ],
  'cpms': [
    { question: 'What is CPMS?', answer: 'CPMS (Complete Property Management System) is our comprehensive property management solution for landlords and property owners.' },
    { question: 'What services are included in CPMS?', answer: 'CPMS includes tenant management, rent collection, maintenance coordination, legal compliance, and detailed property reports.' },
    { question: 'How does CPMS help property owners?', answer: 'CPMS takes care of all property management hassles, ensuring timely rent, proper maintenance, and tenant satisfaction.' },
    { question: 'What are CPMS charges?', answer: 'CPMS charges are based on property type and services selected. Contact us for a customized quote.' }
  ],
  'electrician': [
    { question: 'What electrical services do you offer?', answer: 'We provide electrical repairs, wiring, switch/socket installation, appliance installation, electrical safety checks, and MCB/fuse box repairs.' },
    { question: 'Are your electricians certified?', answer: 'Yes, all our electricians are certified professionals with years of experience in residential and commercial electrical work.' },
    { question: 'Do you handle emergency electrical issues?', answer: 'Yes, we offer 24/7 emergency electrical services for urgent issues like power failures, short circuits, and electrical faults.' },
    { question: 'What are your service charges?', answer: 'Charges depend on the type of work required. We provide free inspection and quotation before starting any work.' }
  ],
  'furniture': [
    { question: 'What furniture services do you provide?', answer: 'We offer furniture rental, buying, selling, assembly, disassembly, and moving services for all types of furniture.' },
    { question: 'Do you rent furniture?', answer: 'Yes, we provide furniture on rent for short-term and long-term needs including beds, sofas, dining tables, and more.' },
    { question: 'How does furniture rental work?', answer: 'Choose your furniture, select rental duration, and we deliver and install. You can extend or return anytime with flexible terms.' },
    { question: 'Do you buy used furniture?', answer: 'Yes, we buy good condition used furniture. Our team will inspect and provide a fair quotation.' }
  ],
  'home_cleaning': [
    { question: 'What cleaning services do you offer?', answer: 'We provide deep cleaning, regular cleaning, bathroom cleaning, kitchen cleaning, sofa cleaning, and carpet cleaning services.' },
    { question: 'How long does deep cleaning take?', answer: 'Deep cleaning typically takes 4-8 hours depending on the property size and condition.' },
    { question: 'Do you provide cleaning materials?', answer: 'Yes, we bring all necessary cleaning materials, equipment, and eco-friendly cleaning products.' },
    { question: 'Can I book regular cleaning services?', answer: 'Yes, we offer daily, weekly, and monthly cleaning packages with dedicated cleaning staff.' }
  ],
  'home_interiors': [
    { question: 'What interior design services do you offer?', answer: 'We provide complete interior design including modular kitchens, wardrobes, false ceiling, lighting, flooring, and space planning.' },
    { question: 'Do you provide 3D designs?', answer: 'Yes, we create detailed 3D visualization of your space before starting the actual work so you can see the final look.' },
    { question: 'What is the typical project timeline?', answer: 'Interior projects typically take 45-90 days depending on scope. We provide detailed timelines after site visit.' },
    { question: 'Do you offer warranties?', answer: 'Yes, we provide up to 10 years warranty on modular products and 1 year service warranty on all work.' }
  ],
  'home_renovation': [
    { question: 'What renovation services do you offer?', answer: 'We provide complete home renovation including flooring, painting, plumbing, electrical work, bathroom remodeling, and kitchen upgrades.' },
    { question: 'Can you renovate while I live in the house?', answer: 'Yes, we can plan phased renovation to minimize disruption. We work in sections to ensure you can continue living comfortably.' },
    { question: 'How long does renovation take?', answer: 'Typical renovation takes 30-60 days depending on scope. We provide detailed timeline after site assessment.' },
    { question: 'Do you handle approvals and permits?', answer: 'Yes, we assist with all necessary approvals, permissions, and documentation required for renovation work.' }
  ],
  'legal_services': [
    { question: 'What legal services do you provide?', answer: 'We offer property documentation, title verification, rental agreements, sale deed preparation, legal consultation, and dispute resolution.' },
    { question: 'How do you verify property documents?', answer: 'Our legal team conducts thorough verification of property titles, encumbrance certificates, and all relevant documents.' },
    { question: 'Do you draft rental agreements?', answer: 'Yes, we draft legally sound rental agreements compliant with local laws and register them if required.' },
    { question: 'What are your legal consultation charges?', answer: 'We offer free initial consultation. Detailed charges depend on the complexity of legal services required.' }
  ],
  'loan_services': [
    { question: 'What loan services do you offer?', answer: 'We assist with home loans, loan against property, balance transfer, and top-up loans from multiple banks and NBFCs.' },
    { question: 'Which banks do you work with?', answer: 'We partner with all major banks including SBI, HDFC, ICICI, Axis, and leading NBFCs to get you the best rates.' },
    { question: 'How quickly can I get loan approval?', answer: 'With proper documentation, loan approval typically takes 7-15 days. We expedite the entire process for you.' },
    { question: 'Do you charge for loan assistance?', answer: 'Our basic loan consultation is free. We charge a nominal processing fee only after successful loan disbursement.' }
  ],
  'owner_plans': [
    { question: 'What are owner plans?', answer: 'Owner plans are comprehensive packages for property owners including tenant finding, rent assurance, maintenance, and legal support.' },
    { question: 'Do you guarantee rent payment?', answer: 'Yes, our premium plans include rent guarantee where we ensure timely rent payment even if tenant defaults.' },
    { question: 'How do you find tenants?', answer: 'We list your property on multiple platforms, conduct thorough screening, background verification, and find suitable tenants.' },
    { question: 'What maintenance support is included?', answer: 'We handle all maintenance requests, coordinate with service providers, and ensure your property is well-maintained.' }
  ],
  'packers_movers': [
    { question: 'What moving services do you provide?', answer: 'We offer local and intercity moving, packing, unpacking, loading, unloading, and transportation of household and office goods.' },
    { question: 'How do you ensure safety of items?', answer: 'We use high-quality packing materials, trained staff, and insured transportation to ensure complete safety of your belongings.' },
    { question: 'Do you provide insurance?', answer: 'Yes, we offer comprehensive transit insurance to cover any damages during the moving process.' },
    { question: 'How much do packers and movers cost?', answer: 'Charges depend on distance, volume of goods, and services required. We provide free on-site survey and quotation.' }
  ],
  'painting': [
    { question: 'What painting services do you offer?', answer: 'We provide interior and exterior painting, texture painting, waterproofing, wall putty, and wallpaper installation services.' },
    { question: 'Which paint brands do you use?', answer: 'We work with all premium brands including Asian Paints, Berger, Dulux, and Nerolac. You can choose your preferred brand.' },
    { question: 'How long does painting take?', answer: 'A typical 2BHK takes 3-5 days for complete painting including preparation. Timeline varies with property size.' },
    { question: 'Do you provide warranty?', answer: 'Yes, we provide service warranty on all our painting work. Paint products come with manufacturer warranty.' }
  ],
  'plumbing': [
    { question: 'What plumbing services do you offer?', answer: 'We provide leak repairs, pipe fitting, bathroom/kitchen fixture installation, water tank cleaning, and drainage solutions.' },
    { question: 'Do you handle emergency plumbing?', answer: 'Yes, we offer 24/7 emergency plumbing services for urgent issues like leaks, blockages, and pipe bursts.' },
    { question: 'Are your plumbers experienced?', answer: 'Yes, all our plumbers are skilled professionals with years of experience in residential and commercial plumbing.' },
    { question: 'What are your service charges?', answer: 'Charges depend on the type of work. We provide free inspection and quotation before starting work.' }
  ],
  'post_property': [
    { question: 'How can I post my property?', answer: 'You can easily post your property through our platform. Fill in property details, upload photos, and your listing goes live instantly.' },
    { question: 'Is there a charge for posting property?', answer: 'We offer both free and premium listing options. Premium listings get better visibility and priority placement.' },
    { question: 'How do I remove my property listing?', answer: 'You can remove your property listing anytime from your dashboard or by contacting our support team.' },
    { question: 'Can I edit my property details?', answer: 'Yes, you can edit all property details, photos, and price anytime through your property management dashboard.' }
  ],
  'rental_agreement': [
    { question: 'Do you help with rental agreements?', answer: 'Yes, we draft legally compliant rental agreements, handle registration, and ensure all legal formalities are completed.' },
    { question: 'Is rental agreement registration mandatory?', answer: 'Registration is mandatory for agreements exceeding 11 months. We handle the entire registration process for you.' },
    { question: 'What documents are needed?', answer: 'You need ID proofs, address proofs, and property documents. Our team will guide you on specific requirements.' },
    { question: 'How long does registration take?', answer: 'Rental agreement registration typically takes 3-5 working days after document submission.' }
  ],
  'rent_pay': [
    { question: 'How does online rent payment work?', answer: 'You can pay rent online through our secure platform using UPI, net banking, debit/credit cards with instant confirmation.' },
    { question: 'Is online rent payment safe?', answer: 'Yes, we use bank-grade security and encryption. All transactions are completely secure and verified.' },
    { question: 'Do you provide rent receipts?', answer: 'Yes, we provide instant digital rent receipts for all online payments which are valid for tax purposes.' },
    { question: 'Are there any charges?', answer: 'We charge a nominal processing fee. UPI payments often have zero charges. Check at payment for exact fee.' }
  ],
  'school_fee': [
    { question: 'Can I pay school fees through your platform?', answer: 'Yes, we facilitate online school fee payments for multiple schools with instant confirmation and receipts.' },
    { question: 'Which schools are supported?', answer: 'We partner with numerous schools. Check our platform or contact us to verify if your school is listed.' },
    { question: 'Is it safe to pay school fees online?', answer: 'Absolutely. We use secure payment gateways with bank-level encryption for all transactions.' },
    { question: 'Do I get fee receipts?', answer: 'Yes, you receive instant digital receipts that are accepted by schools for record purposes.' }
  ],
  'seller_plans': [
    { question: 'What are seller plans?', answer: 'Seller plans are packages designed to help you sell your property faster with professional photography, listing, marketing, and buyer assistance.' },
    { question: 'How do seller plans help?', answer: 'Our plans include premium listing, professional photography, wide marketing reach, and dedicated support to attract genuine buyers.' },
    { question: 'What is the success rate?', answer: 'Properties listed with our seller plans typically sell 40% faster than regular listings due to better visibility and support.' },
    { question: 'What are the charges?', answer: 'We offer flexible seller plans with different pricing. Contact us for packages that suit your requirements.' }
  ],
  'tenant_plans': [
    { question: 'What are tenant plans?', answer: 'Tenant plans offer comprehensive support including property search, negotiation help, agreement assistance, and move-in support.' },
    { question: 'How do tenant plans help?', answer: 'You get access to verified properties, negotiation support, legal assistance, and help with documentation and moving.' },
    { question: 'Are there any hidden charges?', answer: 'No, all charges are transparent and explained upfront. Our plans have clear inclusions with no hidden costs.' },
    { question: 'Can I upgrade my plan?', answer: 'Yes, you can upgrade to a higher plan anytime to access additional services and benefits.' }
  ],
  'unsubscribe': [
    { question: 'How can I unsubscribe?', answer: 'You can unsubscribe from our services anytime through your account settings or by contacting our support team.' },
    { question: 'Will I get a refund?', answer: 'Refund policy depends on the service and usage. Contact our support team for specific refund queries.' },
    { question: 'Can I pause my subscription?', answer: 'Yes, many of our services allow subscription pause. Check your plan details or contact support for options.' },
    { question: 'How long does unsubscription take?', answer: 'Unsubscription is immediate for most services. Some services may have notice period as per agreement terms.' }
  ],
  'user_registration': [
    { question: 'How do I register?', answer: 'You can register easily using your mobile number or email. Complete verification and your account is ready to use.' },
    { question: 'Is registration free?', answer: 'Yes, registration is completely free. You only pay when you use our paid services.' },
    { question: 'What documents are needed?', answer: 'Basic registration requires mobile number and email. For some services, you may need ID and address proof.' },
    { question: 'Can I have multiple accounts?', answer: 'One user can have only one account. However, you can manage multiple properties from a single account.' }
  ],
  'utility_payments': [
    { question: 'What utility payments can I make?', answer: 'You can pay electricity, water, gas, internet, and maintenance bills through our platform with instant confirmation.' },
    { question: 'Is there a convenience fee?', answer: 'We charge minimal convenience fee. Some payment methods like UPI may have zero charges.' },
    { question: 'Do you provide payment history?', answer: 'Yes, all your payment history is available in your dashboard for easy tracking and record keeping.' },
    { question: 'Can I schedule automatic payments?', answer: 'Yes, you can set up auto-pay for recurring bills to never miss a payment deadline.' }
  ],
  'others': [
    { question: 'What other services do you provide?', answer: 'We offer various additional services related to real estate. Contact us with your specific requirement.' },
    { question: 'How can I request a custom service?', answer: 'You can reach out to our support team at +918690003500 or email us with your specific needs.' },
    { question: 'Do you provide consultations?', answer: 'Yes, we offer free consultations for all real estate related queries and requirements.' },
    { question: 'How quickly do you respond?', answer: 'We typically respond to all queries within 15-20 minutes during business hours.' }
  ]
};

  const getCurrentFAQs = () => {
    return serviceFAQs[selectedService] || serviceFAQs['default'] || [];
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
        <div className="flex justify-center border-t border-gray-200 bg-white shadow-lg">
          <button 
            onClick={handleBackToServices}
            className="flex flex-col items-center py-3 sm:py-3.5 text-brand-red hover:bg-red-50/50 transition-colors px-8"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
            <span className="text-[10px] sm:text-xs font-semibold">Help Center</span>
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
        <div className="flex justify-center border-t border-gray-200 bg-white shadow-lg">
          <button 
            onClick={handleBackToServices}
            className="flex flex-col items-center py-3 sm:py-3.5 text-brand-red hover:bg-red-50/50 transition-colors px-8"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
            <span className="text-[10px] sm:text-xs font-semibold">Help Center</span>
          </button>
        </div>
      </div>
    );
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (currentView === 'plan-support' || currentView === 'property-support' || currentView === 'service-support') {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [planChatMessages, showDetailsForm, propertyChatMessages, showPropertyDetailsForm, serviceChatMessages, showServiceDetailsForm, currentView]);

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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-20">
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
        <div className="p-4 border-t border-gray-200 bg-white shadow-lg z-10">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-20">
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
      {propertyChatStep !== 'complete' && (
        <div className="p-4 border-t border-gray-200 bg-white shadow-lg z-10">
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

  // Service-specific questions configuration
  const serviceQuestions: Record<string, {intro: string, followUp: string}> = {
    'loans': {
      intro: 'Hi, I can help you with home loans. What type of loan are you looking for?',
      followUp: 'Great! Our loan experts will contact you within 15-20 minutes. What property value are you considering?'
    },
    'home-security': {
      intro: 'Hi, I can help you with home security services. What type of security system are you interested in?',
      followUp: 'Perfect! Our security experts will reach out to you soon. Do you need CCTV, smart locks, or a complete security system?'
    },
    'packers-movers': {
      intro: 'Hi, I can help you with packers & movers services. When are you planning to move?',
      followUp: 'Thank you! Our moving team will contact you shortly. How many rooms need to be packed?'
    },
    'legal-services': {
      intro: 'Hi, I can help you with legal services. What type of legal assistance do you need?',
      followUp: 'Got it! Our legal team will get in touch with you soon. Is this for property documentation or registration?'
    },
    'handover-services': {
      intro: 'Hi, I can help you with property handover services. Are you buying or selling a property?',
      followUp: 'Understood! Our handover specialists will contact you within 15-20 minutes. When is your handover scheduled?'
    },
    'property-management': {
      intro: 'Hi, I can help you with property management services. Do you own residential or commercial property?',
      followUp: 'Perfect! Our property managers will reach out soon. How many properties do you need managed?'
    },
    'architects': {
      intro: 'Hi, I can help you find architects. What type of project are you planning?',
      followUp: 'Excellent! Our architects will contact you shortly. What is your estimated budget for the project?'
    },
    'painting-cleaning': {
      intro: 'Hi, I can help you with painting & cleaning services. Do you need painting, cleaning, or both?',
      followUp: 'Great! Our service team will reach out soon. How large is the area that needs service?'
    },
    'interior-design': {
      intro: 'Hi, I can help you with interior design services. What type of space are you designing?',
      followUp: 'Wonderful! Our interior designers will contact you within 15-20 minutes. What is your preferred design style?'
    }
  };

  const getServiceIcon = (service: string) => {
    const iconMap: Record<string, any> = {
      'loans': BadgeDollarSign,
      'home-security': Shield,
      'packers-movers': TruckIcon,
      'legal-services': Scale,
      'handover-services': FileCheck,
      'property-management': Building2,
      'architects': Hammer,
      'painting-cleaning': PaintBucket,
      'interior-design': Sofa
    };
    return iconMap[service] || Home;
  };

  const getServiceName = (service: string) => {
    const nameMap: Record<string, string> = {
      'loans': 'Loans',
      'home-security': 'Home Security',
      'packers-movers': 'Packers & Movers',
      'legal-services': 'Legal Services',
      'handover-services': 'Handover Services',
      'property-management': 'Property Management',
      'architects': 'Architects',
      'painting-cleaning': 'Painting & Cleaning',
      'interior-design': 'Interior Design'
    };
    return nameMap[service] || 'Service';
  };

  const handleServiceChatSend = () => {
    if (serviceChatInput.trim() === '') return;

    const userMessage: Message = {
      id: String(Date.now()),
      text: serviceChatInput,
      isBot: false,
      timestamp: new Date()
    };

    setServiceChatMessages(prev => [...prev, userMessage]);
    setServiceChatInput('');

    // Simulate bot response
    setTimeout(() => {
      if (serviceChatStep === 'intro') {
        const botMessage: Message = {
          id: String(Date.now() + 1),
          text: 'Thank you for your interest! To help you better, please fill in your details:',
          isBot: true,
          timestamp: new Date()
        };
        setServiceChatMessages(prev => [...prev, botMessage]);
        setServiceChatStep('details-form');
      } else if (serviceChatStep === 'follow-up') {
        const botMessage: Message = {
          id: String(Date.now() + 1),
          text: 'Perfect! Our team will contact you shortly with personalized recommendations. For urgent inquiries, please call us at +918690003500.',
          isBot: true,
          timestamp: new Date()
        };
        setServiceChatMessages(prev => [...prev, botMessage]);
        setServiceChatStep('complete');
      }
    }, 500);
  };

  const handleServiceFillDetailsClick = () => {
    setShowServiceDetailsForm(true);
  };

  const handleServiceDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setShowServiceDetailsForm(false);
    
    setTimeout(() => {
      const currentService = serviceContext?.service || selectedService;
      const followUpText = serviceQuestions[currentService]?.followUp || 
        'Thank you! Our team will contact you within 15-20 minutes.';
      
      const followUpMessage: Message = {
        id: String(Date.now() + 1),
        text: followUpText,
        isBot: true,
        timestamp: new Date()
      };
      setServiceChatMessages(prev => [...prev, followUpMessage]);
      setServiceChatStep('follow-up');
    }, 1000);
  };

  const renderServiceSupportView = () => {
    const currentService = serviceContext?.service || selectedService;
    const ServiceIcon = getServiceIcon(currentService);
    const serviceName = getServiceName(currentService);

    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
              <ServiceIcon size={16} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900">{serviceName} Support</span>
          </div>
          <button 
            onClick={() => {
              setIsOpen(false);
              setCurrentView('initial');
              setServiceChatMessages([]);
              setShowServiceDetailsForm(false);
              setServiceUserDetails({ name: '', email: '', phone: '', service: '' });
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-20">
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
          {serviceChatMessages.map((msg, index) => (
            <div key={msg.id} className="flex items-start space-x-2">
              {msg.isBot && (
                <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                  <ServiceIcon size={14} className="text-white" />
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
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  
                  {/* Show Fill Details button */}
                  {msg.isBot && serviceChatStep === 'details-form' && 
                   index === serviceChatMessages.length - 1 && !showServiceDetailsForm && (
                    <button 
                      onClick={handleServiceFillDetailsClick}
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
          {showServiceDetailsForm && (
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                <ServiceIcon size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm">
                  <p className="text-sm text-gray-800 mb-3 font-medium">Fill Details</p>
                  <form onSubmit={handleServiceDetailsSubmit} className="space-y-3">
                    <Input
                      placeholder="Name"
                      value={serviceUserDetails.name}
                      onChange={(e) => setServiceUserDetails(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="text-sm"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={serviceUserDetails.email}
                      onChange={(e) => setServiceUserDetails(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="text-sm"
                    />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={serviceUserDetails.phone}
                      onChange={(e) => setServiceUserDetails(prev => ({ ...prev, phone: e.target.value }))}
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
          
          <div ref={chatMessagesEndRef} />
        </div>

        {/* Input Area */}
        {serviceChatStep !== 'complete' && (
          <div className="p-4 border-t border-gray-200 bg-white shadow-lg z-10">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type your message here"
                value={serviceChatInput}
                onChange={(e) => setServiceChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleServiceChatSend()}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleServiceChatSend}
                className="bg-brand-red hover:bg-brand-maroon-dark px-4"
                disabled={serviceChatInput.trim() === ''}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

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
      <div className="flex justify-center border-t border-gray-200 bg-white shadow-lg">
        <button className="flex flex-col items-center py-3 sm:py-3.5 text-brand-red hover:bg-red-50/50 transition-colors px-8">
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
          <span className="text-[10px] sm:text-xs font-semibold">Help Center</span>
        </button>
        <button className="flex flex-col items-center py-3 sm:py-3.5 text-gray-500 hover:bg-gray-50/50 transition-colors px-8">
          <History className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-1.5" />
          <span className="text-[10px] sm:text-xs font-semibold">History</span>
        </button>
      </div>
    </div>
  );

  const renderChatView = () => (
    <CardContent className="p-0 h-full flex flex-col">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 pb-4 bg-gray-50">
        {messages.map((message, index) => (
          <div key={message.id} className={`flex items-start ${message.isBot ? 'space-x-2' : 'justify-end'}`}>
            {message.isBot && (
              <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                <Home size={14} className="text-white" />
              </div>
            )}
            <div className={`flex-1 ${!message.isBot ? 'flex justify-end' : ''}`}>
              {message.isBot && (
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-sm font-semibold text-brand-red">Home HNI</span>
                </div>
              )}
              <div
                className={`${message.isBot ? 'inline-block' : ''} max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg ${
                  message.isBot
                    ? 'bg-white rounded-tl-none shadow-sm text-gray-800'
                    : 'bg-brand-red text-white'
                }`}
              >
                <p className={`text-sm ${message.isBot ? 'text-gray-800' : 'text-white'}`}>{message.text}</p>
              
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
  (() => {
    const mainOptions = ['Seller', 'Agent', 'Builder', 'Want to buy a property'];
    const isMain =
      mainOptions.every(o => message.options?.includes(o)) &&
      message.options.length === mainOptions.length;
    if (isMain) {
      return (
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
          {mainOptions.map((option) => (
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
      );
    }
    return (
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
    );
  })()
)}
              
                {/* Show Fill Details button for search context */}
                {searchContext && message.isBot && conversationStep === 'user_details_collection' && 
                 index === messages.length - 1 && !showSearchDetailsForm && (
                  <button 
                    onClick={() => setShowSearchDetailsForm(true)}
                    className="w-full mt-3 bg-brand-red text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-brand-maroon-dark transition-colors"
                  >
                    Fill details
                  </button>
                )}
              </div>
              {message.isBot && (
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {/* Search Details Form */}
        {showSearchDetailsForm && (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-[80%] bg-gray-100 rounded-lg p-3 sm:p-4 mb-4 relative">
              <p className="text-sm text-gray-800 mb-3 font-medium">Fill Details</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (searchDetailsForm.name && searchDetailsForm.email && searchDetailsForm.phone) {
                  setShowSearchDetailsForm(false);
                  const submitMessage: Message = {
                    id: String(Date.now()),
                    text: 'Details submitted',
                    isBot: false,
                    timestamp: new Date()
                  };
                  setMessages((prev) => [...prev, submitMessage]);
                  simulateBotResponse('Details submitted');
                }
              }} className="space-y-3" name="search-details-form">
                <Input
                  name="name"
                  placeholder="Name"
                  value={searchDetailsForm.name}
                  onChange={(e) => setSearchDetailsForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  autoComplete="name"
                  className="text-sm"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={searchDetailsForm.email}
                  onChange={(e) => setSearchDetailsForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  autoComplete="email"
                  className="text-sm"
                />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={searchDetailsForm.phone}
                  onChange={(e) => setSearchDetailsForm(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  pattern="[0-9]{10}"
                  autoComplete="tel"
                  className="text-sm"
                />
                <Button 
                  type="submit"
                  aria-label="Submit details"
                  className="w-full bg-brand-red hover:bg-brand-maroon-dark text-white"
                >
                  Submit Details
                </Button>
              </form>
            </div>
          </div>
        )}
        
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

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white shadow-lg z-10">
        <div className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message here"
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-brand-red hover:bg-brand-maroon-dark px-4"
            disabled={inputValue.trim() === ''}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </CardContent>
  );

  const showInitialView = !searchContext && currentView === 'initial';

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
            // If on services page, open directly to service support chat
            else if (location.pathname === '/services') {
              const params = new URLSearchParams(window.location.search);
              const serviceTab = params.get('tab') || 'loans';
              setSelectedService(serviceTab);
              setCurrentView('service-support');
              setServiceChatStep('intro');
              setShowServiceDetailsForm(false);
              const introText = serviceQuestions[serviceTab]?.intro || 'Hi, I can help you with this service. How can I assist you?';
              setServiceChatMessages([
                {
                  id: '1',
                  text: introText,
                  isBot: true,
                  timestamp: new Date()
                }
              ]);
            }
            // If on individual service page, detect which service
            else if (['/loans', '/home-security', '/packers-movers', '/legal-services', '/handover-services', 
                      '/property-management', '/architects', '/painting-cleaning', '/interior-design'].some(path => location.pathname === path)) {
              const serviceMap: Record<string, string> = {
                '/loans': 'loans',
                '/home-security': 'home-security',
                '/packers-movers': 'packers-movers',
                '/legal-services': 'legal-services',
                '/handover-services': 'handover-services',
                '/property-management': 'property-management',
                '/architects': 'architects',
                '/painting-cleaning': 'painting-cleaning',
                '/interior-design': 'interior-design'
              };
              const service = serviceMap[location.pathname];
              setSelectedService(service);
              setCurrentView('service-support');
              setServiceChatStep('intro');
              setShowServiceDetailsForm(false);
              const introText = serviceQuestions[service]?.intro || 'Hi, I can help you with this service. How can I assist you?';
              setServiceChatMessages([
                {
                  id: '1',
                  text: introText,
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
        <Card className="fixed bottom-0 right-0 left-0 h-[85vh] w-full shadow-2xl bg-white rounded-t-3xl border-0 overflow-hidden sm:relative sm:w-96 sm:h-[600px] sm:rounded-3xl flex flex-col">
          {/* Show header for search context chat */}
          {searchContext && (
            <CardHeader className="bg-brand-maroon-dark text-white p-4 sm:p-5 relative z-10 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Home size={20} className="text-brand-maroon-dark sm:w-6 sm:h-6" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold">
                    {searchContext.activeTab === 'buy' ? 'Buy Property Assistant' : 
                     searchContext.activeTab === 'rent' ? 'Rent Property Assistant' : 
                     searchContext.activeTab === 'land' ? 'Land/Plot Assistant' :
                     'Commercial Property Assistant'}
                  </CardTitle>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
          )}
          

          {/* Header for regular chat view */}
          {!showInitialView && currentView === 'chat' && !searchContext && (
            <CardHeader className="bg-brand-maroon-dark text-white p-4 sm:p-5 relative z-10 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setCurrentView('initial');
                      setMessages([getInitialMessage()]);
                      setConversationStep('role_selection');
                    }}
                    className="hover:bg-white/10 p-1 rounded-full transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Home size={20} className="text-brand-maroon-dark sm:w-6 sm:h-6" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold">Real Estate Assistant</CardTitle>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
          )}

          <div className="relative flex-1 min-h-0">
            {currentView === 'plan-support' ? (
              <div className="h-full flex flex-col">
                {renderPlanSupportView()}
              </div>
            ) : currentView === 'property-support' ? (
              <div className="h-full flex flex-col">
                {renderPropertySupportView()}
              </div>
            ) : currentView === 'service-support' ? (
              <div className="h-full flex flex-col">
                {renderServiceSupportView()}
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
              renderInitialView()
            ) : (
              renderChatView()
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;