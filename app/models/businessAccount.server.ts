import { prisma } from "~/db.server";

export type { BusinessAccount, User } from "@prisma/client";

export async function createPaymentAccount(accountId: string, userId: string) {
  const businessAccount = await prisma.businessAccount.create({
    data: {
      userId,
      accountId,
    },
  });

  return businessAccount;
}

export async function getBusinessAccountByUserId(userId: string) {
  const businessAccount = await prisma.businessAccount.findUnique({
    where: { userId },
  });
  return businessAccount;
}
