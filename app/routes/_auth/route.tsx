import { json } from "@remix-run/server-runtime";
import type { V2_MetaFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { fetchAuthCopy } from "./copy";

export const meta: V2_MetaFunction = () => [
  {
    title: "Authentication",
  },
];

export async function loader() {
  console.log("LOG LOG LOG LOG ------- _auth loader");

  const copy = await fetchAuthCopy();
  return json(copy);
}

export default function Index() {
  return <Outlet />;
}
