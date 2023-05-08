/*
  Warnings:

  - The required column `id` was added to the `OrganizationUsers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailSecondary" TEXT;
ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
ALTER TABLE "User" ADD COLUMN "lastName" TEXT;
ALTER TABLE "User" ADD COLUMN "phone" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrganizationUsers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionView" BOOLEAN NOT NULL,
    "subscriptionEdit" BOOLEAN NOT NULL,
    "subscriptionCreate" BOOLEAN NOT NULL,
    "orgUsersView" BOOLEAN NOT NULL,
    "orgUsersEdit" BOOLEAN NOT NULL,
    "orgUsersCreate" BOOLEAN NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT,
    "experienceMin" INTEGER,
    "experienceMax" INTEGER,
    "teamSizeMin" INTEGER,
    "teamSizeMax" INTEGER,
    CONSTRAINT "OrganizationUsers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrganizationUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrganizationUsers" ("orgUsersCreate", "orgUsersEdit", "orgUsersView", "organizationId", "subscriptionCreate", "subscriptionEdit", "subscriptionView", "userId") SELECT "orgUsersCreate", "orgUsersEdit", "orgUsersView", "organizationId", "subscriptionCreate", "subscriptionEdit", "subscriptionView", "userId" FROM "OrganizationUsers";
DROP TABLE "OrganizationUsers";
ALTER TABLE "new_OrganizationUsers" RENAME TO "OrganizationUsers";
CREATE INDEX "OrganizationUsers_userId_organizationId_idx" ON "OrganizationUsers"("userId", "organizationId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
