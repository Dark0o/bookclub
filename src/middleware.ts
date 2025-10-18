import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // If no token, redirect to login
  if (!token) {
    console.log("❌ No token found, redirecting to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Verify token
  const decoded = await verifyToken(token);

  if (!decoded) {
    // Invalid token, clear it and redirect
    console.log("❌ Invalid token, redirecting to /");
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("token");
    return response;
  }

  console.log("✅ Token valid for user:", decoded.userId);
  // Token is valid, allow access
  return NextResponse.next();
}

// Specify which routes to protect
export const config = {
  matcher: ["/dashboard/:path*"], // Protects /dashboard and all sub-routes
};
