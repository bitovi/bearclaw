import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { checkForPreExistingSubscription } from "~/payment.server";

export async function loader({ params }: LoaderArgs) {
  const { id: customerId } = params;

  if (!customerId) {
    return json({ error: "No customerId provided" }, { status: 400 });
  }

  try {
    const activeSubscription = await checkForPreExistingSubscription(
      customerId
    );

    return json({ data: activeSubscription });
  } catch (e) {
    return json({ error: JSON.stringify(e) }, { status: 404 });
  }
}
