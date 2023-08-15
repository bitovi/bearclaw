import type { LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { changeUserOrganizationSession } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const _redirectTo = url.searchParams.get("redirectTo");
  const organizationId = url.searchParams.get("organizationId");
  const prevOrgId = url.searchParams.get("prevOrgId");

  invariant(organizationId, "Organization ID is required");
  invariant(_redirectTo, "Redirect URL is required");
  const redirectTo = prevOrgId
    ? _redirectTo.replace(prevOrgId, organizationId) // when swapping orgs on org protected pages, ensure the redirect link contains the appropriate orgId
    : _redirectTo;

  const redirect = await changeUserOrganizationSession({
    request,
    organizationId,
    redirectTo,
  });
  throw redirect;
}
