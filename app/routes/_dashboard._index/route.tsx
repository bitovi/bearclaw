import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getOrgandUserId } from "~/session.server";
import { Upload, uploadAction } from "../_dashboard.upload/route";

export async function loader({ request }: LoaderArgs) {
  const { userId, organizationId } = await getOrgandUserId(request);

  return json({ userId, organizationId });
}

export async function action(args: LoaderArgs) {
  return uploadAction(args);
}

export const meta: V2_MetaFunction = () => [{ title: "Dashboard" }];

export default function Index() {
  const { userId, organizationId } = useLoaderData<typeof loader>();
  return (
    <div>
      <Upload userId={userId} organizationId={organizationId} />
    </div>
  );
}
