import type { User } from "@prisma/client";

export function getUserFullName(user: User) {
  return `${user.firstName} ${user.lastName}`.trim();
}
