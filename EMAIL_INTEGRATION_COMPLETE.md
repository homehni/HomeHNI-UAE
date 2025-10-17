# HomeHNI Email API Integration Guide

## ✅ **Integration Status: COMPLETE**

Your app is now fully integrated to use your external email API for all authentication emails. Here's what has been updated and what you need to implement.

## 🔧 **What Was Fixed**

### **1. AuthContext Updates**
- ✅ **Email Verification**: Now uses `sendEmailVerificationEmail()` from emailService.ts
- ✅ **Password Reset**: Now uses `sendPasswordResetEmail()` from emailService.ts  
- ✅ **Removed Supabase**: No more mixed email systems
- ✅ **Unified System**: All emails now go through your external API

### **2. Parameter Mapping**
Your external API endpoints should expect these exact parameters:

```javascript
// Email Verification Endpoint
POST /send-verification-email
{
  "to": "user@example.com",           // ✅ Email address
  "userName": "John Doe",             // ✅ User's name
  "verificationUrl": "https://homehni.in/auth?mode=verify&email=..."  // ✅ Verification link
}

// Password Reset Endpoint  
POST /send-password-reset-email
{
  "to": "user@example.com",           // ✅ Email address
  "userName": "John Doe",             // ✅ User's name
  "resetUrl": "https://homehni.in/auth?mode=reset-password&email=..."  // ✅ Reset link
}
```

## 📧 **Required Email API Endpoints**

