import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/services/user.service";
import { generateVerificationToken } from "@/lib/services/token.service";
import { sendPasswordResetEmail } from "@/lib/services/email.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const user = await getUserByEmail(email);

    // Always return success to prevent email enumeration
    // Only send email if user exists
    if (user) {
      try {
        // Generate password reset token
        const token = await generateVerificationToken(
          user.id,
          "PASSWORD_RESET"
        );

        // Send password reset email
        await sendPasswordResetEmail(user.email, token);
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        // Still return success to user, but log the error
      }
    }

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, we've sent a password reset link.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
