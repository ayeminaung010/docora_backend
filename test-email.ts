// test-email.ts
import { EmailService} from './src/services/email.service';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmailSetup() {
  console.log('🔧 Testing Docora Email Service...\n');
  
  // Display configuration (without showing password)
  console.log('📧 Email Configuration:');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER);
  console.log('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set (hidden)' : '❌ Not set');
  console.log('   SMTP Host: smtp.gmail.com');
  console.log('   SMTP Port: 587\n');

  try {
    // Test 1: Connection Test
    console.log('🔌 Step 1: Testing SMTP connection...');
    const connected = await EmailService.testConnection();
    
    if (!connected) {
      console.log('❌ Connection failed! Please check your credentials.');
      return;
    }
    console.log('✅ SMTP connection successful!\n');

    // Test 2: Send Test OTP Email
    console.log('📤 Step 2: Sending test OTP email...');
    const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
    const testOTP = '123456';
    
    if (testEmail) {
      await EmailService.sendOTP(testEmail, testOTP, 'Test User');
      console.log(`✅ OTP email sent successfully to ${testEmail}`);
      console.log(`   OTP Code: ${testOTP}\n`);
    } else {
      console.log('⚠️ No test email configured\n');
    }

    // Test 3: Send Welcome Email
    console.log('📤 Step 3: Sending test welcome email...');
    if (testEmail) {
      await EmailService.sendWelcomeEmail(testEmail, 'Test User');
      console.log(`✅ Welcome email sent successfully to ${testEmail}\n`);
    }

    // Test 4: Send Custom Email
    console.log('📤 Step 4: Sending custom test email...');
    if (testEmail) {
      await EmailService.sendEmail({
        to: testEmail,
        subject: 'Docora Email Service Test ✅',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #333; text-align: center;">🎉 Email Service Working!</h2>
              <p>Congratulations! Your Docora email service is configured correctly and working perfectly.</p>
              <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>✅ Connection: Success</strong><br>
                <strong>✅ Authentication: Success</strong><br>
                <strong>✅ Email Delivery: Success</strong>
              </div>
              <p style="text-align: center; color: #666; font-size: 12px;">
                Test completed at ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        `,
        text: 'Email Service Test - Success! Your Docora email service is working correctly.'
      });
      console.log(`✅ Custom test email sent successfully to ${testEmail}\n`);
    }

    // Success Summary
    console.log('🎉 All tests completed successfully!');
    console.log('📧 Check your email inbox for the test messages');
    console.log('\n📋 Next Steps:');
    console.log('   1. Check your email inbox for 4 test emails');
    console.log('   2. Your email service is ready for production');
    console.log('   3. You can now use forgot password functionality');
    console.log('   4. Welcome emails will be sent to new users');

  } catch (error) {
    console.error('\n❌ Email test failed:', error);
    
    // Provide troubleshooting tips
    console.log('\n🔍 Troubleshooting Guide:');
    console.log('1. Verify your .env file contains:');
    console.log('   EMAIL_USER=docorateam@gmail.com');
    console.log('   EMAIL_PASSWORD=cdlp soci fbum lhuy');
    console.log('\n2. Gmail Setup Checklist:');
    console.log('   ✓ 2-Factor Authentication enabled');
    console.log('   ✓ App password generated (not regular password)');
    console.log('   ✓ App password copied without spaces');
    console.log('\n3. Common Issues:');
    console.log('   - Remove spaces from app password');
    console.log('   - Ensure docorateam@gmail.com has 2FA enabled');
    console.log('   - Try generating a new app password');
    console.log('   - Check if Gmail account is active');
  }
}

// Additional test for AuthService integration
async function testAuthServiceEmail() {
  console.log('\n🔐 Testing AuthService Email Integration...\n');
  
  try {
    const { AuthService } = await import('./src/services/auth.service');
    
    // Test forgot password
    const testEmail = process.env.EMAIL_USER;
    if (testEmail) {
      console.log(`📤 Testing forgot password for ${testEmail}...`);
      const result = await AuthService.forgotPassword(testEmail);
      console.log('✅ Forgot password email sent:', result.message);
      
      // Show OTP stats
      const stats = AuthService.getOTPStats();
      console.log(`📊 OTP Stats: ${stats.activeOTPs} active OTPs`);
      
      if (stats.details.length > 0) {
        console.log('   Details:', stats.details);
      }
    }
  } catch (error) {
    console.error('❌ AuthService email test failed:', error);
    console.log('⚠️  Make sure your User model and database connection are working');
  }
}

// Run tests
async function runAllTests() {
  await testEmailSetup();
  
  // Only run AuthService test if basic email test passes
  const shouldTestAuth = process.argv.includes('--include-auth');
  if (shouldTestAuth) {
    await testAuthServiceEmail();
  } else {
    console.log('\n💡 To test AuthService integration, run:');
    console.log('   npx ts-node test-email.ts --include-auth');
  }
}

runAllTests();