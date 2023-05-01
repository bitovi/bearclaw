import { Form, useLoaderData } from "@remix-run/react";

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
  retrieveStripeCustomerId,
  validateCredentials,
} from "~/payment.server";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "~/components/button";
import { useState } from "react";

import { getActiveSubscriptions } from "~/services/subscriptions/getActiveSubscriptions";
import { Loading } from "~/components/loading/Loading";

export async function loader({ params, request }: LoaderArgs) {
  const { subscription: priceId } = params;
  if (!priceId) {
    console.error("No subscription Price ID found");
    return redirect("/subscriptions");
  }
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    console.error("No Stripe Publishable Key found");
    return redirect("/subscriptions");
  }

  const { error: validateError, organization } = await validateCredentials(
    request
  );
  if (validateError || !organization) {
    return json(
      {
        error: validateError,
      },
      { status: 400 }
    );
  }

  const { error: stripeError, paymentAccountId } =
    await retrieveStripeCustomerId(organization);
  if (stripeError) {
    return json(
      {
        error: stripeError,
      },
      { status: 400 }
    );
  }

  if (priceId && paymentAccountId) {
    const { subscriptionId, clientSecret, paymentIntentId } =
      await createBusinessSubscription(paymentAccountId, priceId);

    if (subscriptionId && clientSecret)
      return json({
        subscriptionId,
        clientSecret,
        paymentAccountId,
        paymentIntentId,
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      });
  }

  return redirect("/subscriptions");
}

function FormComponent() {
  const data = useLoaderData<typeof loader>();

  const [loading, setLoading] = useState(false);
  const [paymentMounted, setPaymentMounted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const elements = useElements();
  const stripe = useStripe();

  if ("error" in data) {
    return null;
  }
  const { paymentAccountId, clientSecret, paymentIntentId, subscriptionId } =
    data;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionError("");
    if (elements && stripe && paymentAccountId) {
      try {
        const activeSubscription = await getActiveSubscriptions(
          paymentAccountId
        );
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
            return_url: `${window.location.origin}/pay/success?subscription_id=${subscriptionId}&payment_intent=${paymentIntentId}`,
          },
        });
        if (error) throw new Error(error.message);
      } catch (e) {
        console.error(e);
        const error =
          typeof e === "string"
            ? e
            : typeof (e as Error).message === "string"
            ? (e as Error).message
            : "An error occured processing the Subscription payment";
        setSubmissionError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mx-auto w-6/12 flex-row justify-center ">
      {paymentMounted && <h1 className="pb-4 text-center">Subscribe</h1>}
      {submissionError && <div>{submissionError}</div>}
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
  const data = useLoaderData<typeof loader>();

  if ("error" in data) {
    return <div>{data.error}</div>;
  }
  const clientStripePromise = loadStripe(data.STRIPE_PUBLIC_KEY);

  return (
    <Elements
      stripe={clientStripePromise}
      options={{ clientSecret: data.clientSecret }}
    >
      <FormComponent />
    </Elements>
  );
}
