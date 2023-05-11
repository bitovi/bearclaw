import { useMatches } from "@remix-run/react";

import { cancelSubscription, updateSubscription } from "~/payment.server";
import type {
  ExpandedPrice,
  InvoicePreview,
  Subscription,
} from "~/models/subscriptionTypes";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import Option from "./option";
import SubscriptionPlanModal from "./subscriptionPlanModal";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { prisma } from "~/db.server";
import type Stripe from "stripe";
import CircleIcon from "@mui/icons-material/Circle";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";

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
        return json({ error: "Subscription not found" }, { status: 404 });
      }
    case "POST":
      return redirect(`/subscription/form/${priceId}`);
  }
}

type PlanCardProps = {
  planName: string;
  price: string;
  description: string;
  featureList: string[];
  selected?: boolean;
};

const PlanCard = ({
  planName,
  price,
  description,
  featureList,
  selected = false,
}: PlanCardProps) => {
  return (
    <Card>
      <Stack
        padding={2}
        display="flex"
        direction="row"
        color="rgba(0, 0, 0, 0.04)"
        bgcolor={selected ? "rgba(0, 0, 0, 0.08)" : ""}
      >
        <Stack
          direction="row"
          flex={1}
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Box display="flex" alignItems="center">
            <CircleIcon
              sx={{ height: "40px", width: "40px" }}
              color="inherit"
            />
            <Typography variant="subtitle1" color="#000000" paddingLeft={1}>
              {planName}
            </Typography>
          </Box>

          {selected && (
            <Box color="rgba(0, 0, 0, 0.56)">
              <CheckCircleIcon />
            </Box>
          )}
        </Stack>
      </Stack>
      <Divider />

      <Stack padding={2}>
        <Box paddingBottom={1}>
          <Typography variant="subtitle2">{price}</Typography>
          <Typography variant="body2">{description}</Typography>
        </Box>
        <Box>
          {featureList.map((str, i) => {
            return (
              <Box
                display="flex"
                key={str.slice(0, 3) + `-${i}`}
                color="rgba(0, 0, 0, 0.56)"
              >
                <StarIcon />
                <Typography
                  paddingLeft={2}
                  variant="body2"
                  color="rgba(0, 0, 0, 0.87)"
                >
                  {str}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Card>
  );
};

export default function Route() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ExpandedPrice>();
  const { optionResults, organizationSubscription, invoicePreview } =
    useMatches().find((root) => root.pathname === "/subscription")?.data as {
      optionResults: {
        subscriptionOptions: ExpandedPrice[] | undefined;
        error: string | undefined;
      } | null;
      organizationSubscription: Subscription | null;
      invoicePreview: InvoicePreview | null;
    };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedOption(undefined);
  }, []);

  const invoicePreviewDueDate = useMemo(() => {
    return invoicePreview?.dueDate
      ? `Your next payment on ${dayjs(
          new Date(invoicePreview.dueDate * 1000)
        ).format("MMMM DD, YYYY")}`
      : "";
  }, [invoicePreview]);

  if (optionResults?.error) {
    return <Box>{optionResults.error}</Box>;
  }
  return (
    <Box>
      <Box flexDirection="column" display="flex">
        <Box paddingLeft={2} paddingBottom={3}>
          <Typography variant="subtitle2">Hello McUsername,</Typography>
          {invoicePreviewDueDate && (
            <Typography variant="body2">{invoicePreviewDueDate}</Typography>
          )}
        </Box>
        <Box maxHeight="75vh" overflow="scroll">
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
                />
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

/**
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
        {optionResults?.subscriptionOptions?.map((opt) => {
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
 */
