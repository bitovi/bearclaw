import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { setupSubscription } from "~/payment.server";

export const loader = async ({ request }: ActionArgs) => {
  const url = new URL(request.url);
  const paymentIntentId = url.searchParams.get("payment_intent");
  const priceId = url.searchParams.get("planId");
  if (!priceId || !paymentIntentId) {
    redirect("/subscription/overview");
  }
  try {
    await setupSubscription(request);
    return redirect("/subscription/overview");
  } catch (e) {
    return redirect(`/subscription/plan?subscription=${priceId}&error=true`);
  }
};
