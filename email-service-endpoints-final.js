/*
Add these two new endpoints to your existing email service at https://email-system-hni.vercel.app

INSTRUCTIONS:
1. Copy these endpoint functions into your main API file
2. Deploy to Vercel 
3. Test using the PowerShell commands at the bottom

These endpoints follow your existing pattern and use your Gmail/Nodemailer setup.
*/

// ================= NEW: User Registration Admin Alert =================
// Sends an alert to the admin when a new user registers
app.post('/api/send-user-registration-alert', async (req, res) => {
    const { adminEmail, userEmail, userName } = req.body;

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.EMAIL_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!adminEmail || !userEmail) {
        return res.status(400).json({ error: 'adminEmail and userEmail are required' });
    }

    const mailOptions = {
        from: '"HomeHNI" <' + process.env.EMAIL_USER + '>',
        to: adminEmail,
        subject: 'New User Registered on HomeHNI',
        html: generateUserRegistrationAdminAlertHTML(userName || 'New User', userEmail)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('User registration admin alert sent:', info.messageId);
        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Error sending user registration alert:', error);
        res.status(500).json({ success: false, error: 'Failed to send email', details: error.message });
    }
});

function generateUserRegistrationAdminAlertHTML(userName, userEmail) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New User Registered</title>
    <style>
        body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background:#f6f7fb; color:#222; margin:0; }
        .container { max-width:680px; margin:24px auto; background:#fff; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.06); overflow:hidden; }
        .header { background:linear-gradient(135deg,#e53935,#e35d5b); color:#fff; padding:24px; }
        .header h1 { margin:0; font-size:22px; font-weight:700; }
        .content { padding:24px; }
        .row { margin-bottom:16px; }
        .label { color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:.06em; }
        .value { font-size:16px; font-weight:600; margin-top:4px; }
        .cta { margin-top:24px; }
        .button { display:inline-block; padding:10px 16px; background:#111827; color:#fff !important; text-decoration:none; border-radius:8px; font-weight:600; }
        .footer { padding:18px 24px; color:#6b7280; font-size:12px; border-top:1px solid #f1f5f9; }
    </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New user just registered</h1>
            </div>
            <div class="content">
                <div class="row">
                    <div class="label">Name</div>
                    <div class="value">${userName}</div>
                </div>
                <div class="row">
                    <div class="label">Email</div>
                    <div class="value">${userEmail}</div>
                </div>
                <div class="cta">
                    <a class="button" href="mailto:${userEmail}">Contact User</a>
                </div>
            </div>
            <div class="footer">HomeHNI • Admin Alert</div>
        </div>
    </body>
    </html>`;
}

// Password Reset Email Endpoint
app.post('/api/send-password-reset-email', async (req, res) => {
  const { email, name, resetUrl } = req.body;

  const apiKey = req.headers['x-api-key'];
  
  if (apiKey !== process.env.EMAIL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!email || !name || !resetUrl) {
    return res.status(400).json({ error: 'Email, name, and resetUrl are required' });
  }

  const mailOptions = {
    from: '"HomeHNI" <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: 'Reset Your HomeHNI Password',
    html: generatePasswordResetHTML(name, resetUrl, email)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    res.json({ 
      success: true, 
      message: 'Password reset email sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// Email Verification Email Endpoint
app.post('/api/send-email-verification', async (req, res) => {
  const { email, name, verificationUrl } = req.body;

  const apiKey = req.headers['x-api-key'];
  
  if (apiKey !== process.env.EMAIL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!email || !name || !verificationUrl) {
    return res.status(400).json({ error: 'Email, name, and verificationUrl are required' });
  }

  const mailOptions = {
    from: '"HomeHNI" <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: 'Welcome to HomeHNI! Please Verify Your Email',
    html: generateEmailVerificationHTML(name, verificationUrl, email)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email verification sent:', info.messageId);
    res.json({ 
      success: true, 
      message: 'Email verification sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// HTML Template Generator Functions
function generatePasswordResetHTML(name, resetUrl, email) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your HomeHNI Password</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .logo {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 24px;
        }
        .content p {
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.8;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 15px 35px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: transform 0.2s ease;
        }
        .security-note {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .security-note h3 {
            color: #667eea;
            margin-top: 0;
            font-size: 18px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 5px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .header, .content, .footer {
                padding: 20px !important;
            }
            .reset-button {
                display: block;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏠 HomeHNI</div>
            <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
            <h2>Hello ${name}!</h2>
            
            <p>We received a request to reset your password for your HomeHNI account. If you made this request, click the button below to set a new password:</p>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset My Password</a>
            </div>
            
            <p>This link will expire in 24 hours for security reasons.</p>
            
            <div class="security-note">
                <h3>🔒 Security Notice</h3>
                <p style="margin: 0;">If you didn't request this password reset, please ignore this email. Your account remains secure and no changes have been made.</p>
            </div>
            
            <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea; font-size: 14px;">${resetUrl}</p>
            
            <p>Need help? Contact our support team and we'll be happy to assist you.</p>
        </div>
        
        <div class="footer">
            <p><strong>HomeHNI</strong> - Premium Home Interiors</p>
            <p>Making your dream home a reality</p>
            
            <div class="social-links">
                <a href="#">Privacy Policy</a> | 
                <a href="#">Terms of Service</a> | 
                <a href="#">Contact Support</a>
            </div>
            
            <p>© 2024 HomeHNI. All rights reserved.</p>
            <p style="font-size: 12px; color: #999;">
                This email was sent to ${email}. If you no longer wish to receive these emails, 
                you can update your preferences in your account settings.
            </p>
        </div>
    </div>
</body>
</html>`;
}

function generateEmailVerificationHTML(name, verificationUrl, email) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to HomeHNI - Verify Your Email</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .logo {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .welcome-badge {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 8px 20px;
            display: inline-block;
            margin-top: 10px;
            font-size: 14px;
            font-weight: 500;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 24px;
        }
        .content p {
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.8;
        }
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            text-decoration: none;
            padding: 15px 35px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
        }
        .features {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }
        .features h3 {
            color: #667eea;
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 20px;
            text-align: center;
        }
        .feature-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .feature-list li {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #555;
        }
        .feature-list li:before {
            content: "✨";
            margin-right: 8px;
            font-size: 16px;
        }
        .next-steps {
            background-color: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .next-steps h3 {
            color: #1976d2;
            margin-top: 0;
            font-size: 18px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 5px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .header, .content, .footer {
                padding: 20px !important;
            }
            .verify-button {
                display: block;
                text-align: center;
            }
            .feature-list {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏠 HomeHNI</div>
            <h1>Welcome to HomeHNI!</h1>
            <div class="welcome-badge">Account Verification Required</div>
        </div>
        
        <div class="content">
            <h2>Hello ${name}!</h2>
            
            <p>Welcome to <strong>HomeHNI</strong> - your gateway to premium home interiors! We're excited to have you join our community of homeowners creating beautiful, functional spaces.</p>
            
            <p>To get started and ensure the security of your account, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="${verificationUrl}" class="verify-button">Verify My Email Address</a>
            </div>
            
            <div class="features">
                <h3>🎉 What's Waiting for You</h3>
                <ul class="feature-list">
                    <li>Premium interior designs</li>
                    <li>Expert design consultations</li>
                    <li>Custom furniture solutions</li>
                    <li>3D visualization tools</li>
                    <li>Quality material sourcing</li>
                    <li>Project management support</li>
                    <li>Exclusive member discounts</li>
                    <li>Design inspiration gallery</li>
                </ul>
            </div>
            
            <div class="next-steps">
                <h3>🚀 Next Steps</h3>
                <p style="margin: 0;">Once your email is verified, you'll be able to:</p>
                <ul style="margin: 10px 0 0 20px; padding: 0;">
                    <li>Browse our extensive design portfolio</li>
                    <li>Schedule your free design consultation</li>
                    <li>Access exclusive member content</li>
                    <li>Start planning your dream interior</li>
                </ul>
            </div>
            
            <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea; font-size: 14px;">${verificationUrl}</p>
            
            <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
            
            <p>Questions? Our support team is here to help you get started on your interior design journey!</p>
        </div>
        
        <div class="footer">
            <p><strong>HomeHNI</strong> - Premium Home Interiors</p>
            <p>Making your dream home a reality</p>
            
            <div class="social-links">
                <a href="#">Design Portfolio</a> | 
                <a href="#">Consultation Booking</a> | 
                <a href="#">Contact Support</a>
            </div>
            
            <p>© 2024 HomeHNI. All rights reserved.</p>
            <p style="font-size: 12px; color: #999;">
                This email was sent to ${email}. If you didn't create an account, 
                please ignore this email or contact our support team.
            </p>
        </div>
    </div>
</body>
</html>`;
}

/*
TESTING COMMANDS FOR POWERSHELL:

# Test Password Reset Email
$headers = @{
    'Content-Type' = 'application/json'
    'x-api-key' = 'MyNew$uper$ecretKey2025'
}

$body = @{
    email = 'your-email@example.com'
    name = 'Test User'
    resetUrl = 'https://yourdomain.com/auth?mode=reset-password&token=abc123'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'https://email-system-hni.vercel.app/api/send-password-reset-email' -Method POST -Headers $headers -Body $body

# Test Email Verification
$body = @{
    email = 'your-email@example.com'
    name = 'Test User'
    verificationUrl = 'https://yourdomain.com/auth?mode=verify-email&token=xyz789'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'https://email-system-hni.vercel.app/api/send-email-verification' -Method POST -Headers $headers -Body $body
*/