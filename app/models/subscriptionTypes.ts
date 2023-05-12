import type Stripe from "stripe";

export type { Subscription } from "@prisma/client";

// Possible Stripe subscription statuses
// https://stripe.com/docs/api/subscriptions/object#subscription_object-status
export enum SubscriptionStatus {
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",
  TRIALING = "trialing",
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
  UNPAID = "unpaid",
}

export interface InvoicePreview {
  upcomingToBeBilled: number;
  periodEnd?: number; // Unix timestamp
  prorationDate?: number | undefined; // Unix timestamp
  dueDate?: number | null; // Unix timestamp
}

// Expanded______ types, as Stripe interfaces don't seem capable of detecting use of the "expand" parameter in their query operations.
export type ExpandedPrice = Omit<Stripe.Price, "product"> & {
  product: Stripe.Product;
};

export type ExpandedInvoice = Omit<Stripe.Invoice, "payment_intent"> & {
  payment_intent: Stripe.PaymentIntent;
};

export type ExpandedSubscription_Invoice = Omit<
  Stripe.Subscription,
  "latest_invoice"
> & {
  latest_invoice: ExpandedInvoice;
};

export type InvoiceHistoryItem = {
  Invoice_ID: string;
  Date: string;
  Invoice_amount: string;
};
