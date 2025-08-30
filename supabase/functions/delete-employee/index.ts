import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { employeeId, email } = await req.json()
    
    console.log('Delete employee request:', { employeeId, email })

    if (!employeeId || !email) {
      return new Response(
        JSON.stringify({ error: 'Employee ID and email are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Start transaction-like operations
    console.log('Starting employee deletion process...')

    // 1. Delete employee transactions first (foreign key dependency)
    console.log('Deleting employee transactions...')
    const { error: transactionError } = await supabase
      .from('employee_transactions')
      .delete()
      .eq('employee_id', employeeId)

    if (transactionError) {
      console.error('Error deleting transactions:', transactionError)
      // Don't fail the whole operation for this
    }

    // 2. Delete employee payouts
    console.log('Deleting employee payouts...')
    const { error: payoutError } = await supabase
      .from('employee_payouts')
      .delete()
      .eq('employee_id', employeeId)

    if (payoutError) {
      console.error('Error deleting payouts:', payoutError)
      // Don't fail the whole operation for this
    }

    // 3. Get the user ID from auth.users before deleting employee record
    console.log('Getting user ID from auth.users...')
    const { data: authUsers, error: authListError } = await supabase.auth.admin.listUsers()
    
    if (authListError) {
      console.error('Error listing auth users:', authListError)
    }

    const authUser = authUsers?.users?.find(user => user.email === email)
    console.log('Found auth user:', authUser?.id)

    // 4. Delete from employees table
    console.log('Deleting employee record...')
    const { error: employeeError } = await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId)

    if (employeeError) {
      console.error('Error deleting employee:', employeeError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete employee record' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 5. Delete user roles if auth user exists
    if (authUser?.id) {
      console.log('Deleting user roles...')
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', authUser.id)

      if (rolesError) {
        console.error('Error deleting user roles:', rolesError)
        // Don't fail for this
      }

      // 6. Delete user profile
      console.log('Deleting user profile...')
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', authUser.id)

      if (profileError) {
        console.error('Error deleting profile:', profileError)
        // Don't fail for this
      }

      // 7. Delete the user from auth (this will cascade delete related auth data)
      console.log('Deleting user from auth...')
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(authUser.id)

      if (authDeleteError) {
        console.error('Error deleting auth user:', authDeleteError)
        // Log but don't fail - employee record is already deleted
      }
    }

    console.log('Employee deletion completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Employee deleted successfully',
        deletedEmployeeId: employeeId,
        deletedAuthUserId: authUser?.id || null
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error in delete-employee function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})