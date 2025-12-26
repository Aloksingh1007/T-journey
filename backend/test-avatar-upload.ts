/**
 * Test script for avatar upload functionality
 * 
 * This script tests the POST /api/profile/avatar endpoint
 * 
 * Usage:
 * 1. Make sure the backend server is running
 * 2. Update the JWT token below with a valid token
 * 3. Run: npx ts-node test-avatar-upload.ts
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'http://localhost:5000/api';

// Replace with a valid JWT token from your login
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE';

async function testAvatarUpload() {
  console.log('🧪 Testing Avatar Upload Functionality\n');

  try {
    // Test 1: Upload avatar with valid image
    console.log('Test 1: Upload avatar with valid image');
    
    // Create a test image file (you can use any existing image in uploads folder)
    const testImagePath = path.join(__dirname, 'uploads', 'cuppid-1763571681959-651119888.png');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('⚠️  Test image not found. Please ensure an image exists at:', testImagePath);
      console.log('   You can use any PNG/JPG image from the uploads folder\n');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', fs.createReadStream(testImagePath));

    const response = await axios.post(
      `${API_BASE_URL}/profile/avatar`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${JWT_TOKEN}`,
        },
      }
    );

    console.log('✅ Avatar uploaded successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('Avatar URL:', response.data.data.avatar);
    console.log('');

    // Test 2: Verify avatar is set in profile
    console.log('Test 2: Verify avatar is set in profile');
    const profileResponse = await axios.get(
      `${API_BASE_URL}/profile/${response.data.data.id}`,
      {
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`,
        },
      }
    );

    console.log('✅ Profile retrieved successfully!');
    console.log('Avatar URL in profile:', profileResponse.data.data.avatar);
    console.log('');

    // Test 3: Upload without file (should fail)
    console.log('Test 3: Upload without file (should fail)');
    try {
      const emptyFormData = new FormData();
      await axios.post(
        `${API_BASE_URL}/profile/avatar`,
        emptyFormData,
        {
          headers: {
            ...emptyFormData.getHeaders(),
            'Authorization': `Bearer ${JWT_TOKEN}`,
          },
        }
      );
      console.log('❌ Test failed: Should have returned error for missing file');
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected upload without file');
        console.log('Error message:', error.response.data.error.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 4: Upload without authentication (should fail)
    console.log('Test 4: Upload without authentication (should fail)');
    try {
      const formData2 = new FormData();
      formData2.append('avatar', fs.createReadStream(testImagePath));
      
      await axios.post(
        `${API_BASE_URL}/profile/avatar`,
        formData2,
        {
          headers: {
            ...formData2.getHeaders(),
          },
        }
      );
      console.log('❌ Test failed: Should have returned authentication error');
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected upload without authentication');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All tests completed!');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
testAvatarUpload();
