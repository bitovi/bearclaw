import { prisma } from "~/db.server";
import type { EmailType } from "./types";

// TODO: Replace this with a real email service
export async function sendMail(email: EmailType, fake = false) {
  if (fake) {
    return;
  }
  return prisma.fakeEmail.create({
    data: email,
  });
}
