import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactOwnerEmailRequest {
  to: string;
  userName: string;
  propertyAddress: string;
  propertyType: string;
  interestedUserName: string;
  interestedUserEmail: string;
  interestedUserPhone: string;
  dashboardUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('send-contact-owner-email function called');

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      userName,
      propertyAddress,
      propertyType,
      interestedUserName,
      interestedUserEmail,
      interestedUserPhone,
      dashboardUrl
    }: ContactOwnerEmailRequest = await req.json();

    console.log('Contact owner email request:', { to, userName, propertyAddress });

    if (!to) {
      throw new Error("Email address required");
    }

    const subject = "🔥 Property Inquiry Received - Connect with Your Lead";

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Property Inquiry Received</title>
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
          <tr>
            <td align="center" style="background:#d32f2f;padding:20px;">
              <img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI">
            </td>
          </tr>
          <tr>
            <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
              <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🔥 Property Inquiry Received</h2>
              <p>Hi ${userName || 'Property Owner'},</p>
              <p>A potential buyer/renter has shown interest in your property listed on Home HNI.</p>

              <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">Property Details:</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                  <tr>
                    <td style="padding:8px 0;width:40%;"><strong>Property:</strong></td>
                    <td>${propertyAddress || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Type:</strong></td>
                    <td>${propertyType || 'N/A'}</td>
                  </tr>
                </table>
              </div>

              <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">Inquirer Details:</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                  <tr>
                    <td style="padding:8px 0;width:40%;"><strong>Name:</strong></td>
                    <td>${interestedUserName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Email:</strong></td>
                    <td>${interestedUserEmail || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Phone:</strong></td>
                    <td>${interestedUserPhone || 'N/A'}</td>
                  </tr>
                </table>
              </div>

              <p style="text-align:center;margin:28px 0;">
                <a href="${dashboardUrl || 'https://homehni.com/dashboard/leads'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">View Lead Details</a>
              </p>

              <p>Thank you for using Home HNI!</p>
              <p><strong>Home HNI Team</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #eee;margin:0;">
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">
              &copy; 2025 Home HNI - Premium Property Platform
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = `🔥 Property Inquiry Received

Hi ${userName || 'Property Owner'},

A potential buyer/renter has shown interest in your property listed on Home HNI.

Property Details:
- Property: ${propertyAddress || 'N/A'}
- Type: ${propertyType || 'N/A'}

Inquirer Details:
- Name: ${interestedUserName || 'N/A'}
- Email: ${interestedUserEmail || 'N/A'}
- Phone: ${interestedUserPhone || 'N/A'}

View Lead Details: ${dashboardUrl || 'https://homehni.com/dashboard/leads'}

Thank you for using Home HNI!

Home HNI Team
© 2025 Home HNI - Premium Property Platform`;

    const emailResponse = await resend.emails.send({
      from: "Home HNI <noreply@homehni.com>",
      to: [to],
      subject,
      html,
      text,
    });

    console.log("Contact owner email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-owner-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);