### **1. Email Verification Endpoint**
```javascript
app.post("/send-verification-email", async (req, res) => {
  const { to, userName, verificationUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });
  if (!verificationUrl) return res.status(400).json({ status: "error", error: "Verification URL required" });

  const subject = "Verify Your Email – Complete Your Home HNI Registration";
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email - Home HNI</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background-color:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">
        <tr>
          <td align="center" style="background:#d32f2f;padding:20px;">
            <img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI" style="display:block;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">Verify Your Email Address</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for signing up with <strong>Home HNI</strong>! To complete your registration and start exploring India's premium real estate platform, please verify your email address.</p>
            
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #d32f2f;">
              <p style="margin:0;color:#666;font-size:14px;">
                <strong>Why verify your email?</strong><br>
                • Secure your account and protect your data<br>
                • Receive important property alerts and updates<br>
                • Access all Home HNI premium features
              </p>
            </div>
            
            <p style="text-align:center;margin:28px 0;">
              <a href="${verificationUrl}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:18px;display:inline-block;box-shadow:0 3px 8px rgba(211,47,47,0.3);">✅ Verify Now</a>
            </p>
            
            <p style="font-size:14px;color:#666;text-align:center;margin:20px 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color:#d32f2f;word-break:break-all;">${verificationUrl}</a>
            </p>
            
            <div style="background:#fff3cd;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #ffc107;">
              <p style="margin:0;color:#856404;font-size:14px;">
                <strong>⏰ This verification link expires in 24 hours.</strong><br>
                For security reasons, please verify your email as soon as possible.
              </p>
            </div>
            
            <p>If you didn't create this account, please ignore this email.</p>
            <p>Thanks & Regards,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr>
          <td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">
            <p style="margin:0;">&copy; 2025 Home HNI. All rights reserved.</p>
            <p style="margin:5px 0 0;">Visit <a href="https://homehni.com" style="color:#d32f2f;text-decoration:none;">homehni.com</a> • <a href="mailto:support@homehni.com" style="color:#d32f2f;text-decoration:none;">Contact Support</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Verify Your Email Address – Complete Your Home HNI Registration

Hi ${userName || 'there'},

Thank you for signing up with Home HNI! To complete your registration and start exploring India's premium real estate platform, please verify your email address.

Why verify your email?
• Secure your account and protect your data
• Receive important property alerts and updates
• Access all Home HNI premium features

Click here to verify: ${verificationUrl}

⏰ This verification link expires in 24 hours.
For security reasons, please verify your email as soon as possible.

If you didn't create this account, please ignore this email.

Thanks & Regards,
Team Home HNI

© 2025 Home HNI. All rights reserved.
Visit homehni.com • Contact Support`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});
```

### **2. Password Reset Endpoint**
```javascript
app.post("/send-password-reset-email", async (req, res) => {
  const { to, userName, resetUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });
  if (!resetUrl) return res.status(400).json({ status: "error", error: "Reset URL required" });

  const subject = "Reset Your Password – Home HNI Account Security";
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password - Home HNI</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background-color:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">
        <tr>
          <td align="center" style="background:#d32f2f;padding:20px;">
            <img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI" style="display:block;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">Reset Your Password</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>We received a request to reset your password for your <strong>Home HNI</strong> account. If you made this request, click the button below to set a new password.</p>
            
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #d32f2f;">
              <p style="margin:0;color:#666;font-size:14px;">
                <strong>Password Reset Instructions:</strong><br>
                • Click the "Reset Password" button below<br>
                • Create a strong, unique password<br>
                • Use at least 8 characters with numbers and symbols
              </p>
            </div>
            
            <p style="text-align:center;margin:28px 0;">
              <a href="${resetUrl}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:18px;display:inline-block;box-shadow:0 3px 8px rgba(211,47,47,0.3);">🔒 Reset Password</a>
            </p>
            
            <p style="font-size:14px;color:#666;text-align:center;margin:20px 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color:#d32f2f;word-break:break-all;">${resetUrl}</a>
            </p>
            
            <div style="background:#fff3cd;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #ffc107;">
              <p style="margin:0;color:#856404;font-size:14px;">
                <strong>⏰ This reset link expires in 1 hour.</strong><br>
                For security reasons, please reset your password as soon as possible.
              </p>
            </div>
            
            <div style="background:#f8d7da;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #dc3545;">
              <p style="margin:0;color:#721c24;font-size:14px;">
                <strong>Didn't request this?</strong><br>
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </div>
            
            <p>Need help? Contact our support team if you're having trouble accessing your account.</p>
            <p>Thanks & Regards,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr>
          <td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">
            <p style="margin:0;">&copy; 2025 Home HNI. All rights reserved.</p>
            <p style="margin:5px 0 0;">Visit <a href="https://homehni.com" style="color:#d32f2f;text-decoration:none;">homehni.com</a> • <a href="mailto:support@homehni.com" style="color:#d32f2f;text-decoration:none;">Contact Support</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Reset Your Password – Home HNI Account Security

Hi ${userName || 'there'},

We received a request to reset your password for your Home HNI account. If you made this request, click the link below to set a new password.

Password Reset Instructions:
• Click the reset link below
• Create a strong, unique password
• Use at least 8 characters with numbers and symbols

Click here to reset: ${resetUrl}

⏰ This reset link expires in 1 hour.
For security reasons, please reset your password as soon as possible.

Didn't request this?
If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Need help? Contact our support team if you're having trouble accessing your account.

Thanks & Regards,
Team Home HNI

© 2025 Home HNI. All rights reserved.
Visit homehni.com • Contact Support`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});
```

## 🧪 **Testing**

Use the provided test script to verify everything works:

```bash
node test-email-functions.js
```

## 🎯 **What Happens Now**

### **User Signup Flow:**
1. User signs up → `signUpWithPassword()` called
2. User created in Supabase → `sendWelcomeEmail()` sent
3. **NEW**: `sendEmailVerificationEmail()` called → Your external API sends verification email
4. User receives professional verification email with HomeHNI branding

### **Password Reset Flow:**
1. User requests password reset → `resetPassword()` called
2. **NEW**: `sendPasswordResetEmail()` called → Your external API sends reset email
3. User receives professional password reset email with HomeHNI branding

## ✅ **Benefits**

- ✅ **Unified System**: All emails use your external API
- ✅ **Professional Templates**: Beautiful, branded emails
- ✅ **Consistent Styling**: Matches your existing email format
- ✅ **No Supabase Dependencies**: Pure external API integration
- ✅ **Easy Maintenance**: All email logic in one place

## 🚀 **Next Steps**

1. **Deploy** the email templates to your external API
2. **Test** using `node test-email-functions.js`
3. **Verify** email delivery in your email service logs
4. **Monitor** for any issues during user signup/password reset

Your email verification and password reset system is now fully integrated and ready to go! 🎉
