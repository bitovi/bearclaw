/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `personal` on the `Organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,organizationId]` on the table `OrganizationUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_organizationId_fkey";

-- DropIndex
DROP INDEX "Organization_ownerId_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "ownerId",
DROP COLUMN "personal";

-- AlterTable
ALTER TABLE "OrganizationUsers" ADD COLUMN     "accountStatus" TEXT,
ADD COLUMN     "owner" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "InvitationToken" (
    "id" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "InvitationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvitationToken_guestEmail_organizationId_key" ON "InvitationToken"("guestEmail", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUsers_userId_organizationId_key" ON "OrganizationUsers"("userId", "organizationId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationToken" ADD CONSTRAINT "InvitationToken_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
