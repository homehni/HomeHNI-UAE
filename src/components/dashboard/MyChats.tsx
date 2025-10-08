import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search } from 'lucide-react';
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
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    const data = await getUserConversations();
    setConversations(data);
    setLoading(false);
  };

  const loadMessages = async (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    const data = await getConversationMessages(conversation.id);
    setMessages(data);
  };

  const getConversationTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      service: 'bg-blue-500',
      plan: 'bg-green-500',
      search: 'bg-purple-500',
      property: 'bg-orange-500',
      agent: 'bg-pink-500',
      builder: 'bg-indigo-500',
      seller: 'bg-yellow-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>My Chat History</CardTitle>
          <CardDescription>
            View and manage your conversations with our AI assistants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 h-[600px]">
            {/* Conversations List */}
            <div className="lg:w-1/3 border-r">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <ScrollArea className="h-[500px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading conversations...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No conversations yet</p>
                    <p className="text-sm text-gray-400">Start chatting with our AI assistants!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-gray-100 border-2 border-brand-red' : 'border'
                        }`}
                        onClick={() => loadMessages(conversation)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm truncate">{conversation.title}</h3>
                            <Badge className={`${getConversationTypeColor(conversation.conversation_type)} text-white text-xs mt-1`}>
                              {conversation.conversation_type}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 truncate mb-1">
                          {conversation.last_message || 'No messages'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(conversation.last_message_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Messages View */}
            <div className="lg:w-2/3 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="mb-4 pb-4 border-b">
                    <h2 className="text-lg font-semibold">{selectedConversation.title}</h2>
                    <p className="text-sm text-gray-500">
                      {format(new Date(selectedConversation.created_at), 'PPpp')}
                    </p>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.is_bot ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.is_bot
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-brand-red text-white'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                            <p className={`text-xs mt-1 ${message.is_bot ? 'text-gray-500' : 'text-white/70'}`}>
                              {format(new Date(message.created_at), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a conversation to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyChats;
