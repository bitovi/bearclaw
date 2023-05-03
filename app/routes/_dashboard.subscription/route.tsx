import { Outlet, useLocation, useNavigate } from "@remix-run/react";

import Box from "@mui/material/Box";

import { SubscriptionSideNav } from "./sidenav";
import { useEffect } from "react";
import { json } from "@remix-run/node";
import { subscriptionOptionLookup } from "~/payment.server";
import { retrieveOrganizationSubscription } from "~/account.server";

export async function loader({ request }: { request: Request }) {
  const optionResults = await subscriptionOptionLookup();
  const organizationSubscription = await retrieveOrganizationSubscription(
    request
  );

  return json({
    optionResults,
    organizationSubscription,
  });
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
      <Box flexGrow={1} padding={4} textAlign="center">
        <Outlet />
      </Box>
    </Box>
  );
}
