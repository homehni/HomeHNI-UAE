// Copy this entire content to update your existing "send-verification-email" function in Supabase Dashboard
// Using your existing Gmail/Nodemailer setup

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  name: string;
  verificationUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, verificationUrl }: EmailRequest = await req.json();

    // Send email using your existing email service API
    const emailServiceUrl = 'https://email-system-hni.vercel.app/send-verification-email';
    const apiKey = 'MyNew$uper$ecretKey2025';

    const emailResponse = await fetch(emailServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        to: email,
        userName: name,
        verificationUrl: verificationUrl
      })
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(result.error || 'Failed to send email');
    }

    console.log("Email verification sent successfully:", result);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);