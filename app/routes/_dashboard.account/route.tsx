import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Outlet } from "@remix-run/react";
import { SideNav } from "~/components/sideNav/SideNav";

export default function Account() {
  return (
    <Box>
      <Box>
        <Typography variant="h1">Account</Typography>
      </Box>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        <Box width={{ xs: "auto", md: "240px" }}>
          <SideNav
            navMenu={[
              {
                label: "Settings",
                to: "/account/settings",
              },
            ]}
          />
        </Box>
        <Box flex="1">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
