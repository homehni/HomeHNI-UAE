import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteEmployeeRequest {
  email: string;
  full_name: string;
  phone?: string;
  department: string;
  designation: string;
  role: 'hr_admin' | 'finance_admin' | 'content_manager' | 'blog_manager' | 'employee_manager' | 'employee';
  salary?: number;
  join_date: string;
  manager_id?: string;
}

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [EMPLOYEE-INVITE] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

// Generate a secure temporary password
const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create regular client for auth validation
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

    // Check if user has HR admin permissions
    const { data: currentEmployee } = await supabaseAdmin
      .from("employees")
      .select("role")
      .eq("email", user.email)
      .single();

    const { data: userRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const isAuthorized = currentEmployee?.role === 'hr_admin' || currentEmployee?.role === 'finance_admin' || userRole?.role === 'admin';
    
    if (!isAuthorized) {
      throw new Error("Only HR admins can invite employees");
    }

    logStep("Authorization verified", { hasHRAccess: isAuthorized });

    const requestData: InviteEmployeeRequest = await req.json();
    logStep("Request data received", requestData);

    // Validate minimal required fields and set defaults for optional ones
    if (!requestData.email || !requestData.full_name) {
      throw new Error("Missing required fields: email and full_name are required");
    }

    // Apply safe defaults to avoid failures during quick entry
    requestData.department = requestData.department && requestData.department.trim() !== '' ? requestData.department : 'General';
    requestData.designation = requestData.designation && requestData.designation.trim() !== '' ? requestData.designation : 'Employee';
    requestData.role = requestData.role || 'employee';
    requestData.join_date = requestData.join_date || new Date().toISOString().slice(0, 10);

    // Check if employee already exists
    const { data: existingEmployee } = await supabaseAdmin
      .from("employees")
      .select("*")
      .eq("email", requestData.email)
      .maybeSingle();

    if (existingEmployee) {
      logStep("Employee already exists, returning warning", { employeeId: existingEmployee.id, employeeIdNumber: existingEmployee.employee_id });
      return new Response(JSON.stringify({
        success: false,
        error: "USE NEW email credentials to add new employee details"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create the employee record
    const employeeData = {
      full_name: requestData.full_name,
      email: requestData.email,
      phone: requestData.phone,
      department: requestData.department,
      designation: requestData.designation,
      role: requestData.role,
      join_date: requestData.join_date,
      salary: requestData.salary,
      manager_id: requestData.manager_id,
      status: 'pending_approval',
      created_by: user.id
    };

    const { data: newEmployee, error: insertError } = await supabaseAdmin
      .from("employees")
      .insert(employeeData)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create employee: ${insertError.message}`);
    }

    logStep("Employee created successfully", { employeeId: newEmployee.id, employeeIdNumber: newEmployee.employee_id });

    // Generate temporary password for the new user
    const tempPassword = generateTempPassword();
    logStep("Generated temporary password");

    // Create Supabase auth user account
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: requestData.email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: requestData.full_name,
        employee_id: newEmployee.employee_id,
        department: requestData.department,
        role: requestData.role
      }
    });

    if (authError) {
      // If user creation fails, clean up the employee record
      await supabaseAdmin
        .from("employees")
        .delete()
        .eq("id", newEmployee.id);
      
      throw new Error(`Failed to create user account: ${authError.message}`);
    }

    logStep("Auth user created successfully", { authUserId: authUser.user?.id });

    // Update employee record with the auth user ID
    const { error: updateError } = await supabaseAdmin
      .from("employees")
      .update({ user_id: authUser.user?.id })
      .eq("id", newEmployee.id);

    if (updateError) {
      logStep("Warning: Failed to link employee to auth user", { error: updateError.message });
    }

    // Create a log entry for the transaction
    await supabaseAdmin
      .from("employee_transactions")
      .insert({
        employee_id: newEmployee.id,
        transaction_type: 'salary',
        amount: requestData.salary || 0,
        description: `Initial salary setup for ${requestData.full_name}`,
        reference_number: `SETUP-${newEmployee.employee_id}`,
        created_by: user.id,
        transaction_date: requestData.join_date
      });

    logStep("Initial transaction record created");

    return new Response(JSON.stringify({
      success: true,
      employee: newEmployee,
      authUser: {
        id: authUser.user?.id,
        email: authUser.user?.email
      },
      loginCredentials: {
        email: requestData.email,
        temporaryPassword: tempPassword
      },
      message: `Employee ${requestData.full_name} invited successfully with ID: ${newEmployee.employee_id}. Login credentials generated.`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

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