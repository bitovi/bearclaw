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
