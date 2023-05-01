import type { V2_MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Box, Typography } from "@mui/material";

export const meta: V2_MetaFunction = () => [
  {
    title: "Authentication",
  },
];

export default function Index() {
  return (
    <Box component="main" display="flex" justifyContent="center" alignItems="center">
      <Box width="400px">
        <Typography variant="h1">
          BEARCLAW
        </Typography>
        <Box maxWidth="500px">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
