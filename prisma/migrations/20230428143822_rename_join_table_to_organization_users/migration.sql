/*
  Warnings:

  - You are about to drop the `BusinessUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BusinessUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "OrganizationUsers" (
    "subscriptionView" BOOLEAN NOT NULL,
    "subscriptionEdit" BOOLEAN NOT NULL,
    "subscriptionCreate" BOOLEAN NOT NULL,
    "orgUsersView" BOOLEAN NOT NULL,
    "orgUsersEdit" BOOLEAN NOT NULL,
    "orgUsersCreate" BOOLEAN NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "OrganizationUsers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrganizationUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUsers_userId_key" ON "OrganizationUsers"("userId");
