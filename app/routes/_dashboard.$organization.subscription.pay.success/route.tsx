import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { setupSubscription } from "~/payment.server";
import { getOrgandUserId } from "~/session.server";

export const loader = async ({ request }: ActionArgs) => {
  const { organizationId } = await getOrgandUserId(request);

  const url = new URL(request.url);
  const paymentIntentId = url.searchParams.get("payment_intent");
  const priceId = url.searchParams.get("planId");
  if (!priceId || !paymentIntentId) {
    return redirect(`/${organizationId}/subscription/overview`);
  }
  try {
    await setupSubscription(request);
    return redirect(`/${organizationId}/subscription/overview`);
  } catch (e) {
    return redirect(
      `${organizationId}/subscription/plan?subscription=${priceId}&error=true`
    );
  }
};
