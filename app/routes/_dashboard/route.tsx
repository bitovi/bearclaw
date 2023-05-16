import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import Box from "@mui/material/Box";

import { Header } from "./header";
import { MainSideNav } from "./sidenav";
import { Loading } from "~/components/loading/Loading";
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
    <Box component="main" display="flex" height="100%">
      {isVerified && (
        <Box width="300px" borderRight="1px solid grey">
          <MainSideNav />
        </Box>
      )}
      <Box display="flex" flexDirection="column" height="100%" width="100%">
        <Header />
        <Box overflow="hidden auto" padding={4}>
          {navigation.state === "loading" ? (
            <div>
              <Loading />
            </div>
          ) : (
            <>
              {isVerified ? (
                <Outlet />
              ) : (
                <Box
                  height="100%"
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                >
                  <p className="text-lg text-gray-500">
                    Please verify your email address. Check your inbox for a
                    verification link.
                  </p>
                  <Link to="/verificationEmailResend">
                    Resend verification email
                  </Link>
                  <p>
                    TESTING: Email messaging is not connected yet.{" "}
                    <Link to="/fakeMail">View verification emails here</Link>
                  </p>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
