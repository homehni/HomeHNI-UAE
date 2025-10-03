import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  name?: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, resetUrl }: PasswordResetRequest = await req.json();

    console.log('Sending password reset email to:', email);
    console.log('Reset URL:', resetUrl);

    const emailResponse = await resend.emails.send({
      from: "HomeHNI <noreply@homehni.in>",
      to: [email],
      subject: "Reset Your HomeHNI Password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - HomeHNI</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              line-height: 1.6;
              color: #333333;
              background-color: #f5f5f5;
              padding: 20px;
            }
            
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            
            .header {
              background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>') repeat;
              opacity: 0.3;
            }
            
            .header-content {
              position: relative;
              z-index: 1;
            }
            
            .logo {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }
            
            .logo::before {
              content: '🏠';
              font-size: 32px;
            }
            
            .header h1 {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 8px;
            }
            
            .header p {
              font-size: 16px;
              opacity: 0.9;
            }
            
            .content {
              padding: 40px 30px;
              background: #ffffff;
            }
            
            .greeting {
              font-size: 20px;
              font-weight: 600;
              color: #DC2626;
              margin-bottom: 20px;
            }
            
            .message {
              font-size: 16px;
              line-height: 1.7;
              margin-bottom: 30px;
              color: #555555;
            }
            
            .button-container {
              text-align: center;
              margin: 35px 0;
            }
            
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
              transition: all 0.3s ease;
            }
            
            .reset-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
            }
            
            .url-section {
              background: #f8f9fa;
              border: 2px dashed #DC2626;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
            }
            
            .url-label {
              font-size: 14px;
              font-weight: 600;
              color: #DC2626;
              margin-bottom: 10px;
            }
            
            .url-text {
              word-break: break-all;
              background: #ffffff;
              padding: 12px;
              border-radius: 6px;
              font-family: 'Courier New', monospace;
              font-size: 14px;
              color: #333333;
              border: 1px solid #e2e8f0;
            }
            
            .security-notice {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              border-left: 4px solid #f39c12;
            }
            
            .security-notice h3 {
              color: #8b6f00;
              font-size: 16px;
              margin-bottom: 8px;
              font-weight: 600;
            }
            
            .security-notice p {
              color: #8b6f00;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .help-section {
              background: #f1f5f9;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
            }
            
            .help-section h3 {
              color: #DC2626;
              font-size: 16px;
              margin-bottom: 12px;
              font-weight: 600;
            }
            
            .help-section p {
              font-size: 14px;
              color: #555555;
              line-height: 1.6;
            }
            
            .footer {
              background: #1f2937;
              color: #ffffff;
              padding: 30px;
              text-align: center;
            }
            
            .footer-logo {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #DC2626;
            }
            
            .footer p {
              font-size: 14px;
              opacity: 0.8;
              margin-bottom: 8px;
            }
            
            .footer-links {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #374151;
            }
            
            .footer-links a {
              color: #DC2626;
              text-decoration: none;
              margin: 0 15px;
              font-size: 14px;
            }
            
            .footer-links a:hover {
              text-decoration: underline;
            }
            
            @media only screen and (max-width: 600px) {
              body {
                padding: 10px;
              }
              
              .header, .content, .footer {
                padding: 25px 20px;
              }
              
              .logo {
                font-size: 24px;
              }
              
              .header h1 {
                font-size: 20px;
              }
              
              .reset-button {
                padding: 14px 28px;
                font-size: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="header-content">
                <div class="logo">HomeHNI</div>
                <h1>Password Reset Request</h1>
                <p>Secure account access restoration</p>
              </div>
            </div>
            
            <div class="content">
              <div class="greeting">Hello ${name || 'there'}!</div>
              
              <div class="message">
                We received a request to reset your password for your HomeHNI account. If you made this request, click the button below to set a new password:
              </div>
              
              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset My Password</a>
              </div>
              
              <div class="url-section">
                <div class="url-label">Or copy and paste this link in your browser:</div>
                <div class="url-text">${resetUrl}</div>
              </div>
              
              <div class="security-notice">
                <h3>🔒 Security Notice</h3>
                <p>This password reset link will expire in 1 hour for your security. If you need a new link, you can request another password reset from our login page.</p>
              </div>
              
              <div class="help-section">
                <h3>Didn't request this?</h3>
                <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged, and no action is required on your part.</p>
              </div>
              
              <div class="message">
                <strong>Need help?</strong> Contact our support team if you're having trouble accessing your account or if you have any questions about this password reset.
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-logo">🏠 HomeHNI</div>
              <p>Your trusted partner in home and property services</p>
              <p>© 2024 HomeHNI. All rights reserved.</p>
              <div class="footer-links">
                <a href="https://homehni.in">Visit Website</a>
                <a href="https://homehni.in/support">Support</a>
                <a href="https://homehni.in/privacy">Privacy Policy</a>
              </div>
              <p style="margin-top: 15px; font-size: 12px;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset-email function:", error);
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