import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useNavigation } from "@remix-run/react";
import { Loading } from "~/components/loading/Loading";
import { getUserId } from "~/session.server";

import { Header } from "./header";
import { Sidenav } from "./sidenav";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/home");

  return json({});
}

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const navigation = useNavigation();

  return (
    <div className="h-full overflow-hidden">
      <Header />
      <div className="flex h-full flex-row">
        <div className="bg-[color:rgba(0, 0, 0, .05)] relative h-full min-h-screen overflow-y-auto p-8">
          <Sidenav />
        </div>
        <main className="bg-[color:rgba(0, 0, 0, .05)] relative min-h-screen flex-1 overflow-y-auto overscroll-contain bg-white p-8">
          {navigation.state === "loading" ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loading />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
