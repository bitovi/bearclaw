import { Subscription } from "@prisma/client";

/**
 *
 * Service to cancel active Stripe subscription at end of current period
 */
export const cancelActiveSubscription = async (
  subscriptionId: string | undefined
): Promise<Subscription | undefined> => {
  const result = await fetch(`/api/subscription/${subscriptionId}/cancel`, {
    method: "POST",
  });

  const { data } = await result.json();

  return data;
};
