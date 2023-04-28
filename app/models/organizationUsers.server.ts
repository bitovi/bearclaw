import type { OrganizationUsers } from "@prisma/client";
import { prisma } from "~/db.server";

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

export async function createOrganizationUser({
  userId,
  organizationId,
  permissions,
}: {
  userId: string;
  organizationId: string;
  permissions: Permissions;
}) {
  const orgUser = await prisma.organizationUsers.create({
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
  const orgUser = await prisma.organizationUsers.findFirst({
    where: { userId, organizationId },
  });

  return orgUser;
}
