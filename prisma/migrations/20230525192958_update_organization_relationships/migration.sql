/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `personal` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `owner` to the `OrganizationUsers` table without a default value. This is not possible if the table is not empty.

*/
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
    "owner" BOOLEAN NOT NULL,
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
INSERT INTO "new_OrganizationUsers" ("experienceMax", "experienceMin", "id", "orgUsersCreate", "orgUsersEdit", "orgUsersView", "organizationId", "role", "subscriptionCreate", "subscriptionEdit", "subscriptionView", "teamSizeMax", "teamSizeMin", "userId") SELECT "experienceMax", "experienceMin", "id", "orgUsersCreate", "orgUsersEdit", "orgUsersView", "organizationId", "role", "subscriptionCreate", "subscriptionEdit", "subscriptionView", "teamSizeMax", "teamSizeMin", "userId" FROM "OrganizationUsers";
DROP TABLE "OrganizationUsers";
ALTER TABLE "new_OrganizationUsers" RENAME TO "OrganizationUsers";
CREATE INDEX "OrganizationUsers_userId_organizationId_idx" ON "OrganizationUsers"("userId", "organizationId");
CREATE TABLE "new_Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "paymentAccountId" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_Organization" ("email", "id", "name", "paymentAccountId") SELECT "email", "id", "name", "paymentAccountId" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
