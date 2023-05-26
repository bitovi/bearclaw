import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import Box from "@mui/material/Box";

import { Header } from "./header";
import { MainSideNav } from "./sidenav";
import { Loading } from "~/components/loading/Loading";
import { Link } from "~/components/link";
import { getOrgId, getUser } from "~/session.server";
import { validateUserEmailByToken } from "~/models/user.server";
import { retrieveOrganizationUser } from "~/models/organizationUsers.server";
import type { OrganizationUsers } from "~/models/organizationUsers.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await getUser(request);
  const organizationId = await getOrgId(request);
  let orgUser: OrganizationUsers | null = null;

  if (!user) {
    return redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`);
  }

  if (organizationId) {
    orgUser = await retrieveOrganizationUser({
      organizationId,
      userId: user?.id,
    });
  }

  if (user.emailVerifiedAt) {
    return json({
      isVerified: true,
      canViewUsers: orgUser ? orgUser.orgUsersView : false,
    });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (token) {
    const result = await validateUserEmailByToken(token);
    if (result.error) {
      return redirect(`/verify-email/${result.status}`);
    }
    return json({
      isVerified: true,
      canViewUsers: orgUser ? orgUser.orgUsersView : false,
    });
  }
  return json({
    isVerified: false,
    canViewUsers: orgUser ? orgUser.orgUsersView : false,
  });
}

export const meta: V2_MetaFunction = () => [{ title: "Dashboard" }];

export default function Index() {
  const { isVerified, canViewUsers } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <Box component="main" display="flex" height="100%">
      {isVerified && (
        <Box width="300px" borderRight="1px solid grey">
          <MainSideNav canViewUsers={canViewUsers} />
        </Box>
      )}
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        height="100%"
        marginLeft="-16px"
        zIndex="2"
        sx={{
          backgroundColor: "white",
          borderTopLeftRadius: "16px 24px",
          borderBottomLeftRadius: "16px 24px",
          overflowX: "scroll",
        }}
      >
        <Header />
        <Box overflow="hidden auto" padding={4} height="100%">
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
