import Box from "@mui/material/Box";
import { useLoaderData } from "@remix-run/react";
import { SideNav } from "~/components/sideNav/SideNav";
import type { loader } from "../route";
import { useSideNavCopy } from "../copy";

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
        borderRadius="12px"
        width="200px"
        height="240px"
        left="-150px"
        bottom="-40px"
        sx={{
          background: "rgba(117, 117, 117, 0.1)",
          transform: "rotate(-18deg)",
        }}
      />
      <Box padding="1.5rem 1rem" maxHeight="100%" sx={{ overflowY: "auto" }}>
        <SideNav
          userPermissions={permissions}
          dividerAfter={copy?.dividerAfter}
          navMenu={copy?.links || []}
        />
      </Box>
    </Box>
  );
}
