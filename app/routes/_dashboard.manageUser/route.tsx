import { Box } from "@mui/material";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { UserTable } from "./components/userTable";
import { getOrgId, getUser } from "~/session.server";
import {
  retrieveOrganizationUser,
  retrieveUsersOfOrganization,
} from "~/models/organizationUsers.server";
import { useLoaderData } from "@remix-run/react";
import { useCallback } from "react";

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
    users.push({
      name: "Test Person",
      email: "testperson@bitovi.com",
      accountStatus: "Active",
    });
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

export default function Route() {
  const { permissions, error, users } = useLoaderData<typeof loader>();

  const deleteUser = useCallback(() => {
    return Promise.resolve();
  }, []);

  const createUser = useCallback(() => {
    return Promise.resolve();
  }, []);

  if (error) {
    return <Box textAlign="center">{error}</Box>;
  }

  return (
    <Box>
      <UserTable
        users={users}
        handleAddUser={permissions.createUsers ? createUser : undefined}
        handleRemoveUser={permissions.deleteUsers ? deleteUser : undefined}
      />
    </Box>
  );
}
