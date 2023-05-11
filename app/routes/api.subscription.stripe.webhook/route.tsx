import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { serverStripe } from "~/payment.server";
import { SubscriptionStatus } from "~/models/subscriptionTypes";
import {
  deleteSubscription,
  retrieveSubscription,
  updateSubscriptionStatus,
} from "~/models/subscription.server";
import { isStripeInvoice, isStripeSubscription } from "~/utils";

enum StripeEvent {
  INVOICE_PAID = "invoice.paid",
  FAILED_PAYMENT = "invoice.payment_failed",
  SUBSCRIPTION_CANCELLATION = "customer.subscription.deleted",
  REFUND = "charge.refunded",
  EXPIRATION_NOTICE = "subscription_schedule.expiring",
  SUBSCRIPTION_CHANGE = "customer.subscription.updated",
}

async function subscriptionStatusChange(
  id: string,
  status: SubscriptionStatus
) {
  try {
    const foundSubscription = await retrieveSubscription(id);
    if (foundSubscription) {
      const updatedSubscription = await updateSubscriptionStatus(id, status);
      return updatedSubscription;
    }
  } catch (e) {
    console.error((e as Error).message);
  }
}

export async function action({ request }: ActionArgs) {
  const sig = request.headers.get("stripe-signature");
  const payload = await request.text();
  let event;

  if (!sig) {
    return json(
      { error: "Missing Stripe signature" },
      {
        status: 400,
      }
    );
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return json(
      { error: "Missing webhook secret" },
      {
        status: 400,
      }
    );
  }

  try {
    event = serverStripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return json(
      { error: (err as Error).message },
      {
        status: 400,
      }
    );
  }

  switch (event.type) {
    case StripeEvent.EXPIRATION_NOTICE:
      // Occurs 7 days before a subscription schedule will expire.
      // Stripe Schedule https://stripe.com/docs/api/subscription_schedules/object#:~:text=les-,The%20schedule%20object,-Attributes

      // TODO: Determine what to do with this 7-days to expiration notice
      // const schedule = event.data.object as Stripe.SubscriptionSchedule;
      break;
    case StripeEvent.FAILED_PAYMENT:
      // Occurs whenever an invoice payment attempt fails, due either to a declined payment or to the lack of a stored payment method
      // Stripe Invoice https://stripe.com/docs/api/invoices/object#:~:text=rch-,The%20Invoice%20object,-Attributes

      const failedInvoice = event.data.object;
      if (isStripeInvoice(failedInvoice)) {
        if (failedInvoice.customer) {
          // failedPayment(failedInvoice.customer as string);
        }
      }

      break;

    case StripeEvent.INVOICE_PAID:
      // Occurs whenever an invoice payment attempt succeeds or an invoice is marked as paid out-of-band.
      // Stripe Invoice https://stripe.com/docs/api/invoices/object#:~:text=rch-,The%20Invoice%20object,-Attributes

      // const paidInvoice = event.data.object as Stripe.Invoice;
      break;

    case StripeEvent.REFUND:
      // Occurs whenever a charge is refunded, including partial refunds.
      // Stripe Charge https://stripe.com/docs/api/charges/object#:~:text=rch-,The%20charge%20object,-Attributes

      // const refundedCharge = event.data.object as Stripe.Charge;

      break;

    case StripeEvent.SUBSCRIPTION_CANCELLATION:
      // Occurs whenever a customer's subscription ends.
      // Stripe Subscription https://stripe.com/docs/api/subscriptions/object#:~:text=rch-,The%20subscription%20object,-Attributes

      const cancelledSubscription = event.data.object;
      if (isStripeSubscription(cancelledSubscription)) {
        deleteSubscription(cancelledSubscription.id);
      }

      break;

    case StripeEvent.SUBSCRIPTION_CHANGE:
      // Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active, transitioning into "past_due", etc.).
      // Stripe Subscription https://stripe.com/docs/api/subscriptions/object#:~:text=rch-,The%20subscription%20object,-Attributes

      const changedSubscription = event.data.object;

      if (isStripeSubscription(changedSubscription)) {
        // if the Subscription is being canceled, then the cancellation event will manage it
        if (changedSubscription.status !== SubscriptionStatus.CANCELED) {
          subscriptionStatusChange(
            changedSubscription.id,
            changedSubscription.status as SubscriptionStatus
          );
        }
      }

      break;
    default:
      console.log("UNHANDLED EVENT TYPE: ", event.type);
  }

  return json({ success: true }, 200);
}
