import type { OrganizationUser } from "@prisma/client";
import { prisma } from "~/db.server";

export type { OrganizationUser } from "@prisma/client";

type PermissionFields = Pick<
  OrganizationUser,
  | "subscriptionView"
  | "subscriptionEdit"
  | "subscriptionCreate"
  | "orgUsersView"
  | "orgUsersEdit"
  | "orgUsersCreate"
>;

type Permissions = Record<keyof PermissionFields, boolean>;

export async function createOrganizationUser({
  userId,
  organizationId,
  permissions,
}: {
  userId: string;
  organizationId: string;
  permissions: Permissions;
}) {
  const orgUser = await prisma.organizationUser.create({
    data: {
      userId,
      organizationId,
      ...permissions,
    },
  });

  return orgUser;
}

export async function retrieveOrganizationUser({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) {
  const orgUser = await prisma.organizationUser.findFirst({
    where: { userId, organizationId },
  });

  return orgUser;
}

export async function countOrganizationUserInstances(userId: string) {
  const count = await prisma.organizationUser.count({
    where: {
      userId,
    },
  });
  return count || 0;
}
