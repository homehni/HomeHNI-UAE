/*
Add these endpoints to your existing email service API at https://email-system-hni.vercel.app

Copy and paste these endpoint functions into your main API file.
*/

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
    from: `"HomeHNI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your HomeHNI Password',
    html: `
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
            .reset-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
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
    </html>
    `
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
    from: `"HomeHNI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to HomeHNI! Please Verify Your Email',
    html: `
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
                transition: transform 0.2s ease;
            }
            .verify-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(40, 167, 69, 0.6);
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
    </html>
    `
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

/*
TESTING COMMANDS:

# Test Password Reset Email
$headers = @{
    'Content-Type' = 'application/json'
    'x-api-key' = 'MyNew$uper$ecretKey2025'
}

$body = @{
    email = 'your-email@example.com'
    name = 'Test User'
    resetUrl = 'https://yourdomain.com/reset-password?token=abc123'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'https://email-system-hni.vercel.app/api/send-password-reset-email' -Method POST -Headers $headers -Body $body

# Test Email Verification
$body = @{
    email = 'your-email@example.com'
    name = 'Test User'
    verificationUrl = 'https://yourdomain.com/verify-email?token=xyz789'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'https://email-system-hni.vercel.app/api/send-email-verification' -Method POST -Headers $headers -Body $body
*/
            .footer p { font-size: 14px; opacity: 0.8; margin-bottom: 8px; }
            .footer-links { margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151; }
            .footer-links a { color: #DC2626; text-decoration: none; margin: 0 15px; font-size: 14px; }
            @media only screen and (max-width: 600px) {
              body { padding: 10px; }
              .header, .content, .footer { padding: 25px 20px; }
              .logo { font-size: 24px; }
              .header h1 { font-size: 20px; }
              .reset-button { padding: 14px 28px; font-size: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="header-content">
                <div class="logo">HomeHNI</div>
                <h1>Password Reset Request</h1>
                <p>Secure account access restoration</p>
              </div>
            </div>
            <div class="content">
              <div class="greeting">Hello ${userName || 'there'}!</div>
              <div class="message">
                We received a request to reset your password for your HomeHNI account. If you made this request, click the button below to set a new password:
              </div>
              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset My Password</a>
              </div>
              <div class="url-section">
                <div class="url-label">Or copy and paste this link in your browser:</div>
                <div class="url-text">${resetUrl}</div>
              </div>
              <div class="security-notice">
                <h3>🔒 Security Notice</h3>
                <p>This password reset link will expire in 1 hour for your security. If you need a new link, you can request another password reset from our login page.</p>
              </div>
              <div class="message">
                <strong>Didn't request this?</strong> If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </div>
            </div>
            <div class="footer">
              <div class="footer-logo">🏠 HomeHNI</div>
              <p>Your trusted partner in home and property services</p>
              <p>© 2024 HomeHNI. All rights reserved.</p>
              <div class="footer-links">
                <a href="https://homehni.in">Visit Website</a>
                <a href="https://homehni.in/support">Support</a>
                <a href="https://homehni.in/privacy">Privacy Policy</a>
              </div>
              <p style="margin-top: 15px; font-size: 12px;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', to);
    
    res.json({ 
      success: true, 
      message: 'Password reset email sent successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
});

// Email Verification Endpoint
app.post('/send-verification-email', authenticateAPIKey, async (req, res) => {
  try {
    const { to, userName, verificationUrl } = req.body;

    if (!to || !verificationUrl) {
      return res.status(400).json({ error: 'Missing required fields: to, verificationUrl' });
    }

    const mailOptions = {
      from: `"HomeHNI" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: 'Verify Your Email Address - HomeHNI',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - HomeHNI</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 20px; }
            .email-container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 40px 30px; text-align: center; position: relative; }
            .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>') repeat; opacity: 0.3; }
            .header-content { position: relative; z-index: 1; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .logo::before { content: '🏠'; font-size: 32px; margin-right: 8px; }
            .header h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
            .header p { font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 30px; background: #fff; }
            .greeting { font-size: 20px; font-weight: 600; color: #DC2626; margin-bottom: 20px; }
            .welcome-message { font-size: 16px; line-height: 1.7; margin-bottom: 25px; color: #555; }
            .benefits { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #DC2626; }
            .benefits h3 { color: #DC2626; font-size: 16px; margin-bottom: 12px; font-weight: 600; }
            .benefits ul { list-style: none; padding: 0; }
            .benefits li { font-size: 14px; color: #555; margin-bottom: 8px; padding-left: 20px; position: relative; }
            .benefits li::before { content: '✓'; color: #DC2626; font-weight: bold; position: absolute; left: 0; }
            .button-container { text-align: center; margin: 35px 0; }
            .verify-button { display: inline-block; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3); }
            .url-section { background: #f8f9fa; border: 2px dashed #DC2626; border-radius: 8px; padding: 20px; margin: 25px 0; }
            .url-label { font-size: 14px; font-weight: 600; color: #DC2626; margin-bottom: 10px; }
            .url-text { word-break: break-all; background: #fff; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; color: #333; border: 1px solid #e2e8f0; }
            .security-notice { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12; }
            .security-notice h3 { color: #8b6f00; font-size: 16px; margin-bottom: 8px; font-weight: 600; }
            .security-notice p { color: #8b6f00; font-size: 14px; line-height: 1.5; }
            .footer { background: #1f2937; color: #fff; padding: 30px; text-align: center; }
            .footer-logo { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #DC2626; }
            .footer p { font-size: 14px; opacity: 0.8; margin-bottom: 8px; }
            .footer-links { margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151; }
            .footer-links a { color: #DC2626; text-decoration: none; margin: 0 15px; font-size: 14px; }
            @media only screen and (max-width: 600px) {
              body { padding: 10px; }
              .header, .content, .footer { padding: 25px 20px; }
              .logo { font-size: 24px; }
              .header h1 { font-size: 20px; }
              .verify-button { padding: 14px 28px; font-size: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="header-content">
                <div class="logo">HomeHNI</div>
                <h1>Welcome to HomeHNI!</h1>
                <p>Let's verify your email address</p>
              </div>
            </div>
            <div class="content">
              <div class="greeting">Hello ${userName}!</div>
              <div class="welcome-message">
                Thank you for joining HomeHNI! We're excited to have you as part of our community. To complete your account setup and start exploring our services, please verify your email address.
              </div>
              <div class="benefits">
                <h3>🎉 What's next after verification?</h3>
                <ul>
                  <li>Access premium home and property services</li>
                  <li>Connect with verified professionals</li>
                  <li>Get personalized recommendations</li>
                  <li>Save your favorite properties and services</li>
                  <li>Receive exclusive offers and updates</li>
                </ul>
              </div>
              <div class="button-container">
                <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
              </div>
              <div class="url-section">
                <div class="url-label">Or copy and paste this link in your browser:</div>
                <div class="url-text">${verificationUrl}</div>
              </div>
              <div class="security-notice">
                <h3>🔒 Security Notice</h3>
                <p>This verification link will expire in 24 hours for your security. If you need a new verification link, you can request one from our login page.</p>
              </div>
              <div class="welcome-message">
                <strong>Didn't create an account?</strong> If you didn't sign up for HomeHNI, you can safely ignore this email. No account will be created without email verification.
              </div>
            </div>
            <div class="footer">
              <div class="footer-logo">🏠 HomeHNI</div>
              <p>Your trusted partner in home and property services</p>
              <p>© 2024 HomeHNI. All rights reserved.</p>
              <div class="footer-links">
                <a href="https://homehni.in">Visit Website</a>
                <a href="https://homehni.in/support">Support</a>
                <a href="https://homehni.in/privacy">Privacy Policy</a>
              </div>
              <p style="margin-top: 15px; font-size: 12px;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', to);
    
    res.json({ 
      success: true, 
      message: 'Verification email sent successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});