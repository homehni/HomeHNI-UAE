import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Home } from 'lucide-react';
import { format } from 'date-fns';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
  unread_count?: number;
  last_message?: string;
  last_message_at?: string;
  message?: string; // Initial message from contact form
}

interface DealRoomListProps {
  onSelectRoom: (room: DealRoom) => void;
  selectedRoomId?: string;
}

export const DealRoomList: React.FC<DealRoomListProps> = ({
  onSelectRoom,
  selectedRoomId,
}) => {
  const { user } = useAuth();
  const [dealRooms, setDealRooms] = useState<DealRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const channelRef = React.useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    loadDealRooms();
    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user]);

  const loadDealRooms = async () => {
    if (!user) return;

    try {
      // Get leads where user is either the property owner or the interested user
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select(`
          id,
          property_id,
          interested_user_name,
          interested_user_email,
          message,
          created_at,
          properties (
            id,
            title,
            locality,
            city,
            images,
            user_id
          )
        `)
        .or(`property_owner_id.eq.${user.id},interested_user_email.eq.${user.email}`)
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      // Get unread counts and last messages for each lead
      const roomsWithDetails = await Promise.all(
        (leads || []).map(async (lead: any) => {
          const { data: messages } = await supabase
            .from('lead_messages')
            .select('message, created_at, sender_id, is_read')
            .eq('lead_id', lead.id)
            .order('created_at', { ascending: false })
            .limit(1);

          const lastMessage = messages?.[0];

          // Count unread messages sent TO current user (not by them)
          // If I'm the owner, count unread messages from leads
          // If I'm the lead, count unread messages from owner
          const isPropertyOwner = lead.properties?.user_id === user.id;
          const senderType = isPropertyOwner ? 'lead' : 'owner';
          const { count } = await supabase
            .from('lead_messages')
            .select('*', { count: 'exact', head: true })
            .eq('lead_id', lead.id)
            .eq('sender_type', senderType)
            .eq('is_read', false);

          return {
            id: lead.id,
            property_id: lead.property_id,
            interested_user_name: lead.interested_user_name,
            interested_user_email: lead.interested_user_email,
            property_title: lead.properties?.title,
            property_locality: lead.properties?.locality,
            property_city: lead.properties?.city,
            property_images: lead.properties?.images,
            created_at: lead.created_at,
            unread_count: count || 0,
            last_message: lastMessage?.message || lead.message,
            last_message_at: lastMessage?.created_at,
            message: lead.message,
          };
        })
      );

      setDealRooms(roomsWithDetails);
    } catch (error) {
      console.error('Error loading deal rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('deal_rooms_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_messages',
        },
        () => {
          loadDealRooms();
        }
      )
      .subscribe();

    channelRef.current = channel;
  };

  const filteredRooms = dealRooms.filter(
    (room) =>
      room.property_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.interested_user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.property_city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deal rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Deal Rooms List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium mb-1">No deal rooms yet</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? 'No rooms match your search'
                : 'Contact property owners to start conversations'}
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedRoomId === room.id
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onSelectRoom(room)}
              >
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    {/* Property Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {room.property_images && room.property_images.length > 0 ? (
                        <img
                          src={room.property_images[0]}
                          alt={room.property_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Room Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {room.property_title || 'Property'}
                        </h3>
                        {room.unread_count! > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0">
                            {room.unread_count}
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {room.property_locality && room.property_city
                          ? `${room.property_locality}, ${room.property_city}`
                          : room.interested_user_name}
                      </p>

                      {room.last_message && (
                        <p className="text-xs text-muted-foreground truncate mb-1">
                          {room.last_message}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        {room.last_message_at
                          ? format(new Date(room.last_message_at), 'MMM d, h:mm a')
                          : format(new Date(room.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
