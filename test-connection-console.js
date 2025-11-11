// Copy and paste this entire code into your browser console to test Supabase connection

// Test 1: Direct API Test
async function testSupabaseConnection() {
  const SUPABASE_URL = "https://smyojibmvrhfbwodvobw.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNteW9qaWJtdnJoZmJ3b2R2b2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTE3ODgsImV4cCI6MjA3ODE2Nzc4OH0.tbkmiJiyxBUcVabnbr-R9xC8HFOpEIBNsyhtuOBBpLs";

  console.log('🧪 Testing Supabase Connection...\n');

  // Test 1: Health Check
  try {
    const healthResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    console.log('1. Health Check:', healthResponse.ok ? '✅ Connected' : '❌ Failed');
  } catch (error) {
    console.log('1. Health Check: ❌ Error -', error.message);
  }

  // Test 2: Auth Session Check
  try {
    const sessionResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_session`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('2. Auth API:', sessionResponse.ok ? '✅ Accessible' : '⚠️  May need auth');
  } catch (error) {
    console.log('2. Auth API: ❌ Error -', error.message);
  }

  // Test 3: Database Query Test
  try {
    const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/properties?select=id&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    });
    
    if (dbResponse.status === 200 || dbResponse.status === 206) {
      console.log('3. Database Query: ✅ Connected (table accessible)');
    } else if (dbResponse.status === 401) {
      console.log('3. Database Query: ⚠️  RLS may be blocking (this is normal if not authenticated)');
    } else {
      console.log('3. Database Query: ⚠️  Status', dbResponse.status);
    }
  } catch (error) {
    console.log('3. Database Query: ❌ Error -', error.message);
  }

  console.log('\n✅ Connection test complete!');
}

// Run the test
testSupabaseConnection();




