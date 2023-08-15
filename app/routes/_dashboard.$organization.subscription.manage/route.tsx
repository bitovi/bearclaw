import { useLoaderData, useNavigate } from "@remix-run/react";
import { cancelSubscription, updateSubscription } from "~/payment.server";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo } from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { prisma } from "~/db.server";
import type Stripe from "stripe";
import dayjs from "dayjs";

import PlanCard from "./components/planCard";
import { useSubscriptionInformation } from "../_dashboard.$organization.subscription/hooks/useSubscriptionInformation";
import { getOrgId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const orgId = await getOrgId(request);
  if (!orgId) throw new Response("Organization Not Found", { status: 404 });
  return json({ orgId });
}

export async function action({ request }: ActionArgs) {
  const orgId = await getOrgId(request);
  if (!orgId) throw new Response("Organization Not Found", { status: 404 });
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
        return redirect(`/${orgId}/subscription/overview`);
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
        return redirect(`/${orgId}/subscription/overview`);
      } catch (e) {
        console.error(e);
        return json({ error: "Subscription not found" }, { status: 404 });
      }
    case "POST":
      return redirect(`/${orgId}/subscription/form/${priceId}`);
  }
}

export default function Route() {
  const { orgId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { optionResults, organizationSubscription, invoicePreview } =
    useSubscriptionInformation();

  const invoicePreviewDueDate = useMemo(() => {
    return invoicePreview?.dueDate
      ? `Your next payment on ${dayjs(
          new Date(invoicePreview.dueDate * 1000)
        ).format("MMMM DD, YYYY")}`
      : "";
  }, [invoicePreview]);

  const handlePlanClick = useCallback(
    (planId: string) => {
      navigate(`/${orgId}/subscription/plan?subscription=${planId}`);
    },
    [navigate, orgId]
  );

  if (optionResults?.error) {
    return <Box>{optionResults.error}</Box>;
  }
  return (
    <Box flexDirection="column" display="flex">
      <Box paddingLeft={2} paddingBottom={2}>
        <Typography variant="h5">Hello McUsername,</Typography>
        {invoicePreviewDueDate && (
          <Typography variant="body2" color="text.secondary">
            {invoicePreviewDueDate}
          </Typography>
        )}
      </Box>
      <Box maxHeight="78vh" overflow="scroll">
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
  );
}
