import { Box } from "@mui/material";
import { SideNav } from "~/components/sideNav/SideNav";

import { getClient } from "~/lib/sanity/getClient.server";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export async function sideNavLoader() {
  const query = `*[_type == 'dashboardSideNav'][0]{...}`;
  const { links, dividerAfter } = await getClient().fetch<{
    links: Array<{
      text: string,
      to: string,
      icon: string,
      requiredPermissions: Array<string>
    }>,
    dividerAfter: number
  }>(query)

  return { navLinks: links, dividerAfter }
}

export function MainSideNav() {
  const { permissions, sideNavLoaderData: { navLinks, dividerAfter} } = useLoaderData<typeof loader>();
  
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
          dividerAfter={dividerAfter} 
          navMenu={navLinks} 
          iconColor="#0037FF" 
        />
      </Box>
    </Box>
  );
}
