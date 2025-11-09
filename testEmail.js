const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestEmail() {
  try {
    console.log('🧪 Testing Gmail email sending...');
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set (length: ' + process.env.EMAIL_PASS.length + ')' : 'Not set');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    console.log('🔍 Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified!');

    const testEmail = 'tsekontsoele57@gmail.com';
    const testToken = 'test-verification-token-123';

    console.log('📧 Sending to:', testEmail);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: 'Test Verification Email - Career Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Test Email - Career Platform</h2>
          <p style="color: #666; font-size: 16px;">This is a test email to verify Gmail configuration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/verify-email?token=${testToken}"
               style="background-color: #000; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 4px; font-size: 16px;">
              Test Verification Link
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            Test token: ${testToken}
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Gmail test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Check your inbox at:', testEmail);
    console.log('🔗 The verification link should be: http://localhost:3000/verify-email?token=' + testToken);

  } catch (error) {
    console.error('❌ Error sending Gmail test email:', error.message);
    console.log('💡 Make sure EMAIL_USER and EMAIL_PASS are set in your .env file');
    console.log('💡 For Gmail, you may need to enable "Less secure app access" or use an App Password');
    console.log('💡 If you have 2FA enabled, use an App Password instead of your regular password');
  }
}

sendTestEmail();
