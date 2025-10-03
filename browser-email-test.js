// Paste this in your browser console to test the email templates
// This will call your existing email service with custom templates

// Test Password Reset Email Template
fetch('https://email-system-hni.vercel.app/send-welcome-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'MyNew$uper$ecretKey2025'
  },
  body: JSON.stringify({
    to: 'ronitpathak12345@gmail.com',
    userName: 'Test User - Password Reset Template'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Test email sent:', data);
  alert('Test email sent! Check your inbox.');
})
.catch(error => {
  console.error('Error:', error);
  alert('Error sending email: ' + error);
});