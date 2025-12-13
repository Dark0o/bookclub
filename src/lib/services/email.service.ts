import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Send email verification email
 * @param email - The recipient email
 * @param token - The verification token
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  console.log("📧 Attempting to send verification email to:", email);
  console.log("🔑 RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
  console.log("🌐 BASE_URL:", BASE_URL);

  const verificationUrl = `${BASE_URL}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px 0; }
          .button { 
            display: inline-block; 
            background: #007bff; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
          }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to BookClub!</h1>
          </div>
          <div class="content">
            <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
              ${verificationUrl}
            </p>
            <p><strong>This link will expire in 24 hours.</strong></p>
          </div>
          <div class="footer">
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Test domain - change when you have verified domain
      to: [email],
      subject: "Verify Your Email Address",
      html,
    });
    console.log("✅ Verification email sent successfully:", result);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    throw error;
  }
}

/**
 * Send password reset email
 * @param email - The recipient email
 * @param token - The reset token
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  console.log("📧 Attempting to send password reset email to:", email);

  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px 0; }
          .button { 
            display: inline-block; 
            background: #dc3545; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
          }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from BookClub.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Test domain - change when you have verified domain
      to: [email],
      subject: "Reset Your Password",
      html,
    });
    console.log("✅ Password reset email sent successfully:", result);
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    throw error;
  }
}
