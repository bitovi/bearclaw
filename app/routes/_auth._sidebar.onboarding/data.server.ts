import type { User } from "@prisma/client";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import type { OnboardingData } from "./types";
import { getOwnerOrganization } from "~/models/organization.server";
import { retrieveOrganizationUser } from "~/models/organizationUsers.server";

function textToRange(text: string) {
  const [min, max] = text.split("_").map((n) => parseInt(n) || undefined);
  return { min, max };
}

export async function onboardUser(user: User, data: Partial<OnboardingData>) {
  const organization = await getOwnerOrganization({ userId: user.id });
  invariant(organization, "User must have an organization to update");

  const organizationUser = await retrieveOrganizationUser({
    userId: user.id,
    organizationId: organization.id,
  });
  invariant(organizationUser, "User must have an organization to update");

  const userData = {
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    phone: data.phone || undefined,
    emailSecondary: data.emailSecondary || undefined,
  };

  const organizationData = {
    name: data.companyName || undefined,
  };

  const { min: experienceMin, max: experienceMax } = textToRange(
    data.levelOfExperience || ""
  );
  const { min: teamSizeMin, max: teamSizeMax } = textToRange(
    data.teamSize || ""
  );

  const organizationUserData = {
    role: data.role || undefined,
    experienceMin,
    experienceMax,
    teamSizeMin,
    teamSizeMax,
  };

  return prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { ...userData },
    }),
    prisma.organization.update({
      where: { id: organization.id },
      data: { ...organizationData },
    }),
    prisma.organizationUsers.update({
      where: { id: organizationUser.id },
      data: { ...organizationUserData },
    }),
  ]);
}
