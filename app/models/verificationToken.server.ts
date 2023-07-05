import { prisma } from "~/db.server";
import dayjs from "dayjs";
import type { User } from "@prisma/client";
import { sendEmailVerificationEmail } from "./user.server";

export async function createVerificationToken(userId: string) {
  const results = await prisma.verificationToken.findMany({
    where: {
      userId,
    },
  });
  if (results.length) {
    await deleteVerificationTokenByUserId(userId);
  }
  const numericCode = Math.floor(100000 + Math.random() * 900000);
  return await prisma.verificationToken.create({
    data: {
      userId,
      numericCode,
      expiresAt: dayjs().add(1, "day").toDate(),
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

export async function deleteVerificationTokenByUserId(userId: string) {
  return await prisma.verificationToken.deleteMany({
    where: {
      userId,
    },
  });
}

export async function resetVerificationToken(
  user: User,
  redirectTo?: string | null
) {
  await deleteVerificationTokenByUserId(user.id);
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
    },
  });
  if (!token) {
    return {
      token: false,
      error: "No token found for provided code",
    };
  }
  if (dayjs().isAfter(token?.expiresAt)) {
    await deleteVerificationToken(token?.id);
    return {
      token: false,
      error: "Verification token has expired. Please request a new one.",
    };
  }
  await deleteVerificationToken(token.id);
  return {
    token: true,
    error: "",
  };
}
