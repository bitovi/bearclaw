/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `personal` on the `Organization` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "InvitationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestEmail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "InvitationToken_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "paymentAccountId" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_Organization" ("email", "id", "name", "paymentAccountId") SELECT "email", "id", "name", "paymentAccountId" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
CREATE TABLE "new_OrganizationUsers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionView" BOOLEAN NOT NULL,
    "subscriptionEdit" BOOLEAN NOT NULL,
    "subscriptionCreate" BOOLEAN NOT NULL,
    "orgUsersView" BOOLEAN NOT NULL,
    "orgUsersEdit" BOOLEAN NOT NULL,
    "orgUsersCreate" BOOLEAN NOT NULL,
    "owner" BOOLEAN NOT NULL DEFAULT true,
    "accountStatus" TEXT,
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
CREATE UNIQUE INDEX "OrganizationUsers_userId_organizationId_key" ON "OrganizationUsers"("userId", "organizationId");
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL,
    "subscriptionLevel" TEXT NOT NULL,
    "activeStatus" TEXT NOT NULL,
    "activeUntil" INTEGER,
    "cancellationDate" INTEGER,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("activeStatus", "activeUntil", "cancellationDate", "id", "organizationId", "subscriptionLevel") SELECT "activeStatus", "activeUntil", "cancellationDate", "id", "organizationId", "subscriptionLevel" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE UNIQUE INDEX "Subscription_id_key" ON "Subscription"("id");
CREATE UNIQUE INDEX "Subscription_organizationId_key" ON "Subscription"("organizationId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "InvitationToken_guestEmail_organizationId_key" ON "InvitationToken"("guestEmail", "organizationId");
