import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { SideNav } from "~/components/sideNav/SideNav";
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import BiotechIcon from '@mui/icons-material/Biotech';
import LinkIcon from '@mui/icons-material/Link';

export function MainSideNav() {
  return (
    <Box
      position="relative"
      height="100%"
      width="100%"
      sx={{
        overflowY: "auto",
        background: "#F5F5F5",
      }}
    >
      <Box
        position="absolute"
        borderRadius="12px"
        width="200px"
        height="240px"
        left="-150px"
        bottom="-40px"
        sx={{
          background: "rgba(117, 117, 117, 0.1)",
          transform: "rotate(-18deg)"
        }}
      />
      <Box display="flex" flexDirection="column" alignItems="center" padding="2rem 0" width="100%" gap="1rem">
        <img src="/images/bearclaw.png" alt="" width="100px" style={{ transform: "rotate(-22deg)", filter: "brightness(0)" }} />
        <div>
          <Typography
            fontWeight="900"
            fontSize="2rem"
            display="inline"
          >
            BEAR
          </Typography>
          <Typography
            fontWeight="900"
            fontSize="2rem"
            color="#F5F5F5"
            display="inline"
            sx={{
              textShadow: `
                -1px -1px 0 #0037FF,  
                1px -1px 0 #0037FF,
                -1px 1px 0 #0037FF,
                1px 1px 0 #0037FF`
            }}
          >
            CLAW
          </Typography>
        </div>
      </Box>
      <Box>
        <SideNav
          iconColor="#0037FF"
          navMenu={[
            {
              label: "Dashboard",
              to: "/",
              icon: <DashboardIcon />
            },
            {
              label: "Analysis",
              to: "/analysis",
              icon: <BiotechIcon />
            },
            {

              label: "Supply Chain",
              to: "/supplyChain",
              icon: <LinkIcon />
            },
            {
              label: "Subscriptions",
              to: "/subscription",
              icon: <WorkspacePremiumIcon />
            },
            {
              label: "Account",
              to: "/account",
              icon: <AccountBoxIcon />
            },
            {
              label: "Logout",
              to: "/logout",
              icon: <LogoutIcon />
            },
          ]}
        />
      </Box>
    </Box>
  );
}
