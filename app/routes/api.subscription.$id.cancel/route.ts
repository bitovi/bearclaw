import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { prisma } from "~/db.server";
import { cancelSubscription } from "~/payment.server";

export async function action({ params }: ActionArgs) {
  const { id: subscriptionId } = params;

  if (!subscriptionId) {
    return json({ error: "No customerId provided" }, { status: 400 });
  }

  try {
    const cancelledSubscription = await cancelSubscription(subscriptionId);

    // update the cancellation date on our Subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: cancelledSubscription.id },
      data: {
        cancellationDate: cancelledSubscription.cancel_at,
      },
    });
    return json({ data: updatedSubscription });
  } catch (e) {
    return json({ error: "Subscription not found" }, { status: 404 });
  }
}
