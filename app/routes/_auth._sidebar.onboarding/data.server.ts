import type { User } from "@prisma/client";
import { prisma } from "~/db.server";
import type { OnboardingData } from "./types";

function textToRange(text: string) {
  const [min, max] = text.split("_").map((n) => parseInt(n) || undefined);
  return { min, max };
}

export function rangeToText(
  min: number | null | undefined,
  max: number | null | undefined
) {
  if (!min || !max) return "";
  return `${min}_${max}`;
}

export async function onboardUser(user: User, data: Partial<OnboardingData>) {
  const { min: experienceMin, max: experienceMax } = textToRange(
    data.levelOfExperience || ""
  );
  const { min: teamSizeMin, max: teamSizeMax } = textToRange(
    data.teamSize || ""
  );
  const userData = {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    emailSecondary: data.emailSecondary,
    companyName: data.companyName,
    role: data.role,
    experienceMin,
    experienceMax,
    teamSizeMin,
    teamSizeMax,
  };

  return await prisma.user.update({
    where: { id: user.id },
    data: { ...userData },
  });
}
