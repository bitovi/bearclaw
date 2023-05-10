import { Outlet, useLocation, useNavigate } from "@remix-run/react";

import Box from "@mui/material/Box";

import { SubscriptionSideNav } from "./sidenav";
import { useEffect } from "react";
import { json } from "@remix-run/node";
import {
  retrieveInvoicePreview,
  retrieveSubscriptionInvoiceHistory,
  subscriptionOptionLookup,
} from "~/payment.server";
import { retrieveOrganizationSubscription } from "~/account.server";
import { Container } from "@mui/material";

export async function loader({ request }: { request: Request }) {
  try {
    const optionResults = await subscriptionOptionLookup();
    const organizationSubscription = await retrieveOrganizationSubscription(
      request
    );
    if (organizationSubscription) {
      let invoicePreview = null;
      let error;
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
        error: undefined,
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/subscription") {
      navigate("./overview");
    }
  }, [location.pathname, navigate]);

  return (
    <Box width="100%" display="flex">
      <Box>
        <SubscriptionSideNav />
      </Box>
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
}
