import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Home, X, Send, MapPin, Calendar, Phone, Mail, User, Bed, Bath, Square } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI real estate assistant. I can help you find properties, schedule visits, and answer your questions. How can I assist you today?',
      isBot: true,
      timestamp: new Date(),
      options: ['Find Properties', 'Schedule Visit', 'Market Insights', 'Price Trends']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState('greeting');
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

          if (conversationStep === 'greeting') {
            if (userMessage.toLowerCase().includes('find properties')) {
              setConversationStep('propertySearch');
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'Great! To help me find the perfect properties for you, could you tell me your budget?',
              };
            } else if (userMessage.toLowerCase().includes('schedule visit')) {
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'Okay, please provide the property ID and your preferred date and time for the visit.',
              };
            } else {
              finalResponse = {
                id: String(Date.now() + 2),
                isBot: true,
                timestamp: new Date(),
                text: 'I can help you with finding properties or scheduling a visit. What would you like to do?',
                options: ['Find Properties', 'Schedule Visit']
              };
            }
          } else if (conversationStep === 'propertySearch') {
            setUserPreferences(prev => ({ ...prev, budget: userMessage }));
            setConversationStep('locationPreference');
            finalResponse = {
              id: String(Date.now() + 2),
              isBot: true,
              timestamp: new Date(),
              text: 'Got it! And where are you looking to buy or rent a property?',
            };
          } else if (conversationStep === 'locationPreference') {
            setUserPreferences(prev => ({ ...prev, location: userMessage }));
            setConversationStep('propertyTypePreference');
            finalResponse = {
              id: String(Date.now() + 2),
              isBot: true,
              timestamp: new Date(),
              text: 'Okay, which type of property are you interested in (e.g., apartment, villa, house)?',
            };
          } else if (conversationStep === 'propertyTypePreference') {
            setUserPreferences(prev => ({ ...prev, propertyType: userMessage }));
            setConversationStep('bedroomsPreference');
            finalResponse = {
              id: String(Date.now() + 2),
              isBot: true,
              timestamp: new Date(),
              text: 'Great! How many bedrooms would you prefer?',
            };
          } else if (conversationStep === 'bedroomsPreference') {
            setUserPreferences(prev => ({ ...prev, bedrooms: userMessage }));
            setConversationStep('userName');
            finalResponse = {
              id: String(Date.now() + 2),
              isBot: true,
              timestamp: new Date(),
              text: 'Thank you! Before I show you some properties, could you please tell me your name?',
            };
          } else if (conversationStep === 'userName') {
            setUserName(userMessage);
            setConversationStep('propertySuggestions');
            finalResponse = {
              id: String(Date.now() + 2),
              isBot: true,
              timestamp: new Date(),
              text: `Thank you, ${userMessage}! Based on your preferences, here are a few properties you might like:`,
              propertyCard: sampleProperties[0]
            };
          } else if (conversationStep === 'propertySuggestions') {
            finalResponse = {
              id: String(Date.now() + 2),
              isBot: true,
              timestamp: new Date(),
              text: `Would you like to see more properties?`,
              options: ['Yes', 'No']
            };
          }
          else {
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

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-brand-red hover:bg-brand-maroon-dark shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <Home size={20} className="text-white sm:w-6 sm:h-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[calc(100vw-2rem)] max-w-96 h-[calc(100vh-8rem)] max-h-[500px] shadow-2xl border-0 bg-white sm:w-96 sm:h-[500px]">
          <CardHeader className="bg-brand-red text-white p-3 sm:p-4 rounded-t-lg">
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
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-brand-red hover:bg-brand-maroon-dark px-3"
                >
                  <Send size={14} className="sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;