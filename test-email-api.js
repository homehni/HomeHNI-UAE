// Test your email service API directly using these examples

// Test 1: Password Reset Email
console.log('Testing Password Reset Email...');

fetch('https://email-system-hni.vercel.app/send-password-reset-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'MyNew$uper$ecretKey2025'
  },
  body: JSON.stringify({
    to: 'your-test-email@gmail.com', // Replace with your test email
    userName: 'Test User',
    resetUrl: 'https://homehni.in/auth?mode=reset-password&token=test123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Password Reset Result:', data);
})
.catch(error => {
  console.error('Password Reset Error:', error);
});

// Test 2: Email Verification
console.log('Testing Email Verification...');

fetch('https://email-system-hni.vercel.app/send-verification-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'MyNew$uper$ecretKey2025'
  },
  body: JSON.stringify({
    to: 'your-test-email@gmail.com', // Replace with your test email
    userName: 'Test User',
    verificationUrl: 'https://homehni.in/auth?mode=verify&token=test123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Email Verification Result:', data);
})
.catch(error => {
  console.error('Email Verification Error:', error);
});