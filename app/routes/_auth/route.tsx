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
  const copy = await fetchAuthCopy();
  return json(copy)
}

export default function Index() {
  return <Outlet />
}
