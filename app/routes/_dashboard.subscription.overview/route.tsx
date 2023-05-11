import { Box, Stack, Typography } from "@mui/material";

import { useMatches } from "@remix-run/react";
import type {
  ExpandedPrice,
  Subscription,
  InvoicePreview,
  InvoiceHistoryItem,
} from "~/models/subscriptionTypes";
import InvoiceTable from "./invoiceTable";
import Card from "./card";
import dayjs from "dayjs";
import { useMemo } from "react";

export default function Route() {
  const { organizationSubscription, invoicePreview, invoiceHistory } =
    useMatches().find((root) => root.pathname === "/subscription")?.data as {
      optionResults: {
        subscriptionOptions: ExpandedPrice[] | undefined;
        error: string | undefined;
      };
      organizationSubscription: Subscription | null;
      invoicePreview: InvoicePreview | null;
      invoiceHistory: InvoiceHistoryItem[] | null;
    };

  if (!organizationSubscription) {
    return (
      <Box textAlign={"center"}>
        <Typography>No active subscription</Typography>
      </Box>
    );
  }

  const planCardDetails = useMemo(() => {
    return [
      "Current subscription plan",
      organizationSubscription?.cancellationDate
        ? `Cancelation on: ${dayjs(
            new Date(organizationSubscription?.cancellationDate * 1000)
          ).format("MMMM DD, YYYY")}`
        : "",
    ];
  }, [organizationSubscription]);

  const invoiceCardDetails = useMemo(() => {
    return [
      invoicePreview?.dueDate
        ? `Your next payment on ${dayjs(
            new Date(invoicePreview.dueDate * 1000)
          ).format("MMMM DD, YYYY")}`
        : "Cannot preview next payment date",
    ];
  }, [invoicePreview]);

  return (
    <Stack>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        alignItems="stretch"
        justifyContent="space-between"
        spacing={2}
      >
        <Card
          title={organizationSubscription.subscriptionLevel}
          additionalDetails={planCardDetails}
          CTA={{ label: "UPGRADE PLAN", variant: "contained" }}
          star={true}
        />
        {invoicePreview && (
          <Card
            title={`$${invoicePreview.upcomingToBeBilled / 100}`}
            additionalDetails={invoiceCardDetails}
            CTA={{
              label: "MANAGE PAYMENT SETTINGS",
              variant: "outlined",
            }}
          />
        )}
      </Stack>
      <Box paddingY={2}>
        <Typography variant="subtitle2">Invoices</Typography>
      </Box>
      <Box>
        <InvoiceTable
          invoiceEntries={
            invoiceHistory || [{ Invoice_ID: "", Date: "", Invoice_amount: "" }]
          }
        />
      </Box>
    </Stack>
  );
}
