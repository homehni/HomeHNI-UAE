import React, { useState } from 'react';
import { DealRoomList } from './DealRoomList';
import { DealRoomChat } from './DealRoomChat';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

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

export const DealRoomLayout: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<DealRoom | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleSelectRoom = (room: DealRoom) => {
    setSelectedRoom(room);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
    setSelectedRoom(null);
  };

  return (
    <div className="h-full">
      {/* Mobile Layout */}
      <div className="lg:hidden h-full">
        {showChat && selectedRoom ? (
          <DealRoomChat dealRoom={selectedRoom} onBack={handleBack} />
        ) : (
          <Card className="h-full border-0 rounded-none">
            <DealRoomList
              onSelectRoom={handleSelectRoom}
              selectedRoomId={selectedRoom?.id}
            />
          </Card>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-full">
        <div className="flex h-full gap-4">
          {/* Left Panel - Deal Rooms List */}
          <Card className="w-1/3 min-w-[320px] max-w-[400px]">
            <DealRoomList
              onSelectRoom={handleSelectRoom}
              selectedRoomId={selectedRoom?.id}
            />
          </Card>

          {/* Right Panel - Chat */}
          <div className="flex-1">
            {selectedRoom ? (
              <DealRoomChat dealRoom={selectedRoom} onBack={handleBack} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium mb-1">
                    Select a deal room
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation to view messages
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
