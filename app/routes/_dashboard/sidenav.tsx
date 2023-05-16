import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { SideNav } from "~/components/sideNav/SideNav";

export function MainSideNav() {
  return (
    <Box>
      <SideNav
        navMenu={[
          {
            label: "Dashboard",
            to: "/",
          },
          {
            label: "Analysis",
            to: "/analysis",
          },
          {

            label: "Supply Chain",
            to: "/supplyChain",
          },
        ]}
      />
      <Divider />
      <SideNav

        navMenu={[
          {
            label: "Subscriptions",
            to: "/subscription",
          },
          {
            label: "Account",
            to: "/account",
          },
          {
            label: "Logout",
            to: "/logout",
          },
        ]}
      />
    </Box>
  );
}
