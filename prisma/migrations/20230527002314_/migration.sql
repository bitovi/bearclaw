-- RedefineTables
PRAGMA foreign_keys=OFF;
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
