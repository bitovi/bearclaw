import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Outlet } from "@remix-run/react";
import { SideNav } from "~/components/sideNav/SideNav";
import { StarTwoTone } from "@mui/icons-material";

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
              {
                label: "Legal",
                to: "/account/legal",
                icon: <StarTwoTone />,
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
