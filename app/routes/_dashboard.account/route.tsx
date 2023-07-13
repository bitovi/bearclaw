import Box from "@mui/material/Box";
import { Outlet } from "@remix-run/react";
import { SideNav } from "~/components/sideNav/SideNav";
import { usePageCopy } from "../_dashboard/copy";
import { Page, PageHeader } from "../_dashboard/components/page";

export default function Account() {
  const copy = usePageCopy("account");

  return (
    <Page>
      <PageHeader
        headline={"User Account"}
        description={
          "Manage your personal details, subscription status, and overall account settings."
        }
      />
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        <Box width={{ xs: "auto", md: "240px" }}>
          <SideNav navMenu={copy?.subNavLinks || []} />
        </Box>
        <Box flex="1">
          <Outlet />
        </Box>
      </Box>
    </Page>
  );
}
