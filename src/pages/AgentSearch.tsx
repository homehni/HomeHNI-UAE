import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Mail, Phone, MessageCircle, MapPin, CheckCircle, Award, Shield, ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// Dummy agent data
const DUMMY_AGENTS = [
  {
    id: 1,
    name: 'Youssef Nabulsi',
    company: 'Huspy Dubai',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    badges: ['Star Broker', 'Top Performer'],
    properties: 15,
    truCheckCount: 9,
    checkedCount: 6,
    languages: ['Arabic', 'English', 'Turkish'],
    email: 'youssef@huspy.ae',
    phone: '+971-50-123-4567',
    companyLogo: 'https://logo.clearbit.com/huspy.com'
  },
  {
    id: 2,
    name: 'Archie Murdoch',
    company: 'Strada',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    badges: ['Star Broker', 'Top Performer'],
    properties: 11,
    truCheckCount: 5,
    checkedCount: 6,
    languages: ['English'],
    email: 'archie@strada.ae',
    phone: '+971-50-234-5678',
    companyLogo: 'https://logo.clearbit.com/realestate.com.au'
  },
  {
    id: 3,
    name: 'Sarah Ahmed',
    company: 'Emirates Property',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    badges: ['Star Broker'],
    properties: 23,
    truCheckCount: 12,
    checkedCount: 11,
    languages: ['Arabic', 'English', 'French'],
    email: 'sarah@emiratesprop.ae',
    phone: '+971-50-345-6789',
    companyLogo: 'https://logo.clearbit.com/emirates.com'
  },
  {
    id: 4,
    name: 'Mohammed Khan',
    company: 'Dubai Realty Plus',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    badges: ['Top Performer'],
    properties: 8,
    truCheckCount: 3,
    checkedCount: 5,
    languages: ['English', 'Urdu', 'Hindi'],
    email: 'mohammed@dubairealtyplus.ae',
    phone: '+971-50-456-7890',
    companyLogo: 'https://logo.clearbit.com/propertyfinder.ae'
  }
];

