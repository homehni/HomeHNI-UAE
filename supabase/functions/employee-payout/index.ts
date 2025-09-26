import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PayoutRequest {
  employee_id: string;
  payout_type: 'salary' | 'bonus' | 'reimbursement' | 'advance';
  amount: number;
  description?: string;
  bank_account?: {
    account_holder_name: string;
    account_number: string;
    routing_number: string;
    account_type: 'checking' | 'savings';
  };
}

interface ApprovalRequest {
  payout_id: string;
  action: 'approve' | 'reject';
  rejection_reason?: string;
}

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [EMPLOYEE-PAYOUT] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Supabase clients
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const requestData = await req.json();
    const action = requestData.action || 'create'; // 'create', 'approve', 'reject', 'process'

    // Get current user's employee record and role
    const { data: currentEmployee } = await supabaseAdmin
      .from("employees")
      .select("id, role")
      .eq("email", user.email)
      .single();

    const { data: userRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const isSuperAdmin = userRole?.role === 'admin';
    const isHRAdmin = currentEmployee?.role === 'hr_admin';
    const isFinanceAdmin = currentEmployee?.role === 'finance_admin';

    logStep("User permissions", { isSuperAdmin, isHRAdmin, isFinanceAdmin });

    if (action === 'create') {
      // HR and Finance admins can create payout requests
      if (!isHRAdmin && !isFinanceAdmin && !isSuperAdmin) {
        throw new Error("Only HR or Finance admins can create payout requests");
      }

      const payoutData: PayoutRequest = requestData;
      
      // Validate required fields
      if (!payoutData.employee_id || !payoutData.payout_type || !payoutData.amount) {
        throw new Error("Missing required fields");
      }

      // Verify employee exists
      const { data: employee, error: employeeError } = await supabaseAdmin
        .from("employees")
        .select("id, full_name, email")
        .eq("id", payoutData.employee_id)
        .single();

      if (employeeError || !employee) {
        throw new Error("Employee not found");
      }

      // Create payout request
      const { data: payout, error: payoutError } = await supabaseAdmin
        .from("employee_payouts")
        .insert({
          employee_id: payoutData.employee_id,
          payout_type: payoutData.payout_type,
          amount: payoutData.amount,
          description: payoutData.description,
          status: 'pending',
          requested_by: user.id
        })
        .select()
        .single();

      if (payoutError) {
        throw new Error(`Failed to create payout request: ${payoutError.message}`);
      }

      logStep("Payout request created", { payoutId: payout.id });

      return new Response(JSON.stringify({
        success: true,
        payout,
        message: `Payout request created for ${employee.full_name}`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === 'approve' || action === 'reject') {
      // Only Finance admins can approve/reject payouts
      if (!isFinanceAdmin && !isSuperAdmin) {
        throw new Error("Only Finance admins can approve or reject payouts");
      }

      const approvalData: ApprovalRequest = requestData;
      
      if (!approvalData.payout_id) {
        throw new Error("Payout ID is required");
      }

      if (action === 'reject' && !approvalData.rejection_reason) {
        throw new Error("Rejection reason is required");
      }

      const updateData: any = {
        status: action === 'approve' ? 'approved' : 'rejected',
        [`${action === 'approve' ? 'approved' : 'rejected'}_by`]: user.id,
        [`${action === 'approve' ? 'approved' : 'rejected'}_at`]: new Date().toISOString(),
      };

      if (action === 'reject') {
        updateData.rejection_reason = approvalData.rejection_reason;
      }

      const { data: updatedPayout, error: updateError } = await supabaseAdmin
        .from("employee_payouts")
        .update(updateData)
        .eq("id", approvalData.payout_id)
        .select("*, employees(full_name, email)")
        .single();

      if (updateError) {
        throw new Error(`Failed to ${action} payout: ${updateError.message}`);
      }

      logStep(`Payout ${action}ed`, { payoutId: approvalData.payout_id });

      return new Response(JSON.stringify({
        success: true,
        payout: updatedPayout,
        message: `Payout ${action}ed successfully`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === 'process') {
      // Only Finance admins can process approved payouts
      if (!isFinanceAdmin && !isSuperAdmin) {
        throw new Error("Only Finance admins can process payouts");
      }

      const { payout_id, bank_account } = requestData;
      
      if (!payout_id) {
        throw new Error("Payout ID is required");
      }

      // Get the approved payout
      const { data: payout, error: payoutError } = await supabaseAdmin
        .from("employee_payouts")
        .select("*, employees(full_name, email)")
        .eq("id", payout_id)
        .eq("status", "approved")
        .single();

      if (payoutError || !payout) {
        throw new Error("Approved payout not found");
      }

      try {
        // Create Stripe transfer (this would normally go to employee's bank account)
        // For demo purposes, we'll create a payment intent instead
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(payout.amount * 100), // Convert to cents
          currency: 'usd',
          description: `${payout.payout_type} payout for ${payout.employees.full_name}: ${payout.description}`,
          metadata: {
            employee_id: payout.employee_id,
            payout_id: payout.id,
            payout_type: payout.payout_type,
          },
          // In production, you would use Stripe Connect to transfer to employee accounts
          // payment_method_types: ['us_bank_account'],
        });

        logStep("Stripe payment intent created", { paymentIntentId: paymentIntent.id });

        // Update payout with Stripe payment intent ID and mark as paid
        const { data: updatedPayout, error: updateError } = await supabaseAdmin
          .from("employee_payouts")
          .update({
            status: 'paid',
            stripe_payment_intent_id: paymentIntent.id,
            paid_at: new Date().toISOString()
          })
          .eq("id", payout_id)
          .select()
          .single();

        if (updateError) {
          throw new Error(`Failed to update payout status: ${updateError.message}`);
        }

        // Create transaction record
        await supabaseAdmin
          .from("employee_transactions")
          .insert({
            employee_id: payout.employee_id,
            transaction_type: payout.payout_type,
            amount: payout.amount,
            description: payout.description,
            reference_number: paymentIntent.id,
            created_by: user.id
          });

        logStep("Payout processed successfully", { payoutId: payout_id, stripeId: paymentIntent.id });

        return new Response(JSON.stringify({
          success: true,
          payout: updatedPayout,
          stripe_payment_intent_id: paymentIntent.id,
          message: `Payout processed successfully for ${payout.employees.full_name}`
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      } catch (stripeError: any) {
        logStep("Stripe error", { error: stripeError.message });
        throw new Error(`Stripe payment failed: ${stripeError.message}`);
      }

    } else {
      throw new Error("Invalid action. Use 'create', 'approve', 'reject', or 'process'");
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});