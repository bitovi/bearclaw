import type { ActionArgs, LoaderArgs } from "@remix-run/node";

import { logout } from "~/session.server";

export async function action({ request }: ActionArgs) {
  return logout(request);
}

export async function loader({ request }: LoaderArgs) {
  console.log("LOG LOG LOG LOG ------- _auth._full.logout loader");

  return logout(request);
}
