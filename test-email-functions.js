#!/usr/bin/env node

/**
 * Email Testing Script for HomeHNI
 * 
 * This script tests all email functions to ensure they're working correctly.
 * Run with: node test-email-functions.js
 */

const EMAIL_API_BASE = 'https://email-system-hni.vercel.app';
const EMAIL_API_KEY = 'MyNew$uper$ecretKey2025';

// Test email address (replace with your test email)
const TEST_EMAIL = "test@example.com";
const TEST_NAME = "Test User";

async function testExternalAPI(endpoint, body) {
  try {
    console.log(`\n🧪 Testing ${endpoint}...`);
    
    const response = await fetch(`${EMAIL_API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EMAIL_API_KEY
      },
      body: JSON.stringify(body)
    });

    let result = null;
    try {
      result = await response.json();
    } catch {
      result = { ok: response.ok, status: response.status };
    }
    
    if (response.ok) {
      console.log(`✅ ${endpoint} - SUCCESS`);
      console.log(`   Response:`, result);
      return true;
    } else {
      console.log(`❌ ${endpoint} - FAILED`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error:`, result);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${endpoint} - ERROR`);
    console.log(`   Error:`, error.message);
    return false;
  }
}

async function testEmailVerification() {
  const verificationUrl = `https://homehni.in/auth?mode=verify&email=${encodeURIComponent(TEST_EMAIL)}`;
  
  return await testExternalAPI('/send-verification-email', {
    to: TEST_EMAIL,
    userName: TEST_NAME,
    verificationUrl: verificationUrl
  });
}

async function testPasswordReset() {
  const resetUrl = `https://homehni.in/auth?mode=reset-password&email=${encodeURIComponent(TEST_EMAIL)}`;
  
  return await testExternalAPI('/send-password-reset-email', {
    to: TEST_EMAIL,
    userName: TEST_NAME,
    resetUrl: resetUrl
  });
}

async function runAllTests() {
  console.log('🚀 Starting HomeHNI Email Function Tests');
  console.log('==========================================');
  console.log(`📧 Test Email: ${TEST_EMAIL}`);
  console.log(`👤 Test Name: ${TEST_NAME}`);
  console.log(`🌐 Email API: ${EMAIL_API_BASE}`);
  
  const results = {
    verification: await testEmailVerification(),
    passwordReset: await testPasswordReset()
  };
  
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  console.log(`Email Verification: ${results.verification ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Password Reset: ${results.passwordReset ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All email functions are working correctly!');
  } else {
    console.log('⚠️  Some email functions need attention.');
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check if your external email API is running');
    console.log('2. Verify EMAIL_API_KEY is correct');
    console.log('3. Check external API logs for errors');
    console.log('4. Ensure test email address is valid');
  }
}

// Run the tests
runAllTests().catch(console.error);
