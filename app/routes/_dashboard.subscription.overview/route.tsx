import { Box, Stack, Typography } from "@mui/material";

import { useMatches, useNavigate } from "@remix-run/react";
import type {
  ExpandedPrice,
  Subscription,
  InvoicePreview,
  InvoiceHistoryItem,
} from "~/models/subscriptionTypes";
import InvoiceTable from "../../components/table";
import Card from "./components/card";
import dayjs from "dayjs";
import { useMemo } from "react";

const InvoiceTableHeaders = [
  { label: "Invoice ID", value: "Invoice_ID", sortable: false },
  { label: "Date", value: "Date", sortable: false },
  { label: "Invoice Amount", value: "Invoice_amount", sortable: false },
];

export default function Route() {
  const navigate = useNavigate();
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

  if (!organizationSubscription) {
    return (
      <Box textAlign={"center"}>
        <Typography>No active subscription</Typography>
      </Box>
    );
  }

  return (
    <>
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
          handleClick={() => navigate("/subscription/manage")}
          star={true}
        />
        {invoicePreview && (
          <Card
            title={`$${invoicePreview.upcomingToBeBilled / 100}`}
            additionalDetails={invoiceCardDetails}
            CTA={{
              label: "MANAGE PAYMENT SETTINGS",
              variant: "buttonLargeOutlined",
            }}
          />
        )}
      </Stack>

      <InvoiceTable<InvoiceHistoryItem>
        tableTitle={"Invoice"}
        tableData={invoiceHistory || undefined}
        headers={InvoiceTableHeaders}
        tableContainerStyles={{ maxHeight: "400px" }}
        search
      />
    </>
  );
}
