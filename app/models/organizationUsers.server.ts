import type { OrganizationUsers } from "@prisma/client";
import { prisma } from "~/db.server";
import { getUserById } from "./user.server";

import { faker } from "@faker-js/faker";

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
  accountStatus: string | null;
  id: string;
};

export async function createOrganizationUser({
  userId,
  organizationId,
  permissions,
  owner,
  accountStatus,
}: {
  userId: string;
  organizationId: string;
  permissions: Permissions;
  owner: boolean;
  accountStatus?: string;
}) {
  return await prisma.organizationUsers.create({
    data: {
      userId,
      organizationId,
      ...permissions,
      owner,
      accountStatus: owner ? undefined : accountStatus,
    },
  });
}

export async function retrieveUsersOfOrganization({
  organizationId,
}: {
  organizationId: string;
}): Promise<OrganizationMember[]> {
  const orgUsers = await prisma.organizationUsers.findMany({
    where: {
      organizationId,
    },
  });
  const users = await Promise.all(
    orgUsers
      // does not return the owner of the particular organization
      .filter((orgUser) => !orgUser.owner)
      .map(async (orgUser): Promise<OrganizationMember> => {
        const user = await getUserById(orgUser.userId);
        if (!user) {
          throw new Error("Organization member not found");
        }
        // TODO: REMOVE NAME FAKER ONCE ONBOARDING IS HOOKED UP TO ACCOUNT CREATION FLOW
        return {
          name: `${user.firstName || faker.name.firstName()} ${
            user.lastName || faker.name.lastName()
          }`,
          email: user.email,
          accountStatus: orgUser.accountStatus,
          id: orgUser.id,
        };
      })
  );

  return users;
}

export async function retrieveOrganizationUsersByUserId({
  userId,
}: {
  userId: string;
}) {
  return await prisma.organizationUsers.findMany({
    where: {
      userId,
    },
  });
}

export async function retrieveOrgUserOwner({ userId }: { userId: string }) {
  return await prisma.organizationUsers.findFirst({
    where: {
      owner: true,
      userId,
    },
  });
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
      where: { userId, organizationId },
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
    },
  });
  return count || 0;
}

export async function deleteOrganizationUsersById(orgUserId: string[]) {
  return await prisma.$transaction([
    ...orgUserId.map((orgUser) =>
      prisma.organizationUsers.delete({ where: { id: orgUser } })
    ),
  ]);
}

export async function addOrganizationUser(
  userId: string,
  organizationId: string
) {
  const lookUpUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!lookUpUser) return;
  const orgUser = await createOrganizationUser({
    userId: lookUpUser?.id,
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
