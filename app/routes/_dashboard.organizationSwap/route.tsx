import type { LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { changeUserOrganizationSession } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo");
  const organizationId = url.searchParams.get("organizationId");

  invariant(organizationId, "Organization ID is required");
  invariant(redirectTo, "Redirect URL is required");

  const redirect = await changeUserOrganizationSession({
    request,
    organizationId,
    redirectTo,
  });
  throw redirect;
}
