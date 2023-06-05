import { Box, Typography } from "@mui/material";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
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

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  if (!user) {
    return json({
      error: "No user found",
      organizationName: null,
    });
  }

  if (!user.emailVerifiedAt) {
    // first ensure the user has been verified before assigning them to the organization
    return json({ error: null, organizationName: null });
  }

  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("inviteToken");
    if (!token) {
      return json({
        error:
          "No valid invitation token found. Please reach out to organization administrator to request a new invitation.",
        organizationName: null,
      });
    }
    const invitationToken = await validateInvitationToken(token, user.email);
    if (!invitationToken) {
      return json({
        error:
          "No valid invitation token found for this email. Please reach out to organization administrator to request a new invitation.",
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
