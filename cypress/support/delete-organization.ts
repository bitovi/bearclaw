// Use this to delete an organization by its email
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/delete-organization.ts username@example.com
// and that organization will get deleted

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { installGlobals } from "@remix-run/node";

import { prisma } from "~/db.server";

installGlobals();

async function deleteOrganization(email: string) {
  console.log("IN THE SCRIPT!!!!!");
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("-test@bigbear.ai")) {
    throw new Error("All test emails must end in @bigbear.ai");
  }

  try {
    await prisma.organization.deleteMany({
      where: { email },
    });
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

deleteOrganization(process.argv[2]);
