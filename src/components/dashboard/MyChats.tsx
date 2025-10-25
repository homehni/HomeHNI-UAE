import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, ArrowLeft, Clock } from 'lucide-react';
import { getUserConversations, getConversationMessages, type ChatConversation, type ChatMessage } from '@/lib/chatHistory';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const MyChats = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMessages, setShowMessages] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

  // Listen for conversation updates
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 MyChats: Storage change detected, refreshing conversations...');
      loadConversations();
    };

    // Listen for custom events
    window.addEventListener('conversationUpdated', handleStorageChange);
    console.log('🔄 MyChats: Event listener registered for conversationUpdated');
    
    // Also refresh every 5 seconds to catch updates
    const interval = setInterval(() => {
      console.log('🔄 MyChats: Auto-refresh triggered (5s interval)');
      loadConversations();
    }, 5000);

    return () => {
      window.removeEventListener('conversationUpdated', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadConversations = async () => {
    console.log('🔄 MyChats: Loading conversations...');
    setLoading(true);
    const data = await getUserConversations();
    console.log('📋 MyChats: Loaded conversations:', data.length, 'conversations');
    if (data.length > 0) {
      console.log('📋 MyChats: First conversation:', {
        id: data[0].id,
        title: data[0].title,
        type: data[0].conversation_type,
        last_message: data[0].last_message
      });
    }
    setConversations(data);
    setLoading(false);
  };

  const loadMessages = async (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    const data = await getConversationMessages(conversation.id);
    setMessages(data);
    setShowMessages(true);
  };

  const handleBackToConversations = () => {
    setShowMessages(false);
    setSelectedConversation(null);
    setMessages([]);
  };

  const getConversationTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      service: 'bg-blue-500',
      plan: 'bg-green-500',
      search: 'bg-purple-500',
      property: 'bg-orange-500',
      agent: 'bg-pink-500',
      builder: 'bg-indigo-500',
      seller: 'bg-yellow-500',
      property_owner: 'bg-red-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full">
      {/* Mobile: Show either list or messages */}
      <div className="lg:hidden h-full">
        {!showMessages ? (
          /* Conversations List - Mobile */
          <Card className="h-full flex flex-col border-0 rounded-none">
            <CardHeader className="border-b bg-white sticky top-0 z-10">
              <CardTitle className="text-xl">Chat History</CardTitle>
              <CardDescription>
                Your conversations with our AI assistants and property owners
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="p-4 border-b bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-240px)]">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Loading...</p>
                    </div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                    <MessageSquare className="h-16 w-16 text-gray-300 mb-3" />
                    <p className="text-gray-600 font-medium mb-1">No conversations yet</p>
                    <p className="text-sm text-gray-400">Start chatting with our AI assistants or contact property owners!</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className="p-4 rounded-xl border bg-white hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                        onClick={() => loadMessages(conversation)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1 truncate capitalize">{conversation.title}</h3>
                            <Badge className={`${getConversationTypeColor(conversation.conversation_type)} text-white text-xs`}>
                              {conversation.conversation_type}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {conversation.last_message || 'No messages'}
                        </p>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(conversation.last_message_at), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          /* Messages View - Mobile */
          <Card className="h-full flex flex-col border-0 rounded-none">
            <CardHeader className="border-b bg-white sticky top-0 z-10 p-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToConversations}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-base truncate capitalize">{selectedConversation?.title}</h2>
                  <p className="text-xs text-gray-500">
                    {selectedConversation && format(new Date(selectedConversation.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              <div className="space-y-4 pb-4">
                        {messages.map((message) => {
                          const isPropertyOwner = message.metadata?.sender_type === 'property_owner';
                          const ownerName = message.metadata?.owner_name;
                          
                          return (
                            <div
                              key={message.id}
                              className={`flex ${message.is_bot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                            >
                              <div
                                className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                                  message.is_bot
                                    ? 'bg-white text-gray-800 rounded-tl-none'
                                    : 'bg-brand-red text-white rounded-tr-none'
                                }`}
                              >
                                {isPropertyOwner && ownerName && (
                                  <p className="text-xs font-medium text-gray-600 mb-1">
                                    {ownerName}
                                  </p>
                                )}
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
                                <p className={`text-xs mt-1 ${message.is_bot ? 'text-gray-400' : 'text-white/70'}`}>
                                  {format(new Date(message.created_at), 'h:mm a')}
                                </p>
                              </div>
                            </div>
                          );
                        })}
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>

      {/* Desktop: Side by side layout */}
      <div className="hidden lg:block h-full">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Chat History</CardTitle>
            <CardDescription>
              View and manage your conversations with our AI assistants and property owners
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex h-[calc(100vh-200px)]">
              {/* Conversations List - Desktop */}
              <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading...</p>
                      </div>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <MessageSquare className="h-16 w-16 text-gray-300 mb-3" />
                      <p className="text-gray-600 font-medium mb-1">No conversations yet</p>
                      <p className="text-sm text-gray-400">Start chatting with our AI assistants or contact property owners!</p>
                    </div>
                  ) : (
                    <div className="p-3 space-y-2">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            selectedConversation?.id === conversation.id
                              ? 'bg-brand-red/10 border-2 border-brand-red shadow-sm'
                              : 'border hover:bg-gray-50 hover:shadow-sm'
                          }`}
                          onClick={() => loadMessages(conversation)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm truncate mb-1 capitalize">{conversation.title}</h3>
                              <Badge className={`${getConversationTypeColor(conversation.conversation_type)} text-white text-xs`}>
                                {conversation.conversation_type}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {conversation.last_message || 'No messages'}
                          </p>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(conversation.last_message_at), 'MMM d, h:mm a')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Messages View - Desktop */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b bg-gray-50">
                      <h2 className="text-lg font-semibold capitalize">{selectedConversation.title}</h2>
                      <p className="text-sm text-gray-500">
                        {format(new Date(selectedConversation.created_at), 'PPpp')}
                      </p>
                    </div>

                    <ScrollArea className="flex-1 p-4 bg-white">
                      <div className="space-y-4 max-w-4xl mx-auto pb-4">
                        {messages.map((message) => {
                          const isPropertyOwner = message.metadata?.sender_type === 'property_owner';
                          const ownerName = message.metadata?.owner_name;
                          
                          return (
                            <div
                              key={message.id}
                              className={`flex ${message.is_bot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                            >
                              <div
                                className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                                  message.is_bot
                                    ? 'bg-gray-100 text-gray-800 rounded-tl-none'
                                    : 'bg-brand-red text-white rounded-tr-none'
                                }`}
                              >
                                {isPropertyOwner && ownerName && (
                                  <p className="text-xs font-medium text-gray-600 mb-2">
                                    {ownerName}
                                  </p>
                                )}
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
                                <p className={`text-xs mt-2 ${message.is_bot ? 'text-gray-500' : 'text-white/70'}`}>
                                  {format(new Date(message.created_at), 'h:mm a')}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-center bg-gray-50">
                    <div>
                      <MessageSquare className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium mb-1">Select a conversation</p>
                      <p className="text-sm text-gray-400">Choose a chat to view messages</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyChats;
