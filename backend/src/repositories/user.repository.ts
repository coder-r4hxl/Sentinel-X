import { prisma } from "../lib/prisma.js";

export type CreateGoogleUserInput = {
  name: string;
  email: string;
  googleId: string;
  avatarUrl: string | null;
};

export async function findUserByGoogleId(googleId: string) {
  return prisma.user.findUnique({ where: { googleId } });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createGoogleUser(input: CreateGoogleUserInput) {
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      googleId: input.googleId,
      avatarUrl: input.avatarUrl,
    },
  });
}
