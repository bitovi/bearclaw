import { useMatches, useNavigate } from "@remix-run/react";
import { cancelSubscription, updateSubscription } from "~/payment.server";
import type {
  ExpandedPrice,
  InvoicePreview,
  Subscription,
} from "~/models/subscriptionTypes";
import { Box, Stack, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { prisma } from "~/db.server";
import type Stripe from "stripe";
import dayjs from "dayjs";

import PlanCard from "./components/planCard";

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
        await prisma.subscription.update({
          where: { id: cancelledSubscription.id },
          data: {
            cancellationDate: cancelledSubscription.cancel_at,
          },
        });
        console.log("ABOUT TO REDIRECT");
        return redirect("/subscription/overview");
      } catch (e) {
        console.error(e);
        return json({ error: "Subscription not found" }, { status: 404 });
      }
    case "PUT":
      if (!subscriptionId) {
        return json({ error: "No subscriptionId provided" }, { status: 400 });
      }
      if (!priceId) {
        return json({ error: "No priceId provided" }, { status: 400 });
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
        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            subscriptionLevel: subName,
            activeStatus: subscription.status,
            cancellationDate: null,
          },
        });
        return redirect("/subscription/overview");
      } catch (e) {
        console.error(e);
        return json({ error: "Subscription not found" }, { status: 404 });
      }
    case "POST":
      return redirect(`/subscription/form/${priceId}`);
  }
}

export default function Route() {
  const navigate = useNavigate();
  const { optionResults, organizationSubscription, invoicePreview } =
    useMatches().find((root) => root.pathname === "/subscription")?.data as {
      optionResults: {
        subscriptionOptions: ExpandedPrice[] | undefined;
        error: string | undefined;
      } | null;
      organizationSubscription: Subscription | null;
      invoicePreview: InvoicePreview | null;
    };

  const invoicePreviewDueDate = useMemo(() => {
    return invoicePreview?.dueDate
      ? `Your next payment on ${dayjs(
          new Date(invoicePreview.dueDate * 1000)
        ).format("MMMM DD, YYYY")}`
      : "";
  }, [invoicePreview]);

  const handlePlanClick = useCallback(
    (planId: string) => {
      navigate(`/subscription/plan?subscription=${planId}`);
    },
    [navigate]
  );

  if (optionResults?.error) {
    return <Box>{optionResults.error}</Box>;
  }
  return (
    <Box>
      <Box flexDirection="column" display="flex">
        <Box paddingLeft={2} paddingBottom={3}>
          <Typography variant="h5">Hello McUsername,</Typography>
          {invoicePreviewDueDate && (
            <Typography variant="body2" color="text.secondary">
              {invoicePreviewDueDate}
            </Typography>
          )}
        </Box>
        <Box maxHeight="80vh" overflow="scroll">
          <Stack spacing={2}>
            {optionResults?.subscriptionOptions?.map((opt) => {
              return (
                <PlanCard
                  key={opt.id}
                  selected={
                    opt.product.name ===
                    organizationSubscription?.subscriptionLevel
                  }
                  planName={opt.product.name}
                  price={`$${(opt.unit_amount || 0) / 100}`}
                  description={`The ${opt.product.name} subscription tier`}
                  featureList={["Feature 1", "Feature 2", "Feature 3"]}
                  handleClick={() => handlePlanClick(opt.id)}
                />
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
