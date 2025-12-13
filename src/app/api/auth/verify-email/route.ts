import { NextRequest, NextResponse } from "next/server";
import { verifyToken, markTokenAsUsed } from "@/lib/services/token.service";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?error=missing-token", request.url)
      );
    }

    // Verify the token
    const userId = await verifyToken(token, "EMAIL_VERIFICATION");

    if (!userId) {
      return NextResponse.redirect(
        new URL("/login?error=invalid-token", request.url)
      );
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    // Mark token as used
    await markTokenAsUsed(token);

    // Redirect to login with success message
    return NextResponse.redirect(new URL("/login?verified=true", request.url));
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/login?error=verification-failed", request.url)
    );
  }
}
