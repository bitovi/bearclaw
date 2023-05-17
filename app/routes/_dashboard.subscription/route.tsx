import { Outlet, useLoaderData } from "@remix-run/react";

import Box from "@mui/material/Box";

import { useState } from "react";
import { json } from "@remix-run/node";
import {
  retrieveInvoicePreview,
  retrieveSubscriptionInvoiceHistory,
  subscriptionOptionLookup,
} from "~/payment.server";
import { retrieveOrganizationSubscription } from "~/account.server";
import { Container } from "@mui/material";
import { Banner } from "~/components/banner";
import { badSubscriptionStatus } from "./utils/badSubscriptionStatus";
import { SideNav } from "~/components/sideNav/SideNav";

import PersonIcon from "@mui/icons-material/Person";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";

export async function loader({ request }: { request: Request }) {
  try {
    const optionResults = await subscriptionOptionLookup();
    const organizationSubscription = await retrieveOrganizationSubscription(
      request
    );

    if (organizationSubscription) {
      let invoicePreview = null;
      let error = undefined;
      try {
        invoicePreview = await retrieveInvoicePreview(
          organizationSubscription?.id
        );
      } catch (e) {
        error = (e as Error).message;
      }
      const invoiceHistory = await retrieveSubscriptionInvoiceHistory(
        organizationSubscription.id
      );

      return json({
        optionResults,
        organizationSubscription,
        invoicePreview,
        invoiceHistory,
        error,
      });
    }
    return json({
      optionResults,
      organizationSubscription,
      invoicePreview: null,
      invoiceHistory: null,
      error: undefined,
    });
  } catch (e) {
    console.error("ERROR: ", (e as Error).message);
    return json({
      optionResults: null,
      organizationSubscription: null,
      invoicePreview: null,
      invoiceHistory: null,
      error: (e as Error).message,
    });
  }
}

export default function Route() {
  const { organizationSubscription } = useLoaderData<typeof loader>();
  const [errorVisible, setErrorVisible] = useState(
    organizationSubscription
      ? badSubscriptionStatus(organizationSubscription.activeStatus)
      : false
  );

  return (
    <Box width="100%" display="flex">
      <Box>
        <SideNav
          navMenu={[
            {
              label: "Overview",
              to: "/subscription/overview",
              icon: <PersonIcon />,
            },
            {
              label: "Subscription",
              to: "/subscription/manage",
              icon: <StarsRoundedIcon />,
            },
          ]}
        />
      </Box>
      <Container sx={{ overflow: "scroll" }}>
        <Outlet />
        <Banner
          container={{
            open: errorVisible,
            anchorOrigin: { vertical: "bottom", horizontal: "center" },
          }}
          alert={{
            severity: "error",
            variant: "filled",
            onClose: () => {
              setErrorVisible(false);
            },
          }}
          title="Error"
          content="There was an error during billing for your most recent subscription. Please contact customer support to resolve the issue."
        />
      </Container>
    </Box>
  );
}
