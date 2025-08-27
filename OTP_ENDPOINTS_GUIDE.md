# OTP Verification Endpoints Documentation

## Two Different OTP Verification Flows

This application has **two separate OTP verification endpoints** for different purposes:

### 1. Login/Signup OTP Verification
**Endpoint**: `/auth/email/verify-otp`  
**Purpose**: Verify OTP during login or signup process  
**Authentication**: Not required (user is not logged in yet)  
**Used in**: Login flow, registration flow  
**Hook**: [useOTPVerification](src/hooks/useOTPVerification.ts)  

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**: 
```json
{
  "status": "success",
  "data": {
    "user": { ... },
    "token": "jwt-token-here"
  }
}
```

### 2. Profile Email Verification
**Endpoint**: `/auth/verify-email`  
**Purpose**: Verify email changes in user profile settings  
**Authentication**: Required (user must be logged in)  
**Used in**: Profile settings, email change flow  
**Hook**: [useEmailVerification](src/hooks/useEmailVerification.ts)  

**Request Body**:
```json
{
  "otp": "123456"
}
```

**Headers**:
```
Authorization: Bearer jwt-token
```

## Important Notes

- **DO NOT** mix these endpoints
- The login OTP endpoint (`/auth/email/verify-otp`) should never require authentication
- The profile verification endpoint (`/auth/verify-email`) always requires authentication
- Each endpoint has different request/response structures
- Different hooks are used for different purposes

## Error Prevention

To avoid 401 Unauthorized errors:
1. Use `/auth/email/verify-otp` for login flow (no auth header)
2. Use `/auth/verify-email` for profile settings (with auth header)
3. Check which flow you're implementing before choosing the endpoint

## Related Files

### Login OTP Flow:
- [src/hooks/useOTPVerification.ts](src/hooks/useOTPVerification.ts)
- [src/components/organisms/auth/login/email/LoginOTP.tsx](src/components/organisms/auth/login/email/LoginOTP.tsx)
- [src/services/authService.ts](src/services/authService.ts) (verifyEmailOTP method)

### Profile Email Verification Flow:
- [src/hooks/useEmailVerification.ts](src/hooks/useEmailVerification.ts)
- [src/services/authService.ts](src/services/authService.ts) (verifyEmail method)
- Profile settings components