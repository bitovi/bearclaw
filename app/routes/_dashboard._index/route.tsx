import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import { Upload } from "~/components/upload/Upload";
import { getUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/home");

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
