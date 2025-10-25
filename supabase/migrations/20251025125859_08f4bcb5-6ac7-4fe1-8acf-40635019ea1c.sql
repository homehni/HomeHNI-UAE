-- Enable realtime for lead_messages table
ALTER TABLE lead_messages REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE lead_messages;