# HomeHNI Email Verification & Password Reset Setup Guide

This guide will help you set up and deploy the complete email verification and password reset system for HomeHNI.

## 🎯 What's Included

✅ **Supabase Edge Functions** for reliable email delivery  
✅ **Professional HTML Email Templates** with HomeHNI branding  
✅ **Multiple Email Providers** (Resend integration)  
✅ **Fallback Systems** for maximum reliability  
✅ **Mobile-Responsive Design** for all devices  
✅ **Security Best Practices** with expiration notices  
✅ **Comprehensive Testing** tools and scripts  

## 📋 Prerequisites

1. **Supabase CLI** installed globally
   ```bash
   npm install -g supabase
   ```

2. **Resend Account** with API key
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from the dashboard

3. **Node.js** (v16 or higher)

## 🚀 Quick Setup

### Step 1: Deploy Edge Functions

```bash
# Make the deployment script executable
chmod +x deploy-email-functions.sh

# Deploy all email functions
./deploy-email-functions.sh
```

### Step 2: Set Environment Variables

In your Supabase project dashboard, go to **Settings > Edge Functions** and add:

```bash
RESEND_API_KEY=re_your_resend_api_key_here
SITE_URL=https://homehni.in
```

### Step 3: Test the Functions

```bash
# Update the test email in the script
nano test-email-functions.js

# Run the test
node test-email-functions.js
```

## 📧 Email Functions Overview

### 1. Email Verification (`send-verification-email`)
- **Purpose**: Sent when users sign up
- **Features**: Welcome message, verification button, security notices
- **Template**: Professional branding with HomeHNI colors

### 2. Password Reset (`send-password-reset-email`)
- **Purpose**: Sent when users request password reset
- **Features**: Clear instructions, security warnings, help section
- **Template**: Professional styling with security focus

### 3. Auth Verification (`send-auth-verification-email`)
- **Purpose**: Direct Supabase Auth integration
- **Features**: Uses Supabase's built-in system with custom branding
- **Template**: Consistent with other templates

### 4. Auth Password Reset (`send-auth-password-reset-email`)
- **Purpose**: Direct Supabase Auth integration for password reset
- **Features**: Reliable delivery through Supabase infrastructure
- **Template**: Professional styling with security focus

## 🔧 Configuration Details

### Supabase Config (`supabase/config.toml`)
```toml
[functions.send-verification-email]
verify_jwt = false

[functions.send-password-reset-email]
verify_jwt = false

[functions.send-auth-verification-email]
verify_jwt = false

[functions.send-auth-password-reset-email]
verify_jwt = false
```

### Email Service Integration
The system automatically uses Supabase edge functions instead of external APIs:

```typescript
// Updated email service uses Supabase functions
import { sendEmailVerificationEmail, sendPasswordResetEmail } from '@/services/emailService';

// Send verification email
await sendEmailVerificationEmail(email, name, verificationUrl);

// Send password reset email
await sendPasswordResetEmail(email, name, resetUrl);
```

## 🧪 Testing

### Manual Testing
1. **Sign up** with a test email address
2. **Check inbox** for verification email
3. **Click verification link** to confirm it works
4. **Request password reset** from login page
5. **Check inbox** for reset email
6. **Click reset link** to confirm it works

### Automated Testing
```bash
# Run comprehensive test suite
node test-email-functions.js
```

### Test Results Interpretation
- ✅ **PASS**: Function deployed and working
- ❌ **FAIL**: Check logs and configuration
- ⚠️ **WARNING**: Partial functionality

## 🐛 Troubleshooting

### Common Issues

#### 1. Functions Not Deploying
```bash
# Check Supabase CLI version
supabase --version

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref geenmplkdgmlovvgwzai
```

#### 2. Emails Not Sending
- ✅ Check `RESEND_API_KEY` is set correctly
- ✅ Verify Resend account is active
- ✅ Check Supabase function logs
- ✅ Test with different email addresses

#### 3. Links Not Working
- ✅ Verify `SITE_URL` environment variable
- ✅ Check URL encoding in templates
- ✅ Test links in different browsers

#### 4. Styling Issues
- ✅ Test in different email clients
- ✅ Check CSS compatibility
- ✅ Verify responsive design

### Debug Commands
```bash
# Check function logs
supabase functions logs send-verification-email

# Test function locally
supabase functions serve

# Check environment variables
supabase secrets list
```

## 📱 Email Client Compatibility

Tested and optimized for:
- ✅ **Gmail** (Web, Mobile, Desktop)
- ✅ **Outlook** (Web, Mobile, Desktop)
- ✅ **Apple Mail** (iOS, macOS)
- ✅ **Yahoo Mail** (Web, Mobile)
- ✅ **Thunderbird** (Desktop)

## 🔒 Security Features

### Built-in Security
- **Link Expiration**: Verification links expire in 24 hours
- **Password Reset Expiration**: Reset links expire in 1 hour
- **Rate Limiting**: Prevents spam and abuse
- **Secure Headers**: CORS and security headers included
- **Input Validation**: All inputs are validated and sanitized

### Best Practices
- Never log sensitive information
- Use HTTPS for all links
- Implement proper error handling
- Monitor for suspicious activity
- Regular security audits

## 📊 Monitoring

### Key Metrics to Track
- **Delivery Rate**: Percentage of emails delivered
- **Open Rate**: Percentage of emails opened
- **Click Rate**: Percentage of links clicked
- **Error Rate**: Percentage of failed sends
- **Spam Complaints**: Monitor for spam issues

### Monitoring Tools
- **Supabase Dashboard**: Function logs and metrics
- **Resend Dashboard**: Delivery statistics
- **Application Logs**: Custom tracking and analytics

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] All functions deployed successfully
- [ ] Environment variables set correctly
- [ ] Test emails sent and received
- [ ] Links tested and working
- [ ] Mobile responsiveness verified
- [ ] Security headers configured
- [ ] Monitoring set up

### Production Environment Variables
```bash
RESEND_API_KEY=re_production_key_here
SITE_URL=https://homehni.in
SUPABASE_URL=https://geenmplkdgmlovvgwzai.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Post-deployment Testing
1. **Smoke Test**: Send test emails to production
2. **User Flow Test**: Complete signup and reset flows
3. **Error Handling Test**: Test with invalid inputs
4. **Performance Test**: Send multiple emails simultaneously
5. **Security Test**: Verify all security measures work

## 📞 Support

### Getting Help
1. **Check Logs**: Supabase function logs first
2. **Review Documentation**: This guide and Supabase docs
3. **Test Functions**: Use the provided test script
4. **Contact Support**: If issues persist

### Useful Resources
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Resend Documentation](https://resend.com/docs)
- [Email Template Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)

---

## 🎉 Success!

Once everything is set up correctly, you should have:

✅ **Reliable email delivery** through Supabase + Resend  
✅ **Professional email templates** with HomeHNI branding  
✅ **Mobile-responsive design** that works everywhere  
✅ **Security best practices** built-in  
✅ **Comprehensive testing** tools  
✅ **Easy maintenance** and updates  

Your users will now receive beautiful, professional emails for:
- Email verification during signup
- Password reset requests
- Account security notifications
- Welcome messages

**Happy coding! 🚀**

---

*Last updated: January 2025*  
*Version: 1.0*
