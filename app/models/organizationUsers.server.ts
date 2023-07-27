import type { OrganizationUsers } from "@prisma/client";
import { prisma } from "~/db.server";

import { parseFilterParam } from "~/utils/parseFilterParam";
import { parseSortParam } from "~/utils/parseSortParam";

export type { OrganizationUsers } from "@prisma/client";

type PermissionFields = Pick<
  OrganizationUsers,
  | "subscriptionView"
  | "subscriptionEdit"
  | "subscriptionCreate"
  | "orgUsersView"
  | "orgUsersEdit"
  | "orgUsersCreate"
>;

type Permissions = Record<keyof PermissionFields, boolean>;

export type OrganizationMember = {
  name: string;
  email: string;
  accountStatus: string;
  role: string;
  id: string;
  owner: boolean;
};

export enum OrganizationRole {
  "OWNER" = "Owner",
  "MEMBER" = "Member",
}

export enum AccountStatus {
  "ACTIVE" = "Active",
  "DELETED" = "Deleted",
}

export async function createOrganizationUser({
  userId,
  organizationId,
  permissions,
  owner,
  accountStatus = AccountStatus.ACTIVE,
}: {
  userId: string;
  organizationId: string;
  permissions: Permissions;
  owner: boolean;
  accountStatus: string;
}) {
  return await prisma.organizationUsers.create({
    data: {
      userId,
      organizationId,
      ...permissions,
      owner,
      accountStatus,
      role: owner ? OrganizationRole.OWNER : OrganizationRole.MEMBER,
    },
  });
}
const SortableOrgUserEntries = ["accountStatus", "name", "email"];

export async function retrieveUsersOfOrganization(
  organizationId: string,
  searchParams: URLSearchParams
): Promise<{ orgUsers: OrganizationMember[]; totalOrgUsers: number }> {
  const page = parseInt(searchParams.get("page") || "");
  const perPage = parseInt(searchParams.get("perPage") || "10");
  const skip = page > 1 ? perPage * (page - 1) : 0;
  const take = perPage || 10;

  const { _searchString } = parseFilterParam(searchParams.get("filter"));

  const sort = parseSortParam(searchParams.get("sort")) || {};

  let orderBy: Record<string, "asc" | "desc" | Record<string, "asc" | "desc">>;

  // Manage sorting that could occur on OrganizationUser record or User Record
  if (!SortableOrgUserEntries.includes(Object.keys(sort)[0])) {
    orderBy = {};
  } else if ("accountStatus" in sort) {
    orderBy = {
      accountStatus: sort.accountStatus,
    };
  } else {
    const sortEntries = Object.entries(sort);
    orderBy = {
      user: {
        [sortEntries[0][0] === "name" ? "firstName" : sortEntries[0][0]]:
          sortEntries[0][1],
      },
    };
  }

  const orgUsers = await prisma.organizationUsers.findMany({
    skip,
    take,
    orderBy,
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    where: {
      organizationId,
      user: {
        OR: [
          {
            firstName: {
              startsWith: _searchString || "",
              mode: "insensitive",
            },
          },
          {
            lastName: {
              startsWith: _searchString || "",
              mode: "insensitive",
            },
          },
          {
            email: {
              startsWith: _searchString || "",
              mode: "insensitive",
            },
          },
        ],
      },
      NOT: {
        accountStatus: {
          contains: AccountStatus.DELETED,
        },
      },
    },
  });

  // return count of all active orgusers in an organization
  const totalOrgUsers = await prisma.organizationUsers.count({
    where: {
      organizationId,
      NOT: {
        accountStatus: {
          contains: AccountStatus.DELETED,
        },
      },
    },
  });

  return {
    orgUsers: orgUsers.map((user) => {
      return {
        name: `${user.user.firstName || user.user.email.split("@")[0]} ${
          user.user.lastName || user.user.email.split("@")[1]
        }`,
        email: user.user.email,
        accountStatus: user.accountStatus,
        id: user.id,
        role: user.role,
        owner: user.owner,
      };
    }),
    totalOrgUsers,
  };
}

export async function retrieveOrgUserOwner({ userId }: { userId: string }) {
  return await prisma.organizationUsers.findFirst({
    where: {
      owner: true,
      userId,
      NOT: {
        accountStatus: {
          contains: AccountStatus.DELETED,
        },
      },
    },
  });
}

export async function retrieveActiveOrganizationUser({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) {
  try {
    const orgUser = await prisma.organizationUsers.findFirst({
      where: {
        userId,
        organizationId,
        NOT: { accountStatus: { contains: AccountStatus.DELETED } },
      },
    });

    return orgUser;
  } catch (e) {
    return null;
  }
}

export async function retrieveOrganizationUser({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) {
  try {
    const orgUser = await prisma.organizationUsers.findFirst({
      where: {
        userId,
        organizationId,
      },
    });

    return orgUser;
  } catch (e) {
    return null;
  }
}

export async function countOrganizationUserInstances(userId: string) {
  const count = await prisma.organizationUsers.count({
    where: {
      userId,
      NOT: {
        accountStatus: {
          contains: AccountStatus.DELETED,
        },
      },
    },
  });
  return count || 0;
}

export async function deleteOrganizationUsersById(orgUserId: string[]) {
  return await prisma.$transaction([
    ...orgUserId.map((orgUser) =>
      prisma.organizationUsers.update({
        where: { id: orgUser },
        data: {
          accountStatus: AccountStatus.DELETED,
        },
      })
    ),
  ]);
}

export async function addOrganizationUser(
  userId: string,
  organizationId: string
) {
  const orgUser = await createOrganizationUser({
    userId,
    accountStatus: AccountStatus.ACTIVE,
    organizationId,
    permissions: {
      subscriptionView: true,
      subscriptionEdit: true,
      subscriptionCreate: true,
      orgUsersView: true,
      orgUsersEdit: true,
      orgUsersCreate: true,
    },
    owner: false,
  });
  return orgUser;
}

export function getOrgUserPermissions(
  orgUser: OrganizationUsers | null
): Array<keyof Permissions> {
  if (!orgUser) {
    return [];
  }

  let permissions: Array<keyof Permissions> = [];
  if (orgUser.subscriptionView) permissions.push("subscriptionView");
  if (orgUser.subscriptionEdit) permissions.push("subscriptionEdit");
  if (orgUser.subscriptionCreate) permissions.push("subscriptionCreate");
  if (orgUser.orgUsersView) permissions.push("orgUsersView");
  if (orgUser.orgUsersEdit) permissions.push("orgUsersEdit");
  if (orgUser.orgUsersCreate) permissions.push("orgUsersCreate");

  return permissions;
}

export async function reactivateOrgUserAccount(orgUserId: string) {
  return await prisma.organizationUsers.update({
    where: {
      id: orgUserId,
    },
    data: {
      accountStatus: AccountStatus.ACTIVE,
    },
  });
}
