import type { Subscription } from "@prisma/client";

export function SubscriptionInformation({
  subscription,
}: {
  subscription?: Subscription;
}) {
  return (
    <div>
      <h1>Plan Information</h1>
      <br />
      {subscription ? (
        <div className="flex-row">
          <p>Subscription type: {subscription.subscriptionLevel}</p>
          <p>Subscription status: {subscription.active}</p>
        </div>
      ) : (
        <div>No plan information to display</div>
      )}
    </div>
  );
}
