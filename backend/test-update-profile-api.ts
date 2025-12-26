/**
 * Test script for Update Profile API endpoint
 * Tests PUT /api/profile
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

async function testUpdateProfileEndpoint() {
  console.log('🧪 Testing Update Profile API Endpoint\n');
  console.log('='.repeat(50));

  try {
    // First, register a test user
    console.log('\n1️⃣  Registering test user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: `test-update-profile-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Test User',
    });

    if (registerResponse.data.success) {
      console.log('✅ User registered successfully');
      const userId = registerResponse.data.data.user.id;
      const token = registerResponse.data.data.token;
      console.log(`   User ID: ${userId}`);

      // Test 1: Update profile with valid data
      console.log('\n2️⃣  Testing PUT /api/profile (valid update)...');
      try {
        const updateResponse = await axios.put(
          `${API_BASE_URL}/profile`,
          {
            name: 'Updated Name',
            bio: 'I am a passionate day trader',
            tradingStyle: 'DAY_TRADER',
            experienceLevel: 'INTERMEDIATE',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updateResponse.data.success) {
          console.log('✅ Profile updated successfully');
          const profile = updateResponse.data.data;
          
          // Verify the updates
          if (
            profile.name === 'Updated Name' &&
            profile.bio === 'I am a passionate day trader' &&
            profile.tradingStyle === 'DAY_TRADER' &&
            profile.experienceLevel === 'INTERMEDIATE'
          ) {
            console.log('✅ All fields updated correctly');
            results.push({
              test: 'Update profile with valid data',
              passed: true,
              message: 'Successfully updated all profile fields',
            });
          } else {
            console.log('❌ Some fields were not updated correctly');
            results.push({
              test: 'Update profile with valid data',
              passed: false,
              message: 'Fields were not updated as expected',
            });
          }
        }
      } catch (error: any) {
        console.log('❌ Failed to update profile');
        console.log('   Error:', error.response?.data || error.message);
        results.push({
          test: 'Update profile with valid data',
          passed: false,
          message: error.response?.data?.error?.message || error.message,
        });
      }

      // Test 2: Update profile with partial data
      console.log('\n3️⃣  Testing PUT /api/profile (partial update)...');
      try {
        const partialUpdateResponse = await axios.put(
          `${API_BASE_URL}/profile`,
          {
            bio: 'Updated bio only',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (partialUpdateResponse.data.success) {
          const profile = partialUpdateResponse.data.data;
          
          if (
            profile.bio === 'Updated bio only' &&
            profile.name === 'Updated Name' // Should retain previous value
          ) {
            console.log('✅ Partial update successful, other fields retained');
            results.push({
              test: 'Update profile with partial data',
              passed: true,
              message: 'Successfully updated only specified fields',
            });
          } else {
            console.log('❌ Partial update failed to retain other fields');
            results.push({
              test: 'Update profile with partial data',
              passed: false,
              message: 'Other fields were not retained',
            });
          }
        }
      } catch (error: any) {
        console.log('❌ Failed partial update');
        console.log('   Error:', error.response?.data || error.message);
        results.push({
          test: 'Update profile with partial data',
          passed: false,
          message: error.response?.data?.error?.message || error.message,
        });
      }

      // Test 3: Try to update without authentication
      console.log('\n4️⃣  Testing PUT /api/profile (no authentication)...');
      try {
        await axios.put(`${API_BASE_URL}/profile`, {
          name: 'Hacker Name',
        });

        console.log('⚠️  Unexpected: Update succeeded without authentication');
        results.push({
          test: 'Update profile without authentication',
          passed: false,
          message: 'Expected authentication error but got success',
        });
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('✅ Correctly blocked unauthenticated update');
          results.push({
            test: 'Update profile without authentication',
            passed: true,
            message: 'Correctly required authentication',
          });
        } else {
          console.log('❌ Unexpected error:', error.response?.data || error.message);
          results.push({
            test: 'Update profile without authentication',
            passed: false,
            message: error.response?.data?.error?.message || error.message,
          });
        }
      }

      // Test 4: Try to update with invalid data
      console.log('\n5️⃣  Testing PUT /api/profile (invalid data)...');
      try {
        await axios.put(
          `${API_BASE_URL}/profile`,
          {
            name: '', // Empty name should fail
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('⚠️  Unexpected: Invalid data accepted');
        results.push({
          test: 'Update profile with invalid data',
          passed: false,
          message: 'Expected validation error but got success',
        });
      } catch (error: any) {
        if (error.response?.status === 400) {
          console.log('✅ Correctly rejected invalid data');
          results.push({
            test: 'Update profile with invalid data',
            passed: true,
            message: 'Correctly validated input data',
          });
        } else {
          console.log('❌ Unexpected error:', error.response?.data || error.message);
          results.push({
            test: 'Update profile with invalid data',
            passed: false,
            message: error.response?.data?.error?.message || error.message,
          });
        }
      }

      // Test 5: Verify updated profile can be retrieved
      console.log('\n6️⃣  Testing GET /api/profile/:userId (verify updates)...');
      try {
        const getResponse = await axios.get(`${API_BASE_URL}/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (getResponse.data.success) {
          const profile = getResponse.data.data;
          
          if (profile.bio === 'Updated bio only') {
            console.log('✅ Updated profile retrieved successfully');
            results.push({
              test: 'Retrieve updated profile',
              passed: true,
              message: 'Updates persisted correctly',
            });
          } else {
            console.log('❌ Retrieved profile does not match updates');
            results.push({
              test: 'Retrieve updated profile',
              passed: false,
              message: 'Updates were not persisted',
            });
          }
        }
      } catch (error: any) {
        console.log('❌ Failed to retrieve updated profile');
        console.log('   Error:', error.response?.data || error.message);
        results.push({
          test: 'Retrieve updated profile',
          passed: false,
          message: error.response?.data?.error?.message || error.message,
        });
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

  const passed = results.filter((r) => r.passed).length;
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
testUpdateProfileEndpoint().catch((error) => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
