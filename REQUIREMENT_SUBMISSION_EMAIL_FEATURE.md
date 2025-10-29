# Requirement Submission Email Feature

## Overview
This feature implements a simple email notification system for the PostService page. When a user submits a requirement through the form, it **only sends emails** - no data is stored in the database. The form is completely independent and designed for user-to-admin communication. Two emails are sent:
1. **User Confirmation Email**: Sent to the user confirming their requirement submission
2. **Admin Notification Email**: Sent to the admin with the user's requirement details

## Implementation Details

### Files Modified

#### 1. `src/services/emailService.ts`
Added two new email functions:

**`sendRequirementSubmissionAdminAlert`** (Line 639-672)
- Sends notification email to admin when a user posts a requirement
- Includes all requirement details: user info, intent, property type/service category, budget, notes, and reference ID
- Format budget amounts for better readability (e.g., ₹ 1.2 Cr)

**`sendRequirementSubmissionConfirmation`** (Line 674-702)
- Sends confirmation email to user after successful submission
- Includes requirement summary with reference ID
- Provides support contact information

**Helper Function** (Line 625-637)
- `formatBudgetAmount()`: Formats budget amounts in a human-readable format
  - 1 Cr+ formats as "₹ X.X Cr"
  - 1 L+ formats as "₹ X.X L"
  - 1K+ formats as "₹ XK"
  - Otherwise formats as regular number with currency symbol

#### 2. `src/pages/PostService.tsx`
Modified to integrate email functionality:

**Imports** (Line 4, 21-24)
- Added `useSettings` context to access admin email
- Imported email service functions

**Settings Context** (Line 45)
- Added `const { settings } = useSettings()` to get admin email configuration

**Email Integration in handleSubmit** (Line 207-279)
- Generates reference ID for tracking
- **No database insertion** - this is a pure email notification form
- Process flow:
  1. Validates form data
  2. Sends user confirmation email with requirement details
  3. Sends admin notification email with full requirement information
  4. Shows success message to user

## Data Flow

```
User Submits Form
    ↓
Validate Form Data
    ↓
Generate Reference ID (REQXXXXXX)
    ↓
Send Emails:
    ├─→ Send User Confirmation Email
    └─→ Send Admin Notification Email
    ↓
Show Success Message to User

Note: No data is stored in the database
```

## Email Payload Structure

### User Confirmation Email Payload
```typescript
{
  to: "user@example.com",
  userName: "John Doe",
  intent: "Buy/Sell/Lease/Service",
  propertyType: "Apartment/Flat" (optional),
  serviceCategory: "Property Management" (optional),
  budgetMin: 500000,
  budgetMax: 5000000,
  budgetMinFormatted: "₹ 5.0 L",
  budgetMaxFormatted: "₹ 50.0 L",
  currency: "INR",
  referenceId: "REQ123456",
  supportUrl: "https://homehni.com/contact"
}
```

### Admin Notification Email Payload
```typescript
{
  adminEmail: "homehni8@gmail.com",
  userName: "John Doe",
  userEmail: "john@example.com",
  userPhone: "+1234567890",
  intent: "Buy",
  propertyType: "Apartment/Flat",
  serviceCategory: "",
  budgetMin: 500000,
  budgetMax: 5000000,
  budgetMinFormatted: "₹ 5.0 L",
  budgetMaxFormatted: "₹ 50.0 L",
  currency: "INR",
  notes: "Near metro station",
  referenceId: "REQ123456"
}
```

## Configuration

### Admin Email
- Default: `homehni8@gmail.com`
- Can be configured in Admin Settings panel
- Retrieved from `SettingsContext` or falls back to default

### Email Service Endpoint
- Base URL: `https://email-system-hni.vercel.app`
- Endpoints to be implemented:
  - `/send-requirement-submission-admin-alert`
  - `/send-requirement-submission-confirmation`

## Backend Requirements

The email service backend needs to implement two endpoints:

### 1. Admin Alert Endpoint
**POST** `/send-requirement-submission-admin-alert`

**Request Body:**
```json
{
  "adminEmail": "homehni8@gmail.com",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userPhone": "+1234567890",
  "intent": "Buy",
  "propertyType": "Apartment/Flat",
  "serviceCategory": "",
  "budgetMin": 500000,
  "budgetMax": 5000000,
  "budgetMinFormatted": "₹ 5.0 L",
  "budgetMaxFormatted": "₹ 50.0 L",
  "currency": "INR",
  "notes": "Near metro station",
  "referenceId": "REQ123456"
}
```

### 2. User Confirmation Endpoint
**POST** `/send-requirement-submission-confirmation`

**Request Body:**
```json
{
  "to": "user@example.com",
  "userName": "John Doe",
  "intent": "Buy",
  "propertyType": "Apartment/Flat",
  "serviceCategory": "",
  "budgetMin": 500000,
  "budgetMax": 5000000,
  "budgetMinFormatted": "₹ 5.0 L",
  "budgetMaxFormatted": "₹ 50.0 L",
  "currency": "INR",
  "referenceId": "REQ123456",
  "supportUrl": "https://homehni.com/contact"
}
```

## Testing

### Test Case 1: Valid Submission with Buy Intent
1. Fill out form with Buy intent
2. Select property type
3. Set budget range
4. Submit
5. Verify user receives confirmation email
6. Verify admin receives notification email
7. Check reference ID is shown to user

### Test Case 2: Valid Submission with Service Intent
1. Fill out form with Service intent
2. Select service category
3. Set budget range
4. Submit
5. Verify both emails are sent

### Test Case 3: Email Failure Handling
1. Test with email service down
2. Verify submission still succeeds
3. Check error logs for email failures
4. Verify user still sees success message

## Error Handling

- Email sending is the primary purpose - no database operations
- Uses `await` to send emails sequentially for better error tracking
- Falls back to default admin email if settings not configured
- Includes reference ID in both emails for tracking
- If emails fail, user still sees success (emails are best-effort notifications)

## Key Design Decision

**No Database Storage**: The PostService component is intentionally designed as a simple email notification form. It does NOT store data in `property_submissions` table or any other database. This keeps the component lightweight and focused on user-to-admin communication. The admin receives all requirement details via email and can handle the inquiry accordingly.

## Future Enhancements

1. **Email Templates**: Create professional HTML email templates for both emails
2. **SMS Notifications**: Add SMS notifications for critical updates
3. **Optional Database Storage**: Consider adding optional database storage if tracking is needed
4. **Email Preferences**: Allow users to manage their email notification preferences
5. **Multi-language Support**: Send emails in user's preferred language
6. **Direct Admin Contact**: Add live chat or immediate admin response integration

## Support

For issues or questions:
- Email: homehni8@gmail.com
- Reference ID: REQXXXXXX (shown in both emails)

