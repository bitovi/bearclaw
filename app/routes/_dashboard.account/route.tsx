import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Outlet } from "@remix-run/react";
import { SideNav } from "~/components/sideNav/SideNav";
import { usePageCopy } from "../_dashboard/copy";

export default function Account() {
  const copy = usePageCopy("account");

  return (
    <Box>
      <Box>
        <Typography variant="h1">{copy?.headline}</Typography>
      </Box>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        <Box width={{ xs: "auto", md: "240px" }}>
          <SideNav navMenu={copy?.subNavLinks || []} />
        </Box>
        <Box flex="1">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
