// ============================================
// SUPABASE CONNECTION TEST FOR BROWSER CONSOLE
// ============================================
// Copy and paste this ENTIRE code block into your browser console
// Make sure you're on your app's page (http://localhost:8080 or your app URL)

(async function testSupabaseConnection() {
  console.log('🚀 Starting Supabase Connection Test...\n');
  
  const SUPABASE_URL = "https://smyojibmvrhfbwodvobw.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNteW9qaWJtdnJoZmJ3b2R2b2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTE3ODgsImV4cCI6MjA3ODE2Nzc4OH0.tbkmiJiyxBUcVabnbr-R9xC8HFOpEIBNsyhtuOBBpLs";

  // Test 1: Basic API Health Check
  console.log('📡 Test 1: API Health Check...');
  try {
    const healthCheck = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (healthCheck.ok) {
      console.log('   ✅ API is accessible!');
      console.log('   Status:', healthCheck.status, healthCheck.statusText);
    } else {
      console.log('   ⚠️  API responded but with status:', healthCheck.status);
    }
  } catch (error) {
    console.log('   ❌ FAILED:', error.message);
    console.log('   This usually means:');
    console.log('   - Wrong URL');
    console.log('   - Network/CORS issue');
    console.log('   - API key is invalid');
    return;
  }

  // Test 2: Auth Endpoint Check
  console.log('\n🔐 Test 2: Auth Endpoint Check...');
  try {
    const authCheck = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY
      }
    });
    
    if (authCheck.ok) {
      const data = await authCheck.json();
      console.log('   ✅ Auth service is working!');
      console.log('   Response:', data);
    } else {
      console.log('   ⚠️  Auth endpoint status:', authCheck.status);
    }
  } catch (error) {
    console.log('   ⚠️  Auth check error:', error.message);
  }

  // Test 3: Database Query Test (with RLS handling)
  console.log('\n💾 Test 3: Database Query Test...');
  try {
    const dbCheck = await fetch(`${SUPABASE_URL}/rest/v1/properties?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    });
    
    if (dbCheck.status === 200 || dbCheck.status === 206) {
      console.log('   ✅ Database is accessible!');
      console.log('   Status:', dbCheck.status);
      const data = await dbCheck.json();
      console.log('   Sample data:', data);
    } else if (dbCheck.status === 401) {
      console.log('   ⚠️  RLS (Row Level Security) is blocking access');
      console.log('   This is NORMAL if you\'re not authenticated');
      console.log('   Your connection is working, but you need to be logged in to query data');
    } else if (dbCheck.status === 404) {
      console.log('   ⚠️  Table might not exist yet');
      console.log('   You may need to run database migrations');
    } else {
      console.log('   ⚠️  Unexpected status:', dbCheck.status);
      const errorText = await dbCheck.text();
      console.log('   Response:', errorText);
    }
  } catch (error) {
    console.log('   ❌ Database query failed:', error.message);
  }

  // Test 4: Storage Check
  console.log('\n📦 Test 4: Storage Service Check...');
  try {
    const storageCheck = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (storageCheck.ok) {
      console.log('   ✅ Storage service is accessible!');
      const buckets = await storageCheck.json();
      console.log('   Available buckets:', buckets.length);
    } else {
      console.log('   ⚠️  Storage status:', storageCheck.status);
    }
  } catch (error) {
    console.log('   ⚠️  Storage check error:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log('✅ If you see "API is accessible" - Your connection is WORKING!');
  console.log('✅ If you see RLS blocking - This is NORMAL, connection is fine');
  console.log('❌ If you see errors - Check your URL and API key');
  console.log('\n💡 Next Steps:');
  console.log('   1. Try signing up/logging in to test authentication');
  console.log('   2. Check Supabase Dashboard → Settings → API to verify keys match');
  console.log('   3. Run database migrations if tables don\'t exist');
  console.log('='.repeat(50));
})();




