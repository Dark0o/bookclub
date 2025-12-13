# Email Verification & Password Reset Setup

This guide walks you through the email verification and password reset features that have been implemented.

## 🎯 What's Been Added

### Database Changes

- ✅ Added `emailVerified` field to User model (default: false for new users)
- ✅ Added `VerificationToken` model for email verification and password reset tokens
- ✅ Existing users grandfathered as verified (emailVerified: true)

### Backend Services

- ✅ `token.service.ts` - Token generation, validation, and expiry management
- ✅ `email.service.ts` - Resend integration with email templates

### API Routes

- ✅ `/api/auth/verify-email` - Email verification handler
- ✅ `/api/auth/forgot-password` - Password reset request
- ✅ `/api/auth/reset-password` - Password reset handler
- ✅ Updated `/api/auth/register` - Sends verification email after signup
- ✅ Updated `/api/auth/login` - Blocks unverified users

### Frontend

- ✅ `ForgotPasswordForm.tsx` - Forgot password form component
- ✅ `ResetPasswordForm.tsx` - Reset password form component
- ✅ `/verify-email` page - Email verification page
- ✅ `/forgot-password` page - Forgot password page
- ✅ `/reset-password` page - Reset password page
- ✅ Updated `LoginForm.tsx` - Added "Forgot password?" link

## 📋 Setup Instructions

### 1. Install Dependencies

```bash
npm install resend
```

### 2. Update Prisma Schema

The schema has been updated. Run the migration:

```bash
npx prisma migrate dev --name change_email_verified_default_to_false
```

This will:

- Add `emailVerified` column to User table
- Create `VerificationToken` table
- Set existing users to `emailVerified: true`

### 3. Set Up Resend

1. Go to [https://resend.com](https://resend.com) and create an account
2. Verify your domain (or use their test domain for development)
3. Get your API key from [https://resend.com/api-keys](https://resend.com/api-keys)

### 4. Environment Variables

Add these to your `.env` file:

```env
# Resend Email Service
RESEND_API_KEY="re_your_api_key_here"

# Base URL for email links
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Important Notes:**

- The `from` address in `email.service.ts` is set to `BookClub <noreply@bookclub.com>`
- You'll need to update this to match your verified domain in Resend
- For development, Resend provides a test domain you can use

### 5. Update Email Sender Address

Edit `/src/lib/services/email.service.ts` and update the `from` field:

```typescript
// Line 36 and Line 93
from: "BookClub <noreply@yourdomain.com>", // Update with your verified domain
```

## 🚀 How It Works

### User Registration Flow

1. User signs up → Account created with `emailVerified: false`
2. Verification email sent with 24-hour token
3. User clicks link in email → Redirected to `/verify-email?token=...`
4. Token validated → `emailVerified` set to `true`
5. User can now log in

### Password Reset Flow

1. User clicks "Forgot password?" → Goes to `/forgot-password`
2. Enters email → Reset email sent with 1-hour token
3. User clicks link → Goes to `/reset-password?token=...`
4. Enters new password → Password updated, token marked as used
5. Redirected to login

### Security Features

- ✅ Tokens stored in database (can be revoked)
- ✅ One-time use (marked as used after consumption)
- ✅ Expiry times (24h for verification, 1h for reset)
- ✅ Email enumeration prevention (always returns success)
- ✅ Old tokens automatically deleted when generating new ones

## 🧪 Testing

### Test Email Verification

1. Register a new account
2. Check your email for verification link
3. Click link → Should redirect to login with success message
4. Try logging in → Should work

### Test Password Reset

1. Go to `/forgot-password`
2. Enter your email
3. Check email for reset link
4. Click link and enter new password
5. Login with new password

### Test Blocked Login

1. Register a new account
2. DON'T verify email
3. Try to login → Should see "Please verify your email before logging in"

## 📝 Token Expiry Times

You can adjust these in `/src/lib/services/token.service.ts`:

```typescript
// Line 17
const expiryHours = type === "EMAIL_VERIFICATION" ? 24 : 1;
```

## 🔧 Customization

### Email Templates

Edit `/src/lib/services/email.service.ts` to customize:

- Email subject lines
- HTML templates
- Styling
- Button text

### Token Length

Edit `/src/lib/services/token.service.ts`, line 14:

```typescript
const token = randomBytes(32).toString("hex"); // 32 bytes = 64 hex chars
```

## 🐛 Troubleshooting

### Emails not sending

- Check `RESEND_API_KEY` is set correctly
- Verify your domain in Resend dashboard
- Check console logs for errors
- Ensure `from` address matches verified domain

### Token invalid/expired errors

- Check token expiry times
- Ensure database has correct timezone settings
- Check if token was already used

### Migration issues

- Run `npx prisma generate` after migration
- Restart your dev server
- Check database connection

## 📚 Files Modified/Created

### Database

- `prisma/schema.prisma` - Added emailVerified and VerificationToken model

### Services

- `src/lib/services/token.service.ts` - NEW
- `src/lib/services/email.service.ts` - NEW

### API Routes

- `src/app/api/auth/verify-email/route.ts` - NEW
- `src/app/api/auth/forgot-password/route.ts` - NEW
- `src/app/api/auth/reset-password/route.ts` - NEW
- `src/app/api/auth/register/route.ts` - MODIFIED
- `src/app/api/auth/login/route.ts` - MODIFIED

### Components

- `src/components/auth/ForgotPasswordForm.tsx` - NEW
- `src/components/auth/ResetPasswordForm.tsx` - NEW
- `src/components/auth/LoginForm.tsx` - MODIFIED (added forgot password link)

### Pages

- `src/app/verify-email/page.tsx` - NEW
- `src/app/forgot-password/page.tsx` - NEW
- `src/app/reset-password/page.tsx` - NEW

## 🎉 You're Done!

The email verification and password reset features are now fully implemented. Make sure to:

1. ✅ Run the migration
2. ✅ Install Resend package
3. ✅ Set up environment variables
4. ✅ Update email sender address
5. ✅ Test the flows

Questions? Check the code comments or review the implementation in the files listed above.
