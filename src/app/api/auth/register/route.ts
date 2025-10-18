import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { userExists, createUser } from "@/lib/services/user.service";
import { generateToken } from "@/lib/jwt";

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
    console.log("🔐 Hashing password...");
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

    // generate JWT token
    const token = await generateToken(user.id);

    // create response
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
        },
      },
      { status: 201 }
    );

    // set HTTP-Only cookie
    response.cookies.set("token", token, {
      httpOnly: true, // JavaScript cannot access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
