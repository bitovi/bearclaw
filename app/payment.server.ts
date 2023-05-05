/**
  Server-side operations for interacting with Stripe API
 */

import Stripe from "stripe";
import { getOrgId, getUser } from "./session.server";
import type { Organization } from "./models/organization.server";
import { isNumber } from "./utils";
import { retrieveOrganizationUser } from "./models/organizationUsers.server";
import {
  getOrganizationById,
  updateOrganizationPaymentAccount,
} from "./models/organization.server";
import {
  createSubscription,
  retrieveSubscriptionByOrgId,
} from "./models/subscription.server";
import type { InvoicePreview } from "./models/subscriptionTypes";

require("dotenv").config();

// Expanded______ types, as Stripe interfaces don't seem capable of detecting use of the "expand" parameter in their query operations.
export type ExpandedPrice = Omit<Stripe.Price, "product"> & {
  product: Stripe.Product;
};

type ExpandedInvoice = Omit<Stripe.Invoice, "payment_intent"> & {
  payment_intent: Stripe.PaymentIntent;
};

type ExpandedSubscription_Invoice = Omit<
  Stripe.Subscription,
  "latest_invoice"
> & {
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
/**
 * Creates a new stripe customer account
 */
export async function createPaymentVendorCustomer({
  name,
  email,
}: {
  name?: string;
  email: string;
}) {
  const paymentVendorCustomer = await serverStripe.customers.create({
    name,
    email,
  });

  return paymentVendorCustomer;
}

// For now, we display the confirmed Payment Intent after a successful order
export async function retrievePaymentIntent(id: string) {
  return await serverStripe.paymentIntents.retrieve(id);
}

export async function retrieveSubscriptionFromPaymentService(
  id: string,
  params?: Stripe.SubscriptionRetrieveParams
) {
  return await serverStripe.subscriptions.retrieve(id, params);
}

/**
 * Before creating a new subscription, ensures the following:
 *
 * - User exists
 *
 * - Organization exists
 *
 * - User has susbcription creation permissions
 *
 * - Organization does not already have an active subscription associated
 */
export async function validateCredentials(request: Request) {
  try {
    const user = await getUser(request);
    const organizationId = await getOrgId(request);

    if (!user) {
      throw new Error("No user found");
    }
    if (!organizationId) {
      throw new Error("No orgId found");
    }

    // Look up the organizationUser associated w/ user & org
    const orgUser = await retrieveOrganizationUser({
      userId: user.id,
      organizationId,
    });

    if (!orgUser) {
      throw new Error("User is not a member of the organization");
    }

    if (!orgUser.subscriptionCreate) {
      throw new Error(
        "NO PERMISSION - User does not have permissions to create a subscription"
      );
    }

    const organization = await getOrganizationById(organizationId);

    if (!organization) {
      throw new Error("No organization found");
    }

    const orgSubscription = await retrieveSubscriptionByOrgId(organization.id);

    if (orgSubscription) {
      throw new Error("Organization already has a subscription");
    }

    return { organization, error: undefined };
  } catch (e) {
    console.error(e);
    return { organization: null, error: (e as Error).message };
  }
}

/**
 * Returns the Stripe account Id associated with an organization. If Stripe account is no longer valid (deleted or non-existent) on found Organization, creates a new Stripe account and updates Organization accordingly.
 */
export const retrieveStripeCustomerId = async (organization: Organization) => {
  try {
    // confirm Stripe account presence
    let stripeAccount;

    try {
      stripeAccount = await serverStripe.customers.retrieve(
        organization.paymentAccountId
      );
    } catch (e) {
      // There is no longer a Stripe account associated with the provided ID
      console.error(e);
    }

    if (!stripeAccount || stripeAccount.deleted) {
      // if Stripe account has been formally deleted or is not found, create a new one and associate it with Organization
      const paymentAccount = await createPaymentVendorCustomer({
        email: organization.email,
      });

      await updateOrganizationPaymentAccount(
        organization.id,
        paymentAccount.id
      );

      return {
        error: undefined,
        paymentAccountId: paymentAccount.id,
      };
    }

    return { paymentAccountId: stripeAccount.id, error: undefined };
  } catch (e) {
    console.error(e);
    return {
      stripeCustomer: undefined,
      error:
        typeof e === "string"
          ? e
          : "Failed to retrieve Stripe Customer, see console for more details",
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
  })) as ExpandedSubscription_Invoice;

  return {
    subscriptionId: subscription.id,
    clientSecret: subscription?.latest_invoice?.payment_intent?.client_secret,
    paymentIntentId: subscription?.latest_invoice?.payment_intent?.id,
  };
}

export async function setupSubscription(request: Request) {
  const user = await getUser(request);
  const organizationId = await getOrgId(request);
  const url = new URL(request.url);
  const subscriptionId = url.searchParams.get("subscription_id");

  if (!user) {
    throw new Error("No user found");
  }
  if (!organizationId) {
    throw new Error("No orgId found");
  }
  if (!subscriptionId) {
    throw new Error("No payment intent or subscription id found in URL");
  }

  const subscription = await retrieveSubscriptionFromPaymentService(
    subscriptionId,
    { expand: ["items.data.price.product"] }
  );

  const subName = (subscription.items.data[0].price.product as Stripe.Product)
    .name;

  const newSubscription = createSubscription({
    id: subscriptionId,
    organizationId,
    activeStatus: subscription.status,
    cancellationDate: null,
    subscriptionLevel: subName,
  });

  return newSubscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const cancelledSubscription = await serverStripe.subscriptions.update(
    subscriptionId,
    { cancel_at_period_end: true }
  );
  return cancelledSubscription;
}

export async function previewSubscription({
  subscriptionId,
  priceId,
  organizationId,
}: {
  subscriptionId: string;
  priceId: string;
  organizationId: string;
}): Promise<InvoicePreview | null> {
  const organization = await getOrganizationById(organizationId);

  if (!organization) {
    return null;
  }
  const proration_date = Math.floor(Date.now() / 1000);

  const subscription = await serverStripe.subscriptions.retrieve(
    subscriptionId
  );
  const items = [
    {
      id: subscription.items.data[0].id,
      price: priceId,
    },
  ];

  const previewedSubscription = await serverStripe.invoices.retrieveUpcoming({
    subscription: subscriptionId,
    subscription_items: items,
    subscription_proration_date: proration_date,
    customer: organization.paymentAccountId,
  });

  const periodEnd = previewedSubscription.period_end;
  const prorationDate = previewedSubscription.subscription_proration_date;

  return {
    upcomingToBeBilled: previewedSubscription.total,
    periodEnd,
    prorationDate,
  };
}

export async function updateSubscription({
  priceId,
  subscriptionId,
  proration_date,
}: {
  priceId: string;
  subscriptionId: string;
  proration_date: string | undefined | null;
}) {
  const subscription = await serverStripe.subscriptions.retrieve(
    subscriptionId
  );

  const updatedSubscription = await serverStripe.subscriptions.update(
    subscriptionId,
    {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
      proration_date: proration_date ? +proration_date : undefined,
      expand: ["items.data.price.product"],
    }
  );

  return updatedSubscription;
}
