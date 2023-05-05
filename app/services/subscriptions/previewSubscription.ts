import type { InvoicePreview } from "~/models/subscriptionTypes";

/**
 *
 * Service to preview Stripe subscription update invoice via proration
 */
export const previewSubscriptionUpdate = async (
  subscriptionId: string | undefined,
  priceId: string | undefined
): Promise<{ data?: InvoicePreview; error?: any }> => {
  const result = await fetch(
    `/api/subscription/${subscriptionId}/preview?priceId=${priceId}`
  );

  const data = await result.json();

  return data;
};
