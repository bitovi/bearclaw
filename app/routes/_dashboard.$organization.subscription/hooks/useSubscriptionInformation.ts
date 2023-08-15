import { useMatches } from "@remix-run/react";
import type {
  ExpandedPrice,
  InvoiceHistoryItem,
  InvoicePreview,
  Subscription,
} from "~/models/subscriptionTypes";

export function useSubscriptionInformation() {
  const results = useMatches().find((root) => {
    return root.id === "routes/_dashboard.$organization.subscription";
  })?.data as {
    optionResults: {
      subscriptionOptions: ExpandedPrice[] | undefined;
      error: string | undefined;
    };
    organizationSubscription: Subscription | null;
    invoicePreview: InvoicePreview | null;
    invoiceHistory: InvoiceHistoryItem[] | null;
  };

  return results;
}
