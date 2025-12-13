import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { userExists, createUser } from "@/lib/services/user.service";
import { generateVerificationToken } from "@/lib/services/token.service";
import { sendVerificationEmail } from "@/lib/services/email.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, username, password, name } = body;

    // validate credentials
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username and password are required" },
        { status: 400 }
      );
    }

    // check if user already exists

    const exists = await userExists(email, username);
    console.log("✅ Existing user check done:", exists);

    if (exists) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // hash password

    const hashedPassword = await hashPassword(password);
    console.log("✅ Password hashed");

    // create user
    console.log("👤 Creating user...");
    const user = await createUser({
      email,
      username,
      password: hashedPassword,
      name: name || null,
    });

    // Generate verification token and send verification email
    try {
      const verificationToken = await generateVerificationToken(
        user.id,
        "EMAIL_VERIFICATION"
      );
      await sendVerificationEmail(user.email, verificationToken);
      console.log("✅ Verification email sent");
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
    }

    // create response
    const response = NextResponse.json(
      {
        message:
          "Registration successful! Please check your email to verify your account.",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
        },
      },
      { status: 201 }
    );

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
