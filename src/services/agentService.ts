import { supabase } from '@/integrations/supabase/client';

export interface AgentDetails {
  name: string;
  email: string;
  previous_work?: string;
  rera_number?: string;
  verification_documents?: Array<{
    type: string;
    url: string;
    name: string;
  }>;
  documents?: Array<{
    type: string;
    url: string;
    name: string;
  }>;
}

export interface AgentRecord extends AgentDetails {
  id: string;
  user_id: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

/**
 * Save or update agent details
 */
export const saveAgentDetails = async (agentDetails: AgentDetails): Promise<AgentRecord> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('agents')
    .upsert({
      user_id: user.id,
      name: agentDetails.name,
      email: agentDetails.email,
      previous_work: agentDetails.previous_work || null,
      rera_number: agentDetails.rera_number || null,
      verification_documents: agentDetails.verification_documents || null,
      documents: agentDetails.documents || null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving agent details:', error);
    throw error;
  }

  return data;
};

/**
 * Get agent details for current user
 */
export const getAgentDetails = async (): Promise<AgentRecord | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No agent record found
      return null;
    }
    console.error('Error fetching agent details:', error);
    throw error;
  }

  return data;
};

/**
 * Check if user has agent profile
 */
export const hasAgentProfile = async (): Promise<boolean> => {
  const agentDetails = await getAgentDetails();
  return agentDetails !== null;
};

/**
 * Get all agents (admin only)
 */
export const getAllAgents = async (): Promise<AgentRecord[]> => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all agents:', error);
    throw error;
  }

  return data || [];
};

/**
 * Update agent verification status (admin only)
 */
export const updateAgentVerificationStatus = async (
  agentId: string,
  status: 'pending' | 'verified' | 'rejected'
): Promise<AgentRecord> => {
  const { data, error } = await supabase
    .from('agents')
    .update({
      verification_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', agentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating agent status:', error);
    throw error;
  }

  return data;
};

