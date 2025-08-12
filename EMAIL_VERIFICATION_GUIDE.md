# Email Verification Guide - Wallet Users

## ✅ **Problem Solved**

You were using the wrong endpoint! For wallet users updating their email from temp to real email, you need to use the **email verification endpoint**, not the login endpoint.

## 🔍 **The Issue**

- **Wrong Endpoint**: `/api/auth/email/verify-otp` (for login)
- **Correct Endpoint**: `/api/auth/verify-email` (for email verification)

## 🛠️ **Correct Flow for Wallet Users**

### **Step 1: Send Verification Code**
```bash
POST /api/auth/email/send-verification
Authorization: Bearer YOUR_JWT_TOKEN
```

This sends an OTP to your **current email** (even if it's a temp email).

### **Step 2: Verify New Email**
```bash
POST /api/auth/verify-email
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "otp": "021095",
  "email": "asraful@tutors.fi"
}
```

**Key Parameters:**
- `otp`: The verification code you received
- `email`: The **new email** you want to update to (optional)

## 🎯 **How It Works**

### **Enhanced Email Verification Logic:**

#### **Case 1: Verify Current Email**
```bash
POST /api/auth/verify-email
{
  "otp": "123456"
  // No email parameter = verify current email
}
```

#### **Case 2: Update to New Email**
```bash
POST /api/auth/verify-email
{
  "otp": "123456",
  "email": "new@example.com"
}
```

### **What Happens:**
1. ✅ **Validates OTP** against the verification code sent
2. ✅ **Checks for conflicts** (if updating to new email)
3. ✅ **Updates email** (if new email provided)
4. ✅ **Sets verified status** to true
5. ✅ **Returns updated JWT** with new user data

## 🔄 **Complete Wallet User Email Update Flow**

### **Scenario**: Wallet user with `@wallet.temp` email wants real email

#### **Step 1: Send Verification to Current Email**
```bash
POST /api/auth/email/send-verification
Authorization: Bearer YOUR_WALLET_JWT_TOKEN
```

#### **Step 2: Verify and Update to New Email**
```bash
POST /api/auth/verify-email
Authorization: Bearer YOUR_WALLET_JWT_TOKEN
{
  "otp": "021095",
  "email": "asraful@tutors.fi"
}
```

#### **Expected Result:**
```json
{
  "status": "success",
  "message": "Email verified successfully",
  "data": {
    "token": "NEW_JWT_TOKEN",
    "user": {
      "id": "your_wallet_user_id",
      "email": "asraful@tutors.fi",        // ✅ Updated!
      "wallet_address": "0x...",
      "isVerified": true,                  // ✅ Verified!
      "settingsUpdatedAt": "2025-08-12T..."
    }
  }
}
```

## 🚨 **Error Handling**

### **Invalid OTP:**
```json
{
  "status": "fail",
  "message": "Invalid verification code",
  "statusCode": 400
}
```

### **Expired OTP:**
```json
{
  "status": "fail", 
  "message": "Verification code has expired or is invalid",
  "statusCode": 400
}
```

### **Email Already Taken:**
```json
{
  "status": "fail",
  "message": "This email address is already in use by another account",
  "statusCode": 400
}
```

## 📋 **Endpoint Summary**

| Purpose | Endpoint | Auth | Parameters |
|---------|----------|------|------------|
| **Login with OTP** | `POST /api/auth/email/verify-otp` | Public | `email`, `otp` |
| **Verify Email** | `POST /api/auth/verify-email` | Private | `otp`, `email?` |
| **Send Verification** | `POST /api/auth/email/send-verification` | Private | None |

## 🎯 **Key Differences**

### **Login OTP** (`/api/auth/email/verify-otp`)
- ✅ **Purpose**: Login to existing account
- ✅ **Auth**: Public (no JWT required)
- ✅ **Requires**: Account must exist with that email
- ❌ **Cannot**: Update email addresses

### **Email Verification** (`/api/auth/verify-email`)
- ✅ **Purpose**: Verify/update email for current user
- ✅ **Auth**: Private (JWT required)
- ✅ **Can**: Update to new email address
- ✅ **Perfect for**: Wallet users updating from temp emails

## 🎉 **Your Solution**

For your wallet account with temp email:

1. **Use**: `/api/auth/verify-email` endpoint
2. **Include**: Both `otp` and `email` parameters
3. **Result**: Your wallet account gets updated with the real email
4. **Benefit**: No duplicate accounts, clean email update

This is the proper way to update email addresses for authenticated users! 🚀
