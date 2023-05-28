import { Box, Typography } from "@mui/material";
import { ActionArgs, json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { UserTable } from "./components/userTable";
import { getOrgId, getUser } from "~/session.server";
import {
  deleteOrganizationUserById,
  retrieveOrganizationUser,
  retrieveUsersOfOrganization,
} from "~/models/organizationUsers.server";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useCallback, useRef, useState } from "react";
import { AddUserModal } from "./components/addUserModal";
import { inviteUser } from "~/models/invitationToken.server";

export async function loader({ request }: LoaderArgs) {
  try {
    const user = await getUser(request);
    const organizationId = await getOrgId(request);

    if (!user || !organizationId) {
      return redirect("/");
    }

    const orgUser = await retrieveOrganizationUser({
      organizationId,
      userId: user.id,
    });

    if (!orgUser) {
      return redirect("/");
    }

    const users = await retrieveUsersOfOrganization({ organizationId });

    if (!orgUser.orgUsersView) {
      // if user does not have appropriate view privileges, redirect
      return redirect("/");
    }
    return json({
      permissions: {
        viewUsers: orgUser.orgUsersView,
        editUsers: orgUser.orgUsersEdit,
        deleteUsers: orgUser.orgUsersCreate,
        createUsers: orgUser.orgUsersCreate,
      },
      users,
      error: null,
    });
  } catch (e) {
    return json({
      permissions: {
        viewUsers: null,
        editUsers: null,
        deleteUsers: null,
        createUsers: null,
      },
      users: [],
      error: (e as Error).message,
    });
  }
}

export async function action({ request }: ActionArgs) {
  // TODO -- double check CRUD permissions here?
  const formData = await request.formData();

  switch (request.method) {
    case "POST":
      const inviteEmail = formData.get("inviteEmail");
      if (!inviteEmail) {
        return json({
          error:
            "Must provide an email in order to invite a user to your organziation",
        });
      }
      const orgId = await getOrgId(request);
      if (!orgId) return json({ error: "No organization ID found" });
      await inviteUser(inviteEmail.toString(), orgId);
      return json({ error: null });
    case "DELETE":
      const userIds = formData.get("userIds");
      if (!userIds) return json({ error: null });

      const userIdsArray: string[] = JSON.parse(userIds.toString());
      const result = await deleteOrganizationUserById(userIdsArray);
      return json({ error: null });
    default:
      return json({
        error: null,
      });
  }
}

export default function Route() {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    permissions,
    error: loaderError,
    users,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const inputRef = useRef<HTMLInputElement>(null);
  const submit = useSubmit();

  const deleteUser = useCallback(
    (userIds: readonly string[]) => {
      const formData = new FormData();
      formData.append("userIds", JSON.stringify(userIds));

      return submit(formData, { method: "delete" });
    },
    [submit]
  );

  const toggleAddUserModal = useCallback(() => {
    setModalOpen((modalOpen) => !modalOpen);
  }, []);

  if (loaderError) {
    return <Box textAlign="center">{loaderError}</Box>;
  }

  return (
    <Box>
      {actionData?.error && (
        <Box textAlign={"center"}>
          <Typography variant="h6" color="error">
            {actionData.error}
          </Typography>
        </Box>
      )}
      <UserTable
        users={users}
        handleAddUser={toggleAddUserModal}
        handleRemoveUser={permissions.deleteUsers ? deleteUser : undefined}
      />
      <AddUserModal open={modalOpen} onClose={toggleAddUserModal} />
    </Box>
  );
}
