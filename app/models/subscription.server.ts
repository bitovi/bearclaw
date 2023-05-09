import type { Subscription } from "@prisma/client";
import { prisma } from "~/db.server";
import { SubscriptionStatus } from "./subscriptionTypes";

export type { Subscription } from "@prisma/client";

export async function createSubscription(subscriptionFields: Subscription) {
  const newSubscription = await prisma.subscription.create({
    data: {
      ...subscriptionFields,
    },
  });

  return newSubscription;
}

export async function retrieveSubscription(id: string) {
  const subscription = await prisma.subscription.findUnique({ where: { id } });

  return subscription;
}

export async function retrieveSubscriptionByOrgId(id: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId: id },
  });
  return subscription;
}

export async function retrieveSubscriptionByAccountId(
  paymentAccountId: string
) {
  const subscription = await prisma.subscription.findFirst({
    where: { organization: { paymentAccountId } },
  });

  return subscription;
}

export async function updateSubscriptionStatus(
  id: string,
  activeStatus: SubscriptionStatus
) {
  const updatedSubscription = await prisma.subscription.update({
    where: { id },
    data: {
      activeStatus,
    },
  });
  return updatedSubscription;
}

export async function deleteSubscription(id: string) {
  const foundSub = await prisma.subscription.findUnique({ where: { id } });
  if (foundSub) {
    await prisma.subscription.delete({ where: { id } });
  }
}
