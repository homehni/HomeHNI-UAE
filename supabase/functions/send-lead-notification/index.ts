import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  ownerEmail: string;
  ownerName: string;
  propertyTitle: string;
  leadData: {
    inquirerName: string;
    inquirerEmail: string;
    inquirerPhone?: string;
    message?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Lead notification function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ownerEmail, ownerName, propertyTitle, leadData }: LeadNotificationRequest = await req.json();
    
    console.log(`Sending lead notification to ${ownerEmail} for property: ${propertyTitle}`);

    const emailResponse = await resend.emails.send({
      from: "HomeHNI <notifications@resend.dev>",
      to: [ownerEmail],
      subject: `New Inquiry for Your Property: ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Property Inquiry
          </h2>
          
          <p>Hello ${ownerName},</p>
          
          <p>You have received a new inquiry for your property: <strong>${propertyTitle}</strong></p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Inquirer Details:</h3>
            <p><strong>Name:</strong> ${leadData.inquirerName}</p>
            <p><strong>Email:</strong> ${leadData.inquirerEmail}</p>
            ${leadData.inquirerPhone ? `<p><strong>Phone:</strong> ${leadData.inquirerPhone}</p>` : ''}
            ${leadData.message ? `
              <div style="margin-top: 15px;">
                <strong>Message:</strong>
                <p style="background-color: white; padding: 15px; border-radius: 4px; margin: 5px 0;">
                  ${leadData.message}
                </p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Next Steps:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Review the inquiry details above</li>
              <li>Contact the inquirer directly using their provided contact information</li>
              <li>Schedule a property viewing if appropriate</li>
            </ul>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="color: #666; font-size: 14px;">
            This is an automated notification from HomeHNI. Please do not reply to this email.
            <br>
            Contact the inquirer directly using the information provided above.
          </p>
        </div>
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
    console.error("Error in send-lead-notification function:", error);
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