# Email Templates for HomeHNI Authentication

This document contains comprehensive email templates for all authentication flows in the HomeHNI application.

## Overview

The email system uses Supabase Edge Functions with Resend for reliable email delivery. All templates are designed with:
- Professional branding consistent with HomeHNI
- Mobile-responsive design
- Security best practices
- Clear call-to-action buttons
- Fallback text links

## Templates Included

### 1. Email Verification Template
**Function**: `send-verification-email`
**Purpose**: Sent when users sign up to verify their email address
**Features**:
- Welcome message with benefits
- Prominent verification button
- Security notice about link expiration
- Fallback text link

### 2. Password Reset Template
**Function**: `send-password-reset-email`
**Purpose**: Sent when users request password reset
**Features**:
- Clear password reset instructions
- Security warnings about link expiration
- Help section for users who didn't request reset
- Professional styling

### 3. Supabase Auth Integration Templates
**Functions**: `send-auth-verification-email`, `send-auth-password-reset-email`
**Purpose**: Direct integration with Supabase Auth system
**Features**:
- Uses Supabase's built-in email system
- Custom branding and styling
- Reliable delivery through Supabase infrastructure

## Template Structure

All templates follow this structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta tags and responsive viewport -->
  <!-- Inline CSS for maximum compatibility -->
</head>
<body>
  <div class="email-container">
    <!-- Header with logo and branding -->
    <!-- Main content area -->
    <!-- Call-to-action button -->
    <!-- Fallback text link -->
    <!-- Security notices -->
    <!-- Footer with links -->
  </div>
</body>
</html>
```

## Key Features

### Responsive Design
- Mobile-first approach
- Flexible layouts that work on all devices
- Optimized typography and spacing

### Branding
- Consistent HomeHNI color scheme (#DC2626)
- Professional logo treatment
- Branded footer with links

### Security
- Clear expiration notices
- Security warnings for suspicious activity
- Professional tone to build trust

### Accessibility
- High contrast colors
- Clear typography
- Semantic HTML structure
- Alt text for images

## Usage

### In Edge Functions
```typescript
const emailResponse = await resend.emails.send({
  from: "HomeHNI <noreply@homehni.in>",
  to: [email],
  subject: "Your Subject Here",
  html: templateHtml
});
```

### In Frontend
```typescript
import { sendEmailVerificationEmail, sendPasswordResetEmail } from '@/services/emailService';

// Send verification email
await sendEmailVerificationEmail(email, name, verificationUrl);

// Send password reset email
await sendPasswordResetEmail(email, name, resetUrl);
```

## Environment Variables Required

Make sure these environment variables are set in your Supabase project:

```bash
RESEND_API_KEY=your_resend_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SITE_URL=https://homehni.in
```

## Testing

### Local Testing
1. Deploy edge functions: `supabase functions deploy`
2. Test with curl or Postman
3. Check Resend dashboard for delivery status

### Production Testing
1. Test with real email addresses
2. Verify links work correctly
3. Check spam folder delivery
4. Test on different email clients

## Troubleshooting

### Common Issues
1. **Emails not sending**: Check RESEND_API_KEY
2. **Links not working**: Verify SITE_URL environment variable
3. **Styling issues**: Test in different email clients
4. **Spam issues**: Check Resend reputation and authentication

### Debug Steps
1. Check Supabase function logs
2. Verify environment variables
3. Test with different email providers
4. Check Resend delivery logs

## Customization

### Colors
Update the CSS variables in each template:
```css
:root {
  --primary-color: #DC2626;
  --primary-dark: #B91C1C;
  --text-color: #333333;
  --background-color: #f5f5f5;
}
```

### Content
- Update welcome messages
- Modify benefit lists
- Change footer links
- Adjust security notices

### Styling
- Modify button styles
- Update typography
- Change layout spacing
- Adjust mobile breakpoints

## Best Practices

1. **Always test** emails in multiple clients
2. **Keep templates simple** for maximum compatibility
3. **Use inline CSS** for reliable rendering
4. **Include fallback text** for all links
5. **Test mobile responsiveness** thoroughly
6. **Monitor delivery rates** and spam complaints
7. **Keep content concise** and actionable
8. **Use professional language** throughout

## Support

For issues with email templates or delivery:
1. Check Supabase function logs
2. Review Resend dashboard
3. Test with different email addresses
4. Verify environment configuration
5. Contact support if needed

---

*Last updated: January 2025*
*Version: 1.0*