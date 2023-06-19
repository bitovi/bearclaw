import { Box, Typography } from "@mui/material";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { UserTable } from "./components/userTable";
import { getOrgId, getUserId } from "~/session.server";
import {
  deleteOrganizationUsersById,
  retrieveOrganizationUser,
  retrieveUsersOfOrganization,
} from "~/models/organizationUsers.server";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { AddUserModal } from "./components/addUserModal";
import { inviteUser } from "~/models/invitationToken.server";
import { Banner } from "~/components/banner";

export async function loader({ request }: LoaderArgs) {
  try {
    const userId = await getUserId(request);
    const organizationId = await getOrgId(request);

    if (!userId || !organizationId) {
      return redirect("/");
    }

    const orgUser = await retrieveOrganizationUser({
      organizationId,
      userId,
    });

    if (!orgUser) {
      return redirect("/");
    }
    if (!orgUser.orgUsersView) {
      // if user does not have appropriate view privileges, redirect
      return redirect("/");
    }
    const urlParams = new URL(request.url).searchParams;

    const { orgUsers, totalOrgUsers } = await retrieveUsersOfOrganization(
      organizationId,
      urlParams
    );

    return json({
      permissions: {
        viewUsers: orgUser.orgUsersView,
        editUsers: orgUser.orgUsersEdit,
        deleteUsers: orgUser.orgUsersCreate,
        createUsers: orgUser.orgUsersCreate,
      },
      users: orgUsers,
      totalUsers: totalOrgUsers,
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
      totalUsers: null,
      error: (e as Error).message,
    });
  }
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const organizationId = await getOrgId(request);
  const userId = await getUserId(request);

  if (!organizationId || !userId) {
    return json({
      error:
        "No organization ID or user ID found. Try signing back in and repeating this operation.",
      key: null,
      result: null,
    });
  }

  const orgUser = await retrieveOrganizationUser({ organizationId, userId });

  if (!orgUser) {
    return json({
      error: "Cannot validate permissions to read/write organization users.",
      key: null,
      result: null,
    });
  }
  switch (request.method) {
    case "POST":
      if (!orgUser?.orgUsersCreate) {
        return json({
          error:
            "User does not have permissions to invite users to this organization",
          key: null,
          result: null,
        });
      }
      const inviteEmail = formData.get("inviteEmail");
      if (!inviteEmail) {
        return json({
          error:
            "Must provide an email in order to invite a user to your organziation",
          key: null,
          result: null,
        });
      }
      const stringEmail = inviteEmail.toString();
      const orgId = await getOrgId(request);
      if (!orgId)
        return json({
          error: "No organization ID found",
          key: null,
          result: null,
        });
      await inviteUser(stringEmail, orgId);
      return json({
        error: null,
        key: "USER_INVITED",
        result: `Invitation successfully sent to ${stringEmail}`,
      });
    case "DELETE":
      if (!orgUser?.orgUsersCreate) {
        return json({
          error:
            "User does not have permissions to remove users from this organization",
          key: null,
          result: null,
        });
      }
      const userIds = formData.get("userIds");
      if (!userIds) return json({ error: null, key: null, result: null });

      const userIdsArray: string[] = JSON.parse(userIds.toString());
      const result = await deleteOrganizationUsersById(userIdsArray);

      return json({
        error: null,
        key: "USER_DELETED",
        result: result.length > 1 ? "Users deleted" : "User deleted",
      });
    default:
      return json({
        error: null,
        key: null,
        result: null,
      });
  }
}

export default function Route() {
  const [modalOpen, setModalOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const {
    permissions,
    error: loaderError,
    users,
    totalUsers,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
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

  useEffect(() => {
    if (actionData?.key) {
      setBannerOpen(true);
      setModalOpen(false);
    }
  }, [actionData]);

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
        totalUsers={totalUsers}
        handleAddUser={toggleAddUserModal}
        handleRemoveUser={permissions.deleteUsers ? deleteUser : undefined}
      />
      <AddUserModal open={modalOpen} onClose={toggleAddUserModal} />

      {/* TODO: Consider global context notification management */}
      <Banner
        container={{
          open: bannerOpen,
          autoHideDuration: 5000,
          onClose: () => {
            setBannerOpen(false);
          },
        }}
        alert={{ severity: "success" }}
        content={actionData?.result || ""}
      />
    </Box>
  );
}
