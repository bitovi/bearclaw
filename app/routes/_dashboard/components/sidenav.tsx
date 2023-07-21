import Box from "@mui/material/Box";
import { useLoaderData } from "@remix-run/react";
import { SideNav } from "~/components/sideNav/SideNav";
import type { loader } from "../route";
import { useSideNavCopy } from "../copy";
import { Logo } from "~/components/logo/Logo";

export function MainSideNav() {
  const { permissions } = useLoaderData<typeof loader>();
  const copy = useSideNavCopy();

  return (
    <Box
      position="relative"
      height="100%"
      width="100%"
      sx={{
        background: "#F5F5F5",
      }}
    >
      <Box
        position="absolute"
        borderRadius="48px"
        width="200px"
        height="400px"
        left="-110px"
        bottom="-100px"
        border="20px solid rgba(117, 117, 117, 0.1)"
        sx={{
          transform: "rotate(-18deg)",
        }}
      />
      <Box
        padding="1.5rem 1rem"
        maxHeight="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="1rem"
        sx={{ overflowY: "auto" }}
      >
        <Logo variant="stacked" width="124px" />
        <SideNav
          userPermissions={permissions}
          dividerAfter={copy?.dividerAfter}
          navMenu={copy?.links || []}
        />
      </Box>
    </Box>
  );
}
