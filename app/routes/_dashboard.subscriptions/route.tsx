import { Await, useLoaderData } from "@remix-run/react";
import { defer } from "@remix-run/node";
import { subscriptionOptionLookup } from "~/payment.server";
import type { ExpandedPrice } from "~/payment.server";
import { Suspense } from "react";
import { Link } from "~/components/link";
import { retrieveOrganizationSubscription } from "~/account.server";
import SubscriptionInformation from "./subscriptionInformation";

export async function loader({ request }: { request: Request }) {
  const optionResults = subscriptionOptionLookup();
  const organizationSubscription = retrieveOrganizationSubscription(request);
  return defer({
    optionResults,
    organizationSubscription,
  });
}

const Option = ({ opt }: { opt: ExpandedPrice }) => {
  return (
    <div className="flex w-fit">
      <Link to={`/form/${opt.id}`} key={opt.id}>
        {opt.product.name}
      </Link>
    </div>
  );
};

export default function Route() {
  const { optionResults, organizationSubscription } =
    useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-center">Current Plan Information</h1>
      <Suspense fallback={<div>LOADING PLAN INFORMATION... </div>}>
        <Await resolve={organizationSubscription}>
          {(organizationSubscription) => {
            if (!organizationSubscription)
              return <div>No plan information to display</div>;
            return (
              <SubscriptionInformation
                subscription={organizationSubscription}
              />
            );
          }}
        </Await>
      </Suspense>
      <br />
      <Suspense fallback={<div>LOADING SUBSCRIPTION TIERS... </div>}>
        <Await resolve={optionResults}>
          {(optionResults) => {
            const { error, subscriptionOptions } = optionResults;
            if (error) return <div>{error}</div>;
            return (
              <div className="flex w-full justify-evenly">
                {subscriptionOptions?.map((opt) => {
                  return <Option key={opt.id} opt={opt} />;
                })}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
