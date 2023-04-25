// This is a list of emails stored in our dummy email service
// This probably won't exist in the final app
// TODO: Replace this with a real email service

import { prisma } from "~/db.server";
import type { FakeEmail } from "@prisma/client";

export async function listMail(): Promise<Array<FakeEmail>> {
  return await prisma.fakeEmail.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
