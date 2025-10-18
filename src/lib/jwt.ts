import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Convert secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

// Generate JWT token (Edge Runtime compatible)
export async function generateToken(userId: number): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRES_IN)
    .setIssuedAt()
    .sign(secret);

  return token;
}

// Verify JWT token (Edge Runtime compatible - no Prisma)
export async function verifyToken(
  token: string
): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.userId as number };
  } catch (error) {
    console.error(
      "❌ JWT verification failed:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
