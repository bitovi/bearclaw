import { Box } from "@mui/material";
import { ActionArgs, json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { UserTable } from "./components/userTable";
import { getOrgId, getUser } from "~/session.server";
import {
  addOrganizationUser,
  deleteOrganizationUserById,
  retrieveOrganizationUser,
  retrieveUsersOfOrganization,
} from "~/models/organizationUsers.server";
import { useLoaderData, useSubmit } from "@remix-run/react";
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
      id: "sadfaklsjhdlaslk;fa",
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

export async function action({ request }: ActionArgs) {
  // TODO -- double check CRUD permissions here?
  switch (request.method) {
    case "POST":
      // const formData = await request.formData();
      // const userIds = formData.get("userIds");
      // if (!userIds) return json({});

      // const userIdsArray = JSON.parse(userIds.toString());
      // const userId = ["cli7n4onr0000vtqp3co6yo0g"];
      const orgId = await getOrgId(request);
      if (!orgId) return json({});
      await addOrganizationUser("cli7n4onr0000vtqp3co6yo0g", orgId);
      return json({});
    case "DELETE":
      // const formData = await request.formData();
      // const userIds = formData.get("userIds");
      // if (!userIds) return json({});

      // const userIdsArray: string[] = JSON.parse(userIds.toString());
      // const result = await deleteOrganizationUserById(userIdsArray);
      // console.log("result", result);
      return json({});
  }
}

export default function Route() {
  const { permissions, error, users } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const deleteUser = useCallback((userIds: readonly string[]) => {
    const formData = new FormData();
    formData.append("userIds", JSON.stringify(userIds));

    return submit(formData, { method: "delete" });
  }, []);

  const createUser = useCallback(
    (userIds: readonly string[]) => {
      const formData = new FormData();
      formData.append("userIds", JSON.stringify(userIds));

      return submit(formData, { method: "post" });
    },
    [submit]
  );

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
