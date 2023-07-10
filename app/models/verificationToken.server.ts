import { prisma } from "~/db.server";
import type { User } from "@prisma/client";
import { sendEmailVerificationEmail } from "./user.server";
import { createSixCharacterCode } from "~/utils";

export async function createVerificationToken(userId: string) {
  const token = createSixCharacterCode();
  return await prisma.verificationToken.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    update: {
      token,
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
    token: verificationToken.token,
    redirectTo,
  });
}

export async function retrieveVerificationToken(
  userId: string,
  tokenCode: string
) {
  const token = await prisma.verificationToken.findFirst({
    where: {
      userId,
      token: tokenCode,
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
