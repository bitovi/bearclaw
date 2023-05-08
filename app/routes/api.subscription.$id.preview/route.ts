import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { previewSubscription } from "~/payment.server";
import { getOrgId } from "~/session.server";

export async function loader({ params, request }: LoaderArgs) {
  const { id: subscriptionId } = params;

  const url = new URL(request.url);
  const priceId = url.searchParams.get("priceId");

  const organizationId = await getOrgId(request);

  if (!subscriptionId) {
    return json({ error: "No subscriptionId provided" }, { status: 400 });
  }
  if (!priceId) {
    return json({ error: "No priceId provided" }, { status: 400 });
  }
  if (!organizationId) {
    return json({ error: "No orgId found" }, { status: 400 });
  }

  try {
    const previewSubscriptionResult = await previewSubscription({
      subscriptionId,
      priceId,
      organizationId,
    });
    if (null) {
      return json(
        { error: "No organization found to pull Stripe customer ID" },
        { status: 400 }
      );
    }
    return json({ data: previewSubscriptionResult });
  } catch (e) {
    return json({ error: JSON.stringify(e) }, { status: 404 });
  }
}
