# Requirement Submission Email Backend Implementation

Add these two endpoints to your email service backend at `https://email-system-hni.vercel.app`

## Endpoints to Add

### 0. Callback Request Admin Alert (Builder/Dealer Plans)

```javascript
// Sends an alert to the admin when a user requests a callback from Builder/Dealer plans
app.post('/send-callback-request-admin-alert', async (req, res) => {
    const { adminEmail, name, email, phone, city, userClass, source } = req.body;

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.EMAIL_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!adminEmail || !name || !email || !phone) {
        return res.status(400).json({ error: 'adminEmail, name, email, phone are required' });
    }

    const mailOptions = {
        from: '"HomeHNI" <' + process.env.EMAIL_USER + '>',
        to: adminEmail,
        subject: `Callback Request: ${name} (${userClass || 'N/A'})`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2 style="margin:0 0 8px 0;">📞 New Callback Request</h2>
          <p style="margin:0 0 12px 0; color:#666;">${source || 'Builder/Dealer Plans'}</p>
          <div style="background:#f9f9f9; border-left:4px solid #DC2626; padding:12px 16px; border-radius:4px;">
            <p style="margin:6px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin:6px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin:6px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin:6px 0;"><strong>City:</strong> ${city || ''}</p>
            <p style="margin:6px 0;"><strong>Class:</strong> ${userClass || ''}</p>
          </div>
        </div>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Callback request admin alert sent:', info.messageId);
        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Error sending callback request alert:', error);
        res.status(500).json({ success: false, error: 'Failed to send email', details: error.message });
    }
});
```

### 1. Admin Notification Endpoint

```javascript
// ================= NEW: Requirement Submission Admin Alert =================
// Sends an alert to the admin when a user submits a requirement
app.post('/send-requirement-submission-admin-alert', async (req, res) => {
    const { adminEmail, userName, userEmail, userPhone, city, intent, propertyType, serviceCategory, budgetMin, budgetMax, budgetMinFormatted, budgetMaxFormatted, currency, notes, referenceId } = req.body;

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.EMAIL_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!adminEmail || !userName || !userEmail) {
        return res.status(400).json({ error: 'adminEmail, userName, and userEmail are required' });
    }

    const mailOptions = {
        from: '"HomeHNI" <' + process.env.EMAIL_USER + '>',
        to: adminEmail,
        subject: `New Requirement Submission - ${intent} | Reference: ${referenceId}`,
        html: generateRequirementAdminAlertHTML(userName, userEmail, userPhone, city, intent, propertyType, serviceCategory, budgetMinFormatted, budgetMaxFormatted, currency, notes, referenceId)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Requirement admin alert sent:', info.messageId);
        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Error sending requirement admin alert:', error);
        res.status(500).json({ success: false, error: 'Failed to send email', details: error.message });
    }
});
```

### 2. User Confirmation Endpoint

```javascript
// ================= NEW: Requirement Submission User Confirmation =================
// Sends a confirmation email to the user after requirement submission
app.post('/send-requirement-submission-confirmation', async (req, res) => {
    const { to, userName, intent, propertyType, serviceCategory, budgetMinFormatted, budgetMaxFormatted, currency, referenceId, supportUrl, city } = req.body;

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.EMAIL_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!to || !userName) {
        return res.status(400).json({ error: 'to and userName are required' });
    }

    const mailOptions = {
        from: '"HomeHNI" <' + process.env.EMAIL_USER + '>',
        to: to,
        subject: `Requirement Submitted Successfully - ${referenceId}`,
        html: generateRequirementConfirmationHTML(userName, intent, propertyType, serviceCategory, budgetMinFormatted, budgetMaxFormatted, currency, referenceId, supportUrl, city)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Requirement confirmation sent:', info.messageId);
        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Error sending requirement confirmation:', error);
        res.status(500).json({ success: false, error: 'Failed to send email', details: error.message });
    }
});
```

## HTML Template Generator Functions

