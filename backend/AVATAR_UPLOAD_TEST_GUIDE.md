# Avatar Upload API Test Guide

## Endpoint
`POST /api/profile/avatar`

## Description
Upload a profile picture for the authenticated user. The avatar is stored in the uploads directory and the URL is saved to the user's profile.

## Implementation Details

### Files Modified
1. **backend/src/controllers/profile.controller.ts** - Added `uploadAvatar` controller
2. **backend/src/services/profile.service.ts** - Added `uploadAvatar` service method
3. **backend/src/routes/profile.routes.ts** - Added avatar upload route with multer middleware

### Features
- ✅ Requires authentication (JWT token)
- ✅ Accepts single image file with field name 'avatar'
- ✅ Validates file type (PNG, JPG, JPEG only)
- ✅ Validates file size (max 5 MB)
- ✅ Stores file in uploads directory with unique filename
- ✅ Updates user profile with avatar URL
- ✅ Returns updated user profile

## Testing with cURL

### 1. Login to get JWT token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

Save the token from the response.

### 2. Upload avatar
```bash
curl -X POST http://localhost:5000/api/profile/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@/path/to/your/image.png"
```

### 3. Verify avatar in profile
```bash
curl -X GET http://localhost:5000/api/profile/YOUR_USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing with Postman

### 1. Login
- Method: POST
- URL: `http://localhost:5000/api/auth/login`
- Body (JSON):
  ```json
  {
    "email": "your-email@example.com",
    "password": "your-password"
  }
  ```
- Copy the token from response

### 2. Upload Avatar
- Method: POST
- URL: `http://localhost:5000/api/profile/avatar`
- Headers:
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body:
  - Type: form-data
  - Key: `avatar` (type: File)
  - Value: Select an image file (PNG, JPG, or JPEG)

### 3. Verify Profile
- Method: GET
- URL: `http://localhost:5000/api/profile/YOUR_USER_ID`
- Headers:
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Check that the `avatar` field contains the uploaded image URL

## Expected Responses

### Success (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "bio": "User bio",
    "avatar": "/uploads/avatar-1234567890-123456789.png",
    "tradingStyle": "DAY_TRADER",
    "experienceLevel": "INTERMEDIATE",
    "privacySettings": { ... },
    "stats": { ... },
    "badges": [],
    "milestones": {},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error: No file uploaded (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "FILE_REQUIRED",
    "message": "No file uploaded"
  }
}
```

### Error: Invalid file type (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "FILE_UPLOAD_ERROR",
    "message": "Invalid file type. Only PNG, JPG, and JPEG images are allowed."
  }
}
```

### Error: File too large (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "FILE_UPLOAD_ERROR",
    "message": "File size exceeds 5 MB limit"
  }
}
```

### Error: Not authenticated (401 Unauthorized)
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Authentication required"
  }
}
```

## Integration with Frontend

### Example React/TypeScript code:

```typescript
// Upload avatar
async function uploadAvatar(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch('http://localhost:5000/api/profile/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload avatar');
  }

  const data = await response.json();
  return data.data;
}

// Usage in component
const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
    alert('Please select a PNG or JPG image');
    return;
  }

  // Validate file size (5 MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5 MB');
    return;
  }

  try {
    const updatedProfile = await uploadAvatar(file);
    console.log('Avatar uploaded:', updatedProfile.avatar);
    // Update UI with new avatar
  } catch (error) {
    console.error('Failed to upload avatar:', error);
  }
};
```

## Notes

- Avatar files are stored in `backend/uploads/` directory
- File naming format: `originalname-timestamp-random.ext`
- Avatar URL is relative: `/uploads/filename.png`
- For production, consider using a CDN (AWS S3, Cloudinary, etc.)
- Old avatars are not automatically deleted (consider implementing cleanup)

## Security Considerations

- ✅ Authentication required
- ✅ File type validation (images only)
- ✅ File size limit (5 MB)
- ✅ Filename sanitization
- ✅ User can only update their own avatar
- ⚠️ Consider adding rate limiting for uploads
- ⚠️ Consider virus scanning for uploaded files in production
