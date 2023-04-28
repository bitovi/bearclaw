/*
  Warnings:

  - Added the required column `email` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "paymentAccountId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "personal" BOOLEAN NOT NULL,
    "ownerId" TEXT,
    CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Organization" ("id", "name", "paymentAccountId", "personal") SELECT "id", "name", "paymentAccountId", "personal" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
CREATE UNIQUE INDEX "Organization_ownerId_key" ON "Organization"("ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
