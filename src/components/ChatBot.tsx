import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Home, X, Send, MapPin, Calendar, Phone, Mail, User, Bed, Bath, Square, Building2, UserCircle, Search, History, HelpCircle } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
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
    const newMessage: Message = {
      id: String(Date.now()),
      text: option,
      isBot: false,
      timestamp: new Date()
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    simulateBotResponse(option);
  };

  const services = [
    {
      id: 'buyer',
      icon: Search,
      label: 'Want to Buy',
      description: 'Find your dream property',
      action: 'Want to buy a property'
    },
    {
      id: 'seller',
      icon: Home,
      label: 'Seller',
      description: 'List your property',
      action: 'Seller'
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
    }
  ];

  const renderInitialView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 bg-gradient-to-br from-red-50 to-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Help Center</h1>
        <p className="text-sm text-muted-foreground flex items-center">
          <span className="mr-1">✓</span>
          One-Stop Solution for all Real Estate Services
        </p>
      </div>

      {/* Services Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className="text-xs font-semibold text-brand-red uppercase tracking-wider mb-3">
          CHOOSE A SERVICE
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => handleOptionClick(service.action)}
                className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-brand-red group"
              >
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mb-2 group-hover:shadow-md transition-shadow">
                  <IconComponent className="w-7 h-7 text-brand-red" />
                </div>
                <span className="text-xs font-medium text-gray-800 text-center">
                  {service.label}
                </span>
                <span className="text-[10px] text-gray-500 text-center mt-0.5">
                  {service.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex border-t bg-white">
        <button className="flex-1 flex flex-col items-center py-3 text-brand-red border-r">
          <HelpCircle className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Help Center</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-3 text-gray-500 hover:text-brand-red transition-colors">
          <History className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">History</span>
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

  const showInitialView = messages.length === 1 && conversationStep === 'role_selection';

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-brand-red hover:bg-brand-maroon-dark shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Home size={20} className="text-white sm:w-6 sm:h-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[calc(100vw-2rem)] max-w-96 h-[calc(100vh-8rem)] max-h-[600px] shadow-2xl border-2 border-brand-red/30 bg-white sm:w-96 sm:h-[600px]">
          {!showInitialView && (
            <CardHeader className="bg-brand-red text-white p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center">
                    <Home size={12} className="text-brand-red sm:w-4 sm:h-4" />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold">Real Estate Assistant</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <X size={18} />
                </Button>
              </div>
            </CardHeader>
          )}

          {showInitialView ? (
            <div className="h-full flex flex-col relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 z-10 text-gray-600 hover:text-gray-900"
              >
                <X size={18} />
              </Button>
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