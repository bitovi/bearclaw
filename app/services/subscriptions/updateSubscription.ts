import type { InvoicePreview, Subscription } from "~/models/subscriptionTypes";

/**
 *
 * Service to preview Stripe subscription update invoice via proration
 */
export const previewSubscriptionUpdate = async (
  subscriptionId: string | undefined,
  priceId: string | undefined
): Promise<{ data: InvoicePreview } | { error: any }> => {
  const result = await fetch(
    `/api/subscription/${subscriptionId}/update?priceId=${priceId}`
  );

  const data = await result.json();

  return data;
};

/**
 *
 * Service to update Stripe subscription immediately via proration
 */
export const updateActiveSubscription = async (
  subId: string | undefined,
  planId: string,
  invoiceTimeStamp?: number
): Promise<Subscription> => {
  const result = await fetch(
    `/api/subscription/${subId}/update?priceId=${planId}&proration_date=${invoiceTimeStamp}`,
    { method: "POST" }
  );

  const data = await result.json();

  return data;
};
