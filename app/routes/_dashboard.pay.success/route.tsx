import type { ActionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { retrievePaymentIntent } from "~/payment.server";

export const loader = async ({ request }: ActionArgs) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("payment_intent");
  return id ? await retrievePaymentIntent(id) : null;
};

export default function Status() {
  const paymentIntent = useLoaderData<typeof loader>();

  if (paymentIntent?.status === "succeeded") {
    return (
      <>
        <h3>Thank you for your payment!</h3>
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
