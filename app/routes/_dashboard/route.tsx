import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import { Loading } from "~/components/loading/Loading";

import { Header } from "./header";
import { Sidenav } from "./sidenav";
import { Link } from "~/components/link";
import { getUser } from "~/session.server";
import { validateUserEmailByToken } from "~/models/user.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await getUser(request);
  if (!user) {
    return redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`);
  }
  if (user.emailVerifiedAt) {
    return json({ isVerified: true });
  }
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (token) {
    const result = await validateUserEmailByToken(token);
    if (result.error) {
      return redirect(`/verify-email/${result.status}`);
    }
    return json({ isVerified: true });
  }
  return json({ isVerified: false });
}

export const meta: V2_MetaFunction = () => [{ title: "Dashboard" }];

export default function Index() {
  const { isVerified } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <div className="h-full overflow-hidden">
      <Header />
      <div className="flex h-full flex-row">
        {isVerified && (
          <div className="bg-[color:rgba(0, 0, 0, .05)] relative h-full min-h-screen overflow-y-auto p-8">
            <Sidenav />
          </div>
        )}
        <main className="bg-[color:rgba(0, 0, 0, .05)] relative min-h-screen flex-1 overflow-y-auto overscroll-contain bg-white p-8">
          {navigation.state === "loading" ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loading />
            </div>
          ) : (
            <>
              {isVerified ? (
                <Outlet />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                  <p className="text-lg text-gray-500">
                    Please verify your email address. Check your inbox for a
                    verification link.
                  </p>
                  <Link to="/verificationEmailResend">
                    Resend verification email
                  </Link>
                  <p className="mt-4 text-lg text-gray-500">
                    TESTING: Email messaging is not connected yet.{" "}
                    <Link to="/fakeMail">View verification emails here</Link>
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
