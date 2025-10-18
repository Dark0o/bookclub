import { prisma } from "../prisma";

export type UserPublicData = {
  id: number;
  email: string;
  username: string;
  name: string | null;
  createdAt: Date;
};

/**
 * Get user by ID (without password)
 */
export async function getUserById(
  userId: number
): Promise<UserPublicData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Get user by email (with password for authentication)
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Get user by username (with password for authentication)
 */
export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
  });
}

/**
 * Check if user exists by email or username
 */
export async function userExists(email: string, username: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  return !!user;
}

/**
 * Create a new user
 */
export async function createUser(data: {
  email: string;
  username: string;
  password: string;
  name?: string | null;
}) {
  return await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: data.password,
      name: data.name || null,
    },
  });
}
