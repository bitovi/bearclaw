-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InvitationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestEmail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "InvitationToken_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InvitationToken" ("createdAt", "expiresAt", "guestEmail", "id", "organizationId") SELECT "createdAt", "expiresAt", "guestEmail", "id", "organizationId" FROM "InvitationToken";
DROP TABLE "InvitationToken";
ALTER TABLE "new_InvitationToken" RENAME TO "InvitationToken";
CREATE UNIQUE INDEX "InvitationToken_guestEmail_organizationId_key" ON "InvitationToken"("guestEmail", "organizationId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
