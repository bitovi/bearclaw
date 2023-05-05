import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { retrievePaymentIntent, setupSubscription } from "~/payment.server";

export const loader = async ({ request }: ActionArgs) => {
  const subscription = await setupSubscription(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("payment_intent");
  const paymentIntent = id ? await retrievePaymentIntent(id) : null;

  return json({ paymentIntent, subscription });
};

export default function Status() {
  const { paymentIntent, subscription } = useLoaderData<typeof loader>();

  if (paymentIntent?.status === "succeeded") {
    return (
      <>
        <h3>
          Thank you for your payment! Your subscription status is{" "}
          {subscription.activeStatus}
        </h3>
        <pre>{JSON.stringify(paymentIntent, null, 2)}</pre>
      </>
    );
  }
  return (
    <>
      <h3>Thank you for your payment! It is {paymentIntent?.status}</h3>
      <pre>{JSON.stringify(paymentIntent, null, 2)}</pre>
    </>
  );
}
