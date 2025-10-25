-- Add 'property_owner' to the conversation_type constraint in chat_conversations table
-- This allows property owner communications to be stored as chat conversations

-- First, drop the existing constraint
ALTER TABLE public.chat_conversations 
DROP CONSTRAINT IF EXISTS chat_conversations_conversation_type_check;

-- Add the new constraint that includes 'property_owner'
ALTER TABLE public.chat_conversations 
ADD CONSTRAINT chat_conversations_conversation_type_check 
CHECK (conversation_type IN ('service', 'plan', 'search', 'property', 'agent', 'builder', 'seller', 'property_owner'));

-- Add comment to document the change
COMMENT ON CONSTRAINT chat_conversations_conversation_type_check ON public.chat_conversations IS 
'Updated to include property_owner conversation type for property owner communications';