export default function AgentSearch() {
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const [agentType, setAgentType] = useState('all');
  const [location, setLocation] = useState('');
  const [agentName, setAgentName] = useState('');
  const [languages, setLanguages] = useState('');
  
  // Property filter states
  const [isPropertyFilterOpen, setIsPropertyFilterOpen] = useState(false);
  const [purpose, setPurpose] = useState<'buy' | 'rent'>('buy');
  const [propertyCategory, setPropertyCategory] = useState<'residential' | 'commercial' | 'long-term' | 'short-term'>('residential');
  const [completionStatus, setCompletionStatus] = useState<'all' | 'ready' | 'off-plan'>('ready');
  
  // Generate display text for property filter button
  const getPropertyFilterText = () => {
    const purposeText = purpose === 'buy' ? 'Buy' : 'Rent';
    let categoryText = '';
    
    if (purpose === 'rent' && propertyCategory === 'long-term') {
      categoryText = 'Residential Long-Term';
    } else if (purpose === 'rent' && propertyCategory === 'short-term') {
      categoryText = 'Residential Short-Term';
    } else if (propertyCategory === 'residential') {
      categoryText = 'Residential';
    } else {
      categoryText = 'Commercial';
    }
    
    if (purpose === 'buy') {
      const statusText = completionStatus === 'ready' ? 'Ready' : completionStatus === 'off-plan' ? 'Off-Plan' : '';
      return `${purposeText} / ${categoryText}${statusText ? ' / ' + statusText : ''}`;
    }
    
    return `${purposeText} / ${categoryText}`;
  };
  
  const handleResetPropertyFilter = () => {
    setPurpose('buy');
    setPropertyCategory('residential');
    setCompletionStatus('ready');
  };

  const themeColors = theme === 'green-white'
    ? { primary: 'bg-green-600', primaryHover: 'hover:bg-green-700', border: 'border-green-600', text: 'text-green-600' }
    : theme === 'opaque'
      ? { primary: 'bg-gray-600', primaryHover: 'hover:bg-gray-700', border: 'border-gray-600', text: 'text-gray-600' }
      : { primary: 'bg-[#800000]', primaryHover: 'hover:bg-[#700000]', border: 'border-[#800000]', text: 'text-[#800000]' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        {/* Filter Bar */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-[72px] z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* First Row on Mobile - Agent Type and Property Filter */}
              <div className="flex gap-3 flex-1">
                <Select value={agentType} onValueChange={setAgentType}>
                  <SelectTrigger className="w-[120px] sm:w-[140px]">
                    <SelectValue placeholder="Agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Agents</SelectItem>
                    <SelectItem value="agency">Agencies</SelectItem>
                    <SelectItem value="developer">Developers</SelectItem>
                  </SelectContent>
                </Select>

                <Popover open={isPropertyFilterOpen} onOpenChange={setIsPropertyFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 sm:w-[240px] justify-between text-sm">
                      <span className="truncate">{getPropertyFilterText()}</span>
                      <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Button>
                  </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[380px] p-4 sm:p-6" align="start" side="bottom">
                  {/* Purpose Section */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-sm font-semibold mb-2 sm:mb-3 text-gray-900">Purpose</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={purpose === 'buy' ? 'default' : 'outline'}
                        onClick={() => {
                          setPurpose('buy');
                          setPropertyCategory('residential');
                        }}
                        className={`${
                          purpose === 'buy'
                            ? theme === 'opaque'
                              ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                              : theme === 'green-white'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-50 text-[#800000]'
                            : ''
                        }`}
                      >
                        Buy
                      </Button>
                      <Button
                        variant={purpose === 'rent' ? 'default' : 'outline'}
                        onClick={() => {
                          setPurpose('rent');
                          setPropertyCategory('long-term');
                        }}
                        className={`${
                          purpose === 'rent'
                            ? theme === 'opaque'
                              ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                              : theme === 'green-white'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-50 text-[#800000]'
                            : ''
                        }`}
                      >
                        Rent
                      </Button>
                    </div>
                  </div>

                  {/* Type Section */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-sm font-semibold mb-2 sm:mb-3 text-gray-900">Type</h4>
                    <div className="flex flex-wrap gap-2">
                      {purpose === 'buy' ? (
                        <>
                          <Button
                            variant={propertyCategory === 'residential' ? 'default' : 'outline'}
                            onClick={() => setPropertyCategory('residential')}
                            className={`${
                              propertyCategory === 'residential'
                                ? theme === 'opaque'
                                  ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                                  : theme === 'green-white'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-50 text-[#800000]'
                                : ''
                            }`}
                          >
                            Residential
                          </Button>
                          <Button
                            variant={propertyCategory === 'commercial' ? 'default' : 'outline'}
                            onClick={() => setPropertyCategory('commercial')}
                            className={`${
                              propertyCategory === 'commercial'
                                ? theme === 'opaque'
                                  ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                                  : theme === 'green-white'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-50 text-[#800000]'
                                : ''
                            }`}
                          >
                            Commercial
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant={propertyCategory === 'long-term' ? 'default' : 'outline'}
                            onClick={() => setPropertyCategory('long-term')}
                            className={`text-xs sm:text-sm ${
                              propertyCategory === 'long-term'
                                ? theme === 'opaque'
                                  ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                                  : theme === 'green-white'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-50 text-[#800000]'
                                : ''
                            }`}
                          >
                            Residential Long-Term
                          </Button>
                          <Button
                            variant={propertyCategory === 'short-term' ? 'default' : 'outline'}
                            onClick={() => setPropertyCategory('short-term')}
                            className={`text-xs sm:text-sm ${
                              propertyCategory === 'short-term'
                                ? theme === 'opaque'
                                  ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                                  : theme === 'green-white'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-50 text-[#800000]'
                                : ''
                            }`}
                          >
                            Residential Short-Term
                          </Button>
                          <Button
                            variant={propertyCategory === 'commercial' ? 'default' : 'outline'}
                            onClick={() => setPropertyCategory('commercial')}
                            className={`${
                              propertyCategory === 'commercial'
                                ? theme === 'opaque'
                                  ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                                  : theme === 'green-white'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-50 text-[#800000]'
                                : ''
                            }`}
                          >
                            Commercial
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Completion Status Section (only for Buy) */}
                  {purpose === 'buy' && (
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-sm font-semibold mb-2 sm:mb-3 text-gray-900">Completion Status</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={completionStatus === 'all' ? 'default' : 'outline'}
                          onClick={() => setCompletionStatus('all')}
                          size="sm"
                          className={`${
                            completionStatus === 'all'
                              ? theme === 'opaque'
                                ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                                : theme === 'green-white'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-50 text-[#800000]'
                              : ''
                          }`}
                        >
                          All
                        </Button>
                        <Button
                          variant={completionStatus === 'ready' ? 'default' : 'outline'}
                          onClick={() => setCompletionStatus('ready')}
                          size="sm"
                          className={`${
                            completionStatus === 'ready'
                              ? theme === 'opaque'
                                ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                                : theme === 'green-white'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-50 text-[#800000]'
                              : ''
                          }`}
                        >
                          Ready
                        </Button>
                        <Button
                          variant={completionStatus === 'off-plan' ? 'default' : 'outline'}
                          onClick={() => setCompletionStatus('off-plan')}
                          size="sm"
                          className={`${
                            completionStatus === 'off-plan'
                              ? theme === 'opaque'
                                ? 'bg-gray-100 text-gray-900 border-2 border-gray-900'
                                : theme === 'green-white'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-50 text-[#800000]'
                              : ''
                          }`}
                        >
                          Off-Plan
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={handleResetPropertyFilter}
                      className="flex-1"
                    >
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsPropertyFilterOpen(false)}
                      className={`flex-1 border-2 ${themeColors.border} ${themeColors.text} bg-white/40 backdrop-blur-sm hover:bg-white/60`}
                    >
                      Done
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              </div>

              {/* Second Row on Mobile - Location Input */}
              <div className="relative flex-1 min-w-0">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Third Row on Mobile - Agent Name and Languages (Hidden on small screens, shown on larger) */}
              <div className="hidden md:flex gap-3">
                <Input
                  placeholder="Agent Name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-[180px]"
                />

                <Input
                  placeholder="Enter languages"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="w-[180px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Agents List */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Real Estate Agents in UAE</h1>
              <p className="text-gray-600 mb-6">Showing 1 - 40 of 11,712 Agents</p>

              <div className="space-y-6">
                {DUMMY_AGENTS.map((agent) => (
                  <Card key={agent.id} className="p-6 bg-white/70 backdrop-blur-sm border-2 hover:shadow-xl hover:bg-white/90 transition-all">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Agent Photo */}
                      <div className="flex-shrink-0">
                        <img
                          src={agent.photo}
                          alt={agent.name}
                          className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg"
                        />
                      </div>

                      {/* Agent Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {agent.badges.map((badge, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className={`${
                                    badge === 'Star Broker'
                                      ? `${themeColors.border} ${themeColors.text} bg-white/40 backdrop-blur-sm border-2`
                                      : 'border-blue-500 text-blue-600 bg-white/40 backdrop-blur-sm border-2'
                                  }`}
                                >
                                  {badge === 'Star Broker' ? <Shield size={14} className="mr-1" /> : <Award size={14} className="mr-1" />}
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-gray-600 font-medium">{agent.company}</p>
                          </div>

                          {/* Company Logo */}
                          <div className="hidden sm:block flex-shrink-0 w-24 h-12 bg-white border border-gray-200 rounded flex items-center justify-center overflow-hidden p-2">
                            <img src={agent.companyLogo} alt={agent.company} className="max-w-full max-h-full object-contain" />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{agent.properties}</span> Properties
                          </div>
                          {/* TruCheck - HIDDEN (feature not implemented) */}
                          {false && <div className="flex items-center gap-1">
                            <CheckCircle size={16} className="text-green-600" />
                            <span className="font-semibold">{agent.truCheckCount}</span> TruCheck™
                          </div>}
                          <div className="flex items-center gap-1">
                            <CheckCircle size={16} className="text-blue-600" />
                            <span className="font-semibold">{agent.checkedCount}</span> Checked
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <span className="font-medium">Speaks:</span>
                          <span>{agent.languages.join(', ')}</span>
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Mail size={16} />
                            Email
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Phone size={16} />
                            Call
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50">
                            <MessageCircle size={16} />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Sell or Rent Card */}
              <Card className="p-6 bg-white/60 backdrop-blur-lg border-2 shadow-lg">
                <div className="flex items-start gap-3 mb-4">
                  <Badge variant="outline" className="bg-red-500/20 text-red-600 border-red-500 text-xs px-2 py-0.5 backdrop-blur-sm">NEW</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Sell or Rent Your Property</h3>
                <p className="text-sm mb-4 text-gray-600">Connect with a trusted agent to secure the best deal, faster.</p>
                <Button variant="outline" className={`w-full border-2 ${themeColors.border} ${themeColors.text} bg-white/40 backdrop-blur-sm hover:bg-white/60 font-semibold shadow-md`}>
                  Get Started →
                </Button>
              </Card>

              {/* Badges Info Card */}
              <Card className="p-6 bg-white/60 backdrop-blur-lg border-2 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">How Do Agents Earn Badges?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  To highlight great performance, we reward agents with customised badges on Bayut.
                </p>

                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className={`${themeColors.border} ${themeColors.text} bg-white/40 backdrop-blur-sm border-2 mb-2`}>
                      <Shield size={14} className="mr-1" />
                      Star Broker
                    </Badge>
                    <p className="text-xs text-gray-600">
                      Exclusive badge awarded to agents who are highly responsive and advertise genuine properties.
                    </p>
                  </div>

                  <div>
                    <Badge variant="outline" className="border-blue-500 text-blue-600 bg-white/40 backdrop-blur-sm border-2 mb-2">
                      <Award size={14} className="mr-1" />
                      Top Performer
                    </Badge>
                    <p className="text-xs text-gray-600">
                      Exclusive badge awarded to agents who consistently deliver exceptional service and results.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Invest in Off Plan Card */}
              <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-lg border-2 border-blue-200/50 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Invest in Off Plan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Browse off-plan projects with flexible payment plans in prime locations.
                </p>
                <Button variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50/50 bg-white/40 backdrop-blur-sm">
                  Explore Projects
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

