/*
  Warnings:

  - A unique constraint covering the columns `[userId,personal]` on the table `OrganizationUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Organization_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUsers_userId_personal_key" ON "OrganizationUsers"("userId", "personal");
