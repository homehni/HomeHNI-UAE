import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
  status?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, name }: CreateUserRequest = await req.json();

    console.log("Creating user with email:", email);

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create user with autoConfirm disabled (requires email verification)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Require email verification
      user_metadata: {
        full_name: name,
        name: name
      }
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      
      // Check if it's a duplicate email error
      if (authError.message?.includes('already') || authError.message?.includes('exists') || authError.message?.includes('duplicate')) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "This email is already registered",
            code: "email_exists",
            status: 409
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: authError.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create user" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("User created successfully:", authData.user.id);

    // Generate verification token
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('generate_verification_token', {
        p_user_id: authData.user.id,
        p_email: email
      });

    if (tokenError || !tokenData) {
      console.error("Error generating verification token:", tokenError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to generate verification token" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Verification token generated successfully");

    // Send verification email
    try {
      const emailResponse = await fetch(
        `${SUPABASE_URL}/functions/v1/send-verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            email,
            name,
            verificationToken: tokenData
          }),
        }
      );

      if (!emailResponse.ok) {
        console.error("Failed to send verification email:", await emailResponse.text());
        // Don't fail signup if email fails
      } else {
        console.log("Verification email sent successfully");
      }
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Don't fail signup if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: authData.user,
        message: "User created successfully. Please check your email to verify your account."
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in create-user function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
