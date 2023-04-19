import { prisma } from "~/db.server";
import type { EmailType } from "./types";

// TODO: Replace this with a real email service
export function sendMail(email: EmailType) {
  return prisma.fakeEmail.create({
    data: email,
  });
}
