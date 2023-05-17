import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { SideNav } from "~/components/sideNav/SideNav";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import HistoryIcon from "@mui/icons-material/History";

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
            label: "History",
            to: "/history",
            icon: <HistoryIcon />,
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
            to: "/subscription/overview",
            icon: <WorkspacePremiumIcon />,
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
