# Profile Image API Documentation

## Overview
The profile image functionality allows users to upload and manage their profile images using IPFS storage via Pinata. Images are stored on IPFS and the URLs are saved in the user's profile.

## Database Schema
The user model now includes a `profileImage` field:

```typescript
interface IUser {
  // ... other fields
  profileImage?: string; // IPFS URL for profile image
  // ... other fields
}
```

## API Endpoints

### 1. Upload Profile Image (Recommended)
**Endpoint:** `POST /api/pinata/upload-profile-image`
**Authentication:** Required (Bearer token)
**Content-Type:** `multipart/form-data`

This endpoint uploads an image to IPFS and automatically updates the user's profile.

#### Request
```javascript
const formData = new FormData();
formData.append('image', file); // File object from input

const response = await fetch('/api/pinata/upload-profile-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData
});
```

#### Response
```json
{
  "success": true,
  "url": "https://gateway.pinata.cloud/ipfs/QmHash...",
  "ipfsHash": "QmHash...",
  "originalName": "profile.jpg",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "profileImage": "https://gateway.pinata.cloud/ipfs/QmHash...",
    // ... other user fields
  },
  "message": "Profile image updated successfully"
}
```

### 2. General Image Upload
**Endpoint:** `POST /api/pinata/upload`
**Authentication:** Not required
**Content-Type:** `multipart/form-data`

This endpoint only uploads an image to IPFS without updating the user profile.

#### Request
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('/api/pinata/upload', {
  method: 'POST',
  body: formData
});
```

#### Response
```json
{
  "success": true,
  "url": "https://gateway.pinata.cloud/ipfs/QmHash...",
  "ipfsHash": "QmHash...",
  "originalName": "image.jpg"
}
```

### 3. Update Profile (Including Image)
**Endpoint:** `PATCH /api/auth/profile`
**Authentication:** Required (Bearer token)
**Content-Type:** `application/json`

Update user profile including the profile image URL.

#### Request
```javascript
const response = await fetch('/api/auth/profile', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    profileImage: 'https://gateway.pinata.cloud/ipfs/QmHash...',
    // ... other profile fields
  })
});
```

## Frontend Implementation Examples

### React Component Example
```jsx
import React, { useState } from 'react';

const ProfileImageUpload = ({ user, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/pinata/upload-profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onImageUpdate(data.user);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-image-upload">
      <div className="current-image">
        {user.profileImage ? (
          <img 
            src={user.profileImage} 
            alt="Profile" 
            className="profile-image"
          />
        ) : (
          <div className="placeholder">No image</div>
        )}
      </div>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
        className="file-input"
      />
      
      {uploading && <p>Uploading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};
```

### Two-Step Upload (Upload then Update)
```javascript
// Step 1: Upload image to get URL
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/pinata/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.url;
};

// Step 2: Update profile with image URL
const updateProfile = async (imageUrl) => {
  const response = await fetch('/api/auth/profile', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profileImage: imageUrl,
    }),
  });

  return response.json();
};

// Usage
const handleImageChange = async (file) => {
  try {
    const imageUrl = await uploadImage(file);
    const updatedUser = await updateProfile(imageUrl);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## File Constraints
- **File Types:** Images only (checked by mimetype)
- **File Size:** Maximum 5MB
- **Storage:** IPFS via Pinata
- **URL Format:** `https://gateway.pinata.cloud/ipfs/{hash}`

## Error Handling
Common error responses:

```json
{
  "success": false,
  "error": "No file uploaded"
}

{
  "success": false,
  "error": "Only image files are allowed"
}

{
  "success": false,
  "error": "User not authenticated"
}
```

## Security Notes
- Profile image upload requires authentication
- File type validation on both frontend and backend
- File size limits enforced
- IPFS URLs are validated in the database schema
- Images are stored on IPFS (decentralized, permanent storage)

## Recommended Frontend Flow
1. **Use the combined endpoint** (`/api/pinata/upload-profile-image`) for the best user experience
2. **Show upload progress** and loading states
3. **Validate files** on the frontend before uploading
4. **Handle errors gracefully** with user-friendly messages
5. **Update UI immediately** after successful upload
