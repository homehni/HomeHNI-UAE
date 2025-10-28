-- Enable real-time updates for lead_messages table
-- This allows messages to appear instantly without refresh

-- Enable REPLICA IDENTITY FULL to broadcast complete row data
ALTER TABLE public.lead_messages REPLICA IDENTITY FULL;

-- ============================================
-- ROLLBACK SQL (if you need to undo changes)
-- ============================================
-- Run this command to rollback:
--
-- ALTER TABLE public.lead_messages REPLICA IDENTITY DEFAULT;
--
-- ============================================