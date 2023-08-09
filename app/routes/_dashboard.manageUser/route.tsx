import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { UserTable } from "./components/userTable";
import { getOrgId, getUserId, logout } from "~/session.server";
import {
  deleteOrganizationUsersById,
  retrieveActiveOrganizationUser,
  retrieveUsersOfOrganization,
} from "~/models/organizationUsers.server";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ManageUserModal } from "./components/manageUserModal";
import { inviteUser } from "~/models/invitationToken.server";
import { Banner } from "~/components/banner";
import { Page, PageHeader } from "../_dashboard/components/page";
import Stack from "@mui/material/Stack";
import { TextInput } from "~/components/input";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "~/components/button";
import { useFiltering } from "~/hooks/useFiltering";
import { usePageCopy } from "../_dashboard/copy";

export async function loader({ request }: LoaderArgs) {
  try {
    const userId = await getUserId(request);
    const organizationId = await getOrgId(request);

    if (!userId || !organizationId) {
      throw logout(request);
    }

    const orgUser = await retrieveActiveOrganizationUser({
      organizationId,
      userId,
    });

    if (!orgUser) {
      return redirect("/dashboard");
    }
    if (!orgUser.orgUsersView) {
      // if user does not have appropriate view privileges, redirect
      return redirect("/dashboard");
    }
    const urlParams = new URL(request.url).searchParams;

    const { orgUsers, totalOrgUsers } = await retrieveUsersOfOrganization(
      organizationId,
      urlParams
    );

    return json({
      users: orgUsers,
      totalUsers: totalOrgUsers,
      error: null,
    });
  } catch (e) {
    return json({
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

  const orgUser = await retrieveActiveOrganizationUser({
    organizationId,
    userId,
  });

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
  const copy = usePageCopy("userManagement");
  const [bannerOpen, setBannerOpen] = useState(false);
  const [formMethod, setFormMethod] = useState<"post" | "delete" | undefined>();
  const {
    error: loaderError,
    users,
    totalUsers,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [selected, setSelected] = useState<string[]>([]);
  const { searchString, debounceFilterQuery } = useFiltering();

  useEffect(() => {
    if (actionData?.key) {
      setBannerOpen(true);
      setFormMethod(undefined);
    }
  }, [actionData]);

  if (loaderError) {
    return <Box textAlign="center">{loaderError}</Box>;
  }

  return (
    <Page>
      <PageHeader
        headline={copy?.title || "User Accounts"}
        description={
          copy?.headline ||
          "Efficiently manage team access by adding or removing users as needed."
        }
      >
        <Stack alignItems={{ xs: "center", lg: "unset" }} gap={2}>
          <Stack
            direction="row"
            gap={2}
            justifyContent={{ xs: "unset", lg: "flex-end" }}
          >
            <Button
              variant="mediumOutlined"
              onClick={() => setFormMethod("delete")}
              sx={{
                width: "115px",
                height: "36px",
                fontSize: "14px",
                border: !selected.length ? "transparent" : "1px solid #0037FF",
              }}
              disabled={!selected.length}
            >
              <Stack direction="row" gap={1} justifyContent="space-between">
                <DeleteTwoToneIcon /> {copy?.content?.removeCTA || "Remove"}
              </Stack>
            </Button>
            <Button
              type="button"
              onClick={() => setFormMethod("post")}
              variant="buttonLarge"
              sx={{ height: "36px", fontSize: "14px" }}
            >
              <Stack direction="row" gap={1} justifyContent="space-between">
                <PersonAddIcon /> {copy?.content?.addUserCTA || "Add User"}
              </Stack>
            </Button>
          </Stack>
          <TextInput
            sx={{
              color: "rgba(0, 0, 0, 0.23)",
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ marginRight: 1, color: "#000000" }} />
              ),
              sx: { height: "40px", width: "300px", borderRadius: "8px" },
            }}
            label={copy?.inputs?.search.label || "Search"}
            placeholder={copy?.inputs?.search.label || "Search users"}
            name={copy?.inputs?.search.label || "search"}
            onChange={({ target }) =>
              debounceFilterQuery({
                searchString: target.value,
              })
            }
            defaultValue={searchString}
          />
        </Stack>
      </PageHeader>
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
        selected={selected}
        setSelected={setSelected}
      />
      <ManageUserModal
        formMethod={formMethod}
        onClose={() => setFormMethod(undefined)}
        selectedUsers={selected}
        key={formMethod} // ensure the component state wipes via remount when the form submits
      />

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
    </Page>
  );
}
