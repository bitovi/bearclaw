/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `activeUntil` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `active` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL,
    "subscriptionLevel" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("id", "organizationId", "subscriptionLevel") SELECT "id", "organizationId", "subscriptionLevel" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE UNIQUE INDEX "Subscription_id_key" ON "Subscription"("id");
CREATE UNIQUE INDEX "Subscription_organizationId_key" ON "Subscription"("organizationId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
