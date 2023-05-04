export type { Subscription } from "@prisma/client";

// Possible Stripe subscription statuses
// https://stripe.com/docs/api/subscriptions/object#subscription_object-status
export enum SubscriptionStatus {
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",
  TRIALING = "trialing",
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELED = "canceld",
  UNPAID = "unpaid",
}

export interface InvoicePreview {
  upcomingToBeBilled: number;
  periodEnd: number; // Unix timestamp
  prorationDate: number | undefined; // Unix timestamp
}
