import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import {
  PaymentElement,
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

import { getActiveSubscriptions } from "~/services/subscriptions/getActiveSubscriptions";
import { Loading } from "~/components/loading/Loading";

export async function loader({ params, request }: LoaderArgs) {
  const { subscription: priceId } = params;

  if (!priceId) return redirect("/subscriptions");

  const { error, stripeCustomer } = await retrieveStripeCustomer(request);

  if (error) {
    console.error(error);
    redirect("/subscription");
  }

  if (priceId && stripeCustomer) {
    const { subscriptionId, clientSecret, paymentIntentId } =
      await createBusinessSubscription(stripeCustomer.accountId, priceId);
    if (subscriptionId && clientSecret)
      return json({
        clientSecret,
        customerId: stripeCustomer.accountId,
        paymentIntentId,
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      });
  }

  return redirect("/subscriptions");
}

function FormComponent() {
  const { clientSecret, customerId, paymentIntentId } =
    useLoaderData<typeof loader>();
  const [loading, setLoading] = useState(false);
  const [paymentMounted, setPaymentMounted] = useState(false);

  const elements = useElements();
  const stripe = useStripe();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (elements && stripe) {
      try {
        const activeSubscription = await getActiveSubscriptions(customerId);
        if (activeSubscription)
          throw new Error("User already has an active subscription");

        const { error: submitError } = await elements.submit();
        if (submitError) {
          throw new Error(submitError.message);
        }

        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/pay/success?payment_intent=${paymentIntentId}`,
          },
        });
        if (error) throw new Error(error.message);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    }
  };

  return (
    <div className="mx-auto w-6/12 flex-row justify-center ">
      {paymentMounted && <h1 className="pb-4 text-center">Subscribe</h1>}
      <Form onSubmit={handleSubmit}>
        <PaymentElement
          onReady={() => setPaymentMounted(true)}
          options={{ layout: "accordion" }}
          className={"py-3"}
        />
        {paymentMounted && (
          <Button
            type="submit"
            name="submit-payment"
            className="m-auto"
            disabled={loading}
          >
            {loading ? <Loading color={"#ffffff"} /> : "Subscribe"}
          </Button>
        )}
      </Form>
    </div>
  );
}

export default function Index() {
  const { clientSecret, STRIPE_PUBLIC_KEY } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!STRIPE_PUBLIC_KEY) {
    console.error("No provided Stripe Public Key Provided");
    return navigate("/subscriptions");
  }
  const clientStripePromise = loadStripe(STRIPE_PUBLIC_KEY);

  return (
    <Elements stripe={clientStripePromise} options={{ clientSecret }}>
      <FormComponent />
    </Elements>
  );
}
