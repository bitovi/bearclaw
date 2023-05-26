/*
  Warnings:

  - A unique constraint covering the columns `[guestEmail,organizationId]` on the table `InvitationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "InvitationToken_guestEmail_key";

-- CreateIndex
CREATE UNIQUE INDEX "InvitationToken_guestEmail_organizationId_key" ON "InvitationToken"("guestEmail", "organizationId");
