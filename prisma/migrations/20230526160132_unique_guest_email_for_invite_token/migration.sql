/*
  Warnings:

  - A unique constraint covering the columns `[guestEmail]` on the table `InvitationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InvitationToken_guestEmail_key" ON "InvitationToken"("guestEmail");
