import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export type VerificationTokenType = "EMAIL_VERIFICATION" | "PASSWORD_RESET";

/**
 * Generate a verification token and save it to the database
 * @param userId - The user ID
 * @param type - The type of token (EMAIL_VERIFICATION or PASSWORD_RESET)
 * @returns The generated token string
 */
export async function generateVerificationToken(
  userId: number,
  type: VerificationTokenType
): Promise<string> {
  // Generate a random 32-byte token
  const token = randomBytes(32).toString("hex");

  // Set expiry time based on token type
  const expiryHours = type === "EMAIL_VERIFICATION" ? 24 : 1; // 24h for verification, 1h for reset
  const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  // Clean up any existing tokens of the same type for this user
  await deleteUserTokens(userId, type);

  // Save the new token
  await prisma.verificationToken.create({
    data: {
      token,
      type,
      userId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Verify a token and return the user ID if valid
 * @param token - The token to verify
 * @param type - The expected token type
 * @returns The user ID if token is valid, null otherwise
 */
export async function verifyToken(
  token: string,
  type: VerificationTokenType
): Promise<number | null> {
  const tokenRecord = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!tokenRecord) {
    return null;
  }

  // Check if token is expired
  if (tokenRecord.expiresAt < new Date()) {
    return null;
  }

  // Check if token is already used
  if (tokenRecord.used) {
    return null;
  }

  // Check if token type matches
  if (tokenRecord.type !== type) {
    return null;
  }

  return tokenRecord.userId;
}

/**
 * Mark a token as used
 * @param token - The token to mark as used
 */
export async function markTokenAsUsed(token: string): Promise<void> {
  await prisma.verificationToken.update({
    where: { token },
    data: { used: true },
  });
}

/**
 * Delete all tokens of a specific type for a user
 * @param userId - The user ID
 * @param type - The token type to delete
 */
export async function deleteUserTokens(
  userId: number,
  type: VerificationTokenType
): Promise<void> {
  await prisma.verificationToken.deleteMany({
    where: {
      userId,
      type,
    },
  });
}

/**
 * Clean up expired tokens (utility function for maintenance)
 */
export async function cleanupExpiredTokens(): Promise<void> {
  await prisma.verificationToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
