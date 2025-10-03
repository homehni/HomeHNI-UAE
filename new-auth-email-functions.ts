// Add these two new functions to your existing emailService.ts file in the src/services/ directory

// Authentication: Password Reset Email - Send when user requests password reset
export async function sendPasswordResetEmail(
  userEmail: string, 
  userName: string,
  resetUrl: string
) {
  return sendEmail('/send-password-reset-email', {
    to: userEmail,
    userName: userName || 'there',
    resetUrl: resetUrl
  });
}

// Authentication: Email Verification - Send when user signs up
export async function sendEmailVerificationEmail(
  userEmail: string, 
  userName: string,
  verificationUrl: string
) {
  return sendEmail('/send-verification-email', {
    to: userEmail,
    userName: userName || 'there',
    verificationUrl: verificationUrl
  });
}