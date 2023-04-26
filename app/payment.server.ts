/**
  Server-side operations for interacting with Stripe API
 */

import Stripe from "stripe";
import { getUser } from "./session.server";
import {
  createPaymentAccount,
  getBusinessAccountByUserId,
  updateBusinessAccountByUserId,
} from "./models/businessAccount.server";
import { isNumber } from "./utils";

require("dotenv").config();

// Expanded______ types, as Stripe interfaces don't seem capable of detecting use of the "expand" parameter in their query operations.
export type ExpandedPrice = Omit<Stripe.Price, "product"> & {
  product: Stripe.Product;
};

type ExpandedInvoice = Omit<Stripe.Invoice, "payment_intent"> & {
  payment_intent: Stripe.PaymentIntent;
};

type ExpandedSubscription = Omit<Stripe.Subscription, "latest_invoice"> & {
  latest_invoice: ExpandedInvoice;
};

// Server-side Stripe instance which manages our queries
export const serverStripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

/** 
Pulls all Price objects associated with the secret key that are active.
* Price object Ids are used to create invoices, also expands each Price's
* "product" field to pull relevant UI information and sorts them by price
*/
export async function subscriptionOptionLookup(): Promise<{
  subscriptionOptions?: ExpandedPrice[];
  error?: string;
}> {
  const { data: results } = (await serverStripe.prices.list({
    active: true,
    expand: ["data.product"],
  })) as { data: ExpandedPrice[] };

  try {
    results.sort((a: ExpandedPrice, b: ExpandedPrice) => {
      if (a.product.metadata.enterprise || b.product.metadata.enterprise)
        return -100000;

      if (!isNumber(a.unit_amount) || !isNumber(b.unit_amount)) {
        throw new Error(
          "Incorrectly configured prices for subscriptions, please refer to the Stripe Prices page on the User Dashboard"
        );
      }

      return a.unit_amount! - b.unit_amount!;
    });

    return { subscriptionOptions: results as ExpandedPrice[] };
  } catch (e) {
    return {
      error: (e as Error).message,
    };
  }
}

// For now, we display the confirmed Payment Intent after a successful order
export async function retrievePaymentIntent(id: string) {
  return await serverStripe.paymentIntents.retrieve(id);
}
/**
 * Operation to find the Stripe customer id - "accountId" - associated with
 * the provided userId in our data tables
 */
export const retrieveBusinessAccount = async (userId: string) => {
  return getBusinessAccountByUserId(userId);
};
/**
 * Creates a new Stripe customer and then creates a businessAccount in our database, associating Stripe customer ID with our own user ID
 */
export const createBusinessAccount = async (
  userId: string,
  email: string,
  name: string
) => {
  const customer = await serverStripe.customers.create({
    email,
    name,
  });

  const businessAccount = createPaymentAccount(customer.id, userId);

  return businessAccount;
};

/**
 * Updates the BusinessAccount for a particular user to point to a new Stripe accountId
 */
export async function updateBusinessAccount({
  id,
  email,
  name,
}: {
  id: string;
  email: string;
  name: string;
}) {
  const customer = await serverStripe.customers.create({
    email,
    name,
  });
  return updateBusinessAccountByUserId(id, customer.id);
}

/**
 * Returns businessAccount after pulling Customer ID from User information in the request object. If no businessAccount is found BUT a user email is found, creates and returns business account. If Stripe account is no longer valid (deleted or non-existent) on found BusinessAccount, creates a new Stripe account and updates BusinessAccount accordingly.
 */
export const retrieveStripeCustomer = async (request: Request) => {
  try {
    const user = await getUser(request);
    if (!user) {
      throw new Error("No user found");
    }

    // lookup businessAccount with user.id
    const businessAccount = user
      ? await retrieveBusinessAccount(user.id)
      : null;

    if (businessAccount) {
      // confirm user account is still active on Stripe
      let stripeAccount;

      try {
        stripeAccount = await serverStripe.customers.retrieve(
          businessAccount.accountId
        );
      } catch (e) {
        // There is no longer a Stripe account associated with the provided ID
        console.error(e);
      }

      if (!stripeAccount || stripeAccount.deleted) {
        // if Stripe account has been formally deleted or is not found, create a new one and associate it with User
        const stripeCustomer = await updateBusinessAccount({
          id: user.id,
          email: user.email,
          name: "Travis Draper" /* to become user.name*/,
        });
        return {
          error: undefined,
          stripeCustomer,
        };
      }
      return { stripeCustomer: businessAccount, error: undefined };
    }

    // if no businessAccount found, create and return one
    const stripeCustomer = await createBusinessAccount(
      user.id,
      user.email,
      "Travis Draper" /* to become user.name*/
    );

    return {
      error: undefined,
      stripeCustomer,
    };
  } catch (e) {
    console.error(e);
    return {
      stripeCustomer: undefined,
      error: "Failed to retrieve Stripe Customer, see console for more details",
    };
  }
};

/**
 * Searches for and returns the first active Stripe subscription for customerId.
 * Throws an error if the found Stripe account has been deleted
 */
export async function checkForPreExistingSubscription(customerId: string) {
  const stripeAccount = await serverStripe.customers.retrieve(customerId, {
    expand: ["subscriptions.data"],
  });

  if (stripeAccount.deleted) throw new Error("User has no Stripe account");

  const activeStripeSubscription = stripeAccount.subscriptions?.data.find(
    (s) => s.status === "active"
  );

  return activeStripeSubscription;
}

/**
 * Creates a subscription with an INCOMPLETE invoice to be confirmed client-side via payment using the Stripe client.
 */
export async function createBusinessSubscription(
  customerId: string,
  priceId: string
) {
  const subscription = (await serverStripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  })) as ExpandedSubscription;

  return {
    subscriptionId: subscription.id,
    clientSecret: subscription?.latest_invoice?.payment_intent?.client_secret,
    paymentIntentId: subscription?.latest_invoice?.payment_intent.id,
  };
}
