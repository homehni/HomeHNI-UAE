import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the request body
    const { leadId, propertyTitle, ownerName, firstMessage, leadEmail, ownerUserId } = await req.json()

    // Generate a shared conversation ID for linking both conversations
    const sharedConversationId = `prop_owner_${leadId}_${Date.now()}`

    // Create conversation for the property owner
    const ownerConversationTitle = `Property Owner: ${propertyTitle}`
    
    const { data: ownerData, error: ownerError } = await supabaseClient
      .from('chat_conversations')
      .insert({
        user_id: ownerUserId,
        conversation_type: 'property_owner',
        title: ownerConversationTitle,
        last_message: firstMessage,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single()

    if (ownerError) {
      throw new Error(`Owner conversation error: ${ownerError.message}`)
    }

    // Save the initial message to chat_messages for owner
    const { error: ownerMessageError } = await supabaseClient
      .from('chat_messages')
      .insert({
        conversation_id: ownerData.id,
        user_id: ownerUserId,
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
      })

    if (ownerMessageError) {
      throw new Error(`Owner message error: ${ownerMessageError.message}`)
    }

    // Try to find lead's user account
    let leadConversation = null
    try {
      // Look up user by email using admin client
      const { data: leadUser, error: leadUserError } = await supabaseClient.auth.admin.getUserByEmail(leadEmail)
      
      if (!leadUserError && leadUser?.user?.id) {
        // Create conversation for the lead
        const leadConversationTitle = `Property Owner Reply: ${propertyTitle}`
        
        const { data: leadData, error: leadError } = await supabaseClient
          .from('chat_conversations')
          .insert({
            user_id: leadUser.user.id,
            conversation_type: 'property_owner',
            title: leadConversationTitle,
            last_message: firstMessage,
            last_message_at: new Date().toISOString()
          })
          .select()
          .single()

        if (!leadError && leadData) {
          // Save the initial message to chat_messages for lead
          const { error: leadMessageError } = await supabaseClient
            .from('chat_messages')
            .insert({
              conversation_id: leadData.id,
              user_id: leadUser.user.id,
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
            })

          if (!leadMessageError) {
            leadConversation = leadData
          }
        }
      }
    } catch (error) {
      console.log('Lead conversation creation skipped:', error)
    }

    return new Response(
      JSON.stringify({
        success: true,
        ownerConversation: ownerData,
        leadConversation: leadConversation,
        sharedConversationId: sharedConversationId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
