import { prisma } from "~/db.server";
import { createOrganizationUser } from "./organizationUsers.server";
import { createPaymentVendorCustomer } from "~/payment.server";

export type { Organization } from "@prisma/client";

export async function getOrganizationsByUserId(userId: string) {
  // for purposes of MVP, only returning 'findFirst'
  const userOrg = await prisma.organization.findFirst({
    where: { organizationUser: { every: { userId: { equals: userId } } } },
  });

  return userOrg;
}

export async function getOrganizationById(organizationId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  return org;
}

export async function countOrganizationAssociations(userId: string) {
  const userOrgsCount = await prisma.organization.count({
    where: { organizationUser: { every: { userId: { equals: userId } } } },
  });

  return userOrgsCount;
}

export async function createOrganization({
  userId,
  name,
  email,
  personal = false,
}: {
  userId: string;
  name: string;
  email: string;
  personal?: boolean;
}) {
  try {
    // A constraint to prevent a User from being associated with more than 1 organization
    const userOrgCount = await countOrganizationAssociations(userId);
    if (userOrgCount > 1) {
      throw new Error("User already belongs to an organization.");
    }

    // // Onboarding a new user: create a vendor payment account and a new organization tagged with that payment account id
    const paymentAccount = await createPaymentVendorCustomer({ email });

    const organization = await prisma.organization.create({
      data: {
        paymentAccountId: paymentAccount.id,
        personal,
        name,
        email,
        ownerId: userId,
      },
    });

    await createOrganizationUser({
      userId,
      organizationId: organization.id,
      permissions: {
        subscriptionCreate: true,
        subscriptionEdit: true,
        subscriptionView: true,
        orgUsersCreate: true,
        orgUsersEdit: true,
        orgUsersView: true,
      },
    });
    return { organization, error: undefined };
    // //
  } catch (e) {
    console.error("Error occurred creating an organization: ", e);
    return {
      organization: null,
      error: (e as Error).message,
    };
  }
}

export async function updateOrganizationPaymentAccount(
  id: string,
  paymentAccountId: string
) {
  const updatedOrg = await prisma.organization.update({
    where: { id },
    data: { paymentAccountId },
  });

  return updatedOrg;
}
