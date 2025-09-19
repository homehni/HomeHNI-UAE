import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, verificationUrl }: EmailRequest = await req.json();

    console.log('Sending verification email to:', email);
    console.log('Verification URL:', verificationUrl);

    const emailResponse = await resend.emails.send({
      from: "HomeHNI <noreply@homehni.in>",
      to: [email],
      subject: "Welcome to HomeHNI - Verify Your Email",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Verify Your Email - HomeHNI</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .button:hover { background: #5a67d8; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to HomeHNI!</h1>
            <p>Your trusted real estate platform</p>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Thank you for signing up with HomeHNI. To complete your registration and start exploring properties, please verify your email address.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e2e8f0; padding: 10px; border-radius: 4px; font-family: monospace;">
              ${verificationUrl}
            </p>
            
            <p><strong>This link will expire in 24 hours for security reasons.</strong></p>
            
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>Browse and search properties</li>
              <li>Save your favorite listings</li>
              <li>Contact property owners</li>
              <li>List your own properties</li>
            </ul>
            
            <p>If you didn't create an account with HomeHNI, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 HomeHNI. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
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