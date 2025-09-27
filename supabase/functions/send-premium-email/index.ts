import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  userName: string;
  locality: string;
  rangeMin: number;
  rangeMax: number;
  yourPrice: number;
  updatePriceUrl: string;
  propertyType?: string;
  listingType?: string;
  userType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      to, 
      userName, 
      locality, 
      rangeMin, 
      rangeMax, 
      yourPrice, 
      updatePriceUrl, 
      propertyType = 'residential', 
      listingType = 'sell', 
      userType = 'seller' 
    }: EmailRequest = await req.json();

    console.log('📧 Premium email request received:', { to, userName, locality, propertyType, listingType, userType });

    if (!to) {
      return new Response(
        JSON.stringify({ status: "error", error: "Email address required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const subject = "💰 Market Insights & Premium Plans for " + (locality || 'Your Area');
    
    // Define pricing plans based on user's website structure
    const pricingPlans = {
      seller: {
        residential: [
          { name: "Silver Plan", price: "₹999", duration: "90 days", features: ["Relationship Manager", "Sale Agreement Support", "Super Fast Closure"], url: "/plans?tab=seller", badge: "BASIC PROMOTION" },
          { name: "Gold Plan", price: "₹9,999", duration: "90 days", features: ["Dedicated RM", "Top Slot Listing", "5X More Visibility", "Social Media Marketing"], url: "/plans?tab=seller", badge: "SOCIAL BOOST" },
          { name: "Platinum Plan", price: "₹14,999", duration: "120 days", features: ["Premium RM", "Featured Listing Priority", "Multi-Platform Marketing"], url: "/plans?tab=seller", badge: "EXPERT GUIDANCE" }
        ],
        commercial: [
          { name: "Business Silver", price: "₹999", duration: "120 days", features: ["Commercial Property Expert", "Commercial Documentation", "Business Priority"], url: "/plans?tab=seller", badge: "COMMERCIAL MARKETING" },
          { name: "Business Gold", price: "₹18,999", duration: "150 days", features: ["Dedicated Commercial Manager", "Premium Business Exposure"], url: "/plans?tab=seller", badge: "PREMIUM BUSINESS BOOST" },
          { name: "Business Platinum", price: "₹25,999", duration: "180 days", features: ["Executive Business Consultant", "Exclusive Promotion"], url: "/plans?tab=seller", badge: "BUSINESS EXPERT" }
        ],
        industrial: [
          { name: "Industrial Basic", price: "₹999", duration: "120 days", features: ["Industrial Expert", "Technical Documentation"], url: "/plans?tab=seller", badge: "INDUSTRIAL PROMOTION" },
          { name: "Industrial Pro", price: "₹28,999", duration: "150 days", features: ["Industrial Specialist", "Enterprise Marketing"], url: "/plans?tab=seller", badge: "ENTERPRISE MARKETING" },
          { name: "Industrial Elite", price: "₹45,999", duration: "180 days", features: ["Industrial Expert", "Premium Marketing"], url: "/plans?tab=seller", badge: "INDUSTRIAL EXPERT" }
        ],
        agricultural: [
          { name: "Farm Silver", price: "₹999", duration: "90 days", features: ["Agricultural Expert", "Farm Documentation"], url: "/plans?tab=seller", badge: "FARM MARKETING" },
          { name: "Farm Gold", price: "₹14,999", duration: "120 days", features: ["Agricultural Specialist", "Farm Marketing"], url: "/plans?tab=seller", badge: "AGRICULTURAL BOOST" },
          { name: "Farm Platinum", price: "₹22,999", duration: "150 days", features: ["Farm Expert", "Premium Agricultural Marketing"], url: "/plans?tab=seller", badge: "FARM EXPERT" }
        ]
      },
      owner: {
        residential: [
          { name: "Silver", price: "₹100", duration: "45 days", features: ["Relationship Manager", "Rental Agreement Delivered"], url: "/plans?tab=owner", badge: "ON CALL ASSISTANCE" },
          { name: "Gold", price: "₹5,899", duration: "45 days", features: ["Dedicated RM", "Property Photoshoot", "5X Visibility"], url: "/plans?tab=owner", badge: "HOUSE VISIT ASSISTANCE" },
          { name: "Platinum", price: "₹6,999", duration: "60 days", features: ["Premium Documentation", "Professional Photography"], url: "/plans?tab=owner", badge: "EXPERT GUIDANCE" }
        ],
        commercial: [
          { name: "Business Basic", price: "₹999", duration: "60 days", features: ["Commercial Expert", "Business Documentation"], url: "/plans?tab=owner", badge: "COMMERCIAL SUPPORT" },
          { name: "Business Pro", price: "₹15,999", duration: "90 days", features: ["Dedicated Commercial Manager", "Premium Exposure"], url: "/plans?tab=owner", badge: "PREMIUM MARKETING" },
          { name: "Business Elite", price: "₹25,999", duration: "120 days", features: ["Enterprise Manager", "Custom Solutions"], url: "/plans?tab=owner", badge: "DEDICATED MANAGER" }
        ]
      },
      builder: {
        residential: [
          { name: "Lifetime Standard", price: "₹1,49,999", duration: "Lifetime access", features: ["Project Showcase", "Basic Marketing"], url: "/plans?tab=builder-lifetime", badge: "PROJECT SHOWCASE" },
          { name: "Lifetime Platinum", price: "₹2,49,999", duration: "Lifetime access", features: ["Enhanced Marketing", "Featured Placement"], url: "/plans?tab=builder-lifetime", badge: "ENHANCED MARKETING" },
          { name: "Lifetime VIP", price: "₹3,99,999", duration: "Lifetime access", features: ["Premium Showcase", "Maximum Visibility"], url: "/plans?tab=builder-lifetime", badge: "PREMIUM SHOWCASE" }
        ]
      },
      commercialSeller: {
        commercial: [
          { name: "Business Silver", price: "₹8,999", duration: "120 days", features: ["Business Essentials", "Commercial Marketing"], url: "/commercial-seller-plans", badge: "BUSINESS ESSENTIALS" },
          { name: "Business Gold", price: "₹15,999", duration: "150 days", features: ["Enhanced Business Marketing", "Premium Networks"], url: "/commercial-seller-plans", badge: "BUSINESS POPULAR" },
          { name: "Business Platinum", price: "₹25,999", duration: "180 days", features: ["Premium Business Features", "Maximum Exposure"], url: "/commercial-seller-plans", badge: "BUSINESS PREMIUM" }
        ]
      }
    };

    // Determine correct plan category
    let currentPlans = [];
    let planCategory = userType || 'seller';
    let propertyCategory = propertyType || 'residential';

    if (pricingPlans[planCategory] && pricingPlans[planCategory][propertyCategory]) {
      currentPlans = pricingPlans[planCategory][propertyCategory];
    } else if (pricingPlans[planCategory]) {
      currentPlans = Object.values(pricingPlans[planCategory])[0];
    } else {
      currentPlans = pricingPlans.seller.residential;
    }

    const plansHtml = currentPlans.slice(0, 3).map(plan => `
      <div style="border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; margin: 15px 0; text-align: center; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background: #d32f2f; color: white; padding: 8px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin: 0 auto 15px; display: inline-block;">${plan.badge}</div>
        <h3 style="color: #d32f2f; margin: 0 0 10px; font-size: 20px; font-weight: bold;">${plan.name}</h3>
        <div style="font-size: 28px; font-weight: bold; color: #333; margin: 10px 0;">${plan.price}</div>
        <div style="color: #666; margin-bottom: 15px; font-style: italic;">${plan.duration}</div>
        <ul style="list-style: none; padding: 0; margin: 15px 0; text-align: left;">
          ${plan.features.map(feature => `<li style="padding: 5px 0; color: #555; font-size: 14px;">✓ ${feature}</li>`).join('')}
        </ul>
        <a href="https://homehni.com${plan.url}" style="background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 15px;">Choose ${plan.name}</a>
      </div>
    `).join('');
    
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Market Insights & Premium Plans</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);padding:25px;"><img src="https://homehni.com/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI" style="filter: brightness(0) invert(1);"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 20px;color:#d32f2f;font-size:26px;text-align:center;">💰 Market Insights for ${locality || 'Your Area'}</h2>
            <p style="font-size:18px;">Hello <strong>${userName || 'there'}</strong>,</p>
            <p>Great news! We've analyzed recent market trends in <strong>${locality || 'your area'}</strong> and have personalized recommendations for your <strong>${propertyType || 'residential'} ${listingType || 'sale'}</strong> property.</p>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #d32f2f;">
              <h3 style="margin: 0 0 15px; color: #d32f2f; font-size: 20px;">📊 Market Analysis</h3>
              <p style="margin: 8px 0; font-size: 16px;">Properties in your area recently closed between <strong style="color:#2e7d32;">₹${rangeMin || 'N/A'} – ₹${rangeMax || 'N/A'}</strong></p>
              <p style="margin: 8px 0; font-size: 16px;">Your current listing price: <strong style="color:#d32f2f;">₹${yourPrice || 'N/A'}</strong></p>
            </div>

            <h3 style="color: #d32f2f; margin: 35px 0 25px; text-align: center; font-size: 22px;">🚀 Boost Your Property's Success Rate</h3>
            <p style="text-align: center; font-size: 17px; margin-bottom: 30px;">Upgrade to our premium plans and achieve <strong>3X faster results</strong>:</p>
            
            ${plansHtml}
            
            <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h4 style="margin: 0 0 15px; color: #2e7d32; font-size: 20px;">🎯 Why Choose Home HNI Premium?</h4>
              <p style="margin: 5px 0;">✓ Premium listings get <strong>5X more views</strong></p>
              <p style="margin: 5px 0;">✓ Featured properties close <strong>3X faster</strong></p>
              <p style="margin: 5px 0;">✓ Dedicated expert support</p>
              <p style="margin: 5px 0;">✓ Advanced analytics & insights</p>
            </div>

            <p style="text-align:center;margin:35px 0;">
              <a href="https://homehni.com/plans?tab=${planCategory}" style="background:linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);color:#fff;text-decoration:none;padding:18px 36px;border-radius:10px;font-weight:bold;font-size:18px;display:inline-block;">🎯 View All Plans</a>
            </p>
            
            <p style="font-size: 16px; margin-top: 30px;">Best regards,<br><strong>Team Home HNI</strong><br><em>Your Premium Property Partner</em></p>
          </td>
        </tr>
        <tr><td align="center" style="background:#f9f9f9;padding:20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Solutions</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    console.log('📤 Sending premium email to:', to);

    const emailResponse = await resend.emails.send({
      from: "HomeHNI <noreply@homehni.in>",
      to: [to],
      subject,
      html,
    });

    console.log("✅ Premium email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      status: "success", 
      message: "Premium email sent successfully",
      emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error in send-premium-email function:", error);
    return new Response(
      JSON.stringify({ 
        status: "error", 
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