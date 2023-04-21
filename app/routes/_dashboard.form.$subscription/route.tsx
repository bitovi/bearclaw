import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import {
  CardElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import {
  createBusinessSubscription,
  retrieveStripeCustomer,
} from "~/payment.server";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "~/components/button";
import { useState } from "react";

import { TextInput } from "~/components/input";
import { STRIPE_PUBLISHABLE_KEY_TEST } from "globals";
import { getActiveSubscriptions } from "~/services/subscriptions/getActiveSubscriptions";

const clientStripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY_TEST);

export async function loader({ params, request }: LoaderArgs) {
  const { subscription: priceId } = params;

  if (!priceId) return redirect("/subscriptions");

  const stripeCustomer = await retrieveStripeCustomer(request);

  if (priceId && stripeCustomer) {
    const { subscriptionId, clientSecret } = await createBusinessSubscription(
      stripeCustomer.accountId,
      priceId
    );
    if (subscriptionId && clientSecret)
      return json({ clientSecret, customerId: stripeCustomer.accountId });
  }

  return redirect("/subscriptions");
}

function FormComponent() {
  const { clientSecret, customerId } = useLoaderData<typeof loader>();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const elements = useElements();
  const stripe = useStripe();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (elements && stripe) {
      const cardElement = elements.getElement(CardElement);

      if (cardElement && name) {
        try {
          const activeSubscription = await getActiveSubscriptions(customerId);

          if (activeSubscription)
            throw new Error("User already has an active subscription");

          const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: cardElement,
                billing_details: {
                  name: name,
                },
              },
            }
          );

          if (error) throw new Error(JSON.stringify(error));

          navigate(`/pay/success?payment_intent=${paymentIntent?.id}`);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  return (
    <div className="w-96">
      <h1>Subscribe</h1>
      <Form onSubmit={handleSubmit}>
        <TextInput
          onChange={({ target }) => setName(target.value)}
          name="name"
        />
        <CardElement />
        <Button>Subscribe</Button>
      </Form>
    </div>
  );
}

export default function Index() {
  const { clientSecret } = useLoaderData<typeof loader>();
  return (
    <Elements stripe={clientStripePromise} options={{ clientSecret }}>
      <FormComponent />
    </Elements>
  );
}
