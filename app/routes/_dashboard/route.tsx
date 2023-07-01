import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { Header } from "./header";
import { MainSideNav } from "./sidenav";

import { getOrgId, getUser, requireUser } from "~/session.server";
import { validateUser } from "~/models/user.server";
import {
  getOrgUserPermissions,
  retrieveOrganizationUser,
} from "~/models/organizationUsers.server";
import type { OrganizationUsers } from "~/models/organizationUsers.server";
import { safeRedirect } from "~/utils";
import { fetchDashboardCopy } from "./copy";

export async function loader({ request }: LoaderArgs) {
  const isLoggedIn = await getUser(request);
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const inviteToken = url.searchParams.get("inviteToken");
  const redirectTo = url.searchParams.get("redirectTo");

  if (!isLoggedIn && inviteToken) {
    // encode the pathname rather than the full url to avoid failing the safeRedirect check
    // pass inviteToken into the encoded redirect but forward email in url params for login/join form
    throw redirect(
      `/login?redirectTo=${encodeURIComponent(
        `${url.pathname}?${inviteToken ? `inviteToken=${inviteToken}` : ""}`
      )}${email ? `&email=${email}` : ""}`
    );
  }

  const user = await requireUser(request);
  const organizationId = await getOrgId(request);
  let orgUser: OrganizationUsers | null = null;

  if (organizationId) {
    orgUser = await retrieveOrganizationUser({
      organizationId,
      userId: user?.id,
    });
  }

  const copy = await fetchDashboardCopy();
  const permissions = getOrgUserPermissions(orgUser);
  const result = await validateUser(user.id);
  if (result.error) {
    return redirect(`/verify-email/${result.status}`);
  }

  if (user.emailVerifiedAt) {
    if (redirectTo && redirectTo !== "/") {
      // Only redirect if an explicit redirect path was passed (don't use default)
      // for example to /invite/$token
      redirect(safeRedirect(`${redirectTo}?${url.searchParams}`));
    } else {
      return json({
        copy,
        isVerified: true,
        permissions,
      });
    }
  }

  return redirect("/verify-email");
}

export const meta: V2_MetaFunction = () => [{ title: "Dashboard" }];

export default function Index() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      sx={{
        backgroundColor: "#F5F5F5",
      }}
    >
      <Header />
      <Box
        display="flex"
        height="100%"
        width="100%"
        overflow="hidden"
        bgcolor={"#F5F5F5"}
      >
        <Box width="250px">
          <MainSideNav />
        </Box>
        <Box
          component={Paper}
          height="100%"
          overflow="hidden auto"
          flex="1"
          padding={4}
          sx={{ backgroundColor: "white", borderTopLeftRadius: "16px" }}
        >
          <main>
            <Outlet />
          </main>
        </Box>
      </Box>
    </Box>
  );
}
