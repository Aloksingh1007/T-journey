# Avatar Upload - Quick Reference

## Endpoint
```
POST /api/profile/avatar
```

## Authentication
Required - JWT Bearer token

## Request
```
Content-Type: multipart/form-data
Field name: avatar
File types: PNG, JPG, JPEG
Max size: 5 MB
```

## cURL Example
```bash
curl -X POST http://localhost:5000/api/profile/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@/path/to/image.png"
```

## Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "avatar": "/uploads/avatar-123456789.png",
    ...
  }
}
```

## Error Responses

| Status | Code | Message |
|--------|------|---------|
| 400 | FILE_REQUIRED | No file uploaded |
| 400 | FILE_UPLOAD_ERROR | Invalid file type |
| 400 | FILE_UPLOAD_ERROR | File size exceeds 5 MB |
| 401 | AUTHENTICATION_ERROR | Authentication required |
| 404 | NOT_FOUND | User not found |

## Frontend Integration
```typescript
const formData = new FormData();
formData.append('avatar', file);

const response = await fetch('/api/profile/avatar', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData,
});
```

## Files Modified
- `backend/src/controllers/profile.controller.ts`
- `backend/src/services/profile.service.ts`
- `backend/src/routes/profile.routes.ts`

## Status
✅ COMPLETE - Ready for use
