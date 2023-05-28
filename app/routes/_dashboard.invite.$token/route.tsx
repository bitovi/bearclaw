import { Box, Typography } from "@mui/material";
import { LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  destroyInviteToken,
  validateInvitiationToken,
} from "~/models/invitationToken.server";
import { getOrganizationById } from "~/models/organization.server";
import {
  createOrganizationUser,
  retrieveOrganizationUser,
} from "~/models/organizationUsers.server";
import { getUser } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await getUser(request);
  if (!user?.emailVerifiedAt) {
    // first ensure the user has been verified before assigning them to the organization
    return json({ error: null, organizationName: null });
  }
  try {
    const { token } = params;
    if (!token) {
      return json({
        error:
          "No invitation token found. Please reach out to organization administrator to request a new invitation.",
        organizationName: null,
      });
    }
    const invitationToken = await validateInvitiationToken(token);
    if (!invitationToken) {
      return redirect("/");
    }
    const user = await getUser(request);
    if (!user) {
      return json({
        error: "No user found",
        organizationName: null,
      });
    }
    if (invitationToken.guestEmail !== user.email) {
      return json({
        error:
          "User email does not match email attached to the invitation token.",
        organizationName: null,
      });
    }
    const org = await getOrganizationById(invitationToken.organizationId);
    if (!org) {
      return json({
        error: "No organization found to join",
        organizationName: null,
      });
    }

    const existingOrgUser = await retrieveOrganizationUser({
      organizationId: org.id,
      userId: user.id,
    });

    if (existingOrgUser) {
      await destroyInviteToken(invitationToken.id);
      return redirect("/");
    }

    await createOrganizationUser({
      userId: user.id,
      organizationId: invitationToken.organizationId,
      owner: false,
      accountStatus: "Active",
      permissions: {
        subscriptionCreate: false,
        subscriptionEdit: false,
        subscriptionView: false,
        orgUsersCreate: false,
        orgUsersEdit: false,
        orgUsersView: true,
      },
    });

    await destroyInviteToken(invitationToken.id);

    return json({
      error: null,
      organizationName: org.name,
    });
  } catch (e) {
    return json({
      error: (e as Error).message,
      organizationName: null,
    });
  }
}

export default function Route() {
  const { error, organizationName } = useLoaderData<typeof loader>();
  if (error) {
    return (
      <Box textAlign={"center"}>
        <Typography variant={"h6"} color="red">
          {error}
        </Typography>
      </Box>
    );
  }
  return (
    <Box textAlign={"center"}>
      <Typography variant={"h6"} color="success">
        You have successfully joined {organizationName}!
      </Typography>
    </Box>
  );
}
