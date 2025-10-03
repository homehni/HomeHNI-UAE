# HomeHNI Custom Email Templates

This project now includes custom branded email templates for authentication flows.

## Templates Created

### 1. Password Reset Email (`send-password-reset-email`)
- **Location**: `/supabase/functions/send-password-reset-email/index.ts`
- **Purpose**: Sent when users request password reset
- **Features**:
  - Professional HomeHNI branding with gradient header
  - Secure reset button with hover effects
  - Security notice with 1-hour expiration
  - Responsive design for mobile devices
  - Alternative text link for accessibility

### 2. Email Verification Template (`send-verification-email`)
- **Location**: `/supabase/functions/send-verification-email/index.ts`
- **Purpose**: Sent when new users sign up (updated existing template)
- **Features**:
  - Welcome message with HomeHNI branding
  - Benefits list showing what users get after verification
  - Prominent verification button
  - 24-hour expiration notice
  - Professional footer with links

## Integration Details

### AuthContext Updates
- Added new `resetPassword` function to AuthContext
- Function fetches user's name from profile for personalization
- Calls Supabase's resetPasswordForEmail + sends custom branded email
- Includes audit logging for security tracking

### Component Updates
- Updated `AuthDialog.tsx` to use new resetPassword function
- Updated `Auth.tsx` to use new resetPassword function
- Both components now send branded emails instead of default Supabase emails

### Email Service Integration
- Signup process now sends both welcome email and custom verification email
- Password reset sends custom branded email with user's name
- All emails use HomeHNI branding and professional styling

## Configuration

### Email Settings
- **From**: HomeHNI <noreply@homehni.in>
- **Branding**: HomeHNI red theme (#DC2626, #B91C1C)
- **Service**: Resend API (configured in Supabase functions)

### Environment Variables Needed
Make sure these are set in your Supabase function environment:
```
RESEND_API_KEY=your_resend_api_key_here
```

## Deployment

To deploy these functions to Supabase:

```bash
# Deploy password reset function
npx supabase functions deploy send-password-reset-email

# Deploy updated verification function  
npx supabase functions deploy send-verification-email
```

## Testing

1. **Password Reset**:
   - Go to login page
   - Click "Forgot Password"
   - Enter email address
   - Check email for custom branded reset message

2. **Email Verification**:
   - Sign up with new email address
   - Check email for custom branded verification message

3. **Google OAuth**:
   - Continues to work as before
   - No custom emails needed for Google signup

## Template Features

### Design Elements
- HomeHNI logo with house emoji (🏠)
- Red gradient header (#DC2626 to #B91C1C)
- Professional typography and spacing
- Responsive design for mobile
- Security-focused messaging
- Clear call-to-action buttons

### Security Features
- Time-limited links (1 hour for reset, 24 hours for verification)
- Clear security notices
- Professional "no-reply" messaging
- Audit logging for all auth events

## File Structure
```
/supabase/functions/
  ├── send-password-reset-email/
  │   └── index.ts          # New password reset email function
  └── send-verification-email/
      └── index.ts          # Updated verification email function

/src/contexts/
  └── AuthContext.tsx       # Updated with resetPassword function

/src/components/
  └── AuthDialog.tsx        # Updated to use custom reset function

/src/pages/
  └── Auth.tsx             # Updated to use custom reset function
```

## Benefits

1. **Consistent Branding**: All emails now match HomeHNI's visual identity
2. **Professional Appearance**: High-quality HTML templates with modern design
3. **Better User Experience**: Clear messaging and prominent action buttons
4. **Security**: Proper time limits and security notices
5. **Responsive**: Works well on all devices
6. **Accessibility**: Alternative text links and good contrast ratios