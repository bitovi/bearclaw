/*
  Warnings:

  - You are about to drop the column `organizationId` on the `InvitationToken` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InvitationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestEmail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);
INSERT INTO "new_InvitationToken" ("createdAt", "expiresAt", "guestEmail", "id") SELECT "createdAt", "expiresAt", "guestEmail", "id" FROM "InvitationToken";
DROP TABLE "InvitationToken";
ALTER TABLE "new_InvitationToken" RENAME TO "InvitationToken";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
