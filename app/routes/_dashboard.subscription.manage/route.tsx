import { useMatches } from "@remix-run/react";

import { cancelSubscription, updateSubscription } from "~/payment.server";
import type { ExpandedPrice } from "~/payment.server";
import type { Subscription } from "~/models/subscriptionTypes";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import Option from "./option";
import SubscriptionPlanModal from "./subscriptionPlanModal";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { prisma } from "~/db.server";
import type Stripe from "stripe";

export async function action({ request }: ActionArgs) {
  const method = request.method;
  const formData = await request.formData();
  const priceId = formData.get("planId");
  const subscriptionId = formData.get("subId");
  const invoiceTimeStamp = formData.get("invoiceTimeStamp");

  switch (method) {
    case "DELETE":
      if (!subscriptionId) {
        return json({ error: "No subscriptionId provided" }, { status: 400 });
      }
      if (typeof subscriptionId !== "string") {
        return json(
          { error: "Malformed subscriptionId provided" },
          { status: 400 }
        );
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
        console.error(e);
        return json({ error: JSON.stringify(e) }, { status: 404 });
      }
    case "PUT":
      if (!subscriptionId) {
        return json({ error: "No subscriptionId provided" }, { status: 400 });
      }
      if (!priceId) {
        return json({ error: "No priceId provided or" }, { status: 400 });
      }
      if (typeof priceId !== "string") {
        return json({ error: "Malformed priceId provided" }, { status: 400 });
      }
      if (typeof subscriptionId !== "string") {
        return json(
          { error: "Malformed subscriptionId provided" },
          { status: 400 }
        );
      }
      try {
        const subscription = await updateSubscription({
          priceId,
          subscriptionId,
          proration_date:
            typeof invoiceTimeStamp === "string" ? invoiceTimeStamp : undefined,
        });

        const subName = (
          subscription.items.data[0].price.product as Stripe.Product
        ).name;
        const updatedSubscription = await prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            subscriptionLevel: subName,
            activeStatus: subscription.status,
            cancellationDate: null,
          },
        });
        return updatedSubscription;
      } catch (e) {
        console.error(e);
        return json({ error: JSON.stringify(e) }, { status: 404 });
      }
    case "POST":
      return redirect(`/subscription/form/${priceId}`);
  }
}

export default function Route() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ExpandedPrice>();
  const { optionResults, organizationSubscription } = useMatches().find(
    (root) => root.pathname === "/subscription"
  )?.data as {
    optionResults: {
      subscriptionOptions: ExpandedPrice[] | undefined;
      error: string | undefined;
    };
    organizationSubscription: Subscription | null;
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedOption(undefined);
  }, []);

  if (optionResults.error) {
    return <Box>{optionResults.error}</Box>;
  }
  return (
    <>
      <SubscriptionPlanModal
        subscriptionPlanOption={selectedOption}
        secondaryAction={closeModal}
        open={modalOpen}
        currentSubscription={organizationSubscription}
        onClose={closeModal}
      />
      <Box
        minHeight={400}
        display="flex"
        width="full"
        justifyContent="space-between"
      >
        {optionResults.subscriptionOptions?.map((opt) => {
          return (
            <Option
              handleClick={(opt: ExpandedPrice) => {
                setSelectedOption(opt);
                setModalOpen(true);
              }}
              key={opt.id}
              subscriptionPlanOption={opt}
              selected={
                opt.product.name === organizationSubscription?.subscriptionLevel
              }
              cancellationDate={
                opt.product.name === organizationSubscription?.subscriptionLevel
                  ? organizationSubscription.cancellationDate || undefined
                  : undefined
              }
            />
          );
        })}
      </Box>
    </>
  );
}
