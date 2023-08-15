import { useLoaderData } from "@remix-run/react";
import { SideNav } from "~/components/sideNav/SideNav";
import type { loader } from "../route";
import { useSideNavCopy } from "../copy";

export function NavLinks() {
  const { permissions, orgUser } = useLoaderData<typeof loader>();
  const copy = useSideNavCopy();

  return (
    <SideNav
      userPermissions={permissions}
      dividerAfter={copy?.dividerAfter}
      navMenu={copy?.links || []}
      orgId={orgUser?.organizationId}
    />
  );
}
