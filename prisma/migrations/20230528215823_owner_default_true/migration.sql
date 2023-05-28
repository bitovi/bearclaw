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
INSERT INTO "new_OrganizationUsers" ("accountStatus", "experienceMax", "experienceMin", "id", "orgUsersCreate", "orgUsersEdit", "orgUsersView", "organizationId", "owner", "role", "subscriptionCreate", "subscriptionEdit", "subscriptionView", "teamSizeMax", "teamSizeMin", "userId") SELECT "accountStatus", "experienceMax", "experienceMin", "id", "orgUsersCreate", "orgUsersEdit", "orgUsersView", "organizationId", "owner", "role", "subscriptionCreate", "subscriptionEdit", "subscriptionView", "teamSizeMax", "teamSizeMin", "userId" FROM "OrganizationUsers";
DROP TABLE "OrganizationUsers";
ALTER TABLE "new_OrganizationUsers" RENAME TO "OrganizationUsers";
CREATE INDEX "OrganizationUsers_userId_organizationId_idx" ON "OrganizationUsers"("userId", "organizationId");
CREATE UNIQUE INDEX "OrganizationUsers_userId_owner_key" ON "OrganizationUsers"("userId", "owner");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
