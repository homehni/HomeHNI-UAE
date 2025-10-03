# PowerShell/CMD Curl Commands to Test HomeHNI Email Templates

# Test 1: Password Reset Email
echo "Testing Password Reset Email..."
curl -X POST "https://email-system-hni.vercel.app/send-password-reset-email" `
  -H "Content-Type: application/json" `
  -H "x-api-key: MyNew`$uper`$ecretKey2025" `
  -d '{
    "to": "your-test-email@gmail.com",
    "userName": "Test User",
    "resetUrl": "https://homehni.in/auth?mode=reset-password&token=test123"
  }'

echo ""
echo "----------------------------------------"
echo ""

# Test 2: Email Verification
echo "Testing Email Verification..."
curl -X POST "https://email-system-hni.vercel.app/send-verification-email" `
  -H "Content-Type: application/json" `
  -H "x-api-key: MyNew`$uper`$ecretKey2025" `
  -d '{
    "to": "your-test-email@gmail.com",
    "userName": "Test User",
    "verificationUrl": "https://homehni.in/auth?mode=verify&token=test123"
  }'

echo ""
echo "Test completed! Check your email inbox for the HomeHNI branded emails."