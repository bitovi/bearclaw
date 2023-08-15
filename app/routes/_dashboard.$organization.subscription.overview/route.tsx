import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type { InvoiceHistoryItem } from "~/models/subscriptionTypes";
import InvoiceTable from "../../components/table";
import Card from "./components/card";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useSubscriptionInformation } from "../_dashboard.$organization.subscription/hooks/useSubscriptionInformation";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { getOrgandUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const { organizationId } = await getOrgandUserId(request);

  return json({ organizationId });
}
const InvoiceTableHeaders = [
  { label: "Invoice ID", value: "Invoice_ID", sortable: false },
  { label: "Date", value: "Date", sortable: false },
  { label: "Invoice Amount", value: "Invoice_amount", sortable: false },
];

export default function Route() {
  const { organizationId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { organizationSubscription, invoicePreview, invoiceHistory } =
    useSubscriptionInformation();

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
          handleClick={() => navigate(`/${organizationId}/subscription/manage`)}
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
      />
    </>
  );
}
