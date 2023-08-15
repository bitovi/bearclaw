import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { retrieveActiveOrganizationUser } from "~/models/organizationUsers.server";
import {
  changeUserOrganizationSession,
  getOrgandUserId,
} from "~/session.server";
import Box from "@mui/material/Box";

export async function loader({ request, params }: LoaderArgs) {
  const url = request.url;
  const { organization: organizationIdParam } = params;
  const { userId, organizationId } = await getOrgandUserId(request);

  if (!organizationIdParam || !userId) {
    throw new Response("Not Found", { status: 404 });
  }

  if (organizationIdParam !== organizationId) {
    const otherOrgUser = await retrieveActiveOrganizationUser({
      organizationId: organizationIdParam,
      userId: userId,
    });
    if (!otherOrgUser) throw new Response("Not Found", { status: 404 });
    const redirect = await changeUserOrganizationSession({
      request,
      organizationId: organizationIdParam,
      redirectTo: url,
    });
    return redirect;
  }

  const orgUser = await retrieveActiveOrganizationUser({
    organizationId,
    userId: userId,
  });

  if (!orgUser) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({});
}

export function shouldRevalidate() {
  return true;
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <Stack width="100%" height="100%" alignItems="center">
        <Box paddingTop={4} textAlign="center">
          <Typography variant="h4">Oops!</Typography>
          <Typography variant="body1">Something went wrong</Typography>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack width="100%" height="100%" alignItems="center">
      <Box paddingTop={4} textAlign="center">
        <Typography variant="h4">Oops!</Typography>
        <Typography variant="body1">Something went wrong</Typography>
      </Box>
    </Stack>
  );
}

export default function Route() {
  return <Outlet />;
}
