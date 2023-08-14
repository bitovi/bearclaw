import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { retrieveActiveOrganizationUser } from "~/models/organizationUsers.server";
import { getUserId } from "~/session.server";
import Box from "@mui/material/Box";

export async function loader({ request, params }: LoaderArgs) {
  const { organization: organizationId } = params;
  const userId = await getUserId(request);

  if (!organizationId || !userId) {
    throw new Response("Not Found", { status: 404 });
  }
  const orgUser = await retrieveActiveOrganizationUser({
    organizationId,
    userId: userId,
  });

  if (!orgUser) {
    return redirect("/dashboard");
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
