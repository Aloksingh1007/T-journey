/**
 * Test script for Privacy Settings API endpoint
 * Tests PUT /api/profile/privacy
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

async function testPrivacySettingsEndpoint() {
  console.log('🧪 Testing Privacy Settings API Endpoint\n');
  console.log('='.repeat(50));

  try {
    // First, register a test user
    console.log('\n1️⃣  Registering test user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: `test-privacy-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Privacy Test User',
    });

    if (registerResponse.data.success) {
      console.log('✅ User registered successfully');
      const userId = registerResponse.data.data.user.id;
      const token = registerResponse.data.data.token;
      console.log(`   User ID: ${userId}`);

      // Test 1: Update privacy settings - Make profile public
      console.log('\n2️⃣  Testing PUT /api/profile/privacy (make profile public)...');
      try {
        const updateResponse = await axios.put(
          `${API_BASE_URL}/profile/privacy`,
          {
            profileVisibility: 'PUBLIC',
            shareStats: true,
            shareTrades: true,
            shareEmotions: false,
            sharePatterns: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updateResponse.data.success) {
          console.log('✅ Privacy settings updated successfully');
          console.log('   Updated settings:', JSON.stringify(updateResponse.data.data, null, 2));
          
          // Verify the settings
          const settings = updateResponse.data.data;
          if (
            settings.profileVisibility === 'PUBLIC' &&
            settings.shareStats === true &&
            settings.shareTrades === true &&
            settings.shareEmotions === false &&
            settings.sharePatterns === false
          ) {
            results.push({
              test: 'Update privacy settings (make public)',
              passed: true,
              message: 'Successfully updated privacy settings with correct values',
            });
          } else {
            results.push({
              test: 'Update privacy settings (make public)',
              passed: false,
              message: 'Privacy settings updated but values do not match expected',
            });
          }
        }
      } catch (error: any) {
        console.log('❌ Failed to update privacy settings');
        console.log('   Error:', error.response?.data || error.message);
        results.push({
          test: 'Update privacy settings (make public)',
          passed: false,
          message: error.response?.data?.error?.message || error.message,
        });
      }

      // Test 2: Update privacy settings - Partial update
      console.log('\n3️⃣  Testing PUT /api/profile/privacy (partial update)...');
      try {
        const partialUpdateResponse = await axios.put(
          `${API_BASE_URL}/profile/privacy`,
          {
            shareEmotions: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (partialUpdateResponse.data.success) {
          console.log('✅ Privacy settings partially updated successfully');
          console.log('   Updated settings:', JSON.stringify(partialUpdateResponse.data.data, null, 2));
          
          // Verify the settings - shareEmotions should be true now
          const settings = partialUpdateResponse.data.data;
          if (settings.shareEmotions === true) {
            results.push({
              test: 'Update privacy settings (partial update)',
              passed: true,
              message: 'Successfully updated single privacy setting',
            });
          } else {
            results.push({
              test: 'Update privacy settings (partial update)',
              passed: false,
              message: 'Privacy setting not updated correctly',
            });
          }
        }
      } catch (error: any) {
        console.log('❌ Failed to partially update privacy settings');
        console.log('   Error:', error.response?.data || error.message);
        results.push({
          test: 'Update privacy settings (partial update)',
          passed: false,
          message: error.response?.data?.error?.message || error.message,
        });
      }

      // Test 3: Verify privacy settings persist in profile
      console.log('\n4️⃣  Testing GET /api/profile/:userId (verify privacy settings)...');
      try {
        const profileResponse = await axios.get(
          `${API_BASE_URL}/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.data.success) {
          console.log('✅ Profile retrieved successfully');
          const privacySettings = profileResponse.data.data.privacySettings;
          console.log('   Privacy settings:', JSON.stringify(privacySettings, null, 2));
          
          // Verify the settings match what we set
          if (
            privacySettings.profileVisibility === 'PUBLIC' &&
            privacySettings.shareStats === true &&
            privacySettings.shareTrades === true &&
            privacySettings.shareEmotions === true
          ) {
            results.push({
              test: 'Verify privacy settings persist',
              passed: true,
              message: 'Privacy settings correctly persisted in profile',
            });
          } else {
            results.push({
              test: 'Verify privacy settings persist',
              passed: false,
              message: 'Privacy settings in profile do not match expected values',
            });
          }
        }
      } catch (error: any) {
        console.log('❌ Failed to get profile');
        console.log('   Error:', error.response?.data || error.message);
        results.push({
          test: 'Verify privacy settings persist',
          passed: false,
          message: error.response?.data?.error?.message || error.message,
        });
      }

      // Test 4: Update without authentication (should fail)
      console.log('\n5️⃣  Testing PUT /api/profile/privacy (without authentication)...');
      try {
        await axios.put(
          `${API_BASE_URL}/profile/privacy`,
          {
            profileVisibility: 'PRIVATE',
          }
        );

        console.log('⚠️  Unexpected: Privacy update succeeded without authentication');
        results.push({
          test: 'Update privacy settings (unauthenticated)',
          passed: false,
          message: 'Expected authentication error but got success',
        });
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('✅ Correctly blocked unauthenticated request');
          results.push({
            test: 'Update privacy settings (unauthenticated)',
            passed: true,
            message: 'Correctly required authentication',
          });
        } else {
          console.log('❌ Unexpected error:', error.response?.data || error.message);
          results.push({
            test: 'Update privacy settings (unauthenticated)',
            passed: false,
            message: error.response?.data?.error?.message || error.message,
          });
        }
      }

      // Test 5: Update with invalid data (should fail validation)
      console.log('\n6️⃣  Testing PUT /api/profile/privacy (invalid data)...');
      try {
        await axios.put(
          `${API_BASE_URL}/profile/privacy`,
          {
            profileVisibility: 'INVALID_VALUE',
            shareStats: 'not-a-boolean',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('⚠️  Unexpected: Invalid data accepted');
        results.push({
          test: 'Update privacy settings (invalid data)',
          passed: false,
          message: 'Expected validation error but got success',
        });
      } catch (error: any) {
        if (error.response?.status === 400) {
          console.log('✅ Correctly rejected invalid data');
          results.push({
            test: 'Update privacy settings (invalid data)',
            passed: true,
            message: 'Correctly validated input data',
          });
        } else {
          console.log('❌ Unexpected error:', error.response?.data || error.message);
          results.push({
            test: 'Update privacy settings (invalid data)',
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
testPrivacySettingsEndpoint().catch((error) => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
