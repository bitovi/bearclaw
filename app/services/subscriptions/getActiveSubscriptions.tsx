import type Stripe from "stripe";

/**
 *
 * Service to retrieve active Stripe subscriptions associated with a particular user
 */
export const getActiveSubscriptions = async (
  customerId: string | undefined
): Promise<Stripe.Subscription | undefined> => {
  const result = await fetch(`/api/user/${customerId}/subscription`);

  const { data } = await result.json();

  return data;
};
