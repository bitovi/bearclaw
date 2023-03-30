import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import { Upload } from "~/components/upload/Upload";
import { getUserId } from "~/session.server";

import { Header } from "./header";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/home");

  return json({});
}

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const location = useLocation();

  return (
    <div className="h-full overflow-hidden">
      <Header />
      <main className="bg-[color:rgba(0, 0, 0, .05)] relative min-h-screen overflow-y-auto overscroll-contain bg-white sm:flex sm:items-center sm:justify-center">
        {location.pathname === "/" ? <Upload /> : <Outlet />}
      </main>
    </div>
  );
}
