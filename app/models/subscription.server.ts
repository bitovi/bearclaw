import type { Subscription } from "@prisma/client";
import { prisma } from "~/db.server";

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
