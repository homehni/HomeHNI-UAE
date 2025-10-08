import { supabase } from '@/integrations/supabase/client';

export interface ChatConversation {
  id: string;
  user_id: string;
  conversation_type: 'service' | 'plan' | 'search' | 'property' | 'agent' | 'builder' | 'seller';
  title: string;
  last_message: string | null;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  message: string;
  is_bot: boolean;
  metadata?: any;
  created_at: string;
}

export const createConversation = async (
  conversationType: string,
  title: string,
  firstMessage: string
): Promise<ChatConversation | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      user_id: user.id,
      conversation_type: conversationType,
      title,
      last_message: firstMessage,
      last_message_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }

  // Save the initial bot message to chat_messages
  if (data) {
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: data.id,
        user_id: user.id,
        message: firstMessage,
        is_bot: true,
        metadata: {}
      });

    if (messageError) {
      console.error('Error saving initial message:', messageError);
    }
  }

  return data as ChatConversation;
};

export const saveMessage = async (
  conversationId: string,
  message: string,
  isBot: boolean,
  metadata?: any
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return;
  }

  // Save message
  const { error: messageError } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      user_id: user.id,
      message,
      is_bot: isBot,
      metadata: metadata || {}
    });

  if (messageError) {
    console.error('Error saving message:', messageError);
    return;
  }

  // Update conversation last message
  const { error: updateError } = await supabase
    .from('chat_conversations')
    .update({
      last_message: message,
      last_message_at: new Date().toISOString()
    })
    .eq('id', conversationId);

  if (updateError) {
    console.error('Error updating conversation:', updateError);
  }
};

export const getUserConversations = async (): Promise<ChatConversation[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  return (data || []) as ChatConversation[];
};

export const getConversationMessages = async (conversationId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
};

export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('chat_conversations')
    .delete()
    .eq('id', conversationId);

  if (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }

  return true;
};
