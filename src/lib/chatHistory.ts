import { supabase } from '@/integrations/supabase/client';

export interface ChatConversation {
  id: string;
  user_id: string;
  conversation_type: 'service' | 'plan' | 'search' | 'property' | 'agent' | 'builder' | 'seller' | 'property_owner';
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

// Property Owner Communication Functions
export const createPropertyOwnerConversation = async (
  leadId: string,
  propertyTitle: string,
  ownerName: string,
  firstMessage: string,
  leadEmail: string
): Promise<{ ownerConversation: ChatConversation | null; leadConversation: ChatConversation | null }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return { ownerConversation: null, leadConversation: null };
  }

  console.log('🔍 Creating conversations for both users:', leadEmail);

  // Generate a shared conversation ID for linking both conversations
  const sharedConversationId = `prop_owner_${leadId}_${Date.now()}`;
  
  // 1. Create conversation for the property owner
  const ownerConversationTitle = `Property Owner: ${propertyTitle}`;
  console.log('🔍 Creating owner conversation:', ownerConversationTitle);

  const { data: ownerData, error: ownerError } = await supabase
    .from('chat_conversations')
    .insert({
      user_id: user.id,
      conversation_type: 'property_owner',
      title: ownerConversationTitle,
      last_message: firstMessage,
      last_message_at: new Date().toISOString()
    })
    .select()
    .single();

  if (ownerError) {
    console.error('❌ Error creating owner conversation:', ownerError);
    return { ownerConversation: null, leadConversation: null };
  }

  console.log('✅ Owner conversation created:', ownerData.id);

  // Save the initial message for owner
  const { error: ownerMessageError } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: ownerData.id,
      user_id: user.id,
      message: firstMessage,
      is_bot: false, // Owner messages appear as user messages (left side)
      metadata: {
        lead_id: leadId,
        owner_name: ownerName,
        property_title: propertyTitle,
        sender_type: 'property_owner',
        lead_email: leadEmail,
        shared_conversation_id: sharedConversationId
      }
    });

  if (ownerMessageError) {
    console.error('❌ Error saving owner message:', ownerMessageError);
  } else {
    console.log('✅ Owner message saved');
  }

  // 2. Try to find and create conversation for the lead
  let leadConversation = null;
  
  // First, try to find if there's a user with this email
  const getProfiles = async () => {
    // @ts-ignore - Suppress deep type inference error from Supabase
    const result = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', leadEmail)
      .limit(1);
    return result.data;
  };
  
  const profiles = await getProfiles();

  if (profiles && profiles.length > 0) {
    const leadUserId = profiles[0].user_id;
    console.log('✅ Found lead user account:', leadUserId);

    // Create conversation for the lead
    const leadConversationTitle = `Property Owner Reply: ${propertyTitle}`;
    
    const { data: leadData, error: leadError } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: leadUserId,
        conversation_type: 'property_owner',
        title: leadConversationTitle,
        last_message: firstMessage,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();

    if (!leadError && leadData) {
      console.log('✅ Lead conversation created:', leadData.id);

      // Save the initial message for lead
      const { error: leadMessageError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: leadData.id,
          user_id: leadUserId,
          message: firstMessage,
          is_bot: true, // Property owner messages appear as bot messages (right side) for lead
          metadata: {
            lead_id: leadId,
            owner_name: ownerName,
            property_title: propertyTitle,
            sender_type: 'property_owner',
            lead_email: leadEmail,
            shared_conversation_id: sharedConversationId
          }
        });

      if (!leadMessageError) {
        leadConversation = leadData;
        console.log('✅ Lead message saved');
      }
    }
  } else {
    console.log('ℹ️ Lead does not have an account - only owner conversation created');
  }

  return { 
    ownerConversation: ownerData as ChatConversation, 
    leadConversation 
  };
};