### Admin Alert HTML Generator

```javascript
function generateRequirementAdminAlertHTML(userName, userEmail, userPhone, city, intent, propertyType, serviceCategory, budgetMin, budgetMax, currency, notes, referenceId) {
    const requirementType = intent === 'Service' ? serviceCategory : propertyType || 'N/A';
    const budgetDisplay = `${budgetMin} - ${budgetMax}`;
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Requirement Submission</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .info-box { background-color: #f9f9f9; border-left: 4px solid #DC2626; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: 600; color: #666; }
            .info-value { color: #333; }
            .highlight { background-color: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📋 New Requirement Submission</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Reference ID: ${referenceId}</p>
            </div>
            
            <div class="content">
                <div class="highlight">
                    <strong>⚠️ Action Required:</strong> A new requirement has been submitted and requires your attention.
                </div>

                <div class="info-box">
                    <h2 style="margin-top: 0; color: #DC2626;">User Information</h2>
                    <div class="info-row">
                        <span class="info-label">Name:</span>
                        <span class="info-value">${userName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${userEmail}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Phone:</span>
                        <span class="info-value">${userPhone}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">City:</span>
                        <span class="info-value">${city}</span>
                    </div>
                </div>

                <div class="info-box">
                    <h2 style="margin-top: 0; color: #DC2626;">Requirement Details</h2>
                    <div class="info-row">
                        <span class="info-label">Intent:</span>
                        <span class="info-value"><strong>${intent}</strong></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${requirementType}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Budget Range:</span>
                        <span class="info-value">${budgetDisplay}</span>
                    </div>
                    ${notes ? `<div class="info-row"><span class="info-label">Notes:</span><span class="info-value">${notes}</span></div>` : ''}
                </div>

                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0;">
                    <strong>Reference ID:</strong> ${referenceId}<br>
                    <small style="color: #666;">Use this ID to track this requirement.</small>
                </div>

                <p style="margin-top: 30px; color: #666;">
                    Please review this requirement and contact the user as soon as possible to provide assistance.
                </p>
            </div>

            <div class="footer">
                <p>HomeHNI | Requirement Management System</p>
                <p><small>This is an automated notification. Please do not reply to this email.</small></p>
            </div>
        </div>
    </body>
    </html>
    `;
}
```

### User Confirmation HTML Generator

```javascript
function generateRequirementConfirmationHTML(userName, intent, propertyType, serviceCategory, budgetMin, budgetMax, currency, referenceId, supportUrl, city) {
    const requirementType = intent === 'Service' ? serviceCategory : propertyType || 'N/A';
    const budgetDisplay = `${budgetMin} - ${budgetMax}`;
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Requirement Submitted Successfully</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 10px 0; font-size: 28px; }
            .success-icon { font-size: 48px; margin-bottom: 10px; }
            .content { padding: 40px 30px; }
            .summary-box { background-color: #f9f9f9; border-left: 4px solid #28a745; padding: 25px; margin: 30px 0; border-radius: 4px; }
            .summary-item { padding: 12px 0; border-bottom: 1px solid #eee; }
            .summary-item:last-child { border-bottom: none; }
            .summary-label { font-weight: 600; color: #666; }
            .summary-value { color: #333; font-size: 16px; }
            .reference-box { background-color: #e3f2fd; padding: 20px; border-radius: 4px; margin: 30px 0; text-align: center; }
            .reference-id { font-size: 24px; font-weight: bold; color: #1976d2; margin: 10px 0; }
            .next-steps { background-color: #fff3cd; padding: 20px; border-radius: 4px; margin: 30px 0; }
            .next-steps h3 { color: #856404; margin-top: 0; }
            .next-steps ul { margin: 10px 0; padding-left: 20px; }
            .footer { background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eee; }
            .footer a { color: #DC2626; text-decoration: none; margin: 0 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="success-icon">✅</div>
                <h1>Requirement Submitted Successfully!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing HomeHNI</p>
            </div>
            
            <div class="content">
                <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
                
                <p>Your requirement has been submitted successfully. Our team will review your request and get back to you shortly.</p>

                <div class="summary-box">
                    <h3 style="margin-top: 0; color: #28a745;">📋 Submission Summary</h3>
                    <div class="summary-item">
                        <span class="summary-label">Intent:</span>
                        <span class="summary-value">${intent}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Type:</span>
                        <span class="summary-value">${requirementType}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">City:</span>
                        <span class="summary-value">${city}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Budget Range:</span>
                        <span class="summary-value">${budgetDisplay}</span>
                    </div>
                </div>

                <div class="reference-box">
                    <p style="margin: 0 0 10px 0; color: #666; font-weight: 600;">Your Reference ID</p>
                    <div class="reference-id">${referenceId}</div>
                    <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                        Keep this reference ID for tracking your requirement.
                    </p>
                </div>

                <div class="next-steps">
                    <h3>What Happens Next?</h3>
                    <ul>
                        <li>Our team will review your requirement within 24 hours</li>
                        <li>You'll receive a personalized response via email or phone</li>
                        <li>We'll match you with the best options available</li>
                    </ul>
                </div>

                <p style="margin-top: 30px; text-align: center;">
                    <strong>Need immediate assistance?</strong><br>
                    <a href="${supportUrl}">Contact our support team</a> or reply to this email.
                </p>
            </div>

            <div class="footer">
                <p><strong>HomeHNI</strong> - Your Trusted Property Partner</p>
                <p style="margin: 15px 0;">
                    <a href="https://homehni.com">Visit Website</a>
                    <a href="https://homehni.com/contact">Contact Support</a>
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                    © ${new Date().getFullYear()} HomeHNI. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}
```

## How to Add These Endpoints

1. **Copy the endpoint code** above into your main API file
2. **Copy the HTML generator functions** above into your template functions section
3. **Deploy** to Vercel
4. **Test** using the curl commands below

## Testing Commands

### Test Admin Alert Endpoint

```bash
curl -X POST https://email-system-hni.vercel.app/send-requirement-submission-admin-alert \
  -H "Content-Type: application/json" \
  -H "x-api-key: MyNew$uper$ecretKey2025" \
  -d '{
    "adminEmail": "homehni8@gmail.com",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "userPhone": "+1234567890",
    "city": "Mumbai",
    "intent": "Buy",
    "propertyType": "Apartment/Flat",
    "budgetMinFormatted": "₹ 5.0 L",
    "budgetMaxFormatted": "₹ 50.0 L",
    "currency": "INR",
    "notes": "Near metro station",
    "referenceId": "REQ123456"
  }'
```

### Test User Confirmation Endpoint

```bash
curl -X POST https://email-system-hni.vercel.app/send-requirement-submission-confirmation \
  -H "Content-Type: application/json" \
  -H "x-api-key: MyNew$uper$ecretKey2025" \
  -d '{
    "to": "john@example.com",
    "userName": "John Doe",
    "intent": "Buy",
    "city": "Mumbai",
    "propertyType": "Apartment/Flat",
    "budgetMinFormatted": "₹ 5.0 L",
    "budgetMaxFormatted": "₹ 50.0 L",
    "currency": "INR",
    "referenceId": "REQ123456",
    "supportUrl": "https://homehni.com/contact"
  }'
```

## Important Notes

- Both endpoints use the same API key authentication: `x-api-key: MyNew$uper$ecretKey2025`
- The admin alert is sent TO the admin email
- The confirmation is sent TO the user's email
- Both emails include the reference ID for tracking
- No database storage is required - this is purely email-based

## Expected Behavior

When a user submits a requirement on the PostService page:
1. User enters all requirement details
2. System generates a reference ID (e.g., REQ123456)
3. Confirmation email is sent to user with their details
4. Admin notification email is sent to admin with all user details
5. Success message is shown to user

That's it! No database operations, just pure email notifications.

