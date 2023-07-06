import { prisma } from "~/db.server";
import type { User } from "@prisma/client";
import { sendEmailVerificationEmail } from "./user.server";

export async function createVerificationToken(userId: string) {
  const numericCode = Math.floor(100000 + Math.random() * 900000);
  return await prisma.verificationToken.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      numericCode,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    update: {
      numericCode,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
}

export async function deleteVerificationToken(id: string) {
  return await prisma.verificationToken.delete({
    where: {
      id,
    },
  });
}

export async function resetVerificationToken(
  user: User,
  redirectTo?: string | null
) {
  const verificationToken = await createVerificationToken(user.id);

  await sendEmailVerificationEmail({
    user,
    verificationToken: verificationToken.numericCode,
    redirectTo,
  });
}

export async function retrieveVerificationToken(
  userId: string,
  numericCode: number
) {
  const token = await prisma.verificationToken.findFirst({
    where: {
      userId,
      numericCode,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  if (!token) {
    return {
      token: false,
      error: "No token found for provided code",
    };
  }

  await deleteVerificationToken(token.id);
  return {
    token: true,
    error: "",
  };
}
