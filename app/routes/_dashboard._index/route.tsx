import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getOrgandUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const { organizationId } = await getOrgandUserId(request);
  return redirect(`/${organizationId}/dashboard`);
}
