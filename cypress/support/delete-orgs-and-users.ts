// Use this to wipe organizations and users as well as fakeMail entries

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { installGlobals } from "@remix-run/node";

import { prisma } from "~/db.server";

installGlobals();

async function deleteOrgAndUsers() {
  try {
    await prisma.organization.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.fakeEmail.deleteMany({});
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log("Organization not found, so no need to delete");
    } else {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

deleteOrgAndUsers();
