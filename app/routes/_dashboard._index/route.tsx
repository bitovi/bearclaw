import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import { Upload } from "~/components/upload/Upload";
import { requireUser } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  await requireUser(request);

  return json({});
}

export const meta: V2_MetaFunction = () => [{ title: "Dashboard" }];

export default function Index() {
  const location = useLocation();

  return location.pathname === "/" ? (
    <div>
      <Upload />
    </div>
  ) : (
    <Outlet />
  );
}
