import type { LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { getUser } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
        const user = await getUser(request);
        if (user) {
            return redirect(`/dashboard`);
        }
        return redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`);
    }
    return json({})
}
