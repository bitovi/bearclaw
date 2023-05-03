import { SubscriptionInformation } from "./subscriptionInformation";
import { Await, useMatches } from "@remix-run/react";
import { Suspense } from "react";
import type { Subscription } from "~/models/subscriptionTypes";
import type { ExpandedPrice } from "~/payment.server";

export default function Route() {
  const { organizationSubscription } = useMatches().find(
    (root) => root.pathname === "/subscription"
  )?.data as {
    optionResults: {
      subscriptionOptions: ExpandedPrice[] | undefined;
      error: string | undefined;
    };
    organizationSubscription: Subscription | null;
  };
  return (
    <Suspense fallback={<div>LOADING PLAN INFORMATION... </div>}>
      <Await resolve={organizationSubscription}>
        {(organizationSubscription) => {
          return (
            <SubscriptionInformation
              subscription={organizationSubscription || undefined}
            />
          );
        }}
      </Await>
    </Suspense>
  );
}
