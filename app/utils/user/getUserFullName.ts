import type { User } from "@prisma/client";

export function getUserFullName(user: User) {
  if (user.firstName || user.lastName) {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }
  return "";
}
