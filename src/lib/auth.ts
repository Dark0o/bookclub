import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getUserById } from "./services/user.service";
import { verifyToken } from "./jwt";

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Get current user from cookie (server-side only)
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return null;
  }

  // Get user from database using service
  return await getUserById(decoded.userId);
}
