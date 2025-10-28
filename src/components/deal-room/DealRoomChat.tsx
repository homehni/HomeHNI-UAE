import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, ArrowLeft, UserCircle2, Home } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  lead_id: string;
  sender_id: string;
  sender_type: 'owner' | 'lead';
  message: string;
  is_read: boolean;
  created_at: string;
}

interface DealRoom {
  id: string;
  property_id: string;
  interested_user_name: string;
  interested_user_email: string;
  property_title?: string;
  property_locality?: string;
  property_city?: string;
  property_images?: string[];
  created_at: string;
  message?: string; // Initial message from contact form
}

interface DealRoomChatProps {
  dealRoom: DealRoom;
  onBack: () => void;
}

export const DealRoomChat: React.FC<DealRoomChatProps> = ({ dealRoom, onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Determine if current user is the property owner by checking against properties
  const [isOwner, setIsOwner] = React.useState(false);
  const [ownerInfo, setOwnerInfo] = React.useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (!user || !dealRoom.property_id) return;
    
    // Check if current user owns this property and fetch owner info
    supabase
      .from('properties')
      .select('user_id, owner_name, owner_email')
      .eq('id', dealRoom.property_id)
      .single()
      .then(({ data }) => {
        const userIsOwner = data?.user_id === user.id;
        setIsOwner(userIsOwner);
        
        // If current user is NOT the owner, store owner info to display
        if (!userIsOwner && data) {
          setOwnerInfo({
            name: data.owner_name || 'Property Owner',
            email: data.owner_email || ''
          });
        }
      });
  }, [user, dealRoom.property_id]);

  useEffect(() => {
    if (!dealRoom.id || !user) return;

    loadMessages();
    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [dealRoom.id, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!dealRoom.id) return;
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadMessages();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [dealRoom.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_messages')
        .select('*')
        .eq('lead_id', dealRoom.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // If no messages exist but there's an initial message from leads table, show it
      if ((!data || data.length === 0) && dealRoom.message) {
        const initialMessage: Message = {
          id: `initial-${dealRoom.id}`,
          lead_id: dealRoom.id,
          sender_id: '', // Empty since we don't have sender_id in leads table
          sender_type: 'lead',
          message: dealRoom.message,
          is_read: false,
          created_at: dealRoom.created_at,
        };
        setMessages([initialMessage]);
      } else {
        setMessages((data || []) as Message[]);
      }

      // Mark messages as read
      await markMessagesAsRead();
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!user) return;

    try {
      // Mark messages as read that were sent BY the OTHER party
      // If I'm the owner, mark messages from leads as read
      // If I'm the lead, mark messages from owner as read
      const senderType = isOwner ? 'lead' : 'owner';
      await supabase
        .from('lead_messages')
        .update({ is_read: true })
        .eq('lead_id', dealRoom.id)
        .eq('sender_type', senderType)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    // Ensure we don't have duplicate subscriptions
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`deal_room_${dealRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_messages',
          filter: `lead_id=eq.${dealRoom.id}`,
        },
        () => {
          loadMessages();
        }
      )
      .subscribe((status) => {
        console.log('Realtime status (deal room)', dealRoom.id, status);
      });

    channelRef.current = channel;
  };
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    try {
      // Sender type: 'owner' if property owner, 'lead' if interested user
      const senderType = isOwner ? 'owner' : 'lead';
      
      const { error } = await supabase
        .from('lead_messages')
        .insert({
          lead_id: dealRoom.id,
          sender_id: user.id,
          sender_type: senderType,
          message: newMessage.trim(),
          is_read: false,
        });

      if (error) throw error;

      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!domain) return email;
    const maskedUsername = username.charAt(0) + '****';
    return `${maskedUsername}@${domain}`;
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="border-b py-3 px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {dealRoom.property_title || 'Property Deal Room'}
            </CardTitle>
            <p className="text-xs text-muted-foreground truncate">
              {dealRoom.property_locality && dealRoom.property_city
                ? `${dealRoom.property_locality}, ${dealRoom.property_city}`
                : 'Location not specified'}
            </p>
            <div className="mt-1.5 inline-flex items-center gap-2 px-2 py-1.5 bg-primary/10 rounded-md border border-primary/20">
              <UserCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-medium text-sm">
                {isOwner ? (
                  <>
                    {dealRoom.interested_user_name}
                    <span className="text-muted-foreground ml-1 text-xs">({maskEmail(dealRoom.interested_user_email)})</span>
                  </>
                ) : ownerInfo ? (
                  <>
                    {ownerInfo.name}
                    {ownerInfo.email && <span className="text-muted-foreground ml-1 text-xs">({maskEmail(ownerInfo.email)})</span>}
                  </>
                ) : (
                  <span className="text-muted-foreground">Loading contact...</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-muted/20">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <UserCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No messages yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start the conversation by sending a message
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMyMessage = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                      isMyMessage
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-background border rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isMyMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {format(new Date(msg.created_at), 'h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Message Input */}
      <CardContent className="border-t p-4 flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            size="icon"
            className="h-[44px] w-[44px] flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