export const addPropertyOwnerMessage = async (
  conversationId: string,
  message: string,
  leadId: string,
  ownerName: string
): Promise<void> => {
  console.log('🔍 addPropertyOwnerMessage function called with:', {
    conversationId,
    message,
    leadId,
    ownerName
  });

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('❌ User not authenticated');
    return;
  }

  console.log('🔍 Adding message to existing conversation:', conversationId);

  // Get the conversation details
  console.log('🔍 Fetching conversation data from database...');
  const { data: conversation, error: conversationError } = await supabase
    .from('chat_conversations')
    .select('title')
    .eq('id', conversationId)
    .single();
  
  console.log('🔍 Database query completed. Data:', conversation, 'Error:', conversationError);

  if (conversationError) {
    console.error('❌ Error fetching conversation:', conversationError);
    return;
  }

  if (!conversation) {
    console.error('❌ Conversation not found');
    return;
  }

  console.log('🔍 Conversation data:', conversation);

  const propertyTitle = conversation.title?.replace('Property Owner: ', '') || 'Unknown Property';
  console.log('🔍 Property title:', propertyTitle);

  // Generate a shared conversation ID based on the conversation and lead
  const sharedConversationId = `prop_owner_${leadId}_${conversationId}`;
  console.log('🔍 Generated shared conversation ID:', sharedConversationId);

  // Save message for owner
  console.log('🔍 Saving message for owner:', {
    conversation_id: conversationId,
    user_id: user.id,
    message,
    is_bot: false
  });

  const { error: messageError } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      user_id: user.id,
      message,
      is_bot: false, // Owner messages appear as user messages (left side)
      metadata: {
        lead_id: leadId,
        owner_name: ownerName,
        sender_type: 'property_owner',
        shared_conversation_id: sharedConversationId
      }
    });

  if (messageError) {
    console.error('❌ Error saving property owner message:', messageError);
    return;
  } else {
    console.log('✅ Owner message saved successfully');
  }

  // Update owner conversation last message
  console.log('🔍 Updating conversation last message...');
  const { error: updateError } = await supabase
    .from('chat_conversations')
    .update({
      last_message: message,
      last_message_at: new Date().toISOString()
    })
    .eq('id', conversationId);

  if (updateError) {
    console.error('❌ Error updating property owner conversation:', updateError);
  } else {
    console.log('✅ Conversation last message updated successfully');
  }

  // Now find and update the lead's conversation if it exists
  console.log('🔍 Looking for lead conversation with shared ID:', sharedConversationId);
  
  // First, let's check if the lead has an account by looking at the lead data
  console.log('🔍 Checking if lead has an account for lead ID:', leadId);
  const { data: leadData } = await supabase
    .from('leads')
    .select('interested_user_email')
    .eq('id', leadId)
    .single();
  
  if (leadData) {
    console.log('🔍 Lead email:', leadData.interested_user_email);
    
    // Check if there's a user account with this email
    console.log('🔍 Searching for user profile with email:', leadData.interested_user_email);
    
    // Try exact match first
    let { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    console.log('🔍 Exact match result:', { userProfile, profileError });
    
    console.log('🔍 Final profile search result:', { userProfile, profileError });
    
    if (userProfile) {
      console.log('✅ Lead has an account:', userProfile.id);
      
      // Find the lead's conversation using the property title
      const { data: leadConversations } = await supabase
        .from('chat_conversations')
        .select('id, user_id')
        .eq('conversation_type', 'property_owner')
        .eq('user_id', userProfile.id)
        .like('title', `Property Owner Reply: ${propertyTitle}`);
      
      console.log('🔍 Lead conversations found:', leadConversations);
      
      if (leadConversations && leadConversations.length > 0) {
        const leadConversation = leadConversations[0];
        console.log('✅ Found lead conversation:', leadConversation.id);

        // Save message for lead
        const { error: leadMessageError } = await supabase
          .from('chat_messages')
          .insert({
            conversation_id: leadConversation.id,
            user_id: leadConversation.user_id,
            message,
            is_bot: true, // Property owner messages appear as bot messages (right side) for lead
            metadata: {
              lead_id: leadId,
              owner_name: ownerName,
              sender_type: 'property_owner',
              shared_conversation_id: sharedConversationId
            }
          });

        if (leadMessageError) {
          console.error('❌ Error saving lead message:', leadMessageError);
        } else {
          console.log('✅ Lead message saved');
        }

        // Update lead conversation last message
        const { error: leadUpdateError } = await supabase
          .from('chat_conversations')
          .update({
            last_message: message,
            last_message_at: new Date().toISOString()
          })
          .eq('id', leadConversation.id);

        if (leadUpdateError) {
          console.error('❌ Error updating lead conversation:', leadUpdateError);
        } else {
          console.log('✅ Lead conversation updated');
        }
      } else {
        console.log('ℹ️ No lead conversation found - creating new one...');
        
        // Create a new conversation for the lead
        const leadConversationTitle = `Property Owner Reply: ${propertyTitle}`;
        const { data: newLeadConversation, error: createError } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: userProfile.id,
            conversation_type: 'property_owner',
            title: leadConversationTitle,
            last_message: message,
            last_message_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Error creating lead conversation:', createError);
        } else {
          console.log('✅ Created new lead conversation:', newLeadConversation.id);
          
          // Save message for the new lead conversation
          const { error: leadMessageError } = await supabase
            .from('chat_messages')
            .insert({
              conversation_id: newLeadConversation.id,
              user_id: userProfile.id,
              message,
              is_bot: true, // Property owner messages appear as bot messages (right side) for lead
              metadata: {
                lead_id: leadId,
                owner_name: ownerName,
                sender_type: 'property_owner',
                shared_conversation_id: sharedConversationId
              }
            });

          if (leadMessageError) {
            console.error('❌ Error saving lead message:', leadMessageError);
          } else {
            console.log('✅ Lead message saved in new conversation');
          }
        }
      }
    } else {
      console.log('ℹ️ Lead does not have an account - only owner conversation updated');
      
      // Send email notification to lead since they don't have an account
      console.log('📧 Sending email notification to lead...');
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: leadData.interested_user_email,
            subject: `Reply from Property Owner: ${propertyTitle}`,
            template: 'property_owner_reply',
            data: {
              leadName: leadData.interested_user_email,
              ownerName: ownerName,
              propertyTitle: propertyTitle,
              message: message,
              replyUrl: `${window.location.origin}/dashboard?tab=chats`
            }
          })
        });

        if (emailResponse.ok) {
          console.log('✅ Email notification sent successfully');
        } else {
          console.log('⚠️ Email notification failed, but message was saved');
        }
      } catch (emailError) {
        console.log('⚠️ Email notification failed:', emailError);
        // Don't throw error - message was still saved
      }
    }
  } else {
    console.log('❌ Lead data not found');
  }
};

export const getPropertyOwnerConversations = async (): Promise<ChatConversation[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', user.id)
    .eq('conversation_type', 'property_owner')
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('Error fetching property owner conversations:', error);
    return [];
  }

  return (data || []) as ChatConversation[];
};

export const debugGetAllConversations = async (): Promise<ChatConversation[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log('❌ No user authenticated');
    return [];
  }

  console.log('🔍 Debug: Fetching all conversations for user:', user.id);

  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching conversations:', error);
    return [];
  }

  console.log('📋 Debug: Found conversations:', data);
  
  // Log each conversation in detail
  if (data && data.length > 0) {
    data.forEach((conv, index) => {
      console.log(`📋 Conversation ${index + 1}:`, {
        id: conv.id,
        title: conv.title,
        type: conv.conversation_type,
        last_message: conv.last_message,
        last_message_at: conv.last_message_at,
        user_id: conv.user_id
      });
    });
  } else {
    console.log('📋 No conversations found');
  }
  
  return (data || []) as ChatConversation[];
};
