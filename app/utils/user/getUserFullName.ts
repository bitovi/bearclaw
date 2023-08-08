import type { User } from "@prisma/client";

export function getUserFullName(
  user: Pick<User, "firstName" | "lastName">
): string {
  return [user.firstName, user.lastName].join(" ").trim();
}
