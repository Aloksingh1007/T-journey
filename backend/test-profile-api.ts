/**
 * Test script for Profile API endpoint
 * Tests GET /api/profile/:userId
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

async function testProfileEndpoint() {
  console.log('🧪 Testing Profile API Endpoint\n');
  console.log('='.repeat(50));

  try {
    // First, register a test user
    console.log('\n1️⃣  Registering test user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: `test-profile-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Test User',
    });

    if (registerResponse.data.success) {
      console.log('✅ User registered successfully');
      const userId = registerResponse.data.data.user.id;
      const token = registerResponse.data.data.token;
      console.log(`   User ID: ${userId}`);

      // Test 1: Get own profile (authenticated)
      console.log('\n2️⃣  Testing GET /api/profile/:userId (authenticated - own profile)...');
      try {
        const ownProfileResponse = await axios.get(
          `${API_BASE_URL}/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (ownProfileResponse.data.success) {
          console.log('✅ Own profile retrieved successfully');
          console.log('   Profile data:', JSON.stringify(ownProfileResponse.data.data, null, 2));
          results.push({
            test: 'Get own profile (authenticated)',
            passed: true,
            message: 'Successfully retrieved own profile with full data',
          });
        }
      } catch (error: any) {
        console.log('❌ Failed to get own profile');
        console.log('   Error:', error.response?.data || error.message);
        results.push({
          test: 'Get own profile (authenticated)',
          passed: false,
          message: error.response?.data?.error?.message || error.message,
        });
      }

      // Test 2: Get profile without authentication (should work but with limited data)
      console.log('\n3️⃣  Testing GET /api/profile/:userId (unauthenticated)...');
      try {
        await axios.get(
          `${API_BASE_URL}/profile/${userId}`
        );

        // This should fail because default profile visibility is PRIVATE
        console.log('⚠️  Unexpected: Public profile access succeeded (should be private by default)');
        results.push({
          test: 'Get profile (unauthenticated, private profile)',
          passed: false,
          message: 'Expected authorization error but got success',
        });
      } catch (error: any) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          console.log('✅ Correctly blocked access to private profile');
          results.push({
            test: 'Get profile (unauthenticated, private profile)',
            passed: true,
            message: 'Correctly enforced privacy settings',
          });
        } else {
          console.log('❌ Unexpected error:', error.response?.data || error.message);
          results.push({
            test: 'Get profile (unauthenticated, private profile)',
            passed: false,
            message: error.response?.data?.error?.message || error.message,
          });
        }
      }

      // Test 3: Get non-existent profile
      console.log('\n4️⃣  Testing GET /api/profile/:userId (non-existent user)...');
      try {
        await axios.get(
          `${API_BASE_URL}/profile/00000000-0000-0000-0000-000000000000`
        );

        console.log('⚠️  Unexpected: Non-existent profile returned success');
        results.push({
          test: 'Get non-existent profile',
          passed: false,
          message: 'Expected 404 error but got success',
        });
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log('✅ Correctly returned 404 for non-existent user');
          results.push({
            test: 'Get non-existent profile',
            passed: true,
            message: 'Correctly returned 404 error',
          });
        } else {
          console.log('❌ Unexpected error:', error.response?.data || error.message);
          results.push({
            test: 'Get non-existent profile',
            passed: false,
            message: error.response?.data?.error?.message || error.message,
          });
        }
      }
    }
  } catch (error: any) {
    console.log('❌ Failed to register test user');
    console.log('   Error:', error.response?.data || error.message);
    results.push({
      test: 'User registration',
      passed: false,
      message: error.response?.data?.error?.message || error.message,
    });
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary\n');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} Test ${index + 1}: ${result.test}`);
    console.log(`   ${result.message}`);
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n🎯 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed\n');
    process.exit(1);
  }
}

// Run tests
testProfileEndpoint().catch((error) => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
