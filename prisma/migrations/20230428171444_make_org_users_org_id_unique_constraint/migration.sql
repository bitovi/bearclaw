/*
  Warnings:

  - A unique constraint covering the columns `[organizationId]` on the table `OrganizationUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUsers_organizationId_key" ON "OrganizationUsers"("organizationId");
