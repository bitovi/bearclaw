import { redirect } from "@remix-run/server-runtime";

export const loader = async () => {
  throw redirect("/account/info");
};
